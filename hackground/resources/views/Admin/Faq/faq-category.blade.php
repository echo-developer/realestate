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
        </style>
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
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"></i> Category List
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add Category</button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="mb-0 table" id="myTable">
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
                                    <td>{{ $row->id }}</td>
                                    <td>{{ $row->name }}</td>
                                    <td>{{ $row->slug ?? ' ' }}</td>
                                    <td>
                                        <input data-id="{{ $row->id }}" class="status d-none" type="checkbox"
                                            data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success"
                                            data-offstyle="danger" data-size="mini" {{ $row->status ? 'checked' : '' }}>
                                    </td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md" onclick="Edit('{{ $row->id }}')"></i>
                                        <i class="fa fa-trash text-danger fa-md"
                                            onclick="Delete('{{ $row->id }}')"></i>
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
                            <input type="radio" name="status" value=1 class="magic-radio" id="status_1" checked required>
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
        $(document).ready(function () {
            var table = $('#myTable').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [[0, 'desc']],
                "columnDefs": [
                    { "orderable": true, "targets": [0] },
                    { "orderable": false, "targets": [1, 2, 3, 4] }
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
                success: function (response) {
                    if (response.success) {
                        $('#modal_action').modal('hide');
                        toastr.success(response.message);
                        setTimeout(() => location.reload(), 1200);
                    }
                },
                error: function (xhr) {
                    const errors = xhr.responseJSON.errors;
                    $('.invalid-feedback').hide();
                    $('.form-control').removeClass('is-invalid');

                    if (errors) {
                        $.each(errors, function (key, messages) {
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
        $('.status').change(function () {
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
                url: `{{ url('/status/faq/category') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function (data) {
                },
                error: function (msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
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
                    success: function (response) {
                        toastr.success(response.message);
                        setTimeout(() => location.reload(), 1200);
                    },
                    error: function () {
                        toastr.error('Failed to delete category.');
                    }
                });
            }
        }
    </script>
@endpush
