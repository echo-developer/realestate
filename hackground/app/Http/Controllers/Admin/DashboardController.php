<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\PrefProperty;
use App\Models\PrefPropertySetting;
use App\Models\User;
use App\Models\UserTransaction;
use App\Services\DashboardService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use function Laravel\Prompts\password;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function chartData(Request $request)
    {
        $range = $request->input('range', '30'); // default 30 days
        $data = $this->dashboardService->getChartDataByRange($range);
        return response()->json($data);
    }

    public function adminDetailsUpdate(Request $r)
    {
        log_anything($r->admin_id);

        $data = [
            "username" => $r->username,
            "full_name" => $r->full_name,
            "email" => $r->email,
            "status" => $r->status,
        ];
        if (isset($r->password) && !empty($r->password)) {
            $data['password'] = bcrypt($r->password);
        }
        Admin::where('id', $r->admin_id)->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Admin Updated',
        ]);
    }
}
