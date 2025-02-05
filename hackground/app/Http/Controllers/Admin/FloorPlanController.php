<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FloorPlanController extends Controller
{
    public function view(){
        return view('Admin.Project_Setting.floor_plan');
    }
}
