@extends('Admin.layouts.app')
@php
    // @dd($propertyReports[0]->toArray())
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
                    <div>Property Reports
                        <div class="page-title-subheading">Property Reports &gt; Property Reports List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Property Reports List</li>
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
            <div class="alert alert-{{ session('message_type') }} alert-dismissible">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        <div class="main-card mb-3 card">
            <div class="card-header d-flex">
                <h4>Property Reports List</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:10%;">Report ID</th>
                                <th style="width:25%;">Property Name <br> <small>(User)</small></th>
                                <th style="width:15%;">Reported by</th>
                                <th style="width:20%;" class="text-center">Report Details</th>
                                <th style="width:20%;" class="text-center">Status</th>
                                {{-- <th style="width:15%;">Action</th> --}}
                                <th style="width:15%;"class="text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody id="user">
                            @if (isset($propertyReports))
                                @forelse($propertyReports as $item)
                                    <tr>
                                        <td>{{ $item->id }}</td>
                                        <td>
                                            <a href="{{ url('allproperties/all-property-view') . '?slug=' . $item?->property_slug }}">{{ $item->property_name ?? 'N/A' }}</a> <br>
                                            <small>{{ $item->posted_by_name ?? 'N/A' }}</small>
                                        </td>
                                        <td>{{ $item->reporter_name ?? 'N/A' }}</td>
                                        <td class="text-center">
                                            @php
                                                $details = [
                                                    'posted_by_name' => $item?->posted_by_name,
                                                    'reason' => $item?->reason,
                                                    'feedback' => $item?->feedback,
                                                    'posted_on' => $item->created_at->format('j M, Y h:i A'),
                                                ];
                                            @endphp
                                            <i class="fa fa-eye text-success fa-md report-details"
                                                data-report-details='@json($details)'>

                                            </i>
                                        </td>
                                        <td class="text-center">
                                            <input data-id="{{ $item->id }}" class="status d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Read" data-off="Unread" data-onstyle="success"
                                                data-offstyle="danger" data-size="mini"
                                                {{ $item->status ? 'checked' : '' }}>
                                        </td>
                                        {{-- <td>
                                            <select name="action" id="action" data-id="{{ $item->id }}" class="action form-control">
                                                <option value="0" {{ $item->actions == 0 ? 'selected' : '' }}>No Action
                                                </option>
                                                <option value="1" {{ $item->actions == 1 ? 'selected' : '' }}>Request
                                                    Changes</option>
                                                <option value="2" {{ $item->actions == 2 ? 'selected' : '' }}>Delete
                                                    Property</option>
                                                <option value="3" {{ $item->actions == 3 ? 'selected' : '' }}>Publish
                                                    Again</option>
                                            </select>
                                        </td> --}}
                                        <td class="text-right">
                                            <a><i class="bi bi-trash3-fill text-danger fa-md"
                                                    onclick="Delete('{{ $item->id }}')"></i></a>
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
                {!! $propertyReports->links('vendor.pagination.bootstrap-5') !!}

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
                        <dd class="col-sm-8" id="reported_by"></dd>

                        <dt class="col-sm-4 fw-semibold">Reason</dt>
                        <dd class="col-sm-8" id="reason"></dd>

                        <dt class="col-sm-4 fw-semibold">Feedback</dt>
                        <dd class="col-sm-8" id="feedback"></dd>

                        <dt class="col-sm-4 fw-semibold">Reported On</dt>
                        <dd class="col-sm-8" id="posted_on"></dd>
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

            $('#reported_by').text(details.posted_by_name);
            $('#reason').text(details.reason ?? 'N/A');
            $('#feedback').text(details.feedback ?? 'N/A');
            $('#posted_on').text(details.posted_on);

            $detailsModal.modal('show')
        })


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
                url: `{{ url('reports/status-property') }}`,
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
                url: `{{ url('reports/actions-property') }}`,
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
                    url: `{{ url('reports/property-delete') }}`,
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
                        "targets": [2, 3, 4]
                    }
                ]
            });
        });
    </script>
@endpush
