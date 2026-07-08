@extends('Admin.layouts.app')
{{-- @dd($users ) --}}

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
                <div>Admin User
                    <div class="page-title-subheading">Admin User &gt; Admin User List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Admin User</li>
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
            #AdminMainModal .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
            #AdminMainModal.show .modal-dialog { transform: translateY(0); }
            #AdminMainModal .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
            #AdminMainModal .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
            #AdminMainModal .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
            #AdminMainModal .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
            #AdminMainModal .form-floating .form-control, #AdminMainModal .form-floating .form-select { height: 52px; font-size: 0.95rem; }
            #saveChangesButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
        }

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
        <button type="button" class="btn-close" data-bs-dismiss="alert">
            
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card card-modern">        
            <div class="settings-card-header">
                <h4><i class="fa fa-users text-primary me-2"></i> Admin User</h4>
                {{-- @if (in_array('MEN0005_Add', $Permissions)) --}}
                <div class="btn-actions-pane-right d-flex align-items-center gap-2">
                    <button type="button" class="btn-add-setting" id="addAdminButton"><i class="fa fa-plus me-1"></i> Add User</button>
                </div>
                {{-- @endif --}}
            </div>
            <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table id="myTable" class="settings-table">
                    <thead>
                        <tr>
                            <th style="width:32px;">ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th style="min-width:110px;">Registered On</th>
                            <th>Status</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody id="user">
                        @foreach ($users as $user)
                        @if ($user->username != 'superadmin')
                        <tr>
                            <td data-label="ID"><span>#{{ $user->id }}</span></td>
                            <td data-label="Username"><span>{{ $user->username }}</span></td>
                            <td data-label="Name" class="fw-bold"><span>{{ $user->full_name }}</span></td>
                            <td data-label="Role"><span>{{ $user->admin_role->name }}</span></td>
                            <td data-label="Registered On"><span>{{ $user->registered_on }}</span></td>
                            <td data-label="Status">
                                <div class="d-flex justify-content-end w-100">
                                    <input data-id="{{ $user->id }}" class="userstatus d-none" type="checkbox"
                                        data-toggle="toggle" data-on="Active" data-off="Inactive"
                                        data-onstyle="success" data-offstyle="danger" data-size="mini"
                                        {{ $user->status ? 'checked' : '' }}>
                                </div>
                            </td>

                            <td data-label="Action" class="text-right">
                                <div class="actions-cell">
                                    {{-- @if (in_array('MEN0005_Edit', $Permissions)) --}}
                                    <a href="javascript:void(0)" class="action-icon-btn edit editButton"
                                        data-userid="{{ $user->id }}"><i class="bi bi-pencil-square"></i></a>
                                    {{-- @endif --}}
                                    {{-- @if (in_array('MEN0005_Delete', $Permissions)) --}}
                                    <a href="javascript:void(0)" class="action-icon-btn delete UserDeleteButton"
                                        data-userid="{{ $user->id }}"><i class="bi bi-trash3-fill"></i></a>
                                    {{-- @endif --}}
                                </div>
                            </td>
                        </tr>
                        @endif
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection


@section('modals')
<div class="modal fade" id="AdminMainModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title fw-bold" id="addEditModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="adminUSerformData">
                    @csrf
                    <!-- Hidden input for user ID -->
                    <input type="text" class='d-none' id="userId" name="id">
                    <div class="form-floating mb-3">
                        
                        <input type="text" class="form-control" id="username" name="username" placeholder="" required>
                        <label for="username">Username</label>
                        <div class="invalid-feedback" id="username_error"></div>
                    </div>
                    <div class="form-floating mb-3">
                        
                        <input type="text" class="form-control" id="name" name="name" placeholder="" required>
                        <label for="Name">Name</label>
                        <div class="invalid-feedback" id="name_error"></div>

                    </div>
                    <div class="form-floating mb-3">
                        
                        <input type="email" class="form-control" id="email" name="email" placeholder="" required>
                        <label for="email">Email</label>
                        <div class="invalid-feedback" id="email_error"></div>
                    </div>
                    <div class="form-floating mb-3 pass-div">
                        
                        <input type="password" class="form-control" id="password" name="password" placeholder="" required>
                        <label for="password">Password</label>
                        <div class="invalid-feedback" id="password_error"></div>
                    </div>
                    <div class="form-floating mb-3">
                        
                        <select class="form-select" id="role" name="role" required>
                            <option value=" ">Select Option</option>
                            @foreach ($roles as $role)
                            @if ($role->name !== 'superadmin' && $role->status != config('constants.STATUS_DELETED'))
                            <option value="{{ $role->id }}">{{ $role->name }}</option>
                            @endif
                            @endforeach
                        </select>
                        <label for="role">Role</label>
                        <div class="invalid-feedback" id="role_error"></div>
                    </div>
                    <div class="form-group mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked
                                required>
                            <label class="form-check-label" for="status_1">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value=0 class="form-check-input" id="status_2">
                            <label class="form-check-label" for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" id="saveChangesButton" class="btn btn-primary px-4 shadow-sm">Save</button>
            </div>
        </div>


    </div>
