<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Apply middleware only to specific methods
        $this->middleware('view_permit:dashboard');
    }
    public function dashboard()
    {
        return view('Admin.dashboard');
    }
}
