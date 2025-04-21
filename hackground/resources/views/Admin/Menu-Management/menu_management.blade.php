@extends('Admin.layouts.app')

{{-- @dd($sub_menus) --}}
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
                    <div>Menu Management
                        <div class="page-title-subheading">Admin Menu &gt; Menu Management List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Menu Management</li>
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
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Menu Management
                    {{-- @if (in_array('MEN0005_Add', $Permissions)) --}}
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" id="addMenuButton"
                            onclick="add_prop_menu()">Add Menu</button>
                    </div>
                    {{-- @endif --}}
                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:25%">Menu Name</th>
                                <th style="width:25%">Sub Menu</th>
                                <th style="width:25%">Menu Slug</th>
                                <th></th>
                                <th style="width:15%">Status</th>
                                <th style="min-width:20px;" class="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach ($data as $menu)
                                <!-- Parent Menu -->
                                @if ($menu->parent_id == 0)
                                    <tr id="{{ $menu->id }}">
                                        <td>{{ $menu->name }}
                                            @if (!empty($menu->description))
                                                <div><small>{{ $menu->description }}</small></div>
                                            @endif
                                        </td>
                                        <td></td>
                                        <td>{{ $menu->slug }}</td>
                                        <td></td>
                                        <td>
                                            <input type="checkbox" class="menu_prop_status d-none"
                                                data-id="{{ $menu->id }}" data-toggle="toggle" data-on="Active"
                                                data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                                data-size="mini" {{ $menu->status ? 'checked' : '' }}>
                                        </td>
                                        <td class="text-right" style="padding-right:20px;">
                                            <a href="javascript:void(0)" onclick="Add_sub_menu('{{ $menu->id }}')"
                                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Add Sub Menu">
                                                <i class="fa fa-plus-circle text-primary fa-md"></i>
                                            </a>
                                            &nbsp;
                                            <a href="javascript:void(0)" onclick="Edit_prop_menu('{{ $menu->id }}')"
                                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                <i class="fa fa-edit text-success fa-md"></i>
                                            </a>
                                            &nbsp;
                                            <a href="javascript:void(0)" onclick="Delete_prop_menu('{{ $menu->id }}')"
                                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                <i class="fa fa-trash text-danger fa-md"></i>
                                            </a>
                                        </td>
                                    </tr>

                                    <!-- Submenus -->
                                    @foreach ($data as $sub_menu)
                                        @if ($sub_menu->parent_id == $menu->id)
                                            <tr class="child_menu childof-{{ $sub_menu->parent_id }}">
                                                <td></td>
                                                <td>{{ $sub_menu->name }}
                                                    @if (!empty($sub_menu->description))
                                                        <div><small>{{ $sub_menu->description }}</small></div>
                                                    @endif
                                                </td>
                                                <td>{{ $sub_menu->slug }}</td>
                                                <td></td>
                                                <td>
                                                    <input type="checkbox" class="menu_prop_status d-none"
                                                        data-id="{{ $sub_menu->id }}" data-toggle="toggle" data-on="Active"
                                                        data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                                        data-size="mini" {{ $sub_menu->status ? 'checked' : '' }}>
                                                </td>
                                                <td class="text-right" style="padding-right:20px;">
                                                    <a href="javascript:void(0)"
                                                        onclick="Edit_prop_menu('{{ $sub_menu->id }}')"
                                                        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Edit">
                                                        <i class="fa fa-edit text-success fa-md"></i>
                                                    </a>
                                                    &nbsp;
                                                    <a href="javascript:void(0)"
                                                        onclick="Delete_prop_menu('{{ $sub_menu->id }}')"
                                                        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Delete">
                                                        <i class="fa fa-trash text-danger fa-md"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        @endif
                                    @endforeach
                                @endif
                            @endforeach
                        </tbody>


                    </table>

                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection


@section('modals')
    <div class="modal fade" id="AdminMenuModal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="addEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                    
                </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="menuManagementFormData">
                        @csrf
                        <!-- Hidden input for menu ID -->
                        <input type="text" class='d-none' id="menuID" name="menuID">
                        <input type="text" class='d-none' id="parent_id" name="parent_id">

                        <div class="d-none form-group parent_menu">
                            <label for="parent_menu">Parent Menu</label>
                            <input type="text" class="form-control" id="parent_menu" name="parent_menu" required>
                            <div class="invalid-feedback" id="parent_menu_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_name">Menu Name</label>
                            <input type="text" class="form-control" id="menu_name" name="menu_name" required>
                            <div class="invalid-feedback" id="menu_name_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_slug">Slug</label>
                            <input type="text" class="form-control" id="menu_slug" name="menu_slug" required>
                            <div class="invalid-feedback" id="menu_slug_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_desc">Description</label>
                            <input type="text" class="form-control" id="menu_desc" name="menu_desc" required>
                            <div class="invalid-feedback" id="menu_desc_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_action">Action</label>
                            <select type="text" class="form-control" id="menu_action" name="menu_action" required>
                                <option value="">-- select --</option>
                                <option value="add">ADD</option>
                                <option value="edit">EDIT</option>
                                <option value="delete">DELETE</option>
                                <option value="list">LIST</option>
                            </select>
                            <div class="invalid-feedback" id="menu_action_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_url">URL</label>
                            <input type="text" class="form-control" id="menu_url" name="menu_url" required>
                            <div class="invalid-feedback" id="menu_url_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_icon">Icon</label>
                            <input type="text" class="form-control" placeholder='e.g:"metismenu-icon pe-7s-rocket"'
                                id="menu_icon" name="menu_icon" required>
                            <div class="invalid-feedback" id="menu_icon_error"></div>
                        </div>

                        <div class="form-group">
                            <label for="menu_order">Order</label>
                            <input type="number" class="form-control" id="menu_order" name="menu_order" required>
                            <div class="invalid-feedback" id="menu_order_error"></div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <div class="radio-inline">
                                <input type="radio" name="menu_status" value=1 class="magic-radio" id="status_1"
                                    checked required>
                                <label for="status_1">Active</label>
                                <input type="radio" name="menu_status" value=0 class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" id="saveChangesButton" onclick="add_edit_prop_menu()"
                        class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>
