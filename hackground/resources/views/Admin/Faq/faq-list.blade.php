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
                    <div>Faq List
                        <div class="page-title-subheading">Faq &gt; Faq List </div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Faq List</li>
                    </ol>
                </div>
            </div>
        </div>
        <style>
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
                <button type="button" class="close" onclick="$(this).parent().hide();">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        @endif
        <form action="{{ url('/faq-list-category') }}" method="get">
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
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"></i> Faq List
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add Faq List</button>
                    </div>
                </div>
                <div class="table-responsive" id="main_table">
                    <table id="faqListTable" class="mb-0 table table-borderless">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Faq Category</th>
                                <th>Status</th>
                                <th class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data as $item)
                                <tr>
                                    <td data-label="ID" class="fw-medium text-muted">#{{ $item->id }}</td>
                                    <td data-label="Question" class="fw-bold text-dark">{{ $item->question ?? '' }}</td>
                                    <td data-label="Faq Category">
                                        <span class="badge bg-primary-subtle text-primary rounded-pill">{{ get_name_by_id('faq_categories_names', 'category_id', $item->faq_category_id, 'en') ?? '' }}</span>
                                    </td>
                                    <td data-label="Status">
                                        <label class="status-pill-toggle {{ $item->status ? 'active' : 'inactive' }}">
                                            <input data-id="{{ $item->id }}" class="status-checkbox d-none" type="checkbox" {{ $item->status ? 'checked' : '' }}>
                                            <span class="dot"></span> <span class="status-text">{{ $item->status ? 'Active' : 'Inactive' }}</span>
                                        </label>
                                    </td>
                                    <td data-label="Action" class="text-right">
                                        <div class="action-icons">
                                            <a onclick="Edit('{{ $item->id }}')" class="action-icon outline edit">
                                                <i class="bi bi-pencil"></i>
                                            </a>
                                            <a onclick="Delete('{{ $item->id }}')" class="action-icon outline delete">
                                                <i class="bi bi-trash3"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                            @if (empty($data))
                                <tr>
                                    <td colspan="5">Sorry, no records found!</td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                    {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="AddEditModalLabel"></h5>
                    <button type="button" class="close" onclick="$('#modal_action').modal('hide')" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="formData">
                        <input type="hidden" id="id" name="id">
                        <div class="form-group">
                            <label for="category_id">Faq Category</label>
                            <select name="faq_category_id" id="faq_category_id" class="form-select" required>
                                <option value="">Select Category</option>
                                @foreach ($categories ?? [] as $category)
                                    <option value="{{ $category->category_id }}">{{ $category->name }}</option>
                                @endforeach
                            </select>
                            <div class="invalid-feedback" id="category_id_error"></div>
                        </div>
                        @php
                            $langs = explode(',', admin_default_lang());
                        @endphp
                        @foreach ($langs as $lang)
                            <div class="form-group">
                                <label for="question_{{ $lang }}">Question ({{ strtoupper($lang) }})</label>
                                <input type="text" class="form-control  reset_field"
                                    id="question_{{ $lang }}" name="question[{{ $lang }}]">
                                <div class="invalid-feedback" id="question_{{ $lang }}_error"></div>
                            </div>
                            <div class="form-group">
                                <label for="answer_{{ $lang }}">Answer ({{ strtoupper($lang) }})</label>
                                <textarea class="form-control" id="answer_{{ $lang }}" name="answer[{{ $lang }}]" rows="4"></textarea>
                                <div class="invalid-feedback" id="answer_{{ $lang }}_error"></div>
                            </div>
                        @endforeach
                        <div class="form-group">
                            <label for="order">Order</label>
                            <input type="number" class="form-control" id="order" name="order">
                            <div class="invalid-feedback" id="order_error"></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Status</label><br>
                            <div class="radio-inline">
                                <input type="radio" name="status" value="1" class="magic-radio" id="status_1"
                                    checked>
                                <label for="status_1">Active</label>
                                <input type="radio" name="status" value="0" class="magic-radio" id="status_2">
                                <label for="status_2">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        onclick="$('#modal_action').modal('hide')">Close</button>
                    <button type="button" onclick="add_edit()" id="button" class="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    </div>
    <style>
        .modal-backdrop {
            z-index: 1040 !important;
        }

        .modal-content {
            z-index: 1050 !important;
        }
    </style>
@endsection
@push('custom-js')
    {{-- <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script> --}}
    <script>
        $(document).ready(function() {
            var table = $('#faqListTable').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [0, 'desc']
                ],
                "columnDefs": [{
                        "orderable": true,
                        "targets": [1]
                    },
                    {
                        "orderable": false,
                        "targets": [2, 3, 4]
                    }
                ]
            });
            let $formData = $('#formData');
            let $modalAction = $('#modal_action');
            let $id = $('#id');
            let $order = $('#order');
            let $button = $('#button');
            let $modalLabel = $('#AddEditModalLabel');
            let $categoryId = $('#faq_category_id');
            const langs = @json($langs);

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            langs.forEach(lang => {
                CKEDITOR.replace(`answer_${lang}`);
            });
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
                
                toastr.success('Request processed successfully.', 'Request Status');
                $.post(`{{ route('list_status') }}`, {
                    status: status,
                    id: id
                });
            });
            langs.forEach(lang => {
                if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[`answer_${lang}`]) {
                    CKEDITOR.instances[`answer_${lang}`].destroy();
                }
                CKEDITOR.replace(`answer_${lang}`);
            });

            function AddEdit(title, buttonText, id = null) {
                $modalLabel.text(title);
                $button.text(buttonText);
                $formData[0].reset();
                $categoryId.val('');
                $id.val('');

                langs.forEach(lang => {
                    $(`#question_${lang}`).val('');
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[`answer_${lang}`]) {
                        CKEDITOR.instances[`answer_${lang}`].setData('');
                    }
                });
                $order.val('');
                $('.form-control').removeClass('is-invalid');
                $('.invalid-feedback').empty();
                if (id) {
                    $.ajax({
                        url: `{{ url('/faq/list/details') }}/${id}`,
                        type: 'GET',
                        dataType: 'json',
                        success: function(data) {
                            if (data) {
                                $id.val(data.id);
                                $categoryId.val(data.faq_category_id);
                                $order.val(data.order);
                                $(`input[name="status"][value="${data.status}"]`).prop('checked', data
                                    .status === 1);

                                langs.forEach(lang => {
                                    $(`#question_${lang}`).val(data.question[lang] || '');
                                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[
                                            `answer_${lang}`]) {
                                        CKEDITOR.instances[`answer_${lang}`].setData(data
                                            .answer[lang] || '');
                                    }
                                });

                                $modalAction.modal('show');
                            } else {
                                toastr.error('FAQ details not found.', 'Error');
                            }
                        },
                        error: function(xhr) {
                            toastr.error('Failed to fetch FAQ details.', 'Error');
                            console.error(xhr.responseText);
                        }
                    });
                } else {
                    $modalAction.modal('show');
                }
            }
            window.add = function() {
                AddEdit('Add Faq', 'Add');
            };
            window.Edit = function(id) {
                AddEdit('Edit Faq', 'Update', id);
            };
            window.Delete = function(id) {
                if (confirm('Are you sure to delete this Faq List?')) {
                    $.post(`{{ route('list_delete') }}`, {
                        id: id
                    }, function() {
                        toastr.success('Faq deleted successfully!', 'Deleted');
                        location.reload();
                    }).fail(function(error) {
                        toastr.error('Failed to delete FAQ.', 'Error');
                        console.error(error);
                    });
                }
            };
            window.add_edit = function() {
                langs.forEach(lang => {
                    if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances[`answer_${lang}`]) {
                        CKEDITOR.instances[`answer_${lang}`].updateElement();
                    }
                });

                const data = $formData.serializeArray();
                const url = $id.val() ? `{{ route('update_list') }}` : `{{ route('list_submit') }}`;
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: function(response) {
                        window.location.reload(true);
                        $modalAction.modal('hide');
                        $formData[0].reset();
                    },
                    error: function(xhr) {
                        if (xhr.responseJSON && xhr.responseJSON.errors) {
                            const errors = xhr.responseJSON.errors;
                            $('.invalid-feedback').text('').hide();
                            $('.form-control').removeClass('is-invalid');
                            $.each(errors, function(field, messages) {
                                const fieldId = field.replace('.', '_');
                                $(`#${fieldId}`).addClass('is-invalid');
                                $(`#${fieldId}_error`).text(messages[0]).show();
                            });
                        } else {
                            toastr.error('An unexpected error occurred.', 'Error');
                            console.error(xhr.responseText);
                        }
                    }
                });
            };
        });
    </script>
@endpush
