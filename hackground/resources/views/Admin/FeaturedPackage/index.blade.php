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
                    <i class="bi bi-star-fill text-warning"></i>
                </div>
                <div>Featured Packages
                    <div class="page-title-subheading">Featured Packages <i class="bi bi-chevron-right"></i> All Featured Package List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                    <li class="breadcrumb-item active">Featured Packages</li>
                </ol>
            </div>
        </div>
    </div>

    <div id="successMessageContainer"></div>

    <div class="main-card mb-3 card">
        <div class="card-header d-flex align-items-center">
            <h4 class="mb-0">Featured Packages</h4>
            <div class="btn-actions-pane-right ms-auto">
                <button type="button" class="btn btn-primary btn-sm" id="addPackageBtn">
                    <i class="bi bi-plus-circle me-1"></i> Add Package
                </button>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover align-middle" id="featuredPackageTable">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Package Name</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th class="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($packages as $index => $pkg)
                        <tr>
                            <td>{{ $packages->firstItem() + $index }}</td>
                            <td>
                                <strong>{{ $pkg->name }}</strong>
                            </td>
                            <td>
                                <span class="badge bg-success fs-6">{{ get_setting('site-currency') }}{{ number_format($pkg->price, 2) }}</span>
                            </td>
                            <td>{{ $pkg->duration_days }} days</td>
                            <td class="text-muted" style="max-width:200px;">
                                <small>{{ $pkg->description ?? '—' }}</small>
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    class="featuredPkgStatus d-none"
                                    data-id="{{ $pkg->id }}"
                                    data-toggle="toggle"
                                    data-on="Active"
                                    data-off="Inactive"
                                    data-onstyle="success"
                                    data-offstyle="danger"
                                    data-size="mini"
                                    {{ $pkg->status == 1 ? 'checked' : '' }}
                                >
                            </td>
                            <td class="text-end">
                                <a href="javascript:void(0)" class="me-2" title="Edit">
                                    <i class="bi bi-pencil-fill text-success editPackageBtn" data-id="{{ $pkg->id }}"></i>
                                </a>
                                <a href="javascript:void(0)" title="Delete">
                                    <i class="bi bi-trash3-fill text-danger deletePackageBtn" data-id="{{ $pkg->id }}"></i>
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="8" class="text-center text-muted py-4">
                                <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                                No featured packages found. Create your first one!
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            {{ $packages->links('vendor.pagination.bootstrap-5') }}
        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="featuredPackageModal" tabindex="-1" aria-labelledby="featuredPackageModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="featuredPackageModalLabel">Add Featured Package</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="featuredPackageForm" novalidate>
                    <input type="hidden" id="pkgId" name="id">

                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="pkg_name" name="name" placeholder="Package Name" required maxlength="100">
                        <label for="pkg_name">Package Name <span class="text-danger">*</span></label>
                        <div class="invalid-feedback" id="pkg_name_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        <textarea class="form-control" id="pkg_description" name="description" placeholder="Description" style="height:90px" maxlength="500"></textarea>
                        <label for="pkg_description">Description</label>
                        <div class="invalid-feedback" id="pkg_description_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="pkg_price" name="price" placeholder="Price" required min="0" step="0.01">
                        <label for="pkg_price">Price ({{ get_setting('site-currency') }}) <span class="text-danger">*</span></label>
                        <div class="invalid-feedback" id="pkg_price_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" id="pkg_duration_days" name="duration_days" placeholder="Duration" required min="1">
                        <label for="pkg_duration_days">Duration (Days) <span class="text-danger">*</span></label>
                        <div class="invalid-feedback" id="pkg_duration_days_error"></div>
                    </div>

                    <div class="form-group mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value="1" class="form-check-input" id="status_active" checked>
                            <label class="form-check-label" for="status_active">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" name="status" value="0" class="form-check-input" id="status_inactive">
                            <label class="form-check-label" for="status_inactive">Inactive</label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="savePkgBtn">Save</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
$(document).ready(function () {
    const modal = new bootstrap.Modal($('#featuredPackageModal')[0]);
    const form  = $('#featuredPackageForm');

    // --- ADD ---
    $('#addPackageBtn').on('click', function () {
        resetForm();
        $('#featuredPackageModalLabel').text('Add Featured Package');
        $('#savePkgBtn').text('Add');
        modal.show();
    });

    // --- EDIT ---
    $(document).on('click', '.editPackageBtn', function () {
        const id = $(this).data('id');
        resetForm();
        $('#featuredPackageModalLabel').text('Edit Featured Package');
        $('#savePkgBtn').text('Update');

        $.get(`{{ route('featured-package.edit', ':id') }}`.replace(':id', id))
            .done(function (res) {
                if (res.success) {
                    const d = res.data;
                    $('#pkgId').val(d.id);
                    $('#pkg_name').val(d.name);
                    $('#pkg_description').val(d.description);
                    $('#pkg_price').val(d.price);
                    $('#pkg_duration_days').val(d.duration_days);
                    $('#pkg_properties_count').val(d.properties_count);
                    $(`input[name="status"][value="${d.status}"]`).prop('checked', true);
                    modal.show();
                }
            });
    });

    // --- SAVE ---
    $('#savePkgBtn').on('click', function () {
        const btn = $(this);
        btn.prop('disabled', true).text('Saving...');

        const pkgId = $('#pkgId').val();
        const url = pkgId
            ? '{{ route('featured-package.update') }}'
            : '{{ route('featured-package.store') }}';

        $.ajax({
            url: url,
            type: 'POST',
            data: new FormData(form[0]),
            processData: false,
            contentType: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (res) {
                if (res.success) {
                    modal.hide();
                    toastr.success(res.message, 'Success', toastrOptions);
                    setTimeout(() => location.reload(), 1000);
                }
            },
            error: function (xhr) {
                const errors = xhr.responseJSON?.errors ?? {};
                handleErrors(errors);
                btn.prop('disabled', false).text(pkgId ? 'Update' : 'Add');
            },
            complete: function () {
                btn.prop('disabled', false);
            }
        });
    });

    // --- DELETE ---
    $(document).on('click', '.deletePackageBtn', function () {
        const id = $(this).data('id');
        common_delete_confirm(function () {
            $.ajax({
                url: '{{ route('featured-package.destroy') }}',
                type: 'DELETE',
                data: { id },
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success: function (res) {
                    if (res.success) {
                        toastr.success(res.message, 'Deleted', toastrOptions);
                        setTimeout(() => location.reload(), 1000);
                    }
                }
            });
        }, 'Delete Package?', 'Are you sure you want to delete this featured package?');
    });

    // --- STATUS TOGGLE ---
    $(document).on('change', '.featuredPkgStatus', function () {
        const id     = $(this).data('id');
        const status = this.checked ? 1 : 0;
        $.ajax({
            url: '{{ route('featured-package.status') }}',
            type: 'POST',
            data: { id, status },
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function (res) {
                toastr.success(res.message, 'Status', toastrOptions);
            }
        });
    });

    function resetForm() {
        form[0].reset();
        $('#pkgId').val('');
        $('.invalid-feedback').text('').hide();
        $('.form-control').removeClass('is-invalid');
        $('input[name="status"][value="1"]').prop('checked', true);
    }

    function handleErrors(errors) {
        $('.invalid-feedback').text('').hide();
        $('.form-control').removeClass('is-invalid');
        Object.entries(errors).forEach(([field, msgs]) => {
            const safeField = field.replace(/\./g, '_');
            $(`#pkg_${safeField}`).addClass('is-invalid');
            $(`#pkg_${safeField}_error`).text(msgs[0]).show();
        });
    }
});
</script>
@endpush
