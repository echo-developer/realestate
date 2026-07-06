@php
$allmenus = AllmenusForSideBar();
@endphp

<style>
    /* ══ 2026 SIDEBAR MODERNIZATION ══ */
    .app-sidebar {
        background: #ffffff !important;
        border-right: 1px solid #f1f5f9 !important;
        box-shadow: 4px 0 24px rgba(0,0,0,0.02) !important;
    }
    .vertical-nav-menu { padding-top: 0.5rem; }
    
    /* 
     * IMPORTANT: Only apply custom flex/padding when the sidebar is OPEN.
     * When closed (.closed-sidebar), ArchitectUI handles the complex JS popovers and hover states natively.
     */
    .app-container:not(.closed-sidebar) .vertical-nav-menu li a {
        color: #64748b !important;
        font-weight: 500 !important;
        border-radius: 8px !important;
        margin: 0.2rem 1rem !important;
        padding: 0 1rem 0 3.2rem !important; /* Extra padding for icon */
        height: 2.75rem !important;
        line-height: 2.75rem !important;
        transition: all 0.25s ease;
        display: flex !important;
        align-items: center !important;
        background: transparent !important;
        position: relative !important; /* Anchor for absolute icons */
        text-decoration: none !important;
    }
    
    /* Icons */
    .app-container:not(.closed-sidebar) .vertical-nav-menu li a i.metismenu-icon {
        color: #94a3b8 !important;
        opacity: 0.8;
        transition: all 0.25s ease;
        position: absolute !important;
        left: 0.8rem !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        background: transparent !important;
        border: none !important;
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
    }
    
    /* Hover */
    .app-container:not(.closed-sidebar) .vertical-nav-menu li a:hover {
        background: #f8fafc !important;
        color: #0f172a !important;
    }
    .app-container:not(.closed-sidebar) .vertical-nav-menu li a:hover i.metismenu-icon {
        color: #3b82f6 !important;
        opacity: 1;
    }
    
    /* Active State Parent */
    .app-container:not(.closed-sidebar) .vertical-nav-menu li.mm-active > a {
        background: #eff6ff !important;
        color: #2563eb !important;
        font-weight: 600 !important;
    }
    .app-container:not(.closed-sidebar) .vertical-nav-menu li.mm-active > a i.metismenu-icon {
        color: #2563eb !important;
        opacity: 1;
        background: transparent !important;
    }

    /* Submenus */
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul {
        margin: 0.25rem 0 0.25rem 2.2rem !important;
        padding-left: 0 !important;
        border-left: 2px solid #e2e8f0 !important;
        transition: all 0.3s ease;
    }
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul:before { display: none !important; }
    
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul li a {
        padding-left: 1.2rem !important;
        margin-left: -2px !important;
        font-size: 0.85rem !important;
        color: #64748b !important;
        height: 2.25rem !important;
        line-height: 2.25rem !important;
        border-radius: 0 8px 8px 0 !important;
        padding-right: 1rem !important;
    }
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul li a:before { display: none !important; }
    
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul li.mm-active > a {
        color: #2563eb !important;
        font-weight: 600 !important;
        background: #eff6ff !important;
        border-left: 2px solid #2563eb !important;
    }
    .app-container:not(.closed-sidebar) .vertical-nav-menu ul li a:hover {
        color: #0f172a !important;
        background: #f8fafc !important;
    }
    
    /* Notification Badge */
    .app-container:not(.closed-sidebar) #notificationCount {
        background: #ef4444 !important;
        color: white !important;
        font-size: 0.7rem !important;
        padding: 0 0.5rem !important;
        height: 18px !important;
        line-height: 18px !important;
        border-radius: 9px !important;
        box-shadow: 0 2px 8px rgba(239,68,68,0.3) !important;
        margin-left: auto !important; /* Push to the right in flex layout */
        position: static !important;
        transform: none !important;
    }
</style>
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