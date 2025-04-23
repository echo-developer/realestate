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
                <div>State
                    <div class="page-title-subheading">State &gt; State List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">State List</li>
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
    <form action="{{ url('state') }}" method="get">
        <section class="content-header mb-2">
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
                        <button type="submit" class="btn btn-primary">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card">
        <div class="card-header d-flex">
            <h4>State List</h4>
            <div class="btn-actions-pane-right">
                <button type="button" class="btn btn-sm btn-primary" onclick="add()">Add State</button>
            </div>
        </div>
        <div class="card-body">            
            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:32px">ID</th>
                            <th>Name </th>
                            <th>Order</th>
                            <th>Status</th>
                            <th style="min-width:60px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(isset($data))
                        @foreach($data as $item)
                        <tr>
                            <td>{{$item->id}}</td>
                            <td>{{$item->name}}</td>
                            <td>{{$item->order}}</td>
                            <td>
                                <input data-id="{{$item->id}}" class="status d-none" type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <a href="javascript:void(0)" class="me-2"><i class="bi bi-pencil-fill text-success fa-md " onclick="Edit('{{ $item->id }}')"></i></a>
                                <a href="javascript:void(0)"><i class="bi bi-trash3-fill text-danger fa-md" onclick="Delete('{{ $item->id }}')"></i></a>
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



            @if(isset($data))
            <div class="card-footer pagination-rounded clearfix justify-content-center">
                <ul class="pagination small mb-0">
                    @if ($data->currentPage() == $data->lastPage() && $data->currentPage() != 1)
                    <li class="page-item">
                        <a href="{{ $data->appends(['term' => request('term')])->url(1) }}" class="page-link" rel="start">
                            <i class="fa fa-chevron-left"></i> First
                        </a>
                    </li>
                    @endif

                    <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $data->appends(['term' => request('term')])->previousPageUrl() }}" class="page-link" rel="prev">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>

                    @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                        <li class="page-item {{ ($data->currentPage() == $i) ? 'active' : '' }}">
                            <a href="{{ $data->appends(['term' => request('term')])->url($i) }}" class="page-link">{{ $i }}</a>
                        </li>
                        @endfor

                        <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $data->appends(['term' => request('term')])->nextPageUrl() }}" class="page-link" rel="next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>

                        @if ($data->currentPage() != $data->lastPage())
                        <li class="page-item">
                            <a href="{{ $data->appends(['term' => request('term')])->url($data->lastPage()) }}" class="page-link" rel="end">
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
<div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="AddEditModalLabel"></h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">

                <form id="formData">
                    <input type="text" class='d-none' id="StateId" name="StateId">
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
                    </div>
                    <div class="invalid-feedback" id="country_id_error"></div>
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
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
@endsection
@push('custom-js')
<script>
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

    function AddEdit(title, buttonText, id = null) {
        $('#AddEditModalLabel').text(title);
        $('#button').text(buttonText);
        $('#formData')[0].reset();
        if (id) {
            $.get(`{{ url('/state/details') }}/${id}`, function(data) {
                $('#StateId').val(data[0].state_id);
                $('#country_id').val(data[0].country)
                data.forEach(function(State) {
                    $('#name_' + State.lang).val(State.name);
                    if (State.lang === 'en') {
                        $('#order').val(State.order);
                        $('input[name="status"][value="' + State.status + '"]').prop(
                            'checked', true);
                    }
                });
            });
        }
        $('#modal_action').modal('show');
    }

    function add_edit() {
        var data = $("#formData").serializeArray();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var url = $('#StateId').val() ?
            `{{ url('/edit/state') }}` :
            `{{ url('/add/state') }}`;

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(response) {
                localStorage.setItem('successMessage', response.message);
                window.location.reload(true);
                $('#modal_action').modal('hide');
                $('#formData')[0].reset();
            },
            error: function(response) {
                var errors = response.responseJSON.errors;

                // Reset previous error messages and invalid class
                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                // Loop through errors and update the DOM
                Object.entries(errors).forEach(([field, messages]) => {
                    const fieldId = field.replace('.', '_'); // Convert 'name.en' to 'name_en'
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
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: `{{ url('/state/status') }}`,
            data: {
                'status': status,
                'id': id
            },
            success: function(data) {

            },
            error: function(msg) {
                console.log(msg);
                var errors = msg.responseJSON;
            }
        });
    });

    function Delete(id) {
        var result = confirm('Are you sure you want to delete this?');
        console.log(id);
        if (result) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('/state/delete') }}`,
                data: {
                    'id': id
                },
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        }
    }

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
</script>

@endpush