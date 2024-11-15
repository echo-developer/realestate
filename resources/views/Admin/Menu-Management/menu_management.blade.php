@extends('Admin.layouts.app')


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
                    <div>Admin Menu
                        <div class="page-title-subheading">Admin Menu &gt; Admin Menu List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Admin Menu</li>
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
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Admin Menu
                    {{-- @if (in_array('MEN0005_Add', $Permissions)) --}}
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" id="addMenuButton">Add Menu</button>
                    </div>
                    {{-- @endif --}}
                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:5%">ID</th>
                                <th style="width:20%">Menu Name</th>
                                <th style="width:20%">Menu Slug</th>
                                <th style="width:20%">URL</th>
                                <th style="width:20%">Status</th>
                                <th style="min-width:80px;" class="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody id="menu">
                            {{-- @foreach ($menus as $menu)
                                @if ($menu->menuname != 'superadmin')
                                    <tr>
                                        <td>{{ $menu->id }}</td>
                                        <td>{{ $menu->menuname }}</td>
                                        <td>{{ $menu->full_name }}</td>
                                        <td>{{ $menu->admin_role->name }}</td>
                                        <td>{{ $menu->registered_on }}</td>
                                        <td>
                                            <input data-id="{{ $menu->id }}" class="menustatus d-none" type="checkbox"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                {{ $menu->status ? 'checked' : '' }}>
                                        </td>

                                        <td class="text-right">
                                            @if (in_array('MEN0005_Edit', $Permissions))
                                            <i class="fa fa-edit text-success fa-md editButton"
                                                data-menuid="{{ $menu->id }}"></i>
                                            @endif
                                            @if (in_array('MEN0005_Delete', $Permissions))
                                            <i class="fa fa-trash text-danger fa-md UserDeleteButton"
                                                data-menuid="{{ $menu->id }}"></i>
                                            @endif
                                        </td>
                                    </tr>
                                @endif
                            @endforeach --}}
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

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="adminMenuformData">
                        @csrf
                        <!-- Hidden input for menu ID -->
                        <input type="text" class='d-none' id="menuID" name="menuID">
                        <div class="form-group">
                            <label for="menu_name">Menu Name</label>
                            <input type="text" class="form-control" id="menu_name" name="menu_name" required>
                            <div class="invalid-feedback" id="menu_name_error"></div>
                        </div>
                        <div class="form-group">
                            <label for="menu_slug">Menu Slug</label>
                            <input type="text" class="form-control" id="menu_slug" name="menu_slug" required>
                            <div class="invalid-feedback" id="menu_slug_error"></div>

                        </div>
                        <div class="form-group">
                            <label for="menu_url">Menu URL</label>
                            <input type="email" class="form-control"  id="menu_url" name="menu_url" required>
                            <div class="invalid-feedback" id="menu_url_error"></div>
                        </div>
                        <div class="form-group">
                            <label for="menu_url">Menu Icon</label>
                            <input type="email" class="form-control" placeholder='e.g:"metismenu-icon pe-7s-rocket"' id="menu_url" name="menu_url" required>
                            <div class="invalid-feedback" id="menu_url_error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Menu Status</label>
                            <div class="radio-inline">
                                <input type="radio" name="menu_status" value=1 class="magic-radio" id="status_1" checked
                                    required>
                                <label for="status_1">Active</label>
                                <input type="radio" name="menu_status" value=0 class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" id="saveChangesButton" class="btn btn-primary">Save</button>
                </div>
            </div>


        </div>
    </div>
@endsection


