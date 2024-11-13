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
    public function Admin_User_Page(){
        $users = Admin::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        $roles = Admin_Role::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        return view('Admin.Users.index')->with(compact('users','roles'));
    }

    public function add_newUser(Request $req){
        // return response()->json($req);
        // die;

        $validate_user = $req->validate(
            [
                // 'sub_category_typ' => 'required',
                'username' => 'required|max:20',
                'name' => 'required|max:20',
                'email' => 'required|email',
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
                'registered_on'=> Carbon::now(),
                'status' => $validate_user['status'],
            ];

        $new_user = Admin::create($insert_user);

        if ($new_user) {
            return response()->json(['msg' => 'new user added']);
        } else {
            return response()->json(['msg' => 'failed']);
        }
    }

    public function showSingleUser(String $id)
    {
        $user = Admin::where('id', $id)->first();
        return response()->json($user);
    }
}

