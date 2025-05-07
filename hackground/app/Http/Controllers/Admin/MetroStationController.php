<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Metro;
use App\Traits\Imports\ExcelImportTrait;
use Illuminate\Http\Request;

class MetroStationController extends Controller
{
    use ExcelImportTrait;
    public function index(Request $request)
    {
        $term = $request->input('term');

        $query = Metro::query();

        $query->where('status', '!=', config('constants.STATUS_DELETE'));

        if (!empty($term)) {
            $query->where('name', 'like', '%' . $term . '%');
        }

        $list = $query->orderByDesc('id')->paginate(10);

        return view('Admin.Landmarks.metro', compact('list'));
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'latitude' => 'required',
            'longitude' => 'required'
        ]);
        $data['status'] = $request->status;
        Metro::create([
            'name' => $data['name'],
            'lat' => $data['latitude'],
            'long' => $data['longitude'],
            'status' => $data['status'],
        ]);
        return response()->json(['status' => 1, 'message' => 'Metro created successfully']);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (!$id) {
            return response()->json([
                'status' => 0,
                'message' => 'ID is required'
            ], 400);
        }

        $data = Metro::find($id);

        if (!$data) {
            return response()->json([
                'status' => 0,
                'message' => 'Data not found'
            ], 404);
        }

        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'name' => 'required',
            'latitude' => 'required',
            'longitude' => 'required'
        ]);
        $data['status'] = $request->status;
        Metro::where('id', $id)
            ->update([
                'name' => $data['name'],
                'lat' => $data['latitude'],
                'long' => $data['longitude'],
                'status' => $data['status'],
            ]);


        return response()->json(['status' => 1, 'message' => 'Metro Updated successfully']);
    }
    public function statusUpdate(Request $request)
    {
        $status = $request->input('status');
        $id = $request->input('id');
        Metro::where('id', $id)->update(['status' => $status]);
        return response()->json(['success' => true, 'message' =>  $status == 1 ? 'Item activated successfully' : 'Item dectivated successfully']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $metaData = Metro::findOrFail($id);
        $metaData->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.',
        ]);
    }

    public function importMetroExcel(Request $request)
    {
        try {
            $rows = $this->parseUploadedExcel($request, 'xlsFileMetro', 3);
            $response = Metro::metroAddfromExcel($rows, 200);

            set_flash_message('add');
            return redirect()->back();
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['xlsFileMetro' => $e->getMessage()]);
        }
    }
}
