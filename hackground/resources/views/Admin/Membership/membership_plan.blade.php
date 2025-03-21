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
                <div>Membership Plan Management <div class="page-title-subheading">Membership Plan Management &gt; All Membership Plan List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="https://scriptlisting.com/selfgood-live/hackground/">
                            Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan Management</li>
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
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Membership Plan Management <div
                    class="btn-actions-pane-right">
                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                    {{-- @if (in_array('MEN0006_Add', $rolePermissions)) --}}
                    <button type="button" class="btn btn-site btn-sm btn-primary" id='addMembershipPlan'>Add Membership Plan </button>
                    {{-- @endif --}}
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="table">
                    <thead>
                        <tr>
                            <th style="width:35%">Plan</th>
                            <th style="width:20%">Price</th>
                            <th style="width:20%">Duration</th>
                            <th style="width:10%">Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="membershipPlan">
                        @foreach ($MembershipPlans as $membershipPlan)
                        <tr>
                            <td>{{$membershipPlan->english_name}}</td>
                            <td>{{ $membershipPlan->price }}</td>
                            <td>{{ $membershipPlan->validity_days }} Days</td>
                            <td>
                                <input data-id="{{ $membershipPlan->id }}" class="membershipPlanStatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $membershipPlan->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md editButton"
                                    data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                                <i class="fa fa-trash text-danger fa-md membershipPlanDeleteButton"
                                    data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>

                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="MembershipPlanModal" tabindex="-1" role="dialog" aria-labelledby="MembershipPlanAddEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="MembershipPlanAddEditModalLabel"> </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="MembershipPlanformData">
                    @csrf
                    <!-- Hidden input for user ID -->
                    <input type="text" class='d-none' id="membershipPlanId" name="id">

                    <div class="form-group">
                        <label for="Name">Name</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                        <div class="invalid-feedback" id="name_error"></div>
                        <div id="addMembershipPlanErrorContainer"></div>
                        <div id="editMembershipPlanErrorContainer"></div>

                    </div>

                    <div class="form-group">
                        <label for="Name">Slug</label>
                        <input type="text" class="form-control" id="slug" name="slug" required>
                        <div class="invalid-feedback" id="slug_error"></div>
                        <div id="addMembershipPlanErrorContainer"></div>
                        <div id="editMembershipPlanErrorContainer"></div>

                    </div>


                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="radio-inline">
                            <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked
                                required>
                            <label for="status_1">Active</label>
                            <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                            <label for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="MembershipPlanButton" class="btn btn-primary"></button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')


@endpush