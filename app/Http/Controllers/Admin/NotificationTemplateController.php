<?php

namespace App\Http\Controllers\Admin;

use HTMLPurifier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\NotificationTempModel;

class NotificationTemplateController extends Controller
{
    protected $notificationtempModel;

    /**
     * Inject EmailTemplateModel via Dependency Injection.
     */
    public function __construct(NotificationTempModel $notificationtempModel)
    {
        $this->notificationtempModel = $notificationtempModel;
    }
    public function NotificationTemplateView(Request $request)
    {
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $peginate=10;
        $data = $this->notificationtempModel->getdata($term ,'', $peginate);
        return view('Admin.Management.notificationTemplate', compact('data'));
    }
    public function AddNotificationTemplate(Request $req)
    {
        $langs = array_keys($req->input('content', []));


        $rules = [
            'name' => 'required|max:255',
            'template_key' => 'required|max:255|unique:pref_email_templates,key',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["content.$lang"] = 'required|string';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'name.required' => 'The Name field is required.',
            'template_key.required' => 'The Template Key field is required.',
            'template_key.unique' => 'The Template Key already exsist.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);
        $validated['all_template_keys']=$req->all_template_keys;
        // Sanitize the content to prevent XSS (if needed)
        $purifier = new HTMLPurifier();
        foreach ($langs as $lang) {
            $validated['content'][$lang] = $purifier->purify($validated['content'][$lang]);
        }

        try {
            $response = $this->notificationtempModel->createNotificationTemplate($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function NotificationTemplateDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'EmailTemplate ID is required.'], 400);
        }

        $data = $this->notificationtempModel->getnotificationsDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'EmailTemplate not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditNotificationTemplate(Request $req)
    {


        $langs = array_keys($req->input('content', []));

     
        $rules = [
            'name' => 'required|max:255',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ];

        foreach ($langs as $lang) {
            $rules["content.$lang"] = 'required|string|max:5000';
        }

    
        $messages = [
            'order.required' => 'The Order field is required.',
            'name.required' => 'The Name field is required.',
            'status.required' => 'The Status field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["content.$lang.required"] = "The Content ($lang) field is required.";
        }

        // Validate the request (same as add emailTemplate)
        $validated = $req->validate($rules, $messages);
        $validated['all_template_keys']=$req->all_template_keys;
        $validated['notification_template_id'] = $req->prop_NotificationTemplateId;

        try {
            // Call the method to update the emailTemplate in the model
            $response = $this->notificationtempModel->updateNotificationTemplate($validated);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function NotificationStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->notificationtempModel->NotificationStatusUpdate($data);
        return response()->json($response);
    }

    public function DeleteNotificationTemplate(Request $req) {
        $response = $this->notificationtempModel->DeleteNotificationTmplate($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}
