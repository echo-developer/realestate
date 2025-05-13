<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Enquiry;
use Carbon\CarbonPeriod;
use App\Models\Notification;
use App\Models\PrefProject;
use App\Models\PrefProperty;
use App\Models\UserTransaction;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData()
    {
        // $startDate = Carbon::now()->subMonths(8)->startOfMonth();
        // $endDate = Carbon::now()->endOfMonth();

        // $monthlyData = collect(CarbonPeriod::create($startDate, '1 month', $endDate))
        //     ->mapWithKeys(fn($date) => [
        //         $date->format('Y-m') => [
        //             'month' => $date->format('F Y'),
        //             'total_sale' => 0,
        //             'total_rent' => 0,
        //         ],
        //     ]);

        // $salesData = DB::table('properties_settings as ps')
        //     ->join('properties as p', 'ps.pid', '=', 'p.id')
        //     ->selectRaw("
        //     DATE_FORMAT(pref_p.created_at, '%M %Y') as month,
        //     DATE_FORMAT(pref_p.created_at, '%Y-%m') as y_m,
        //     SUM(CASE WHEN pref_ps.post_for = 'sale' THEN 1 ELSE 0 END) as total_sale,
        //     SUM(CASE WHEN pref_ps.post_for = 'rent' THEN 1 ELSE 0 END) as total_rent
        //     ")
        //     ->whereBetween('p.created_at', [$startDate, $endDate])
        //     ->where('p.status', config('constants.STATUS_ACTIVE'))
        //     ->groupBy(DB::raw("DATE_FORMAT(pref_p.created_at, '%Y-%m')"))
        //     ->orderBy(DB::raw("DATE_FORMAT(pref_p.created_at, '%Y-%m')"))
        //     ->get()
        //     ->keyBy('y_m');

        // $finalData = $monthlyData->map(function ($default, $key) use ($salesData) {
        //     return $salesData->has($key)
        //         ? [
        //             'month' => $salesData[$key]->month,
        //             'total_sale' => $salesData[$key]->total_sale,
        //             'total_rent' => $salesData[$key]->total_rent,
        //         ]
        //         : $default;
        // });

        $activeStatus = config('constants.STATUS_ACTIVE');
        $inactiveStatus = config('constants.STATUS_INACTIVE');
        $deleteStatus = config('constants.STATUS_DELETE');

        return [
            'total_properties' => PrefProperty::where('status', '!=', $deleteStatus)->count(),
            'total_projects' => PrefProject::where('status', '!=', $deleteStatus)->count(),
            'properties_for_sale' => PrefProperty::whereHas('settings', fn($q) => $q->where('post_for', 'sale'))->where('status', $activeStatus)->count(),
            'properties_for_rent' => PrefProperty::whereHas('settings', fn($q) => $q->where('post_for', 'rent'))->where('status', $activeStatus)->count(),
            'total_agents' => User::where([['user_type', 'A'], ['status', '!=', $deleteStatus]])->count(),
            'total_builder' => User::where([['user_type', 'B'], ['status', '!=', $deleteStatus]])->count(),
            'total_owner' => User::where([['user_type', 'O'], ['status', '!=', $deleteStatus]])->count(),
            'total_revenue' => UserTransaction::where('payment_status', 'succeeded')->sum('paid_amount'),
            'properties_lists' => PrefProperty::select('id', 'name', 'created_at')->with(['settings:pid,post_for,property_type', 'location:pid,locality'])->latest()->take(5)->get(),
            'notification' => Notification::where('read_status', $inactiveStatus)->count(),
            'enquiry' => Enquiry::count(),
            // 'chart_labels' => $finalData->pluck('month')->toArray(),
            // 'chart_sale' => $finalData->pluck('total_sale')->toArray(),
            // 'chart_rent' => $finalData->pluck('total_rent')->toArray(),
        ];
    }
}
