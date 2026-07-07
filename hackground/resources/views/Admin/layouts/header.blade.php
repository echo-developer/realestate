    
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

        <div class="app-header__mobile-menu">
            <div>
                <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
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
                            <div class="widget-content-left d-flex align-items-center">
                                <div class="d-none d-lg-block" style="border-left: 1px solid #e5e7eb; height: 35px; margin-right: 15px;"></div>
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
                            <div class="widget-content-left ml-3 header-user-info d-none d-lg-block" style="cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div class="widget-heading fw-bolder" style="color: #4b5563; font-size: 1rem; line-height: 1.2;">
                                    {{ Auth::guard('admin')->user()->full_name ?? (Auth::guard('admin')->user()->username ?? 'Super Admin') }}
                                </div>
                                <div class="widget-subheading" style="color: #9ca3af; font-size: 0.85rem; margin-top: 2px;">
                                    Administrator
                                </div>
                            </div>
                            <div class="widget-content-left ml-2 header-user-info d-none d-lg-block" style="cursor: pointer;" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="bi bi-chevron-down" style="color: #6b7280; font-size: 0.8rem; font-weight: bold;"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--Header END-->

    <style>
        /* ══ 2026 DROPDOWN & AVATAR MODERNIZATION (Global) ══ */
        /* ══ 2026 DROPDOWN & AVATAR MODERNIZATION (Global) ══ */
        
        .header-btn-lg .btn-group > a.profile-avatar-btn {
            padding: 3px !important;
            border-radius: 50% !important;
            border: 1px solid #bfdbfe !important;
            background-color: #fff !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
            transition: all 0.3s ease;
            display: flex !important;
            align-items: center !important;
            margin-left: 4px;
        }
        .header-btn-lg .btn-group > a.profile-avatar-btn:hover {
            border-color: #93c5fd !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
        }
        
        .modern-profile-dropdown {
            border-radius: 16px !important;
            border: none !important;
            box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
            padding: 0 !important;
            min-width: 260px !important;
            overflow: hidden !important;
            margin-top: 10px !important;
        }
        
        .profile-dropdown-header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
            padding: 20px !important;
            display: flex !important;
            align-items: center !important;
            gap: 15px !important;
            color: white !important;
        }
        
        .profile-dropdown-avatar {
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            border: 3px solid rgba(255,255,255,0.2) !important;
            object-fit: cover !important;
        }
        
        .profile-dropdown-name {
            font-weight: 700 !important;
            font-size: 1.1rem !important;
            margin-bottom: 2px !important;
            color: #ffffff !important;
            line-height: 1.2 !important;
        }
        
        .profile-dropdown-email {
            font-size: 0.8rem !important;
            color: rgba(255,255,255,0.8) !important;
        }
        
        .profile-dropdown-item {
            padding: 12px 20px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            color: #475569 !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            background: transparent !important;
        }
        .profile-dropdown-item:hover {
            background: #f8fafc !important;
            color: #2563eb !important;
            padding-left: 24px !important;
        }
        .profile-dropdown-item i {
            font-size: 1.1rem !important;
            color: #94a3b8 !important;
            transition: all 0.2s ease !important;
        }
        .profile-dropdown-item:hover i { color: #2563eb !important; }
        
        .profile-dropdown-item.logout { color: #ef4444 !important; }
        .profile-dropdown-item.logout i { color: #f87171 !important; }
        .profile-dropdown-item.logout:hover {
            background: #fef2f2 !important;
            color: #dc2626 !important;
        }
        .profile-dropdown-item.logout:hover i { color: #dc2626 !important; }
        
        .profile-dropdown-divider {
            height: 1px !important;
            background: #f1f5f9 !important;
            margin: 4px 0 !important;
            border: none !important;
        }

        /* ══ DESKTOP TOPBAR MODERNIZATION (2026 Trend) ══ */
        @media (min-width: 992px) {
            .app-header {
                box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;
                background: #ffffff !important;
                border-bottom: 1px solid #f1f5f9 !important;
                height: 64px !important;
            }
            .app-header__logo {
                background: #ffffff !important;
                border-right: 1px solid #f1f5f9 !important;
                width: 280px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 1.5rem !important;
                transition: width 0.3s ease !important;
            }
            .app-header__logo .logo-src {
                width: 130px !important;
                height: 38px !important;
                background-position: left center !important;
                transition: opacity 0.3s ease;
            }
            .app-header__logo .header__pane { margin: 0 !important; }
            .header-btn-lg { border-left: none !important; padding-left: 0 !important; }
            .header-btn-lg .btn-group > a.profile-avatar-btn { margin-right: 1rem !important; }
            
            /* Closed Sidebar Fixes */
            .closed-sidebar .app-header__logo {
                width: 80px !important;
                padding: 0 !important;
                justify-content: center !important;
            }
            .closed-sidebar .app-header__logo .logo-src {
                display: none !important;
            }
            .closed-sidebar .app-header__logo .header__pane {
                margin: 0 auto !important;
            }
        }

        /* ══ MOBILE TOPBAR COMPLETE REDESIGN (2026 Trend) ══ */
        @media (max-width: 991px) {
            
            /* Hide ArchitectUI redundant mobile headers */
            .app-sidebar .app-header__logo,
            .app-sidebar .app-header__mobile-menu,
            .app-sidebar .app-header__menu {
                display: none !important;
            }

            /* ─ Full reset of the header ─ */
            .app-header {
                all: unset !important;
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
                height: 64px !important;
                padding: 0 1rem !important;
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                z-index: 1050 !important;
                box-sizing: border-box !important;
            }

            /* ─ Logo ─ */
            .app-header__logo {
                display: flex !important;
                order: 2 !important;
                position: absolute !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                border: none !important;
                background: transparent !important;
                width: auto !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .app-header__logo .logo-src {
                display: block !important;
                width: 120px !important;
                height: 34px !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
            .app-header__logo .header__pane { display: none !important; } /* Hide desktop hamburger on mobile */
            
            /* ─ Hamburger Menu (Left) ─ */
            .app-header__mobile-menu {
                order: 1 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-start !important;
                margin: 0 !important;
                z-index: 10 !important;
            }
            .app-header__mobile-menu .hamburger {
                padding: 0.5rem !important;
                margin: 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: transparent !important;
                border-radius: 8px !important;
            }
            .app-header__mobile-menu .hamburger:active { background: rgba(0,0,0,0.05) !important; }
            .app-header__mobile-menu .hamburger-box { width: 26px !important; }
            .app-header__mobile-menu .hamburger-inner, 
            .app-header__mobile-menu .hamburger-inner::before, 
            .app-header__mobile-menu .hamburger-inner::after {
                width: 26px !important;
                height: 3px !important;
                border-radius: 4px !important;
                background-color: #1e293b !important;
            }

            /* ─ Content area (Right side: profile) ─ */
            .app-header__content {
                all: unset !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-end !important;
                order: 3 !important;
                z-index: 10 !important;
            }
            .app-header-left  { display: none !important; }
            .app-header-right {
                display: flex !important;
                align-items: center !important;
                margin: 0 !important;
            }
            .header-btn-lg {
                display: flex !important;
                align-items: center !important;
                padding: 0 !important;
                border-left: none !important; /* Remove grey border */
            }
            .header-btn-lg > div,
            .header-btn-lg .widget-content,
            .header-btn-lg .widget-content-wrapper {
                display: flex !important;
                align-items: center !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .header-btn-lg .widget-content-left:first-child {
                border: none !important;
                padding: 0 !important;
            }
            
            /* The superadmin text block - KILL IT */
            .widget-content-left.ml-3.header-user-info {
                display: none !important;
            }
            
            .header-btn-lg .btn-group {
                display: flex !important;
                align-items: center !important;
            }
            
            .header-btn-lg .fa-angle-down { display: none !important; }
            .app-header__logo::after { display: none !important; }
            .app-main { padding-top: 64px !important; }
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


