@extends('Admin.layouts.app')

@section('content')
<style>
    .app-main__inner { width: 100%; padding-bottom: 2rem; background-color: #f8fafc; }
    .card-modern { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); background-color: #ffffff; }
    .card-header-modern { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
    .card-header-title { font-weight: 700; color: #1e293b; font-size: 1.1rem; display: flex; align-items: center; gap: 0.75rem; }
    .icon-square { width: 36px; height: 36px; border-radius: 8px; background-color: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; }
    
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .info-col-1 { border-right: 1px solid #e2e8f0; padding-right: 1rem; }
    @media (max-width: 768px) {
        .info-grid { grid-template-columns: 1fr; gap: 1.5rem; }
        .info-col-1 { border-right: none; padding-right: 0; border-bottom: 1px dashed #e2e8f0; padding-bottom: 1.5rem; }
        .card-header-modern { flex-direction: row; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding: 1rem; }
        .card-header-modern .d-flex { width: auto; justify-content: flex-end; }
        
        /* Tabs on mobile - horizontal scroll is best for tabs to save vertical space */
        .nav-tabs-modern { flex-wrap: nowrap; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; padding: 0 1rem; border-bottom: 1px solid #e2e8f0; }
        .nav-tabs-modern::-webkit-scrollbar { display: none; }
        .nav-tabs-modern .nav-item { flex: 0 0 auto; }
        .nav-tabs-modern .nav-link { padding: 1rem 0.5rem; border-bottom: 2px solid transparent; }
        
        /* Compact Mobile List Layout for Tables */
        .table-responsive { overflow: visible !important; padding: 0; }
        .table-modern thead { display: none; }
        .table-modern, .table-modern tbody, .table-modern tr, .table-modern td { display: block; width: 100%; border: none; }
        .table-modern tr { display: flex; flex-wrap: wrap; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e2e8f0; border-radius: 0; margin-bottom: 0; box-shadow: none; }
        .table-modern tr:last-child { border-bottom: none; }
        
        /* Assigned Members Layout */
        #assigned .table-modern td { padding: 0.25rem 0; text-align: left !important; background: transparent; justify-content: flex-start; }
        #assigned .table-modern td:nth-child(1) { width: 70%; font-size: 1rem; }
        #assigned .table-modern td:nth-child(3) { width: 30%; text-align: right !important; justify-content: flex-end; }
        #assigned .table-modern td:nth-child(2) { width: 100%; font-size: 0.8rem; color: #64748b; }
        #assigned .table-modern td:nth-child(2)::before { content: 'Assigned on: '; color: #64748b; text-transform: none; font-size: 0.8rem; font-weight: normal; }
        
        /* Unassigned Members Layout */
        #unassigned .table-modern td { padding: 0.25rem 0; text-align: left !important; background: transparent; justify-content: flex-start; }
        #unassigned .table-modern td:nth-child(1) { width: 10%; } /* Checkbox */
        #unassigned .table-modern td:nth-child(2) { width: 60%; font-size: 1rem; } /* Name */
        #unassigned .table-modern td:nth-child(5) { width: 30%; text-align: right !important; justify-content: flex-end; } /* Status */
        #unassigned .table-modern td:nth-child(3) { width: 45%; font-size: 0.85rem; color: #64748b; margin-left: 10%; } /* Leads */
        #unassigned .table-modern td:nth-child(4) { width: 45%; font-size: 0.85rem; color: #64748b; } /* Used */
        
        #unassigned .table-modern td:nth-child(3)::before { content: 'Total Leads: '; font-weight: 600; color: #1e293b; text-transform: none; font-size: 0.85rem; padding-right: 0.25rem; }
        #unassigned .table-modern td:nth-child(4)::before { content: 'Used: '; font-weight: 600; color: #1e293b; text-transform: none; font-size: 0.85rem; padding-right: 0.25rem; }
        
        /* Reset any ::before overrides from previous card layout */
        .table-modern td::before { display: inline; padding-right: 0; letter-spacing: normal; }
        #assigned .table-modern td:nth-child(1)::before,
        #assigned .table-modern td:nth-child(3)::before,
        #unassigned .table-modern td:nth-child(1)::before,
        #unassigned .table-modern td:nth-child(2)::before,
        #unassigned .table-modern td:nth-child(5)::before { content: none; }
        
        .table-modern td .fw-bold { text-align: left; font-size: 1rem; }
        .table-modern td input[type="checkbox"] { margin-left: 0; transform: scale(1.2); margin-top: 0.2rem; }
    }
    
    .info-item { display: flex; gap: 1rem; align-items: flex-start; }
    .info-icon { width: 32px; height: 32px; border-radius: 8px; background-color: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.9rem; border: none; }
    .info-label { font-size: 0.8rem; color: #64748b; font-weight: 500; text-transform: capitalize; margin-bottom: 0.25rem; }
    .info-value { font-size: 0.9rem; color: #334155; font-weight: 500; line-height: 1.4; word-break: break-word; }
    .info-subtext { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-top: 0.125rem; }

    .nav-tabs-modern { border-bottom: 1px solid #e2e8f0; gap: 1.5rem; padding: 0 1.5rem; }
    .nav-tabs-modern .nav-link { border: none; border-bottom: 2px solid transparent; padding: 1rem 0; font-weight: 600; color: #64748b; font-size: 0.9rem; margin-bottom: -1px; }
    .nav-tabs-modern .nav-link.active { color: #2563eb; border-bottom: 2px solid #2563eb; }
    
    .table-modern { width: 100%; margin-bottom: 0; }
    .table-modern th { background-color: #f8fafc; color: #475569; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; padding: 0.75rem 1.5rem; border-bottom: 1px solid #e2e8f0; border-top: none; }
    .table-modern td { padding: 1rem 1.5rem; vertical-align: middle; color: #1e293b; font-size: 0.85rem; font-weight: 500; border-bottom: 1px solid #e2e8f0; }
    
    .badge-soft-success { background-color: #dcfce7; color: #166534; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; }
    .badge-soft-primary { background-color: #dbeafe; color: #1e40af; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; }
</style>

<div class="app-main__inner">
    <!-- Header -->
    <div class="d-flex align-items-center gap-3 mb-4">
        <a href="javascript:history.back()" class="btn btn-light" style="width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background-color: #eff6ff; color: #2563eb; border: none;">
            <i class="fa fa-arrow-left fs-6"></i>
        </a>
        <div>
            <h2 class="fw-bold text-dark mb-1" style="font-size: 1.5rem; letter-spacing: -0.5px;">Lead Details</h2>
            <div class="text-muted text-truncate" style="font-size: 0.8rem; font-weight: 500;">
                Dashboard <span class="mx-1">&gt;</span> Leads Management <span class="mx-1">&gt;</span> Lead Details
            </div>
        </div>
    </div>

    <div class="row g-4">
        <!-- Left Card: Lead Information -->
        <div class="col-lg-6">
            <div class="card-modern h-100">
                <div class="card-header-modern">
                    <div class="card-header-title">
                        <div class="icon-square"><i class="fa fa-address-card"></i></div>
                        Lead Information
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-light btn-sm text-primary shadow-sm rounded-3 fw-bold border" data-bs-toggle="modal" data-bs-target="#editLeadModal">
                            <i class="fa fa-edit me-1"></i> Edit Lead
                        </button>
                        <span class="badge-soft-success d-flex align-items-center">New</span>
                    </div>
                </div>
                <div class="p-4">
                    <div class="info-grid">
                        
                        <!-- Column 1 -->
                        <div class="d-flex flex-column gap-4 info-col-1">
                            <!-- Type -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-home"></i></div>
                                <div>
                                    <div class="info-label">Type</div>
                                    <div class="info-value">
                                        @if($type == 'P')
                                            Property Lead
                                        @else
                                            General Lead
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <!-- Lead ID -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-id-badge"></i></div>
                                <div>
                                    <div class="info-label">Lead ID</div>
                                    <div class="info-value">#{{ $type == 'P' ? $enquiry->enquery_id : $enquiry->id }}</div>
                                </div>
                            </div>
                            <!-- Requirement -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-building"></i></div>
                                <div>
                                    <div class="info-label">Property / Requirement</div>
                                    <div class="info-value">
                                        @if($type == 'P')
                                            {{ $enquiry->property_name ?? $enquiry->project_name ?? 'N/A' }}
                                        @else
                                            @php
                                                $subCat = get_property_sub_category_name($enquiry->property_for);
                                                $cat = get_property_category_name($enquiry->property_type);
                                            @endphp
                                            {{ $subCat && $cat ? $subCat . ', ' . $cat : ($subCat ?: ($cat ?: 'N/A')) }}
                                        @endif
                                    </div>
                                    @if($type == 'P' && ($enquiry->property_name || $enquiry->project_name))
                                        <div class="info-subtext">{{ $enquiry->property_name ? 'Property' : 'Project' }}</div>
                                    @endif
                                </div>
                            </div>
                            <!-- Customer Name -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-user"></i></div>
                                <div>
                                    <div class="info-label">Customer Name</div>
                                    <div class="info-value">{{ $type == 'P' ? $enquiry->customer : $enquiry->name }}</div>
                                </div>
                            </div>
                            <!-- Email -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-envelope"></i></div>
                                <div>
                                    <div class="info-label">Email</div>
                                    <div class="info-value text-break">{{ $type == 'P' ? ($enquiry->customer_email ?? 'N/A') : ($enquiry->email ?? 'N/A') }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Column 2 -->
                        <div class="d-flex flex-column gap-4">
                            <!-- Phone -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-phone"></i></div>
                                <div>
                                    <div class="info-label">Phone</div>
                                    <div class="info-value">{{ $type == 'P' ? ($enquiry->customer_phone ?? 'N/A') : ($enquiry->phone ?? 'N/A') }}</div>
                                </div>
                            </div>
                            <!-- Location -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-map-marker"></i></div>
                                <div>
                                    <div class="info-label">Location</div>
                                    <div class="info-value">
                                        @if($type == 'P')
                                            {{ $enquiry->city ?? 'N/A' }}
                                        @else
                                            {{ $enquiry->locality ?? 'N/A' }}
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <!-- Budget -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-credit-card"></i></div>
                                <div>
                                    <div class="info-label">Budget</div>
                                    <div class="info-value">
                                        @if($type == 'P')
                                            N/A
                                        @else
                                            @php
                                                $min = $enquiry->min_budget;
                                                $max = $enquiry->max_budget;
                                            @endphp
                                            {{ $min && $max ? $min . ' - ' . $max : ($min ?: ($max ?: 'N/A')) }}
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <!-- Date -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-calendar"></i></div>
                                <div>
                                    <div class="info-label">Date</div>
                                    <div class="info-value">{{ date('d-M-Y', strtotime($enquiry->created_at)) }}</div>
                                </div>
                            </div>
                            <!-- Notes -->
                            <div class="info-item">
                                <div class="info-icon"><i class="fa fa-list"></i></div>
                                <div>
                                    <div class="info-label">Additional Notes</div>
                                    <div class="info-value" style="font-size: 0.85rem; font-weight: 500;">
                                        @if($type == 'P')
                                            {{ $enquiry->message ?? 'No additional notes provided.' }}
                                        @else
                                            No additional notes provided.
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Right Card: Lead Shared Details -->
        <div class="col-lg-6">
            <div class="card-modern h-100 d-flex flex-column">
                <div class="card-header-modern">
                    <div class="card-header-title">
                        <div class="icon-square"><i class="fa fa-share-alt"></i></div>
                        Lead Shared Details
                    </div>
                </div>
                
                <ul class="nav nav-tabs-modern d-flex list-unstyled mb-0" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#assigned" role="tab">Assigned Members ({{ $assigned_members->total() }})</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#unassigned" role="tab">Unassigned Members ({{ $unassigned_members->total() }})</a>
                    </li>
                </ul>
                
                <div class="tab-content flex-grow-1 bg-white" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                    <div class="tab-pane active h-100" id="assigned" role="tabpanel">
                        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                            <table class="table-modern">
                                <thead>
                                    <tr>
                                        <th>Member Name</th>
                                        <th>Assigned On</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($assigned_members as $member)
                                    <tr>
                                        <td data-label="Member Name">
                                            <div class="fw-bold">{{ $member->name }}</div>
                                        </td>
                                        <td data-label="Assigned On">{{ date('d-M-Y', strtotime($member->created_at)) }}</td>
                                        <td data-label="Status"><span class="badge-soft-success">Assigned</span></td>
                                    </tr>
                                    @empty
                                    <tr>
                                        <td colspan="3" class="text-center py-4 text-muted d-block text-center" data-label="">No members assigned to this lead yet.</td>
                                    </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane h-100" id="unassigned" role="tabpanel">
                        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                            <table class="table-modern">
                                <thead>
                                    <tr>
                                        <th style="width: 40px;">
                                            <input type="checkbox" class="form-check-input" id="checkAllUnassigned">
                                        </th>
                                        <th>Member Name</th>
                                        <th>Total Leads</th>
                                        <th>Leads Used</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($unassigned_members as $unmember)
                                    <tr>
                                        <td data-label="Select">
                                            <input type="checkbox" class="form-check-input unassigned-checkbox" name="userid[]" value="{{ $unmember->user_id }}">
                                        </td>
                                        <td data-label="Member Name">
                                            <div class="fw-bold">{{ $unmember->member_name }}</div>
                                        </td>
                                        <td data-label="Total Leads">{{ $unmember->leads ?? 0 }}</td>
                                        <td data-label="Leads Used">{{ $unmember->leads_used ?? 0 }}</td>
                                        <td data-label="Status"><span class="badge bg-secondary text-white px-2 py-1" style="font-size: 0.75rem; border-radius: 6px;">Unassigned</span></td>
                                    </tr>
                                    @empty
                                    <tr>
                                        <td colspan="5" class="text-center py-4 text-muted d-block text-center" data-label="">All available members have been assigned.</td>
                                    </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        <div class="p-3 bg-white d-flex justify-content-end border-top" style="border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                            <form id="inline-assign-form">
                                @csrf
                                <input type="hidden" name="enquery_id" value="{{ $type == 'P' ? $enquiry->enquery_id : $enquiry->id }}">
                                <button type="button" class="btn btn-primary btn-sm rounded-3 px-3 shadow-sm" id="btnAssignSelected" style="font-weight: 600; display: none;">
                                    <i class="fa fa-check me-1"></i> Assign Selected Members
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="p-3 border-top mt-auto bg-white" style="border-color: #f1f5f9 !important; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                    <div class="text-muted" style="font-size: 0.8rem; font-weight: 600;">
                        Total Members Assigned: {{ $assigned_members->total() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Lead Modal -->
<div class="modal fade" id="editLeadModal" tabindex="-1" aria-labelledby="editLeadModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-bottom-0 rounded-top">
                <h5 class="modal-title fw-bold" id="editLeadModalLabel"><i class="fa fa-edit text-primary me-2"></i>Edit Lead Information</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="edit-lead-form">
                @csrf
                <input type="hidden" name="enquery_id" value="{{ $type == 'P' ? $enquiry->enquery_id : $enquiry->id }}">
                <input type="hidden" name="type" value="{{ $type }}">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label text-muted fw-bold" style="font-size: 0.85rem;">Customer Name</label>
                        <input type="text" class="form-control" name="customer_name" value="{{ $type == 'P' ? $enquiry->customer : $enquiry->name }}">
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted fw-bold" style="font-size: 0.85rem;">Email</label>
                            <input type="email" class="form-control" name="email" value="{{ $type == 'P' ? ($enquiry->customer_email ?? '') : ($enquiry->email ?? '') }}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label text-muted fw-bold" style="font-size: 0.85rem;">Phone</label>
                            <input type="text" class="form-control" name="phone" value="{{ $type == 'P' ? ($enquiry->customer_phone ?? '') : ($enquiry->phone ?? '') }}">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted fw-bold" style="font-size: 0.85rem;">Additional Notes</label>
                        <textarea class="form-control" name="message" rows="3">{{ $type == 'P' ? ($enquiry->message ?? '') : '' }}</textarea>
                    </div>
                </div>
                <div class="modal-footer border-top-0 bg-light rounded-bottom">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" id="btnSaveLead">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

@endsection
@push('custom-js')
<script>
    $(document).ready(function() {
        // Fix modal backdrop issue by moving it to the body
        $('#editLeadModal').appendTo("body");

        // Toggle assign button based on checkbox selection
        function toggleAssignBtn() {
            if ($('.unassigned-checkbox:checked').length > 0) {
                $('#btnAssignSelected').fadeIn(200);
            } else {
                $('#btnAssignSelected').fadeOut(200);
            }
        }

        // Check All functionality
        $('#checkAllUnassigned').change(function() {
            $('.unassigned-checkbox').prop('checked', $(this).prop('checked'));
            toggleAssignBtn();
        });

        $('.unassigned-checkbox').change(function() {
            if (!$(this).prop('checked')) {
                $('#checkAllUnassigned').prop('checked', false);
            }
            toggleAssignBtn();
        });

        // Handle inline assign submit
        $('#btnAssignSelected').click(function() {
            var formData = $('#inline-assign-form').serialize();
            
            // Collect checked userids and append to formData
            $('.unassigned-checkbox:checked').each(function() {
                formData += '&userid[]=' + $(this).val();
            });

            var assignUrl = "{{ $type == 'P' ? url('/enquiry/save-assign-list') : url('/enquiry/general-save-assign-list') }}";

            $.ajax({
                type: 'POST',
                url: assignUrl,
                data: formData,
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == 'OK') {
                        Swal.fire({
                            title: "Assigned!",
                            text: 'Member(s) have been successfully assigned to this lead.',
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: "Failed!",
                            text: 'Failed to assign members.',
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                },
                error: function() {
                    Swal.fire({
                        title: "Error!",
                        text: 'An error occurred while assigning.',
                        icon: "error"
                    });
                }
            });
        });
        // Handle edit lead submit
        $('#btnSaveLead').click(function() {
            var form = $('#edit-lead-form');
            var formData = form.serialize();
            
            // Add loading state
            var btn = $(this);
            var originalText = btn.html();
            btn.html('<i class="fa fa-spinner fa-spin me-1"></i> Saving...');
            btn.prop('disabled', true);

            $.ajax({
                type: 'POST',
                url: "{{ url('/enquiry/update-enquiry') }}",
                data: formData,
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == 'OK') {
                        $('#editLeadModal').modal('hide');
                        Swal.fire({
                            title: "Updated!",
                            text: res.msg,
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            window.location.reload();
                        });
                    } else {
                        btn.html(originalText);
                        btn.prop('disabled', false);
                        Swal.fire({
                            title: "Failed!",
                            text: 'Failed to update lead.',
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                },
                error: function() {
                    btn.html(originalText);
                    btn.prop('disabled', false);
                    Swal.fire({
                        title: "Error!",
                        text: 'An error occurred while updating.',
                        icon: "error"
                    });
                }
            });
        });
    });
</script>
@endpush
