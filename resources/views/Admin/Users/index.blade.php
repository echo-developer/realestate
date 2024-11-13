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
                    <table class="mb-0 table">
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
                            {{-- @foreach ($users as $user)
                                @if ($user->name != 'Superadmin')
                                    <tr>
                                        <td>{{ $user->id }}</td>
                                        <td>{{ $user->username }}</td>
                                        <td>{{ $user->full_name }}</td>
                                        <td>{{ $user->name }}</td>
                                        <td>{{ $user->registered_on }}</td>
                                        <td>
                                            <input data-id="{{ $user->id }}" class="userstatus d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                {{ $user->status ? 'checked' : '' }}>
                                        </td>

                                        <td class="text-right">
                                            @if (in_array('MEN0005_Edit', $Permissions))
                                                <i class="fa fa-edit text-success fa-md editButton"
                                                    data-userid="{{ $user->id }}"></i>
                                            @endif
                                            @if (in_array('MEN0005_Delete', $Permissions))
                                                <i class="fa fa-trash text-danger fa-md deleteButton"
                                                    data-userid="{{ $user->id }}"></i>
                                            @endif
                                        </td>
                                    </tr>
                                @endif
                            @endforeach --}}
                        </tbody>
                    </table>

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
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                            <div class="invalid-feedback" id="password_error"></div>
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select class="form-control" id="userRole" name="role" required>
                                <option value=" ">Select Option</option>
                                {{-- @foreach ($Roles as $role)
                                    @if ($role->name !== 'Superadmin' && $role->status != config('constants.STATUS_DELETED'))
                                        <option value="{{ $role->id }}">{{ $role->name }}</option>
                                    @endif
                                @endforeach --}}
                            </select>
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

@section('custom-js')
    <script>
        $(document).ready(function() {

            $('#addAdminButton').click(function(){

                Add_Edit_User('Add User', 'Save')

            });


            function Add_Edit_User(title, button, id = '') {

                $('#addEditModalLabel').text(title);
                $('#saveChangesButton').text(button);
                $('#adminUSerformData')[0].reset();
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');
                // $('.pass-div').show(); //Showing password field while add


                // $('#slug').attr('readonly', false);
                // $.ajax({

                //     url: '/getRole',
                //     type: 'GET',
                //     _token: '{{ csrf_token() }}',
                //     dataType: 'json',
                //     success: function(response) {
                //         // console.log(response);
                //         var each_role = response.role_list;

                //         var role_select = $('#role');

                //         role_select.empty();

                //         role_select.append('<option value="">' + '--Select Role--' +
                //             '</option>');


                //         $.each(each_role, function(index, key) {

                //             role_select.append('<option value="' + key.role_id + '">' +
                //                 key.name + '</option>');
                //         });
                //     },
                //     error: function(xhr, status, error) {
                //         console.error('Error:', xhr.responseText);
                //     }

                // });

                if (id) {

                    $('.pass-div').hide(); //hiding password field while edit
                    // alert(id);
                    $.ajax({

                        url: '/showSingleUser/' + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            console.log('Success:', response);
                            $('#userUniqueId').val(response.id);
                            $('#user_name').val(response.user_name);
                            $('#user_id').val(response.user_id).attr('readonly', true);
                            $('#email').val(response.email);
                            $('#role').val(response.role);
                            $('input[name=status][value="' + response.status + '"]').prop('checked',
                                true);

                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#AdminMainModal').modal('show');
            }

        });
    </script>
@endsection