</div>
@endsection

@push('custom-js')
<script>
    $(document).ready(function() {

        // coonverting the USERNAME field to lowercase and set it in the input field as well
        $('input[name="username"]').on('input', function() {

            $(this).val($(this).val().toLowerCase());
        });

        // coonverting the EMAIL field to lowercase and set it in the input field as well
        $('input[name="email"]').on('input', function() {

            $(this).val($(this).val().toLowerCase());
        });
        // coonverting the NAME field to Proper Case using ARROW FUNCTION of JAVASCRIPT
        $(document).ready(function() {
            $('#name').on('input', function() {
                $(this).val($(this).val().replace(/\b\w/g, char => char.toUpperCase()));
            });
        });




        $('#addAdminButton').click(function() {
            $('.pass-div').show();
            Add_Edit_User('Add User', 'Save')

        });

        $('.editButton').click(function() {

            var id = $(this).data('userid')
            Add_Edit_User('Edit User', 'Update', id)

        });


        function Add_Edit_User(title, button, id = '') {

            $('#addEditModalLabel').text(title);
            $('#saveChangesButton').text(button);
            $('#adminUSerformData')[0].reset();
            $('.invalid-feedback').empty();
            $('.form-control').removeClass('is-invalid');
            // $('.pass-div').show(); //Showing password field while add

            if (id) {

                $('.pass-div').hide(); //hiding password field while edit
                // alert(id);
                $.ajax({

                    url: `{{ url('showSingleUser')}}/` + id,
                    type: 'GET',
                    _token: '{{ csrf_token() }}',
                    dataType: 'json',
                    success: function(response) {
                        console.log('Success:', response);
                        $('#userId').val(response.id);
                        $('#username').val(response.username);
                        $('#name').val(response.full_name);
                        $('#email').val(response.email);
                        // $('#role').val(response.role);
                        $('input[name=status][value="' + response.status + '"]').prop('checked',
                            true);
                        $('select[name="role"]').val(response.role);


                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', xhr.responseText);
                    }

                });
            }
            $('#AdminMainModal').modal('show');
        }


        $('#saveChangesButton').on('click', function(event) {
            event.preventDefault();

            var user_f_data = $('#adminUSerformData').serialize();
            var id = $('#userId').val();
            var url = id ? `{{ url('/userupdate') }}` : `{{ url('/addnewUser') }}`;




            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');

            $.ajax({
                url: url,
                type: 'post',
                data: user_f_data,
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    window.location.reload(true); // Reload the page
                    $('#AdminMainModal').modal('hide');
                    $('#adminUSerformData')[0].reset();
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

        $(".userstatus").change(function(event) {

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

            toastr.success('Request processed successfully.', "User's Status Changed", toastrOptions);

            let userId = $(this).data('id');
            let status = $(this).prop('checked') ? 1 : 0;

            $.ajax({

                url: "{{ url('/userstausUpdate') }}",
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    user_Id: userId,
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

        $('.UserDeleteButton').click(function() {
            if (!confirm('Are you sure you want to delete this User?')) {
                return;
            }

            var id = $(this).data('userid');

            $.ajax({

                url: `{{ url('/usersdelete') }}/` + id,
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
                "targets": [3,5,6]
                },
                
            ]
          
        });
</script>
@endpush