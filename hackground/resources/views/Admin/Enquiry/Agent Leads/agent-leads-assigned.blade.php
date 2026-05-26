@extends('Admin.layouts.app')

@section('content')

<div class="body-page-loader d-none">
    <div class="loader">
        <div class="line-scale-pulse-out">
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
            <div class="bg-warning"></div>
        </div>
    </div>
</div>

<div class="app-main__inner">

    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>{{ $main_title }}
                    <div class="page-title-subheading">{{ $second_title }} &gt; {{ $title }}</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">{{ $main_title }}</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>
    <style>
        .advance-search-panel {
            background-color: #fff;
            box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
            padding: 1rem;
            margin-top: 1rem;
        }

        /* Modern Lead Management UI updates */
        .custom-card {
            background: #ffffff;
            border: 1px solid #eef2f6;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        .custom-card-header {
            padding: 1.25rem 1.5rem;
            background: #ffffff;
            border-bottom: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .custom-card-header h4 {
            font-size: 1.15rem;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .custom-card-header h4 i {
            font-size: 1.25rem;
            color: #3b82f6;
            background: #eff6ff;
            padding: 0.5rem;
            border-radius: 8px;
        }
        .custom-card-body {
            padding: 1.5rem;
        }
        
        /* Lead Details Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem 2.5rem;
        }
        @media (max-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
        .info-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding-bottom: 0.85rem;
            border-bottom: 1px dotted #e2e8f0;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-icon-container {
            width: 38px;
            height: 38px;
            background-color: #eff6ff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .info-icon-container i {
            color: #3b82f6;
            font-size: 1rem;
        }
        .info-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.92rem;
            color: #334155;
            flex-grow: 1;
        }
        .info-label {
            font-weight: 600;
            color: #1e293b;
            width: 140px;
            flex-shrink: 0;
        }
        .info-colon {
            color: #64748b;
            margin-right: 0.5rem;
            flex-shrink: 0;
        }
        .info-value {
            color: #475569;
            word-break: break-word;
        }
        
        /* Calendar Badge */
        .calendar-badge {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 8px;
            padding: 0.4rem 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .calendar-badge-icon {
            width: 32px;
            height: 32px;
            background: #3b82f6;
            color: #ffffff;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        }
        .calendar-badge-text {
            display: flex;
            flex-direction: column;
            line-height: 1.25;
        }
        .calendar-badge-label {
            font-size: 0.72rem;
            font-weight: 500;
            color: #64748b;
        }
        .calendar-badge-value {
            font-size: 0.88rem;
            font-weight: 700;
            color: #1e293b;
        }

        /* Navigation Tabs */
        .custom-tabs-container {
            margin-bottom: 1.5rem;
        }
        .custom-tabs {
            display: flex;
            gap: 0.75rem;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .custom-tab-link {
            display: inline-block;
            padding: 0.5rem 1.25rem;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            text-decoration: none !important;
            transition: all 0.2s ease;
        }
        .custom-tab-link.active {
            background-color: #0d6efd;
            color: #ffffff !important;
            box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
            border: 1px solid #0d6efd;
        }
        .custom-tab-link:not(.active) {
            background-color: #ffffff;
            color: #475569 !important;
            border: 1px solid #e2e8f0;
        }
        .custom-tab-link:not(.active):hover {
            background-color: #f8fafc;
            border-color: #cbd5e1;
        }

        /* Modern Table styling */
        .custom-table {
            width: 100%;
            border-collapse: collapse;
        }
        .custom-table th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 600;
            font-size: 0.85rem;
            padding: 1rem;
            text-transform: capitalize;
            border-bottom: 1px solid #e2e8f0;
        }
        .custom-table td {
            padding: 1rem;
            font-size: 0.9rem;
            color: #334155;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }
        .custom-table tr:hover td {
            background-color: #f8fafc;
        }
        
        /* Green Assign Button */
        .btn-assign {
            background-color: #198754;
            color: #ffffff !important;
            border: none;
            padding: 0.5rem 1.25rem;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: background-color 0.2s ease;
            box-shadow: 0 4px 10px rgba(25, 135, 84, 0.15);
            cursor: pointer;
        }
        .btn-assign:hover {
            background-color: #157347;
        }

        /* Custom Checkbox */
        .custom-checkbox-input {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #0d6efd;
            vertical-align: middle;
        }

        /* Pagination and Footer Styling */
        .custom-table-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.25rem 1.5rem;
            background: #ffffff;
            border-top: 1px solid #f1f5f9;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .custom-table-info {
            font-size: 0.85rem;
            color: #64748b;
        }
        
        .agent-name-cell { display: flex; align-items: center; gap: 10px; }
        .agent-avatar {
            width: 34px; height: 34px; border-radius: 50%;
            background: #0d6efd;
            color: #fff; font-size: 13px; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .agent-name-text { font-weight: 600; color: #1e293b; }
        .agent-id-badge {
            display: inline-block;
            padding: 3px 10px;
            background: rgba(13, 110, 253, 0.09);
            border-radius: 20px;
            font-size: 12px; font-weight: 600; color: #0d6efd;
        }
        .leads-bar-wrap {
            display: flex; align-items: center; gap: 10px;
        }
        .leads-bar-bg {
            flex: 1; height: 6px; border-radius: 99px;
            background: #e2e8f0; overflow: hidden;
            min-width: 80px;
        }
        .leads-bar-fill {
            height: 100%; border-radius: 99px;
            background: linear-gradient(90deg, #0d6efd, #4799eb);
        }
        .leads-bar-text { font-size: 12px; font-weight: 600; color: #64748b; white-space: nowrap; }
        .badge-date {
            display: inline-block;
            padding: 3px 10px;
            background: #f1f5f9;
            border-radius: 20px;
            font-size: 12px; font-weight: 500; color: #64748b;
        }
        .btn-remove-assign {
            display: inline-flex; align-items: center;
            width: 30px; height: 30px;
            border-radius: 8px;
            background: rgba(239,68,68,.08);
            color: #ef4444;
            justify-content: center;
            cursor: pointer; border: none;
            transition: all .15s;
        }
        .btn-remove-assign:hover { background: rgba(239,68,68,.18); }
        .empty-state {
            padding: 60px 20px;
            text-align: center; color: #94a3b8;
        }
        .empty-state i { font-size: 36px; margin-bottom: 12px; display: block; }
        .empty-state p { font-size: 14px; margin: 0; }
    </style>

    <div class="custom-card">
        <div class="custom-card-header">
            <h4><i class="pe-7s-note2"></i> Lead Details</h4>
            <div class="calendar-badge">
                <div class="calendar-badge-icon">
                    <i class="fa fa-calendar"></i>
                </div>
                <div class="calendar-badge-text">
                    <span class="calendar-badge-label">Posted On</span>
                    <span class="calendar-badge-value">{{ $enquiry?->created_at ? date('d-M-Y', strtotime($enquiry?->created_at)) : 'N/A' }}</span>
                </div>
            </div>
        </div>
        <div class="custom-card-body">
            <div class="info-grid">
                <!-- Left Column -->
                <div class="d-flex flex-column gap-2">
                    <div class="info-item">
                        <div class="info-icon-container">
                            <i class="fa fa-user"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Name</span>
                            <span class="info-colon">:</span>
                            <span class="info-value">{{ $enquiry?->name ?? 'N/A' }}</span>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon-container">
                            <i class="fa fa-phone"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Phone</span>
                            <span class="info-colon">:</span>
                            <span class="info-value">{{ $enquiry?->phone ?? 'N/A' }}</span>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon-container">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Email</span>
                            <span class="info-colon">:</span>
                            <span class="info-value">{{ $enquiry?->email ?? 'N/A' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="d-flex flex-column gap-2">
                    <div class="info-item">
                        <div class="info-icon-container">
                            <i class="fa fa-calendar"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Posted On</span>
                            <span class="info-colon">:</span>
                            <span class="info-value">{{ $enquiry?->created_at ? date('d-M-Y', strtotime($enquiry?->created_at)) : 'N/A' }}</span>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-icon-container">
                            <i class="fa fa-comment"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Message</span>
                            <span class="info-colon">:</span>
                            <span class="info-value">{{ $enquiry?->messsage ?? 'N/A' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="custom-tabs-container">
        <ul class="custom-tabs">
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/general-agent-leads-assign-list/' . $enquiry?->id) ? 'active' : '' }}"
                    href="{{ url('enquiry/general-agent-leads-assign-list/' . $enquiry?->id) }}" data-url="{{ url('enquiry/general-agent-leads-assign-list/' . $enquiry?->id) }}">
                    Unassigned
                </a>
            </li>
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/general-agent-leads-assign-list/assigned/' . $enquiry?->id) ? 'active' : '' }}"
                    href="{{ url('enquiry/general-agent-leads-assign-list/assigned/' . $enquiry?->id) }}" data-url="{{ url('enquiry/general-agent-leads-assign-list/assigned/' . $enquiry?->id) }}">
                    Assigned
                </a>
            </li>
        </ul>
    </div>

    <div class="custom-card">
        <div class="custom-card-header">
            <h4><i class="pe-7s-users"></i> {{ $main_title }}</h4>
            @if(!$assigned)
            <div>
                <button type="button" class="btn-assign" onclick="assign()">
                    <i class="fa fa-user-plus"></i> Assign
                </button>
            </div>
            @endif
        </div>
        <div class="custom-card-body p-0">
            <div class="table-responsive" id="assign_table">
                <form id="assign-form">
                    <input type="hidden" name="enquery_id" value="{{ $enquiry->id }}" />
                    <table id="myTable" class="custom-table mb-0">
                        <thead>
                            <tr>
                                @if(!$assigned)
                                <th style="width:10%; text-align: center;">Check</th>
                                @endif
                                <th style="width:15%">User ID</th>
                                <th style="width:45%">Agent Name</th>
                                <th style="width:30%">Leads (Used / Total)</th>
                                @if($assigned)
                                <th style="width:25%">Assigned Date</th>
                                <th style="width:10%; text-align: center;">Action</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($agent_list as $item)
                            @php
                                if (!$assigned) {
                                    $leads = $item->membership->leads ?? 0;
                                    $leads_used = $item->membership->leads_used ?? 0;
                                } else {
                                    $leads = $item->leads ?? 0;
                                    $leads_used = $item->leads_used ?? 0;
                                }
                                $is_clickable = $leads > $leads_used ? 1 : 0;
                                $initials = strtoupper(substr($item->name ?? 'A', 0, 1));
                            @endphp
                            <tr>
                                @if(!$assigned)
                                <td style="text-align: center;">
                                    <input name="userid[]" value="{{ $item->id }}" type="checkbox" class="custom-checkbox-input user-selected" {{ !$is_clickable ? 'disabled' : '' }} />
                                </td>
                                @endif
                                <td><span class="agent-id-badge">#{{ $item->id }}</span></td>
                                <td>
                                    <div class="agent-name-cell">
                                        <div class="agent-avatar">{{ $initials }}</div>
                                        <span class="agent-name-text">{{ $item->name }}</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="leads-bar-wrap">
                                        <div class="leads-bar-bg">
                                            <div class="leads-bar-fill" style="width:{{ $leads > 0 ? min(100, round(($leads_used / $leads) * 100)) : 0 }}%;"></div>
                                        </div>
                                        <span class="leads-bar-text">{{ $leads_used }}/{{ $leads }}</span>
                                    </div>
                                </td>
                                @if($assigned)
                                <td>
                                    <span class="badge-date text-nowrap">
                                        {{ $item->created_at ? date('d-M-Y', strtotime($item->created_at)) : '—' }}
                                    </span>
                                </td>
                                <td style="text-align: center;">
                                    <button type="button" class="btn-remove-assign"
                                        data-bs-toggle="tooltip" data-bs-placement="top"
                                        data-bs-title="Remove from assigned list"
                                        onclick="remove_assigned('{{ $item->assign_id }}')">
                                        <i class="fa fa-trash fa-sm"></i>
                                    </button>
                                </td>
                                @endif
                            </tr>
                            @empty
                            <tr>
                                <td colspan="{{ !$assigned ? 4 : 6 }}" class="text-center py-4 text-muted">
                                    <i class="fa fa-info-circle me-1"></i> Sorry, no records found!
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </form>
            </div>

            <div class="custom-table-footer">
                <div class="custom-table-info">
                    Showing {{ $agent_list->firstItem() ?? 0 }} to {{ $agent_list->lastItem() ?? 0 }} of {{ $agent_list->total() ?? 0 }} entries
                </div>
                <div>
                    {!! $agent_list->links('vendor.pagination.bootstrap-5') !!}
                </div>
            </div>

        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
    function assign() {
        var formId = $("#assign-form");
        var ln = $('#assign-form input[name="userid[]"]:checked').length;
        if (ln > 0) {
            $.ajax({
                type: 'POST',
                url: '{{ url("/enquiry/general-save-assign-list") }}',
                data: $(formId).serialize(),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == 'OK') {
                        Swal.fire({
                            title: "Success!",
                            text: 'Lead assigned to member(s) successfully !',
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = location.href;
                            }
                        });
                    } else {
                        Swal.fire({
                            title: "Failed!",
                            text: 'Failed to assign members',
                            icon: "error",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = res.redirect;
                            }
                        });
                    }
                }
            });
        } else {
            Swal.fire({
                title: "Warning!",
                text: 'Please select member(s)',
                icon: "warning",
                confirmButtonText: "OK"
            });
        }
    }

    function remove_assigned(assign_id) {
        if (assign_id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Are you sure want to remove from assigned list?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'POST',
                        url: '{{ url("/enquiry/remove-assign-list") }}',
                        data: {
                            assign_id: assign_id
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType: 'JSON',
                        success: function(res) {
                            if (res.status == 'OK') {
                                Swal.fire({
                                    title: "Success!",
                                    text: 'Member removed from assigned list.',
                                    icon: "success",
                                    confirmButtonText: "OK"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location = location.href;
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }

    $(document).ready(function() {
        var tooltipEls = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipEls.forEach(function(el) { new bootstrap.Tooltip(el); });

        var table = $('#myTable').DataTable({
            paging: false,
            searching: false,
            info: false,
            ordering: true,
            order: [[1, 'asc']],
            columnDefs: [
                { orderable: false, targets: [0] }
            ]
        });
    });
</script>

@endpush
