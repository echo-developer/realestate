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
                <i class="bi bi-bell"></i>
                </div>
                <div>Notification <div class="page-title-subheading">Notification <i class="bi bi-chevron-right"></i> All Notification List
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Notification</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="#successMessageContainer"></div>
    <style>
        .app-main__inner { padding-bottom: 2rem; background-color: #f8fafc; overflow-x: hidden; }
        .card-modern { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); background-color: #ffffff; width: 100%; max-width: 100%; }
        .settings-card-header { padding: 0.85rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12px 12px 0 0; }
        .settings-card-header h4 { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
        .btn-add-setting { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.85rem; transition: all 0.2s; }
        .btn-add-setting:hover { background: #2563eb; color: #fff; }
        
        .settings-table { width: 100%; margin: 0; color: #334155; }
        .settings-table th { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .settings-table td { padding: 1rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-weight: 500; }
        .settings-table tr:last-child td { border-bottom: none; }
        
        .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-icon-btn { width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid transparent; transition: all 0.2s; font-size: 1rem; color: #64748b; background: transparent; cursor: pointer; text-decoration: none; }
        .action-icon-btn.edit { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
        .action-icon-btn.edit:hover { background: #16a34a; color: #fff; transform: scale(1.05); }
        .action-icon-btn.delete { border-color: #fecaca; color: #dc2626; background: #fef2f2; }
        .action-icon-btn.delete:hover { background: #dc2626; color: #fff; transform: scale(1.05); }

        /* Mobile Responsiveness */
        @media (max-width: 767px) {
            .settings-card-header { flex-wrap: wrap; gap: 0.75rem; }
            .table-responsive { overflow: visible !important; }
            
            /* Override DataTables wrappers */
            .dataTables_wrapper .row { margin-left: 0 !important; margin-right: 0 !important; }
            .dataTables_wrapper .col-sm-12 { padding-left: 0 !important; padding-right: 0 !important; overflow-x: visible !important; }
            
            .settings-table thead { display: none !important; }
            .settings-table, .settings-table tbody, .settings-table tr, .settings-table td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
            .settings-table tr { margin-bottom: 0.75rem !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 0 !important; overflow: hidden !important; box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; background: #fff !important; }
            .settings-table td { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid #f1f5f9 !important; padding: 0.75rem 1rem !important; text-align: right !important; }
            .settings-table td > span, .settings-table td > div { flex: 1 !important; min-width: 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; text-align: right !important; justify-content: flex-end !important; display: flex !important; align-items: center !important; gap: 0.5rem !important; }
            .settings-table td:last-child { border-bottom: none !important; background: #f8fafc !important; }
            .settings-table td::before { content: attr(data-label) !important; font-weight: 600 !important; color: #64748b !important; font-size: 0.75rem !important; text-transform: uppercase !important; text-align: left !important; padding-right: 1rem !important; flex-shrink: 0 !important; }
            .actions-cell { justify-content: flex-end !important; width: auto !important; }
        }

        .advance-search-panel {
            background-color: #fff;
            box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
            padding: 1rem;
            margin-top: 1rem;
        }
    </style>
    <div class="main-card mb-3 card card-modern">
        <div class="settings-card-header">
            <h4><i class="bi bi-bell text-primary me-2"></i> Notification</h4>
            <div class="btn-actions-pane-right">
                <div class="btn-group" id="global_action_btn" style="display:none">
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="deleteSelected()" data-original-title="Delete selected"><i
                            class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(1)" data-original-title="Mark as read"><i
                            class="fa fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(0)" data-original-title="Mark as unread"><i
                            class="fa  fa-thumbs-down"></i></button>
                </div>
                &nbsp;
            </div>
        </div>

        <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table class="settings-table">
                    <thead>
                        <tr>
                            <th style="width:20px">
                                <div class="custom-checkbox custom-control">
                                    <input type="checkbox" data-target=".check_all" id="all_item"
                                        class="custom-control-input check_all_main">
                                    <label class="custom-control-label" for="all_item"></label>
                                </div>
                            </th>
                            <th>ID</th>
                            <th style="min-width:300px; width:85%">Notification</th>
                            <th>Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($notifications as $notification)
                        <tr>

                            <td data-label="Select">
                                <div>
                                    <div class="custom-checkbox custom-control">
                                        <input type="checkbox" id="item_{{ $notification->id }}" class="custom-control-input check_all"
                                            name="ID[]" value="{{ $notification->id }}">
                                        <label class="custom-control-label" for="item_{{ $notification->id }}"></label>
                                    </div>
                                </div>
                            </td>
                            <td data-label="ID"><span>#{{ $notification->id }}</span></td>
                            <td data-label="Notification">
                                <div>
                                    {!! $notification->message !!}
                                    <div class="mt-1"><small class="text-muted"> <i class="fa fa-clock"></i>
                                            {{ $notification->created_date }}</small></div>
                                </div>
                            </td>
                            <td data-label="Status">
                                <div>
                                    <input data-id="{{ $notification->id }}" class="toggle-class-noti d-none sts_chnage"
                                        type="checkbox" data-toggle="toggle" data-on="Read" data-off="Unread"
                                        data-onstyle="success" data-offstyle="danger" data-size="mini"
                                        {{ $notification->read_status ? 'checked' : '' }}>
                                </div>
                            </td>
                            <td data-label="Action" class="text-right">
                                <div class="actions-cell">
                                    <a href="javascript:void(0)" noti_id="{{ $notification->id }}" class="action-icon-btn delete delete-notification cursor-pointer" title="Delete Permanently">
                                        <i class="bi bi-trash3-fill"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>
            {{-- PAGINATION START --}}
            <div class="card-footer pagination-rounded clearfix justify-content-center">
                <ul class="pagination small mb-0">
                    @if (($notifications->currentPage() == $notifications->lastPage()) & ($notifications->currentPage() != 1))
                    <li class="page-item">
                        <a href="{{ $notifications->url(1) }}" class="page-link" rel="start">
                            <i class="fa fa-chevron-left"></i> First
                        </a>
                    </li>
                    @endif

                    <li class="page-item {{ $notifications->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $notifications->previousPageUrl() }}" class="page-link" rel="prev">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>

                    @for ($i = max($notifications->currentPage() - 1, 1); $i <= min($notifications->currentPage() + 1, $notifications->lastPage()); $i++)
                        <li class="page-item {{ $notifications->currentPage() == $i ? 'active' : '' }}">
                            <a href="{{ $notifications->url($i) }}" class="page-link">{{ $i }}</a>
                        </li>
                        @endfor

                        <li
                            class="page-item {{ $notifications->currentPage() == $notifications->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $notifications->nextPageUrl() }}" class="page-link" rel="next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>

                        @if ($notifications->currentPage() != $notifications->lastPage())
                        <li class="page-item">
                            <a href="{{ $notifications->url($notifications->lastPage()) }}" class="page-link"
                                rel="end">
                                Last <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>
                        @endif
                </ul>

            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="ajaxModal">
    <div class="modal-dialog">
        <div class="modal-content">

        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
    $(document).ready(function() {

        $(".sts_chnage").change(function(event) {

            var toastrOptions = {
                "progressBar": true,
                "positionClass": "toast-top-right",
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
            };



            let notification_Id = $(this).data('id');
            let status = $(this).prop('checked') ? 1 : 0;
            let toaster_msg = $(this).prop('checked') ? 'Marked as Read' : 'Marked as Unread';

            toastr.success('Request processed successfully.', toaster_msg, toastrOptions);

            $.ajax({

                url: "{{ url('/noti_stausUp') }}",
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    notification_Id: notification_Id,
                    status: status
                },
                dataType: 'json',
                success: function(response) {
                    console.log('Status changed successfully:', response);
                },
                error: function(xhr, status, error) {
                    console.error('Error updating status:', xhr.responseText);
                }

            });

        });


        $('.delete-notification').click(function() {
            if (!confirm('Are you sure you want to delete this Role?')) {
                return;
            }

            var id = $(this).attr('noti_id');
            alert(id);
            // deleteRole('Edit Role', 'Update', id);


            $.ajax({

                url: '/deleteNotification/' + id,
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    status: "{{ config('constants.STATUS_DELETE') }}",
                },
                dataType: 'json',
                success: function(response) {
                    // console.log('Success:', response);\
                    window.location.reload(true);


                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                }

            });

        });




    });
    $(document).ready(function() {
        var table = $('.table').DataTable({
            "paging": false,
            "searching": false,
            "info": false,
            "ordering": true,
            "order": [
                [0, 'asc']
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

<!-- <script>
    setInterval(() => {
        fetch("{{ route('admin.notifications.fetch') }}")
            .then(response => response.json())
            .then(data => {
                document.querySelector("#main_table tbody").innerHTML = data.html;
                $('input[data-toggle="toggle"]').bootstrapToggle();
            });
    }, 10000); 

</script> -->
@endpush