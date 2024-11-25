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
                    <div>Testimonial
                        <div class="page-title-subheading">Management &gt; Testimonial List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Testimonial List</li>
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

        <form action="{{ url('management/testimonial') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_testimonial_search" placeholder="Search..." name="term"
                                value="{{ request('term') }}" />
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Testimonial List

                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add_prop_testimonial()">Add
                            Testimonial</button>
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
                        <tbody id="user">
                            @forelse($data as $item)
                                <tr>
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->name }}<br><small>{{ $item->subname }}</small></td>
                                    <td>{{ $item->order }}</td>
                                    <td>
                                        <input type="checkbox" class="testimonial_prop_status d-none"
                                            data-id="{{ $item->id }}" data-toggle="toggle" data-on="Active"
                                            data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                            data-size="mini" {{ $item->status ? 'checked' : '' }}>
                                    </td>
                                    <td>
                                        <img src="{{ asset('testimonial_image/' . $item->image) }}" alt="Testimonial Image"
                                            class="img-thumbnail" style="height: 50px; width: 70px;">
                                    </td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md cursor-pointer"
                                            onclick="Edit_prop_testimonial('{{ $item->id }}')">
                                        </i>
                                        <i class="fa fa-trash text-danger fa-md cursor-pointer"
                                            onclick="Delete_prop_testimonial('{{ $item->id }}')">
                                        </i>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6">Sorry, no records found!</td>
                                </tr>
                            @endforelse
                        </tbody>

                    </table>
                </div>
                @if ($data->isNotEmpty())
                    <div class="card-footer pagination-rounded clearfix justify-content-center">
                        <ul class="pagination small mb-0">
                            @if ($data->currentPage() == $data->lastPage() && $data->currentPage() != 1)
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url(1) }}" class="page-link"
                                        rel="start">
                                        <i class="fa fa-chevron-left"></i> First
                                    </a>
                                </li>
                            @endif

                            <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->previousPageUrl() }}"
                                    class="page-link" rel="prev">
                                    <i class="fa fa-chevron-left"></i>
                                </a>
                            </li>

                            @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                                <li class="page-item {{ $data->currentPage() == $i ? 'active' : '' }}">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($i) }}"
                                        class="page-link">{{ $i }}</a>
                                </li>
                            @endfor

                            <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->nextPageUrl() }}"
                                    class="page-link" rel="next">
                                    <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>

                            @if ($data->currentPage() != $data->lastPage())
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($data->lastPage()) }}"
                                        class="page-link" rel="end">
                                        Last <i class="fa fa-chevron-right"></i>
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </div>
                @endif
            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="prop_testimonial" tabindex="-1" role="dialog"
        aria-labelledby="prop_testimonialaddEditModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="prop_testimonialAddEditModalLabel"></h5>

                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <form id="prop_testimonialformData">
                        <input type="hidden" class='d-none' id="prop_testimonialimage" name="image">
                        <input type="text" class='d-none' id="prop_testimonialId" name="prop_testimonialId">
                        @php
                            $langs = ['en', 'ar'];
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                                <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                                    name="name[{{ $lang }}]" autocomplete="off">
                                <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                            </div>
                        @endforeach
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="subname">{{ __('Subname') }} ({{ strtoupper($lang) }})</label>
                                <input type="text" class="form-control reset_field" id="subname_{{ $lang }}"
                                    name="subname[{{ $lang }}]" autocomplete="off">
                                <div class="invalid-feedback" id="subname_{{ $lang }}_error"></div>
                            </div>
                        @endforeach
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="description">{{ __('Description') }} ({{ strtoupper($lang) }})</label>
                                <textarea type="text" class="form-control reset_field" id="description_{{ $lang }}"
                                    name="description[{{ $lang }}]" autocomplete="off"></textarea>
                                <div class="invalid-feedback" id="description_{{ $lang }}_error"></div>
                            </div>
                        @endforeach

                        <div class="form-group">
                            <label for="ufile">Image Icon</label>
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" name="Testimonialfile" id="TestimonialfileUpload"
                                        class="custom-file-input" onchange="updateTestimonialFileName()">
                                    <label class="custom-file-label" for="ufile">Choose file</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <img id="image_preview" src=" " style="display:none; width: 100px; height: auto;" />
                            <button type="button" id="delete_image_btn" style="display:none;"
                                class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                        </div>

                        <div class="form-group">
                            <label for="Order">Order</label>
                            <input type="Order" class="form-control" id="order" name="order" required>
                            <div class="invalid-feedback" id="Order_error"></div>
                        </div>


                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <div class="radio-inline">
                                <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked
                                    required>
                                <label for="status_1">Active</label>
                                <input type="radio" name="status" value=0 class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" onclick="add_edit_prop_testimonial()" id="prop_testimonialButton"
                        class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>
