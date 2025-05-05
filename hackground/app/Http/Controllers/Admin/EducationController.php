<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use App\Traits\Imports\ExcelImportTrait;
use Illuminate\Http\Request;

class EducationController extends Controller
{

    use ExcelImportTrait;
    protected $educationModel;


    public function __construct(Education $educationModel)
    {
        $this->educationModel = $educationModel;
        $this->middleware('view_permit:city');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $term = $request->input('term');

        $query = Education::query();

        $query->where('status', '!=', config('constants.STATUS_DELETE'));

        if (!empty($term)) {
            $query->where('name', 'like', '%' . $term . '%');
        }

        $list = $query->paginate(10);

        return view('Admin.Landmarks.education', compact('list'));
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
        Education::create([
            'name' => $data['name'],
            'lat' => $data['latitude'],
            'long' => $data['longitude'],
            'status' => $data['status'],
        ]);
        return response()->json(['status' => 1, 'message' => 'Education created successfully']);
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

        $data = Education::find($id);

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
        Education::where('id', $id)
            ->update([
                'name' => $data['name'],
                'lat' => $data['latitude'],
                'long' => $data['longitude'],
                'status' => $data['status'],
            ]);


        return response()->json(['status' => 1, 'message' => 'Education Updated successfully']);
    }
    public function statusUpdate(Request $request)
    {
        $status = $request->input('status');
        $id = $request->input('id');
        Education::where('id', $id)->update(['status' => $status]);
        return response()->json(['success' => true, 'message' =>  $status == 1 ? 'Item activated successfully' : 'Item dectivated successfully']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $metaData = Education::findOrFail($id);
        $metaData->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully.',
        ]);
    }

    public function importEducationExcel(Request $request)
    {
        try {
            $rows = $this->parseUploadedExcel($request,'xlsFileEducation', 3);
            $response = Education::educationAddfromExcel($rows, 200);

            set_flash_message('add');
            return redirect()->back();
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['xlsFileEducation' => $e->getMessage()]);
        }
    }
}
