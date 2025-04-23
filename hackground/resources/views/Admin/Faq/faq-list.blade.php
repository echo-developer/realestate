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
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"></i> Faq List
                    <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add()">Add Faq List</button>
                    </div>
                </div>
                <div class="table-responsive" id="main_table">
                    <table id="faqListTable" class="mb-0 table">
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
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->question ?? '' }}</td>
                                    <td>
                                        {{ get_name_by_id('faq_categories_names', 'category_id', $item->faq_category_id, 'en') ?? '' }}
                                    </td>

                                    <td>
                                        <input data-id="{{ $item->id }}" class="status d-none" type="checkbox"
                                            data-toggle="toggle" data-on="Active" data-off="Inactive" data-onstyle="success"
                                            data-offstyle="danger" data-size="mini" {{ $item->status ? 'checked' : '' }}>
                                    </td>
                                    <td class="text-right">
                                        <i class="fa fa-edit text-success fa-md" onclick="Edit('{{ $item->id }}')"></i>
                                        <i class="fa fa-trash text-danger fa-md"
                                            onclick="Delete('{{ $item->id }}')"></i>
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
                    <div class="d-flex justify-content-center mt-4">
                        <div class="pagination-wrapper">
                            {{ $data->links() }}
                        </div>
                    </div>
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
                            <select name="faq_category_id" id="faq_category_id" class="form-control" required>
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
            $('.status').change(function() {
                toastr.success('Request processed successfully.', 'Request Status');
                const id = $(this).data('id');
                const status = this.checked ? 1 : 0;
                $.post(`{{ route('list_status') }}`, {
                    status,
                    id
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
                        localStorage.setItem('successMessage', response.message);
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
