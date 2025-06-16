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
                <div>Property Subcategory
                    <div class="page-title-subheading">Property Setting &gt; Property Subcategory List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Property Subcategory List</li>
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

    <form action="{{ url('property/subcategory') }}" method="get">

        <section class="content-header mb-2">
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control" id="prop_subcategory_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}">
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-site btn-primary"><i
                                    class="bi bi-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card">
        <div class="card-header d-flex">
        <h4>Property Subcategory List</h4>

                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-primary" onclick="add_prop_subcategory()">Add Property
                        Subcategory</button>
                </div>

            </div>
        <div class="card-body">


            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:32px">ID</th>
                            <th style="min-width:120px">Name</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Image</th>
                            <th style="min-width:60px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">
                        @if (!empty($subcategory_data))
                            @foreach ($subcategory_data as $item)
                                <tr>
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->name }}</td>
                                    <td>{{ $item->order }}</td>
                                    <td>
                                        <input data-id="{{ $item->id }}" class="subcategory_prop_status d-none"
                                            type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive"
                                            data-onstyle="success" data-offstyle="danger" data-size="mini"
                                            {{ $item->status ? 'checked' : '' }}>
                                    </td>
                                    <td><img src="{{ $item->image ? asset('user_upload/subCategory_image/' . $item->image) : asset(config('constants.NO_IMAGE')) }}"
                                            alt="Subcategory Image" class="img-fluid" height="36" width="36">
                                        </td>
                                    <td class="text-right">
                                        <a href="javascript:void(0)" onclick="Edit_prop_subcategory('{{ $item->id }}')" class="me-2"><i class="bi bi-pencil-square text-success fa-md "></i></a>
                                        <a href="javascript:void(0)" onclick="Delete_prop_subcategory('{{ $item->id }}')"><i class="bi bi-trash3-fill text-danger fa-md"></i></a>
                                    </td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            </div>
            {!! $subcategory_data->links('vendor.pagination.bootstrap-5') !!}
        </div>
    </div>

