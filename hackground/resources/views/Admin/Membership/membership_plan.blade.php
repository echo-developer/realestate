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
                    <i class="pe-7s-medal icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Membership Plan <div class="page-title-subheading">Membership Plan &gt; All Membership Plan List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">
                            Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>

    <style>
/* Page & Container */
.app-main__inner { background-color: #fcfcfc; padding: 1.5rem !important; font-family: 'Inter', sans-serif; box-sizing: border-box !important; }

/* Main Card */
.modern-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 1.5rem; }
.modern-card-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8fafc; }
.modern-card-header h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
.btn-primary-custom { background: #2563eb; color: #fff; border: none; padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: background 0.2s; }
.btn-primary-custom:hover { background: #1d4ed8; }

/* Table */
.table-responsive { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.table-borderless { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
.table-borderless thead th { background-color: #f8fafc; color: #475569; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1rem !important; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #f1f5f9; text-align: left; white-space: nowrap; }
.table-borderless tbody td { padding: 0.85rem 1rem !important; vertical-align: middle; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.85rem; text-align: left; transition: background-color 0.2s ease; }
.table-borderless tbody tr:hover td { background-color: #fcfcfc; }
.table-borderless tbody tr:last-child td { border-bottom: none; }

/* Actions */
.action-icons { display: flex; align-items: center; gap: 0.4rem; }
.action-icon { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.05rem; text-decoration: none; }
.action-icon.edit { color: #059669; background: #ecfdf5; }
.action-icon.edit:hover { background: #d1fae5; color: #047857; }
.action-icon.delete { color: #dc2626; background: #fef2f2; }
.action-icon.delete:hover { background: #fee2e2; color: #b91c1c; }

@media (max-width: 767px) {
    .app-main__inner { padding: 0.75rem !important; background-color: #f8fafc; }
    .page-title-heading h1 { font-size: 1.25rem; }
    .modern-card { background: transparent; border: none; box-shadow: none; margin-bottom: 0; }
    .modern-card-header { flex-direction: column; align-items: stretch; gap: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .btn-primary-custom { width: 100%; justify-content: center; padding: 0.65rem; }
    
    /* Mobile Card Layout */
    .table-responsive { display: block; width: 100%; overflow: visible; }
    .table-borderless { display: block; width: 100%; }
    .table-borderless thead { display: none; }
    .table-borderless tbody { display: block; width: 100%; }
    
    .table-borderless tr {
        display: flex; flex-wrap: wrap; align-items: flex-start;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; 
        margin-bottom: 1.25rem; padding: 1.25rem; position: relative; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .table-borderless tr:hover td { background-color: transparent !important; }
    .table-borderless td { display: block !important; border: none !important; padding: 0 !important; text-align: left !important; }
    
    /* 1. Plan Name */
    .table-borderless td:nth-child(1) { width: 100% !important; order: 1; margin-bottom: 1rem; padding-right: 80px !important; }
    
    /* 2. Status */
    .table-borderless td:nth-child(4) { width: 100% !important; order: 2; margin-bottom: 1rem; }
    
    /* 3. Price & Duration Container */
    .table-borderless td:nth-child(2) { width: 50% !important; order: 3; background: #f8fafc; padding: 0.75rem !important; border-radius: 8px 0 0 8px; border: 1px solid #f1f5f9; border-right: none; font-size: 0.8rem; }
    .table-borderless td:nth-child(2)::before { content: "Price"; display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; font-weight: 700; }
    
    .table-borderless td:nth-child(3) { width: 50% !important; order: 4; background: #f8fafc; padding: 0.75rem !important; border-radius: 0 8px 8px 0; border: 1px solid #f1f5f9; font-size: 0.8rem; }
    .table-borderless td:nth-child(3)::before { content: "Duration"; display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; font-weight: 700; }
    
    /* 4. Action Icons */
    .table-borderless td:nth-child(5) { position: absolute; top: 1.25rem; right: 1.25rem; width: auto !important; order: 0; }
}
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    @endif
    <div class="modern-card">
        <div class="modern-card-header">
            <h4>Membership Plan</h4>
            <div class="btn-actions-pane-right d-flex gap-2">
                <div class="btn-group" id="global_action_btn" style="display:none">
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="" onclick="deleteSelected()" data-original-title="Delete selected"><i class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="" onclick="changeStatusAll(1)" data-original-title="Make active"><i class="fa fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="" onclick="changeStatusAll(0)" data-original-title="Make inactive"><i class="fa  fa-thumbs-down"></i></button>
                </div>
                <button type="button" class="btn-primary-custom" id='addMembershipPlan'><i class="bi bi-plus-lg"></i> Add Membership Plan</button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive" id="main_table">
                <table id="myTable" class="table-borderless">
                    <thead>
                        <tr>
                            <th width="30%">Plan</th>
                            <th width="20%">Price</th>
                            <th width="20%">Duration</th>
                            <th width="15%">Status</th>
                            <th width="15%" class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="membershipPlan">
                        @foreach ($MembershipPlans as $membershipPlan)
                        <tr>
                            <td><span class="fw-bold text-dark">{{ optional($membershipPlan->plan_type_names)->plan_name ?? 'N/A' }}</span></td>
                            <td><span class="badge bg-light text-primary border px-2 py-1"><i class="bi bi-currency-dollar"></i> {{ $membershipPlan->price }}</span></td>
                            <td><span class="text-muted"><i class="bi bi-clock"></i> {{ $membershipPlan->validity_days }} Days</span></td>
                            <td>
                                <input data-id="{{ $membershipPlan->id }}" class="membershipPlanStatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $membershipPlan->status ? 'checked' : '' }}>
                            </td>
                            <td>
                                <div class="action-icons justify-content-center">
                                    <a href="javascript:void(0)" class="action-icon edit editButton" data-membershipPlanId="{{ $membershipPlan->id }}" title="Edit">
                                        <i class="bi bi-pencil-fill editButton" data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="action-icon delete deleteButton" data-membershipPlanId="{{ $membershipPlan->id }}" title="Delete">
                                        <i class="bi bi-trash3-fill deleteButton" data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @if($MembershipPlans->hasPages())
            <div class="p-3 border-top">
                {{ $MembershipPlans->links('vendor.pagination.bootstrap-5') }}
            </div>
            @endif

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
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="MembershipPlanformData">
                    <!-- Hidden input for user ID -->
                    <input type="text" class='d-none' id="membershipPlanId" name="id">
                    <div class="form-floating mb-3">
                        <select name="plan_type" id="plan_type" class="form-select">
                            <option value="">Select Plan Type</option>
                            @if (isset($plan_type))
                            @foreach ($plan_type as $items)
                            <option value="{{ $items->id }}">{{ $items->plan_name }}</option>
                            @endforeach
                            @endif
                        </select>
                        <label for="ufile">Plan Type</label>
                    </div>
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-floating mb-3">                        
                        <input type="text" class="form-control" id="about_plan_{{ $lang }}" name="about_plan[{{ $lang }}]" placeholder="" required>
                        <label for="About_Plan">{{ __('About Plan') }} ({{ strtoupper($lang) }})</label>
                        <div class="invalid-feedback" id="about_plan_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="price" name="price" placeholder="" required min="0" step="0.01">
                        <label for="price">Price</label>
                        <div class="invalid-feedback" id="price_error"></div>
                    </div>

                    <div class="form-floating mb-3">                        
                        <input type="number" class="form-control" id="validity_days" name="validity_days" placeholder="" required min="1">
                        <label for="duration">Duration (Days)</label>
                        <div class="invalid-feedback" id="validity_days_error"></div>
                    </div>

                    <!-- <div class="form-floating mb-3">
                        
                        <input type="number" class="form-control" id="discount" name="discount" placeholder="" min="0" max="100" step="0.01">
                        <label for="discount">Discount (%)</label>
                        <div class="invalid-feedback" id="discount_error"></div>
                    </div> -->

                    <div class="form-floating mb-3">                        
                        <input type="number" class="form-control" id="discounted_price" name="discounted_price" placeholder="">
                        <label for="discounted_price">Discounted Price</label>
                        <div class="invalid-feedback" id="discounted_price_error"></div>
                    </div>

                    <div class="form-group mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked required>
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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="SaveButton" class="btn btn-primary"></button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')

<script>
    $(document).ready(function() {

        const addButton = $('#addMembershipPlan');
        const modalTitle = $('#MembershipPlanAddEditModalLabel');
        const membershipPlanModal = new bootstrap.Modal($('#MembershipPlanModal')[0]);
        const saveButton = $('#SaveButton');
        const membershipPlanForm = $('#MembershipPlanformData');


        addButton.on('click', function() {
            resetForm();
            modalTitle.text('Add Membership Plan');
            saveButton.text('Add');
            membershipPlanModal.show();
        });


        $(document).on('click', '.editButton', function() {
            resetForm();
            saveButton.text('Update');
            modalTitle.text('Edit Membership Plan');

            const id = $(this).data('membershipplanid');

            $.get(`{{ route('plan.edit', ':id') }}`.replace(':id', id))
                .done(function(response) {
                    if (response.success) {
                        populateForm(response.data);
                        membershipPlanModal.show();
                    }
                })
                .fail(function(xhr) {
                    console.error('Error fetching data:', xhr.responseText);
                });
        });


        saveButton.on('click', function() {
            saveButton.prop('disabled', true).text('Saving...');

            let formData = new FormData(membershipPlanForm[0]);
            let plan_id = $('#membershipPlanId').val();
            let url = "";
            let method = "POST"; // Default for adding new plans

            if (plan_id) {
                url = `{{ route('plan.update') }}`;
            } else {
                url = "{{ route('plan.store') }}"; // Ensure you have a named route for adding
            }

            $.ajax({
                url: url,
                type: method,
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        membershipPlanModal.hide();
                        window.location.reload();
                    }
                },
                error: function(response) {
                    handleErrors(response.responseJSON.errors);
                },
                complete: function() {
                    saveButton.prop('disabled', false).text('Save');
                }
            });
        });


        $(document).on('click', '.deleteButton', function() {
            const id = $(this).data('membershipplanid');

            if (confirm('Are you sure you want to delete this plan?')) {
                $.ajax({
                    url: `{{ route('plan.destroy') }}`,
                    type: 'DELETE',
                    data: {
                        id: id
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(response) {
                        if (response.success) {
                            window.location.reload();
                        }
                    },
                    error: function(xhr) {
                        console.error('Error deleting plan:', xhr.responseText);
                    }
                });
            }
        });

        $(document).on('change', '.membershipPlanStatus', function() {
            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
            const id = $(this).data('id');
            const status = this.checked ? 1 : 0;
            $.ajax({
                url: `{{ route('plan.status') }}`,
                type: 'POST',
                data: {
                    id: id,
                    status: status
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {

                },
                error: function(xhr) {
                    console.error('Error deleting plan:', xhr.responseText);
                }
            });

        });

        function resetForm() {
            membershipPlanForm[0].reset();
            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');
        }


        function populateForm(data) {
            console.log(data)
            $('#membershipPlanId').val(data.id);
            $('#plan_type').val(data.plan_type_id);
            $('#price').val(data.price);
            $('#validity_days').val(data.validity_days);
            $('#discounted_price').val(data.discounted_price);
            $(`input[name="status"][value="${data.status}"]`).prop('checked', true);

            if (data.names) {
                data.names.forEach(function(nameObj) {
                    $(`#about_plan_${nameObj.lang}`).val(nameObj.about_plan);
                });
            }
        }


        function handleErrors(errors) {
            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');

            Object.entries(errors).forEach(([field, messages]) => {
                const fieldId = field.replace('.', '_');
                $(`#${fieldId}`).addClass('is-invalid');
                $(`#${fieldId}_error`).text(messages[0]).show();
            });
        }
    });
</script>
@endpush