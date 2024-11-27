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
                <div>Notification <div class="page-title-subheading">Admin Notification &gt; All Notification List
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Notification</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="#successMessageContainer"></div>
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
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Notification <div
                    class="btn-actions-pane-right">

                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(1)" data-original-title="Mark as read"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(0)" data-original-title="Mark as unread"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
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
                            <th>Date</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($notifications as $notification)
                        <tr>

                            <td>
                                <div class="custom-checkbox custom-control">
                                    <input type="checkbox" id="item_229" class="custom-control-input check_all"
                                        name="ID[]" value="229">
                                    <label class="custom-control-label" for="item_229"></label>
                                </div>
                            </td>
                            <td>{{ $notification->id }}</td>
                            <td>{{ $notification->message }}
                                <div><small class="text-muted"> <i class="fa fa-clock"></i>
                                        {{ $notification->created_date }}</small></div>
                            </td>
                            <td>
                                <input data-id="{{ $notification->id }}" class="toggle-class-noti d-none sts_chnage"
                                    type="checkbox" data-toggle="toggle" data-on="Read" data-off="Unread"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $notification->read_status ? 'checked' : '' }}>

                            </td>
                            <td class="text-right">
                                <a noti_id="{{ $notification->id }}" class="delete-notification" title=""
                                    data-original-title="Delete Permanently"><i
                                        class="fa fa-trash text-danger fa-md"></i>
                                </a>


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
@endpush