@endsection
@section('modals')
    <div class="modal fade" id="prop_subcategory" tabindex="-1" role="dialog"
        aria-labelledby="prop_subcategoryaddEditModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="prop_subcategoryAddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <div class="modal-body">

                    <form id="prop_subcategoryformData">
                        <input type="hidden" class='d-none' id="prop_subcategoryimage" name="image">
                        <input type="text" class='d-none' id="prop_subcategoryId" name="prop_subcategoryId">

                        <div class="form-floating mb-3">
                            <select name="category_id" id="category_id" class="form-select">
                                <option value="">-select Category-</option>
                                @if (isset($category_data))
                                    @foreach ($category_data as $items)
                                        <option value="{{ $items->id }}">{{ $items->name }}</option>
                                    @endforeach
                                @endif
                            </select>
                            <label for="ufile">Category Name</label>
                        </div>

                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-floating mb-3">

                                <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                                    name="name[{{ $lang }}]" autocomplete="off" placeholder="">
                                <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                            </div>
                        @endforeach
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="slug" name="slug" required placeholder="">
                            <label for="Name">Slug</label>
                            <div class="invalid-feedback" id="slug_error"></div>
                            <div id="addRoleErrorContainer"></div>
                            <div id="editRoleErrorContainer"></div>

                        </div>
                        <div class="form-group">
                            <!-- <label for="ufile">Image Icon</label> -->
                            <input type="file" name="file" id="fileUpload" class="form-control">
                        </div>
                        <div class="form-group">
                            <img id="image_preview" src=" " style="display:none; width: 64px; height: 64px;" />
                            <button type="button" id="delete_image_btn" style="display:none;"
                            class="btn btn-danger btn-sm" title="Delete Image" onclick="deleteUploadedImage()"><i class="bi bi-trash3-fill"></i></button>
                        </div>

                        <div class="form-floating mb-3">

                            <input type="Order" class="form-control" id="order" name="order" placeholder="" required>
                            <label for="Order">Order</label>
                            <div class="invalid-feedback" id="Order_error"></div>
                        </div>


                        <div class="form-group mb-0">
                            <label class="form-label d-block">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked
                                    required>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=0 class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" onclick="add_edit_prop_subcategorysave()" id="prop_subcategoryButton"
                        class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        $('#name_en').on('keyup', function() {

            var name = $(this).val(); // Get the value of the Name input
            var slug = name.toLowerCase() // Convert to lowercase
                .replace(/ /g, '-') // Replace spaces with hyphens
                .replace(/[^\w-]+/g, ''); // Remove all non-word chars
            $('#slug').val(slug); // Set the generated slug in the Slug input field
        });

        function add_prop_subcategory() {
            $('.form-control').removeClass('is-invalid');
            $('.custom-file-label').text('Choose file');
            $('.invalid-feedback').empty();
            $('#slug').prop('readonly', false);

            add_edit_prop_subcategory('Property SubCategory Add', 'Add');
        }

        function Edit_prop_subcategory(id) {
            console.log(id);
            $('.custom-file-label').text('Choose file');
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            add_edit_prop_subcategory('Property SubCategory Edit', 'Update', id);
        }

        function add_edit_prop_subcategory(title, buttonText, id = null) {
            $('#prop_subcategoryAddEditModalLabel').text(title);
            $('#prop_subcategoryButton').text(buttonText);
            $('#prop_subcategoryformData')[0].reset();
            $('#image_preview').attr('src', '').hide();
            $('#delete_image_btn').hide();
            if (id) {
                $.get(`{{ url('/property/subcategory-details') }}/${id}`, function(data) {
                    $('#prop_subcategoryId').val(data[0].sub_category_id);
                    data.forEach(function(subcategory) {
                        $('#name_' + subcategory.lang).val(subcategory.name);
                        if (subcategory.lang === 'en') {
                            var imageSrc =
                                `{{ asset('user_upload/subCategory_image') }}/${subcategory.image}`;
                            if (subcategory.image) {
                                $('#image_preview').attr('src', imageSrc).show();
                                $('#delete_image_btn').show();
                            }
                            $('#prop_subcategoryimage').val(subcategory.image);
                            $('#order').val(subcategory.order);
                            $('#slug').val(subcategory.slug).prop('readonly', true);
                            $('#status').val(subcategory.status);
                            $('#category_id').val(subcategory.category_id);
                        }
                    });
                });
            }
            $('#prop_subcategory').modal('show');
        }

        function add_edit_prop_subcategorysave() {
            var data = $("#prop_subcategoryformData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#prop_subcategoryId').val() ?
                `{{ url('/property/edit-property-subcategory') }}` :
                `{{ url('/property/add-property-subcategory') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    // localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#prop_subcategory').modal('hide');
                    $('#prop_subcategoryformData')[0].reset();
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



        $('.subcategory_prop_status').change(function() {

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
                url: `{{ url('property/subcategory_status') }}`,
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

        function Delete_prop_subcategory(id) {
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
                    url: `{{ url('property/subcategory-delete') }}`,
                    data: {
                        'id': id
                    },
                    success: function(response) {
                        // localStorage.setItem('successMessage', response.message);
                        window.location.reload(true);
                    },
                    error: function(msg) {
                        console.log(msg);
                        var errors = msg.responseJSON;
                    }
                });
            }
        }

        $('#fileUpload').change(function(event) {
            var fileInput = event.target;
            var file = fileInput.files[0];
            var formData = new FormData();
            formData.append('file', file);
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                url: `{{ url('/property/subcategory-image') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('File uploaded successfully');
                    // Optionally store the file name or URL if necessary (e.g., in a hidden input field)
                    $('#prop_subcategoryimage').val(response.fileName); // Set file name in hidden field
                    $('#delete_image_btn').show();
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading file:', error);
                }
            });
        });



        function deleteUploadedImage(event) {
            var fileName = $('#prop_subcategoryimage').val();
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
                url: `{{ url('/property/delete-subcategory-image') }}`,
                type: 'POST',
                data: {
                    file: fileName
                },
                success: function(response) {
                    console.log('File deleted successfully');
                    $('#image_preview').attr('src', '').hide();
                    $('#delete_image_btn').hide();
                    $('#prop_subcategoryimage').val('');
                    $('.custom-file-label').text('Choose file');
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
                        "targets": [2, 3, 4]
                    }
                ]
            });
        });
    </script>
@endpush
