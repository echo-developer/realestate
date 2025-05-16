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
                    <div>Assign Leads
                        <div class="page-title-subheading">Assign Leads to Agents &gt; Agent List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Assign Leads</li>
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

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <h4>Agent Lead Details</h4>
                    <div class="row mt-2" style="text-transform: none;">
                        <div class="col">
                            <ul>
                                <li><strong>Name:</strong> {{ $enquiry?->name ?? 'N/A' }}</li>
                                <li><strong>Phone:</strong> {{ $enquiry?->phone ?? 'N/A' }}</li>
                            </ul>
                        </div>
                        <div class="col">
                            <ul>
                                <li><strong>Email:</strong> {{ $enquiry?->email ?? 'N/A' }}</li>
                                <li><strong>Message:</strong> {{ $enquiry?->messsage ?? 'N/A' }}</li>
                            </ul>
                        </div>
                        <div class="col">
                            <ul>
                                <li><strong>Posted On:</strong>
                                    {{ $enquiry?->created_at ? date('d-M-Y', strtotime($enquiry?->created_at)) : 'N/A' }}
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav ml-0">
            <li class="nav-item">
                <a class="nav-link ajax-link {{ Request::is('enquiry/general-agent-leads-assign-list/' . $enquiry?->id) ? 'active' : '' }}"
                    href="{{ url('enquiry/general-agent-leads-assign-list/' . $enquiry?->id) }}"
                    data-url="{{ url('enquiry/assign-list/' . $enquiry?->id) }}">
                    <span>Unassigned</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link ajax-link {{ Request::is('enquiry/general-agent-leads-assign-list/assigned/' . $enquiry->id) ? 'active' : '' }}"
                    href="{{ url('enquiry/general-agent-leads-assign-list/assigned/' . $enquiry->id) }}"
                    data-url="{{ url('enquiry/assign-list/assigned/' . $enquiry->id) }}">
                    <span>Assigned</span>
                </a>
            </li>
        </ul>

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h4>Assign Leads</h4>
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="assign()">Assign</button>
                    </div>
                </div>

                <div class="table-responsive" id="assign_table">
                    <form id="assign-form">
                        <input type="hidden" name="enquery_id" value="{{ $enquiry->id }}" />
                        <table id="myTable" class="mb-0 table">
                            <thead>
                                <tr>
                                    @if ($assigned == false)
                                        <th style="width:5%">Check</th>
                                    @endif
                                    <th style="width:5%">User ID</th>
                                    <th style="width:10%">Agent Name</th>
                                    <th style="width:10%">Leads Used / Total Leads</th>
                                    @if ($assigned == true)
                                        <th style="width:10%">Assigned Date</th>
                                        <th style="width:10%">Action</th>
                                    @endif
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($agent_list as $item)
                                    @php
                                        if ($assigned == false) {
                                            $leads = $item->membership->leads ?? 0;
                                            $leads_used = $item->membership->leads_used ?? 0;
                                        } elseif ($assigned == true) {
                                            $leads = $item->leads ?? 0;
                                            $leads_used = $item->leads_used ?? 0;
                                        }
                                        $is_clickable = $leads > $leads_used ? 1 : 0;
                                    @endphp

                                    <tr>
                                        @if (!$assigned)
                                            <td>
                                                <input name="userid[]" value="{{ $item->id }}" type="checkbox"
                                                    class="user-selected" {{ !$is_clickable ? 'disabled' : '' }} />
                                            </td>
                                        @endif
                                        <td>{{ $item->id }}</td>
                                        <td>{{ $item->name }}</td>
                                        <td>{{ $leads_used }}/{{ $leads }}</td>
                                        @if ($assigned == true)
                                            <td>{{ $item->created_at ? date('d-M-Y', strtotime($item->created_at)) : '' }}
                                            </td>
                                            <td>
                                                <a data-bs-toggle="tooltip" data-bs-placement="top"
                                                    data-bs-title="Remove from assigned list" class="allUsersDeleteButton"
                                                    user-id="{{ $item->id }}"
                                                    onclick="remove_assigned('{{ $item->assign_id }}')"><i
                                                        class="fa fa-trash text-danger fa-md"></i>
                                                </a>
                                            </td>
                                        @endif
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="text-center">Sorry, no records found!</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </form>
                </div>
                {!! $agent_list->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        function assign() {
            var formId = $("#assign-form");
            var ln = $('#assign-form input[name="userid[]"]:checked').length;
            if (ln > 0) {
                $.ajax({
                    type: 'POST',
                    url: '{{ url('/enquiry/general-save-assign-list') }}',
                    data: $(formId).serialize(),
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    dataType: 'JSON',
                    success: function(res) {
                        if (res.status == 'OK') {
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
                        } else {
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
            } else {
                alert('Please select member(s)');
            }
        }

        function remove_assigned(assign_id) {
            if (assign_id) {
                var conf = confirm('Are you sure want to remove from assigned list?');
                if (conf == true) {
                    $.ajax({
                        type: 'POST',
                        url: '{{ url('/enquiry/remove-assign-list') }}',
                        data: {
                            assign_id: assign_id
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        dataType: 'JSON',
                        success: function(res) {
                            if (res.status == 'OK') {
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
                        },
                        error: function(xhr) {
                            Swal.fire({
                                title: "Error!",
                                text: "Something went wrong while removing the user.",
                                icon: "error",
                                confirmButtonText: "OK"
                            });
                        }
                    });
                }

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
