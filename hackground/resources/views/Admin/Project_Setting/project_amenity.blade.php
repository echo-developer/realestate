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

    <div class="app-page-title" hidden>
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Property
                    <div class="page-title-subheading">Property &gt; Property Amenity List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Property Amenity List</li>
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

        /* Mobile Responsiveness */
        @media (max-width: 767px) {
            .settings-card-header { flex-wrap: wrap; gap: 0.75rem; }
            .table-responsive { overflow: visible !important; }
            
            /* Override DataTables wrappers */
            .dataTables_wrapper .row { margin-left: 0 !important; margin-right: 0 !important; }
            .dataTables_wrapper .col-sm-12 { padding-left: 0 !important; padding-right: 0 !important; overflow-x: visible !important; }
            
            .settings-table thead { display: none !important; }
            .settings-table, .settings-table tbody, .settings-table tr, .settings-table td { display: block !important; width: 100% !important; box-sizing: border-box !important; }
            .settings-table tr { margin-bottom: 0.75rem !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 0 !important; overflow: hidden !important; box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; background: #fff !important; }
            .settings-table td { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid #f1f5f9 !important; padding: 0.75rem 1rem !important; text-align: right !important; }
            .settings-table td > span, .settings-table td > div { flex: 1 !important; min-width: 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; text-align: right !important; justify-content: flex-end !important; display: flex !important; align-items: center !important; gap: 0.5rem !important; }
            .settings-table td:last-child { border-bottom: none !important; background: #f8fafc !important; }
            .settings-table td::before { content: attr(data-label) !important; font-weight: 600 !important; color: #64748b !important; font-size: 0.75rem !important; text-transform: uppercase !important; text-align: left !important; padding-right: 1rem !important; flex-shrink: 0 !important; }
            .actions-cell { justify-content: flex-end !important; width: auto !important; }
            
            /* Mobile Bottom-Sheet Modal */
            #prop_amenity .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
            #prop_amenity.show .modal-dialog { transform: translateY(0); }
            #prop_amenity .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
            #prop_amenity .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
            #prop_amenity .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
            #prop_amenity .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
            #prop_amenity .form-floating .form-control, #prop_amenity .form-floating .form-select { height: 52px; font-size: 0.95rem; }
            #prop_amenityButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
        }

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

    <form action="{{ url('project/amenity') }}" method="get">
        <section class="content-header mb-2">
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control" id="prop_amenity_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card card-modern">
        <div class="settings-card-header">
            <h4><i class="fa fa-spa text-primary me-2"></i> Property Amenity List</h4>
            <div class="btn-actions-pane-right">
                <button type="button" class="btn-add-setting" onclick="add_prop_amenity()">
                    <i class="fa fa-plus me-1"></i> Add Property Amenity
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive" id="main_table">
                <table class="settings-table">
                    <thead>
                        <tr>
                            <th style="width: 32px;">ID</th>
                            <th style="min-width:120px;">Name</th>
                            <th>Order</th>
                            <th>Status</th>
                            <th>Icon</th>
                            <th style="min-width:60px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">
                        @forelse($data as $item)
                        <tr>
                            <td data-label="ID"><span>#{{ $item->id }}</span></td>
                            <td data-label="Name"><span>{{ $item->name }}</span></td>
                            <td data-label="Order"><span>{{ $item->order }}</span></td>
                            <td data-label="Status">
                                <div>
                                    <input type="checkbox" class="amenity_prop_status d-none"
                                        data-id="{{ $item->id }}" data-toggle="toggle" data-on="Active"
                                        data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                        data-size="mini" {{ $item->status ? 'checked' : '' }}>
                                </div>
                            </td>
                            <td data-label="Icon">
                                <div class="d-flex justify-content-end w-100">
                                    @php
                                    $imagePath = 'user_upload/amenity_image/' . $item->image;
                                    $fullImagePath = public_path($imagePath);
                                    $imageToShow =
                                    isset($item->image) && file_exists($fullImagePath)
                                    ? asset($imagePath)
                                    : asset(config('constants.NO_IMAGE'));
                                    @endphp
                                    <img src="{{ $imageToShow }}"
                                        alt="N/A" class="img-fluid rounded border border-light" height="36" width="36" style="object-fit: cover;">
                                </div>
                            </td>
                            <td data-label="Action" class="text-right">
                                <div class="actions-cell">
                                    <a href="javascript:void(0)" onclick="Edit_prop_amenity('{{ $item->id }}')" class="action-icon-btn edit cursor-pointer">
                                        <i class="bi bi-pencil-square"></i>
                                    </a>
                                    <a href="javascript:void(0)" onclick="Delete_prop_amenity('{{ $item->id }}')" class="action-icon-btn delete cursor-pointer">
                                        <i class="bi bi-trash3-fill"></i>
                                    </a>
                                </div>
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
            {!! $data->links('vendor.pagination.bootstrap-5') !!}
        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="prop_amenity" tabindex="-1" role="dialog"
    aria-labelledby="prop_amenityaddEditModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header border-bottom-0">

                <h5 class="modal-title fw-bold" id="prop_amenityAddEditModalLabel"></h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">

                <form id="prop_amenityformData">
                    <input type="hidden" class='d-none' id="prop_amenityimage" name="image">
                    <input type="text" class='d-none' id="prop_amenityId" name="prop_amenityId">
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                    <div class="form-floating mb-4">

                        <input type="text" class="form-control reset_field" id="name_{{ $lang }}"
                            name="name[{{ $lang }}]" autocomplete="off" placeholder="">
                        <label for="name">{{ __('Name') }} ({{ strtoupper($lang) }})</label>
                        <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-group">
                        <!-- <label for="ufile">Image Icon</label> -->
                        <div class="">
                            <input type="file" name="Amenityfile" id="AmenityfileUpload" class="form-control">
                        </div>
                    </div>
                    <div class="form-group mb-4">
                        <img id="image_preview" src=" " style="display:none; width: 64px; height: 64px;" />
                        <button type="button" id="delete_image_btn" style="display:none;"
                            class="btn btn-danger btn-sm" title="Delete Image" onclick="deleteUploadedImage()"><i class="bi bi-trash3-fill"></i></button>
                    </div>

                    <div class="form-floating mb-4">
                        <input type="text" class="form-control" id="order" name="order" placeholder="" required>
                        <label for="Order">Order</label>
                        <div class="invalid-feedback" id="Order_error"></div>
                    </div>

                    <div class="form-group mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" class="form-check-input" name="status" value=1 class="magic-radio" id="status_1" checked
                                required>
                            <label class="form-check-label" for="status_1">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" class="form-check-input" name="status" value=0 class="magic-radio" id="status_2">
                            <label class="form-check-label" for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" onclick="add_edit_prop_amenity()" id="prop_amenityButton"
                    class="btn btn-primary px-4 shadow-sm">Save</button>
            </div>
        </div>

    </div>
</div>
@endsection
@push('custom-js')
<script>
    function add_prop_amenity() {
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        prop_amenityAddEdit('Property Amenity Add', 'Add');
    }

    function Edit_prop_amenity(id) {
        $('.form-control').removeClass('is-invalid');
        $('.invalid-feedback').empty();
        prop_amenityAddEdit('Property Amenity Edit', 'Update', id);
    }

    function prop_amenityAddEdit(title, buttonText, id = null) {
        $('#prop_amenityAddEditModalLabel').text(title);
        $('#prop_amenityButton').text(buttonText);
        $('#prop_amenityformData')[0].reset();
        $('#image_preview').attr('src', '').hide();
        $('#delete_image_btn').hide();
        if (id) {
            $.get(`{{ url('/project/amenity-details') }}/${id}`, function(data) {
                $('#prop_amenityId').val(data[0].amenity_id);
                data.forEach(function(amenity) {
                    $('#name_' + amenity.lang).val(amenity.name);
                    if (amenity.lang === 'en') {
                        var imageSrc = `{{ asset('user_upload/amenity_image') }}/${amenity.image}`;
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
        $('#prop_amenity').modal('show');
    }

    function add_edit_prop_amenity() {
        var data = $("#prop_amenityformData").serializeArray();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var url = $('#prop_amenityId').val() ?
            `{{ url('/project/edit-project-amenity') }}` :
            `{{ url('/project/add-project-amenity') }}`;

        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function(response) {
                // localStorage.setItem('successMessage', response.message);
                window.location.reload(true);
                $('#prop_amenity').modal('hide');
                $('#prop_amenityformData')[0].reset();
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

    function Delete_prop_amenity(id) {
        var result = confirm('Are you sure you want to delete this?');
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

    $('#AmenityfileUpload').change(function(event) {
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
            url: `{{ url('/project/amenity-image') }}`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#prop_amenityimage').val(response.fileName);
                $('#image_preview').attr('src', response.filePath).show();
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