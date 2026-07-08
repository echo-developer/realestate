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
                <div>
                    <h1>Badges</h1>
                    <div class="breadcrumb">
                        <a href="{{ url('/') }}">Home</a> &gt; <span>Badges List</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div id="successMessageContainer"></div>
    
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }} alert-dismissible">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
    @endif

    <style>
/* Page & Container */
.app-main__inner { background-color: #fcfcfc; padding: 1.5rem !important; font-family: 'Inter', sans-serif; box-sizing: border-box !important; }
.page-title-wrapper { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
.page-title-heading { display: flex; align-items: center; gap: 1rem; }
.page-title-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 1.5rem; }
.page-title-heading h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-title-heading .breadcrumb { font-size: 0.85rem; color: #64748b; margin: 0; padding: 0; display: flex; gap: 0.5rem; align-items: center; }
.page-title-heading .breadcrumb a { color: #2563eb; text-decoration: none; font-weight: 500; }

/* Tabs & Search Row */
.tabs-search-row { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.search-bar-wrapper { position: relative; width: 320px; }
.search-bar-wrapper input { width: 100%; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.55rem 1rem; padding-right: 3rem; font-size: 0.85rem; color: #334155; outline: none; }
.search-bar-wrapper input:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.search-bar-wrapper button { position: absolute; right: 0; top: 0; height: 100%; background: #2563eb; color: #fff; border: none; border-radius: 0 6px 6px 0; padding: 0 1.25rem; cursor: pointer; transition: background 0.2s; }
.search-bar-wrapper button:hover { background: #1d4ed8; }

/* Main Card */
.modern-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); margin-bottom: 1.5rem; }
.modern-card-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8fafc; }
.modern-card-header h4 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
.btn-primary-custom { background: #2563eb; color: #fff; border: none; padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: background 0.2s; }
.btn-primary-custom:hover { background: #1d4ed8; }

/* Table */
.table-responsive { display: block; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.table-borderless { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 0; }
.table-borderless thead th { background-color: #f8fafc; color: #475569; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1rem !important; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #f1f5f9; text-align: left; white-space: nowrap; }
.table-borderless tbody td { padding: 0.85rem 1rem !important; vertical-align: middle; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.85rem; text-align: left; transition: background-color 0.2s ease; }
.table-borderless tbody tr:hover td { background-color: #fcfcfc; }
.table-borderless tbody tr:last-child td { border-bottom: none; }

/* Specifics for Badges */
.badge-icon-preview { width: 42px; height: 42px; border-radius: 8px; object-fit: contain; background: #f8fafc; padding: 4px; border: 1px solid #e2e8f0; }
.placeholder-icon { display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }

/* Actions */
.action-icons { display: flex; align-items: center; gap: 0.4rem; }
.action-icon { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 1.05rem; text-decoration: none; }
.action-icon.edit { color: #059669; background: #ecfdf5; }
.action-icon.edit:hover { background: #d1fae5; color: #047857; }
.action-icon.delete { color: #dc2626; background: #fef2f2; }
.action-icon.delete:hover { background: #fee2e2; color: #b91c1c; }

@media (max-width: 767px) {
    .app-main__inner { padding: 0.75rem !important; background-color: #f8fafc; }
    .page-title-heading h1 { font-size: 1.25rem; }
    .tabs-search-row { flex-direction: column; align-items: stretch; gap: 1rem; }
    .search-bar-wrapper { width: 100%; margin-bottom: 0; }
    .modern-card { background: transparent; border: none; box-shadow: none; margin-bottom: 0; }
    .modern-card-header { flex-direction: column; align-items: stretch; gap: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .modern-card-header > div { width: 100%; }
    .btn-primary-custom { width: 100%; justify-content: center; padding: 0.65rem; }
    
    /* Mobile Card Layout for Badges */
    .table-responsive { display: block; width: 100%; overflow: visible; }
    .table-borderless { display: block; width: 100%; }
    .table-borderless thead { display: none; }
    .table-borderless tbody { display: block; width: 100%; }
    
    .table-borderless tr {
        display: flex; flex-wrap: wrap; align-items: flex-start;
        background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; 
        margin-bottom: 1.25rem; padding: 1.25rem; position: relative; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .table-borderless tr:hover td { background-color: transparent !important; }
    
    .table-borderless td { display: block !important; border: none !important; padding: 0 !important; text-align: left !important; }
    .table-borderless td[colspan="6"] { width: 100% !important; text-align: center !important; padding: 2rem !important; }
    
    /* 1. Icon */
    .table-borderless td:nth-child(2) { width: 60px !important; order: 1; margin-bottom: 0.5rem; }
    /* 2. Name */
    .table-borderless td:nth-child(3) { width: calc(100% - 130px) !important; order: 2; margin-bottom: 0.5rem; padding-top: 0.5rem !important; }
    /* 3. Status */
    .table-borderless td:nth-child(5) { width: 100% !important; order: 4; margin-bottom: 1rem; }
    /* 4. Description */
    .table-borderless td:nth-child(4) { width: 100% !important; order: 5; background: #f8fafc; padding: 1rem !important; border-radius: 8px; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b; }
    
    /* 5. Action Icons */
    .table-borderless td:nth-child(6) { position: absolute; top: 1.25rem; right: 1.25rem; width: auto !important; order: 0; }
    
    /* Hide ID on mobile */
    .table-borderless td:nth-child(1) { display: none !important; }
}
    </style>

    <form action="{{ route('badges.index') }}" method="get">
        <div class="tabs-search-row justify-content-end mb-4">
            <div class="search-bar-wrapper">
                <input type="text" placeholder="Search badges..." name="term" value="{{ request('term') }}">
                <button type="submit"><i class="bi bi-search"></i></button>
            </div>
        </div>
    </form>

    <div class="modern-card">
        <div class="modern-card-header">
            <h4>Badges List</h4>
            <div class="d-flex gap-2 align-items-center">
                <div class="btn-group" id="all-select" style="display: none;">
                    <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Delete selected" id="delete-all"><i class="fa fa-trash"></i></button>
                    <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Make active" id="activate-all"><i class="fa-regular fa-thumbs-up"></i></button>
                    <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title="Make inactive" id="deactivate-all"><i class="fa-solid fa-thumbs-down"></i></button>
                </div>
                <button type="button" id="addButton" class="btn-primary-custom"><i class="fa fa-plus"></i> Add New Badge</button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive" id="main_table">
                <table class="table-borderless">
                    <thead>
                        <tr>
                            <th width="10%">ID</th>
                            <th width="10%">Icon</th>
                            <th width="20%">Name</th>
                            <th width="35%">Description</th>
                            <th width="15%">Status</th>
                            <th width="10%" class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody id="user">
                        @forelse($list as $data)
                        <tr>
                            <td><span class="text-muted fw-bold">#{{ $data->badge_id }}</span></td>

                            <!-- Display Icon -->
                            <td>
                                @if ($data->badge && $data->badge->icon)
                                <img src="{{ asset('user_upload/badges/' . $data->badge->icon) }}" alt="Icon" class="badge-icon-preview">
                                @else
                                <div class="badge-icon-preview placeholder-icon"><i class="bi bi-image text-muted"></i></div>
                                @endif
                            </td>

                            <!-- Display Name -->
                            <td><span class="fw-bold text-dark">{{ $data->name ?? 'N/A' }}</span></td>

                            <!-- Display Description -->
                            <td><span class="text-muted small">{{ $data->description ?? 'N/A' }}</span></td>

                            <!-- Status Checkbox -->
                            <td>
                                <input type="checkbox" class="status d-none" data-id="{{ $data->badge_id }}"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $data->badge->status ? 'checked' : '' }}>
                            </td>

                            <!-- Action Buttons -->
                            <td>
                                <div class="action-icons justify-content-center">
                                    <a href="javascript:void(0)" class="action-icon edit" data-id="{{ $data->badge_id }}" title="Edit">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="action-icon delete" data-id="{{ $data->badge_id }}" title="Delete">
                                        <i class="bi bi-trash3"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">No records found</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            {{--
            {!! $list->links('vendor.pagination.bootstrap-5') !!}  --}}
        </div>
    </div>
</div>
@endsection
@section('modals')
<div class="modal fade" id="defult-modal" tabindex="-1" role="dialog" aria-labelledby="addEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">

                <h5 class="modal-title" id="AddEditModalLabel"></h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="formData">
                    <input type="hidden" class="d-none" id="edit_id" name="edit_id">
                    <input type="hidden" class='d-none' id="file_name" name="file_name">
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                    <div class="mb-3">
                        <label for="name">Badge Name ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control reset_field" id="name_{{ $lang }}" name="name[{{ $lang }}]" placeholder="" autocomplete="off">
                        <div class="invalid-feedback" id="name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach
                    @foreach ($langs as $lang)
                    <div class="mb-3">
                        <label for="description">Badge Description ({{ strtoupper($lang) }})</label>
                        <textarea class="form-control reset_field" id="description_{{ $lang }}" name="description[{{ $lang }}]" rows="3" autocomplete="off"></textarea>
                        <div class="invalid-feedback" id="description_{{ $lang }}_error"></div>
                    </div>
                    @endforeach
                    <div class="mb-3">
                        <label for="badge_image">Badge Icon</label>
                        <input type="file" class="form-control reset_field" id="fileUpload" name="image" accept="image/*">
                        <div class="invalid-feedback" id="image_error"></div>
                        <div class="mt-2">
                            <img id="image_preview" src="#" alt="Image Preview" style="max-height: 150px; display: none;" />
                        </div>
                    </div>

                    <div class="form-group mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked>
                            <label class="form-check-label" for="status_1">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value="0" class="form-check-input" id="status_2">
                            <label class="form-check-label" for="status_2">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" id="saveButton" class="btn btn-primary">Save</button>
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
        $('.status').on('change', statusUpdate);

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
                url: `{{ route('badges.upload') }}`,
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
                url: id ? `{{ route('badges.update', ':id') }}`.replace(':id', id) : `{{ route('badges.store') }}`,
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
                url: "{{ route('badges.edit', ':id') }}".replace(':id', id),
                type: 'GET',
                success: function(response) {
                    $('#edit_id').val(response.data.badge_id);
                    $('input[name=status][value="' + response.data.status + '"]').prop('checked', true);

                    // Loop through the names for different languages and populate the fields
                    response.data.names.forEach(function(name) {
                        // Set the name and description based on the language
                        $('#name_' + name.lang).val(name.name);
                        $('#description_' + name.lang).val(name.description);
                    });
                    var iconPath = response.data.fileurl;
                    $('#image_preview').attr('src', iconPath).show();
                    $('#file_name').val(response.data.icon);

                    $('#defult-modal').modal('show');
                },
                error: function(xhr) {
                    console.error(xhr.responseText);
                    alert('Something went wrong while fetching data.');
                }
            });
        }

        function statusUpdate() {
            let id = $(this).data('id');
            let status = $(this).prop('checked') ? 1 : 0;


            $.ajax({
                url: `{{ route('badges.status') }}`.replace(':id', id),
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
                        alert('Error deleting item.');
                    }
                },
                error: function(xhr) {
                    console.error('Error:', xhr.responseText);
                    alert('Something went wrong while deleting.');
                }
            });

        }

        function deleteData() {
            let id = $(this).data('id');
            if (confirm('Are you sure you want to delete this item?')) {
                $.ajax({
                    url: `{{ route('badges.destroy', ':id') }}`.replace(':id', id),
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
                        url: `{{ route('badges.delete-multiple') }}`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                // Optionally handle success (refresh or remove rows)
                                localStorage.setItem('successMessage',
                                    'Items deleted successfully');
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
                        url: `{{ route('badges.activate-multiple') }}`,
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                localStorage.setItem('successMessage',
                                    'Items activated successfully');
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
                        url: `{{ route('badges.deactivate-multiple') }}`, // Your backend route
                        type: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            ids: selectedIds
                        },
                        success: function(response) {
                            if (response.success) {
                                // Optionally handle success (refresh or remove rows)
                                localStorage.setItem('successMessage',
                                    'Items deactivated successfully');
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