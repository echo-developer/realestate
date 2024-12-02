<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectAmenityModel;
use Illuminate\Http\Request;

class ProjectAmenityController extends Controller
{
    protected $amenityModel;

    /**
     * Inject AmenityModel via Dependency Injection.
     */
    public function __construct(ProjectAmenityModel $amenityModel)
    {
        $this->amenityModel = $amenityModel;
    }
    public function ProjectAmenityView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->amenityModel->getAmenities($term, $lang, $peginate);
        return view('Admin.Project_Setting.project_amenity', compact('data'));
    }

    public function ProjectAmenityImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('amenity_image'), $fileName);


            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function deleteAmenityImage(Request $req)
    {
        $filePath = public_path('amenity_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function addAmenity(Request $req)
    {
        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
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
            $response = $this->amenityModel->createAmenity($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function AmenityDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Amenity ID is required.'], 400);
        }

        $data = $this->amenityModel->getAmenitiesDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Amenity not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditAmenity(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add amenity)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'prop_amenityId' => 'required|integer|exists:pref_project_amenity,id',  // Ensure amenity exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add amenity)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_amenityId.required' => 'The Amenity ID field is required.',
            'prop_amenityId.exists' => 'The specified Amenity ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add amenity)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add amenity)
        $data = [
            'amenity_id' => $req->prop_amenityId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
            'image' => $validated['image'],
        ];
        try {
            // Call the method to update the amenity in the model
            $response = $this->amenityModel->updateAmenity($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function AmenityStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->amenityModel->AmenityStatusUpdate($data);
        return response()->json($response);
    }

    public function AmenityDelete(Request $req)
    {
        $response = $this->amenityModel->DeleteAmenity($req->id);
        return response()->json($response);
    }
}
