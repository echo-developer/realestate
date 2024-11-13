<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin_Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function rolePage()
    {

        $roles = Admin_Role::where('status', '!=', config('constants.STATUS_DELETE'))->get();

        return view('Admin.Role.index')->with(['roles' => $roles]);
        // return view('Admin.Role.index');
    }

    public function addnewRole(Request $request)
    {

        $valid = [
            'name' => 'required|max:50',
            'slug' => 'required|unique:pref_admin_role,slug',
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
        session()->flash('R_success_msg', 'Role added successfully');
        session()->flash('R_message_type', 'success');

        return response()->json(['msg' => 'success', 'message' => 'new role added']);
    }

    public function showSingleRole(String $id)
    {
        $role = Admin_Role::where('id', $id)->first();
        return response()->json($role);
    }
}
