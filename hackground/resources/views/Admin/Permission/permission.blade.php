@extends('Admin.layouts.app')

@php
    $data = AllmenusForPermissionPage();
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
                    <div>Menu Permission
                        <div class="page-title-subheading">Menu Permission &gt; Give Menu Permission</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Menu Permission</li>
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
        <div class="mb-3 text-left">
            <a href="{{ url('/menu_management-view') }}" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add Menu</a>
        </div>
        <div class="main-card mb-3 card">

            <form action="{{ url('/permission-save') }}" method="POST">
                @csrf
                
                <div class="card-header d-flex">
                    <h4>Menu Permission</h4>
                    <span class="badge badge-secondary" id="role-badge"></span>
                    <div class="btn-actions-pane-right">
                        <select class="form-select form-select-sm" name="user_role" id="user_role">
                            <option value="">Choose</option>
                            @foreach ($roles as $role)
                                <option value="{{ $role->id }}" data-role-name="{{ $role->name }}"
                                    {{ old('user_role') == $role->id ? 'selected' : '' }}>
                                    {{ $role->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="card-body">

                    <div class="select-user-first text-center text-muted">
                        <div>
                            <p class="mb-0">No Role Selected !</p>
                            <small>Please select a role first</small>
                        </div>
                    </div>
                    <div class="table-responsive d-none" id="main_table">
                        <table class="mb-0 table">
                            <thead>
                                <tr>
                                    <th>Menu Name</th>
                                    <th>Sub Menu</th>
                                    <th class="text-right">Action</th>
                                    <th class="text-right"></th>
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


                                            <td class="text-right">

                                                <input type="checkbox" class="menu-checkbox checkbox"
                                                    id="menu-{{ $menu->id }}" name="{{ $menu->slug }}"
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
                                                            class="sub-menu-checkbox submenu-checkbox-{{ $menu->id }} checkbox"
                                                            id="menu-{{ $sub_menu->id }}" name="{{ $sub_menu->slug }}"
                                                            data-menu-id = '{{ $sub_menu->id }}'
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
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        document.addEventListener('DOMContentLoaded', function() {

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


            $('.sub-menu-checkbox').on('change', function() {
                const parentId = $(this).data('parent-id');
                const parentCheckbox = $(`#menu-${parentId}`);
                const isAnyChildChecked = $(`.submenu-checkbox-${parentId}:checked`).length > 0;
                parentCheckbox.prop('checked', isAnyChildChecked);
            });

        });

        $(document).ready(function() {

            $('.menu-checkbox').on('change', function() {
                const menuID = $(this).data('menu-id');
                const isChecked = $(this).is(':checked');

                $(`.submenu-checkbox-${menuID}`).prop('checked', isChecked);
            });


            $('#user_role').on('change', function() {

                $('.select-user-first').addClass('d-none');
                $('#main_table').removeClass('d-none');
                const role_id = $(this).val();

                let selectedOption = $(this).find('option:selected');
                let roleName = selectedOption.data('role-name');

                $('#role-badge').text(roleName);

                $.ajax({
                    url: "{{ url('/get-userBased-permission') }}/" + role_id,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {

                        $('.checkbox').each(function() {
                            const menu_id = $(this).attr('data-menu-id');


                            let is_checked = response.some(element => element.id ==
                                menu_id);

                            $(this).prop('checked', is_checked);
                        });

                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', error);
                    }
                });

            });
        });
    </script>
@endpush
