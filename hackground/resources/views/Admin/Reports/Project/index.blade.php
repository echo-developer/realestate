@extends('Admin.layouts.app')
@php
    // @dd($projectReports[0]->toArray())
@endphp

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
                    <div>Project Reports
                        <div class="page-title-subheading">Project Reports &gt; Project Reports List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Project Reports List</li>
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
                .status-pill-toggle.inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
                .status-pill-toggle.inactive .dot { background: #dc2626; }
                .status-pill-toggle .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; transition: all 0.2s; }
                
                /* Outline Action Icons */
                .action-icons { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }
                .action-icon { width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.1rem; text-decoration: none; cursor: pointer; }
                .action-icon.outline.delete { color: #ef4444; background: #fff; border: 1px solid #fecaca; }
                .action-icon.outline.delete:hover { background: #fef2f2; }
                .action-icon.outline.view { color: #10b981; background: #fff; border: 1px solid #a7f3d0; }
                .action-icon.outline.view:hover { background: #ecfdf5; }
                
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
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }} alert-dismissible">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        <div class="main-card mb-3 card">
            <div class="card-header d-flex">
                <h4>Project Reports List</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="mb-0 table table-borderless">
                        <thead>
                            <tr>
                                <th style="width:10%;">Report ID</th>
                                <th>Project Info</th>
                                <th>Report Details</th>
                                <th>Status</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="user">
                            @if (isset($projectReports))
                                @forelse($projectReports as $item)
                                    <tr>
                                        <td data-label="Report ID" class="fw-medium text-muted">#{{ $item->id }}</td>
                                        <td data-label="Project Info">
                                            <a class="fw-bold text-dark text-decoration-none" href="{{ url('allproject/all-project-view') . '?slug=' . $item?->Project_slug }}">{{ $item->Project_name ?? 'N/A' }}</a>
                                            <div class="text-muted small mt-1">Posted by: <a href="{{ url('member/memberUser') . '?term=' . $item?->posted_by_name }}" class="fw-semibold text-primary text-decoration-none">{{ $item->posted_by_name ?? 'N/A' }}</a></div>
                                            <div class="text-muted small mt-1"><i class="bi bi-calendar3 me-1"></i>{{ $item->created_at->format('j M, Y') }}</div>
                                        </td>
                                        <td data-label="Report Details">
                                            <div class="fw-medium text-dark">{{ $item->reporter_name ?? 'N/A' }}</div>
                                            @php
                                                $details = [
                                                    'reporter_name' => $item?->reporter_name,
                                                    'reason' => $item?->reason,
                                                    'feedback' => $item?->feedback,
                                                    'posted_on' => $item->created_at->format('j M, Y h:i A'),
                                                ];
                                            @endphp
                                            <div class="mt-2">
                                                <a class="action-icon outline view report-details" style="width:auto; padding: 0 0.8rem; height:28px; font-size:0.8rem;" data-report-details='@json($details)'>
                                                    <i class="bi bi-eye me-1"></i> View Details
                                                </a>
                                            </div>
                                        </td>
                                        <td data-label="Status">
                                            <label class="status-pill-toggle {{ $item->status ? 'active' : 'inactive' }}">
                                                <input type="checkbox" class="status-checkbox d-none" data-id="{{ $item->id }}" {{ $item->status ? 'checked' : '' }}>
                                                <span class="dot"></span> <span class="status-text">{{ $item->status ? 'Read' : 'Unread' }}</span>
                                            </label>
                                        </td>
                                        <td data-label="Action" class="text-right">
                                            <div class="action-icons">
                                                <a class="action-icon outline delete" onclick="Delete('{{ $item->id }}')">
                                                    <i class="bi bi-trash3"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="text-center text-muted">Sorry, no records found!</td>
                                    </tr>
                                @endforelse
                            @endif
                        </tbody>
                    </table>
                </div>
                {!! $projectReports->links('vendor.pagination.bootstrap-5') !!}

            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_report_details" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="AddEditModalLabel">Report Details</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <div class="modal-body">
                    <dl class="row">
                        <dt class="col-sm-4 fw-semibold">Posted By</dt>
                        <dd class="col-sm-8 text-break" id="reported_by"></dd>

                        <dt class="col-sm-4 fw-semibold">Reason</dt>
                        <dd class="col-sm-8 text-break" id="reason"></dd>

                        <dt class="col-sm-4 fw-semibold">Feedback</dt>
                        <dd class="col-sm-8 text-break" id="feedback"></dd>

                        <dt class="col-sm-4 fw-semibold">Reported On</dt>
                        <dd class="col-sm-8 text-break" id="posted_on"></dd>
                    </dl>
                </div>
            </div>

        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        const $detailsModal = $('#modal_report_details')

        $('.report-details').on('click', function() {

            const details = $(this).data('report-details');

            $('#reported_by').text(details.reporter_name);
            $('#reason').text(details.reason ?? 'N/A');
            $('#feedback').text(details.feedback ?? 'N/A');
            $('#posted_on').text(details.posted_on);

            $detailsModal.modal('show')
        })


        $('.status-checkbox').on('change', function() {
            var id = $(this).attr('data-id');
            var status = this.checked ? 1 : 0;
            
            // Visual Pill update
            let label = $(this).closest('.status-pill-toggle');
            let text = label.find('.status-text');
            if(this.checked) {
                label.removeClass('inactive').addClass('active');
                text.text('Read');
            } else {
                label.removeClass('active').addClass('inactive');
                text.text('Unread');
            }
            
            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('reports/status-project') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {},
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });

        $('.action').change(function() {

            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            var id = $(this).data('id');
            var action_status = this.val();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('reports/actions-Project') }}`,
                data: {
                    'action_status': action_status,
                    'id': id
                },
                success: function(data) {},
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
                    url: `{{ url('reports/project-delete') }}`,
                    data: {
                        'id': id
                    },
                    success: function(response) {
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
                        "targets": [1, 2, 3, 4, 5, 6]
                    }
                ]
            });
        });
    </script>
@endpush
