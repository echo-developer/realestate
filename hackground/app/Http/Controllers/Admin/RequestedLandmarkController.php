<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bus;
use App\Models\Education;
use App\Models\Hospital;
use App\Models\Metro;
use App\Models\Railway;
use App\Models\RequestedLandmarkModel;
use Illuminate\Http\Request;

class RequestedLandmarkController extends Controller
{
    public function index(Request $request)
    {

        $term = $request->input('term');

        $query =  RequestedLandmarkModel::query();

        $query->where('is_approved', config('constants.STATUS_INACTIVE'));

        if (!empty($term)) {
            $query->where('name', 'like', '%' . $term . '%');
        }

        $list = $query->paginate(10);
        return  view('Admin.Landmarks.requested_landmark', compact('list'));
    }

    public function getLandmarkForEdit(Request $request)
    {

        $id =  $request->route('id');
        if (!$id) {
            return response()->json([
                'status' => 0,
                'message' => 'ID is required'
            ], 400);
        }
        $data = RequestedLandmarkModel::where('id', $id)->first();

        if (!$data) {
            return response()->json([
                'status' => 0,
                'message' => 'Data not found'
            ], 404);
        }

        return response()->json($data);
    }
    public function approveLandmark(Request $request)
    {
        $validated = $request->validate([
            'type'      => 'required|in:healthcare,metro,rail,education,bus,others',
            'name'      => 'required|string|max:255',
            'distance'  => 'required|numeric|min:0',
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        RequestedLandmarkModel::where('id', $request->edit_id)->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'distance' => $validated['distance'],
            'is_approved' => $request->status,
        ]);
        if ($request->status == 1) {
            log_anything('MOVED TO TYPE LAND MARK');
            $this->moveToTypeLandmark($request);
        }

        return response()->json(['status' => 1, 'message' => 'Updated successfully']);
    }

    private function moveToTypeLandmark($r)
    {
        $map = [
            'healthcare' => \App\Models\Hospital::class,
            'metro'      => \App\Models\Metro::class,
            'rail'       => \App\Models\Railway::class,
            'education'  => \App\Models\Education::class,
            'bus'        => \App\Models\Bus::class,
            'others'     => \App\Models\Others::class,
        ];

        if (!isset($map[$r->type])) {
            throw new \InvalidArgumentException("Unsupported landmark type: " . $r->type);
        }

        $model =  $map[$r->type]::query();
        $model->create([
            'name' => $r->name,
            'long' => $r->longitude,
            'lat' => $r->latitude,
        ]);
    }
}
