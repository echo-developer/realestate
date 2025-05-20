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

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header d-flex">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Property floor plan

                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-success" id="add_floor_plan">Add floor plan</button>
                </div>

            </div>

            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
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
                            <td>{{ $item->id }}</td>
                            <td>
                                {{ $item->names->first()->item ?? 'N/A' }}
                                {{-- Fetches the first name (assuming lang='en') --}}
                            </td>
                            <td>
                                <input data-id="{{ $item->id }}" class="floor_plan_prop_status d-none"
                                    type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md" data-id="{{ $item->id }}"
                                    id="edit"></i>
                                <i class="fa fa-trash text-danger fa-md" data-id="{{ $item->id }}"
                                    onclick="Delete_floor_plan_data(`{{ $item->id }}`)"></i>
                            </td>
                        </tr>
                        @endforeach
                        @else
                        <tr>
                            <td colspan="5" class="text-center">No floor plans found.</td>
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
            <div class="modal-header">
                <h5 class="modal-title" id="prop_floor_planAddEditModalLabel"></h5>
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
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="prop_floor_planButton" class="btn btn-primary">Save</button>
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



        document.querySelectorAll('.fa-trash').forEach(function(button) {
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