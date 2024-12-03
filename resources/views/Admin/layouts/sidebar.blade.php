<div class="app-sidebar sidebar-shadow">
    <div class="app-header__logo">
        <div class="logo-src"></div>
        <div class="header__pane ml-auto">
            <div>
                <button type="button" class="hamburger close-sidebar-btn hamburger--elastic" data-class="closed-sidebar">
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
    <div class="app-header__menu">
        <span>
            <button type="button" class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                <span class="btn-icon-wrapper">
                    <i class="fa fa-ellipsis-v fa-w-6"></i>
                </span>
            </button>
        </span>
    </div>
    <div class="scrollbar-sidebar">
        <div class="app-sidebar__inner">
            <ul class="vertical-nav-menu">
                <li class="app-sidebar__heading">Menu</li>
                <li class="{{ request()->is('dashboard') ? 'mm-active' : '' }}">
                    <a href="{{ url('dashboard') }}">
                        <i class="metismenu-icon pe-7s-rocket"></i> Dashboards

                    </a>
                </li>
                <li class="{{ request()->is('admin_notifiaction') ? 'mm-active' : '' }}">
                    <a href="{{ url('admin_notifiaction') }}">
                        <i class="metismenu-icon pe-7s-bell"></i> Notification

                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-config"></i>
                        Setting
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>
                    {{-- @if (Gate::allows('forAdmin')) --}}
                    <ul>
                        <li class="{{ request()->is('Settings*') ? 'mm-active' : '' }}">
                            <a href="{{ url('Settings/default') }}">
                                <i class="metismenu-icon"></i>
                                All Setting
                            </a>
                        </li>
                        <li class="{{ request()->is('group-setting') ? 'mm-active' : '' }}">
                            <a href="{{ url('/group-setting') }}">
                                <i class="metismenu-icon">
                                </i>Group Setting
                            </a>
                        </li>
                    </ul>

                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-user"></i>
                        Admin
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('adminrole') ? 'mm-active' : '' }}">
                            <a href="{{ url('adminrole') }}">
                                <i class="metismenu-icon"></i>
                                Role
                            </a>
                        </li>
                        <li class="{{ request()->is('admin_user') ? 'mm-active' : '' }}">
                            <a href="{{ url('admin_user') }}">
                                <i class="metismenu-icon"></i>
                                Users
                            </a>
                        </li>
                        <li class="{{ request()->is('#') ? 'mm-active' : '' }}">
                            <a href="{{ url('#') }}">
                                <i class="metismenu-icon"></i>
                                Permission
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon icon-feather-clock pe-7s-tools"></i>
                        Management
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('management/testimonial') ? 'mm-active' : '' }}">
                            <a href="{{ url('management/testimonial') }}">
                                <i class="metismenu-icon"></i>
                                Testimonial
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <li class="{{ request()->is('management/emailTemplate') ? 'mm-active' : '' }}">
                            <a href="{{ url('management/emailTemplate') }}">
                                <i class="metismenu-icon"></i>
                                Email Templates
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <li class="{{ request()->is('management/notificationtemplate') ? 'mm-active' : '' }}">
                            <a href="{{ url('management/notificationtemplate') }}">
                                <i class="metismenu-icon"></i>
                                Notification Templates
                            </a>
                        </li>
                    </ul>
                    <ul>
                        <li class="{{ request()->is('management/cms') ? 'mm-active' : '' }}">
                            <a href="{{ url('management/cms') }}">
                                <i class="metismenu-icon"></i>
                                CMS
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-home"></i>
                        Property Setting
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('property/category') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/category') }}">
                                <i class="metismenu-icon"></i>
                                Property Category
                            </a>
                        </li>
                        <li class="{{ request()->is('property/subcategory') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/subcategory') }}">
                                <i class="metismenu-icon"></i>
                                Property Sub Category
                            </a>
                        </li>
                        <li class="{{ request()->is('property/status') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/status') }}">
                                <i class="metismenu-icon"></i>
                                Property Status
                            </a>
                        </li>
                        <li class="{{ request()->is('property/transaction') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/transaction') }}">
                                <i class="metismenu-icon"></i>
                                Property Transaction
                            </a>
                        </li>
                        <li class="{{ request()->is('property/furnishing') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/furnishing') }}">
                                <i class="metismenu-icon"></i>
                                Property Furnishing
                            </a>
                        </li>
                        <li class="{{ request()->is('property/budget') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/budget') }}">
                                <i class="metismenu-icon"></i>
                                Property Budget
                            </a>
                        </li>
                        <li class="{{ request()->is('property/recommended') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/recommended') }}">
                                <i class="metismenu-icon"></i>
                                Property Recommended
                            </a>
                        </li>
                        <li class="{{ request()->is('property/length') ? 'mm-active' : '' }}">
                            <a href="{{ url('property/length') }}">
                                <i class="metismenu-icon"></i>
                                Property Length
                            </a>
                        </li>
                    </ul>


                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-back-2"></i>
                        Project Setting
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('project/#') ? 'mm-active' : '' }}">
                            <a href="{{ url('project/#') }}">
                                <i class="metismenu-icon"></i>
                                Project List
                            </a>
                        </li>
                        <li class="{{ request()->is('project/amenity') ? 'mm-active' : '' }}">
                            <a href="{{ url('project/amenity') }}">
                                <i class="metismenu-icon"></i>
                                Project Amenity
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-map-marker"></i>
                        Location
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('country') ? 'mm-active' : '' }}">
                            <a href="{{ url('country') }}">
                                <i class="metismenu-icon"></i>
                                Country
                            </a>
                        </li>
                        <li class="{{ request()->is('state') ? 'mm-active' : '' }}">
                            <a href="{{ url('state') }}">
                                <i class="metismenu-icon"></i>
                                State
                            </a>
                        </li>
                        <li class="{{ request()->is('city') ? 'mm-active' : '' }}">
                            <a href="{{ url('city') }}">
                                <i class="metismenu-icon"></i>
                                City
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-map-marker"></i>
                        Users
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('member/memberUser') ? 'mm-active' : '' }}">
                            <a href="{{ url('member/memberUser') }}">
                                <i class="metismenu-icon"></i>
                                All Users
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
            </li>
            </ul>
        </div>
    </div>
</div>
