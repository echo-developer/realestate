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
                <div>Meta</div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Meta List</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>
    <style>
        /* Modern Card Styling */
        .main-card { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); background: #fff; overflow: hidden; }
        .card-header { background: #f8fafc; border-bottom: 1px solid #f1f5f9; padding: 1.25rem 1.5rem; font-size: 1.1rem; font-weight: 700; color: #1e293b; display: flex; justify-content: space-between; align-items: center; }
        .card-body { padding: 0; }
        
        /* Table Modernization */
        .table-responsive { margin: 0; }
        .table { margin-bottom: 0; }
        .table thead th { background: #f8fafc; color: #64748b; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding: 1rem 1.5rem; border-top: none; }
        .table tbody td { padding: 1.25rem 1.5rem; vertical-align: middle; color: #334155; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
        .table tbody tr:hover { background-color: #f8fafc; }
        .table tbody tr:last-child td { border-bottom: none; }
        
        /* Action Buttons */
        .action-btn-group { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .btn-action { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; border: 1px solid transparent; background: transparent; }
        .btn-action-edit { color: #3b82f6; border-color: #bfdbfe; background: #eff6ff; }
        .btn-action-edit:hover { background: #3b82f6; color: #fff; border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(59,130,246,0.2); }
        .btn-action-delete { color: #ef4444; border-color: #fecaca; background: #fef2f2; }
        .btn-action-delete:hover { background: #ef4444; color: #fff; border-color: #ef4444; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(239,68,68,0.2); }
        .btn-add-premium { border-radius: 8px; padding: 0.6rem 1.25rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-add-premium:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); }

        /* Status Pills (Custom Toggle) */
        .status-pill { cursor: pointer; display: inline-flex; align-items: center; padding: 0.35rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent; user-select: none; }
        .status-pill-active { background-color: #dcfce7; color: #166534; border-color: #bbf7d0; box-shadow: 0 2px 5px rgba(22, 101, 52, 0.1); }
        .status-pill-active::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #16a34a; margin-right: 6px; box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2); }
        .status-pill-active:hover { background-color: #bbf7d0; transform: translateY(-1px); }
        .status-pill-inactive { background-color: #fee2e2; color: #991b1b; border-color: #fecaca; }
        .status-pill-inactive::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #dc2626; margin-right: 6px; }
        .status-pill-inactive:hover { background-color: #fecaca; transform: translateY(-1px); }
        
        /* Premium Form Controls */
        .form-control, .form-select { border-radius: 8px; border: 1px solid #cbd5e1; padding: 0.65rem 0.85rem; transition: all 0.2s; box-shadow: none; font-size: 0.95rem; }
        .form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); z-index: 5; }
        .premium-label { font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.4rem; display: block; }
        
        /* Radio Button Replacements */
        .premium-radio-group { display: flex; gap: 1rem; align-items: center; }
        .premium-radio-group .form-check { padding-left: 0; margin-bottom: 0; }
        .premium-radio-group .form-check-input { display: none; }
        .premium-radio-group .form-check-label { cursor: pointer; display: inline-flex; align-items: center; padding: 0.4rem 1.25rem; border-radius: 50px; font-size: 0.9rem; font-weight: 600; border: 1px solid #cbd5e1; background: #fff; color: #64748b; transition: all 0.2s; user-select: none; }
        .premium-radio-group .form-check-input:checked + .form-check-label { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15); }
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert">

        </button>
    </div>
    @endif

    <form action="" method="get">
        <section class="content-header mb-2">
            <div class="row justify-content-end">
                <div class="col-xl-4 col-lg-6">
                    <div class="input-group">
                        <input class="form-control border-end-0" id="prop_category_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}" style="border-radius: 8px 0 0 8px;" />
                        <button type="submit" class="btn btn-primary" style="border-radius: 0 8px 8px 0; padding-left: 1.25rem; padding-right: 1.25rem;">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card">
        <div class="card-header d-flex">
            <h4>Meta List</h4>

            <div class="btn-actions-pane-right">
                <div class="btn-group" id="all-select" style="display: none;">
                    <button type="button" class="btn btn-danger btn-sm me-1 rounded" data-toggle="tooltip" title="Delete selected" id="delete-all"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-success btn-sm me-1 rounded" data-toggle="tooltip" title="Make active" id="activate-all"><i class="bi bi-check-circle"></i></button>
                    <button type="button" class="btn btn-warning btn-sm me-1 rounded text-white" data-toggle="tooltip" title="Make inactive" id="deactivate-all"><i class="bi bi-x-circle"></i></button>
                </div>
                <button type="button" id="addButton" class="btn btn-primary btn-add-premium"><i class="bi bi-plus-circle"></i> Add Meta</button>
            </div>

        </div>

        <div class="card-body">

            <div class="table-responsive" id="main_table">
                <table class="mb-0 table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select-all"></th>
                            <th>ID</th>
                            <th>Page Name</th>
                            <th>Meta Title</th>
                            <th>Meta Key</th>
                            <th>Meta Description</th>
                            <th>Status</th>
                            <th style="min-width:60px;" class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">

                        @forelse($meta as $data)
                        <tr>
                            <td><input type="checkbox" data-id="{{$data->id}}" class="select-item form-check-input"></td>
                            <td class="text-muted fw-bold">#{{$data->id}} </td>
                            <td class="fw-bold text-dark">{{$data->page_name}} </td>
                            <td>{{$data->meta_title}} </td>
                            <td><small class="text-muted">{{$data->meta_key}}</small></td>
                            <td><small class="text-muted">{{ Str::limit($data->meta_description, 50) }}</small></td>
                            <td>
                                <div class="status-pill status-pill-{{ $data->status ? 'active' : 'inactive' }} meta_status_pill" 
                                    data-id="{{ $data->id }}" 
                                    data-status="{{ $data->status }}">
                                    {{ $data->status ? 'Active' : 'Inactive' }}
                                </div>
                            </td>
                            <td>
                                <div class="action-btn-group">
                                    <button class="btn-action btn-action-edit edit" data-id="{{$data->id}}" title="Edit"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn-action btn-action-delete delete" data-id="{{$data->id}}" title="Delete"><i class="bi bi-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center">No records found</td>
                        </tr>
                        @endforelse

                    </tbody>


                </table>
            </div>

            {!! $meta->links('vendor.pagination.bootstrap-5') !!}

        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="defult-modal" tabindex="-1" role="dialog"
    aria-labelledby="addEditModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0" style="border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div class="modal-header bg-light border-bottom-0 pt-4 pb-2 px-4">

                <h5 class="modal-title fw-bold" id="AddEditModalLabel"></h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body px-4">

                <form id="formData">
                    <input type="hidden" class='d-none' id="file_name" name="file_name">
                    <input type="text" class='d-none' id="edit_id" name="edit_id">

                    <div class="mb-3">
                        <label for="page_name" class="premium-label">Page Name </label>
                        <input type="text" class="form-control reset_field" id="page_name" name="page_name" autocomplete="off">
                        <div class="invalid-feedback" id="page_name_error"></div>
                    </div>
                    <div class="mb-3">
                        <label for="meta_title" class="premium-label">Meta Title</label>
                        <input type="text" class="form-control reset_field" id="meta_title" name="meta_title" autocomplete="off">
                        <div class="invalid-feedback" id="meta_title_error"></div>
                    </div>
                    <div class="mb-3">
                        <label for="meta_key" class="premium-label">Meta Keywords</label>
                        <input type="text" class="form-control reset_field" id="meta_key" name="meta_key" autocomplete="off" placeholder="keyword1, keyword2">
                        <div class="invalid-feedback" id="meta_key_error"></div>
                    </div>
                    <div class="mb-3">
                        <label for="meta_description" class="premium-label">Meta Description</label>
                        <textarea class="form-control reset_field" id="meta_description" name="meta_description" autocomplete="off" style="min-height: 80px;"></textarea>
                        <div class="invalid-feedback" id="meta_description_error"></div>
                    </div>
                    <div class="mb-4">
                        <label for="page_type" class="premium-label">Page Selection</label>
                        <select name="page" id="page_type" class="form-select">
                            <option value="">Select Page</option>
                            @php
                            $pages = [
                            'home_page' => 'Home Page',
                            'about_us' => 'About Us',
                            'search_page' => 'Search Page',
                            ];
                            @endphp

                            @foreach ($pages as $key => $value)
                            <option value="{{ $key }}">{{ $value }}</option>
                            @endforeach
                        </select>

                        <div class="invalid-feedback" id="Page_type_error"></div>
                    </div>
                    <div class="form-group mb-0">
                        <label class="premium-label">Status</label>
                        <div class="premium-radio-group">
                            <div class="form-check">
                                <input type="radio" name="status" value="1" class="form-check-input" id="status_1" required checked>
                                <label class="form-check-label" for="status_1"><i class="bi bi-check-circle me-1"></i> Active</label>
                            </div>
                            <div class="form-check">
                                <input type="radio" name="status" value="0" class="form-check-input" id="status_2">
                                <label class="form-check-label" for="status_2"><i class="bi bi-x-circle me-1"></i> Inactive</label>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer border-top-0 px-4 pb-4 pt-2 d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-light border px-4 fw-semibold" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="saveButton" class="btn btn-primary px-5 fw-bold shadow-sm">Save</button>
            </div>
        </div>

    </div>
</div>
@endsection
@push('custom-js')
<script>
    $(document).ready(function() {
        $('#select-all').click(function() {
            $('.select-item').prop('checked', this.checked);
            toggleActionButtons();
        });
        $('.select-item').click(function() {
            toggleActionButtons();
        });
        $('#addButton').on('click', showAddModal);
        $('#saveButton').on('click', saveData);
        $('#fileUpload').on('change', fileUpload);
        $('#delete-all').on('click', deleteAll);
        $('#activate-all').on('click', activateAll);
        $('#deactivate-all').on('click', deactivateAll);
        $('.edit').on('click', editData);
        $('.delete').on('click', deleteData);
        $('.edit').on('click', editData);
        $('.meta_status_pill').click(statusUpdate);

        function toggleActionButtons() {
            if ($('.select-item:checked').length > 0) {
                $('#all-select').show();
            } else {
                $('#all-select').hide();
            }

            if ($('.select-item:checked').length === $('.select-item').length) {
                $('#select-all').prop('checked', true);
            } else {
                $('#select-all').prop('checked', false);
            }
        }

        function showAddModal() {
            $('#formData')[0].reset();
            $('#AddEditModalLabel').text('Add')
            $('#defult-modal').modal('show');
        }

        function fileUpload() {
            var formData = new FormData();
            formData.append('file', $(event.target)[0].files[0]);
            $.ajax({
                url: ``,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#image_preview').attr('src', response.fileUrl).show();
                        $('#file_name').val(response.fileName);
                        $('#delete_image_btn').show();
                    } else {
                        alert('Error uploading file');
                    }
                },
                error: function(xhr) {
                    alert('Something went wrong!');
                }
            });
        }

        function saveData() {
            let form = $('#formData')[0];
            let formData = new FormData(form);
            let id = $('#edit_id').val();
            $('.is-invalid').removeClass('is-invalid');

            if (id) {
                formData.append('_method', 'PUT');
            }

            $.ajax({
                url: id ? `{{ route('meta.update', ':id') }}`.replace(':id', id) : `{{ route('meta.store') }}`,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    $('#defult-modal').modal('hide');
                    $('#formData')[0].reset();
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload();
                },
                error: function(xhr) {
                    if (xhr.status === 422) {
                        let errors = xhr.responseJSON.errors;
                        $.each(errors, function(key, messages) {
                            let fieldId = key.replace('.', '_');
                            $('#' + fieldId).addClass('is-invalid');
                        });
                    } else {
                        console.error('Error:', xhr.responseText);
                    }
                }
            });
        }

        function editData() {
            $('#AddEditModalLabel').text('Edit')
            let id = $(this).data('id');
            $.ajax({
                url: "{{ route('meta.edit', ':id') }}".replace(':id', id),
                type: 'GET',
                success: function(response) {
                    $('#page_name').val(response.page_name);
                    $('#meta_title').val(response.meta_title);
                    $('#meta_key').val(response.meta_key);
                    $('#meta_description').val(response.meta_description);
                    $('#page_type').val(response.page);
                    $('#edit_id').val(response.id);
                    $('input[name="status"][value="' + response.status + '"]').prop('checked', true);
                    $('#defult-modal').modal('show');
                },
                error: function(xhr) {
                    console.error(xhr.responseText);
                    alert('Something went wrong while fetching data.');
                }
            });
        }

        function statusUpdate() {
            let $pill = $(this);
            let id = $pill.data('id');
            let currentStatus = $pill.data('status');
            let status = currentStatus ? 0 : 1;
            
            // Immediately update UI for snappy feedback
            $pill.data('status', status);
            if(status) {
                $pill.removeClass('status-pill-inactive').addClass('status-pill-active').text('Active');
            } else {
                $pill.removeClass('status-pill-active').addClass('status-pill-inactive').text('Inactive');
            }

            $.ajax({
                url: `{{route('meta.status')}}`.replace(':id', id),
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    status: status,
                    id: id
                },
                success: function(response) {
                    if (response.success) {
                        toastr.success(response.message);
                    } else {
                        // Revert on error
                        $pill.data('status', currentStatus);
                        if(currentStatus) {
                            $pill.removeClass('status-pill-inactive').addClass('status-pill-active').text('Active');
                        } else {
                            $pill.removeClass('status-pill-active').addClass('status-pill-inactive').text('Inactive');
                        }
                        alert('Error updating status.');
                    }
                },
                error: function(xhr) {
                    console.error('Error:', xhr.responseText);
                    // Revert on error
                    $pill.data('status', currentStatus);
                    if(currentStatus) {
                        $pill.removeClass('status-pill-inactive').addClass('status-pill-active').text('Active');
                    } else {
                        $pill.removeClass('status-pill-active').addClass('status-pill-inactive').text('Inactive');
                    }
                    alert('Something went wrong while updating status.');
                }
            });

        }

        function deleteData() {
            let id = $(this).data('id');
            if (confirm('Are you sure you want to delete this item?')) {
                $.ajax({
                    url: `{{route('meta.destroy', ':id')}}`.replace(':id', id),
                    type: 'DELETE',
                    data: {
                        _token: '{{ csrf_token() }}',
                    },
                    success: function(response) {
                        if (response.success) {
                            localStorage.setItem('successMessage', 'Item deleted successfully');
                            window.location.reload(); // Refresh the page
                        } else {
                            alert('Error deleting item.');
                        }
                    },
                    error: function(xhr) {
                        console.error('Error:', xhr.responseText);
                        alert('Something went wrong while deleting.');
                    }
                });
            }
        }

        function deleteAll() {
            let selectedIds = getSelectedIds();
            if (selectedIds.length > 0) {
                if (confirm('Are you sure you want to delete all selected items?')) {
                    $.ajax({
                        url: `{{route('meta.delete-multiple')}}`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                // Optionally handle success (refresh or remove rows)
                                localStorage.setItem('successMessage', 'Items deleted successfully');
                                window.location.reload();
                            } else {
                                alert('Error deleting items.');
                            }
                        },
                        error: function(xhr) {
                            console.error('Error:', xhr.responseText);
                            alert('Something went wrong while deleting.');
                        }
                    });
                }
            } else {
                alert('No items selected.');
            }
        }

        function activateAll() {
            let selectedIds = getSelectedIds();
            if (selectedIds.length > 0) {
                if (confirm('Are you sure you want to activate all selected items?')) {
                    $.ajax({
                        url: `{{route('meta.activate-multiple')}}`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                localStorage.setItem('successMessage', 'Items activated successfully');
                                window.location.reload();
                            } else {
                                alert('Error activating items.');
                            }
                        },
                        error: function(xhr) {
                            console.error('Error:', xhr.responseText);
                            alert('Something went wrong while activating.');
                        }
                    });
                }
            } else {
                alert('No items selected.');
            }
        }

        function deactivateAll() {
            let selectedIds = getSelectedIds(); // Assuming this function returns an array of selected IDs
            if (selectedIds.length > 0) {
                if (confirm('Are you sure you want to deactivate all selected items?')) { // Confirmation dialog
                    $.ajax({
                        url: `{{route('meta.deactivate-multiple')}}`, // Your backend route
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                // Optionally handle success (refresh or remove rows)
                                localStorage.setItem('successMessage', 'Items deactivated successfully');
                                window.location.reload(); // Reload the page to reflect the changes
                            } else {
                                alert('Error deactivating items.');
                            }
                        },
                        error: function(xhr) {
                            console.error('Error:', xhr.responseText);
                            alert('Something went wrong while deactivating.');
                        }
                    });
                }
            } else {
                alert('No items selected.');
            }
        }

        function getSelectedIds() {
            let selectedIds = [];
            $('.select-item:checked').each(function() {
                selectedIds.push($(this).data('id'));
            });
            return selectedIds;
        }
    });
</script>
@endpush