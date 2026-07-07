@extends('Admin.layouts.app')

@push('custom-css')
<style>
    /* ══ DASHBOARD MODERN REDESIGN ══ */
    .app-main__inner {
        background: #f8f9fa;
        padding: 1.5rem 1rem !important;
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
        white-space: nowrap;
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
        border-radius: 12px;
        border: 1px solid #f1f5f9;
        box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .h-100-card {
        height: 100%;
    }
    .dashboard-card-header {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    .dashboard-card-title {
        font-size: 1rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
    }
    .dashboard-card-body {
        padding: 1.25rem;
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
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .badge-soft-purple {
        background: #f3e8ff;
        color: #6b21a8;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .badge-soft-blue {
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .badge-soft-warning {
        background: #fef3c7;
        color: #d97706;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }
    .badge-soft-danger {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
    }

    /* ── Table ── */
    .modern-table {
        margin-bottom: 0;
        table-layout: fixed;
        width: 100%;
    }
    .modern-table th {
        background: #fff;
        color: #64748b;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.6rem 0.75rem;
        border-bottom: 1px solid #e2e8f0;
        border-top: none;
    }
    .modern-table td {
        padding: 0.6rem 0.75rem;
        vertical-align: middle;
        font-size: 0.75rem;
        color: #334155;
        border-bottom: 1px solid #f1f5f9;
    }
    .modern-table th:first-child,
    .modern-table td:first-child {
        padding-left: 1.25rem;
    }
    .modern-table th:last-child,
    .modern-table td:last-child {
        padding-right: 1.25rem;
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
                    <div class="kpi-value">{{ $data["total_projects"] ?? 0 }}</div>
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
                    <div class="kpi-value">${{ number_format($data["total_revenue"] ?? 0) }}</div>
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

    <style>
    /* Middle Metrics Row Styles */
    .metric-title { font-size: 0.8rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; white-space: nowrap; }
    .metric-title-dark { font-size: 0.8rem; font-weight: 600; color: #1e293b; margin-bottom: 0.5rem; white-space: nowrap; }
    .metric-number { font-size: 1.6rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
    .metric-icon-wrap { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
    .icon-outline-blue { background: transparent; border: 1.5px solid #3b82f6; color: #3b82f6; }
    .icon-solid-yellow { background: #fefce8; color: #eab308; }
    .metric-prog-bg { height: 6px; border-radius: 4px; background-color: #e2e8f0; }
    .metric-prog-bar { background-color: #3b82f6; border-radius: 4px; }
    .metric-subtext { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-bottom: 2px; }
    .metric-trend { font-size: 0.8rem; font-weight: 600; }
    .rev-month-label { font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem; }
    .rev-num-lg { font-size: 1.8rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
    .rev-trend { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.2rem; }
    .rev-num-sm { font-size: 1.2rem; font-weight: 700; color: #1e293b; line-height: 1.2; }
    .rev-chart-wrap { position: absolute; bottom: 0; right: 0; left: 0; height: 100px; }
    .feat-card-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1rem; }
    .feat-chart-wrap { position: relative; height: 160px; width: 160px; margin: 0 auto; display: flex; justify-content: center; align-items: center; }
    .feat-chart-star { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: #fffbeb; color: #f59e0b; font-size: 1.2rem; }
    .feat-lbl-blue { font-size: 0.85rem; font-weight: 600; color: #3b82f6; margin-bottom: 0.25rem; }
    .feat-num-blue { font-size: 1.4rem; font-weight: 700; color: #3b82f6; line-height: 1.2; }
    .feat-lbl-dark { font-size: 0.85rem; font-weight: 600; color: #1e293b; margin-bottom: 0.25rem; }
    .feat-num-green { font-size: 1.4rem; font-weight: 700; color: #10b981; line-height: 1.2; }
    .feat-subtext { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
</style>

    <!-- ── MIDDLE METRICS ROW ── -->
    <div class="row dashboard-section">
        <!-- Membership Overview -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Membership Overview</h3>
                    <a href="{{ url('member/memberUser') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none; white-space: nowrap;">View All</a>
                </div>
                <div class="dashboard-card-body pt-4 px-3 pb-3">
                    <div class="row w-100 m-0">
                        <!-- Free Members Column -->
                        <div class="col-6 position-relative p-0 pe-2" style="border-right: 1px solid #f1f5f9;">
                            <div class="metric-title">Free Members</div>
                            <div class="d-flex justify-content-between align-items-center mb-2 pe-3">
                                <div class="metric-number">{{ number_format($data['free_members'] ?? 0) }}</div>
                                <div class="metric-icon-wrap icon-outline-blue">
                                    <i class="bi bi-person"></i>
                                </div>
                            </div>
                            
                            <div class="progress mb-3 metric-prog-bg me-3">
                                @php $freePct = (($data['free_members'] ?? 0) + ($data['premium_members'] ?? 0)) > 0 ? (($data['free_members'] ?? 0) / (($data['free_members'] ?? 0) + ($data['premium_members'] ?? 0))) * 100 : 0; @endphp
                                <div class="progress-bar metric-prog-bar" role="progressbar" style="width: {{ $freePct }}%;" aria-valuenow="{{ $freePct }}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            
                            <div class="metric-subtext">This Month</div>
                            <div class="trend-up metric-trend"><i class="bi bi-arrow-up-right"></i> {{ number_format($data['free_members_this_month'] ?? 0) }}</div>
                        </div>
                        
                        <!-- Premium Members Column -->
                        <div class="col-6 p-0 ps-3">
                            <div class="metric-title-dark">Premium Members</div>
                            <div class="d-flex justify-content-between align-items-center mb-2 pe-1">
                                <div class="metric-number">{{ number_format($data['premium_members'] ?? 0) }}</div>
                                <div class="metric-icon-wrap icon-solid-yellow">
                                    <i class="bi bi-star-fill"></i>
                                </div>
                            </div>
                            
                            <div class="progress mb-3 metric-prog-bg pe-1">
                                @php $premiumPct = (($data['free_members'] ?? 0) + ($data['premium_members'] ?? 0)) > 0 ? (($data['premium_members'] ?? 0) / (($data['free_members'] ?? 0) + ($data['premium_members'] ?? 0))) * 100 : 0; @endphp
                                <div class="progress-bar metric-prog-bar" role="progressbar" style="width: {{ $premiumPct }}%;" aria-valuenow="{{ $premiumPct }}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            
                            <div class="metric-subtext">This Month</div>
                            <div class="trend-up metric-trend"><i class="bi bi-arrow-up-right"></i> {{ number_format($data['premium_members_this_month'] ?? 0) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Revenue Overview -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card" style="overflow: hidden;">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Revenue Overview</h3>
                    <a href="{{ url('transaction/transaction_list') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none; white-space: nowrap;">View All</a>
                </div>
                <div class="dashboard-card-body position-relative pb-0 d-flex flex-column">
                    <div class="mb-4">
                        <div class="rev-month-label">This Month ({{ date('M') }})</div>
                        <div class="d-flex align-items-end gap-3">
                            <div class="rev-num-lg">${{ number_format($data['this_month_revenue'] ?? 0) }}</div>
                            <div class="{{ ($data['revenue_trend'] ?? 0) >= 0 ? 'trend-up' : 'trend-down' }} rev-trend">
                                <i class="bi bi-arrow-{{ ($data['revenue_trend'] ?? 0) >= 0 ? 'up' : 'down' }}-right"></i> {{ abs($data['revenue_trend'] ?? 0) }}%
                            </div>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="rev-month-label">Last Month</div>
                        <div class="rev-num-sm">${{ number_format($data['last_month_revenue'] ?? 0) }}</div>
                    </div>
                    <!-- Mini Chart Canvas -->
                    <div class="flex-grow-1 rev-chart-wrap">
                        <canvas id="revenueMiniChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Featured vs Regular Properties -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title feat-card-title">Featured vs Regular Properties</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none; white-space: nowrap;">View All</a>
                </div>
                <div class="dashboard-card-body d-flex flex-row align-items-center justify-content-between">
                    @php
                        $featured = $data['featured_properties'] ?? 0;
                        $regular = $data['regular_properties'] ?? 0;
                        $totalProp = max(1, $featured + $regular);
                        $featPct = round(($featured / $totalProp) * 100, 1);
                        $regPct = round(($regular / $totalProp) * 100, 1);
                    @endphp
                    <div class="text-left" style="flex: 1;">
                        <div class="feat-lbl-blue">Featured</div>
                        <div class="feat-num-blue">{{ number_format($featured) }}</div>
                        <div class="feat-subtext">({{ $featPct }}%)</div>
                    </div>
                    <div class="feat-chart-wrap" style="flex: 0 0 160px;">
                        <canvas id="featuredRegularChart"></canvas>
                        <div class="feat-chart-star">
                            <i class="bi bi-star-fill"></i>
                        </div>
                    </div>
                    <div class="text-right" style="flex: 1; text-align: right;">
                        <div class="feat-lbl-dark">Regular</div>
                        <div class="feat-num-green">{{ number_format($regular) }}</div>
                        <div class="feat-subtext">({{ $regPct }}%)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── LOCATIONS & PROPERTY TYPES ROW ── -->
    <div class="row dashboard-section">
        <!-- Top Cities -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Top Cities</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @if(isset($data['top_cities']) && count($data['top_cities']) > 0)
                            @foreach($data['top_cities'] as $city)
                            <div class="list-item">
                                <div class="list-icon icon-sky bg-opacity-50"><i class="bi bi-geo-alt"></i></div>
                                <div class="list-info">
                                    <div class="list-title">{{ $city->city_name ?: 'Unknown City' }}</div>
                                    <div class="list-subtitle">{{ number_format($city->total) }} Properties</div>
                                </div>
                                @if(isset($city->trend))
                                    <div class="{{ $city->trend >= 0 ? 'trend-up' : 'trend-down' }} list-action">
                                        <i class="bi bi-arrow-{{ $city->trend >= 0 ? 'up' : 'down' }}-right"></i> {{ abs($city->trend) }}%
                                    </div>
                                @endif
                            </div>
                            @endforeach
                        @else
                            <div class="p-3 text-center text-muted">No city data available</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Areas -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Top Areas</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @if(isset($data['top_locations']) && count($data['top_locations']) > 0)
                            @foreach($data['top_locations'] as $location)
                            <div class="list-item">
                                <div class="list-icon icon-indigo bg-opacity-50"><i class="bi bi-geo"></i></div>
                                <div class="list-info">
                                    <div class="list-title">{{ $location->locality_name ?: 'Unknown Area' }}</div>
                                    <div class="list-subtitle">{{ number_format($location->total) }} Properties</div>
                                </div>
                                @if(isset($location->trend))
                                    <div class="{{ $location->trend >= 0 ? 'trend-up' : 'trend-down' }} list-action">
                                        <i class="bi bi-arrow-{{ $location->trend >= 0 ? 'up' : 'down' }}-right"></i> {{ abs($location->trend) }}%
                                    </div>
                                @endif
                            </div>
                            @endforeach
                        @else
                            <div class="p-3 text-center text-muted">No area data available</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Popular Property Types -->
        <div class="col-lg-4 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Popular Property Types</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @forelse($data['popular_property_types'] ?? [] as $ptype)
                        <div class="list-item">
                            <div class="list-icon icon-blue bg-opacity-50"><i class="bi {{ $ptype->icon }}"></i></div>
                            <div class="list-info">
                                <div class="list-title">{{ $ptype->title }}</div>
                            </div>
                            <div class="list-action d-flex align-items-center gap-2">
                                <span style="font-size: 0.85rem; font-weight: 700;">{{ $ptype->count }}</span> <span style="font-size: 0.75rem; color: #64748b; font-weight: 500;">({{ $ptype->percentage }}%)</span>
                            </div>
                        </div>
                        @empty
                        <div class="text-center p-3 text-muted" style="font-size: 0.85rem;">No property types found</div>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── RECENT TABLES ROW ── -->
    <div class="row dashboard-section">
        <!-- Recent Properties Table -->
        <div class="col-lg-6 mb-4 d-flex">
            <div class="dashboard-card w-100 flex-grow-1">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Recent Properties</h3>
                    <a href="{{ url('allproperties/all-property-view') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none; white-space: nowrap;">View All</a>
                </div>
                <div class="table-responsive flex-grow-1 w-100 border-0 m-0" style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                    <table class="table modern-table mb-0 h-100 text-nowrap">
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if(isset($data["properties_lists"]) && count($data["properties_lists"]) > 0)
                                @foreach ($data["properties_lists"]->take(5) as $property)
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
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center gap-3">
                                            <img src="{{ $imageToShow }}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; flex-shrink: 0;">
                                            <div style="min-width: 0; flex-grow: 1;">
                                                <div class="fw-bold text-dark text-truncate" style="font-size: 0.75rem;">{{ $property->name }}</div>
                                                <div class="text-muted text-truncate" style="font-size: 0.7rem;">{{ get_name_by_id("locality_names", "locality_id", optional($property->location)->locality, "en") ?? "N/A" }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span style="font-size: 0.75rem; color: #475569;">For {{ ucfirst($property->settings->post_for ?? "Sale") }}</span></td>
                                    <td><span style="font-size: 0.75rem; color: #475569;">{{ get_name_by_id("city_names", "city_id", optional($property->location)->city, "en") ?? "N/A" }}</span></td>
                                    <td><span class="fw-bold text-dark" style="font-size: 0.75rem;">${{ number_format($property->settings->expected_price ?? 0) }}</span></td>
                                    <td>
                                        @if($property->status == 1)
                                            <span class="badge-soft-success">Active</span>
                                        @elseif($property->status == 2)
                                            <span class="badge-soft-warning">Pending</span>
                                        @else
                                            <span class="badge-soft-danger">Sold</span>
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            @else
                                <tr><td colspan="5" class="text-center text-muted py-4">No records found.</td></tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Recent Enquiries Table -->
        <div class="col-lg-6 mb-4 d-flex">
            <div class="dashboard-card w-100 flex-grow-1">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Recent Enquiries</h3>
                    <a href="{{ url('enquiry/list') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none; white-space: nowrap;">View All</a>
                </div>
                <div class="table-responsive flex-grow-1 w-100 border-0 m-0" style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                    <table class="table modern-table mb-0 h-100 text-nowrap">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Property</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if(isset($data["recent_enquiries"]) && count($data["recent_enquiries"]) > 0)
                                @foreach ($data["recent_enquiries"]->take(5) as $enquiry)
                                <tr>
                                    <td style="min-width: 0;">
                                        <div class="fw-bold text-dark text-truncate" style="font-size: 0.75rem;">{{ $enquiry->customer ?? 'Guest' }}</div>
                                        <div class="text-muted text-truncate" style="font-size: 0.7rem;">{{ strtolower(str_replace(' ', '', $enquiry->customer ?? 'guest')) }}@example.com</div>
                                    </td>
                                    <td style="min-width: 0;">
                                        <div class="text-truncate" style="font-size: 0.75rem; color: #475569;">{{ $enquiry->property_name ?? 'General Inquiry' }}</div>
                                    </td>
                                    <td><span style="font-size: 0.75rem; color: #475569;">Sale</span></td>
                                    <td><span style="font-size: 0.75rem; color: #475569; white-space: nowrap;">{{ date("M d, Y", strtotime($enquiry->created_at)) }}</span></td>
                                    <td>
                                        @if($enquiry->status == 1)
                                            <span class="badge-soft-blue">New</span>
                                        @elseif($enquiry->status == 2)
                                            <span class="badge-soft-warning">Contacted</span>
                                        @elseif($enquiry->status == 0)
                                            <span class="badge-soft-success">Closed</span>
                                        @else
                                            <span class="badge-soft-purple">Pending</span>
                                        @endif
                                    </td>
                                </tr>
                                @endforeach
                            @else
                                <tr><td colspan="5" class="text-center text-muted py-4">No records found.</td></tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- ── MEMBERSHIPS & AGENTS ROW ── -->
    <div class="row dashboard-section">
        <!-- Membership Plans -->
        <div class="col-xl-7 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Membership Plans</h3>
                    <a href="{{ url('membership/plan') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All Plans</a>
                </div>
                <div class="dashboard-card-body p-4">
                    <div class="row g-4">
                        @if(isset($data['membership_plans']) && count($data['membership_plans']) > 0)
                            @foreach($data['membership_plans'] as $index => $plan)
                                @php
                                    $isPopular = $index == 1; // Highlight the 2nd one
                                @endphp
                                <div class="col-md-4">
                                    <div class="text-center p-4 rounded-4 {{ $isPopular ? 'position-relative' : '' }}" style="border: {{ $isPopular ? '2px solid #3b82f6' : '1px solid #e2e8f0' }}; background: #fff; height: 100%;">
                                        @if($isPopular)
                                            <div class="position-absolute" style="top: -12px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: #fff; padding: 2px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Popular</div>
                                        @endif
                                        <div class="fw-bold text-dark mb-2" style="font-size: 1.1rem;">{{ $plan->name ?: 'Plan' }}</div>
                                        <div class="mb-3">
                                            <span style="font-size: 2rem; font-weight: 800; color: #1e293b;">${{ number_format($plan->price) }}</span>
                                            <span class="text-muted" style="font-size: 0.85rem;">/month</span>
                                        </div>
                                        <div class="text-muted mb-4" style="font-size: 0.85rem;">For members</div>
                                        <a href="{{ url('membership/plan') }}" class="btn {{ $isPopular ? 'btn-primary' : 'btn-outline-secondary' }} w-100 rounded-pill" style="font-size: 0.85rem; font-weight: 600;">View Details</a>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="col-12 text-center text-muted py-4">No plans available.</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Top Performing Agents -->
        <div class="col-xl-5 mb-4">
            <div class="dashboard-card h-100-card">
                <div class="dashboard-card-header">
                    <h3 class="dashboard-card-title">Top Performing Agents</h3>
                    <a href="{{ url('member/memberUser/Agent') }}" style="font-size: 0.85rem; font-weight: 600; text-decoration: none;">View All</a>
                </div>
                <div class="dashboard-card-body p-0">
                    <div class="list-group list-group-flush px-3 py-2">
                        @if(isset($data['top_agents']) && count($data['top_agents']) > 0)
                            @foreach($data['top_agents'] as $agent)
                                @php
                                    $bgColors = ['eff6ff', 'f5f3ff', 'fff7ed'];
                                    $textColors = ['3b82f6', '8b5cf6', 'f97316'];
                                    $colorIndex = $loop->index % 3;
                                    $bg = $bgColors[$colorIndex];
                                    $color = $textColors[$colorIndex];
                                    
                                    $relativePath = 'user_upload/profile_image/' . $agent->image;
                                    $localPath = public_path($relativePath);
                                    $imageToShow = ($agent->image && file_exists($localPath)) 
                                        ? asset($relativePath) 
                                        : "https://ui-avatars.com/api/?name=" . urlencode($agent->name) . "&background={$bg}&color={$color}";
                                @endphp
                                <div class="list-item d-flex align-items-center justify-content-between border-0 border-bottom py-3">
                                    <div class="d-flex align-items-center" style="width: 45%;">
                                        <img src="{{ $imageToShow }}" class="rounded-circle me-3" style="width: 45px; height: 45px; object-fit: cover;">
                                        <div class="list-title mb-0" style="font-weight: 600; font-size: 0.9rem; color: #1e293b;">{{ $agent->name }}</div>
                                    </div>
                                    <div class="list-subtitle mb-0 text-start" style="width: 30%; color: #64748b; font-size: 0.85rem;">
                                        {{ $agent->properties_count }} Properties
                                    </div>
                                    <div class="text-end" style="width: 25%;">
                                        <div class="fw-bold text-dark" style="font-size: 0.9rem;">${{ number_format($agent->properties_count * 1250) }}</div>
                                        <div class="text-muted fw-semibold" style="font-size: 0.85rem;">Total Sales</div>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="text-center text-muted py-4">No agents found.</div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ── FOOTER QUICK LINKS ── -->
    <div class="row g-3 mb-4 mt-2">
        <div class="col-xl col-lg-4 col-md-6">
            <a href="{{ url('post-property') }}" class="d-flex align-items-center gap-3 text-decoration-none bg-white p-3 rounded-4 shadow-sm h-100" style="color: inherit; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 .125rem .25rem rgba(0,0,0,.075)';">
                <div class="icon-blue" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                    <i class="bi bi-house-add"></i>
                </div>
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Add New Property</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Create a new listing</div>
                </div>
            </a>
        </div>
        <div class="col-xl col-lg-4 col-md-6">
            <a href="{{ url('member/memberUser/Agent') }}" class="d-flex align-items-center gap-3 text-decoration-none bg-white p-3 rounded-4 shadow-sm h-100" style="color: inherit; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 .125rem .25rem rgba(0,0,0,.075)';">
                <div class="icon-indigo" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                    <i class="bi bi-person-plus"></i>
                </div>
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Add New Agent</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Register a new agent</div>
                </div>
            </a>
        </div>
        <div class="col-xl col-lg-4 col-md-6">
            <a href="{{ url('member/memberUser') }}" class="d-flex align-items-center gap-3 text-decoration-none bg-white p-3 rounded-4 shadow-sm h-100" style="color: inherit; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 .125rem .25rem rgba(0,0,0,.075)';">
                <div class="icon-purple" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                    <i class="bi bi-people"></i>
                </div>
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Manage Users</div>
                    <div class="text-muted" style="font-size: 0.75rem;">View all users</div>
                </div>
            </a>
        </div>
        <div class="col-xl col-lg-4 col-md-6">
            <a href="{{ url('Settings') }}" class="d-flex align-items-center gap-3 text-decoration-none bg-white p-3 rounded-4 shadow-sm h-100" style="color: inherit; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 .125rem .25rem rgba(0,0,0,.075)';">
                <div class="icon-sky" style="width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                    <i class="bi bi-gear"></i>
                </div>
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">System Settings</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Configure system</div>
                </div>
            </a>
        </div>
    </div>
    
    <!-- ── FEATURES ── -->
    <div class="d-flex flex-wrap align-items-center justify-content-between rounded-4 rounded-xl-pill px-4 py-3 mb-4 shadow-sm gap-3" style="background: #f8fafc; border: 1px solid #e2e8f0;">
        <div class="d-flex align-items-center gap-3">
            <div class="icon-blue" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="bi bi-activity"></i></div>
            <div>
                <div class="fw-bold text-dark" style="font-size: 0.85rem;">99.9% Uptime</div>
                <div class="text-muted" style="font-size: 0.75rem;">Your platform is running smoothly</div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="icon-indigo" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="bi bi-headset"></i></div>
            <div>
                <div class="fw-bold text-dark" style="font-size: 0.85rem;">24/7 Support</div>
                <div class="text-muted" style="font-size: 0.75rem;">We're here to help you anytime</div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="icon-sky" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="bi bi-shield-check"></i></div>
            <div>
                <div class="fw-bold text-dark" style="font-size: 0.85rem;">Secure Platform</div>
                <div class="text-muted" style="font-size: 0.75rem;">Your data is safe with us</div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="icon-purple" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="bi bi-cloud-arrow-up"></i></div>
            <div>
                <div class="fw-bold text-dark" style="font-size: 0.85rem;">Regular Backups</div>
                <div class="text-muted" style="font-size: 0.75rem;">Daily automated backups</div>
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

        // Revenue Mini Chart
        const revCtx = document.getElementById('revenueMiniChart');
        if (revCtx) {
            let revGradient = revCtx.getContext('2d').createLinearGradient(0, 0, 0, 110);
            revGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)'); // green with opacity
            revGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

            new Chart(revCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: @json($data['chart_labels'] ?? []),
                    datasets: [{
                        data: @json($data['chart_revenue'] ?? []),
                        borderColor: '#10b981',
                        backgroundColor: revGradient,
                        borderWidth: 2,
                        tension: 0, // straight lines
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: { 
                        x: { display: false }, 
                        y: { display: false } 
                    },
                    layout: { padding: { left: 0, right: 0, bottom: -10, top: 10 } }
                }
            });
        }

        // Featured vs Regular Donut
        const featCtx = document.getElementById('featuredRegularChart');
        if (featCtx) {
            new Chart(featCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Featured', 'Regular'],
                    datasets: [{
                        data: [
                            {{ $data['featured_properties'] ?? 0 }}, 
                            {{ $data['regular_properties'] ?? 0 }}
                        ],
                        backgroundColor: ['#e2e8f0', '#10b981'], // light gray and green
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%', // reverted to slightly thicker to match design
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    });
</script>
@endif
@endpush
