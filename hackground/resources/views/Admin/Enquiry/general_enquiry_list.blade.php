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

    <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav ml-0">
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('enquiry/list') ? 'active' : '' }}"
                href="{{ url('enquiry/list') }}" data-url="{{ url('enquiry/assign-list/') }}">
                <span>Project and Property Leads</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link ajax-link {{ Request::is('enquiry/general-leads') ? 'active' : '' }}"
                href="{{ url('/enquiry/general-leads') }}" data-url="{{ url('/enquiry/general-leads') }}">
                <span>General Leads</span>
            </a>
        </li>
    </ul>

    <form action="" method="get">
        <section class="content-header mb-2">
            <div class="row">
                {{-- <div class="col-md-3 col-sm-4">
                    <label for="lead_for">Type</label>
                    <div class="form-group">
                        <select class="form-select" name="lead_for" id="lead_for">
                            <option value="" >All</option>
                            <option value="property" {{ request('lead_for') == 'property' ? 'selected' : ''; }}>Property</option>
                            <option value="project" {{ request('lead_for') == 'project' ? 'selected' : ''; }}>Project</option>
                        </select>
                    </div>
                </div> --}}
                <div class="col-md-3 col-sm-4">
                    <label for="lead_type">Leads Date</label>
                    <div class="form-group">
                        <input type="date" class="form-control" id="enquery_date" name="enquery_date" value="{{ request('enquery_date') }}" />
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <label for="lead_type">Member Name</label>
                    <div class="input-group">
                        <input class="form-control" id="member_name" placeholder="Search by member" name="member_name" value="{{ request('member_name') }}" />
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
                            <th style="width:15%">Buyer Name</th>
                            <th style="width:15%">Phone</th>
                            <th style="width:15%">Email</th>
                            <th style="width:15%">Enquiry For</th>
                            <th style="width:15%">Budget</th>
                            <th style="width:15%">Date</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($list as $item)
                        <tr>
                            <td>{{ $item->id }}</td>
                            <td>{{ $item->name }}</td>
                            <td>{{ $item->phone }}</td>
                            <td>{{ $item->email }}</td>
                            <td>
                                {{ get_property_sub_category_name($item->property_for).', '.get_property_category_name($item->property_type) }}
                            </td>
                            <td>{{ $item->min_budget.'-'.$item->max_budget }}</td>
                            <td>{{ date('d-M-Y', strtotime($item->created_at)) }}</td>
                            <td class="text-right">
                                <a href="{{ url('/enquiry/general-assign-list/'.$item->id); }}" title="Assign Lead"><i class="fa fa-plus text-info fa-md"></i></a>
                                <i class="fa fa-eye text-success fa-md" onclick="viewLead('{{ $item->id }}','G')"></i>
                                {{-- <i class="fa fa-trash text-danger fa-md" onclick="Delete('{{ $item->id }}')"></i> --}}
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

            <?php /* ?>
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
            <?php */ ?>

        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="viewLeadModal" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            
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

    function viewLead(id,lead_type) {
        if (id) {
            $.get(`{{ url('/enquiry/details') }}/${id}/${lead_type}`, function(data) {
                $('#modal_action').modal('show');
                $('#modal_action .modal-content').html(data);
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