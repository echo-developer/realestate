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
                <div>Property
                    <div class="page-title-subheading">Property &gt; Property Category List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Property Category List</li>
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

    <form action="/prop_category_search" method="get">

        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_category_search" placeholder="Search..." name="term" value="{{request('term')}}">
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-site btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Property Category List

                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-success" onclick="add_prop_category()">Add Property Category</button>
                </div>

            </div>

            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:15%">Name</th>
                            <th style="width:20%">Order</th>
                            <th style="width:20%">Status</th>
                            <th style="width:30%">Image</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    @if(!empty($data))
                    @foreach($data as $item)
                    <tbody id="user">
                        <tr>
                            <td>{{$item->id}}</td>
                            <td>{{$item->name}}</td>
                            <td>{{$item->order}}</td>

                            <td>
                                <input data-id="{{$item->id}}" class="category_prop_status d-none" type="checkbox" data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status ? 'checked' : '' }}>
                            </td>
                            <td><img src="{{ asset('category_image/' . $item->image) }}" alt="Category Image" height="50px" width="70px"> </td>
                            <td class="text-right">

                                <i class="fa fa-edit text-success fa-md " onclick="Edit_prop_category('{{ $item->id }}')"></i>

                                <i class="fa fa-trash text-danger fa-md" onclick="Delete_prop_category('{{ $item->id }}')"></i>

                            </td>
                        </tr>

                    </tbody>
                    @endforeach
                    @endif
                </table>
            </div>
            <div class="card-footer pagination-rounded clearfix justify-content-center">


            </div>
        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="prop_category" tabindex="-1" role="dialog" aria-labelledby="prop_categoryaddEditModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="prop_categoryAddEditModalLabel"></h5>

                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">

                <form id="prop_categoryformData">
                    <input type="hidden" class='d-none' id="prop_categoryimage" name="image">
                    <input type="text" class='d-none' id="prop_categoryId" name="prop_categoryId">
                    @php
                    $langs = ['en', 'ar','sw'];
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-group">
                        <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control reset_field" id="name_{{ $lang }}" name="name[{{ $lang }}]" autocomplete="off">
                        <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-group">
                        <label for="ufile">Image Icon</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="Categoryfile" id="CategoryfileUpload" class="custom-file-input" onchange="updateCategoryFileName()">
                                <label class="custom-file-label" for="ufile">Choose file</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <img id="image_preview" src=" " style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn" style="display:none;" class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>

                    <div class="form-group">
                        <label for="Order">Order</label>
                        <input type="Order" class="form-control" id="order" name="order" required>
                        <div class="invalid-feedback" id="Order_error"></div>
                    </div>


                    <div class="form-group">
                        <label class="form-label">Status</label>
                        <div class="radio-inline">
                            <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked required>
                            <label for="status_1">Active</label>
                            <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                            <label for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onclick="add_edit_prop_category()" id="prop_categoryButton" class="btn btn-primary">Save</button>
            </div>
        </div>

    </div>
</div>
@endsection
@section('custom-js')

<script>
    function add_prop_category() {
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        prop_categoryAddEdit('Property Category Add', 'Add');
    }

    function Edit_prop_category(id) {
        console.log(id);
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        prop_categoryAddEdit('Property Category Edit', 'Update', id);
    }

    function prop_categoryAddEdit(title, buttonText, id = null) {
        $('#prop_categoryAddEditModalLabel').text(title);
        $('#prop_categoryButton').text(buttonText);
        $('#prop_categoryformData')[0].reset();
        $('#image_preview').attr('src', '').hide();
        $('#delete_image_btn').hide();
        if (id) {
            $.get(`{{ url('/property/category-details') }}/${id}`, function(data) {
                $('#prop_categoryId').val(data[0].category_id);
                data.forEach(function(category) {
                    $('#name_' + category.lang).val(category.name);
                    if (category.lang === 'en') {
                        var imageSrc = `{{ asset('category_image') }}/${category.image}`;
                        if (category.image) {
                            $('#image_preview').attr('src', imageSrc).show();
                            $('#delete_image_btn').show();
                        }
                        $('#prop_categoryimage').val(category.image);
                        $('#order').val(category.order);
                        $('#status').val(category.status);
                    }
                });
            });
        }
        $('#prop_category').modal('show');
    }

    function add_edit_prop_category() {
        var data = $("#prop_categoryformData").serializeArray();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var url = $('#prop_categoryId').val() ?
            `{{ url('/property/edit-property-category') }}` :
            `{{ url('/property/add-property-category') }}`;

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(response) {
                localStorage.setItem('successMessage', response.message);
                window.location.reload(true);
                $('#prop_category').modal('hide');
                $('#prop_categoryformData')[0].reset();
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



    $('.category_prop_status').change(function() {
  
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
            url: `{{ url('property/category_status') }}`,
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

    function Delete_prop_category(id) {
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
                url: `{{ url('property/category-delete') }}`,
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

    $('#CategoryfileUpload').change(function(event) {
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
            url: `{{ url('/property/category-image') }}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('File uploaded successfully');
                // Optionally store the file name or URL if necessary (e.g., in a hidden input field)
                $('#prop_categoryimage').val(response.fileName); // Set file name in hidden field
                $('#image_preview').attr('src', '/' + 'category_image/' + response.fileName).show(); // Update image preview
                $('#delete_image_btn').show();
            },
            error: function(xhr, status, error) {
                console.error('Error uploading file:', error);
            }
        });
    });

    function deleteUploadedImage() {
        var fileName = $('#prop_categoryimage').val();
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
            url: `{{ url('/property/delete-category-image') }}`,
            type: 'POST',
            data: {
                file: fileName
            },
            success: function(response) {
                console.log('File deleted successfully');
                $('#image_preview').attr('src', '').hide();
                $('#delete_image_btn').hide();
                $('#prop_categoryimage').val('');
            },
            error: function(xhr, status, error) {
                console.error('Error deleting file:', error);
            }
        });
    }
</script>

@endsection