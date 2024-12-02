<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CmsModel;
use HTMLPurifier;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    protected $cmsModel;

    /**
     * Inject CmsModel via Dependency Injection.
     */
    public function __construct(CmsModel $cmsModel)
    {
        $this->cmsModel = $cmsModel;
    }
    public function CmsView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->cmsModel->getCms($term, $lang, $peginate);
        return view('Admin.Management.cms', compact('data'));
    }

    public function AddCms(Request $req)
    {
        $langs = array_keys($req->input('title', []));


        $rules = [
            'slug' => 'required|max:255',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["title.$lang"] = 'required|string|max:255';
            $rules["content.$lang"] = 'required|string|max:5000';
            $rules["meta_title.$lang"] = 'required|string|max:255';
            $rules["meta_keys.$lang"] = 'required|string|max:255';
            $rules["meta_desc.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'slug.required' => 'The Slug field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["title.$lang.required"] = "The Title ($lang) field is required.";
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
            $messages["meta_title.$lang.required"] = "The Meta Title ($lang) field is required.";
            $messages["meta_keys.$lang.required"] = "The Meta Keys ($lang) field is required.";
            $messages["meta_desc.$lang.required"] = "The Meta Description ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        // Sanitize the content to prevent XSS (if needed)
        $purifier = new HTMLPurifier();
        foreach ($langs as $lang) {
            $validated['content'][$lang] = $purifier->purify($validated['content'][$lang]);
        }

        try {
            $response = $this->cmsModel->createCms($validated);
            set_flash_message('add');
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function CmsDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Cms ID is required.'], 400);
        }

        $data = $this->cmsModel->getCmsDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Cms not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditCms(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('title', []));

        // Validation rules (same as add cms)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["title.$lang"] = 'required|string|max:255';
            $rules["content.$lang"] = 'required|string|max:5000';
            $rules["meta_title.$lang"] = 'required|string|max:255';
            $rules["meta_keys.$lang"] = 'required|string|max:255';
            $rules["meta_desc.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add cms)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["title.$lang.required"] = "The Title ($lang) field is required.";
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
            $messages["meta_title.$lang.required"] = "The Meta Title ($lang) field is required.";
            $messages["meta_keys.$lang.required"] = "The Meta Keys ($lang) field is required.";
            $messages["meta_desc.$lang.required"] = "The Meta Description ($lang) field is required.";
        }

        // Validate the request (same as add cms)
        $validated = $req->validate($rules, $messages);
        $validated['cms_id'] = $req->prop_cmsId;

        try {
            // Call the method to update the cms in the model
            $response = $this->cmsModel->updateCms($validated);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function CmsStatus(Request $req)
    {
        $data = [
            'cms_id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->cmsModel->CmsStatusUpdate($data);
        return response()->json($response);
    }

    public function CmsDelete(Request $req)
    {
        $response = $this->cmsModel->DeleteCms($req->id);
        return response()->json($response);
    }
}
