@extends('Admin.layouts.app')

@php
    $userTypes = [
        'B' => 'Builder',
        'O' => 'Owner',
        'A' => 'Agent',
    ];
@endphp

@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                    </div>
                    @if (isset($typeName))
                        <div>{{ ucwords(strtolower($typeName)) }}
                            <div class="page-title-subheading">Users &gt; {{ ucwords(strtolower($typeName)) }}
                            </div>
                        </div>
                    @else
                        <div> All User
                            <div class="page-title-subheading">Users &gt; All User</div>
                        </div>
                    @endif
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Users</li>
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

        @php
            //setting dynamic search url , czz $typeName is not present for All User case
            if (isset($typeName)) {
                $search_url = url('member/memberUser/' . $typeName);
            } else {
                $search_url = url('member/memberUser');
            }
        @endphp

        <form action="{{ $search_url }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_category_search" placeholder="Search..." name="term"
                                value="{{ request('term') }}" />
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

        {{-- Dynamic Nav Item --}}
        <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav ml-0">
            <li class="nav-item">
                <a class="nav-link ajax-link {{ Request::is('member/memberUser') ? 'active' : '' }}"
                    href="{{ url('member/memberUser') }}" data-url="{{ url('member/memberUser') }}">
                    <span>All User</span>
                </a>
            </li>
            @foreach ($userTypes as $userType => $userTypeName)
                <li class="nav-item">
                    <a class="nav-link ajax-link {{ Request::is('member/memberUser/' . $userTypeName) ? 'active' : '' }}"
                        href="{{ url('member/memberUser/' . $userTypeName) }}"
                        data-url="{{ url('member/memberUser/' . $userTypeName) }}">
                        <span>{{ $userTypeName }}</span>
                    </a>
                </li>
            @endforeach
        </ul>


        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i>
                    @if (isset($group_key))
                        {{ $group_key }} User
                    @else
                        User
                    @endif
                    <div class="btn-actions-pane-right">

                        <div class="btn-group" id="global_action_btn" style="display:none">
                            <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                                onclick="deleteSelected()" data-original-title="Delete selected"><i
                                    class="fa fa-trash"></i></button>
                            <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                                onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                    class="fa fa-thumbs-up"></i></button>
                            <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                                onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                    class="fa  fa-thumbs-o-down"></i></button>
                        </div>
                        &nbsp;
                        {{-- @if (in_array('MEN0051_LIST_Add', $rolePermissions)) --}}
                        <button type="button" class="btn btn-site btn-sm btn-success" id="allUsersaddButton">
                            <i class="fa fa-plus"></i>
                            Add new User
                        </button>
                        {{-- @endif --}}

                    </div>
                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:5%">Id</th>
                                <th style="width:15%">User Name</th>
                                <th style="width:20%">Email</th>
                                <th style="width:10%">Phone</th>
                                <th style="width:15%">Created At</th>
                                <th style="width:10%">Verify</th>
                                <th style="width:10%">Status</th>
                                <th style="width:15%" class="text-right" style="padding-right:15px;">Action</th>

                            </tr>
                            <thead>
                            <tbody id="allUserBody">
                                @forelse ($data  as $items)
                                    <tr>
                                        <td>{{ $items->id }}</td>
                                        <td>{{ $items->name }}
                                            <br><small>({{ $userTypes[$items->user_type] ?? 'Unknown' }})
                                        </td>
                                        <td
                                            style="width: 25%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ $items->email }}
                                        </td>
                                        <td>{{ $items->phone }}</td>
                                        <td>{{ $items->created_at }}</td>
                                        @if ($items->user_type == 'A')
                                            <td><input type="checkbox" class="agent_verify_status d-none"
                                                    data-id="{{ $items->id }}" data-toggle="toggle" data-on="Verified"
                                                    data-off="Verify" data-onstyle="success" data-offstyle="danger"
                                                    data-size="mini" {{ $items->is_verified_agent ? 'checked' : '' }}>
                                            </td>
                                        @else
                                            <td></td>
                                        @endif
                                        <td>
                                            <input type="checkbox" class="category_prop_status d-none"
                                                data-id="{{ $items->id }}" data-toggle="toggle" data-on="Active"
                                                data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                                data-size="mini" {{ $items->status ? 'checked' : '' }}>
                                        </td>
                                        <td class="text-right" style="padding-right:15px;">

                                            {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                            <a data-toggle="tooltip" title="" class="allUsersEditButton"
                                                data-placement="top" data-original-title="Edit"
                                                user-id="{{ $items->id }}"><i
                                                    class="fa fa-edit text-success fa-md"></i></a>
                                            &nbsp;
                                            {{-- @endif --}}
                                            {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                            <a data-toggle="tooltip" title="" class="allUsersDeleteButton"
                                                data-placement="top" data-original-title="Delete"
                                                user-id="{{ $items->id }}"><i
                                                    class="fa fa-trash text-danger fa-md"></i></a>
                                            &nbsp;
                                            <a href="{{ url('allproperties/all-property-view/' . $items->id) }}"
                                                data-placement="top" data-original-title="Properties"
                                                user-id="{{ $items->id }}"><i
                                                    class="fa fa-building text-success fa-md"></i></a>
                                            &nbsp;
                                            <a href="{{ url('allproject/all-project-view/'.$items->id); }}" data-placement="top" data-original-title="Projects"
                                            user-id="{{ $items->id }}"><i class="fas fa-gopuram text-success fa-md"></i></a>
                                            {{-- @endif --}}
                                        </td>
                                    @empty
                                    <tr>
                                        <td colspan="6">Sorry, no records found!</td>
                                    </tr>
                                @endforelse

                            </tbody>

                    </table>
                </div>
                @if ($data->isNotEmpty())
                    <div class="card-footer pagination-rounded clearfix justify-content-center">
                        <ul class="pagination small mb-0">
                            @if ($data->currentPage() == $data->lastPage() && $data->currentPage() != 1)
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url(1) }}" class="page-link"
                                        rel="start">
                                        <i class="fa fa-chevron-left"></i> First
                                    </a>
                                </li>
                            @endif

                            <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->previousPageUrl() }}"
                                    class="page-link" rel="prev">
                                    <i class="fa fa-chevron-left"></i>
                                </a>
                            </li>

                            @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                                <li class="page-item {{ $data->currentPage() == $i ? 'active' : '' }}">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($i) }}"
                                        class="page-link">{{ $i }}</a>
                                </li>
                            @endfor

                            <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->nextPageUrl() }}"
                                    class="page-link" rel="next">
                                    <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>

                            @if ($data->currentPage() != $data->lastPage())
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($data->lastPage()) }}"
                                        class="page-link" rel="end">
                                        Last <i class="fa fa-chevron-right"></i>
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection


