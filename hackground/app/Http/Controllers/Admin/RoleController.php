<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:admin-role');
    }
    public function rolePage()
    {

        $roles = Admin_Role::where('status', '!=', config('constants.STATUS_DELETE'))
        ->where('id', '!=', config('constants.STATUS_ACTIVE'))->get();
        return view('Admin.Role.index')->with(['roles' => $roles]);
        // return view('Admin.Role.index');
    }

    public function addnewRole(Request $request)
    {

        $valid = [
            'name' => 'required|max:50',
            'slug' => 'required|unique:admin_role,slug',
            'status' => 'required',
        ];

        $validatedData = $request->validate($valid);

        $insert_data = [
            'name' => $validatedData['name'],
            'slug' => $validatedData['slug'],
            'status' => $validatedData['status'],
        ];
        // return response()->json($request->all());

        Admin_Role::create($insert_data);
        set_flash_message('add');

        return response()->json(['msg' => 'success', 'message' => 'new role added']);
    }

    public function showSingleRole(String $id)
    {
        $role = Admin_Role::where('id', $id)->first();
        return response()->json($role);
    }


    public function roleupdate(Request $req)
    {
        $validUpdate = [
            'name' => 'required|max:50',
            'status' => 'required',
        ];

        $validateUpdatedData = $req->validate($validUpdate);

        $data_toUpdate = [
            'name' => $validateUpdatedData['name'],
            // 'slug' => $validateUpdatedData['slug'],
            'status' => $validateUpdatedData['status'],
        ];

        $update = Admin_Role::where('id', $req->id)->update($data_toUpdate);
        set_flash_message('update');
        return response()->json(['msg' => 'Role Updated successfully']);
    }

    public function rolestausUp(Request $req)
    {
        $id = $req->role_id;
        $status = $req->status;


        $res = Admin_Role::where('id', $id)->update(['status' => $status]);



        return response()->json($res);
    }

    public function deleteRole(Request $request, $id)
    {
        $role = Admin_Role::where('id', $id)->update(['status' => $request->status]);
        set_flash_message('delete');
        return response()->json($role);
    }
}
