@extends('Admin.layouts.app')

@push('custom-css')
<style>
    /* ══ DASHBOARD MODERN REDESIGN ══ */
    .app-main__inner {
        background: #f8f9fa;
        padding-top: 1.5rem;
    }
    .dashboard-title-wrap {
        margin-bottom: 1.5rem;
    }
    .dashboard-title-wrap h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.25rem;
    }
    .dashboard-title-wrap p {
        color: #64748b;
        font-size: 0.9rem;
        margin: 0;
    }

    /* ── KPI Cards ── */
    .kpi-card {
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        background: #fff;
        height: 100%;
    }
    .kpi-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    }
    .kpi-icon-wrap {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    /* Icon Colors */
    .icon-blue { background: #eff6ff; color: #3b82f6; }
    .icon-purple { background: #f5f3ff; color: #8b5cf6; }
    .icon-indigo { background: #eef2ff; color: #6366f1; }
    .icon-sky { background: #e0f2fe; color: #0ea5e9; }
    .icon-orange { background: #fff7ed; color: #f97316; }
    .icon-yellow { background: #fefce8; color: #eab308; }

    .kpi-details {
        flex: 1;
        min-width: 0;
    }
    .kpi-title {
        font-size: 0.8rem;
        color: #64748b;
        margin-bottom: 0.25rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .kpi-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
        line-height: 1.2;
    }
    .kpi-trend {
        font-size: 0.8rem;
        font-weight: 500;
    }
    .trend-up { color: #10b981; }
    .trend-down { color: #ef4444; }

    /* ── Sections & Cards ── */
    .dashboard-section {
        margin-bottom: 1.5rem;
    }
    .dashboard-card {
        background: #fff;
        border-radius: 16px;
        border: none;
        box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        display: flex;
        flex-direction: column;
    }
    .h-100-card {
        height: 100%;
    }
    .dashboard-card-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .dashboard-card-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }
    .dashboard-card-body {
        padding: 1.5rem;
        flex: 1;
    }

    /* ── Lists (Locations & Properties) ── */
    .list-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f1f5f9;
    }
    .list-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
    .list-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        margin-right: 1rem;
        flex-shrink: 0;
    }
    .list-img {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        object-fit: cover;
        margin-right: 1rem;
        flex-shrink: 0;
    }
    .list-info {
        flex: 1;
        min-width: 0;
    }
    .list-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.15rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .list-subtitle {
        font-size: 0.75rem;
        color: #64748b;
    }
    .list-action {
        font-size: 0.85rem;
        font-weight: 600;
    }
    .badge-soft-success {
        background: #dcfce7;
        color: #166534;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .badge-soft-purple {
        background: #f3e8ff;
        color: #6b21a8;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }
    .badge-soft-blue {
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    /* ── Table ── */
    .modern-table th {
        background: #f8fafc;
        color: #475569;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    .modern-table td {
        padding: 1rem 1.5rem;
        vertical-align: middle;
        font-size: 0.9rem;
        color: #334155;
        border-bottom: 1px solid #f1f5f9;
    }
    .modern-table tr:last-child td { border-bottom: none; }

    /* ── Footer Features ── */
    .features-row {
        background: #f8fafc;
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 1rem;
    }
    .feature-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .feature-icon {
        color: #3b82f6;
        font-size: 1.5rem;
    }
    .feature-title {
        font-size: 0.9rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.15rem;
    }
    .feature-desc {
        font-size: 0.8rem;
        color: #64748b;
    }
    
    /* ── Responsive Mobile Adjustments (2026 Trend) ── */
    @media (max-width: 768px) {
        .app-main__inner { padding-top: 1rem; }
        .dashboard-title-wrap { margin-bottom: 1rem; }
        .dashboard-title-wrap h1 { font-size: 1.25rem; }
        
        /* KPI Cards Grid */
        .kpi-card { padding: 1rem; gap: 0.5rem; flex-direction: column; text-align: center; border-radius: 12px; }
        .kpi-icon-wrap { width: 42px; height: 42px; font-size: 1.1rem; margin: 0 auto; }
        .kpi-title { font-size: 0.7rem; margin-bottom: 0; }
        .kpi-value { font-size: 1.25rem; margin-bottom: 0; }
        .kpi-trend { font-size: 0.7rem; }
        
        /* Headers - Keep View All aligned right */
        .dashboard-card-header { flex-direction: row; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #f8fafc; }
        .dashboard-card-title { font-size: 0.95rem; }
        .header-with-select { flex-direction: column; align-items: stretch; gap: 0.75rem; }
        .header-with-select .form-select { width: 100% !important; margin-top: 0.25rem; }
        
        .chart-legend-wrapper { flex-wrap: wrap; gap: 0.75rem !important; padding-bottom: 0.5rem !important; justify-content: center; }
        
        /* Donut Chart Fixes */
        .donut-chart-container { flex-direction: column !important; justify-content: center; gap: 1rem; padding: 1rem; }
        .donut-chart-canvas-wrap { width: 100% !important; height: 180px !important; }
        .donut-chart-legend { width: 100% !important; padding-left: 0 !important; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
        .donut-chart-legend > div { margin-bottom: 0 !important; text-align: center; }
        .donut-chart-legend .d-flex span:first-child { width: 6px !important; height: 6px !important; margin-right: 4px !important; }
        
        /* Tables */
        .modern-table th, .modern-table td { padding: 0.6rem 0.75rem; font-size: 0.8rem; white-space: nowrap; }
    }
</style>
@endpush

@section('title', 'Dashboard | Admin')

@section('content')
<div class="app-main__inner">

    <div class="dashboard-title-wrap mb-4">
        <h1>Dashboard</h1>
        <p>Welcome back, {{ Auth::guard("admin")->user()->username ?? "Super Admin" }}! Here's what's happening with your platform today.</p>
    </div>

    <!-- ── KPI CARDS ── -->
    <div class="row dashboard-section">
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="window.location.href='{{ url("allproperties/all-property-view") }}'">
                <div class="kpi-icon-wrap icon-blue">
                    <i class="bi bi-house-door"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Properties</div>
                    <div class="kpi-value">{{ $data["total_properties"] ?? 0 }}</div>
                    @if(isset($data['prop_trend']))
                        @if($data['prop_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['prop_trend'] }}%</div>
                        @elseif($data['prop_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['prop_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("member/memberUser/Agent") }}'">
                <div class="kpi-icon-wrap icon-purple">
                    <i class="bi bi-people"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Agents</div>
                    <div class="kpi-value">{{ $data["total_agents"] ?? 0 }}</div>
                    @if(isset($data['agent_trend']))
                        @if($data['agent_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['agent_trend'] }}%</div>
                        @elseif($data['agent_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['agent_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("member/memberUser/Builder") }}'">
                <div class="kpi-icon-wrap icon-indigo">
                    <i class="bi bi-person"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Builders</div>
                    <div class="kpi-value">{{ $data["total_builder"] ?? 0 }}</div>
                    @if(isset($data['builder_trend']))
                        @if($data['builder_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['builder_trend'] }}%</div>
                        @elseif($data['builder_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['builder_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("allproject/all-project-view") }}'">
                <div class="kpi-icon-wrap icon-sky">
                    <i class="bi bi-building"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Projects</div>
                    <div class="kpi-value">{{ $data["properties_for_sale"] ?? 0 }}</div>
                    @if(isset($data['project_trend']))
                        @if($data['project_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['project_trend'] }}%</div>
                        @elseif($data['project_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['project_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>

        <!-- Row 2 -->
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("enquiry/list") }}'">
                <div class="kpi-icon-wrap icon-blue">
                    <i class="bi bi-chat-dots"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Enquiries</div>
                    <div class="kpi-value">{{ $data["enquiry"] ?? 0 }}</div>
                    @if(isset($data['enquiry_trend']))
                        @if($data['enquiry_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['enquiry_trend'] }}%</div>
                        @elseif($data['enquiry_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['enquiry_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("member/memberUser/Owner") }}'">
                <div class="kpi-icon-wrap icon-indigo">
                    <i class="bi bi-person-badge"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Owners</div>
                    <div class="kpi-value">{{ $data["total_owner"] ?? 0 }}</div>
                    @if(isset($data['owner_trend']))
                        @if($data['owner_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['owner_trend'] }}%</div>
                        @elseif($data['owner_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['owner_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("transaction/transaction_list") }}'">
                <div class="kpi-icon-wrap icon-purple">
                    <i class="bi bi-currency-dollar"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Total Revenue</div>
                    <div class="kpi-value">$ {{ $data["total_revenue"] ?? "248,250" }}</div>
                    @if(isset($data['revenue_trend']))
                        @if($data['revenue_trend'] > 0)
                            <div class="kpi-trend trend-up"><i class="bi bi-arrow-up-right"></i> {{ $data['revenue_trend'] }}%</div>
                        @elseif($data['revenue_trend'] < 0)
                            <div class="kpi-trend trend-down"><i class="bi bi-arrow-down-right"></i> {{ abs($data['revenue_trend']) }}%</div>
                        @else
                            <div class="kpi-trend text-muted"><i class="bi bi-dash"></i> 0%</div>
                        @endif
                    @endif
                </div>
            </div>
        </div>
        <div class="col-6 col-md-4 col-lg-3 mb-3">
            <div class="kpi-card" onclick="location.href='{{ url("admin_notifiaction") }}'">
                <div class="kpi-icon-wrap icon-yellow">
                    <i class="bi bi-bell"></i>
                </div>
                <div class="kpi-details">
                    <div class="kpi-title">Notifications</div>
                    <div class="kpi-value">{{ $data["notification"] ?? 0 }}</div>
                    <div class="kpi-trend text-muted">Unread Alerts</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── MIDDLE CHARTS ── -->
    <div class="row dashboard-section">
        <!-- Main Chart -->
        <div class="col-lg-8 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header header-with-select" style="border-bottom: none; padding-bottom: 0.5rem;">
                    <h3 class="dashboard-card-title">Overview Analytics</h3>
                    <select id="chartRangeSelect" class="form-select form-select-sm" style="width: auto; border-radius: 8px;">
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                    </select>
                </div>
                <!-- Custom HTML Legend -->
                <div class="px-4 pb-3 d-flex align-items-center chart-legend-wrapper" style="gap: 1.5rem;">
                    <div class="d-flex align-items-center">
                        <span style="color: #3b82f6; font-size: 1.2rem; margin-right: 6px; line-height: 1;">✦</span>
                        <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">Properties</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <span style="color: #10b981; font-size: 1.2rem; margin-right: 6px; line-height: 1;">✦</span>
                        <span style="font-size: 0.85rem; font-weight: 600; color: #64748b;">Enquiries</span>
                    </div>
                </div>
                <div class="dashboard-card-body pt-0" style="position: relative; height: 320px;">
                    <!-- We will render the existing chart here -->
                    <canvas id="overviewChart"></canvas>
                </div>
            </div>
        </div>
        <!-- Donut Chart -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Property Status</h3>
                </div>
                <div class="dashboard-card-body d-flex align-items-center donut-chart-container">
                    @php
                        $sale = $data['properties_for_sale'] ?? 0;
                        $rent = $data['properties_for_rent'] ?? 0;
                        $pending = $data['properties_pending'] ?? 0;
                        $totalProps = $sale + $rent + $pending;
                        $divTotal = $totalProps > 0 ? $totalProps : 1;
                        $pSale = round(($sale / $divTotal) * 100, 1);
                        $pRent = round(($rent / $divTotal) * 100, 1);
                        $pPending = round(($pending / $divTotal) * 100, 1);
                    @endphp
                    <div class="donut-chart-canvas-wrap" style="position: relative; height: 220px; width: 55%;">
                        <canvas id="propertyStatusChart"></canvas>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                            <h4 style="margin:0; font-weight: 700; font-size: 1.5rem; color: #1e293b;">{{ number_format($totalProps) }}</h4>
                            <span style="color: #64748b; font-size: 0.8rem; font-weight: 500;">Total</span>
                        </div>
                    </div>
                    <div class="donut-chart-legend" style="width: 45%; padding-left: 1rem;">
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">For Sale</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $sale }} ({{ $pSale }}%)
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #8b5cf6; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">For Rent</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $rent }} ({{ $pRent }}%)
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #f59e0b; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">Pending</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $pending }} ({{ $pPending }}%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── BOTTOM 3 COLUMNS ── -->
    <div class="row dashboard-section">
        <!-- Top Locations -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Top Locations</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @if(isset($data["top_locations"]) && count($data["top_locations"]) > 0)
                            @foreach ($data["top_locations"] as $location)
                            <div class="list-item">
                                <div class="list-icon"><i class="bi bi-geo-alt"></i></div>
                                <div class="list-info">
                                    <div class="list-title">{{ get_name_by_id("locality_names", "locality_id", $location->locality, "en") ?? "N/A" }}</div>
                                    <div class="list-subtitle">{{ $location->total }} Properties</div>
                                </div>
                                <div class="list-action {{ $location->trend >= 0 ? 'trend-up' : 'trend-down' }}">
                                    <i class="bi {{ $location->trend >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right' }}"></i> 
                                    {{ abs($location->trend) }}%
                                </div>
                            </div>
                            @endforeach
                        @else
                            <div class="p-3 text-center text-muted">No locations found.</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Properties -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Recent Properties</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @if(isset($data["properties_lists"]) && count($data["properties_lists"]) > 0)
                            @foreach ($data["properties_lists"]->take(4) as $property)
                            @php
                                $filename = null;
                                if ($property->gallery->isNotEmpty() && $property->gallery->first()->images->isNotEmpty()) {
                                    $filename = $property->gallery->first()->images->first()->filename;
                                }
                                $relativePath = 'user_upload/property_images/' . $filename;
                                $localPath = public_path($relativePath);
                                $imageToShow = $filename && file_exists($localPath)
                                    ? asset($relativePath)
                                    : asset(config('constants.NO_IMAGE_PROPERTY', 'https://via.placeholder.com/100x100.png?text=No+Img'));
                            @endphp
                            <div class="list-item">
                                <img src="{{ $imageToShow }}" class="list-img" alt="{{ $property->name }}">
                                <div class="list-info">
                                    <div class="list-title">{{ $property->name }}</div>
                                    <div class="list-subtitle">{{ get_name_by_id("locality_names", "locality_id", optional($property->location)->locality, "en") ?? "N/A" }}</div>
                                </div>
                                <div>
                                    <span class="badge-soft-success">For {{ $property->settings->post_for ?? "Sale" }}</span>
                                </div>
                            </div>
                            @endforeach
                        @else
                            <div class="p-3 text-center text-muted">No properties found.</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Users by Role -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Users by Role</h3>
                </div>
                <div class="dashboard-card-body d-flex align-items-center donut-chart-container">
                    @php
                        $agents = $data['total_agents'] ?? 0;
                        $builders = $data['total_builder'] ?? 0;
                        $owners = $data['total_owner'] ?? 0;
                        $totalUsers = $agents + $builders + $owners;
                        $divUsers = $totalUsers > 0 ? $totalUsers : 1;
                        $pAgents = round(($agents / $divUsers) * 100, 1);
                        $pBuilders = round(($builders / $divUsers) * 100, 1);
                        $pOwners = round(($owners / $divUsers) * 100, 1);
                    @endphp
                    <div class="donut-chart-canvas-wrap" style="position: relative; height: 220px; width: 55%;">
                        <canvas id="usersRoleChart"></canvas>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                            <h4 style="margin:0; font-weight: 700; font-size: 1.5rem; color: #1e293b;">{{ number_format($totalUsers) }}</h4>
                            <span style="color: #64748b; font-size: 0.8rem; font-weight: 500;">Total</span>
                        </div>
                    </div>
                    <div class="donut-chart-legend" style="width: 45%; padding-left: 1rem;">
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">Agents</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $agents }} ({{ $pAgents }}%)
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #3b82f6; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">Builders</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $builders }} ({{ $pBuilders }}%)
                            </div>
                        </div>
                        <div>
                            <div class="d-flex align-items-center mb-1">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #f59e0b; display: inline-block; margin-right: 8px;"></span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">Owners</span>
                            </div>
                            <div style="padding-left: 16px; font-size: 0.85rem; color: #64748b;">
                                {{ $owners }} ({{ $pOwners }}%)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── RECENT ENQUIRIES TABLE ── -->
    <div class="dashboard-card mb-4">
        <div class="dashboard-card-header">
            <h3 class="dashboard-card-title">Recent Enquiries</h3>
            <a href="{{ url('enquiry/list') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
        </div>
        <div class="table-responsive">
            <table class="table modern-table mb-0">
                <thead>
                    <tr>
                        <th>Enquiry ID</th>
                        <th>Customer</th>
                        <th>Property</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @if(isset($data["recent_enquiries"]) && count($data["recent_enquiries"]) > 0)
                        @foreach ($data["recent_enquiries"] as $enquiry)
                        <tr>
                            <td class="text-muted fw-bold">#{{ $enquiry->enquery_id }}</td>
                            <td class="fw-bold text-dark">{{ $enquiry->customer ?? 'Guest' }}</td>
                            <td>{{ $enquiry->property_name ?? 'General Inquiry' }}</td>
                            <td>{{ date("M d, Y", strtotime($enquiry->created_at)) }}</td>
                            <td>
                                @if($enquiry->status == 1)
                                    <span class="badge-soft-success">Active</span>
                                @elseif($enquiry->status == 0)
                                    <span class="badge-soft-blue">Closed</span>
                                @else
                                    <span class="badge-soft-warning">Pending</span>
                                @endif
                            </td>
                        </tr>
                        @endforeach
                    @else
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">No records found.</td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>
    </div>

    <!-- ── FOOTER FEATURES ── -->
    <div class="features-row d-none d-lg-flex">
        <div class="feature-item">
            <i class="bi bi-shield-check feature-icon"></i>
            <div>
                <div class="feature-title">100% Secure</div>
                <div class="feature-desc">Your data is safe with us</div>
            </div>
        </div>
        <div class="feature-item">
            <i class="bi bi-headset feature-icon"></i>
            <div>
                <div class="feature-title">24/7 Support</div>
                <div class="feature-desc">We're here to help</div>
            </div>
        </div>
        <div class="feature-item">
            <i class="bi bi-graph-up-arrow feature-icon"></i>
            <div>
                <div class="feature-title">Real-time Analytics</div>
                <div class="feature-desc">Make data-driven decisions</div>
            </div>
        </div>
        <div class="feature-item">
            <i class="bi bi-file-earmark-text feature-icon"></i>
            <div>
                <div class="feature-title">Automated Reports</div>
                <div class="feature-desc">Get insights on the go</div>
            </div>
        </div>
    </div>

</div>
@endsection

@push('custom-js')
<!-- Restore existing chart JS if it was previously used -->
@if(isset($data['chart_sale']))
<script>
    document.addEventListener("DOMContentLoaded", function() {
        const saleData = [<?php echo implode(',', array_map(function ($sale) { return '"' . $sale . '"'; }, $data['chart_sale'])); ?>].map(Number);
        const rentData = [<?php echo implode(',', array_map(function ($rent) { return '"' . $rent . '"'; }, $data['chart_rent'])); ?>].map(Number);
        const enquiryData = [<?php echo implode(',', array_map(function ($enq) { return '"' . $enq . '"'; }, $data['chart_enquiry'])); ?>].map(Number);

        // Combine sale and rent to get total properties posted
        const propertyData = saleData.map((val, idx) => val + rentData[idx]);

        const allData = propertyData.concat(enquiryData);
        const maxValue = Math.max(...allData, 10); // Ensure there's a min max of 10
        const suggestedMax = Math.ceil(maxValue / 10) * 10;

        const ctx = document.getElementById("overviewChart");
        let chartInstance = null;
        if (ctx) {
            chartInstance = new Chart(ctx.getContext("2d"), {
                type: "line",
                data: {
                    labels: [<?php echo implode(',', array_map(function ($month) { return '"' . $month . '"'; }, $data['chart_labels'])); ?>],
                    datasets: [{
                            label: "Properties",
                            data: propertyData,
                            fill: true,
                            backgroundColor: "rgba(59, 130, 246, 0.1)", // blue
                            borderColor: "#3b82f6",
                            tension: 0.4,
                            borderWidth: 2,
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#3b82f6",
                            pointBorderWidth: 2,
                            pointRadius: 4
                        },
                        {
                            label: "Enquiries",
                            data: enquiryData,
                            fill: true,
                            backgroundColor: "rgba(16, 185, 129, 0.1)", // emerald
                            borderColor: "#10b981",
                            tension: 0.4,
                            borderWidth: 2,
                            pointBackgroundColor: "#fff",
                            pointBorderColor: "#10b981",
                            pointBorderWidth: 2,
                            pointRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: suggestedMax,
                            grid: { borderDash: [4, 4], color: "#f1f5f9" },
                            border: { display: false }
                        },
                        x: {
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        const rangeSelect = document.getElementById('chartRangeSelect');
        if (rangeSelect && chartInstance) {
            rangeSelect.addEventListener('change', function() {
                const range = this.value;
                fetch(`{{ route('admin.dashboard.chartData') }}?range=${range}`)
                    .then(res => res.json())
                    .then(resData => {
                        const newSale = resData.chart_sale.map(Number);
                        const newRent = resData.chart_rent.map(Number);
                        const newProp = newSale.map((val, idx) => val + newRent[idx]);
                        const newEnq = resData.chart_enquiry.map(Number);

                        const newAllData = newProp.concat(newEnq);
                        const newMax = Math.max(...newAllData, 10);
                        
                        chartInstance.data.labels = resData.chart_labels;
                        chartInstance.data.datasets[0].data = newProp;
                        chartInstance.data.datasets[1].data = newEnq;
                        chartInstance.options.scales.y.suggestedMax = Math.ceil(newMax / 10) * 10;
                        chartInstance.update();
                    })
                    .catch(err => console.error("Error fetching chart data:", err));
            });
            // Auto trigger once on load to show 7 days by default since "Last 7 Days" is first option
            rangeSelect.dispatchEvent(new Event('change'));
        }

        const donutCtx = document.getElementById("propertyStatusChart");
        if (donutCtx) {
            new Chart(donutCtx.getContext("2d"), {
                type: "doughnut",
                data: {
                    labels: ["For Sale", "For Rent", "Pending"],
                    datasets: [{
                        data: [
                            {{ $data['properties_for_sale'] ?? 0 }}, 
                            {{ $data['properties_for_rent'] ?? 0 }}, 
                            {{ $data['properties_pending'] ?? 0 }}
                        ],
                        backgroundColor: ["#3b82f6", "#8b5cf6", "#f59e0b"],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false } // Custom HTML legend is used
                    },
                    cutout: '70%'
                }
            });
        }

        const usersRoleCtx = document.getElementById("usersRoleChart");
        if (usersRoleCtx) {
            new Chart(usersRoleCtx.getContext("2d"), {
                type: "doughnut",
                data: {
                    labels: ["Agents", "Builders", "Owners"],
                    datasets: [{
                        data: [
                            {{ $data['total_agents'] ?? 0 }}, 
                            {{ $data['total_builder'] ?? 0 }}, 
                            {{ $data['total_owner'] ?? 0 }}
                        ],
                        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b"],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false } // Custom HTML legend is used
                    },
                    cutout: '70%'
                }
            });
        }
    });
</script>
@endif
@endpush
