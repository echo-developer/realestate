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
                <div>Property floor plan
                    <div class="page-title-subheading">Property Setting > Property floor plan list</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Property floor plan list</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>
    <style>
        .app-main__inner { padding-bottom: 2rem; background-color: #f8fafc; overflow-x: hidden; }
        .card-modern { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); background-color: #ffffff; width: 100%; max-width: 100%; }
        .settings-card-header { padding: 0.85rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12px 12px 0 0; }
        .settings-card-header h4 { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
        .btn-add-setting { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.85rem; transition: all 0.2s; }
        .btn-add-setting:hover { background: #2563eb; color: #fff; }
        
        .settings-table { width: 100%; margin: 0; color: #334155; }
        .settings-table th { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .settings-table td { padding: 1rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-weight: 500; }
        .settings-table tr:last-child td { border-bottom: none; }
        
        .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-icon-btn { width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid transparent; transition: all 0.2s; font-size: 1rem; color: #64748b; background: transparent; cursor: pointer; text-decoration: none; }
        .action-icon-btn.edit { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
        .action-icon-btn.edit:hover { background: #16a34a; color: #fff; transform: scale(1.05); }
        .action-icon-btn.delete { border-color: #fecaca; color: #dc2626; background: #fef2f2; }
        .action-icon-btn.delete:hover { background: #dc2626; color: #fff; transform: scale(1.05); }

        /* Mobile Responsiveness */
        @media (max-width: 767px) {
            .settings-card-header { flex-wrap: wrap; gap: 0.75rem; }
            .table-responsive { overflow: visible !important; }
            
            /* Override DataTables wrappers */
            .dataTables_wrapper .row { margin-left: 0 !important; margin-right: 0 !important; }
            .dataTables_wrapper .col-sm-12 { padding-left: 0 !important; padding-right: 0 !important; overflow-x: visible !important; }
            
            .settings-table thead { display: none !important; }
            .settings-table, .settings-table tbody, .settings-table tr, .settings-table td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
            .settings-table tr { margin-bottom: 0.75rem !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 0 !important; overflow: hidden !important; box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; background: #fff !important; }
            .settings-table td { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid #f1f5f9 !important; padding: 0.75rem 1rem !important; text-align: right !important; }
            .settings-table td > span, .settings-table td > div { flex: 1 !important; min-width: 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; text-align: right !important; justify-content: flex-end !important; display: flex !important; align-items: center !important; gap: 0.5rem !important; }
            .settings-table td:last-child { border-bottom: none !important; background: #f8fafc !important; }
            .settings-table td::before { content: attr(data-label) !important; font-weight: 600 !important; color: #64748b !important; font-size: 0.75rem !important; text-transform: uppercase !important; text-align: left !important; padding-right: 1rem !important; flex-shrink: 0 !important; }
            .actions-cell { justify-content: flex-end !important; width: auto !important; }
            
            /* Mobile Bottom-Sheet Modal */
            #prop_floor_plan .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
            #prop_floor_plan.show .modal-dialog { transform: translateY(0); }
            #prop_floor_plan .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
            #prop_floor_plan .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
            #prop_floor_plan .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
            #prop_floor_plan .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
            #prop_floor_plan .form-floating .form-control, #prop_floor_plan .form-floating .form-select { height: 52px; font-size: 0.95rem; }
            #prop_floor_planButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
        }

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
        <button type="button" class="btn-close" data-bs-dismiss="alert">

        </button>
    </div>
    @endif

    <form action="{{ url('property/floor-plan') }}" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_floor_plan_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card card-modern">
        <div class="settings-card-header">
            <h4><i class="fa fa-map text-primary me-2"></i> Property floor plan</h4>

            <div class="btn-actions-pane-right">
                <button type="button" class="btn-add-setting" id="add_floor_plan">
                    <i class="fa fa-plus me-1"></i> Add floor plan
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table class="settings-table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:25%">Floor Plan Name</th>
                            <th style="width:20%">Status</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">
                        @if (!empty($floorPlan) && $floorPlan->count())
                        @foreach ($floorPlan as $item)
                        <tr>
                            <td data-label="ID"><span>#{{ $item->id }}</span></td>
                            <td data-label="Floor Plan Name">
                                <span>{{ $item->names->first()->item ?? 'N/A' }}</span>
                                {{-- Fetches the first name (assuming lang='en') --}}
                            </td>
                            <td data-label="Status">
                                <div>
                                    <input data-id="{{ $item->id }}" class="floor_plan_prop_status d-none"
                                        type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                        data-onstyle="success" data-offstyle="danger" data-size="mini"
                                        {{ $item->status ? 'checked' : '' }}>
                                </div>
                            </td>
                            <td data-label="Action" class="text-right">
                                <div class="actions-cell">
                                    <a href="javascript:void(0)" data-id="{{ $item->id }}" id="edit" class="action-icon-btn edit cursor-pointer">
                                        <i class="bi bi-pencil-square pointer-events-none"></i>
                                    </a>
                                    <a href="javascript:void(0)" data-id="{{ $item->id }}" class="action-icon-btn delete cursor-pointer delete-btn">
                                        <i class="bi bi-trash3-fill pointer-events-none"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                        @else
                        <tr>
                            <td colspan="4" class="text-center text-muted py-4">No floor plans found.</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="card-footer pagination-rounded clearfix justify-content-center">

            </div>
        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="prop_floor_plan" tabindex="-1" role="dialog"
    aria-labelledby="prop_floor_planAddEditModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold" id="prop_floor_planAddEditModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="prop_floor_plan_formData">
                    <input type="text" class="d-none" id="prop_floor_planId" name="prop_floor_planId">

                    <div class="form-group">
                        <label for="ufile">Type</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <select name="type" id="type" class="form-select">
                                    <option value="">Select Type</option>
                                    @if (isset($floorPlanTypes))
                                    @foreach ($floorPlanTypes as $item)
                                    @foreach ($item->names as $name)
                                    <option value="{{ $name->fpt_id }}">{{ $name->type }}</option>
                                    @endforeach
                                    @endforeach
                                    @endif
                                </select>
                            </div>
                        </div>
                    </div>
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                    <div class="form-group">
                        <label for="title">{{ __('Title') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control reset_field" id="title_{{ $lang }}"
                            name="title[{{ $lang }}]" autocomplete="off">
                        <div class="invalid-feedback" id="title_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="radio-inline">
                            <input type="radio" name="status" value="1" class="magic-radio" id="status_1" checked required>
                            <label for="status_1">Active</label>
                            <input type="radio" name="status" value="0" class="magic-radio" id="status_2">
                            <label for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-secondary px-4 shadow-sm" data-dismiss="modal">Close</button>
                <button type="button" id="prop_floor_planButton" class="btn btn-primary px-4 shadow-sm">Save</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
    // Pass data from Blade to JavaScript
    const floorPlanData = @json($floorPlan); // This converts the $floorPlan PHP variable to a JS object
    const langs = @json($langs); // Pass langs to JS (e.g., ['en', 'ar'])

    document.addEventListener('DOMContentLoaded', function() {
        // Get necessary elements
        let addFloorPlanButton = document.getElementById('add_floor_plan');
        let modalElement = document.getElementById('prop_floor_plan');
        let modalInstance = new bootstrap.Modal(modalElement);
        let modalTitle = document.getElementById('prop_floor_planAddEditModalLabel');
        let modalButton = document.getElementById('prop_floor_planButton');
        let form = document.getElementById('prop_floor_plan_formData');
        let editButton = document.querySelectorAll('#edit'); // All edit buttons dynamically


        addFloorPlanButton.addEventListener('click', function() {
            modalInstance.show();
            modalTitle.textContent = "Add New Floor Plan";
            modalButton.textContent = "Save";
            form.reset();
        });

        modalButton.addEventListener('click', function() {
            let formData = new FormData(form);
            console.log([...formData]);

            let url = "{{ url('add_floor_plan') }}";
            if (document.getElementById('prop_floor_planId').value) {
                url = "{{ url('update_floor_plan') }}/" + document.getElementById('prop_floor_planId').value;
            }

            fetch(url, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": "{{ csrf_token() }}"
                    }
                })
                .then(response => response.text()) // <-- Convert response to text first
                .then(text => {
                    console.log("Raw response:", text); // Debugging
                    return JSON.parse(text); // Then parse JSON
                })
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('successMessage', data.message);
                        modalInstance.hide();
                        location.reload();
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Parsing Error:", error);
                    alert("Invalid response from server.");
                });

        });

        editButton.forEach(function(btn) {
            btn.addEventListener('click', function() {
                let floorPlanId = btn.getAttribute('data-id');
                console.log('Edit button clicked for ID:', floorPlanId);


                fetch("{{ url('get_floor_plan') }}/" + floorPlanId)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            let floorPlan = data.floorPlan;
                            document.getElementById('prop_floor_planId').value = floorPlan.id;
                            document.getElementById('type').value = floorPlan.fp_type;
                            langs.forEach(lang => {
                                let titleField = document.getElementById('title_' + lang);
                                let titleData = floorPlan.names.find(name => name.lang === lang);
                                titleField.value = titleData ? titleData.item : '';
                            });

                            document.querySelector(`input[name="status"][value="${floorPlan.status}"]`).checked = true;

                            modalTitle.textContent = "Edit Floor Plan";
                            modalButton.textContent = "Update";
                            modalInstance.show();
                        } else {
                            alert("Error: " + data.message);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching floor plan data:", error);
                    });
            });
        });


        $('.floor_plan_prop_status').change(function() {

            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            var id = $(this).data('id');
            var status = this.checked ? 1 : 0;
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('update_floor_plan_status') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    // Handle success response if needed
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });



        document.querySelectorAll('.delete-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                const floorPlanId = this.getAttribute('data-id'); // Get the ID from the data-id attribute

                // Ask for confirmation before deleting
                var result = confirm('Are you sure you want to delete this floor plan?');
                if (result) {
                    console.log('Deleting floor plan with ID:', floorPlanId); // For debugging

                    // Perform the deletion by setting status to -1 (soft delete)
                    fetch("{{ url('delete_floor_plan') }}", {
                            method: "POST",
                            body: JSON.stringify({
                                id: floorPlanId, // Send the ID in the request body
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": "{{ csrf_token() }}"
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert("Floor plan deleted successfully!");
                                location.reload(); // Reload the page to reflect the changes
                            } else {
                                alert("Error: " + data.message);
                            }
                        })
                        .catch(error => {
                            console.error("Error:", error); // Log error if request fails
                            alert("Failed to delete floor plan.");
                        });
                }
            });
        });
    });
</script>

@endpush