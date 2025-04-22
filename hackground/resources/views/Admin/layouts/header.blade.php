    <!--Header START-->
    @php
        $admin = Auth::guard('admin')->user();
        // dd($admin);
    @endphp
    <div class="app-header header-shadow">
        <div class="app-header__logo">
            <a href="{{ route('admin.dashboard') }}">
                <div class="logo-src"></div>
            </a>
            <div class="header__pane ml-auto">
                <div>
                    <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
                        data-class="closed-sidebar">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <div class="app-header__content">
            <div class="app-header-left">
                <div class="search-wrapper">
                    <div class="input-holder">
                        <input type="text" class="search-input" placeholder="Type to search">
                        <button class="search-icon"><span></span></button>
                    </div>
                    <button class="close"></button>
                </div>
            </div>
            <div class="app-header-right">
                <div class="header-btn-lg pr-0">
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">
                            <div class="widget-content-left">
                                <div class="btn-group">
                                    <a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                        class="p-0 btn">
                                        <img src="{{ asset(config('constants.ADMIN_PHOTO')) }}" alt="User"
                                            width="40" height="40" class="rounded-circle object-fit-cover" />

                                        <i class="fa fa-angle-down ml-2 opacity-8"></i>
                                    </a>

                                    <div tabindex="-1" role="menu" aria-hidden="true"
                                        class="rm-pointers dropdown-menu-lg dropdown-menu dropdown-menu-right">
                                        <div class="dropdown-menu-header">
                                            <div class="dropdown-menu-header-inner bg-info">
                                                <div class="menu-header-image opacity-2"></div>
                                                <div class="menu-header-content text-left">
                                                    <div class="widget-content p-0">
                                                        <div class="widget-content-wrapper">
                                                            <div class="widget-content-left mr-3">
                                                                <img src="{{ asset(config('constants.ADMIN_PHOTO')) }}"
                                                                    alt="User" width="60" height="60"
                                                                    class="rounded-circle object-fit-cover" />

                                                            </div>
                                                            <div class="widget-content-left">
                                                                <div class="widget-heading">
                                                                    {{ $admin?->full_name ?? 'N/A' }}
                                                                </div>
                                                                <div class="widget-subheading opacity-8">
                                                                    {{ $admin?->email ?? 'N/A' }}
                                                                </div>
                                                            </div>
                                                            <div class="widget-content-right mr-2">
                                                                <a href={{ url('logout') }}><button
                                                                        class="btn-pill btn-shadow btn-shine btn btn-focus">Logout
                                                                    </button></a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-3">
                                            <div class="mb-2">
                                                <strong class="text-muted small">MY ACCOUNT</strong>
                                            </div>
                                            <a href="#" class="d-block text-primary mb-3" data-toggle="modal"
                                                data-target="#editProfileModal" onclick="moveFocusAndCloseDropdown()">
                                                Edit Profile
                                            </a>

                                            <div class="text-center">
                                                <a href="{{ config('app.frontend_url') }}"
                                                    class="btn btn-sm btn-primary">View Site</a>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div class="widget-content-left  ml-3 header-user-info">
                                <div class="widget-heading">

                                </div>
                                <div class="widget-subheading">
                                    @if (Auth::guard('admin')->user()->username)
                                        {{ Auth::guard('admin')->user()->username }}
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--Header END-->

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" role="dialog" aria-labelledby="editProfileModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content shadow-sm rounded">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProfileModalLabel">Edit Admin User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <form id="adminUserForm">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="hidden" value="{{ $admin?->id }}" name="admin_id">
                            <input type="text" class="form-control" name="username" value="{{ $admin?->username }}"
                                readonly>
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" name="full_name"
                                value="{{ $admin?->full_name }}">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" name="email" value="{{ $admin?->email }}">
                        </div>
                        <div class="form-group">
                            <label>Status</label><br>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" name="status" value="1"
                                    class="form-check-input" id="active"
                                    {{ $admin?->status === '1' ? 'checked' : '' }}>
                                <label class="form-check-label" for="active">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" name="status" value="0"
                                    class="form-check-input" id="inactive"
                                    {{ $admin?->status === '0' ? 'checked' : '' }}>
                                <label class="form-check-label" for="inactive">Inactive</label>
                            </div>
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="changePassword">
                            <label class="form-check-label" for="changePassword">Change Password</label>
                        </div>
                        <div class="form-group d-none password-field">
                            <label>New Password</label>
                            <input type="password" class="form-control" name="password">
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="adminUserUpdateBtn"
                        onclick='updateAdminDetails({{ $admin?->id }})'>Save</button>
                </div>
            </div>
        </div>
    </div>


    <script>
        function moveFocusAndCloseDropdown() {
            $('#editProfileModal').on('shown.bs.modal', function() {
                $(this).find('.close').focus();
            });

            $('.dropdown-menu').removeClass('show');
        }


        function updateAdminDetails(adminId) {
            let form = $('#adminUserForm')[0];
            let formData = new FormData(form);
            formData.append('admin_id', adminId);

            if (!$('#changePassword').is(':checked')) {
                formData.delete('password');
            }

            $.ajax({
                url: '{{ route('admin.update.Details') }}',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('Success:', response);
                    $('#editProfileModal').modal('hide');
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error('Error:', xhr.responseText);
                }
            });
        }
        $(document).ready(function() {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $('#editProfileModal').on('shown.bs.modal', function() {
                $('#changePassword').prop('checked', false);
                $('.password-field').addClass('d-none');
            });

            $('#changePassword').on('change', function() {
                if ($(this).prop('checked')) {
                    $('.password-field').removeClass('d-none');
                } else {
                    $('.password-field').addClass('d-none');
                }
            });

        })
    </script>
