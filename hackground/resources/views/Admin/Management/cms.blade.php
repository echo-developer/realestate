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
                    <div>CMS
                        <div class="page-title-subheading">Management &gt; CMS List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">CMS List</li>
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

        <form action="{{ url('management/cms') }}" method="get">
            <section class="content-header mb-2">
                <div class="row justify-content-end">
                    <div class="col-xl-4 col-lg-6">
                        <div class="input-group">
                            <input class="form-control" id="prop_cms_search" placeholder="Search..." name="term" value="{{ request('term') }}" />
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-header d-flex">
                <h4>CMS List</h4>
                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-primary" onclick="add_prop_cms()">Add CMS</button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table" id="email-table">
                        <thead>
                            <tr>
                                <th style="width: 32px;">ID</th>
                                <th>Title</th>
                                <th>Key</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th style="min-width:60px;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="user">
                            @forelse($data as $item)
                                <tr>
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->title }}<br></td>
                                    <td>{{ $item->slug }}</td>
                                    <td>{{ $item->order }}</td>
                                    <td>
                                        <input type="checkbox" class="cms_prop_status d-none" data-id="{{ $item->id }}"
                                            data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success"
                                            data-offstyle="danger" data-size="mini" {{ $item->status ? 'checked' : '' }}>
                                    </td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md cursor-pointer"
                                            onclick="Edit_prop_cms('{{ $item->id }}')">
                                        </i>
                                        <i class="fa fa-trash text-danger fa-md cursor-pointer"
                                            onclick="Delete_prop_cms('{{ $item->id }}')">
                                        </i>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center text-muted">Sorry, no records found!</td>
                                </tr>
                            @endforelse
                        </tbody>

                    </table>
                </div>
                {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="prop_cms" tabindex="-1" role="dialog" aria-labelledby="prop_cmsaddEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="prop_cmsAddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                    
                </button>
                </div>
                <div class="modal-body">
                    <form id="prop_cmsformData">
                        <input type="hidden" class='d-none' id="prop_cmsimage" name="image">
                        <input type="text" class='d-none' id="prop_cmsId" name="prop_cmsId">
                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-floating mb-3">                                
                                <input type="text" class="form-control reset_field" id="title_{{ $lang }}" name="title[{{ $lang }}]" placeholder="" autocomplete="off">
                                <label for="subject">{{ __('Title') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="title_{{ $lang }}_error"></div>
                            </div>
                        @endforeach
                        <div class="form-floating mb-3">                            
                            <input type="text" class="form-control reset_field" id="slug" name="slug" placeholder="" autocomplete="off">
                            <label for="template_key">Slug</label>
                            <div class="invalid-feedback" id="slug_error"></div>
                        </div>
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="content">{{ __('Content') }} ({{ strtoupper($lang) }})</label>
                                <textarea type="text" class="form-control reset_field" id="content_{{ $lang }}"
                                    name="content[{{ $lang }}]" autocomplete="off"></textarea>
                                <div class="invalid-feedback" id="content_{{ $lang }}_error"></div>
                            </div>
                            <div class="form-floating mb-3">                                
                                <input type="text" class="form-control reset_field" id="meta_title_{{ $lang }}" name="meta_title[{{ $lang }}]" placeholder="" autocomplete="off">
                                <label for="subject">{{ __('Meta Title') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="meta_title_{{ $lang }}_error"></div>
                            </div>
                            <div class="form-floating mb-3">                                
                                <input type="text" class="form-control reset_field" id="meta_keys_{{ $lang }}" name="meta_keys[{{ $lang }}]" placeholder="" autocomplete="off">
                                <label for="subject">{{ __('Meta Keys') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="meta_keys_{{ $lang }}_error"></div>
                            </div>
                            <div class="form-floating mb-3">                                
                                <textarea type="text" class="form-control reset_field" id="meta_desc_{{ $lang }}" name="meta_desc[{{ $lang }}]" placeholder="" autocomplete="off" style="min-height: 75px;"></textarea>
                                <label for="subject">{{ __('Meta Description') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="meta_desc_{{ $lang }}_error"></div>
                            </div>
                        @endforeach

                        <div class="form-floating mb-3">                            
                            <input type="Order" class="form-control" id="order" name="order" placeholder="" required>
                            <label for="Order">Order</label>
                            <div class="invalid-feedback" id="order_error"></div>
                        </div>


                        <div class="form-group mb-0">
                            <label class="form-label d-block">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=1 class="form-check-input" id="status_1" checked required>
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
                    <button type="button" onclick="add_edit_prop_cms()" id="prop_cmsButton"
                        class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        const langs = @json($langs);
        langs.forEach(lang => {
            CKEDITOR.replace(`content_${lang}`);
        });


        function add_prop_cms() {
            const langs = @json($langs); // Pass $langs from backend as JSON
            langs.forEach(lang => {
                const editorInstance = CKEDITOR.instances[`content_${lang}`];
                if (editorInstance) {
                    editorInstance.setData(''); // Clear the CKEditor content
                }
            });
            $('.form-control').removeClass('is-invalid');
            $('#slug').prop('readonly', false);
            $('.invalid-feedback').empty();
            prop_cmsAddEdit('Add CMS', 'Add');
        }

        function Edit_prop_cms(id) {
            console.log(id);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_cmsAddEdit('Edit CMS', 'Update', id);
        }

        function prop_cmsAddEdit(title, buttonText, id = null) {
            $('#prop_cmsAddEditModalLabel').text(title);
            $('#prop_cmsButton').text(buttonText);
            $('#prop_cmsformData')[0].reset();
            $('#image_preview').attr('src', '').hide();
            $('#delete_image_btn').hide();
            if (id) {
                $.get(`{{ url('/management/cms-details') }}/${id}`, function(data) {
                    $('#prop_cmsId').val(data[0].cms_id);
                    data.forEach(function(cms) {
                        $('#title_' + cms.lang).val(cms.title);
                        $('#meta_desc_' + cms.lang).val(cms.meta_desc);
                        $('#meta_title_' + cms.lang).val(cms.meta_title);
                        $('#meta_keys_' + cms.lang).val(cms.meta_keys);


                        const editorInstance = CKEDITOR.instances['content_' + cms.lang];
                        if (editorInstance) {
                            editorInstance.setData(cms
                                .content); // Use CKEditor's method to set data
                        } else {
                            $('#content_' + cms.lang).val(cms
                                .content); // Fallback in case CKEditor is not initialized
                        }


                        if (cms.lang === 'en') {
                            $('#slug').val(cms.slug).prop('readonly', true);
                            $('#order').val(cms.order);
                            $('input[name="status"][value="' + cms.status + '"]').prop(
                                'checked', true);
                        }
                    });
                });
            }
            $('#prop_cms').modal('show');
        }

        function add_edit_prop_cms() {

            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement(); // This updates the textarea with CKEditor content
            }

            var data = $("#prop_cmsformData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#prop_cmsId').val() ?
                `{{ url('/management/edit-management-cms') }}` :
                `{{ url('/management/add-management-cms') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#prop_cms').modal('hide');
                    $('#prop_cmsformData')[0].reset();
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

        $('.cms_prop_status').change(function() {

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
                url: `{{ url('management/cms_status') }}`,
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

        function Delete_prop_cms(id) {
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
                    url: `{{ url('management/cms-delete') }}`,
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
    </script>
@endpush
