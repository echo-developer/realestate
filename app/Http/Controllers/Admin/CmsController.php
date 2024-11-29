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
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        // $data = $this->cmsModel->getCmss($term,$lang);
        return view('Admin.Management.cms');
        // , compact('data')
    }

    public function AddCms(Request $req)
    {
        $langs = array_keys($req->input('subject', []));


        $rules = [
            'name' => 'required|max:255',
            'template_key' => 'required|max:255|unique:pref_email_templates,key',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["subject.$lang"] = 'required|string|max:255';
            $rules["content.$lang"] = 'required|string|max:5000';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'name.required' => 'The Name field is required.',
            'template_key.required' => 'The Template Key field is required.',
            'template_key.unique' => 'The Template Key already exsist.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["subject.$lang.required"] = "The Subject ($lang) field is required.";
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
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

        $data = $this->cmsModel->getCmssDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Cms not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditCms(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('subject', []));

        // Validation rules (same as add cms)
        $rules = [
            'name' => 'required|max:255',
            'template_key' => 'required|max:255|unique:pref_email_templates,key',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["subject.$lang"] = 'required|string|max:255';
            $rules["content.$lang"] = 'required|string|max:5000';
        }

        // Custom validation messages (same as add cms)
        $messages = [
            'order.required' => 'The Order field is required.',
            'name.required' => 'The Name field is required.',
            'template_key.required' => 'The Template Key field is required.',
            'template_key.unique' => 'The Template Key already exsist.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["subject.$lang.required"] = "The Subject ($lang) field is required.";
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
        }

        // Validate the request (same as add cms)
        $validated = $req->validate($rules, $messages);
        $validated['email_template_id'] = $req->prop_cmsId;

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
            'id' => $req->id,
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