@section('modals')
    <div class="modal fade" id="UsersModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="usersAddEditModalLabel"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="UserFormData">
                        @csrf
                        <!-- Hidden input for user ID -->
                        <input type="hidden" class='d-none' id="prop_userimage" name="image">
                        <input type="text" class='d-none' id="usersId" name="usersId">

                        {{-- <div class="form-group" id="Groups">
                            <label for="Groups">User</label>
                            <select class="form-control" id="Groups_data" name="Groups" required>
                                <option value="default"></option>

                                @foreach ($Users as $user)
                            <option value="{{ strtolower($user->group_key) }}">
                                {{ $user->group_name }}
                            </option>
                            @endforeach
                            </select>

                        </div> --}}
                        <div class="form-group">
                            <label for="user_name">User Name</label>
                            <input type="text" class="form-control" id="user_name" name="user_name" required>
                            <div class="invalid-feedback" id="user_name_error"></div>

                        </div>
                        <div class="form-group">
                            <label for="user_type">User Type</label>
                            <select name="user_type" id="user_type" class="form-control">
                                <option value="">--select--</option>
                                @foreach ($userTypes as $userType => $userTypeName)
                                    <option value="{{ $userType }}">{{ $userTypeName }}</option>
                                @endforeach
                            </select>
                            <div class="invalid-feedback" id="user_type_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="user_phone">Phone No</label>
                            <input type="text" class="form-control" id="user_phone" name="user_phone" required>
                            <div class="invalid-feedback" id="user_phone_error"></div>
                        </div>


                        <div class="form-group">
                            <label for="wp_num">Whatsapp No</label>
                            <input type="text" class="form-control" id="wp_num" name="wp_num" required>
                            <div class="invalid-feedback" id="wp_num_error"></div>
                            <div>
                                <label for="wp_num_sync"><small>Same as Phone No</small>
                                    <span><input type="checkbox" class="" id="wp_num_sync"
                                            name="wp_num_sync"></span></label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="user_email">Email</label>
                            <input type="text" class="form-control" id="user_email" name="user_email" required>
                            <div class="invalid-feedback" id="user_email_error"></div>
                        </div>

                        <div class="form-group password">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                            <div class="invalid-feedback" id="password_error"></div>
                        </div>

                        <div class="form-group password">
                            <label for="password_confirmation">Confirm Password</label>
                            <input type="password" class="form-control" id="password_confirmation"
                                name="password_confirmation" required>
                            <div class="invalid-feedback" id="password_confirmation_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="ufile">Photo</label>
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" name="Userfile" id="UserfileUpload" class="custom-file-input"
                                        onchange="updateUserFileName()">
                                    <label class="custom-file-label" for="ufile">Choose file</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <img id="image_preview" src=" " style="display:none; width: 50px; height: auto;" />
                            <button type="button" id="delete_image_btn" style="display:none;"
                                class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
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
                    <button type="button" id="UsersButton" class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {


            const $checkbox = $('#wp_num_sync');
            const $phoneInput = $('#user_phone');
            const $whatsappInput = $('#wp_num');

            function syncWhatsappNumber() {
                if ($checkbox.prop('checked')) {
                    $whatsappInput.val($phoneInput.val());
                }
            }

            $checkbox.on('change', function() {
                if ($(this).prop('checked')) {
                    syncWhatsappNumber();
                } else {
                    $whatsappInput.val('');
                }
            });

            $phoneInput.on('input', function() {
                syncWhatsappNumber();
            });

            if ($checkbox.prop('checked')) {
                syncWhatsappNumber();
            }






            $('#allUsersaddButton').click(function() {
                $('#image_preview').hide();
                $('#delete_image_btn').hide();
                Add_Edit_User('Add User', 'Save')
            });

            $('.allUsersEditButton').click(function() {

                var userid = $(this).attr('user-id');
                //alert(id);
                Add_Edit_User('Edit User', 'Update', userid);

            });


            function Add_Edit_User(title, button, id = '') {

                $('#usersAddEditModalLabel').text(title);
                $('#UsersButton').text(button);
                $('#UserFormData')[0].reset();
                // $('#slug').attr('readonly', false);
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');

                if (id) {
                    $.ajax({

                        url: "{{ url('member/memberUser-details') }}/" + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            // console.log('Success:', response);
                            $('#usersId').val(response.id);
                            $('#user_name').val(response.name);
                            $('#user_type').val(response.user_type);
                            $('#user_phone').val(response.phone);
                            $('#wp_num').val(response.whatsapp_no);
                            $('#user_email').val(response.email);

                            if (response.image) {
                                $('#image_preview').attr('src',
                                        `{{ asset('memberUser_image') }}/${response.image}`)
                                    .show();
                                $('#delete_image_btn').show();
                            } else {
                                $('#image_preview').hide();
                                $('#delete_image_btn').hide();
                            }

                            $('#prop_userimage').val(response.image);

                            $('input[name="status"][value="' + response.status + '"]').prop(
                                'checked', true);


                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#UsersModal').modal('show');
            }


            $('#UsersButton').on('click', function(event) {
                // alert();
                event.preventDefault();


                var id = $('#usersId').val();
                var f_data = $('#UserFormData').serialize();
                var url = id ? "{{ url('member/allUser-update') }}" : "{{ url('member/member-add') }}"


                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                $.ajax({
                    url: url,
                    type: 'post',
                    data: f_data,
                    dataType: 'json',
                    success: function(response) {
                        // console.log(response)
                        window.location.reload(true); // Reload the page
                        $('#UsersModal').modal('hide');
                        $('#UserFormData')[0].reset();
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


            $('.allUsersDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this User?')) {
                    return;
                }

                var id = $(this).attr('user-id');
                //alert(id);
                // deleteRole('Edit Role', 'Update', id);


                $.ajax({

                    url: "{{ url('member/memberUser-delete') }}/" + id,
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



            $('#UserfileUpload').change(function(event) {
                var fileInput = event.target;
                var file = fileInput.files[0];
                var fileLabel = document.querySelector('.custom-file-label');
                fileLabel.textContent = file.name;

                var reader = new FileReader();
                reader.onload = function(e) {
                    var imagePreview = document.getElementById('image_preview');
                    imagePreview.style.display = 'block';
                    imagePreview.src = e.target.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                }

                var formData = new FormData();
                formData.append('file', file);
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    url: `{{ url('/member/memberUSer-image') }}`,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        console.log('File uploaded successfully');

                        $('#prop_userimage').val(response.fileName);
                        $('#image_preview').attr('src', '/' + 'memberUser_image/' + response
                            .fileName).show();
                        $('#delete_image_btn').show();
                    },
                    error: function(xhr, status, error) {
                        console.error('Error uploading file:', error);
                    }
                });
            });

            $('.category_prop_status').change(function() {

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
                    url: `{{ url('member/memberUser-status') }}`,
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

            $('.agent_verify_status').change(function() {

                toastr.success('Verified', 'Request Status', toastrOptions);

                var id = $(this).data('id');
                var status = this.checked ? 1 : 0;
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'POST',
                    url: `{{ url('member/memberUser/agent-status') }}`,
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
        });


        function deleteUploadedImage() {

            var fileName = $('#prop_userimage').val();
            if (!fileName) {
                alert('No image to delete!');
                return;
            }

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                url: `{{ url('/member/delete-memberUSer-image') }}`,
                type: 'POST',
                data: {
                    file: fileName
                },
                success: function(response) {
                    console.log('File deleted successfully');
                    $('#image_preview').attr('src', '').hide();
                    $('#delete_image_btn').hide();
                    $('#prop_userimage').val('');
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting file:', error);
                }
            });
        }
    </script>
@endpush
