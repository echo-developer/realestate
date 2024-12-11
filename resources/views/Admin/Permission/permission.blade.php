@extends('Admin.layouts.app')

@php
    $data = AllmenusForSideBar();
@endphp

@section('content')
    <div class="body-page-loader d-none">
        <div class="loader">
            <div class="line-scale-pulse-out">
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
                <div class="bg-warning"></div>
            </div>
        </div>
    </div>

    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                    </div>
                    <div>Admin User
                        <div class="page-title-subheading">Admin User &gt; Admin User List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Admin User</li>
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
        <div class="p-3 text-left">
            <a href="/menu_management-view" class="btn btn-success">ADD MENU</a>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Menu Permission &nbsp; &nbsp;
                    <span class="badge badge-secondary">Admin</span>

                    <div class="btn-actions-pane-right">
                        <select class="form-control form-control-sm" name="user_role">
                            <option value="">Choose</option>
                            @foreach ($roles as $role)
                                <option value="{{ $role->id }}" {{ old('user_role') == $role->id ? 'selected' : '' }}>
                                    {{ $role->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>


                <div class="table-responsive" id="main_table">
                    <form action="{{ url('/permission-save') }}">
                        <table class="mb-0 table">
                            <thead>
                                <tr>
                                    <th style="width:15%">Menu Name</th>
                                    <th style="width:15%">Sub Menu</th>
                                    <th style="min-width:50px;" class="text-right">Action</th>
                                    <th style="min-width:10px;" class="text-right"></th>
                                </tr>
                            </thead>

                            <tbody>
                                @foreach ($data[0] ?? [] as $menu)
                                    <!-- Parent Menu -->
                                    @if ($menu->parent_id == 0)
                                        <tr id="{{ $menu->id }}">
                                            <td>{{ $menu->name }}
                                                @if (!empty($menu->description))
                                                    <div><small>{{ $menu->description }}</small></div>
                                                @endif
                                            </td>
                                            <td></td>


                                            <td class="text-right" style="padding-right:20px;">

                                                <input type="checkbox" class="menu-checkbox" id="menu-{{ $menu->id }}"
                                                    data-menu-id="{{ $menu->id }}" data-toggle="tooltip"
                                                    title="Give Permission" />
                                            </td>


                                            <td class="text-right">
                                                @if (isset($data[$menu->id]))
                                                    <a href="javascript:void(0)" class="submenu-toggle"
                                                        data-menu-id="{{ $menu->id }}" data-toggle="tooltip"
                                                        title="Toggle Submenu">
                                                        <i class="fa fa-chevron-down text-primary fa-md"></i>
                                                    </a>
                                                @endif
                                            </td>
                                        </tr>

                                        <!-- Submenus -->

                                        @if (isset($data[$menu->id]))
                                            @foreach ($data[$menu->id] as $sub_menu)
                                                <tr class="child_menu childof-{{ $sub_menu->parent_id }} submenu-{{ $menu->id }}"
                                                    style="display: none;">
                                                    <td></td>
                                                    <td>{{ $sub_menu->name }}
                                                        @if (!empty($sub_menu->description))
                                                            <div><small>{{ $sub_menu->description }}</small></div>
                                                        @endif
                                                    </td>


                                                    <td class="text-right" style="padding-right:20px;">
                                                        <input type="checkbox"
                                                            class="sub-menu-checkbox submenu-checkbox-{{ $menu->id }}"
                                                            id="menu-{{ $sub_menu->id }}"
                                                            data-parent-id = "{{ $menu->id }}" data-toggle="tooltip"
                                                            title="Give Permission" />
                                                    </td>



                                                </tr>
                                            @endforeach
                                        @endif
                                    @endif
                                @endforeach
                            </tbody>


                        </table>

                        <div class="p-3 text-right">
                            <button type="submit" class="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Toggle submenu visibility
            document.querySelectorAll('.submenu-toggle').forEach(function(toggle) {
                toggle.addEventListener('click', function() {
                    const menuId = this.getAttribute('data-menu-id');
                    const submenus = document.querySelectorAll(`.submenu-${menuId}`);
                    submenus.forEach(submenu => {
                        submenu.style.display = submenu.style.display === 'none' ? '' :
                            'none';
                    });

                    // Change icon direction
                    const icon = this.querySelector('i');
                    if (icon.classList.contains('fa-chevron-down')) {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    } else {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    }
                });
            });

        });

        $(document).ready(function() {

            $('.menu-checkbox').on('change', function() {
                const menuID = $(this).data('menu-id');
                const isChecked = $(this).is(':checked');

                // Toggle all associated submenus
                $(`.submenu-checkbox-${menuID}`).prop('checked', isChecked);
            });


            $('.sub-menu-checkbox').on('change', function() {
                const parentID = $(this).data('parent-id');
                const allChecked = $(`.submenu-checkbox-${parentID}`).length === $(
                    `.submenu-checkbox-${parentID}:checked`).length;

                // Update parent checkbox state
                $(`#menu-${parentID}`).prop('checked', allChecked);
            });
        });
    </script>
@endpush
