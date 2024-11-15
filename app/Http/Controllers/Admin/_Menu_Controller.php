<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class _Menu_Controller extends Controller
{
    public function menu_management_page(){
        return view('Admin.Menu-Management.menu_management');
    }
}
