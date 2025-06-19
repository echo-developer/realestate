<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Admin_Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:admin-users');
    }
    public function Admin_User_Page()
    {
        $users = Admin::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        $roles = Admin_Role::where('status', config('constants.STATUS_ACTIVE'))->get();
        return view('Admin.Users.index')->with(compact('users', 'roles'));
    }

    public function add_newUser(Request $req)
    {
        // return response()->json($req);
        // die;

        $validate_user = $req->validate(
            [
                // 'sub_category_typ' => 'required',
                'username' => 'required|max:20',
                'name' => 'required|max:20',
                'email' => 'required|email|unique:admin,email',
                'password' => 'required',
                'role' => 'required',
                'status' => 'required',
            ]
        );

        $hash_password = Hash::make($validate_user['password']);

        $insert_user =
            [
                'username' => $validate_user['username'],
                'full_name' => $validate_user['name'],
                'email' => $validate_user['email'],
                'password' => $hash_password,
                'role' => $validate_user['role'],
                'registered_on' => Carbon::now(),
                'status' => $validate_user['status'],
            ];

        $new_user = Admin::create($insert_user);

        if ($new_user) {
            session()->flash('success_msg', 'User added successfully');
            session()->flash('message_type', 'success');
        } else {
            session()->flash('success_msg', 'Failed to add');
            session()->flash('message_type', 'danger');
        }

        return response()->json($new_user);
    }

    public function showSingleUser(String $id)
    {
        $user = Admin::where('id', $id)->first();
        return response()->json($user);
    }

    public function userupdate(Request $req)
    {
        // return response()->json($req);

        $validate_user = $req->validate(
            [
                // 'sub_category_typ' => 'required',
                'username' => 'required|max:20',
                'name' => 'required|max:20',
                'email' => 'required|email',
                'role' => 'required',
                'status' => 'required',
            ]
        );

        $update_user =
            [
                'username' => $validate_user['username'],
                'full_name' => $validate_user['name'],
                'email' => $validate_user['email'],
                'role' => $validate_user['role'],
                'status' => $validate_user['status'],
            ];

        $update = Admin::where('id', $req->id)->update($update_user);

        if ($update_user || $update) {
            session()->flash('success_msg', 'User Update successfully');
            session()->flash('message_type', 'success');
        } else {
            session()->flash('success_msg', 'Failed to Update');
            session()->flash('message_type', 'danger');
        }
        return response()->json($update);
    }

    public function userstausUpdate(Request $req)
    {

        Admin::where('id', $req->user_Id)->update(['status' => $req->status]);
        return response()->json(['msg' => 'User status updated']);
    }

    public function usersdelete(Request $req, String $id)
    {

        $delete = Admin::where('id', $id)->update(['status' => $req->status]);
        if ($delete) {
            session()->flash('success_msg', 'User Deleted successfully');
            session()->flash('message_type', 'danger');
        } else {
            session()->flash('success_msg', 'Failed To Delete');
            session()->flash('message_type', 'warning');
        }

        return response()->json($delete);
    }
}
