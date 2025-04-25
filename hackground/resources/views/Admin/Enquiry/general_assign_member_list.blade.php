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

    {{-- <form action="" method="get">
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
    </form> --}}

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <h4>Lead Details</h4>
                <ul>
                    <li>Name: {{ $enquiry->name }}</li>
                    <li>Phone: {{ $enquiry->phone }}</li>
                </ul>
                <ul>
                    <li>Email: {{ $enquiry->email }}</li>
                    <li>Location: {{ $enquiry->locality }}</li>
                </ul>
                <ul>
                    <li>Property Type: {{ $enquiry->property_type ? get_property_category_name($enquiry->property_type) : '' }}</li>
                    <li>Property For: {{ $enquiry->property_for ? get_property_sub_category_name($enquiry->property_for) : '' }}</li>
                </ul>
                <ul>
                    <li>Size: {{ $enquiry->min_size.'-'.$enquiry->max_size }}</li>
                    <li>Budget: {{ $enquiry->min_budget.'-'.$enquiry->min_budget }}</li>
                </ul>
                <ul>
                    <li>
                        Purchase Timeline: 
                        @php 
                            $time_arr = explode('_', $enquiry->purchase_timeline); 
                            echo $time_arr[0].' '.$time_arr[1];
                        @endphp
                    </li>
                    <li>Posted On: {{ date('d-M-Y', strtotime($enquiry->created_at)) }}</li>
                </ul>
                
            </div>
        </div>
    </div>

    <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav ml-0">
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('enquiry/general-assign-list/'.$enquiry->id) ? 'active' : '' }}"
                href="{{ url('enquiry/general-assign-list/'.$enquiry->id) }}" data-url="{{ url('enquiry/assign-list/'.$enquiry->id) }}">
                <span>Unassigned</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('enquiry/general-assign-list/assigned/'.$enquiry->id) ? 'active' : '' }}"
                href="{{ url('enquiry/general-assign-list/assigned/'.$enquiry->id) }}" data-url="{{ url('enquiry/assign-list/assigned/'.$enquiry->id) }}">
                <span>Assigned</span>
            </a>
        </li>
    </ul>

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> {{ $title }}
                @if($assign_type == 'unassigned')  
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="assign()">Assign</button>
                    </div>
                @endif

            </div>

            <div class="table-responsive" id="assign_table">
                <form id="assign-form">
                    <input type="hidden" name="enquery_id" value="{{ $enquiry->id }}" />
                    <table id="myTable" class="mb-0 table">
                        <thead>
                            <tr>
                                @if($assign_type == 'unassigned')
                                <th style="width:5%">Check</th>
                                @endif
                                <th style="width:5%">User ID</th>
                                <th style="width:10%">Member Name</th>
                                <th style="width:10%">Leads Used</th>
                                @if($assign_type == 'assigned')
                                    <th style="width:10%">Assigned Date</th>  
                                    <th style="width:10%">Action</th>
                                @endif
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($list as $item)
                                @php 
                                    $is_clickable = 0;
                                @endphp
                                @if($item->leads > $item->leads_used)
                                @php
                                    $is_clickable = 1;
                                @endphp
                                @endif
                                <tr>
                                    @if($assign_type == 'unassigned')
                                    <td>
                                        <input name="userid[]" value="{{ $item->user_id }}" type="checkbox" class="user-selected" {{ !$is_clickable ? 'disabled' : '' }} />
                                    </td>
                                    @endif
                                    <td>{{ $item->user_id }}</td>
                                    <td>{{ $item->member_name }}</td>
                                    <td>{{ $item->leads ? $item->leads_used.'/'.$item->leads : '0/0'; }}</td>
                                    @if($assign_type == 'assigned')
                                    <td>{{ $item->created_at ? date('d-M-Y',strtotime($item->created_at)) : ''; }}</td>
                                    <td>  
                                        <a data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Remove from assigned list" class="allUsersDeleteButton" user-id="{{ $item->user_id }}" onclick="remove_assigned('{{ $item->assign_id }}')"><i class="fa fa-trash text-danger fa-md"></i>
                                        </a>
                                    </td>
                                    @endif
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="4" class="text-center" >Sorry, no records found!</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </form>
            </div>
            {!! $list->links('vendor.pagination.bootstrap-5') !!}
            <?php /* ?>
            @if($list->isNotEmpty())
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
            <?php */ ?>

        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
    function assign() {
        var formId = $("#assign-form");
        var ln = $('#assign-form input[name="userid[]"]:checked').length;
        if(ln > 0)
        {
           $.ajax({
             type : 'POST',
             url : '{{ url("/enquiry/general-save-assign-list") }}',
             data : $(formId).serialize(),
             headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
             },
             dataType : 'JSON',
             success : function(res){
                if(res.status == 'OK')
                {
                    Swal.fire({
                        title: "Success!",
                        text: 'Lead assigned to member(s) successfully !',
                        icon: "success",
                        confirmButtonText: "OK"
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = location.href;
                        }
                    });
                }else{
                    Swal.fire({
                        title: "Failed!",
                        text: 'Failed to assign members',
                        icon: "error",
                        confirmButtonText: "OK"
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = res.redirect;
                        }
                    });
                }
             }
           }); 
        }else{
            alert('Please select member(s)');
        }
    }

    function remove_assigned(assign_id)
    {
        if(assign_id)
        {
            var conf = confirm('Are you sure want to remove from assigned list?');
            if(conf == true)
            {
                $.ajax({
                    type : 'POST',
                    url : '{{ url("/enquiry/remove-assign-list") }}',
                    data : {assign_id : assign_id},
                    headers : {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    dataType : 'JSON',
                    success : function(res){
                        if(res.status == 'OK')
                        {
                            Swal.fire({
                                title: "Success!",
                                text: 'Member removed from assigned list.',
                                icon: "success",
                                confirmButtonText: "OK"
                                }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location = location.href;
                                }
                            });
                        }
                    }
                });
            }
             
        }
        
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