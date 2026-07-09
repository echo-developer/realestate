@extends('Admin.layouts.app')

@php
$userTypes = [
'B' => 'Builder',
'O' => 'Owner',
'A' => 'Agent',
];
@endphp

@section('content')
<style>
/* Page & Container */
.app-main__inner { 
    background-color: #fcfcfc; 
    padding: 1.5rem !important; 
    font-family: 'Inter', sans-serif; 
    box-sizing: border-box !important;
    min-width: 0 !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
}


/* Tabs & Search Row */
.tabs-search-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.custom-tabs-card { background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: inline-flex; padding: 0 0.5rem; border: 1px solid #f1f5f9; }
.custom-tabs { display: flex; gap: 0.5rem; list-style: none; margin: 0; padding: 0; }
.custom-tabs .nav-item { display: flex; }
.custom-tabs .nav-item .nav-link { color: #64748b; font-weight: 700; font-size: 0.95rem; padding: 0.85rem 1.25rem; border-bottom: 2px solid transparent; transition: all 0.2s; text-decoration: none; display: flex; align-items: center; }
.custom-tabs .nav-item .nav-link:hover { color: #0f172a; }
.custom-tabs .nav-item .nav-link.active { color: #2563eb; border-bottom-color: #2563eb; }
.search-bar-wrapper { position: relative; width: 320px; margin-bottom: 0.6rem; }
.search-bar-wrapper input { width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.55rem 1rem; padding-right: 3rem; font-size: 0.85rem; color: #334155; outline: none; }
.search-bar-wrapper input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.search-bar-wrapper button { position: absolute; right: 0; top: 0; height: 100%; background: #2563eb; color: #fff; border: none; border-radius: 0 6px 6px 0; padding: 0 1.25rem; cursor: pointer; transition: background 0.2s; }
.search-bar-wrapper button:hover { background: #1d4ed8; }

/* Main Card */
.modern-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 1.5rem; min-width: 0; max-width: 100%; }
.modern-card-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8fafc; }
.modern-card-header h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
.btn-primary-custom { background: #2563eb; color: #fff; border: none; padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: background 0.2s; }
.btn-primary-custom:hover { background: #1d4ed8; }

/* Table */
.table-responsive { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.table-borderless { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
.table-borderless thead th { 
    background-color: #f8fafc; color: #475569; font-size: 0.75rem; font-weight: 600; 
    text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1rem !important; 
    border-bottom: 1px solid #e2e8f0; border-top: 1px solid #f1f5f9; text-align: left !important; white-space: nowrap; 
}
.table-borderless tbody td { 
    padding: 0.85rem 1rem !important; vertical-align: middle; border-bottom: 1px solid #f1f5f9; 
    color: #334155; font-size: 0.85rem; text-align: left !important; transition: background-color 0.2s ease; 
}
.table-borderless tbody tr:hover td { background-color: #fcfcfc; }
.table-borderless tbody tr:last-child td { border-bottom: none; }

/* User Column */
.user-info { display: flex; align-items: center; gap: 0.85rem; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; font-size: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.user-details { display: flex; flex-direction: column; gap: 0.15rem; text-align: left; }
.user-name { font-weight: 600; color: #0f172a; font-size: 0.9rem; white-space: nowrap; text-decoration: none; transition: color 0.2s; text-align: left; }
.user-name:hover { color: #2563eb; }
.user-role-badge { background: #e0e7ff; color: #4338ca; font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 4px; display: inline-block; width: fit-content; text-transform: uppercase; letter-spacing: 0.02em; }
.user-additional-badge { background: #f1f5f9; color: #475569; font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.2rem; border: 1px solid #e2e8f0; }

/* Contact Column */
.contact-info { display: flex; flex-direction: column; gap: 0.3rem; color: #64748b; font-size: 0.8rem; text-align: left !important; align-items: flex-start !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
.contact-info div { display: flex; align-items: center; justify-content: flex-start !important; gap: 0; text-align: left !important; margin: 0 !important; padding: 0 !important; }
.contact-info i { color: #94a3b8; width: 16px; text-align: left; margin: 0 !important; margin-right: 0.25rem !important; padding: 0 !important; font-size: 0.85rem; }

/* Badges */
.status-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; user-select: none; white-space: nowrap; }
.status-badge:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
.status-badge.verified, .status-badge.active { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.status-badge.not-verified, .status-badge.inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.status-badge i { font-size: 0.75rem; }

/* Actions */
.action-icons { display: flex; align-items: center; gap: 0.4rem; }
.action-icon { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.05rem; text-decoration: none; }
.action-icon.edit { color: #059669; background: #ecfdf5; }
.action-icon.edit:hover { background: #d1fae5; color: #047857; }
.action-icon.delete { color: #dc2626; background: #fef2f2; }
.action-icon.delete:hover { background: #fee2e2; color: #b91c1c; }
.action-icon.chat { color: #2563eb; background: #eff6ff; }
.action-icon.chat:hover { background: #dbeafe; color: #1d4ed8; }

@media (max-width: 767px) {
    /* 1. Global Reset & Spacing */
    .app-main__inner { padding: 0.75rem !important; background-color: #f8fafc; }
    .page-title-heading h1 { font-size: 1.25rem; }
    
    /* 2. Tabs & Search */
    .tabs-search-row { flex-direction: column; align-items: stretch; gap: 1rem; }
    .search-bar-wrapper { width: 100%; margin-bottom: 0; }
    .custom-tabs { overflow-x: auto; width: 100%; padding-bottom: 0.5rem; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; border-bottom: none; gap: 0.5rem; }
    .custom-tabs .nav-item .nav-link { white-space: nowrap; padding: 0.6rem 1.25rem; border: 1px solid #e2e8f0; border-radius: 20px; background: #fff; color: #64748b; font-size: 0.85rem; }
    .custom-tabs .nav-item .nav-link.active { background: #2563eb; color: #fff; border-color: #2563eb; }
    
    /* 3. Card Header */
    .modern-card { background: transparent; border: none; box-shadow: none; margin-bottom: 0; }
    .modern-card-header { flex-direction: column; align-items: stretch; gap: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .modern-card-header > div { width: 100%; }
    .btn-primary-custom { width: 100%; justify-content: center; padding: 0.65rem; }
    
    /* 4. Table to FLEX Card Transformation (Bulletproof for Mobile) */
    .table-responsive { display: block; width: 100%; overflow: visible; }
    .table-borderless { display: block; width: 100%; }
    .table-borderless thead { display: none; }
    .table-borderless tbody { display: block; width: 100%; }
    
    /* The Card Container */
    .table-borderless tr {
        display: flex; 
        flex-wrap: wrap;
        align-items: flex-start;
        background: #fff; 
        border: 1px solid #e2e8f0; 
        border-radius: 16px; 
        margin-bottom: 1.25rem; 
        padding: 1.25rem; 
        position: relative; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        z-index: 1;
        transition: z-index 0s;
    }
    .table-borderless tr:hover,
    .table-borderless tr:focus-within {
        z-index: 50 !important;
    }
    .table-borderless tr:hover td { background-color: transparent !important; }
    
    /* Reset all td defaults - CRITICAL display: block */
    .table-borderless td { 
        display: block !important; 
        border: none !important; 
        padding: 0 !important; 
        text-align: left !important; 
    }
    
    /* Empty State */
    .table-borderless td[colspan="6"] { width: 100% !important; text-align: center !important; padding: 2rem !important; }
    
    /* Cell 1: User Info */
    .table-borderless td:nth-child(1) { width: 100% !important; order: 1; padding-right: 80px !important; margin-bottom: 1rem; }
    
    /* Cell 2: Contact Info */
    /* Avatar is 36px + gap 0.85rem (13.6px) = ~50px perfect visual alignment */
    .table-borderless td:nth-child(2) { width: 100% !important; order: 2; padding-left: 50px !important; margin-bottom: 1rem; }
    .contact-info { background: #f8fafc; padding: 0.85rem !important; border-radius: 8px; border: 1px solid #f1f5f9; gap: 0.5rem; width: 100% !important; }
    .contact-info i { margin: 0 !important; margin-right: 0.5rem !important; width: 16px; text-align: center; }
    .contact-info .text-truncate { white-space: normal !important; overflow: visible !important; max-width: 100% !important; word-break: break-all; }
    
    /* Cell 3: Badges (Verify & Status) */
    .table-borderless td:nth-child(4) { width: auto !important; order: 3; padding-left: 50px !important; margin-right: 0.5rem; margin-bottom: 0.5rem; display: flex; align-items: center; }
    .table-borderless td:nth-child(5) { width: auto !important; order: 4; margin-bottom: 0.5rem; display: flex; align-items: center; }
    
    /* Cell 4: Leads Footer */
    .table-borderless td:nth-child(3) {
        width: 100% !important;
        order: 5;
        margin-top: 0.5rem;
        padding-top: 1rem !important;
        border-top: 1px dashed #e2e8f0 !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .table-borderless td:nth-child(3)::before { content: "Total Leads"; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    
    /* Cell 6: Action Icons (Absolute Top Right) */
    .table-borderless td:nth-child(6) { position: absolute; top: 1.25rem; right: 1.25rem; width: auto !important; order: 0; }
    .action-icons { gap: 0.5rem; }
    
    /* Fix Bootstrap Popper.js bug for dropdowns in absolute containers */
    .table-borderless td:nth-child(6) .dropdown-menu {
        transform: none !important;
        top: 100% !important;
        right: 0 !important;
        left: auto !important;
        margin-top: 0.5rem !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
        border: 1px solid #e2e8f0 !important;
        z-index: 1050 !important;
    }
}
</style>

<div class="app-main__inner">
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }} alert-dismissible shadow-sm">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    @endif

    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-users icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>{{ isset($typeName) ? ucwords(strtolower($typeName)) : 'All User' }}
                    <div class="page-title-subheading">Users &gt; {{ isset($typeName) ? ucwords(strtolower($typeName)) : 'Agent' }}</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                    <li class="breadcrumb-item"><a href="{{ url('member/memberUser') }}">Users</a></li>
                    <li class="breadcrumb-item active">{{ isset($typeName) ? ucwords(strtolower($typeName)) : 'Agent' }}</li>
                </ol>
            </div>
        </div>
    </div>

    @php
    if (isset($typeName)) {
        $search_url = url('member/memberUser/' . $typeName);
    } else {
        $search_url = url('member/memberUser');
    }
    @endphp

    <div class="tabs-search-row">
        <div class="custom-tabs-card">
            <ul class="custom-tabs">
                <li class="nav-item">
                    <a class="nav-link ajax-link {{ Request::is('member/memberUser') ? 'active' : '' }}" href="{{ url('member/memberUser') }}">All User</a>
                </li>
                @foreach ($userTypes as $userType => $userTypeName)
                <li class="nav-item">
                    <a class="nav-link ajax-link {{ Request::is('member/memberUser/' . $userTypeName) ? 'active' : '' }}" href="{{ url('member/memberUser/' . $userTypeName) }}">{{ $userTypeName }}</a>
                </li>
                @endforeach
            </ul>
        </div>
        
        <form action="{{ $search_url }}" method="get" class="m-0">
            <div class="search-bar-wrapper">
                <input type="text" placeholder="Search by name, email or phone..." name="term" value="{{ request('term') }}">
                <button type="submit"><i class="bi bi-search"></i></button>
            </div>
        </form>
    </div>

    <div class="modern-card">
        <div class="modern-card-header">
            <h4>{{ isset($group_key) ? $group_key . ' User' : (isset($typeName) ? $typeName . ' List' : 'User List') }}</h4>
            <div class="d-flex gap-2 align-items-center">
                <div class="btn-group" id="global_action_btn" style="display:none">
                    <button type="button" class="btn btn-default btn-sm" onclick="deleteSelected()"><i class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-default btn-sm" onclick="changeStatusAll(1)"><i class="fa fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-default btn-sm" onclick="changeStatusAll(0)"><i class="fa fa-thumbs-o-down"></i></button>
                </div>
                <button type="button" class="btn-primary-custom" id="allUsersaddButton">
                    <i class="fa fa-plus"></i> Add New {{ isset($typeName) ? $typeName : 'User' }}
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table-borderless">
                    <thead>
                        <tr>
                            <th width="25%"><div style="display: flex; justify-content: flex-start; text-align: left; width: 100%;">User</div></th>
                            <th width="25%"><div style="display: flex; justify-content: flex-start; text-align: left; width: 100%;">Details</div></th>
                            <th width="10%"><div style="display: flex; justify-content: flex-start; text-align: left; width: 100%;">Leads</div></th>
                            <th width="15%"><div style="display: flex; justify-content: flex-start; text-align: left; width: 100%;">Verify</div></th>
                            <th width="15%"><div style="display: flex; justify-content: flex-start; text-align: left; width: 100%;">Status</div></th>
                            <th width="10%"><div style="display: flex; justify-content: center; text-align: center; width: 100%;">Action</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($data as $items)
                        <tr>
                            <td>
                                <div class="user-info">
                                    @php
                                    $localPath = public_path('user_upload/profile_image/' . $items->image);
                                    $imageToShow = isset($items->image) && file_exists($localPath);
                                    @endphp
                                    @if($imageToShow)
                                        <img src="{{ asset('user_upload/profile_image/' . $items->image) }}" alt="User" class="user-avatar" />
                                    @else
                                        <div class="user-avatar" style="background-color: <?= getAvatarColor($items->name) ?>;">{{ strtoupper($items->name[0]) }}</div>
                                    @endif
                                    <div class="user-details">
                                        <a href="{{ route('memberUser.allDetails', $items->id) }}" target="_blank" class="user-name text-decoration-none">{{ $items->name }}</a>
                                        <span class="user-role-badge">{{ $userTypes[$items->user_type] ?? 'Unknown' }}</span>
                                        @if($items->userbadges && $items->userbadges->count())
                                            <div class="mt-1">
                                                @foreach($items->userbadges as $badge)
                                                @php $badgeName = $badge->names->firstWhere('lang', app()->getLocale())?->name; @endphp
                                                <span class="user-additional-badge" title="{{ $badgeName }}">
                                                    @if($badge->icon) <img src="{{ asset('user_upload/badges/' . $badge->icon) }}" alt="icon" width="14" height="14"> @endif
                                                    {{ $badgeName }}
                                                </span>
                                                @endforeach
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="contact-info">
                                    <div class="text-truncate" style="max-width: 180px;" title="{{ $items->email }}"><i class="bi bi-envelope"></i> {{ $items->email }}</div>
                                    <div><i class="bi bi-calendar3"></i> {{ date('d-M-Y', strtotime($items->created_at)) }}</div>
                                    <div><i class="bi bi-telephone"></i> {{ $items->phone }}</div>
                                </div>
                            </td>
                            <td>
                                <span style="font-weight: 600; color: #334155;">{{ memberLeadsCount($items->id) }}</span>
                            </td>
                            <td>
                                @if ($items->user_type == 'A')
                                    <span class="status-badge {{ $items->is_verified_agent ? 'verified' : 'not-verified' }} agent_verify_toggle_btn" data-id="{{ $items->id }}" data-status="{{ $items->is_verified_agent ? 1 : 0 }}">
                                        <i class="bi {{ $items->is_verified_agent ? 'bi-check-circle-fill' : 'bi-x-circle-fill' }}"></i> 
                                        <span>{{ $items->is_verified_agent ? 'Verified' : 'Not Verified' }}</span>
                                    </span>
                                @else
                                    <span class="status-badge not-verified">
                                        <i class="bi bi-x-circle-fill"></i> 
                                        <span>Not Verified</span>
                                    </span>
                                @endif
                            </td>
                            <td>
                                <span class="status-badge {{ $items->status ? 'active' : 'inactive' }} user_status_toggle_btn" data-id="{{ $items->id }}" data-status="{{ $items->status ? 1 : 0 }}">
                                    <i class="bi {{ $items->status ? 'bi-check-circle-fill' : 'bi-x-circle-fill' }}"></i> 
                                    <span>{{ $items->status ? 'Active' : 'Inactive' }}</span>
                                </span>
                            </td>
                            <td>
                                <div class="action-icons justify-content-center">
                                    <a href="javascript:void(0)" class="action-icon edit allUsersEditButton" user-id="{{ $items->id }}" title="Edit"><i class="bi bi-pencil"></i></a>
                                    <a href="javascript:void(0)" class="action-icon delete allUsersDeleteButton" user-id="{{ $items->id }}" title="Delete"><i class="bi bi-trash3"></i></a>
                                    
                                    <div class="dropdown">
                                        <a href="#" class="action-icon" data-bs-toggle="dropdown" data-bs-display="static"><i class="bi bi-three-dots-vertical"></i></a>
                                        <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0" style="border-radius: 8px;">
                                            @if ($items->user_type == 'A')
                                            <li><a class="dropdown-item assignBadgeButton" href="javascript:void(0)" data-user-id="{{ $items->id }}"><i class="bi bi-award me-2 text-primary"></i> Assign Badge</a></li>
                                            @endif
                                            <li><a class="dropdown-item" href="{{ url('allproperties/all-property-view/' . $items->id) }}"><i class="bi bi-building me-2 text-success"></i> Properties</a></li>
                                            <li><a class="dropdown-item" href="{{ url('allproject/all-project-view/' . $items->id) }}"><i class="bi bi-pie-chart me-2 text-success"></i> Projects</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">Sorry, no records found!</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <div class="p-3 border-top border-light">
                {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
    
</div>
@endsection


@section('modals')
<div class="modal fade" id="UsersModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="usersAddEditModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="UserFormData">
                    @csrf
                    <!-- Hidden input for user ID -->
                    <input type="hidden" class='d-none' id="prop_userimage" name="image">
                    <input type="text" class='d-none' id="usersId" name="usersId">

                    {{-- <div class="form-group" id="Groups">
                            <label for="Groups">User</label>
                            <select class="form-select" id="Groups_data" name="Groups" required>
                                <option value="default"></option>

                                @foreach ($Users as $user)
                            <option value="{{ strtolower($user->group_key) }}">
                    {{ $user->group_name }}
                    </option>
                    @endforeach
                    </select>

            </div> --}}
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_name" name="user_name" placeholder="" required>
                <label for="user_name">User Name</label>
                <div class="invalid-feedback" id="user_name_error"></div>

            </div>
            <div class="form-floating mb-3">
                <select name="user_type" id="user_type" class="form-select">
                    <option value="">--select--</option>
                    @foreach ($userTypes as $userType => $userTypeName)
                    <option value="{{ $userType }}">{{ $userTypeName }}</option>
                    @endforeach
                </select>
                <label for="user_type">User Type</label>
                <div class="invalid-feedback" id="user_type_error"></div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_phone" name="user_phone" placeholder="" required>
                <label for="user_phone">Phone No</label>
                <div class="invalid-feedback" id="user_phone_error"></div>
            </div>


            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="wp_num" name="wp_num" placeholder="" required>
                <label for="wp_num">Whatsapp No</label>
                <div class="invalid-feedback" id="wp_num_error"></div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="wp_num_sync" name="wp_num_sync">
                    <label class="form-check-label" for="wp_num_sync">
                        <small>Same as Phone No</small>
                    </label>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_email" name="user_email" placeholder="" required>
                <label for="user_email">Email</label>
                <div class="invalid-feedback" id="user_email_error"></div>
            </div>

            <div class="form-floating mb-3 password">
                <input type="password" class="form-control" id="password" name="password" placeholder="" required>
                <label for="password">Password</label>
                <div class="invalid-feedback" id="password_error"></div>
            </div>

            <div class="form-floating mb-3 password">

                <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" placeholder="" required>
                <label for="password_confirmation">Confirm Password</label>
                <div class="invalid-feedback" id="password_confirmation_error"></div>
            </div>

            <div class="form-group">

                <input type="file" name="Userfile" id="UserfileUpload" class="form-control" onchange="updateUserFileName()">
                <!-- <label for="ufile">Photo</label> -->

            </div>
            <div class="form-group">
                <img id="image_preview" src=" " style="display:none; width: 50px; height: auto;" />
                <button type="button" id="delete_image_btn" style="display:none;"
                    class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
            </div>

            <div class="form-group mb-0">
                <label class="form-label d-block">Status</label>
                <div class="form-check form-check-inline">
                    <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked
                        required>
                    <label class="form-check-label" for="status_1">Active</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" name="status" value=0 class="form-check-input" id="status_2">
                    <label class="form-check-label" for="status_2">Inactive</label>
                </div>
            </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" id="UsersButton" class="btn btn-primary">Save</button>
        </div>
    </div>


</div>
</div>

<div class="modal fade" id="defult-modal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="AddEditModalLabel">Assign Badges</h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="formData">
                    <input type="hidden" id="selected_user_id" name="user_id">
                    <div class="mb-3">
                        <div class="row" id="badgeCheckboxContainer">
                        @isset($badge_list)
                            @foreach($badge_list as $item)
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="badge_ids[]"
                                        value="{{ $item->badge_id }}"
                                        id="badge_{{ $item->badge_id }}">
                                    <label class="form-check-label" for="badge_{{ $item->badge_id }}">
                                        {{ $item->name }}
                                    </label>
                                </div>
                            </div>
                            @endforeach
                         @endisset
                        </div>
                        <div class="invalid-feedback d-block" id="badge_ids_error"></div>
                    </div>

                </form>
            </div>

            <div class="modal-footer">
                <button type="button" onclick="saveData()" class="btn btn-primary">Save</button>
            </div>
        </div>

    </div>
</div>
@endsection

@push('custom-js')
<script>
    $(document).ready(function() {


        const $checkbox = $('#wp_num_sync');
        const $phoneInput = $('#user_phone');
        const $whatsappInput = $('#wp_num');

        function syncWhatsappNumber() {
            if ($checkbox.prop('checked')) {
                $whatsappInput.val($phoneInput.val());
            }
        }

        $checkbox.on('change', function() {
            if ($(this).prop('checked')) {
                syncWhatsappNumber();
            } else {
                $whatsappInput.val('');
            }
        });

        $phoneInput.on('input', function() {
            syncWhatsappNumber();
        });

        if ($checkbox.prop('checked')) {
            syncWhatsappNumber();
        }






        $('#allUsersaddButton').click(function() {
            $('#image_preview').hide();
            $('#delete_image_btn').hide();
            Add_Edit_User('Add User', 'Save')
        });

        $('.allUsersEditButton').click(function() {

            var userid = $(this).attr('user-id');
            //alert(id);
            Add_Edit_User('Edit User', 'Update', userid);

        });


        function Add_Edit_User(title, button, id = '') {

            $('#usersAddEditModalLabel').text(title);
            $('#UsersButton').text(button);
            $('#UserFormData')[0].reset();
            // $('#slug').attr('readonly', false);
            $('.invalid-feedback').empty();
            $('.form-control').removeClass('is-invalid');

            if (id) {
                $.ajax({

                    url: "{{ url('member/memberUser-details') }}/" + id,
                    type: 'GET',
                    _token: '{{ csrf_token() }}',
                    dataType: 'json',
                    success: function(response) {
                        // console.log('Success:', response);
                        $('#usersId').val(response.id);
                        $('#user_name').val(response.name);
                        $('#user_type').val(response.user_type);
                        $('#user_phone').val(response.phone);
                        $('#wp_num').val(response.whatsapp_no);
                        $('#user_email').val(response.email);

                        if (response.image) {
                            $('#image_preview').attr('src',
                                    `{{ asset('user_upload/profile_image/') }}/${response.image}`)
                                .show();
                            $('#delete_image_btn').show();
                        } else {
                            $('#image_preview').hide();
                            $('#delete_image_btn').hide();
                        }

                        $('#prop_userimage').val(response.image);

                        $('input[name="status"][value="' + response.status + '"]').prop(
                            'checked', true);


                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', xhr.responseText);
                    }

                });
            }
            $('#UsersModal').modal('show');
        }


        $('#UsersButton').on('click', function(event) {
            // alert();
            event.preventDefault();


            var id = $('#usersId').val();
            var f_data = $('#UserFormData').serialize();
            var url = id ? "{{ url('member/allUser-update') }}" : "{{ url('member/member-add') }}"


            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');

            $.ajax({
                url: url,
                type: 'post',
                data: f_data,
                dataType: 'json',
                success: function(response) {
                    // console.log(response)
                    window.location.reload(true); // Reload the page
                    $('#UsersModal').modal('hide');
                    $('#UserFormData')[0].reset();
                },
                error: function(xhr) {

                    if (xhr.status === 422) {
                        var errors = xhr.responseJSON.errors;
                        console.log(errors);


                        $.each(errors, function(key, value) {
                            var field = $('#' + key);
                            var errorField = $('#' + key +
                                '_error');
                            field.addClass(
                                'is-invalid');
                            errorField.text(value[0]).show();
                        });
                    } else {

                        console.log('An error occurred:', xhr.status, xhr.statusText);
                    }
                }
            });

        });


        $('.allUsersDeleteButton').click(function() {
            if (!confirm('Are you sure you want to delete this User?')) {
                return;
            }

            var id = $(this).attr('user-id');
            //alert(id);
            // deleteRole('Edit Role', 'Update', id);


            $.ajax({

                url: "{{ url('member/memberUser-delete') }}/" + id,
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    status: "{{ config('constants.STATUS_DELETE') }}",
                },
                dataType: 'json',
                success: function(response) {
                    // console.log('Success:', response);\
                    window.location.reload(true);


                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                }

            });

        });



        $('#UserfileUpload').change(function(event) {
            var fileInput = event.target;
            var file = fileInput.files[0];

            var formData = new FormData();
            formData.append('file', file);
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: `{{ url('/member/memberUSer-image') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    $('#prop_userimage').val(response.fileName);
                    $('#image_preview').attr('src', asset('user_upload/profile_image/') +
                        response
                        .fileName).show();
                    $('#delete_image_btn').show();
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading file:', error);
                }
            });
        });

        $('.user_status_toggle_btn').click(function() {
            var $btn = $(this);
            var id = $btn.data('id');
            var currentStatus = $btn.data('status');
            var newStatus = currentStatus ? 0 : 1;

            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('member/memberUser-status') }}`,
                data: {
                    'status': newStatus,
                    'id': id
                },
                success: function(data) {
                    $btn.data('status', newStatus);
                    if(newStatus) {
                        $btn.removeClass('inactive not-verified').addClass('active verified').find('span').text('Active');
                        $btn.find('i').removeClass('bi-x-circle-fill').addClass('bi-check-circle-fill');
                    } else {
                        $btn.removeClass('active verified').addClass('inactive not-verified').find('span').text('Inactive');
                        $btn.find('i').removeClass('bi-check-circle-fill').addClass('bi-x-circle-fill');
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        });

        $('.agent_verify_toggle_btn').click(function() {
            var $btn = $(this);
            var id = $btn.data('id');
            var currentStatus = $btn.data('status');
            var newStatus = currentStatus ? 0 : 1;

            toastr.success('Verified', 'Request Status', toastrOptions);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('member/memberUser/agent-status') }}`,
                data: {
                    'status': newStatus,
                    'id': id
                },
                success: function(data) {
                    $btn.data('status', newStatus);
                    if(newStatus) {
                        $btn.removeClass('inactive not-verified').addClass('active verified').find('span').text('Verified');
                        $btn.find('i').removeClass('bi-x-circle-fill').addClass('bi-check-circle-fill');
                    } else {
                        $btn.removeClass('active verified').addClass('inactive not-verified').find('span').text('Not Verified');
                        $btn.find('i').removeClass('bi-check-circle-fill').addClass('bi-x-circle-fill');
                    }
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        });
    });


    function deleteUploadedImage() {

        var fileName = $('#prop_userimage').val();
        if (!fileName) {
            alert('No image to delete!');
            return;
        }

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            url: `{{ url('/member/delete-memberUSer-image') }}`,
            type: 'POST',
            data: {
                file: fileName
            },
            success: function(response) {
                console.log('File deleted successfully');
                $('#image_preview').attr('src', '').hide();
                $('#delete_image_btn').hide();
                $('#prop_userimage').val('');
            },
            error: function(xhr, status, error) {
                console.error('Error deleting file:', error);
            }
        });
    }
</script>


<script>
    $(document).on('click', '.assignBadgeButton', function() {
        var userId = $(this).data('user-id');
        $('#selected_user_id').val(userId);
        $.get(`{{ route('badges.get', ':id') }}`.replace(':id', userId), res => {
            $('input[name="badge_ids[]"]').prop('checked', false);

            // Then, check the assigned ones
            res.assigned.forEach(id => {
                $(`#badge_${id}`).prop('checked', true);
            });
        });
        $('#defult-modal').modal('show');
    });

    function saveData() {
        let form = $('#formData')[0];
        let formData = new FormData(form);
        $('.is-invalid').removeClass('is-invalid');

        $.ajax({
            url: `{{ route('user-badges.assgin') }}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#defult-modal').modal('hide');
                $('#formData')[0].reset();
                localStorage.setItem('successMessage', response.message);
                window.location.reload();
            },
            error: function(xhr) {
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $.each(errors, function(key, messages) {
                        let fieldId = key.replace('.', '_');
                        $('#' + fieldId).addClass('is-invalid');
                    });
                } else {
                    console.error('Error:', xhr.responseText);
                }
            }
        });
    }
</script>
@endpush