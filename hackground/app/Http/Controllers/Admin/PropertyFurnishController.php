<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyFurnishModel;
use Illuminate\Http\Request;

class PropertyFurnishController extends Controller
{
    protected $furnishModel;


    public function __construct(PropertyFurnishModel $furnishModel)
    {
        $this->furnishModel = $furnishModel;
        $this->middleware('view_permit:property-furnishing');
    }

    public function PropertyfurnishingView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->furnishModel->getfurnish($term, $lang, $peginate);
        return view('Admin.Property_Setting.property_furnish', compact('data'));

    }

    public function AddFurnish(Request $req)
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
            $response = $this->furnishModel->createFurnish($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Furnishdetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Furnish ID is required.'], 400);
        }

        $data = $this->furnishModel->getFurnishDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }


    public function EditFurnish(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'prop_furnishId' => 'required|integer|exists:pref_property_furnish,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_furnishId.required' => 'The Category ID field is required.',
            'prop_furnishId.exists' => 'The specified Category ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add category)
        $data = [
            'furnish_id' => $req->prop_furnishId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->furnishModel->updateFurnish($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function Furnishstatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->furnishModel->FurnishStatusUpdate($data);
        return response()->json($response);
    }

    public function Furnishdelete(Request $req)
    {
        $response = $this->furnishModel->DeleteFurnish($req->id);
        return response()->json($response);
    }
}
