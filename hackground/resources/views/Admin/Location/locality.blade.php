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
                    <div>Locality
                        <div class="page-title-subheading">Locality &gt; Locality List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Locality List</li>
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

        @if ($errors->has('xlsFileLocality'))
            <div class="alert alert-danger mt-2">
                {{ $errors->first('xlsFileLocality') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">
                    
                </button>
            </div>
        @endif
        <form action="{{ url('locality') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term"
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
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> locality List

                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-primary" id="upload_excel_btn">Upload
                            Excel</button>
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add locality</button>
                    </div>

                </div>

                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:5%">ID</th>
                                <th style="width:25%"> Name</th>
                                <th style="width:15%">Key</th>
                                <th style="width:15%">City</th>
                                <th style="width:20%">Status</th>
                                <th style="min-width:80px;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (isset($data))
                                @foreach ($data as $item)
                                    <tr>
                                        <td>{{ $item->locality_id }}</td>
                                        <td>{{ $item->name }}</td>
                                        <td>{{ $item->locality_key }}</td>
                                        <td>{{ get_name_by_id('city_names', 'city_id', $item->city, 'en') }}</td>
                                        <td>
                                            <input data-id="{{ $item->locality_id }}" class="status d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                {{ $item->status ? 'checked' : '' }}>
                                        </td>
                                        <td class="text-right">
                                            <i class="fa fa-edit text-success fa-md "
                                                onclick="Edit('{{ $item->locality_id }}')"></i>
                                            <i class="fa fa-trash text-danger fa-md"
                                                onclick="Delete('{{ $item->locality_id }}')"></i>
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="5">Sorry, no records found!</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>



                @if (isset($data))
                    <div class="card-footer pagination-rounded clearfix justify-content-center">
                        <ul class="pagination small mb-0">
                            @if ($data->currentPage() == $data->lastPage() && $data->currentPage() != 1)
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url(1) }}" class="page-link"
                                        rel="start">
                                        <i class="fa fa-chevron-left"></i> First
                                    </a>
                                </li>
                            @endif

                            <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->previousPageUrl() }}"
                                    class="page-link" rel="prev">
                                    <i class="fa fa-chevron-left"></i>
                                </a>
                            </li>

                            @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                                <li class="page-item {{ $data->currentPage() == $i ? 'active' : '' }}">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($i) }}"
                                        class="page-link">{{ $i }}</a>
                                </li>
                            @endfor

                            <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->nextPageUrl() }}"
                                    class="page-link" rel="next">
                                    <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>

                            @if ($data->currentPage() != $data->lastPage())
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($data->lastPage()) }}"
                                        class="page-link" rel="end">
                                        Last <i class="fa fa-chevron-right"></i>
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </div>
                @endif

            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="AddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        
                    </button>
                </div>
                <div class="modal-body">

                    <form id="formData">
                        <input type="text" class='d-none' id="localityId" name="localityId">

                        <div class="form-group">
                            <label for="ufile">Select City</label>
                            <div class="input-group">
                                <div class="custom-file">
                                    <select name="city_id" id="city_id" class="form-control">
                                        <option value="">Select City</option>
                                        @if (isset($city_data))
                                            @foreach ($city_data as $items)
                                                <option value="{{ $items->city_id }}">{{ $items->name }}</option>
                                            @endforeach
                                        @endif
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="invalid-feedback" id="city_id_error"></div>

                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                                <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                                    name="name[{{ $lang }}]" autocomplete="off">
                                <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                            </div>
                        @endforeach

                        <div class="form-group">
                            <label for="key">Key</label>
                            <input type="text" class="form-control" id="key" name="key" required>
                            <div class="invalid-feedback" id="key_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="latitude">Latitude</label>
                            <input type="number" class="form-control" id="latitude" name="latitude" required>
                            <div class="invalid-feedback" id="latitude_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="longitude">Longitude</label>
                            <input type="number" class="form-control" id="longitude" name="longitude" required>
                            <div class="invalid-feedback" id="longitude_error"></div>
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
                    <button type="button" onclick="add_edit()" id="button" class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>

    <div class="modal fade" id="excel_upload_modal" tabindex="-1" role="dialog" aria-labelledby="excel_upload_modal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="excel_upload_modal">Upload</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        
                    </button>
                </div>
                <div class="modal-body">

                    <form id="excel_upload_form" action="{{ route('locality.importExcel') }}" method="POST"
                        enctype="multipart/form-data">
                        @csrf
                        <input type="file" class="form-control" name="xlsFileLocality">
                        <i class="d-block text-danger mt-2">Allowed file types: xlsx | xls | csv</i>
                        <div class="mt-3 p-3 bg-light border border-danger rounded">
                            <strong class="text-danger d-block mb-2">

                                Note: Download the file format below. Changing or re-ordering the column names can
                                affect your data.
                            </strong>
                            <a href="{{ asset(config('constants.LOCALITY_EXCEL_FORMAT')) }}"
                                class="btn btn-sm btn-outline-primary">Download XLSX Format</a>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" id="button" class="btn btn-primary">Save</button>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        $(document).ready(function() {

            var $cityid = $('#city_id');
            var $stateId = $('#state_id');
            var $formData = $('#formData');
            var $modalAction = $('#modal_action');
            var $localityId = $('#localityId');
            var $localityKey = $('#key');
            var $latitude = $('#latitude');
            var $longitude = $('#longitude');
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


            // $cityid.change(function() {
            //     var cityid = $(this).val();
            //     fetchStates(cityid);
            // });


            // function fetchStates(cityid, selectedStateId = null) {
            //     $.ajax({
            //         url: `{{ url('getstate') }}`,
            //         type: 'GET',
            //         data: {
            //             country_id: cityid
            //         },
            //         success: function(response) {
            //             $stateId.empty().append('<option value="">Select State</option>');
            //             if (response.states && response.states.length > 0) {
            //                 $.each(response.states, function(index, state) {
            //                     var selected = state.id == selectedStateId ? 'selected' : '';
            //                     $stateId.append(
            //                         `<option value="${state.id}" ${selected}>${state.name}</option>`
            //                         );
            //                 });
            //             } else {
            //                 $stateId.append('<option value="">No states available</option>');
            //             }
            //         },
            //         error: function(xhr, status, error) {
            //             console.error('Error fetching states: ' + error);
            //         }
            //     });
            // }


            function AddEdit(title, buttonText, id = null) {
                $modalLabel.text(title);
                $button.text(buttonText);
                $formData[0].reset();
                $stateId.val('');
                if (id) {
                    $.get(`{{ url('/locality/details') }}/${id}`, function(data) {
                        console.log(data);
                        $localityId.val(data[0].locality_id);
                        $cityid.val(data[0].city);
                        $latitude.val(data[0].latitude);
                        $longitude.val(data[0].longitude);
                        $localityKey.val(data[0].locality_key);
                        // fetchStates(data[0].country, data[0].state);
                        data.forEach(function(locality) {
                            $(`#name_${locality.lang}`).val(locality.name);
                            if (locality.lang === 'en') {
                                $order.val(locality.order);
                                $(`input[name="status"][value="${locality.status}"]`).prop(
                                    'checked', true);
                            }
                        });
                    });
                }
                $modalAction.modal('show');
            }


            function add() {
                $('.form-control').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                AddEdit('Add', 'Add');
            }


            function Edit(id) {
                $('.form-control').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                AddEdit('Edit', 'Update', id);
            }


            function add_edit() {
                var data = $formData.serializeArray();
                var url = $localityId.val() ? `{{ url('/edit/locality') }}` : `{{ url('/add/locality') }}`;

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    success: function(response) {
                        localStorage.setItem('successMessage', response.message);
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
                    url: `{{ url('/locality/status') }}`,
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
                        url: `{{ url('/locality/delete') }}`,
                        data: {
                            'id': id
                        },
                        success: function(response) {
                            localStorage.setItem('successMessage', response.message);
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