@endsection


@push('custom-js')
    <script>
        $('#menu_name').on('keyup', function() {

            var name = $(this).val();
            var slug = name.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            $('#menu_slug').val(slug);
        });



        function add_prop_menu() {
            $('.parent_menu').addClass('d-none'); //hide this field
            $('#menu_slug').prop('readonly', false);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_menu_AddEdit('Menu Add', 'Add');
        }

        function Edit_prop_menu(id) {
            $('.parent_menu').addClass('d-none'); //hide this field
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_menu_AddEdit('Menu Edit', 'Update', id);
        }

        function Add_sub_menu(id) {
            $('#menu_slug').prop('readonly', false);
            $('.parent_menu').removeClass('d-none'); //show this field
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            fetch_parent_menu('Add Sub Menu', 'Add', id);
        }

        function fetch_parent_menu(title, buttonText, id = null) {
            $('#addEditModalLabel').text(title);
            $('#saveChangesButton').text(buttonText);
            $('#menuManagementFormData')[0].reset();
            if (id) {

                $.get(`{{ url('/menu-details') }}/${id}`, function(data) {
                    $('#parent_id').val(data[0].id);
                    data.forEach(function(menu) {
                        $('#parent_menu').val(menu.name).prop('readonly', true);
                    });
                });
            }
            $('#AdminMenuModal').modal('show');
        }

        function prop_menu_AddEdit(title, buttonText, id = null) {
            $('#addEditModalLabel').text(title);
            $('#saveChangesButton').text(buttonText);
            $('#menuManagementFormData')[0].reset();
            if (id) {

                $.get(`{{ url('/menu-details') }}/${id}`, function(data) {
                    $('#menuID').val(data[0].id);
                    $('#parent_id').val(data[0].parent_id);
                    data.forEach(function(menu) {
                        $('#parent_menu').val(menu.name);
                        $('#menu_name').val(menu.name);
                        $('#menu_slug').val(menu.slug).prop('readonly', true);
                        $('#menu_desc').val(menu.description);
                        $('#menu_action').val(menu.action);
                        $('#menu_url').val(menu.url);
                        $('#menu_icon').val(menu.icon_class);
                        $('#menu_order').val(menu.order);
                        $('input[name="menu_status"][value="' + menu.status + '"]').prop(
                            'checked', true);

                    });
                });
            }
            $('#AdminMenuModal').modal('show');
        }

        function add_edit_prop_menu() {
            var data = $("#menuManagementFormData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url;

            if ($('#menuID').val()) {
                url = `{{ url('/edit-menu') }}`;
            } else if ($('#parent_id').val()) {
                url = `{{ url('/add-menu') }}`;
            } else {
                url = `{{ url('/add-menu') }}`;
            }

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#prop_menu').modal('hide');
                    $('#menuManagementFormData')[0].reset();
                },
                error: function(response) {
                    var errors = response.responseJSON.errors;

                    // Reset previous error messages and invalid class
                    $('.invalid-feedback').text('').hide();
                    $('.form-control').removeClass('is-invalid');

                    // Loop through errors and update the DOM
                    Object.entries(errors).forEach(([field, messages]) => {
                        const fieldId = field.replace('.', '_'); // Convert 'name.en' to 'name_en'
                        const inputSelector = `#${fieldId}`;
                        const errorSelector = `#${fieldId}_error`;

                        $(inputSelector).addClass('is-invalid');
                        $(errorSelector).text(messages[0]).show();
                    });

                }

            });
        }



        $('.menu_prop_status').change(function() {

            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            var id = $(this).data('id');
            var status = this.checked ? 1 : 0;
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('/menu_status') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    // Handle success response if needed
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });

        function Delete_prop_menu(id) {
            var result = confirm('Are you sure you want to delete this?');
            console.log(id);
            if (result) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'POST',
                    url: `{{ url('/menu-delete') }}`,
                    data: {
                        'id': id
                    },
                    success: function(response) {
                        localStorage.setItem('successMessage', response.message);
                        window.location.reload(true);
                    },
                    error: function(msg) {
                        console.log(msg);
                        var errors = msg.responseJSON;
                    }
                });
            }
        }


        // $(document).ready(function() {
        //     var table = $('.table').DataTable({
        //         "paging": false,
        //         "searching": false,
        //         "info": false,
        //         "ordering": true,
        //         "order": [
        //             [0, 'desc']
        //         ],
        //         "columnDefs": [{
        //                 "orderable": true,
        //                 "targets": [0]
        //             },
        //             {
        //                 "orderable": false,
        //                 "targets": [2, 3, 4, 5]
        //             }
        //         ]
        //     });
        // });
    </script>
@endpush
