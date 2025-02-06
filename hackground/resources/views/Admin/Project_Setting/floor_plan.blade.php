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
                <div>Property
                    <div class="page-title-subheading">Property > Property floor plan </div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Property floor plan </li>
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
            <div class="card-header p-0">
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
                            <th style="width:25%">Max floor plan</th>
                            <th style="width:25%">Min floor plan</th>
                            <th style="width:20%">Order</th>
                            <th style="width:20%">Status</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">
                        @if (!empty($data))
                        @foreach ($data as $item)
                        <tr>
                            <td>{{ $item->id }}</td>
                            <td>{{ $item->max_floor_plan }}</td>
                            <td>{{ $item->min_floor_plan }}</td>
                            <td>{{ $item->order }}</td>

                            <td>
                                <input data-id="{{ $item->id }}" class="floor_plan_prop_status d-none"
                                    type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md " onclick="Edit_prop_floor_plan('{{ $item->id }}')"></i>
                                <i class="fa fa-trash text-danger fa-md" onclick="Delete_prop_floor_plan('{{ $item->id }}')"></i>
                            </td>
                        </tr>
                        @endforeach
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
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="prop_floor_plan_formData">
                    <input type="text" class="d-none" id="prop_floor_planId" name="prop_floor_planId">

                    <div class="form-group">
                        <label for="ufile">Type</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <select name="type" id="type" class="form-control">
                                    <option value="">Select Type</option>
                                    @if (isset($floorPlanTypes))
                                    @foreach ($floorPlanTypes as $item)
                                    @foreach ($item->names as $name)
                                    <option value="{{ $name->fp_id }}">{{ $name->type }}</option>
                                    @endforeach
                                    @endforeach
                                    @endif
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ufile">Project</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <select name="project" id="project" class="form-control">
                                    <option value="">Select Type</option>
                                    @if (isset($project))
                                    @foreach ($project as $items)
                                    <option value="{{ $items->id }}">{{ $items->project_name }}</option>
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
                    @foreach ($langs as $lang)
                    <div class="form-group">
                        <label for="desc">{{ __('Description') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control reset_field" id="desc_{{ $lang }}"
                            name="desc[{{ $lang }}]" autocomplete="off">
                        <div class="invalid-feedback" id="desc_{{ $lang }}_error"></div>
                    </div>
                    @endforeach
                    <div class="form-group">
                        <label for="order">Order</label>
                        <input type="text" class="form-control" id="order" name="order" required>
                        <div class="invalid-feedback" id="order_error"></div>
                    </div>

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
    document.addEventListener('DOMContentLoaded', function() {

        let addFloorPlanButton = document.getElementById('add_floor_plan');
        let modalElement = document.getElementById('prop_floor_plan');
        prop_floor_planAddEditModalLabel
        let modalInstance = new bootstrap.Modal(modalElement);
        let modalTitle = document.getElementById('prop_floor_planAddEditModalLabel');
        let modalButton = document.getElementById('prop_floor_planButton');
        let saveButton = document.getElementById('prop_floor_planButton');
        let form = document.getElementById('prop_floor_plan_formData');

        addFloorPlanButton.addEventListener('click', function() {
            modalInstance.show();
            modalTitle.textContent = "Add New Floor Plan";
            modalButton.textContent = "Save";
        });

        saveButton.addEventListener('click', function() {
            let formData = new FormData(form);

            fetch("{{ url('add_floor_plan') }}", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRF-TOKEN": "{{ csrf_token() }}"
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Floor Plan added successfully!");
                        modalInstance.hide();
                        location.reload(); // Reload page to update the list
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => console.error("Error:", error));
        });

    });
</script>
@endpush