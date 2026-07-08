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
                    <div>Role Management <div class="page-title-subheading">Role Management &gt; All Role List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}">
                                Home</a></li>
                        <li class="breadcrumb-item active">Role Management</li>
                    </ol>
                </div>
            </div>
        </div>
        <div id="successMessageContainer"></div>

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
                
                /* Mobile Bottom-Sheet Modal */
                #RoleModal .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
                #RoleModal.show .modal-dialog { transform: translateY(0); }
                #RoleModal .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
                #RoleModal .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
                #RoleModal .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
                #RoleModal .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
                #RoleModal .form-floating .form-control { height: 52px; font-size: 0.95rem; }
                #RoleButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }} alert-dismissible">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">
                    
                </button>
            </div>
        @endif
        <div class="main-card mb-3 card card-modern">
            
                <div class="settings-card-header">
                    <h4><i class="fa fa-users text-primary me-2"></i> Role Management</h4>
                    <div class="btn-actions-pane-right d-flex align-items-center gap-2">
                        <div class="btn-group" id="global_action_btn" style="display:none">
                            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                                onclick="deleteSelected()" data-original-title="Delete selected"><i
                                    class="fa fa-trash"></i></button>
                            <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                                onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                    class="fa fa-thumbs-up"></i></button>
                            <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                                onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                    class="fa  fa-thumbs-down"></i></button>
                        </div>
                        {{-- @if (in_array('MEN0006_Add', $rolePermissions)) --}}
                        <button type="button" class="btn-add-setting" id='addRole'><i class="fa fa-plus me-1"></i> Add Role </button>
                        {{-- @endif --}}
                    </div>
                </div>
                <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table id="myTable" class="settings-table">
                        <thead>
                            <tr>
                                <th style="width:50px">ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="role">
                            @foreach ($roles as $key => $items)
                                <tr>
                                    <td data-label="ID"><span>#{{ $items->id }}</span></td>
                                    <td data-label="Name" class="fw-bold"><span>{{ $items->name }}</span></td>
                                    <td data-label="Status">
                                        <div class="d-flex justify-content-end">
                                            <input data-id="{{ $items->id }}" class="Rolestatus d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success"
                                                data-offstyle="danger" data-size="mini" {{ $items->status ? 'checked' : '' }}>
                                        </div>
                                    </td>
                                    <td data-label="Action" class="text-right">
                                        <div class="actions-cell">
                                            {{-- @if (in_array('MEN0006_Edit', $rolePermissions)) --}}
                                            <a href="javascript:void(0)" class="action-icon-btn edit RoleEditButton"
                                                roleId="{{ $items->id }}"><i class="bi bi-pencil-square"></i></a>
                                            {{-- @endif --}}
                                            {{-- @if (in_array('MEN0006_Delete', $rolePermissions)) --}}
                                            <a href="javascript:void(0)" class="action-icon-btn delete RoleDeleteButton"
                                                roleId="{{ $items->id }}"><i class="bi bi-trash3-fill"></i></a>
                                            {{-- @endif --}}
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('modals')
    <div class="modal fade" id="RoleModal" tabindex="-1" role="dialog" aria-labelledby="RoleAddEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header border-bottom-0">
                    <h5 class="modal-title fw-bold" id="RoleAddEditModalLabel"> </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="RoleformData">
                        @csrf
                        <!-- Hidden input for user ID -->
                        <input type="hidden" id="roleId" name="id">

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="name" name="name" placeholder="Name" required>
                            <label for="name">Name</label>
                            <div class="invalid-feedback" id="name_error"></div>
                        </div>

                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="slug" name="slug" placeholder="Slug" required>
                            <label for="slug">Slug</label>
                            <div class="invalid-feedback" id="slug_error"></div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="form-label d-block text-muted fw-bold" style="font-size:0.85rem;">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked required>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value="0" class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0">
                    <button type="button" id="RoleButton" class="btn btn-primary px-4 shadow-sm"></button>
                </div>
            </div>


        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {

            $('#name').on('keyup', function() {

                var name = $(this).val(); // Get the value of the Name input
                var slug = name.toLowerCase() // Convert to lowercase
                    .replace(/ /g, '-') // Replace spaces with hyphens
                    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
                $('#slug').val(slug); // Set the generated slug in the Slug input field
            });

            $('#addRole').click(function() {

                Add_Edit_Role('Add Role', 'Save')

            });

            $('.RoleEditButton').click(function() {

                var id = $(this).attr('roleId');
                //alert(id);
                Add_Edit_Role('Edit Role', 'Update', id);

            });


            function Add_Edit_Role(title, button, id = '') {

                $('#RoleAddEditModalLabel').text(title);
                $('#RoleButton').text(button);
                $('#RoleformData')[0].reset();
                $('#slug').attr('readonly', false);
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');

                if (id) {

                    $.ajax({

                        url: `{{ url('/showSingleRole') }}/` + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            // console.log('Success:', response);
                            $('#roleId').val(response.id);
                            $('#name').val(response.name);
                            $('#slug').val(response.slug).attr('readonly', true);
                            $('input[name=status][value="' + response.status + '"]').prop('checked',
                                true);

                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#RoleModal').modal('show');
            }


            $('#RoleButton').on('click', function(event) {
                event.preventDefault();


                var id = $('#roleId').val();
                var f_data = $('#RoleformData').serialize();
                var url = id ? "{{ url('roleupdate') }}" : "{{ url('addnewRole') }}";


                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                $.ajax({
                    url: url,
                    type: 'post',
                    data: f_data,
                    dataType: 'json',
                    success: function(response) {
                        console.log(response.msg)
                        window.location.reload(true); // Reload the page
                        $('#RoleModal').modal('hide');
                        $('#RoleformData')[0].reset();
                    },
                    error: function(xhr) {

                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            console.log(errors);


                            $.each(errors, function(key, value) {
                                var field = $('#' + key);
                                var errorField = $('#' + key +
                                    '_error');
                                field.addClass(
                                    'is-invalid');
                                errorField.text(value[0]).show();
                            });
                        } else {

                            console.log('An error occurred:', xhr.status, xhr.statusText);
                        }
                    }
                });

            });

            $(".Rolestatus").change(function(event) {

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

                toastr.success('Request processed successfully.', 'Role Status Changed', toastrOptions);

                let roleId = $(this).data('id');
                let status = $(this).prop('checked') ? 1 : 0;

                $.ajax({

                    url: "{{ url('/rolestausUp') }}",
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        role_id: roleId,
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


            $('.RoleDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this Role?')) {
                    return;
                }

                var id = $(this).attr('roleid');
                //alert(id);
                // deleteRole('Edit Role', 'Update', id);


                $.ajax({

                    url: "{{ url('/deleteRole') }}/" + id,
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



            var table = $('#myTable').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [0, 'desc']
                ],
                "columnDefs": [{
                        "orderable": false,
                        "targets": [2, 3]
                    },

                ]

            });


        });
    </script>
@endpush
