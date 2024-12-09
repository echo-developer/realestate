@extends('Admin.layouts.app')

{{-- @dd($data) --}}
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
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
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
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
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
                                <th style="width:5%">ID</th>
                                <th style="width:30%">Menu Name</th>
                                <th style="width:15%">Menu Slug</th>
                                <th style="width:20%">URL</th>
                                <th style="width:20%">Status</th>
                                <th style="min-width:80px;" class="text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            <!-- Loop Through Parent Menus -->
                            @foreach ($data as $menu)
                                <tr>
                                    <td>{{ $menu->id }}</td>
                                    <td>{{ $menu->name }}
                                        @if (!empty($menu->description))
                                            <div><small>{{ $menu->description }}</small></div>
                                        @endif
                                    </td>
                                    <td>{{ $menu->slug }}</td>
                                    <td>{{ $menu->url }}</td>
                                    <td>
                                        <input type="checkbox" class="amenity_prop_status d-none"
                                            data-id="{{ $menu->id }}" data-toggle="toggle" data-on="Active"
                                            data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                            data-size="mini" {{ $menu->status ? 'checked' : '' }}>
                                    </td>

                                    <td class="text-right" style="padding-right:20px;">
                                        <a href="javascript:void(0)" onclick="add('{{ $menu->id }}')"
                                            data-toggle="tooltip" title="Add Sub Menu">
                                            <i class="fa fa-plus-circle text-primary fa-md"></i>
                                        </a>
                                        &nbsp;
                                        <a href="javascript:void(0)" onclick="edit('{{ $menu->id }}')"
                                            data-toggle="tooltip" title="Edit">
                                            <i class="fa fa-edit text-success fa-md"></i>
                                        </a>
                                        &nbsp;
                                        <a href="javascript:void(0)"
                                            onclick="return deleteRecord('{{ $menu->id }}', true)"
                                            data-toggle="tooltip" title="Delete">
                                            <i class="fa fa-trash text-danger fa-md"></i>
                                        </a>
                                    </td>
                                </tr>

                                <!-- Loop Through Child Menus -->
                                {{-- @if (!empty($menu['sub_menus']))
                                    @foreach ($menu['sub_menus'] as $sub_menu)
                                        <tr class="child_menu childof-{{ $menu['id'] }}">
                                            <td>
                                                <div class="custom-checkbox custom-control">
                                                    <input type="checkbox" id="item_{{ $sub_menu['id'] }}" class="custom-control-input check_all" name="ID[]" value="{{ $sub_menu['id'] }}">
                                                    <label class="custom-control-label" for="item_{{ $sub_menu['id'] }}"></label>
                                                </div>
                                            </td>
                                            <td>{{ $sub_menu['id'] }}</td>
                                            <td></td>
                                            <td>
                                                {{ $sub_menu['name'] }}
                                                @if (!empty($sub_menu['description']))
                                                    <div><small>{{ $sub_menu['description'] }}</small></div>
                                                @endif
                                            </td>
                                            <td>{{ $sub_menu['code'] }}</td>
                                            <td>
                                                <div class="toggle btn btn-{{ $sub_menu['status'] == 'Active' ? 'success' : 'danger' }} btn-xs" data-toggle="toggle" style="width: 70.0875px; height: 18.2px;">
                                                    <input onchange="changeStatusSwitch({{ $sub_menu['id'] }}, this)" type="checkbox" {{ $sub_menu['status'] == 'Active' ? 'checked' : '' }} 
                                                        data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini">
                                                    <div class="toggle-group">
                                                        <label class="btn btn-success btn-xs toggle-on">Active</label>
                                                        <label class="btn btn-danger btn-xs toggle-off">Inactive</label>
                                                        <span class="toggle-handle btn btn-light btn-xs"></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="text-right" style="padding-right:20px;">
                                                <a href="javascript:void(0)" onclick="edit('{{ $sub_menu['id'] }}')" data-toggle="tooltip" title="Edit">
                                                    <i class="fa fa-edit text-success fa-md"></i>
                                                </a>
                                                &nbsp;
                                                <a href="javascript:void(0)" onclick="return deleteRecord('{{ $sub_menu['id'] }}', true)" data-toggle="tooltip" title="Delete">
                                                    <i class="fa fa-trash text-danger fa-md"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                @endif --}}
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

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Example form -->
                    <form id="menuManagementFormData">
                        @csrf
                        <!-- Hidden input for menu ID -->
                        <input type="text" class='d-none' id="menuID" name="menuID">
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
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_menu_AddEdit('Menu Add', 'Add');
        }

        function Edit_prop_menu(id) {
            console.log(id);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_menu_AddEdit('Menu Edit', 'Update', id);
        }

        function prop_menu_AddEdit(title, buttonText, id = null) {
            $('#addEditModalLabel').text(title);
            $('#saveChangesButton').text(buttonText);
            $('#menuManagementFormData')[0].reset();
            if (id) {
                $.get(`{{ url('/project/amenity-details') }}/${id}`, function(data) {
                    $('#menuID').val(data[0].amenity_id);
                    data.forEach(function(amenity) {
                        $('#name_' + amenity.lang).val(amenity.name);
                        if (amenity.lang === 'en') {
                            var imageSrc = `{{ asset('amenity_image') }}/${amenity.image}`;
                            if (amenity.image) {
                                $('#image_preview').attr('src', imageSrc).show();
                                $('#delete_image_btn').show();
                            }
                            $('#prop_amenityimage').val(amenity.image);
                            $('#order').val(amenity.order);
                            $('input[name="status"][value="' + amenity.status + '"]').prop(
                                'checked', true);
                        }
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

            var url = $('#prop_amenityId').val() ?
                `{{ url('/edit-menu') }}` :
                `{{ url('/add-menu') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    // window.location.reload(true);
                    // $('#prop_amenity').modal('hide');
                    // $('#menuManagementFormData')[0].reset();
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



        $('.amenity_prop_status').change(function() {

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
                url: `{{ url('project/amenity_status') }}`,
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
                    url: `{{ url('project/amenity-delete') }}`,
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

        $('#AmenityfileUpload').change(function(event) {
            var fileInput = event.target;
            var file = fileInput.files[0];
            var fileLabel = document.querySelector('.custom-file-label');
            fileLabel.textContent = file.name;

            var reader = new FileReader();
            reader.onload = function(e) {
                var imagePreview = document.getElementById('image_preview');
                imagePreview.style.display = 'block';
                imagePreview.src = e.target.result;
            };

            if (file) {
                reader.readAsDataURL(file);
            }

            var formData = new FormData();
            formData.append('file', file);
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: `{{ url('/project/amenity-image') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('File uploaded successfully');
                    // Optionally store the file name or URL if necessary (e.g., in a hidden input field)
                    $('#prop_amenityimage').val(response.fileName); // Set file name in hidden field
                    $('#image_preview').attr('src', '/' + 'amenity_image/' + response.fileName)
                        .show(); // Update image preview
                    $('#delete_image_btn').show();
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading file:', error);
                }
            });
        });

        function deleteUploadedImage() {
            var fileName = $('#prop_amenityimage').val();
            if (!fileName) {
                alert('No image to delete!');
                return;
            }

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                url: `{{ url('/project/delete-amenity-image') }}`,
                type: 'POST',
                data: {
                    file: fileName
                },
                success: function(response) {
                    console.log('File deleted successfully');
                    $('#image_preview').attr('src', '').hide();
                    $('#delete_image_btn').hide();
                    $('#prop_amenityimage').val('');
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting file:', error);
                }
            });
        }
        $(document).ready(function() {
            var table = $('.table').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [0, 'desc']
                ],
                "columnDefs": [{
                        "orderable": true,
                        "targets": [0]
                    },
                    {
                        "orderable": false,
                        "targets": [2, 3, 4, 5]
                    }
                ]
            });
        });
    </script>
@endpush
