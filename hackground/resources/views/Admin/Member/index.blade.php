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
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
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
        <button type="button" class="btn-close" data-bs-dismiss="alert">

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
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control" id="prop_category_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    {{-- Dynamic Nav Item --}}
    <ul class="nav nav-underline mb-3 gap-4">
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
        <div class="card-header d-flex">
            <h4>
                @if (isset($group_key))
                {{ $group_key }} User
                @else
                User
                @endif
            </h4>
            <div class="btn-actions-pane-right">

                <div class="btn-group" id="global_action_btn" style="display:none">
                    <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="deleteSelected()" data-original-title="Delete selected"><i
                            class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(1)" data-original-title="Make active"><i
                            class="fa fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-default btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                        onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                            class="fa  fa-thumbs-o-down"></i></button>
                </div>
                &nbsp;
                {{-- @if (in_array('MEN0051_LIST_Add', $rolePermissions)) --}}
                <button type="button" class="btn btn-site btn-sm btn-primary" id="allUsersaddButton">
                    <i class="fa fa-plus"></i>
                    Add new User
                </button>
                {{-- @endif --}}

            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Created At</th>
                            <th>Leads</th>
                            <th>Verify</th>
                            <th>Status</th>
                            <th style="text-align: right;">Action</th>
                        </tr>
                        <thead>
                        <tbody id="allUserBody">
                            @forelse ($data as $items)
                            <tr>

                                <td>
                                    <a href="{{ route('memberUser.allDetails', $items->id) }}" target="_blank" class="d-flex">
                                        @php
                                        $relativePath = 'user_upload/profile_image/' . $items->image;
                                        $localPath = public_path($relativePath);

                                        $imageToShow =isset($items->image) && file_exists($localPath)? true: false;
                                        @endphp
                                        @if($imageToShow)
                                        <img src="{{ asset('user_upload/profile_image/' . $items->image) }}" alt="User" height="40" width="40" class="rounded-circle me-2" />
                                        @else
                                        <span class="user-initial rounded-circle me-2" style="background-color: <?= getAvatarColor($items->name) ?>;"><?php echo strtoupper($items->name[0]);  ?></span>
                                        @endif
                                        <div>{{ $items->name }}<br><span class="badge bg-info">{{ $userTypes[$items->user_type] ?? 'Unknown' }}</span>

                                            @if($items->userbadges && $items->userbadges->count())
                                            <div class="mt-1">
                                                @foreach($items->userbadges as $badge)
                                                @php
                                                $badgeName = $badge->names->firstWhere('lang', app()->getLocale())?->name;
                                                @endphp
                                                <span class="badge bg-secondary d-inline-flex align-items-center me-1" title="{{ $badgeName }}">
                                                    @if($badge->icon)
                                                    <img src="{{ asset('user_upload/badges/' . $badge->icon) }}" alt="Badge Icon" width="16" height="16" class="me-1">
                                                    @endif
                                                    {{ $badgeName }}
                                                </span>
                                                @endforeach
                                            </div>
                                            @endif


                                        </div>
                                    </a>

                                </td>
                                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width:150px;">
                                    {{ $items->email }}
                                </td>
                                <td>{{ $items->phone }}</td>
                                <td>{{ date('d-M-Y', strtotime($items->created_at)) }}</td>
                                <td>
                                    @php
                                    $leads_count = memberLeadsCount($items->id);
                                    @endphp
                                    {{ memberLeadsCount($items->id) }}
                                    @if ($leads_count > 0)
                                    <a href="{{ url('/enquiry/member-leads?user_id=' . $items->id . '&lead_type=P') }}"
                                        title="View Leads"><i class="fa fa-eye"></i></a>
                                    @endif
                                </td>
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
                                    @if ($items->user_type == 'A')
                                    <a href="javascript:void(0)"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-bs-title="Assign Badge"
                                        class="assignBadgeButton"
                                        data-user-id="{{ $items->id }}">
                                        <i class="bi bi-award-fill text-primary fa-md"></i>
                                    </a>
                                    &nbsp;
                                    @endif


                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit" class="allUsersEditButton"
                                        user-id="{{ $items->id }}"><i
                                            class="bi bi-pencil-fill text-success fa-md"></i></a>
                                    &nbsp;
                                    {{-- @endif --}}
                                    {{-- @if (in_array('MEN0051_LIST_Edit', $rolePermissions)) --}}
                                    <a href="javascript:void(0)" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete" class="allUsersDeleteButton"
                                        user-id="{{ $items->id }}"><i
                                            class="bi bi-trash3-fill text-danger fa-md"></i></a>
                                    &nbsp;
                                    <a href="{{ url('allproperties/all-property-view/' . $items->id) }}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Properties"
                                        user-id="{{ $items->id }}"><i
                                            class="bi bi-building-fill text-success fa-md"></i></a>
                                    &nbsp;
                                    <a href="{{ url('allproject/all-project-view/' . $items->id) }}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Projects"
                                        user-id="{{ $items->id }}"><i
                                            class="bi bi-pie-chart-fill text-success fa-md"></i></a>
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
            {!! $data->links('vendor.pagination.bootstrap-5') !!}
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
                <button type="button" class="btn-close" data-bs-dismiss="modal">

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
                            <select class="form-select" id="Groups_data" name="Groups" required>
                                <option value="default"></option>

                                @foreach ($Users as $user)
                            <option value="{{ strtolower($user->group_key) }}">
                    {{ $user->group_name }}
                    </option>
                    @endforeach
                    </select>

            </div> --}}
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_name" name="user_name" placeholder="" required>
                <label for="user_name">User Name</label>
                <div class="invalid-feedback" id="user_name_error"></div>

            </div>
            <div class="form-floating mb-3">
                <select name="user_type" id="user_type" class="form-select">
                    <option value="">--select--</option>
                    @foreach ($userTypes as $userType => $userTypeName)
                    <option value="{{ $userType }}">{{ $userTypeName }}</option>
                    @endforeach
                </select>
                <label for="user_type">User Type</label>
                <div class="invalid-feedback" id="user_type_error"></div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_phone" name="user_phone" placeholder="" required>
                <label for="user_phone">Phone No</label>
                <div class="invalid-feedback" id="user_phone_error"></div>
            </div>


            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="wp_num" name="wp_num" placeholder="" required>
                <label for="wp_num">Whatsapp No</label>
                <div class="invalid-feedback" id="wp_num_error"></div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="wp_num_sync" name="wp_num_sync">
                    <label class="form-check-label" for="wp_num_sync">
                        <small>Same as Phone No</small>
                    </label>
                </div>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="user_email" name="user_email" placeholder="" required>
                <label for="user_email">Email</label>
                <div class="invalid-feedback" id="user_email_error"></div>
            </div>

            <div class="form-floating mb-3 password">
                <input type="password" class="form-control" id="password" name="password" placeholder="" required>
                <label for="password">Password</label>
                <div class="invalid-feedback" id="password_error"></div>
            </div>

            <div class="form-floating mb-3 password">

                <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" placeholder="" required>
                <label for="password_confirmation">Confirm Password</label>
                <div class="invalid-feedback" id="password_confirmation_error"></div>
            </div>

            <div class="form-group">

                <input type="file" name="Userfile" id="UserfileUpload" class="form-control" onchange="updateUserFileName()">
                <!-- <label for="ufile">Photo</label> -->

            </div>
            <div class="form-group">
                <img id="image_preview" src=" " style="display:none; width: 50px; height: auto;" />
                <button type="button" id="delete_image_btn" style="display:none;"
                    class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
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
        <div class="modal-footer">
            <button type="button" id="UsersButton" class="btn btn-primary">Save</button>
        </div>
    </div>


