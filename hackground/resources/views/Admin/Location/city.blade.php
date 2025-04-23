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

    <div class="main-card mb-3 card">
        <div class="card-header d-flex">
            <h4>City List</h4>
            <div class="btn-actions-pane-right">
                <button type="button" class="btn btn-sm btn-primary me-2" id="upload_excel_btn">Upload Excel</button>
                <button type="button" class="btn btn-sm btn-success" onclick="add()">Add city</button>
            </div>
        </div>
        <div class="card-body">


            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:32px">ID</th>
                            <th> Name</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th style="min-width:60px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (isset($data))
                        @foreach ($data as $item)
                        <tr>
                            <td>{{ $item->city_id }}</td>
                            <td>{{ $item->name }}</td>
                            <td>{{ $item->order }}</td>
                            <td>
                                <input data-id="{{ $item->city_id }}" class="status d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <a href="javascript:void(0)" class="me-2"><i class="bi bi-pencil-fill text-success fa-md " onclick="Edit('{{ $item->city_id }}')"></i></a>
                                <a href="javascript:void(0)"><i class="bi bi-trash3-fill text-danger fa-md" onclick="Delete('{{ $item->city_id }}')"></i></a>
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
                        <input type="text" class="form-control reset_field" id="name_{{ $lang }}" name="name[{{ $lang }}]" placeholder="" autocomplete="off">
                        <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                        <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-floating mb-3">
                        <input type="Order" class="form-control" id="order" name="order" placeholder="" required>
                        <label for="Order">Order</label>
                        <div class="invalid-feedback" id="Order_error"></div>
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
            <form id="excel_upload_form" action="{{ route('city.importExcel') }}" method="POST" enctype="multipart/form-data">
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
                <div class="modal-footer">
                    <button type="submit" id="button" class="btn btn-primary">Save</button>
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
            var url = $cityId.val() ? `{{ url('/edit/city') }}` : `{{ url('/add/city') }}`;

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