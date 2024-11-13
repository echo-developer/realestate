<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Admin_Role;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function Admin_User_Page(){
        $users = Admin::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        $roles = Admin_Role::where('status', '!=', config('constants.STATUS_DELETE'))->get();
        return view('Admin.Users.index')->with(compact('users','roles'));
    }
}

