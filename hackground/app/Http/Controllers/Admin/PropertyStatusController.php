<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProprertyStatusModel;
use Illuminate\Http\Request;

class PropertyStatusController extends Controller
{
    protected $statusModel;


    public function __construct(ProprertyStatusModel $statusModel)
    {
        $this->statusModel = $statusModel;
        $this->middleware('view_permit:property-status');
    }

    public function PropertystatusView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->statusModel->getstatus($term, $lang, $peginate);
        return view('Admin.Property_Setting.property_status', compact('data'));
        // 
    }

    public function AddStatus(Request $req)
    {
        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'id' => 'nullable|integer',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->statusModel->createStatus($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Statusdetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Furnish ID is required.'], 400);
        }

        $data = $this->statusModel->getStatusDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }


    public function EditStatus(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'prop_statusId' => 'required|integer|exists:pref_property_status,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_statusId.required' => 'The Category ID field is required.',
            'prop_statusId.exists' => 'The specified Category ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add category)
        $data = [
            'status_id' => $req->prop_statusId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->statusModel->updatestatus($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function Statusstatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->statusModel->StatusstatusUpdate($data);
        return response()->json($response);
    }

    public function Statusdelete(Request $req)
    {
        $response = $this->statusModel->DeleteStatus($req->id);
        return response()->json($response);
    }
}