@section('custom-js')
    <script>
        $(document).ready(function() {

            // coonverting the USERNAME field to lowercase and set it in the input field as well
            // $('input[name="menuname"]').on('input', function() {

            //     $(this).val($(this).val().toLowerCase());
            // });

            // coonverting the EMAIL field to lowercase and set it in the input field as well
            // $('input[name="email"]').on('input', function() {

            //     $(this).val($(this).val().toLowerCase());
            // });
            // coonverting the NAME field to Proper Case using ARROW FUNCTION of JAVASCRIPT
            // $(document).ready(function() {
            //     $('#name').on('input', function() {
            //         $(this).val($(this).val().replace(/\b\w/g, char => char.toUpperCase()));
            //     });
            // });




            $('#addMenuButton').click(function() {

                Add_Edit_Menu('Add Menu', 'Save')

            });

            $('.editButton').click(function() {

                var id = $(this).data('menuid')
                Add_Edit_Menu('Edit Menu', 'Update', id)

            });


            function Add_Edit_Menu(title, button, id = '') {

                $('#addEditModalLabel').text(title);
                $('#saveChangesButton').text(button);
                $('#adminMenuformData')[0].reset();
                $('.invalid-feedback').empty();
                $('.form-control').removeClass('is-invalid');
                // $('.pass-div').show(); //Showing password field while add

                if (id) {

                    $('.pass-div').hide(); //hiding password field while edit
                    // alert(id);
                    $.ajax({

                        url: '/showSingleUser/' + id,
                        type: 'GET',
                        _token: '{{ csrf_token() }}',
                        dataType: 'json',
                        success: function(response) {
                            console.log('Success:', response);
                            $('#menuId').val(response.id);
                            $('#menuname').val(response.menuname);
                            $('#name').val(response.full_name);
                            $('#email').val(response.email);
                            // $('#role').val(response.role);
                            $('input[name=status][value="' + response.status + '"]').prop('checked',
                                true);
                            $('select[name="role"]').val(response.role);


                        },
                        error: function(xhr, status, error) {
                            console.error('Error:', xhr.responseText);
                        }

                    });
                }
                $('#AdminMenuModal').modal('show');
            }


            $('#saveChangesButton').on('click', function(event) {
                event.preventDefault();

                var menu_f_data = $('#adminMenuformData').serialize();
                var id = $('#menuId').val();
                var url = id ? '/menuupdate' : '/addnewUser';




                $('.invalid-feedback').text('').hide();
                $('.form-control').removeClass('is-invalid');

                $.ajax({
                    url: url,
                    type: 'post',
                    data: menu_f_data,
                    dataType: 'json',
                    success: function(response) {
                        console.log(response);
                        window.location.reload(true); // Reload the page
                        $('#AdminMenuModal').modal('hide');
                        $('#adminMenuformData')[0].reset();
                    },
                    error: function(xhr) {

                        if (xhr.status === 422) {
                            var errors = xhr.responseJSON.errors;
                            console.log(errors);


                            $.each(errors, function(key, value) {
                                var field = $('#' + key);
                                var errorField = $('#' + key +
                                    '_error');
                                field.addClass(
                                    'is-invalid');
                                errorField.text(value[0]).show();
                            });
                        } else {

                            console.log('An error occurred:', xhr.status, xhr.statusText);
                        }
                    }
                });

            });

            $(".menustatus").change(function(event) {

                var toastrOptions = {
                    "progressBar": true,
                    "positionClass": "toast-top-right",
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut",
                };

                toastr.success('Request processed successfully.', "Menu's Status Changed", toastrOptions);

                let menuId = $(this).data('id');
                let status = $(this).prop('checked') ? 1 : 0;

                $.ajax({

                    url: "{{ url('/menustausUpdate') }}",
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        menu_Id: menuId,
                        status: status
                    },
                    dataType: 'json',
                    success: function(response) {
                        console.log('Status changed successfully:', response);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error updating status:', xhr.responseText);
                    }

                });

            });

            $('.UserDeleteButton').click(function() {
                if (!confirm('Are you sure you want to delete this Menu?')) {
                    return;
                }

                var id = $(this).data('menuid');

                $.ajax({

                    url: '/menusdelete/' + id,
                    type: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        status: "{{ config('constants.STATUS_DELETE') }}",
                    },
                    dataType: 'json',
                    success: function(response) {
                        // console.log('Success:', response);\
                        window.location.reload(true);


                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', xhr.responseText);
                    }

                });

            });

        });
    </script>
@endsection
