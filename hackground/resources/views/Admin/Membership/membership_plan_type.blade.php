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
                    <i class="pe-7s-plugin icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Membership Plan Type <div class="page-title-subheading">Membership Plan &gt; All Membership Plan Types</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">
                            Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan Type</li>
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
.modern-card-header h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }

/* Table */
.table-borderless { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
.table-borderless thead th { background-color: #fcfcfc; color: #1e293b; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid #e2e8f0 !important; border-top: none; }
.table-borderless tbody td { vertical-align: middle; border-bottom: 1px solid #e2e8f0 !important; transition: background-color 0.2s ease; border-top: none; }
.table-borderless tbody tr:hover td { background-color: #fcfcfc; }
.table-borderless tbody tr:last-child td { border-bottom: none !important; }

/* Plan Icon Wrapper */
.plan-icon-wrapper { width: 72px; height: 72px; margin: 0 auto; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
.plan-icon-wrapper.free-plan { background-color: #eff6ff; color: #3b82f6; }
.plan-icon-wrapper.gold-plan { background-color: #fefce8; color: #eab308; }
.plan-icon-wrapper.platinum-plan { background-color: #faf5ff; color: #a855f7; }

/* Feature Items */
.feature-item { font-size: 0.85rem; padding: 0.6rem 0; border-bottom: 1px dashed #e2e8f0; display: flex !important; justify-content: flex-start !important; align-items: center; gap: 0; }
.feature-item:last-child { border-bottom: none; }
.feature-label i { width: 20px; text-align: center; color: #94a3b8; font-size: 1rem; }
.feature-label { font-weight: 500; color: #475569; white-space: nowrap; width: 180px; flex-shrink: 0; margin: 0; }
.feature-value { text-align: left !important; white-space: nowrap; font-weight: 700; flex: 1; }

/* Vertical Dividers */
.v-divider { position: relative; }
.v-divider::after { content: ''; position: absolute; right: 0; top: 20%; bottom: 20%; width: 1px; background-color: #f1f5f9; }

/* Status Pill Toggle */
.status-pill-toggle { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.8rem; cursor: pointer; user-select: none; transition: all 0.2s; border: 1px solid transparent; margin: 0; }
.status-pill-toggle.active { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.status-pill-toggle.active .dot { background: #059669; }
.status-pill-toggle.inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
.status-pill-toggle.inactive .dot { background: #dc2626; }
.status-pill-toggle .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; transition: all 0.2s; }

/* Outline Action Icons */
.action-icons { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.action-icon { width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.1rem; text-decoration: none; }
.action-icon.outline.edit { color: #3b82f6; background: #fff; border: 1px solid #bfdbfe; }
.action-icon.outline.edit:hover { background: #eff6ff; }
.action-icon.outline.delete { color: #ef4444; background: #fff; border: 1px solid #fecaca; }
.action-icon.outline.delete:hover { background: #fef2f2; }

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .table-borderless thead { display: none; }
    .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; }
    .table-borderless tbody td { border: none !important; padding: 1.25rem !important; display: block; width: 100% !important; text-align: left !important; }
    .v-divider::after { display: none !important; }
    
    /* Plan Title Block */
    .table-borderless tbody td:first-child { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0 !important; text-align: center !important; }
    .plan-icon-wrapper { margin: 0 auto; }
    
    /* Features Block */
    .row.gx-0.gy-2 { display: flex; flex-direction: column; }
    .row.gx-0.gy-2 .col-6 { width: 100% !important; padding: 0 !important; }
    /* Fix missing dashed divider when columns stack */
    .row.gx-0.gy-2 .col-6:first-child .feature-item:last-child { border-bottom: 1px dashed #e2e8f0; }
    
    /* Status & Action Blocks */
    .table-borderless tbody td:nth-last-child(2),
    .table-borderless tbody td:last-child {
        display: flex; justify-content: space-between; align-items: center;
        border-top: 1px dashed #e2e8f0 !important; padding: 1rem 1.25rem !important;
    }
    .table-borderless tbody td:nth-last-child(2)::before { content: "Status"; font-weight: 600; color: #475569; }
    .table-borderless tbody td:last-child::before { content: "Action"; font-weight: 600; color: #475569; }
    
    /* Align action icons correctly on mobile */
    .action-icons { justify-content: flex-end; }
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
            <h4>MEMBERSHIP PLAN TYPE</h4>
            <div class="btn-actions-pane-right">
                <div class="btn-group" id="global_action_btn" style="display:none">
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="deleteSelected()" data-original-title="Delete selected"><i class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(1)" data-original-title="Make active"><i class="fa fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(0)" data-original-title="Make inactive"><i class="fa fa-thumbs-down"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive" id="main_table">
                <table id="myTable1" class="table-borderless w-100">
                    <thead>
                        <tr>
                            <th width="20%" class="px-4 py-3">Plan Type Name</th>
                            <th width="56%" class="px-4 py-3">Access & Limits</th>
                            <th width="12%" class="px-4 py-3 text-center">Status</th>
                            <th width="12%" class="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="membershipPlanType">
                        @foreach ($MembershipPlanTypes as $planType)
                        @php
                            $planName = strtolower($planType->english_name);
                            $iconClass = 'bi-send';
                            $colorClass = 'free-plan';
                            
                            if(str_contains($planName, 'gold')) {
                                $iconClass = 'bi-award';
                                $colorClass = 'gold-plan';
                            } elseif(str_contains($planName, 'platinum') || str_contains($planName, 'diamond')) {
                                $iconClass = 'bi-gem';
                                $colorClass = 'platinum-plan';
                            }
                        @endphp
                        <tr>
                            <td class="px-4 py-4 v-divider">
                                <div class="plan-type-card text-center">
                                    <div class="plan-icon-wrapper {{ $colorClass }}">
                                        <i class="bi {{ $iconClass }}"></i>
                                    </div>
                                    <h5 class="fw-bold mt-3 mb-1 text-dark">{{$planType->english_name}}</h5>
                                    @if(str_contains($planName, 'free'))
                                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mt-1">Default Plan</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-4 py-4 v-divider">
                                <div class="row gx-0 gy-2">
                                    <div class="col-6 v-divider pe-4">
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-list-task me-2"></i> Listings Allowed</span>
                                            <span class="feature-value fw-bold text-dark">{{$planType->listings_allowed ?? 'Unlimited'}}</span>
                                        </div>
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-person me-2"></i> Leads</span>
                                            <span class="feature-value fw-bold text-dark">{{$planType->leads ?? 'Unlimited'}}</span>
                                        </div>
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-eye me-2"></i> Listing Visibility</span>
                                            <span class="feature-value fw-bold {{ $planType->listing_visibility == 'Y' ? 'text-success' : 'text-danger' }}">{{ $planType->listing_visibility == 'Y' ? 'Yes' : 'No' }}</span>
                                        </div>
                                    </div>
                                    <div class="col-6 ps-4">
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-share me-2"></i> Social Media Promotion</span>
                                            <span class="feature-value fw-bold {{$planType->social_media_promotion == 'Y' ? 'text-success' : 'text-danger' }}">{{$planType->social_media_promotion == 'Y' ? 'Yes' : 'No' }}</span>
                                        </div>
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-patch-check me-2"></i> Verified Badge</span>
                                            <span class="feature-value fw-bold {{$planType->verified_badge == 'Y' ? 'text-success' : 'text-danger' }}">{{$planType->verified_badge == 'Y' ? 'Yes' : 'No' }}</span>
                                        </div>
                                        <div class="feature-item d-flex justify-content-between align-items-center">
                                            <span class="feature-label"><i class="bi bi-shield-check me-2"></i> Relationship Manager</span>
                                            <span class="feature-value fw-bold {{$planType->relationship_manager == 'Y' ? 'text-success' : 'text-danger' }}">{{$planType->relationship_manager == 'Y' ? 'Yes' : 'No' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-center">
                                <label class="status-pill-toggle {{ $planType->status ? 'active' : 'inactive' }}">
                                    <input data-planTypeId="{{ $planType->id }}" class="status-checkbox d-none" type="checkbox" {{ $planType->status ? 'checked' : '' }}>
                                    <span class="dot"></span> <span class="status-text">{{ $planType->status ? 'Active' : 'Inactive' }}</span>
                                </label>
                            </td>
                            <td class="px-4 py-4 text-center">
                                <div class="action-icons">
                                    <a href="javascript:void(0)" class="action-icon outline edit editButton" data-planTypeId="{{ $planType->id }}">
                                        <i class="bi bi-pencil" data-planTypeId="{{ $planType->id }}"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="action-icon outline delete deleteButton" data-planTypeId="{{ $planType->id }}">
                                        <i class="bi bi-trash3" data-planTypeId="{{ $planType->id }}"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @if($MembershipPlanTypes->hasPages())
            <div class="p-3 border-top">
                {{ $MembershipPlanTypes->links('vendor.pagination.bootstrap-5') }}
            </div>
            @endif
        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel">Edit Plan Type </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">
                    
                </button>
            </div>
            <div class="modal-body">
                <form id="formData">
                    <input type="text" class='d-none' id="planTypeId" name="id">
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-floating mb-3">                        
                        <input type="text" class="form-control" id="type_name_{{ $lang }}" name="type_name[{{ $lang }}]" placeholder="" required>
                        <label for="type_name">{{ __('Plan Type Name') }} ({{ strtoupper($lang) }})</label>
                        <div class="invalid-feedback" id="type_name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-floating mb-3">                        
                        <input type="text" class="form-control" id="leads" name="leads" placeholder="">
                        <label for="leads">Leads:</label>
                        <div class="invalid-feedback" id="contact_owners_error"></div>
                    </div>

                    <div class="form-floating mb-3">                        
                        <input type="text" class="form-control" id="listing_visibility" name="listing_visibility" placeholder="">
                        <label for="listing_visibility">Listing Visibility</label>
                        <div class="invalid-feedback" id="listing_visibility_error"></div>
                    </div>

                    <div class="form-floating mb-3">                        
                        <input type="text" class="form-control" id="listings_allowed" name="listings_allowed" placeholder="">
                        <label for="listings_allowed">Listings Allowed</label>
                        <div class="invalid-feedback" id="listings_allowed_error"></div>
                    </div>

                    <div class="form-group">
                        <label class="form-label d-block">Social Media Promotion</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="social_media_promotion" value="Y" class="form-check-input" id="social_media_promotion_y">
                            <label class="form-check-label" for="social_media_promotion_y">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="social_media_promotion" value="N" class="form-check-input" id="social_media_promotion_n" checked>
                            <label class="form-check-label" for="social_media_promotion_n">No</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label d-block">Verified Badge</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="verified_badge" value="Y" class="form-check-input" id="verified_badge_y">
                            <label class="form-check-label" for="verified_badge_y">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="verified_badge" value="N" class="form-check-input" id="verified_badge_n" checked>
                            <label class="form-check-label" for="verified_badge_n">No</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label d-block">Relationship Manager</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="relationship_manager" value="Y" class="form-check-input" id="relationship_manager_y">
                            <label class="form-check-label" for="relationship_manager_y">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="relationship_manager" value="N" class="form-check-input" id="relationship_manager_n" checked>
                            <label class="form-check-label" for="relationship_manager_n">No</label>
                        </div>
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
                <button type="button" id="SaveButton" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')

<script>
    $(document).ready(function() {

        const Modal = new bootstrap.Modal($('#Modal')[0]);
        const saveButton = $('#SaveButton');
        const deleteButton = $('.deleteButton');
        const status = $('#status');
        const formdata = $('#formData');

        $(document).on('click', '.editButton', function() {

            const id = $(this).data('plantypeid');

            $.get(`{{ route('plan_type.edit', ':id') }}`.replace(':id', id))
                .done(function(response) {
                    if (response.success) {
                        populateForm(response.data);
                        Modal.show();
                    }
                })
                .fail(function(xhr) {
                    console.error('Error fetching data:', xhr.responseText);
                });
        });

        saveButton.on('click', function() {
            saveButton.prop('disabled', true).text('Saving...');

            let data = new FormData(formdata[0]);

            $.ajax({
                url: `{{ route('plan_type.update') }}`,
                type: "POST",
                data: data,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        Modal.hide();
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


        deleteButton.on('click', function() {
            const id = $(this).data('plantypeid');

            if (confirm('Are you sure you want to delete this plan?')) {
                $.ajax({
                    url: `{{ route('plan_type.destroy') }}`,
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

        const statusCheckbox = $('.status-checkbox');
        statusCheckbox.on('change', function() {
            
            // Visual Pill update
            let label = $(this).closest('.status-pill-toggle');
            let text = label.find('.status-text');
            if(this.checked) {
                label.removeClass('inactive').addClass('active');
                text.text('Active');
            } else {
                label.removeClass('active').addClass('inactive');
                text.text('Inactive');
            }
            
            // Ajax update
            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
            const id = $(this).attr('data-plantypeid');
            const statusVal = this.checked ? 1 : 0;
            $.ajax({
                url: `{{ route('plan_type.status') }}`,
                type: 'POST',
                data: {
                    id: id,
                    status: statusVal
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {

                },
                error: function(xhr) {
                    console.error('Error modifying status:', xhr.responseText);
                }
            });

        });

        function populateForm(data) {
            $('#planTypeId').val(data.id);
            $('#leads').val(data.leads);
            $('#listing_visibility').val(data.listing_visibility);
            $('#listings_allowed').val(data.listings_allowed);
            $(`input[name="status"][value="${data.status}"]`).prop('checked', true);
            $(`input[name="social_media_promotion"][value="${data.social_media_promotion}"]`).prop('checked', true);
            $(`input[name="verified_badge"][value="${data.verified_badge}"]`).prop('checked', true);
            $(`input[name="relationship_manager"][value="${data.relationship_manager}"]`).prop('checked', true);
            console.log(data)
            if (data.names) {
                data.names.forEach(function(nameObj) {
                    $(`#type_name_${nameObj.lang}`).val(nameObj.plan_name);
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

<script>
$(document).ready(function () {
    // Ensure modal closes when clicking close button or outside the modal
    $('#Modal').on('hidden.bs.modal', function () {
        $(this).find("form").trigger("reset"); // Reset form fields after closing
    });

    // Close modal on close button click
    $('.close, .btn-secondary').on('click', function () {
        $('#Modal').modal('hide');
    });
});

</script>


@endpush