    
    <style id="profile-mobile-fix">
        @media (max-width: 991px) {
            .header-user-info, .fa-angle-down { display: none !important; }
            /* Ensure btn-group doesn't clip the fixed dropdown */
            .header-btn-lg .btn-group { position: static !important; overflow: visible !important; }
            /* Override any Popper inline style */
            .modern-profile-dropdown, .modern-profile-dropdown[style] {
                top: 62px !important;
                left: 10px !important;
                right: 10px !important;
                bottom: auto !important;
                margin: 0 !important;
                transform: none !important;
                position: fixed !important;
                width: auto !important;
            }
        }
    </style>

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
                                    <a data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                        class="p-0 btn profile-avatar-btn">
                                        <img src="{{ asset(config('constants.ADMIN_PHOTO')) }}" alt="User"
                                            width="38" height="38" class="rounded-circle object-fit-cover profile-avatar-img" />
                                    </a>

                                    <div class="dropdown-menu modern-profile-dropdown dropdown-menu-end">
                                        {{-- Top user card --}}
                                        <div class="profile-dropdown-header">
                                            <img src="{{ asset(config('constants.ADMIN_PHOTO')) }}"
                                                alt="User" class="profile-dropdown-avatar" />
                                            <div class="profile-dropdown-info">
                                                <div class="profile-dropdown-name">{{ $admin?->full_name ?? 'Admin' }}</div>
                                                <div class="profile-dropdown-email">{{ $admin?->email ?? '' }}</div>
                                            </div>
                                        </div>

                                        <div class="profile-dropdown-divider"></div>

                                        {{-- Menu items --}}
                                        <a href="#" class="profile-dropdown-item open-profile-modal"
                                            data-bs-toggle="modal" data-bs-target="#editProfileModal"
                                            onclick="moveFocusAndCloseDropdown()">
                                            <i class="bi bi-person-circle"></i>
                                            <span>Edit Profile</span>
                                        </a>
                                        <a href="{{ config('app.frontend_url') }}" class="profile-dropdown-item" target="_blank">
                                            <i class="bi bi-globe"></i>
                                            <span>View Site</span>
                                        </a>

                                        <div class="profile-dropdown-divider"></div>

                                        <a href="{{ url('logout') }}" class="profile-dropdown-item logout">
                                            <i class="bi bi-box-arrow-right"></i>
                                            <span>Logout</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left ml-3 header-user-info">
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

    <style>
        /* ══ MOBILE TOPBAR COMPLETE REDESIGN ══ */
        @media (max-width: 991px) {

            /* ─ Full reset of the header ─ */
            .app-header {
                all: unset !important;
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                width: 100% !important;
                height: 58px !important;
                padding: 0 1rem !important;
                background: #ffffff !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.10) !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                z-index: 1050 !important;
                box-sizing: border-box !important;
            }

            /* ─ Logo block ─ */
            .app-header__logo {
                display: flex !important;
                align-items: center !important;
                flex-shrink: 0 !important;
                width: auto !important;
                padding: 0 !important;
                margin: 0 !important;
                border: none !important;
                background: none !important;
                order: 1 !important;
            }
            .app-header__logo .logo-src {
                display: block !important;
                width: 100px !important;
                height: 38px !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: left center !important;
            }
            /* Hide the hamburger inside logo pane */
            .app-header__logo .header__pane {
                display: none !important;
            }

            /* ─ Content area (right side: profile) ─ */
            .app-header__content {
                all: unset !important;
                display: flex !important;
                flex: 1 !important;
                align-items: center !important;
                justify-content: flex-end !important;
                order: 3 !important;
                gap: 0.75rem;
            }
            .app-header-left  { display: none !important; }
            .app-header-right {
                display: flex !important;
                align-items: center !important;
                gap: 0.5rem;
            }
            .header-btn-lg {
                display: flex !important;
                align-items: center !important;
                padding: 0 !important;
            }
            .header-btn-lg > div,
            .header-btn-lg .widget-content,
            .header-btn-lg .widget-content-wrapper,
            .header-btn-lg .widget-content-left {
                display: flex !important;
                align-items: center !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .header-btn-lg .btn-group {
                display: flex !important;
                align-items: center !important;
            }
            .header-btn-lg .btn-group > a {
                display: flex !important;
                align-items: center !important;
                padding: 2px !important;
                border-radius: 50% !important;
                border: 2px solid #e0e6ef !important;
            }
            .header-btn-lg .btn-group > a img {
                width: 34px !important;
                height: 34px !important;
                border-radius: 50% !important;
                display: block !important;
                object-fit: cover !important;
            }
            .header-btn-lg .fa-angle-down,
            .header-user-info { display: none !important; }

            /* ─ Inject hamburger between logo and profile ─ */
            .app-header__logo::after {
                display: none !important;
            }

            /* ─ Push content below fixed header ─ */
            .app-main {
                padding-top: 58px !important;
            }
        }

        /* ══ PAGE TITLE MOBILE FIX ══ */
        @media (max-width: 767px) {
            .app-page-title {
                padding: 1rem !important;
                margin-bottom: 0.5rem !important;
                background: #f8f9fc;
            }
            .page-title-wrapper {
                display: flex !important;
                align-items: flex-start !important;
                justify-content: space-between !important;
                gap: 0.5rem !important;
            }
            .page-title-heading {
                display: flex !important;
                align-items: center !important;
                gap: 0.6rem !important;
                flex: 1 !important;
                min-width: 0 !important;
            }
            .page-title-icon {
                width: 42px !important;
                height: 42px !important;
                min-width: 42px !important;
                font-size: 1.25rem !important;
                margin: 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                flex-shrink: 0 !important;
                border-radius: 10px !important;
            }
            .page-title-heading > div {
                font-size: 1.05rem !important;
                font-weight: 700 !important;
                line-height: 1.3 !important;
            }
            .page-title-subheading {
                font-size: 0.73rem !important;
                margin-top: 2px !important;
                opacity: 0.7;
            }
            .page-title-actions {
                flex-shrink: 0 !important;
                align-self: center !important;
            }
            .page-title-actions .breadcrumb {
                margin: 0 !important;
                padding: 0 !important;
                background: none !important;
                font-size: 0.72rem !important;
                white-space: nowrap;
            }
            .breadcrumb-item + .breadcrumb-item::before {
                padding: 0 3px;
            }
        }
    </style>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" role="dialog" aria-labelledby="editProfileModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content shadow-sm rounded">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProfileModalLabel">Edit Admin User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        <span></span>
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
                                <input type="radio" name="status" value="1" class="form-check-input"
                                    id="active" {{ $admin?->status === '1' ? 'checked' : '' }}>
                                <label class="form-check-label" for="active">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value="0" class="form-check-input"
                                    id="inactive" {{ $admin?->status === '0' ? 'checked' : '' }}>
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

            $('.open-profile-modal').click(function() {
                $('#editProfileModal').modal('show');
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


