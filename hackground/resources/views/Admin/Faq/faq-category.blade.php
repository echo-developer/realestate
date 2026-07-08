@extends('Admin.layouts.app')

@section('content')
    <div class="app-main__inner">
        <div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i></div>
                    <div>FAQ
                        <div class="page-title-subheading">Faq > Faq Category</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active">Category List</li>
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
            /* Modern Table & Mobile Card Design */
            .table-borderless { border-collapse: separate; border-spacing: 0; width: 100%; margin-bottom: 0; }
            .table-borderless thead th { background-color: #f8fafc; color: #1e293b; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-top: none; padding: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
            .table-borderless tbody td { vertical-align: middle; border-bottom: 1px solid #e2e8f0 !important; border-top: none; padding: 1.25rem 1rem; color: #475569; }
            .table-borderless tbody tr:hover { background-color: #f8fafc; }
            
            /* Status Pill Toggle */
            .status-pill-toggle { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 1rem; border-radius: 50px; font-weight: 600; font-size: 0.8rem; cursor: pointer; user-select: none; transition: all 0.2s; border: 1px solid transparent; margin: 0; }
            .status-pill-toggle.active { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
            .status-pill-toggle.active .dot { background: #059669; }
            .status-pill-toggle.inactive { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
            .status-pill-toggle.inactive .dot { background: #dc2626; }
            .status-pill-toggle .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; transition: all 0.2s; }
            
            /* Outline Action Icons */
            .action-icons { display: flex; align-items: center; gap: 0.5rem; justify-content: flex-end; }
            .action-icon { width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.1rem; text-decoration: none; cursor: pointer; }
            .action-icon.outline.edit { color: #3b82f6; background: #fff; border: 1px solid #bfdbfe; }
            .action-icon.outline.edit:hover { background: #eff6ff; }
            .action-icon.outline.delete { color: #ef4444; background: #fff; border: 1px solid #fecaca; }
            .action-icon.outline.delete:hover { background: #fef2f2; }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .table-borderless thead { display: none; }
                .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; padding: 0; }
                .table-borderless tbody td { border: none !important; padding: 1rem 1.25rem !important; display: block; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; }
                .table-borderless tbody td:last-child { border-bottom: none !important; }
                
                /* Mobile Labels */
                .table-borderless tbody td::before { content: attr(data-label); display: block; font-weight: 700; color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px; }
                
                /* Status & Action layout for mobile */
                .table-borderless tbody td[data-label="Status"],
                .table-borderless tbody td[data-label="Action"] { display: flex; justify-content: space-between; align-items: center; }
                .table-borderless tbody td[data-label="Status"]::before,
                .table-borderless tbody td[data-label="Action"]::before { margin-bottom: 0; }
            }
        </style>
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        <form action="{{ url('/faq-category') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_transaction_search" placeholder="Search..." name="term"
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
                <div class="card-header d-flex">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"></i> Category List
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add Category</button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="mb-0 table table-borderless" id="myTable">
                        <thead>
                            <tr>
                                <th style="width: 10%">ID</th>
                                <th style="width: 25%">Name</th>
                                <th style="width: 30%">Slug</th>
                                <th style="width: 20%">Status</th>
                                <th style="width: 15%" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data as $row)
                                    <tr>
                                        <td data-label="ID" class="fw-medium text-muted">#{{ $row->id }}</td>
                                        <td data-label="Name" class="fw-bold text-dark">{{ $row->name }}</td>
                                        <td data-label="Slug" class="text-muted">{{ $row->slug ?? ' ' }}</td>
                                        <td data-label="Status">
                                            <label class="status-pill-toggle {{ $row->status ? 'active' : 'inactive' }}">
                                                <input data-id="{{ $row->id }}" class="status-checkbox d-none" type="checkbox" {{ $row->status ? 'checked' : '' }}>
                                                <span class="dot"></span> <span class="status-text">{{ $row->status ? 'Active' : 'Inactive' }}</span>
                                            </label>
                                        </td>
                                        <td data-label="Action" class="text-right">
                                            <div class="action-icons">
                                                <a onclick="Edit('{{ $row->id }}')" class="action-icon outline edit">
                                                    <i class="bi bi-pencil"></i>
                                                </a>
                                                <a onclick="Delete('{{ $row->id }}')" class="action-icon outline delete">
                                                    <i class="bi bi-trash3"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
@endsection

@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <form id="formData" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="AddEditModalLabel">Add/Edit Category</h5>
                    <button type="button" class="close" data-bs-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="categoryID" name="categoryID">
                    @php
                        $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                        <div class="form-group">
                            <label for="name_{{ $lang }}">Name ({{ strtoupper($lang) }})</label>
                            <input type="text" class="form-control" id="name_{{ $lang }}"
                                name="name[{{ $lang }}]" onkeyup="generateSlug()">
                            <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                        </div>
                    @endforeach
                    <div class="form-group">
                        <label for="slug">Slug</label>
                        <input type="text" class="form-control" id="slug" name="slug">
                        <div class="invalid-feedback" id="slug_error"></div>
                    </div>

                    <div class="form-group">
                        <label for="order">Order</label>
                        <input type="number" class="form-control" id="order" name="order">
                        <div class="invalid-feedback" id="order_error"></div>
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" id="button" class="btn btn-primary" onclick="add_edit()">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {
            var table = $('#myTable').DataTable({
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
                        "targets": [1, 2, 3, 4]
                    }
                ]
            });
        });

        function generateSlug() {
            const name = $('#name_en').val();
            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
            $('#slug').val(slug);
        }

        function add() {
            $('#formData')[0].reset();
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').hide();
            $('#categoryID').val('');
            $('#AddEditModalLabel').text('Add Category');
            $('#button').text('Add');
            $('#slug').prop('readonly', false); // Slug editable on add
            $('#modal_action').modal('show');
        }

        function Edit(id) {
            $.get(`{{ route('category_details', ':id') }}`.replace(':id', id), function(data) {
                $('#categoryID').val(data.id);
                $('#name_en').val(data.name.en);
                $('#name_ar').val(data.name.ar);
                $('#slug').val(data.slug);
                $('#slug').prop('readonly', true); // Slug read-only on edit
                $('#order').val(data.order);
                $('input[name="status"][value="' + data.status + '"]').prop('checked', true);

                $('#AddEditModalLabel').text('Edit Category');
                $('#button').text('Update');

                $('.form-control').removeClass('is-invalid');
                $('.invalid-feedback').hide();

                $('#modal_action').modal('show');
            });
        }

        function add_edit() {
            const formData = $('#formData').serializeArray();
            const isUpdate = $('#categoryID').val() !== '';

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            const url = isUpdate ? `{{ route('update_faqcategory') }}` : `{{ route('submit_Category') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                success: function(response) {
                    if (response.success) {
                        $('#modal_action').modal('hide');
                        // toastr.success(response.message);
                        // setTimeout(() => location.reload(), 1200);
                    }
                },
                error: function(xhr) {
                    const errors = xhr.responseJSON.errors;
                    $('.invalid-feedback').hide();
                    $('.form-control').removeClass('is-invalid');

                    if (errors) {
                        $.each(errors, function(key, messages) {
                            const fieldId = key.replace(/\./g, '_');
                            const input = $(`#${fieldId}`);
                            const error = $(`#${fieldId}_error`);

                            if (input.length && error.length) {
                                input.addClass('is-invalid');
                                error.text(messages[0]).show();
                            }
                        });
                    }
                }
            });
        }

        $('.status-checkbox').on('change', function() {
            var status = $(this).prop('checked') == true ? 1 : 0;
            var id = $(this).attr('data-id');
            
            // Visual Pill update
            let label = $(this).closest('.status-pill-toggle');
            let text = label.find('.status-text');
            if(this.checked) {
                label.removeClass('inactive').addClass('active');
                text.text('Active');
            } else {
                label.removeClass('active').addClass('inactive');
                text.text('Inactive');
            }
            
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "{{ url('/faq-category-status') }}",
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    toastr.success(data.message, 'Request Status', toastrOptions);
                }
            });
        });

        function Delete(id) {
            if (confirm('Are you sure you want to delete this category?')) {
                $.ajax({
                    type: 'POST',
                    url: '{{ route('categoryDelete') }}',
                    data: {
                        id: id,
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(response) {
                        // toastr.success(response.message);
                        // setTimeout(() => location.reload(), 1200);
                    },
                    error: function() {
                        toastr.error('Failed to delete category.');
                    }
                });
            }
        }
    </script>
@endpush
