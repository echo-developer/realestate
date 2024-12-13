<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_Role;
use App\Models\PermissionModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function PermissionView(Request $request, $role_id = null)
    {
        $roles = Admin_Role::where('status', '!=', 'constants.STATUS_DELETE')->get();
        return view('Admin.Permission.permission', compact('roles'));
    }

    public function PermissionSave(Request $req)
    {

        $req->validate([
            'user_role' => 'required|integer',
        ]);

        $roleId = $req->input('user_role');
        $permissions = $req->except('user_role', '_token');

        $insertData = [];
        foreach ($permissions as $roleCode => $value) {
            $insertData[] = [
                'role_id' => $roleId,
                'menu_code' => $roleCode,
            ];
        }

        DB::table('pref_permissions')
            ->where('role_id', $roleId)
            ->delete();

        $responce = DB::table('pref_permissions')->insert($insertData);
        if ($responce) {
            set_flash_message('add');
            return redirect()->back()->with('success', 'Permissions saved successfully!');
        }

        return redirect()->back()->with('failed', 'Failed!');
    }

    public function UserbasedPermission($role_id)
    {
        $menus = $this->permissionModel->getPermission($role_id);

        return response()->json($menus);
    }















    // public function PermissionDetails($id = null)
    // {
    //     if ($id === null) {
    //         return response()->json(['error' => 'Permission ID is required.'], 400);
    //     }

    //     $data = $this->permissionModel->getPermissionsDetails($id);

    //     if ($data->isEmpty()) {
    //         return response()->json(['error' => 'Permission not found.'], 404);
    //     }

    //     return response()->json($data);
    // }
    // public function EditPermission(Request $req)
    // {

    //     // Get the languages from the input data
    //     $langs = array_keys($req->input('name', []));

    //     // Validation rules (same as add permission)
    //     $rules = [
    //         'order' => 'required|integer',
    //         'status' => 'required|boolean',
    //         'image' => 'nullable|string',
    //         'prop_permissionId' => 'required|integer|exists:pref_permission,id',  // Ensure permission exists
    //     ];

    //     foreach ($langs as $lang) {
    //         $rules["name.$lang"] = 'required|string|max:255';
    //     }

    //     // Custom validation messages (same as add permission)
    //     $messages = [
    //         'order.required' => 'The Order field is required.',
    //         'status.required' => 'The Status field is required.',
    //         'prop_permissionId.required' => 'The Permission ID field is required.',
    //         'prop_permissionId.exists' => 'The specified Permission ID does not exist.',
    //     ];

    //     foreach ($langs as $lang) {
    //         $messages["name.$lang.required"] = "The Name ($lang) field is required.";
    //     }

    //     // Validate the request (same as add permission)
    //     $validated = $req->validate($rules, $messages);

    //     // Prepare the data for the update (same as add permission)
    //     $data = [
    //         'permission_id' => $req->prop_permissionId,
    //         'name' => $validated['name'],
    //         'order' => $validated['order'],
    //         'status' => $validated['status'],
    //         'image' => $validated['image'],
    //     ];
    //     try {
    //         // Call the method to update the permission in the model
    //         $response = $this->permissionModel->updatePermission($data);

    //         return response()->json($response);
    //     } catch (\Exception $e) {
    //         // Catch and return the error response
    //         return response()->json([
    //             'error' => 'Something went wrong! Please try again later.',
    //             'details' => $e->getMessage(),
    //         ], 500);
    //     }
    // }


    // public function PermissionStatus(Request $req)
    // {
    //     $data = [
    //         'id' => $req->id,
    //         'status' => $req->status
    //     ];

    //     $response = $this->permissionModel->PermissionStatusUpdate($data);
    //     return response()->json($response);
    // }

    // public function PermissionDelete(Request $req)
    // {
    //     $response = $this->permissionModel->DeletePermission($req->id);
    //     return response()->json($response);
    // }
}