</div>
</div>

<div class="modal fade" id="defult-modal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="AddEditModalLabel">Assign Badges</h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="formData">
                    <input type="hidden" id="selected_user_id" name="user_id">
                    <div class="mb-3">
                        <div class="row" id="badgeCheckboxContainer">
                            @foreach($badge_list as $item)
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="badge_ids[]"
                                        value="{{ $item->badge_id }}"
                                        id="badge_{{ $item->badge_id }}">
                                    <label class="form-check-label" for="badge_{{ $item->badge_id }}">
                                        {{ $item->name }}
                                    </label>
                                </div>
                            </div>
                            @endforeach
                        </div>
                        <div class="invalid-feedback d-block" id="badge_ids_error"></div>
                    </div>

                </form>
            </div>

            <div class="modal-footer">
                <button type="button" onclick="saveData()" class="btn btn-primary">Save</button>
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
                                    `{{ asset('user_upload/profile_image/') }}/${response.image}`)
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
                    $('#prop_userimage').val(response.fileName);
                    $('#image_preview').attr('src', asset('user_upload/profile_image/') +
                        response
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


<script>
    $(document).on('click', '.assignBadgeButton', function() {
        var userId = $(this).data('user-id');
        $('#selected_user_id').val(userId);
        $.get(`{{ route('badges.get', ':id') }}`.replace(':id', userId), res => {
            $('input[name="badge_ids[]"]').prop('checked', false);

            // Then, check the assigned ones
            res.assigned.forEach(id => {
                $(`#badge_${id}`).prop('checked', true);
            });
        });
        $('#defult-modal').modal('show');
    });

    function saveData() {
        let form = $('#formData')[0];
        let formData = new FormData(form);
        $('.is-invalid').removeClass('is-invalid');

        $.ajax({
            url: `{{ route('user-badges.assgin') }}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#defult-modal').modal('hide');
                $('#formData')[0].reset();
                localStorage.setItem('successMessage', response.message);
                window.location.reload();
            },
            error: function(xhr) {
                if (xhr.status === 422) {
                    let errors = xhr.responseJSON.errors;
                    $.each(errors, function(key, messages) {
                        let fieldId = key.replace('.', '_');
                        $('#' + fieldId).addClass('is-invalid');
                    });
                } else {
                    console.error('Error:', xhr.responseText);
                }
            }
        });
    }
</script>
@endpush