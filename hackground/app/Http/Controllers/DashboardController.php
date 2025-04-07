<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\UserTransaction;
use App\Models\PrefPropertySetting;

class DashboardController extends Controller
{
    public function __construct()
    {
        // Apply middleware only to specific methods
        $this->middleware('view_permit:dashboard');
    }
    public function dashboard()
    {
        $data = [
            'total_properties' => PrefProperty::count(),
            'properties_for_sale' => PrefPropertySetting::where('post_for', 'sale')->count(),
            'properties_for_rent' => PrefPropertySetting::where('post_for', 'rent')->count(),
            'total_agents' => User::where('user_type', 'A')->count(),
            'total_customer' => User::count(),
            'total_revenue' => UserTransaction::where('payment_status', 'succeeded')->sum('paid_amount'),
            'properties_lists' => PrefProperty::select('id','name','created_at')->with('settings:pid,post_for,property_type','location:pid,locality')->latest()->take(5)->get(),
        ];
        return view('Admin.dashboard', compact('data'));
    }
}
