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
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Admin User</li>
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
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Admin User
                {{-- @if (in_array('MEN0005_Add', $Permissions)) --}}
                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-success" id="addAdminButton">Add User</button>
                </div>
                {{-- @endif --}}
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:15%">Username</th>
                            <th style="width:20%">Name</th>
                            <th style="width:15%">Role</th>
                            <th style="min-width:110px; width:20%">Registered On</th>
                            <th style="width:10%">Status</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody id="user">
                        @foreach ($users as $user)
                        @if ($user->username != 'superadmin')
                        <tr>
                            <td>{{ $user->id }}</td>
                            <td>{{ $user->username }}</td>
                            <td>{{ $user->full_name }}</td>
                            <td>{{ $user->admin_role->name }}</td>
                            <td>{{ $user->registered_on }}</td>
                            <td>
                                <input data-id="{{ $user->id }}" class="userstatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $user->status ? 'checked' : '' }}>
                            </td>

                            <td class="text-right">
                                {{-- @if (in_array('MEN0005_Edit', $Permissions)) --}}
                                <i class="fa fa-edit text-success fa-md editButton"
                                    data-userid="{{ $user->id }}"></i>
                                {{-- @endif --}}
                                {{-- @if (in_array('MEN0005_Delete', $Permissions)) --}}
                                <i class="fa fa-trash text-danger fa-md UserDeleteButton"
                                    data-userid="{{ $user->id }}"></i>
                                {{-- @endif --}}
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
            <div class="modal-header">

                <h5 class="modal-title" id="addEditModalLabel"></h5>

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="adminUSerformData">
                    @csrf
                    <!-- Hidden input for user ID -->
                    <input type="text" class='d-none' id="userId" name="id">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                        <div class="invalid-feedback" id="username_error"></div>
                    </div>
                    <div class="form-group">
                        <label for="Name">Name</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                        <div class="invalid-feedback" id="name_error"></div>

                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="invalid-feedback" id="email_error"></div>
                    </div>
                    <div class="form-group pass-div">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                        <div class="invalid-feedback" id="password_error"></div>
                    </div>
                    <div class="form-group">
                        <label for="role">Role</label>
                        <select class="form-control" id="role" name="role" required>
                            <option value=" ">Select Option</option>
                            @foreach ($roles as $role)
                            @if ($role->name !== 'superadmin' && $role->status != config('constants.STATUS_DELETED'))
                            <option value="{{ $role->id }}">{{ $role->name }}</option>
                            @endif
                            @endforeach
                        </select>
                        <div class="invalid-feedback" id="role_error"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="radio-inline">
                            <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked
                                required>
                            <label for="status_1">Active</label>
                            <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                            <label for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="saveChangesButton" class="btn btn-primary">Save</button>
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

                    url: `{{ url('/userstausUpdate') }}` + id,
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
            var url = id ? '/userupdate' : `{{ url('/addnewUser') }}`;




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

                url: '/usersdelete/' + id,
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