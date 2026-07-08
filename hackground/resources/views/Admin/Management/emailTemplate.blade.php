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
                    <div>Email Template
                        <div class="page-title-subheading">Management &gt; Email Template List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Email Template List</li>
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
                #prop_emailTemplate .modal-dialog { position: fixed; bottom: 0; left: 0; right: 0; margin: 0; width: 100%; max-width: 100%; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1); }
                #prop_emailTemplate.show .modal-dialog { transform: translateY(0); }
                #prop_emailTemplate .modal-content { border-radius: 20px 20px 0 0; border: none; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 -4px 24px rgba(0,0,0,0.15); }
                #prop_emailTemplate .modal-header { border-bottom: 1px solid #f0f0f0; padding: 0.85rem 1.25rem 0.75rem; }
                #prop_emailTemplate .modal-body { overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 1rem 1.25rem; }
                #prop_emailTemplate .modal-footer { border-top: 1px solid #f0f0f0; padding: 0.75rem 1.25rem; padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
                #prop_emailTemplate .form-floating .form-control, #prop_emailTemplate .form-floating .form-select { height: 52px; font-size: 0.95rem; }
                #prop_emailTemplateButton { width: 100%; height: 46px; border-radius: 12px; font-weight: 600; }
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

        <form action="{{ url('management/emailTemplate') }}" method="get">
            <section class="content-header mb-2">
                <div class="row justify-content-end">
                    <div class="col-xl-4 col-lg-6">
                        <div class="input-group">
                            <input class="form-control" id="prop_emailTemplate_search" placeholder="Search..."
                                name="term" value="{{ request('term') }}" />
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-search"></i>
                                </button>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card card-modern">
            <div class="settings-card-header">
                <h4><i class="fa fa-envelope text-primary me-2"></i> Email Template List</h4>
                <div class="btn-actions-pane-right">
                    <button id="exportExcel" class="btn btn-sm btn-outline-primary me-2" style="border-radius: 8px;">Download Excel</button>
                    <button type="button" class="btn-add-setting" onclick="add_prop_emailTemplate()">
                        <i class="fa fa-plus me-1"></i> Add Email Template
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive" id="main_table">
                    <table class="settings-table" id="email-table">
                        <thead>
                            <tr>
                                <th style="width:32px">ID</th>
                                <th>Name</th>
                                <th>Key</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th style="min-width:60px;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="user">
                            @forelse($data as $item)
                                <tr>
                                    <td data-label="ID"><span>#{{ $item->id }}</span></td>
                                    <td data-label="Name"><span>{{ $item->name }}</span></td>
                                    <td data-label="Key"><span>{{ $item->key }}</span></td>
                                    <td data-label="Order"><span>{{ $item->order }}</span></td>
                                    <td data-label="Status">
                                        <div>
                                            <input type="checkbox" class="EmailTemplate_prop_status d-none"
                                                data-id="{{ $item->id }}" data-toggle="toggle" data-on="Active"
                                                data-off="Inactive" data-onstyle="success" data-offstyle="danger"
                                                data-size="mini" {{ $item->status ? 'checked' : '' }}>
                                        </div>
                                    </td>
                                    <td data-label="Action" class="text-right">
                                        <div class="actions-cell">
                                            <a href="javascript:void(0)" class="action-icon-btn edit cursor-pointer"
                                                onclick="Edit_prop_emailTemplate('{{ $item->id }}')">
                                                <i class="bi bi-pencil-square"></i>
                                            </a>
                                            <a href="javascript:void(0)" class="action-icon-btn delete cursor-pointer"
                                                onclick="Delete_prop_emailTemplate('{{ $item->id }}')">
                                                <i class="bi bi-trash3-fill"></i>
                                            </a>
                                        </div>
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
    <div class="modal fade" id="prop_emailTemplate" tabindex="-1" role="dialog"
        aria-labelledby="prop_emailTemplateaddEditModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable" role="document">
            <div class="modal-content">
                <div class="modal-header border-bottom-0">

                    <h5 class="modal-title fw-bold" id="prop_emailTemplateAddEditModalLabel"></h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
                </div>
                <div class="modal-body">

                    <form id="prop_emailTemplateformData">
                        <input type="hidden" class='d-none' id="prop_emailTemplateimage" name="image">
                        <input type="text" class='d-none' id="prop_emailTemplateId" name="prop_emailTemplateId">
                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control reset_field" id="name" name="name" placeholder="" autocomplete="off">
                            <label for="name">Name</label>
                            <div class="invalid-feedback" id="name_error"></div>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control reset_field" id="template_key" name="template_key" placeholder="" autocomplete="off">
                            <label for="template_key">Template Key</label>
                            <div class="invalid-feedback" id="template_key_error"></div>
                        </div>
                        @foreach ($langs as $lang)
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control reset_field" id="subject_{{ $lang }}" name="subject[{{ $lang }}]" placeholder="" autocomplete="off">
                                <label for="subject">{{ __('Subject') }} ({{ strtoupper($lang) }})</label>
                                <div class="invalid-feedback" id="subject_{{ $lang }}_error"></div>
                            </div>
                            <div class="form-group mb-3">
                                <label class="form-label" for="content">{{ __('Content') }} ({{ strtoupper($lang) }})</label>
                                <textarea type="text" class="form-control reset_field" id="content_{{ $lang }}" name="content[{{ $lang }}]" autocomplete="off" placeholder="" style="min-height: 100px;"></textarea>

                                <div class="invalid-feedback" id="content_{{ $lang }}_error"></div>
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
                <div class="modal-footer border-top-0">
                    <button type="button" onclick="add_edit_prop_emailTemplate()" id="prop_emailTemplateButton"
                        class="btn btn-primary px-4 shadow-sm">Save</button>
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

        $(document).ready(function() {

            $('#exportExcel').on('click', function() {


                var table = document.querySelector('#email-table').cloneNode(true);


                $(table).find('input.emailTemplate_prop_status').each(function() {
                    var state = $(this).is(':checked') ? 'Active' : 'Inactive';
                    $(this).parent().text(
                        state);
                });


                var excludeColumnIndex = 5;


                $(table).find('thead th').eq(excludeColumnIndex).remove();


                $(table).find('tbody tr').each(function() {
                    $(this).find('td').eq(excludeColumnIndex)
                        .remove();
                });


                var workbook = XLSX.utils.table_to_book(table, {
                    sheet: "Sheet1"
                });


                XLSX.writeFile(workbook, 'email-template.xlsx');
            });
        });




        function add_prop_emailTemplate() {
            const langs = @json($langs); // Pass $langs from backend as JSON
            langs.forEach(lang => {
                const editorInstance = CKEDITOR.instances[`content_${lang}`];
                if (editorInstance) {
                    editorInstance.setData(''); // Clear the CKEditor content
                }
            });
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_emailTemplateAddEdit('Add Email Template', 'Add');
        }

        function Edit_prop_emailTemplate(id) {
            console.log(id);
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            prop_emailTemplateAddEdit('Edit Email Template', 'Update', id);
        }

        function prop_emailTemplateAddEdit(title, buttonText, id = null) {
            $('#prop_emailTemplateAddEditModalLabel').text(title);
            $('#prop_emailTemplateButton').text(buttonText);
            $('#prop_emailTemplateformData')[0].reset();
            $('#image_preview').attr('src', '').hide();
            $('#delete_image_btn').hide();
            if (id) {
                $.get(`{{ url('/management/emailTemplate-details') }}/${id}`, function(data) {
                    $('#prop_emailTemplateId').val(data[0].email_templates_id);
                    data.forEach(function(emailTemplate) {
                        $('#subject_' + emailTemplate.lang).val(emailTemplate.subject);


                        const editorInstance = CKEDITOR.instances['content_' + emailTemplate.lang];
                        if (editorInstance) {
                            editorInstance.setData(emailTemplate
                                .content); // Use CKEditor's method to set data
                        } else {
                            $('#content_' + emailTemplate.lang).val(emailTemplate
                                .content); // Fallback in case CKEditor is not initialized
                        }


                        if (emailTemplate.lang === 'en') {
                            $('#name').val(emailTemplate.name);
                            $('#template_key').val(emailTemplate.key);
                            $('#order').val(emailTemplate.order);
                            $('input[name="status"][value="' + emailTemplate.status + '"]').prop(
                                'checked', true);
                        }
                    });
                });
            }
            $('#prop_emailTemplate').modal('show');
        }

        function add_edit_prop_emailTemplate() {

            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement(); // This updates the textarea with CKEditor content
            }

            var data = $("#prop_emailTemplateformData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#prop_emailTemplateId').val() ?
                `{{ url('/management/edit-management-emailTemplate') }}` :
                `{{ url('/management/add-management-emailTemplate') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    // localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#prop_emailTemplate').modal('hide');
                    $('#prop_emailTemplateformData')[0].reset();
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



        $('.emailTemplate_prop_status').change(function() {

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
                url: `{{ url('management/emailTemplate_status') }}`,
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

        function Delete_prop_emailTemplate(id) {
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
                    url: `{{ url('management/emailTemplate-delete') }}`,
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

        $('#EmailTemplatefileUpload').change(function(event) {
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
                url: `{{ url('/management/emailTemplate-image') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log('File uploaded successfully');
                    // Optionally store the file name or URL if necessary (e.g., in a hidden input field)
                    $('#prop_emailTemplateimage').val(response
                        .fileName); // Set file name in hidden field
                    $('#image_preview').attr('src', '/' + 'emailTemplate_image/' + response.fileName)
                        .show(); // Update image preview
                    $('#delete_image_btn').show();
                },
                error: function(xhr, status, error) {
                    console.error('Error uploading file:', error);
                }
            });
        });

        function deleteUploadedImage() {
            var fileName = $('#prop_emailTemplateimage').val();
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
                url: `{{ url('/management/delete-emailTemplate-image') }}`,
                type: 'POST',
                data: {
                    file: fileName
                },
                success: function(response) {
                    console.log('File deleted successfully');
                    $('#image_preview').attr('src', '').hide();
                    $('#delete_image_btn').hide();
                    $('#prop_emailTemplateimage').val('');
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting file:', error);
                }
            });
        }
        $(document).ready(function() {
            var table = $('#email-table').DataTable({
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
                        "targets": [3, 4, 5]
                    }
                ]
            });
        });
    </script>
@endpush
