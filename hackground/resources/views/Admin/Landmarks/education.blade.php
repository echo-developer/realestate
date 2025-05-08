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
                    <div>Education</div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Education List</li>
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
            <div class="alert alert-{{ session('message_type') }} alert-dismissible">
                {{ session('success_msg') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        @if ($errors->has('xlsFileEducation'))
            <div class="alert alert-danger alert-dismissible mt-2">
                {{ $errors->first('xlsFileEducation') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert">

                </button>
            </div>
        @endif
        <form action="{{ route('education.index') }}" method="get">
            <section class="content-header mb-2">
                <div class="row justify-content-end">
                    <div class="col-xl-4 col-lg-6">
                        <div class="input-group">
                            <input class="form-control" id="" placeholder="Search..." name="term"
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

        <div class="main-card mb-3 card">
            <div class="card-header d-flex">
                <h4>Education List</h4>

                <div class="btn-actions-pane-right">
                    <div class="btn-group" id="all-select" style="display: none;">
                        <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                            id="delete-all" data-original-title="Delete selected"><i class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                            id="activate-all" data-original-title="Make active"><i class="fa-regular fa-thumbs-up"></i>
                            <button type="button" class="btn btn-default btn-sm" data-toggle="tooltip" title=""
                                id="deactivate-all" data-original-title="Make inactive"><i
                                    class="fa-solid fa-thumbs-down"></i></button>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary me-2" id="upload_excel_btn">Upload Excel</button>
                    <button type="button" id="addButton" class="btn btn-sm btn-primary">Add</button>
                </div>

            </div>

            <div class="card-body">

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">ID</th>
                                <th style="width: 220px;">Name</th>
                                <th style="width: 120px;">Latitude</th>
                                <th style="width: 150px;">Longitude</th>
                                <th style="width: 240px;">Status</th>
                                <th style="width: 100px;" class="text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody id="user">

                            @forelse($list as $data)
                                <tr>
                                    <!-- <td><input type="checkbox" data-id="{{ $data->id }}" class="select-item"></td> -->
                                    <td>{{ $data->id }} </td>
                                    <td>{{ $data->name ?? 'N/A' }} </td>
                                    <td>{{ $data->lat ?? 'N/A' }} </td>
                                    <td>{{ $data->long ?? 'N/A' }} </td>
                                    @if (!empty($data->lat) && !empty($data->long))
                                        <td>
                                            <input type="checkbox" class="status d-none" data-id="{{ $data->id }}"
                                                data-toggle="toggle" data-on="Active" data-off="Inactive"
                                                data-onstyle="success" data-offstyle="danger" data-size="mini"
                                                {{ $data->status ? 'checked' : '' }}>
                                        </td>
                                    @else
                                        <td>
                                            <span class="text-warning">
                                                <i class="fas fa-info-circle me-1"></i> <small>Add latitude & longitude to
                                                    approve</small>
                                            </span>
                                        </td>
                                    @endif
                                    <td class="text-right">
                                        <a href="javascript:void(0)" class="me-2 edit" data-id="{{ $data->id }}"><i
                                                class="bi bi-pencil-square text-success fa-md "></i></a>
                                        <a href="javascript:void(0)" class="delete" data-id="{{ $data->id }}"><i
                                                class="bi bi-trash3-fill text-danger fa-md"></i></a>
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

                {!! $list->links('vendor.pagination.bootstrap-5') !!}
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
                        <input type="hidden" class='d-none' id="file_name" name="file_name">
                        <input type="text" class='d-none' id="edit_id" name="edit_id">

                        <div class="mb-3">
                            <label for="page_name"> Name </label>
                            <input type="text" class="form-control reset_field" id="name" name="name"
                                autocomplete="off">
                            <div class="invalid-feedback" id="name_error"></div>
                        </div>

                        <div class="mb-3">
                            <label for="latitude">Latitude</label>
                            <input type="text" class="form-control reset_field" id="latitude" name="latitude"
                                autocomplete="off">
                            <div class="invalid-feedback" id="latitude_error"></div>
                        </div>

                        <div class="mb-3">
                            <label for="longitude">Longitude</label>
                            <input type="text" class="form-control reset_field" id="longitude" name="longitude"
                                autocomplete="off">
                            <div class="invalid-feedback" id="longitude_error"></div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="form-label d-block">Status</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" name="status" value=1 class="form-check-input" id="status_1"
                                    checked required>
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
                    <button type="button" id="saveButton" class="btn btn-primary">Save</button>
                </div>
            </div>

        </div>
    </div>

    <div class="modal fade" id="excel_upload_modal" tabindex="-1" role="dialog" aria-labelledby="excel_upload_modal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">

                    <h5 class="modal-title" id="excel_upload_modal">Upload</h5>

                    <button type="button" class="btn-close" data-bs-dismiss="modal">

                    </button>
                </div>
                <form id="excel_upload_form" action="{{ route('education.import-excel') }}" method="POST"
                    enctype="multipart/form-data">
                    <div class="modal-body">
                        @csrf
                        <input type="file" class="form-control" name="xlsFileEducation">
                        <i class="d-block text-danger mt-2">Allowed file types: xlsx | xls | csv</i>
                        <div class="mt-3 p-3 bg-light border border-danger rounded">
                            <strong class="text-danger d-block mb-2">

                                Note: Download the file format below. Changing or re-ordering the column names can
                                affect your data.
                            </strong>
                            <a href="{{ asset(config('constants.EDUCATION_EXCEL_FORMAT')) }}"
                                class="btn btn-sm btn-outline-primary">Download XLSX Format</a>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" id="button" class="btn btn-primary">Save</button>
                    </div>
                </form>

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

            let xlModal = $('#excel_upload_modal')
            let uploadExcelButton = $('#upload_excel_btn')

            uploadExcelButton.on('click', function() {
                xlModal.modal('show') // Bootstrap modal way
            })

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
                    url: id ? `{{ route('education.update', ':id') }}`.replace(':id', id) :
                        `{{ route('education.store') }}`,
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
                    url: "{{ route('education.edit', ':id') }}".replace(':id', id),
                    type: 'GET',
                    success: function(response) {
                        $('#edit_id').val(response.id);
                        $('#name').val(response.name);
                        $('#latitude').val(response.lat);
                        $('#longitude').val(response.long);
                        $('input[name=status][value="' + response.status + '"]').prop('checked',
                            true);
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
                    url: `{{ route('education.status') }}`.replace(':id', id),
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
                        url: `{{ route('education.destroy', ':id') }}`.replace(':id', id),
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
                            url: `{{ route('education.delete-multiple') }}`,
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
                            url: `{{ route('education.activate-multiple') }}`,
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
                            url: `{{ route('education.deactivate-multiple') }}`, // Your backend route
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
