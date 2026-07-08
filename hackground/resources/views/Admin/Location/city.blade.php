@extends('Admin.layouts.app')
{{-- @dd($data) --}}
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
                    <div>City
                        <div class="page-title-subheading">City &gt; City List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">City List</li>
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
            .btn-add-setting { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.85rem; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; }
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
                .modal .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
                .modal.show .modal-dialog { transform: translateY(0); }
                .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
                .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
                .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
                .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
                .form-floating .form-control, .form-floating .form-select { height: 52px; font-size: 0.95rem; }
                .modal-footer button { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
            }

            .advance-search-panel {
                background-color: #fff;
                box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
                padding: 1rem;
                margin-top: 1rem;
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-dismissible alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        @if ($errors->has('xlsFileCity'))
            <div class="alert alert-danger mt-2">
                {{ $errors->first('xlsFileCity') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        <form action="{{ url('city') }}" method="get">
            <section class="content-header mb-2">
                <div class="row justify-content-end">
                    <div class="col-xl-4 col-lg-6">
                        <div class="input-group">
                            <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term"
                                value="{{ request('term') }}" />
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card card-modern">
            <div class="settings-card-header">
                <h4><i class="bi bi-buildings text-primary me-2"></i> City List</h4>
                <div class="btn-actions-pane-right d-flex gap-2">
                    <button type="button" class="btn-add-setting" id="upload_excel_btn" style="background:#f1f5f9;color:#475569;border-color:#e2e8f0;">
                        <i class="fa fa-upload"></i> Upload Excel
                    </button>
                    <button type="button" class="btn-add-setting" onclick="add()">
                        <i class="fa fa-plus"></i> Add City
                    </button>
                </div>
            </div>
            <div class="card-body">


                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="settings-table">
                        <thead>
                            <tr>
                                <th style="width:32px">ID</th>
                                <th> Name</th>
                                <th>State</th>
                                <th>Status</th>
                                <th style="min-width:60px;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (isset($data))
                                @foreach ($data as $item)
                                    <tr>
                                        <td data-label="ID"><span>#{{ $item->city_id }}</span></td>
                                        <td data-label="Name"><span>{{ $item->name }}</span></td>
                                        <td data-label="State"><span>{{ get_name_by_id('state_names', 'state_id', $item->state, 'en') ?? 'N/A' }}</span></td>
                                        @if (!empty($item->latitude) && !empty($item->longitude))
                                            <td data-label="Status">
                                                <div>
                                                    <input data-id="{{ $item->city_id }}" class="status d-none" type="checkbox"
                                                        data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                        data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                        {{ $item->status ? 'checked' : '' }}>
                                                </div>
                                            </td>
                                        @else
                                            <td data-label="Status">
                                                <span class="text-warning d-flex align-items-center justify-content-end" style="gap:4px">
                                                    <i class="fas fa-info-circle"></i> <small>Lat & Long required</small>
                                                </span>
                                            </td>
                                        @endif
                                        <td data-label="Action" class="text-right">
                                            <div class="actions-cell">
                                                <a href="javascript:void(0)" onclick="Edit('{{ $item->city_id }}')" class="action-icon-btn edit cursor-pointer">
                                                    <i class="bi bi-pencil-square pointer-events-none"></i>
                                                </a>
                                                <a href="javascript:void(0)" onclick="Delete('{{ $item->city_id }}')" class="action-icon-btn delete cursor-pointer">
                                                    <i class="bi bi-trash3-fill pointer-events-none"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="5" class="text-center text-muted">Sorry, no records found!</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
                {!! $data->links('vendor.pagination.bootstrap-5') !!}

            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header border-bottom-0">

                    <h5 class="modal-title fw-bold" id="AddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <div class="modal-body">
                    <form id="formData">
                        <input type="text" class='d-none' id="cityId" name="cityId">
                        <div class="form-floating mb-3">
                            <select name="country_id" id="country_id" class="form-select">
                                <option value="">Select Country</option>
                                @if (isset($country_data))
                                    @foreach ($country_data as $items)
                                        <option value="{{ $items->id }}">{{ $items->name }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <label for="ufile">Country Name</label>
                            <div class="invalid-feedback" id="country_id_error"></div>
                        </div>

                        <div class="form-floating mb-3">
                            <select name="state_id" id="state_id" class="form-select">
                                <option value="">Select State</option>
                            </select>
                            <label for="ufile">State Name</label>
                            <div class="invalid-feedback" id="state_id_error"></div>
                        </div>

                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                                    name="name[{{ $lang }}]" placeholder="" autocomplete="off">
                                <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                            </div>
                        @endforeach


                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="latitude" name="latitude" placeholder=""
                                required>
                            <label for="latitude">Latitude</label>
                            <div class="invalid-feedback" id="latitude_error"></div>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="longitude" name="longitude" placeholder=""
                                required>
                            <label for="longitude">Longitude</label>
                            <div class="invalid-feedback" id="longitude_error"></div>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="Order" class="form-control" id="order" name="order" placeholder=""
                                required>
                            <label for="Order">Order</label>
                            <div class="invalid-feedback" id="Order_error"></div>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label d-block">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=1 class="form-check-input" id="status_1"
                                    checked required>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=0 class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0">
                    <button type="button" onclick="add_edit()" id="button" class="btn btn-primary px-4 shadow-sm">Save</button>
                </div>
            </div>

        </div>
    </div>

    <div class="modal fade" id="excel_upload_modal" tabindex="-1" role="dialog" aria-labelledby="excel_upload_modal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header border-bottom-0">

                    <h5 class="modal-title fw-bold" id="excel_upload_modal_label">Upload</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <form id="excel_upload_form" action="{{ route('city.importExcel') }}" method="POST"
                    enctype="multipart/form-data">
                    <div class="modal-body">
                        @csrf
                        <input type="file" class="form-control" name="xlsFileCity">
                        <i class="d-block text-danger mt-2">Allowed file types: xlsx | xls | csv</i>
                        <div class="mt-3 p-3 bg-light border border-danger rounded">
                            <strong class="text-danger d-block mb-2">

                                Note: Download the file format below. Changing or re-ordering the column names can
                                affect your data.
                            </strong>
                            <a href="{{ asset(config('constants.CITY_EXCEL_FORMAT')) }}"
                                class="btn btn-sm btn-outline-primary">Download XLSX Format</a>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0">
                        <button type="submit" id="button" class="btn btn-primary px-4 shadow-sm">Save</button>
                    </div>
                </form>

            </div>

        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        $(document).ready(function() {

            var $countryId = $('#country_id');
            var $stateId = $('#state_id');
            var $formData = $('#formData');
            var $modalAction = $('#modal_action');
            var $cityId = $('#cityId');
            var $order = $('#order');
            var $button = $('#button');
            var $modalLabel = $('#AddEditModalLabel');

            let xlModal = $('#excel_upload_modal')
            let uploadExcelButton = $('#upload_excel_btn')

            uploadExcelButton.on('click', function() {
                xlModal.modal('show') // Bootstrap modal way
            })


            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $(document).ready(function() {
                var table = $('#myTable').DataTable({
                    "paging": false,
                    "searching": false,
                    "info": false,
                    "ordering": true,
                    "order": [
                        [0, 'desc']
                    ],
                    "columnDefs": [{
                            "orderable": true,
                            "targets": [0]
                        },
                        {
                            "orderable": false,
                            "targets": [2, 3, 4]
                        }
                    ]
                });
            });


            $countryId.change(function() {
                var countryId = $(this).val();
                fetchStates(countryId);
            });


            function fetchStates(countryId, selectedStateId = null) {
                $.ajax({
                    url: `{{ url('getstate') }}`,
                    type: 'GET',
                    data: {
                        country_id: countryId
                    },
                    success: function(response) {
                        $stateId.empty().append('<option value="">Select State</option>');
                        if (response.states && response.states.length > 0) {
                            $.each(response.states, function(index, state) {
                                var selected = state.id == selectedStateId ? 'selected' : '';
                                $stateId.append(
                                    `<option value="${state.id}" ${selected}>${state.name}</option>`
                                );
                            });
                        } else {
                            $stateId.append('<option value="">No states available</option>');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching states: ' + error);
                    }
                });
            }


            function AddEdit(title, buttonText, id = null) {
                $modalLabel.text(title);
                $button.text(buttonText);
                $formData[0].reset();
                $stateId.val('');
                if (id) {
                    $.get(`{{ url('/city/details') }}/${id}`, function(data) {
                        $cityId.val(data[0].city_id);
                        $countryId.val(data[0].country);
                        fetchStates(data[0].country, data[0].state);
                        data.forEach(function(city) {
                            $(`#name_${city.lang}`).val(city.name);
                            $(`#latitude`).val(city.latitude);
                            $(`#longitude`).val(city.longitude);
                            if (city.lang === 'en') {
                                $order.val(city.order);
                                $(`input[name="status"][value="${city.status}"]`).prop('checked',
                                    true);
                            }
                        });
                    });
                }
                $modalAction.modal('show');
            }


            function add() {
                $('.form-control').removeClass('is-invalid');
                $('.form-select').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                AddEdit('Add', 'Add');
            }


            function Edit(id) {
                $('.form-control').removeClass('is-invalid');
                $('.form-select').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                AddEdit('Edit', 'Update', id);
            }


            function add_edit() {
                var data = $formData.serializeArray();
                var url = $cityId.val() ? `{{ url('/edit/city') }}` : `{{ url('/add/city') }}`;

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function(response) {
                        // localStorage.setItem('successMessage', response.message);
                        window.location.reload(true);
                        $modalAction.modal('hide');
                        $formData[0].reset();
                    },
                    error: function(response) {
                        var errors = response.responseJSON.errors;
                        $('.invalid-feedback').text('').hide();
                        $('.form-control').removeClass('is-invalid');
                        $.each(errors, function(field, messages) {
                            const fieldId = field.replace('.', '_');
                            const inputSelector = `#${fieldId}`;
                            const errorSelector = `#${fieldId}_error`;
                            $(inputSelector).addClass('is-invalid');
                            $(errorSelector).text(messages[0]).show();
                        });
                    }
                });
            }

            $('.status').change(function() {
                toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
                var id = $(this).data('id');
                var status = this.checked ? 1 : 0;
                $.ajax({
                    type: 'POST',
                    url: `{{ url('/city/status') }}`,
                    data: {
                        'status': status,
                        'id': id
                    },
                    success: function(data) {

                    },
                    error: function(msg) {
                        console.log(msg);
                    }
                });
            });


            function Delete(id) {
                if (confirm('Are you sure you want to delete this?')) {
                    $.ajax({
                        type: 'POST',
                        url: `{{ url('/city/delete') }}`,
                        data: {
                            'id': id
                        },
                        success: function(response) {
                            // localStorage.setItem('successMessage', response.message);
                            window.location.reload(true);
                        },
                        error: function(msg) {
                            console.log(msg);
                        }
                    });
                }
            }


            window.add = add;
            window.Edit = Edit;
            window.add_edit = add_edit;
            window.Delete = Delete;
        });
    </script>
@endpush
