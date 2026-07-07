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
                    'month' => $date->format('M'), // Use short month for labels
                    'total_sale' => 0,
                    'total_rent' => 0,
                    'total_enquiry' => 0,
                    'total_revenue' => 0,
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

        $revenueData = UserTransaction::where('payment_status', 'succeeded')
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as y_m, SUM(paid_amount) as total_revenue")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->get()
            ->keyBy('y_m');

        $finalData = $monthlyData->map(function ($default, $key) use ($salesData, $enquiryData, $revenueData) {
            return [
                'month' => $default['month'],
                'total_sale' => $salesData->has($key) ? $salesData[$key]->total_sale : 0,
                'total_rent' => $salesData->has($key) ? $salesData[$key]->total_rent : 0,
                'total_enquiry' => $enquiryData->has($key) ? $enquiryData[$key]->total_enquiry : 0,
                'total_revenue' => $revenueData->has($key) ? $revenueData[$key]->total_revenue : 0,
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
            ->join('locality_names', 'properties_location.locality', '=', 'locality_names.locality_id')
            ->where('locality_names.lang', 'en')
            ->select('locality_names.name as locality_name', 'properties_location.locality', DB::raw('count(pid) as total'))
            ->groupBy('properties_location.locality', 'locality_names.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $topCities = DB::table('properties_location')
            ->join('city_names', 'properties_location.city', '=', 'city_names.city_id')
            ->where('city_names.lang', 'en')
            ->select('city_names.name as city_name', 'properties_location.city', DB::raw('count(pid) as total'))
            ->groupBy('properties_location.city', 'city_names.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $membershipPlans = DB::table('membership_plans as mp')
            ->join('membership_plan_names as mpn', 'mp.id', '=', 'mpn.plan_id')
            ->where('mpn.lang', 'en')
            ->where('mp.status', config('constants.STATUS_ACTIVE') ?? 1)
            ->select('mp.id', 'mp.price', 'mp.discounted_price', 'mpn.about_plan as name')
            ->take(3)
            ->get();

        $topAgents = User::where('user_type', 'A')
            ->where('status', config('constants.STATUS_ACTIVE') ?? 1)
            ->withCount('properties')
            ->orderByDesc('properties_count')
            ->take(3)
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

        foreach ($topCities as $c) {
            $currCount = PrefProperty::where('status', '!=', $deleteStatus)
                ->whereHas('location', fn($q) => $q->where('city', $c->city))
                ->where('created_at', '>=', $currStart)
                ->count();
            $prevCount = PrefProperty::where('status', '!=', $deleteStatus)
                ->whereHas('location', fn($q) => $q->where('city', $c->city))
                ->whereBetween('created_at', [$prevStart, $currStart])
                ->count();
            $c->trend = $calcTrend($currCount, $prevCount);
        }

        $popularPropertyTypes = DB::table('properties_settings as ps')
            ->join('properties as p', 'ps.pid', '=', 'p.id')
            ->join('property_sub_category_names as scn', 'ps.property_type', '=', 'scn.sub_category_id')
            ->where('scn.lang', 'en')
            ->where('p.status', '!=', $deleteStatus)
            ->select('scn.name as title', DB::raw('count(*) as count'))
            ->groupBy('ps.property_type', 'scn.name')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        $totalPropertiesForPercentage = DB::table('properties_settings as ps')
            ->join('properties as p', 'ps.pid', '=', 'p.id')
            ->where('p.status', '!=', $deleteStatus)
            ->count();

        foreach ($popularPropertyTypes as $type) {
            $type->percentage = $totalPropertiesForPercentage > 0 ? round(($type->count / $totalPropertiesForPercentage) * 100, 1) : 0;
            
            $titleLower = strtolower($type->title);
            $icon = 'bi-building';
            if (strpos($titleLower, 'house') !== false) $icon = 'bi-house';
            if (strpos($titleLower, 'villa') !== false) $icon = 'bi-house-door';
            if (strpos($titleLower, 'office') !== false) $icon = 'bi-shop';
            if (strpos($titleLower, 'land') !== false || strpos($titleLower, 'plot') !== false) $icon = 'bi-tree';
            
            $type->icon = $icon;
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
            
            'free_members' => User::where('is_verified_agent', 0)->where('status', '!=', $deleteStatus)->count(),
            'free_members_this_month' => User::where('is_verified_agent', 0)->where('status', '!=', $deleteStatus)->where('created_at', '>=', now()->startOfMonth())->count(),
            'premium_members' => User::where('is_verified_agent', 1)->where('status', '!=', $deleteStatus)->count(),
            'premium_members_this_month' => User::where('is_verified_agent', 1)->where('status', '!=', $deleteStatus)->where('created_at', '>=', now()->startOfMonth())->count(),
            
            'featured_properties' => PrefProperty::where('is_featured', 1)->where('status', '!=', $deleteStatus)->count(),
            'regular_properties' => PrefProperty::where('is_featured', 0)->where('status', '!=', $deleteStatus)->count(),

            'popular_property_types' => $popularPropertyTypes,

            'top_locations' => $topLocations,
            'top_cities' => $topCities,
            'total_revenue' => UserTransaction::where('payment_status', 'succeeded')->sum('paid_amount'),
            'last_month_revenue' => UserTransaction::where('payment_status', 'succeeded')->whereBetween('created_at', [now()->subMonth()->startOfMonth(), now()->subMonth()->endOfMonth()])->sum('paid_amount'),
            'this_month_revenue' => UserTransaction::where('payment_status', 'succeeded')->where('created_at', '>=', now()->startOfMonth())->sum('paid_amount'),
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
            'chart_revenue' => $finalData->pluck('total_revenue')->toArray(),
            'prop_trend' => $propTrend,
            'agent_trend' => $agentTrend,
            'builder_trend' => $builderTrend,
            'project_trend' => $projectTrend,
            'enquiry_trend' => $enquiryTrend,
            'owner_trend' => $ownerTrend,
            'top_locations' => $topLocations,
            'top_cities' => $topCities,
            'membership_plans' => $membershipPlans,
            'top_agents' => $topAgents,
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
