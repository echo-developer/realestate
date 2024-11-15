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
                <li>
                    <a href="{{url('dashboard')}}">
                        <i class="metismenu-icon pe-7s-rocket"></i> Dashboards

                    </a>
                </li>
                <li>
                    <a href="{{url('menu_management_')}}">
                        <i class="metismenu-icon pe-7s-rocket"></i> Menu Management

                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-browser"></i>
                        Admin
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>
                    {{-- @if (Gate::allows('forAdmin')) --}}
                    <ul>
                        <li>
                            <a href="{{ url('/admin_user') }}">
                                <i class="metismenu-icon"></i>
                                User
                            </a>
                        </li>
                        <li>
                            <a href="{{ url('/adminrole') }}">
                                <i class="metismenu-icon">
                                </i>Role
                            </a>
                        </li>
                        <li>
                            <a href="{{ url('/permit_page') }}">
                                <i class="metismenu-icon">
                                </i>Permission
                            </a>
                    </ul>

                    {{-- @else
                                <ul>
                                    <li>
                                        Not Authorized
                                    </li>
                                </ul> --}}


                    {{-- @endif --}}

                </li>
            </ul>
            </li>
            </ul>
        </div>
    </div>
</div>
