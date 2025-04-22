@php
$allmenus = AllmenusForSideBar();
@endphp

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
                <!-- <li class="app-sidebar__heading">Menu</li> -->

                @foreach ($allmenus[0] ?? [] as $main_menu)
                <!-- Loop through only parent menus (parent_id = 0) -->
                <li class="{{ request()->is($main_menu->url) ? 'mm-active' : '' }}">
                    <a href="{{ isset($allmenus[$main_menu->id]) ? '#' : url($main_menu->url) }}">
                        <i class="metismenu-icon {{ $main_menu->icon_class }}"></i>
                        {{ $main_menu->name }}
                        @if(isset($allmenus[$main_menu->id]))
                        <i class="metismenu-state-icon pe-7s-angle-down caret-left"></i>
                        @endif

                        @if($main_menu->url === 'admin_notifiaction')
                        <span class="badge badge-pill badge-danger" id="notificationCount" style="display:none;"></span>
                        @endif
                    </a>



                    <!-- Display submenus if they exist -->
                    @if (isset($allmenus[$main_menu->id]))
                    <ul>
                        @foreach ($allmenus[$main_menu->id] as $submenu)
                        <li class="{{ request()->is($submenu->url . '*') ? 'mm-active' : '' }}">

                            <a href="{{ url($submenu->url) }}">
                                <i class="{{ $submenu->icon_class }}"></i>
                                {{ $submenu->name }}
                            </a>
                        </li>
                        @endforeach
                    </ul>
                    @endif
                </li>
                @endforeach
            </ul>
            </li>
            </ul>
        </div>
    </div>
</div>
<script>
    function fetchNotificationCount() {
        $.ajax({
            url: '{{ route("admin.notification.count") }}', 
            method: 'GET',
            success: function(response) {
                const count = response.count;
                const $badge = $('#notificationCount');

                if (count > 0) {
                    $badge.text(count).show();
                } else {
                    $badge.hide();
                }
            },
            error: function() {
                console.error('Failed to fetch notification count.');
            }
        });
    }

    fetchNotificationCount();
    setInterval(fetchNotificationCount, 7000);
</script>