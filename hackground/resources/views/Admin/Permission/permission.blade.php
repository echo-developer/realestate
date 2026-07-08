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
            .app-main__inner { padding-bottom: 2rem; background-color: #f8fafc; overflow-x: hidden; }
            .card-modern { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); background-color: #ffffff; width: 100%; max-width: 100%; }
            .settings-card-header { padding: 0.85rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12px 12px 0 0; }
            .settings-card-header h4 { font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b; margin: 0; display: flex; align-items: center; gap: 0.5rem; }
            .btn-add-setting { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.85rem; transition: all 0.2s; }
            .btn-add-setting:hover { background: #2563eb; color: #fff; }
            
            .settings-table { width: 100%; margin: 0; color: #334155; }
            .settings-table th { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
            .settings-table td { padding: 1rem 1.25rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; font-weight: 500; }
            .settings-table tr:last-child td { border-bottom: none; }
            
            .actions-cell { display: flex; gap: 0.5rem; justify-content: flex-end; }
            .action-icon-btn { width: 34px; height: 34px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid transparent; transition: all 0.2s; font-size: 1rem; color: #64748b; background: transparent; cursor: pointer; text-decoration: none; }
            .action-icon-btn.edit { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
            .action-icon-btn.edit:hover { background: #16a34a; color: #fff; transform: scale(1.05); }
            .action-icon-btn.delete { border-color: #fecaca; color: #dc2626; background: #fef2f2; }
            .action-icon-btn.delete:hover { background: #dc2626; color: #fff; transform: scale(1.05); }

            /* Mobile Responsiveness - Custom List View for Permissions */
            @media (max-width: 767px) {
                .settings-card-header { flex-wrap: wrap; gap: 0.75rem; }
                .table-responsive { overflow: visible !important; border: none !important; }
                
                .settings-table thead { display: none !important; }
                
                /* Group rows into a single card */
                .settings-table {
                    display: block !important;
                    width: 100% !important;
                    background: #fff !important;
                    border: 1px solid #e2e8f0 !important;
                    border-radius: 12px !important;
                    overflow: hidden !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
                }
                .settings-table tbody { display: block !important; width: 100% !important; }
                
                .settings-table tr { 
                    display: flex !important; 
                    flex-wrap: nowrap !important; 
                    align-items: center !important; 
                    padding: 0.85rem 1rem !important; 
                    background: transparent !important; 
                    border: none !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    margin: 0 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }
                
                .settings-table tr:last-child {
                    border-bottom: none !important;
                }
                
                /* Respect JS display:none for toggle */
                .settings-table tr[style*="none"] {
                    display: none !important;
                }
                
                /* Indent submenus to look like a tree */
                .settings-table tr.child_menu {
                    background: #f8fafc !important;
                    border-left: 3px solid #cbd5e1 !important;
                    padding-left: 2.25rem !important;
                }
                
                .settings-table td { 
                    display: flex !important; 
                    align-items: center !important; 
                    padding: 0 !important; 
                    border: none !important; 
                    background: transparent !important;
                }
                
                /* Hide empty mobile cells completely */
                .settings-table td.mobile-hide { display: none !important; }
                
                /* Remove "MENU NAME", "ACTION" labels */
                .settings-table td::before { display: none !important; }
                
                /* Layout Columns */
                
                /* Checkbox */
                .settings-table td[data-label="Permission"] {
                    order: 1 !important;
                    margin-right: 0.75rem !important;
                    flex-shrink: 0 !important;
                    justify-content: flex-start !important;
                }
                
                /* Menu Name */
                .settings-table td[data-label="Menu Name"],
                .settings-table td[data-label="Sub Menu"] {
                    order: 2 !important;
                    flex: 1 1 auto !important;
                    text-align: left !important;
                    justify-content: flex-start !important;
                    min-width: 0 !important;
                }
                
                .settings-table td > div {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    text-align: left !important;
                    gap: 0 !important;
                }
                
                /* Action Toggle */
                .settings-table td[data-label="Action"] {
                    order: 3 !important;
                    flex-shrink: 0 !important;
                    margin-left: 0.5rem !important;
                    justify-content: flex-end !important;
                }
                
                .actions-cell { justify-content: flex-end !important; width: auto !important; }
            }
            .advance-search-panel {
                background-color: #fff;
                box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
                padding: 1rem;
                margin-top: 1rem;
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }} alert-dismissible">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        <div class="mb-3 text-left">
            <a href="{{ url('/menu_management-view') }}" class="btn btn-primary"><i class="bi bi-plus-lg"></i> Add Menu</a>
        </div>
        <div class="main-card mb-3 card card-modern">

            <form action="{{ url('/permission-save') }}" method="POST">
                @csrf

                <div class="settings-card-header">
                    <div class="d-flex align-items-center">
                        <h4><i class="fa fa-key text-primary me-2"></i> Menu Permission</h4>
                        <span class="badge badge-warning ms-2" id="role-badge"></span>
                    </div>
                    <div class="btn-actions-pane-right">
                        <select class="form-select form-select-sm" name="user_role" id="user_role">
                            <option value="">Choose Role</option>
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
                        <table class="settings-table">
                            <thead>
                                <tr>
                                    <th>Menu Name</th>
                                    <th>Sub Menu</th>
                                    <th class="text-right">Permission</th>
                                    <th class="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($data[0] ?? [] as $menu)
                                    <!-- Parent Menu -->
                                    @if ($menu->parent_id == 0)
                                        <tr id="{{ $menu->id }}">
                                            <td data-label="Menu Name" class="fw-bold">
                                                <div>
                                                    <span style="font-size: 0.95rem;">{{ $menu->name }}</span>
                                                    @if (!empty($menu->description))
                                                        <div class="text-muted" style="font-weight: 500; font-size: 0.75rem; margin-top: 2px;">{{ $menu->description }}</div>
                                                    @endif
                                                </div>
                                            </td>
                                            <td class="mobile-hide"></td>

                                            <td data-label="Permission" class="text-right">
                                                <div class="d-flex justify-content-end">
                                                    <input type="checkbox" class="menu-checkbox checkbox form-check-input mt-0" style="width: 22px; height: 22px; cursor: pointer;"
                                                        id="menu-{{ $menu->id }}" name="{{ $menu->slug }}"
                                                        data-menu-id="{{ $menu->id }}" data-toggle="tooltip"
                                                        title="Give Permission" />
                                                </div>
                                            </td>

                                            <td data-label="Action" class="text-right">
                                                <div class="actions-cell">
                                                    @if (isset($data[$menu->id]))
                                                        <a href="javascript:void(0)" class="submenu-toggle action-icon-btn edit" style="width: 30px; height: 30px;"
                                                            data-menu-id="{{ $menu->id }}" data-toggle="tooltip"
                                                            title="Toggle Submenu">
                                                            <i class="fa fa-chevron-down fa-sm"></i>
                                                        </a>
                                                    @endif
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Submenus -->
                                        @if (isset($data[$menu->id]))
                                            @foreach ($data[$menu->id] as $sub_menu)
                                                <tr class="child_menu childof-{{ $sub_menu->parent_id }} submenu-{{ $menu->id }}"
                                                    style="display: none; background-color: #f8fafc;">
                                                    <td class="mobile-hide"></td>
                                                    <td data-label="Sub Menu">
                                                        <div>
                                                            <span style="font-size: 0.9rem;">{{ $sub_menu->name }}</span>
                                                            @if (!empty($sub_menu->description))
                                                                <div class="text-muted" style="font-weight: 500; font-size: 0.75rem; margin-top: 2px;">{{ $sub_menu->description }}</div>
                                                            @endif
                                                        </div>
                                                    </td>

                                                    <td data-label="Permission" class="text-right" style="padding-right:20px;">
                                                        <div class="d-flex justify-content-end">
                                                            <input type="checkbox"
                                                                class="sub-menu-checkbox submenu-checkbox-{{ $menu->id }} checkbox form-check-input mt-0" style="width: 18px; height: 18px; cursor: pointer;"
                                                                id="menu-{{ $sub_menu->id }}" name="{{ $sub_menu->slug }}"
                                                                data-menu-id = '{{ $sub_menu->id }}'
                                                                data-parent-id = "{{ $menu->id }}" data-toggle="tooltip"
                                                                title="Give Permission" />
                                                        </div>
                                                    </td>
                                                    <td class="mobile-hide"></td>
                                                </tr>
                                            @endforeach
                                        @endif
                                    @endif
                                @endforeach
                            </tbody>
                        </table>

                        <div class="p-3 text-right border-top mt-2">
                            <button type="submit" class="btn btn-primary px-4 shadow-sm" style="font-weight: 600; border-radius: 8px;">Save Permissions</button>
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
