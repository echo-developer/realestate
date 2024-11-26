<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplateModel;
use Illuminate\Http\Request;
use HTMLPurifier;

class EmailTempController extends Controller
{
    protected $emailTemplateModel;

    /**
     * Inject EmailTemplateModel via Dependency Injection.
     */
    public function __construct(EmailTemplateModel $emailTemplateModel)
    {
        $this->emailTemplateModel = $emailTemplateModel;
    }
    public function EmailTemplateView(Request $request)
    {
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->emailTemplateModel->getEmailTemplates($term,$lang);
        return view('Management.emailTemplate', compact('data'));
    }

    // public function EmailTemplateImage(Request $req)
    // {
    //     $req->validate([
    //         'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
    //     ]);

    //     if ($req->hasFile('file')) {

    //         $file = $req->file('file');
    //         $fileName = time() . '-' . $file->getClientOriginalName();
    //         $file->move(public_path('emailTemplate_image'), $fileName);


    //         return response()->json(['fileName' => $fileName]);
    //     }

    //     return response()->json(['error' => 'No file uploaded'], 400);
    // }

    // public function deleteEmailTemplateImage(Request $req)
    // {
    //     $filePath = public_path('emailTemplate_image/' . $req->file);

    //     if (file_exists($filePath)) {
    //         unlink($filePath);
    //         return response()->json(['success' => 'File deleted successfully']);
    //     }

    //     return response()->json(['error' => 'File not found', $filePath], 404);
    // }

    public function AddEmailTemplate(Request $req)
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
            $response = $this->emailTemplateModel->createEmailTemplate($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function EmailTemplateDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'EmailTemplate ID is required.'], 400);
        }

        $data = $this->emailTemplateModel->getEmailTemplatesDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'EmailTemplate not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditEmailTemplate(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('subject', []));

        // Validation rules (same as add emailTemplate)
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

        // Custom validation messages (same as add emailTemplate)
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

        // Validate the request (same as add emailTemplate)
        $validated = $req->validate($rules, $messages);
        $validated['email_template_id'] = $req->prop_emailTemplateId;

        try {
            // Call the method to update the emailTemplate in the model
            $response = $this->emailTemplateModel->updateEmailTemplate($validated);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function EmailTemplateStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->emailTemplateModel->EmailTemplateStatusUpdate($data);
        return response()->json($response);
    }

    public function EmailTemplateDelete(Request $req)
    {
        $response = $this->emailTemplateModel->DeleteEmailTemplate($req->id);
        return response()->json($response);
    }
}
