<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PermissionModel;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    protected $permissionModel;

    /**
     * Inject PermissionModel via Dependency Injection.
     */
    public function __construct(PermissionModel $permissionModel)
    {
        $this->permissionModel = $permissionModel;
    }
    public function PermissionView(Request $request)
    {
        // $lang = strtolower($request->input('lang', 'en'));
        // $term = $request->input('term');
        // $data = $this->permissionModel->getPermissions($term, $lang);
        return view('Admin.Permission.permission');
        // , compact('data')
    }

    public function PermissionImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('permission_image'), $fileName);


            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function deletePermissionImage(Request $req)
    {
        $filePath = public_path('permission_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function addPermission(Request $req)
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
            $response = $this->permissionModel->createPermission($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function PermissionDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Permission ID is required.'], 400);
        }

        $data = $this->permissionModel->getPermissionsDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Permission not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditPermission(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add permission)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'prop_permissionId' => 'required|integer|exists:pref_permission,id',  // Ensure permission exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add permission)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_permissionId.required' => 'The Permission ID field is required.',
            'prop_permissionId.exists' => 'The specified Permission ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add permission)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add permission)
        $data = [
            'permission_id' => $req->prop_permissionId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
            'image' => $validated['image'],
        ];
        try {
            // Call the method to update the permission in the model
            $response = $this->permissionModel->updatePermission($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function PermissionStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->permissionModel->PermissionStatusUpdate($data);
        return response()->json($response);
    }

    public function PermissionDelete(Request $req)
    {
        $response = $this->permissionModel->DeletePermission($req->id);
        return response()->json($response);
    }
}
