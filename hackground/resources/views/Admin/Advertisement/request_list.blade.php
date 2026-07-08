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
        /* Modern Table & Mobile Card Design */
        .table-borderless { border-collapse: separate; border-spacing: 0; width: 100%; margin-bottom: 0; }
        .table-borderless thead th { background-color: #f8fafc; color: #1e293b; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-top: none; padding: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .table-borderless tbody td { vertical-align: middle; border-bottom: 1px solid #e2e8f0 !important; border-top: none; padding: 1.25rem 1rem; color: #475569; }
        .table-borderless tbody tr:hover { background-color: #f8fafc; }
        
        /* Status Pill Toggle */
        .status-pill-toggle { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.8rem; cursor: pointer; user-select: none; transition: all 0.2s; border: 1px solid transparent; margin: 0; }
        .status-pill-toggle.active { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
        .status-pill-toggle.active .dot { background: #059669; }
        .status-pill-toggle.inactive { background: #fffbeb; color: #d97706; border-color: #fde68a; }
        .status-pill-toggle.inactive .dot { background: #d97706; }
        .status-pill-toggle .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; transition: all 0.2s; }
        
        /* Outline Action Icons */
        .action-icons { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }
        .action-icon { width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.1rem; text-decoration: none; cursor: pointer; }
        .action-icon.outline.edit { color: #3b82f6; background: #fff; border: 1px solid #bfdbfe; }
        .action-icon.outline.edit:hover { background: #eff6ff; }
        .action-icon.outline.delete { color: #ef4444; background: #fff; border: 1px solid #fecaca; }
        .action-icon.outline.delete:hover { background: #fef2f2; }
        .action-icon.outline.view { color: #10b981; background: #fff; border: 1px solid #a7f3d0; }
        .action-icon.outline.view:hover { background: #ecfdf5; }
        .action-icon.outline.approve { color: #8b5cf6; background: #fff; border: 1px solid #c4b5fd; }
        .action-icon.outline.approve:hover { background: #f5f3ff; }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .table-borderless thead { display: none; }
            .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; padding: 0; }
            .table-borderless tbody td { border: none !important; padding: 1rem 1.25rem !important; display: block; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; }
            .table-borderless tbody td:last-child { border-bottom: none !important; }
            
            /* Mobile Labels */
            .table-borderless tbody td::before { content: attr(data-label); display: block; font-weight: 700; color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px; }
            
            /* Status & Action layout for mobile */
            .table-borderless tbody td[data-label="Status"],
            .table-borderless tbody td[data-label="Action"] { display: flex; justify-content: space-between; align-items: center; }
            .table-borderless tbody td[data-label="Status"]::before,
            .table-borderless tbody td[data-label="Action"]::before { margin-bottom: 0; }
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
                <table id="myTable" class="mb-0 table table-borderless">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th>Advertiser</th>
                            <th>Ad Placement</th>
                            <th>Duration</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($list as $item)
                        <tr>
                            <td data-label="ID" class="fw-medium text-muted">#{{ $item->request_id }}</td>
                            <td data-label="Advertiser">
                                <div class="fw-bold text-dark">{{ $item->name }}</div>
                                <div class="text-muted small"><i class="bi bi-envelope me-1"></i>{{ $item->email }}</div>
                                <div class="text-muted small"><i class="bi bi-telephone me-1"></i>{{ $item->phone_code.''.$item->phone }}</div>
                            </td>
                            <td data-label="Ad Placement">
                                <div class="fw-medium text-dark">{{ $item->page ? $item->page : 'N/A' }}</div>
                                <div class="text-muted small mt-1">Pos: {!! $item->position ? '<span class="badge-soft badge-soft-info" style="font-size:0.65rem; padding:0.2em 0.6em;">'.$item->position.'</span>' : '<span class="text-muted">N/A</span>' !!}</div>
                            </td>
                            <td data-label="Duration">
                                @if($item->duration > 0)
                                    <span class="fw-medium">{{ $item->duration }} {{ $item->duration == 1 ? 'week' : 'weeks' }}</span>
                                @else
                                    <span class="text-muted">N/A</span>
                                @endif
                            </td>
                            <td data-label="Location">
                                @php
                                    $locName = get_name_by_id('locality_names','locality_id',$item->locality_id,'en');
                                    $cityName = get_name_by_id('city_names','city_id',$item->city_id,'en');
                                    $fullLocation = implode(', ', array_filter([$locName, $cityName]));
                                @endphp
                                {{ $fullLocation ?: '-' }}
                            </td>
                            <td data-label="Status"> 
                                <label class="status-pill-toggle {{ $item->status ? 'active' : 'inactive' }}">
                                    <input type="checkbox" class="ad_status_checkbox d-none" data-id="{{ $item->request_id }}" {{ $item->status ? 'checked' : '' }}>
                                    <span class="dot"></span> <span class="status-text">{{ $item->status ? 'Completed' : 'Pending' }}</span>
                                </label>
                            </td>
                            <td data-label="Action" class="text-right">
                                <div class="action-icons">
                                    @if($item->status == '0')
                                        <a onclick="approve('{{ $item->request_id }}')" class="action-icon outline approve" title="Approve">
                                            <i class="bi bi-check-lg"></i>
                                        </a>
                                    @endif
                                    <a onclick="view('{{ $item->request_id }}')" class="action-icon outline view" title="View">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                </div>
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
        let approveCommand = "{{ $approve_command }}";
        let url = `{{ url('advertisement/ajax_page') }}?page=${approveCommand}&request_id=${request_id}`;
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



    $('.ad_status_checkbox').on('change', function() {
        var id = $(this).attr('data-id');
        var status = this.checked ? 1 : 0;
        
        // Visual Pill update
        let label = $(this).closest('.status-pill-toggle');
        let text = label.find('.status-text');
        if(this.checked) {
            label.removeClass('inactive').addClass('active');
            text.text('Completed');
        } else {
            label.removeClass('active').addClass('inactive');
            text.text('Pending');
        }
        
        toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
        
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