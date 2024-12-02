<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyRecommendModel;
use Illuminate\Http\Request;

class PropertyRecommendController extends Controller
{
    protected $recommendedModel;

   
    public function __construct(PropertyRecommendModel $recommendedModel)
    {
        $this->recommendedModel = $recommendedModel;
    }

    public function PropertyrecommendedView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->recommendedModel->getrecommendeds($term,$lang,$peginate);
        return view('Admin\Property_Setting\property_recommended', compact('data'));
        // 
    }

    public function AddRecommended(Request $req)
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
            $response = $this->recommendedModel->createRecommended($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function Recommendeddetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Recommended ID is required.'], 400);
        }

        $data = $this->recommendedModel->getRecommendedDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Recommended not found.'], 404);
        }

        return response()->json($data);
    }


    public function EditRecommended(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'prop_recommendedId' => 'required|integer|exists:pref_property_recommended,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_recommendedId.required' => 'The Recommend ID is required.',
            'prop_recommendedId.exists' => 'The specified Recommend ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add category)
        $data = [
            'recommended_id' => $req->prop_recommendedId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->recommendedModel->updaterecommended($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function Recommendedstatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->recommendedModel->RecommendedstatusUpdate($data);
        return response()->json($response);
    }

    public function Recommendeddelete(Request $req)
    {
        $response = $this->recommendedModel->DeleteRecommended($req->id);
        return response()->json($response);
    }
}
