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

    <div class="custom-tabs-container">
        <ul class="custom-tabs">
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/member-leads') &&  request('lead_type') == 'P' ? 'active' : '' }}"
                    href="{{ url('enquiry/member-leads?user_id='.$user_id.'&lead_type=P') }}" >
                    Project and Property Leads
                </a>
            </li>
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/member-leads') &&  request('lead_type') == 'G' ? 'active' : '' }}"
                    href="{{ url('/enquiry/member-leads?user_id='.$user_id.'&lead_type=G') }}" >
                    General Leads
                </a>
            </li>
        </ul>
    </div>

    <form action="" method="get">
        <input type="hidden" value="{{ request('user_id') }}" name="user_id" />
        <input type="hidden" value="{{ request('lead_type') }}" name="lead_type" />
        <div class="custom-card p-4 mb-4">
            <div class="row align-items-end">
                @if($lead_type == 'P')
                <div class="col-md-3 col-sm-4">
                    <label for="lead_for" class="form-label" style="font-weight: 500; color: #475569; font-size: 0.88rem;">Type</label>
                    <div class="form-group mb-0">
                        <select class="form-select custom-input" name="lead_for" id="lead_for">
                            <option value="" >All</option>
                            <option value="property" {{ request('lead_for') == 'property' ? 'selected' : ''; }}>Property</option>
                            <option value="project" {{ request('lead_for') == 'project' ? 'selected' : ''; }}>Project</option>
                        </select>
                    </div>
                </div>
                @endif
                <div class="col-md-3 col-sm-4">
                    <label for="enquery_date" class="form-label" style="font-weight: 500; color: #475569; font-size: 0.88rem;">Leads Date</label>
                    <div class="form-group mb-0">
                        <input type="date" class="form-control custom-input" id="enquery_date" name="enquery_date" value="{{ request('enquery_date') }}" />
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group mb-0">
                        <button type="submit" class="btn btn-primary d-inline-flex align-items-center gap-2" style="background-color: #0d6efd; border: none; padding: 0.6rem 1.25rem; font-weight: 500; box-shadow: 0 4px 10px rgba(13, 110, 253, 0.15);">
                            <i class="fa fa-search"></i> Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="custom-card">
        <div class="custom-card-header">
            <h4><i class="fa fa-list"></i> {{ $title }}</h4>
        </div>
        <div class="custom-card-body p-0">
            <div class="table-responsive" id="main_table">
                @if($lead_type == 'P')
                <table id="myTable" class="custom-table mb-0">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:35%">Property Name</th>
                            <th style="width:15%">Member Name</th>
                            <th style="width:15%">Customer Name</th>
                            <th style="width:15%">Date</th>
                            <th class="text-right" style="width:15%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($list)
                        @foreach($list as $item)
                        <tr>
                            <td>{{ $item->enquery_id }}</td>
                            <td>
                                @if($item->property_id)
                                    <span class="badge bg-primary text-white mb-1" style="font-size: 0.72rem; font-weight: 500; padding: 0.25rem 0.5rem; border-radius: 4px;">Property</span>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 0.92rem;">{{ $item->property_name }}</div>
                                @elseif($item->project_id)
                                    <span class="badge bg-success text-white mb-1" style="font-size: 0.72rem; font-weight: 500; padding: 0.25rem 0.5rem; border-radius: 4px;">Project</span>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 0.92rem;">{{ $item->project_name }}</div>
                                @endif
                            </td>
                            <td>{{ $item->owner }}</td>
                            <td style="font-weight: 500; color: #334155;">{{ $item->customer }}</td>
                            <td class="text-nowrap">{{ date('d-M-Y', strtotime($item->created_at)) }}</td>
                            <td class="text-right">
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="action-btn btn-view-lead" onclick="viewLead('{{ $item->enquery_id }}','P')" title="View Details">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <button type="button" class="action-btn btn-delete-lead" onclick="remove_assigned('{{ $item->assign_id }}')" title="Remove assigned">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                        @endif
                    </tbody>
                </table>
                @elseif($lead_type == 'G')
                <table id="myTable" class="custom-table mb-0">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:15%">Buyer Name</th>
                            <th style="width:15%">Phone</th>
                            <th style="width:15%">Email</th>
                            <th style="width:15%">Enquiry For</th>
                            <th style="width:15%">Budget</th>
                            <th style="width:15%">Date</th>
                            <th class="text-right" style="width:15%">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($list as $item)
                        <tr>
                            <td>{{ $item->id }}</td>
                            <td style="font-weight: 500; color: #334155;">{{ $item->name }}</td>
                            <td>{{ $item->phone }}</td>
                            <td>{{ $item->email }}</td>
                            <td style="font-size: 0.88rem; color: #475569;">
                                {{ get_property_sub_category_name($item->property_for).', '.get_property_category_name($item->property_type) }}
                            </td>
                            <td style="font-weight: 600; color: #1e293b; font-size: 0.88rem;">{{ $item->min_budget.'-'.$item->max_budget }}</td>
                            <td class="text-nowrap">{{ date('d-M-Y', strtotime($item->created_at)) }}</td>
                            <td class="text-right">
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="action-btn btn-view-lead" onclick="viewLead('{{ $item->id }}','G')" title="View Details">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <button type="button" class="action-btn btn-delete-lead" onclick="remove_assigned('{{ $item->assign_id }}')" title="Remove assigned">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="8" class="text-center py-4 text-muted">
                                <i class="fa fa-info-circle me-1"></i> Sorry, no records found!
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
                @endif
            </div>
            
            <div class="custom-table-footer">
                <div class="custom-table-info">
                    Showing {{ $list->firstItem() ?? 0 }} to {{ $list->lastItem() ?? 0 }} of {{ $list->total() ?? 0 }} entries
                </div>
                <div>
                    {!! $list->links('vendor.pagination.bootstrap-5') !!}
                </div>
            </div>
        </div>
    </div>
</div>

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

    function view(id) {
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        viewLead('Lead Details', '', id);
    }

    function viewLead(id,lead_type) {
        if (id) {
            $.get(`{{ url('/enquiry/details') }}/${id}/${lead_type}`, function(data) {
                $('#modal_action').modal('show');
                $('#modal_action .modal-content').html(data);
            });
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
        alert(id);
        if (result) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('/enquiry/remove-assign-list') }}`,
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