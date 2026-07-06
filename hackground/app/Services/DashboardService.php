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
        $startDate = Carbon::now()->subMonths(8)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $monthlyData = collect(CarbonPeriod::create($startDate, '1 month', $endDate))
            ->mapWithKeys(fn($date) => [
                $date->format('Y-m') => [
                    'month' => $date->format('F Y'),
                    'total_sale' => 0,
                    'total_rent' => 0,
                    'total_enquiry' => 0,
                ],
            ]);

        $salesData = DB::table('properties_settings as ps')
            ->join('properties as p', 'ps.pid', '=', 'p.id')
            ->selectRaw("
            DATE_FORMAT(pref_p.created_at, '%Y-%m') as y_m,
            SUM(CASE WHEN pref_ps.post_for = 'sale' THEN 1 ELSE 0 END) as total_sale,
            SUM(CASE WHEN pref_ps.post_for = 'rent' THEN 1 ELSE 0 END) as total_rent
            ")
            ->whereBetween('p.created_at', [$startDate, $endDate])
            ->where('p.status', config('constants.STATUS_ACTIVE'))
            ->groupBy(DB::raw("DATE_FORMAT(pref_p.created_at, '%Y-%m')"))
            ->get()
            ->keyBy('y_m');

        $enquiryData = Enquiry::selectRaw("
            DATE_FORMAT(created_at, '%Y-%m') as y_m,
            COUNT(*) as total_enquiry
            ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->get()
            ->keyBy('y_m');

        $finalData = $monthlyData->map(function ($default, $key) use ($salesData, $enquiryData) {
            return [
                'month' => $default['month'],
                'total_sale' => $salesData->has($key) ? $salesData[$key]->total_sale : 0,
                'total_rent' => $salesData->has($key) ? $salesData[$key]->total_rent : 0,
                'total_enquiry' => $enquiryData->has($key) ? $enquiryData[$key]->total_enquiry : 0,
            ];
        });

        $activeStatus = config('constants.STATUS_ACTIVE');
        $inactiveStatus = config('constants.STATUS_INACTIVE');
        $deleteStatus = config('constants.STATUS_DELETE');

        // Trend Calculations (Last 30 days vs Previous 30 days)
        $currStart = now()->subDays(30);
        $prevStart = now()->subDays(60);

        $calcTrend = function($curr, $prev) {
            if ($prev == 0) return $curr > 0 ? 100 : 0;
            return round((($curr - $prev) / $prev) * 100, 1);
        };

        $propTrend = $calcTrend(
            PrefProperty::where('status', '!=', $deleteStatus)->where('created_at', '>=', $currStart)->count(),
            PrefProperty::where('status', '!=', $deleteStatus)->whereBetween('created_at', [$prevStart, $currStart])->count()
        );
        $agentTrend = $calcTrend(
            User::where([['user_type', 'A'], ['status', '!=', $deleteStatus]])->where('created_at', '>=', $currStart)->count(),
            User::where([['user_type', 'A'], ['status', '!=', $deleteStatus]])->whereBetween('created_at', [$prevStart, $currStart])->count()
        );
        $builderTrend = $calcTrend(
            User::where([['user_type', 'B'], ['status', '!=', $deleteStatus]])->where('created_at', '>=', $currStart)->count(),
            User::where([['user_type', 'B'], ['status', '!=', $deleteStatus]])->whereBetween('created_at', [$prevStart, $currStart])->count()
        );
        $projectTrend = $calcTrend(
            PrefProject::where('status', '!=', $deleteStatus)->where('created_at', '>=', $currStart)->count(),
            PrefProject::where('status', '!=', $deleteStatus)->whereBetween('created_at', [$prevStart, $currStart])->count()
        );
        $enquiryTrend = $calcTrend(
            Enquiry::where('created_at', '>=', $currStart)->count(),
            Enquiry::whereBetween('created_at', [$prevStart, $currStart])->count()
        );
        $currOwner = User::where([['user_type', 'O'], ['status', '!=', $deleteStatus]])->where('created_at', '>=', $currStart)->count();
        $prevOwner = User::where([['user_type', 'O'], ['status', '!=', $deleteStatus]])->whereBetween('created_at', [$prevStart, $currStart])->count();
        $ownerTrend = $calcTrend($currOwner, $prevOwner);

        $currRev = UserTransaction::where('payment_status', 'succeeded')->where('created_at', '>=', $currStart)->sum('paid_amount');
        $prevRev = UserTransaction::where('payment_status', 'succeeded')->whereBetween('created_at', [$prevStart, $currStart])->sum('paid_amount');
        $revenueTrend = $calcTrend($currRev, $prevRev);

        $topLocations = DB::table('properties_location')
            ->select('locality', DB::raw('count(pid) as total'))
            ->groupBy('locality')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        foreach ($topLocations as $location) {
            $currCount = PrefProperty::where('status', '!=', $deleteStatus)
                ->whereHas('location', fn($q) => $q->where('locality', $location->locality))
                ->where('created_at', '>=', $currStart)
                ->count();

            $prevCount = PrefProperty::where('status', '!=', $deleteStatus)
                ->whereHas('location', fn($q) => $q->where('locality', $location->locality))
                ->whereBetween('created_at', [$prevStart, $currStart])
                ->count();

            $location->trend = $calcTrend($currCount, $prevCount);
        }

        return [
            'total_properties' => PrefProperty::where('status', '!=', $deleteStatus)->count(),
            'total_projects' => PrefProject::where('status', '!=', $deleteStatus)->count(),
            'properties_for_sale' => PrefProperty::whereHas('settings', fn($q) => $q->where('post_for', 'sale'))->where('status', $activeStatus)->count(),
            'properties_for_rent' => PrefProperty::whereHas('settings', fn($q) => $q->where('post_for', 'rent'))->where('status', $activeStatus)->count(),
            'properties_pending' => PrefProperty::where('status', $inactiveStatus)->count(),
            'total_agents' => User::where([['user_type', 'A'], ['status', '!=', $deleteStatus]])->count(),
            'total_builder' => User::where([['user_type', 'B'], ['status', '!=', $deleteStatus]])->count(),
            'total_owner' => User::where([['user_type', 'O'], ['status', '!=', $deleteStatus]])->count(),
            'top_locations' => $topLocations,
            'total_revenue' => UserTransaction::where('payment_status', 'succeeded')->sum('paid_amount'),
            'properties_lists' => PrefProperty::select('id', 'name', 'created_at')
                ->with(['settings:pid,post_for,property_type', 'location:pid,locality', 'gallery.images'])
                ->latest()->take(5)->get(),
            'recent_enquiries' => DB::table('property_enquiry as e')
                ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
                ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
                ->select('e.enquery_id', 'e.created_at', 'e.status', 'c.name as customer', 'p.name as property_name')
                ->orderByDesc('e.enquery_id')
                ->take(5)
                ->get(),
            'notification' => Notification::where('read_status', $inactiveStatus)->count(),
            'enquiry' => Enquiry::count(),
            'chart_labels' => $finalData->pluck('month')->toArray(),
            'chart_sale' => $finalData->pluck('total_sale')->toArray(),
            'chart_rent' => $finalData->pluck('total_rent')->toArray(),
            'chart_enquiry' => $finalData->pluck('total_enquiry')->toArray(),
            'prop_trend' => $propTrend,
            'agent_trend' => $agentTrend,
            'builder_trend' => $builderTrend,
            'project_trend' => $projectTrend,
            'enquiry_trend' => $enquiryTrend,
            'owner_trend' => $ownerTrend,
            'revenue_trend' => $revenueTrend,
        ];
    }

    public function getChartDataByRange($range)
    {
        $days = (int) $range;
        if ($days <= 0) $days = 30; // fallback

        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $dailyData = collect(CarbonPeriod::create($startDate, '1 day', $endDate))
            ->mapWithKeys(fn($date) => [
                $date->format('Y-m-d') => [
                    'label' => $date->format('M d'),
                    'total_sale' => 0,
                    'total_rent' => 0,
                    'total_enquiry' => 0,
                ],
            ]);

        $salesData = DB::table('properties_settings as ps')
            ->join('properties as p', 'ps.pid', '=', 'p.id')
            ->selectRaw("
            DATE_FORMAT(pref_p.created_at, '%Y-%m-%d') as y_m_d,
            SUM(CASE WHEN pref_ps.post_for = 'sale' THEN 1 ELSE 0 END) as total_sale,
            SUM(CASE WHEN pref_ps.post_for = 'rent' THEN 1 ELSE 0 END) as total_rent
            ")
            ->whereBetween('p.created_at', [$startDate, $endDate])
            ->where('p.status', config('constants.STATUS_ACTIVE'))
            ->groupBy(DB::raw("DATE_FORMAT(pref_p.created_at, '%Y-%m-%d')"))
            ->get()
            ->keyBy('y_m_d');

        $enquiryData = Enquiry::selectRaw("
            DATE_FORMAT(created_at, '%Y-%m-%d') as y_m_d,
            COUNT(*) as total_enquiry
            ")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d')"))
            ->get()
            ->keyBy('y_m_d');

        $finalData = $dailyData->map(function ($default, $key) use ($salesData, $enquiryData) {
            return [
                'label' => $default['label'],
                'total_sale' => $salesData->has($key) ? $salesData[$key]->total_sale : 0,
                'total_rent' => $salesData->has($key) ? $salesData[$key]->total_rent : 0,
                'total_enquiry' => $enquiryData->has($key) ? $enquiryData[$key]->total_enquiry : 0,
            ];
        });

        return [
            'chart_labels' => array_values($finalData->pluck('label')->toArray()),
            'chart_sale' => array_values($finalData->pluck('total_sale')->toArray()),
            'chart_rent' => array_values($finalData->pluck('total_rent')->toArray()),
            'chart_enquiry' => array_values($finalData->pluck('total_enquiry')->toArray()),
        ];
    }
}
