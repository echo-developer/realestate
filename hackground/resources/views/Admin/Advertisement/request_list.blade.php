@extends('Admin.layouts.app')
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2.css')}}"> 
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2-bootstrap-5-theme.css')}}"> 
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">

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
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
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

    <form action="" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="col-md-3 col-sm-4">
                    <label for="lead_for">Page</label>
                    <div class="form-group">
                        <select class="form-select" name="page" id="page" onchange="get_position()">
                            <option value="" >All</option>
                            @if($pages)
                                @foreach($pages as $k=>$p)
                                <option value="{{ $p['slug'] }}" {{ request('page') == $p['slug'] ? 'selected' : '' }}>{{ $p['name'] }}</option>
                                @endforeach
                            @endif
                        </select>
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <label for="category_key">Position </label>
                    <div class="input-group">
                        <select class="form-select" name="position" id="position" >
                            <option value="">-Select-</option>
                        </select>
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
                    <button type="button" class="btn btn-sm btn-success" onclick="add()">{{ $add_btn }}</button>
                </div> --}}

            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th>Advertiser Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Page</th>
                            <th>Position</th>
                            <th>Duration(in weeks)</th>
                            <th>location</th>
                            <th>Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($list as $item)
                        <tr>
                            <td>{{ $item->request_id }}</td>
                            <td>{{ $item->name }}</td>
                            <td>{{ $item->email }}</td>
                            <td>{{ $item->phone_code.''.$item->phone }}</td>
                            <td>{{ $item->page }}</td>
                            <td>{{ $item->position }}</td>
                            <td>{{ $item->duration }}</td>
                            <td>
                                {{ get_name_by_id('locality_names','locality_id',$item->locality_id,'en').', '.get_name_by_id('city_names','city_id',$item->city_id,'en') }}
                            </td>
                            <td> 
                                <input type="checkbox" class="ad_status d-none" data-id="{{ $item->request_id }}" data-toggle="toggle" data-on="Completed" data-off="Pending" data-onstyle="success" data-offstyle="danger" data-size="mini" {{ $item->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                {{-- <i class="fa fa-edit text-primary fa-md" onclick="edit('{{ $item->request_id }}')"></i> --}}
                                @if($item->status == '0')
                                    <i class="fa fa-plus text-primary fa-md" onclick="approve('{{ $item->request_id }}')"></i>
                                @endif
                                
                                <i class="fa fa-eye text-success fa-md" onclick="view('{{ $item->request_id }}')"></i>
                                {{-- <i class="fa fa-trash text-danger fa-md" onclick="reject('{{ $item->request_id }}')"></i> --}}
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="text-center" >Sorry, no records found!</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {!! $list->links('vendor.pagination.bootstrap-5') !!}

        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="ajax_modal" tabindex="-1" role="dialog" aria-labelledby="ajax_modal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            
        </div>
    </div>
</div>
@endsection
@push('custom-js')
<script>
    function approve(request_id){
        let addCommand = "{{ $add_command }}";
        let url = `{{ url('advertisement/ajax_page') }}?page=${addCommand}&request_id=${request_id}`;
        $.get(url, function(data) {
            $('#ajax_modal').modal('show');
            $('#ajax_modal .modal-content').html(data);
        });
    }

    function view(id){
        let viewCommand = "{{ $view_command }}";
        let url = `{{ url('advertisement/ajax_page') }}?page=${viewCommand}&id=${id}`;
        $.get(url, function(data) {
            $('#ajax_modal').modal('show');
            $('#ajax_modal .modal-content').html(data);
        });
    }

    // function view(id) {
    //     if (id) {
    //         $.get(`{{ url('/advertisement/ajax_page') }}/${id}`, function(data) {
    //             $('#modal_action').modal('show');
    //             $('#modal_action .modal-content').html(data);
    //         });
    //     }
        
    // }

    function get_position(){
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('[name="page"] :selected').val();

        $.get('<?php echo url('advertisement/options?option=page_position&page=')?>'+page, function(res){
            $('[name="position"]').html(res);
        });
    }
    
    function get_size(){
        reset_select([$('[name="ad_size"]')]);
        var position = $('[name="position"] :selected').val();
        var page = $('[name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=ad_size&page=')?>'+page+'&position='+position, function(res){
            $('[name="ad_size"]').html(res);
        });
    }

    function reset_select(opt){
        if(opt.length > 0 && opt instanceof Array){
            opt.forEach(function(item, ind){
                $(item).html('<option value="">-Select-</option>');
            });
        }
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



    $('.ad_status').change(function() {
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
            url: `{{ url('/advertisement/request-change-status') }}`,
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
        if (result) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('/advertisement/delete') }}`,
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