@endsection
@section('custom-js')
    <script>
        function add_prop_testimonial() {
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_testimonialAddEdit('Add Testimonial', 'Add');
        }

        function Edit_prop_testimonial(id) {
            console.log(id);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_testimonialAddEdit('Edit Testimonial', 'Update', id);
        }

        function prop_testimonialAddEdit(title, buttonText, id = null) {
            $('#prop_testimonialAddEditModalLabel').text(title);
            $('#prop_testimonialButton').text(buttonText);
            $('#prop_testimonialformData')[0].reset();
            $('#image_preview').attr('src', '').hide();
            $('#delete_image_btn').hide();
            if (id) {
                $.get(`{{ url('/management/testimonial-details') }}/${id}`, function(data) {
                    $('#prop_testimonialId').val(data[0].testimonial_id);
                    data.forEach(function(testimonial) {
                        $('#name_' + testimonial.lang).val(testimonial.name);
                        $('#subname_' + testimonial.lang).val(testimonial.subname);
                        $('#description_' + testimonial.lang).val(testimonial.description);
                        if (testimonial.lang === 'en') {
                            var imageSrc = `{{ asset('testimonial_image') }}/${testimonial.image}`;
                            if (testimonial.image) {
                                $('#image_preview').attr('src', imageSrc).show();
                                $('#delete_image_btn').show();
                            }
                            $('#prop_testimonialimage').val(testimonial.image);
                            $('#order').val(testimonial.order);
                            $('input[name="status"][value="' + testimonial.status + '"]').prop(
                                'checked', true);
                        }
                    });
                });
            }
            $('#prop_testimonial').modal('show');
        }

        function add_edit_prop_testimonial() {
            var data = $("#prop_testimonialformData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#prop_testimonialId').val() ?
                `{{ url('/management/edit-management-testimonial') }}` :
                `{{ url('/management/add-management-testimonial') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#prop_testimonial').modal('hide');
                    $('#prop_testimonialformData')[0].reset();
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



        $('.testimonial_prop_status').change(function() {

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
                url: `{{ url('management/testimonial_status') }}`,
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

        function Delete_prop_testimonial(id) {
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
                    url: `{{ url('management/testimonial-delete') }}`,
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

        $('#TestimonialfileUpload').change(function(event) {
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
                url: `{{ url('/management/testimonial-image') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('File uploaded successfully');
                    // Optionally store the file name or URL if necessary (e.g., in a hidden input field)
                    $('#prop_testimonialimage').val(response.fileName); // Set file name in hidden field
                    $('#image_preview').attr('src', '/' + 'testimonial_image/' + response.fileName)
                        .show(); // Update image preview
                    $('#delete_image_btn').show();
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading file:', error);
                }
            });
        });

        function deleteUploadedImage() {
            var fileName = $('#prop_testimonialimage').val();
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
                url: `{{ url('/management/delete-testimonial-image') }}`,
                type: 'POST',
                data: {
                    file: fileName
                },
                success: function(response) {
                    console.log('File deleted successfully');
                    $('#image_preview').attr('src', '').hide();
                    $('#delete_image_btn').hide();
                    $('#prop_testimonialimage').val('');
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting file:', error);
                }
            });
        }
    </script>
@endsection
