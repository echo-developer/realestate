@php
    //print_r($list);exit;
@endphp
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
                <div>{{ $main_title }}
                    <div class="page-title-subheading">{{ $second_title }} &gt; {{ $title }}</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">{{ $main_title }}</li>
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

    <form action="{{ url('country') }}" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
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
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> {{ $title }}

                {{-- <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-success" onclick="add()">Add Country</button>
                </div> --}}

            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:35%">Property/Project </th>
                            <th style="width:10%">Owner Name</th>
                            <th style="width:10%">Customer Name</th>
                            <th style="width:25%">Message</th>
                            <th style="width:20%">Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($list)
                        @foreach($list as $item)
                        <tr>
                            <td>{{ $item->enquery_id }}</td>
                            <td>
                                @if($item->property_id)
                                <b>Property:</b><br/> {{ $item->property_name }}
                                @elseif($item->project_id)
                                <b>Project:</b><br/> {{ $item->project_name }}
                                @endif
                            </td>
                            <td>{{ $item->owner }}</td>
                            <td>{{ $item->customer }}</td>
                            <td>{{ $item->message }}</td>
                            <td>
                                <input data-id="{{$item->enquery_id}}" class="status d-none" type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md " onclick="Edit('{{ $item->enquery_id }}')"></i>
                                <i class="fa fa-trash text-danger fa-md" onclick="Delete('{{ $item->enquery_id }}')"></i>
                            </td>
                        </tr>
                        @endforeach
                        @endif
                    </tbody>
                </table>
            </div>

            @if(isset($list))
            <div class="card-footer pagination-rounded clearfix justify-content-center">
                <ul class="pagination small mb-0">
                    @if ($list->currentPage() == $list->lastPage() && $list->currentPage() != 1)
                    <li class="page-item">
                        <a href="{{ $list->appends(['term' => request('term')])->url(1) }}" class="page-link" rel="start">
                            <i class="fa fa-chevron-left"></i> First
                        </a>
                    </li>
                    @endif

                    <li class="page-item {{ $list->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $list->appends(['term' => request('term')])->previousPageUrl() }}" class="page-link" rel="prev">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>

                    @for ($i = max($list->currentPage() - 1, 1); $i <= min($list->currentPage() + 1, $list->lastPage()); $i++)
                        <li class="page-item {{ ($list->currentPage() == $i) ? 'active' : '' }}">
                            <a href="{{ $list->appends(['term' => request('term')])->url($i) }}" class="page-link">{{ $i }}</a>
                        </li>
                        @endfor

                        <li class="page-item {{ $list->currentPage() == $list->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $list->appends(['term' => request('term')])->nextPageUrl() }}" class="page-link" rel="next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>

                        @if ($list->currentPage() != $list->lastPage())
                        <li class="page-item">
                            <a href="{{ $list->appends(['term' => request('term')])->url($list->lastPage()) }}" class="page-link" rel="end">
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

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <form id="formData">
                    <input type="text" class='d-none' id="countryId" name="countryId">
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-group">
                        <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control reset_field" id="name_{{ $lang }}" name="name[{{ $lang }}]" autocomplete="off">
                        <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-group">
                        <label for="Order">Order</label>
                        <input type="Order" class="form-control" id="order" name="order" required>
                        <div class="invalid-feedback" id="Order_error"></div>
                    </div>


                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="radio-inline">
                            <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked required>
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
            $.get(`{{ url('/country/details') }}/${id}`, function(data) {
                $('#countryId').val(data[0].country_id);
                data.forEach(function(country) {
                    $('#name_' + country.lang).val(country.name);
                    if (country.lang === 'en') {
                        $('#order').val(country.order);
                        $('input[name="status"][value="' + country.status + '"]').prop(
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

        var url = $('#countryId').val() ?
            `{{ url('/edit/country') }}` :
            `{{ url('/add/country') }}`;

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
            url: `{{ url('/country/status') }}`,
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
                url: `{{ url('/country/delete') }}`,
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
        "columnDefs": [
            { 
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