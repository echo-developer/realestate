<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Carbon\CarbonPeriod;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\UserTransaction;
use App\Services\DashboardService;
use Illuminate\Support\Facades\DB;
use App\Models\PrefPropertySetting;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
        $this->middleware('view_permit:dashboard');
    }

    public function index()
    {
        $data = $this->dashboardService->getDashboardData();
        return view('Admin.dashboard', compact('data'));
    }
}
