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
                    <a href="{{ url('dashboard') }}">
                        <i class="metismenu-icon pe-7s-rocket"></i> Dashboards

                    </a>
                </li>
                <li>
                    <a href="{{ url('admin_notifiaction') }}">
                        <i class="metismenu-icon pe-7s-bell"></i> Notification

                    </a>
                </li>
                <li>
                    <a href="{{ url('menu_management_') }}">
                        <i class="metismenu-icon pe-7s-tools"></i> Menu Management

                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class=" "></i>
                        Property Setting
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>

                    <ul>
                        <li class="{{ request()->is('property/status') ? 'active' : '' }}">
                            <a href="{{ url('property/status') }}">
                                <i class="metismenu-icon"></i>
                                Property Status
                            </a>
                        </li>
                        <li class="{{ request()->is('property/transaction') ? 'active' : '' }}">
                            <a href="{{ url('property/transaction') }}">
                                <i class="metismenu-icon"></i>
                                Property Transaction
                            </a>
                        </li>
                        <li class="{{ request()->is('property/category') ? 'active' : '' }}">
                            <a href="{{ url('property/category') }}">
                                <i class="metismenu-icon"></i>
                                Property Category
                            </a>
                        </li>
                        <li class="{{ request()->is('property/sub-category') ? 'active' : '' }}">
                            <a href="{{ url('property/subcategory') }}">
                                <i class="metismenu-icon"></i>
                                Property Sub Category
                            </a>
                        </li>
                    </ul>


                </li>
                <li>
                    <a href="#">
                        <i class="metismenu-icon pe-7s-browser"></i>
                        Setting
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                    </a>
                    {{-- @if (Gate::allows('forAdmin')) --}}
                    <ul>
                        <li>
                            <a href="{{ url('Settings/default') }}">
                                <i class="metismenu-icon"></i>
                                All Setting
                            </a>
                        </li>
                        <li>
                            <a href="{{ url('/group-setting') }}">
                                <i class="metismenu-icon">
                                </i>Group Setting
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