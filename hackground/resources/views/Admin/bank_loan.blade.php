@extends('Admin.layouts.app')
{{-- @dd($users ) --}}

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
                    <i class="bi bi-bank icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>
                    <h1>Bank Loan</h1>
                    <div class="breadcrumb">
                        <a href="{{ url('/') }}">Home</a> &gt; <span>Bank Loan List</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>

    <style>
/* Page & Container */
.app-main__inner { background-color: #fcfcfc; padding: 1.5rem !important; font-family: 'Inter', sans-serif; box-sizing: border-box !important; }
.page-title-wrapper { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
.page-title-heading { display: flex; align-items: center; gap: 1rem; }
.page-title-icon { width: 48px; height: 48px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 1.5rem; }
.page-title-heading h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
.page-title-heading .breadcrumb { font-size: 0.85rem; color: #64748b; margin: 0; padding: 0; display: flex; gap: 0.5rem; align-items: center; }
.page-title-heading .breadcrumb a { color: #2563eb; text-decoration: none; font-weight: 500; }

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

/* Specifics */
.badge-icon-preview { height: 42px; border-radius: 8px; object-fit: contain; background: #fff; padding: 2px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }

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
    .modern-card { background: transparent; border: none; box-shadow: none; margin-bottom: 0; }
    .modern-card-header { flex-direction: column; align-items: stretch; gap: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
    .btn-primary-custom { width: 100%; justify-content: center; padding: 0.65rem; }
    
    /* Mobile Card Layout */
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
    
    /* 1. Logo */
    .table-borderless td:nth-child(2) { width: auto !important; order: 1; margin-bottom: 0.75rem; margin-right: 1rem; }
    /* 2. Bank Name */
    .table-borderless td:nth-child(3) { width: calc(100% - 130px) !important; order: 2; margin-bottom: 0.75rem; padding-top: 0.5rem !important; }
    /* 3. Status */
    .table-borderless td:nth-child(6) { width: 100% !important; order: 3; margin-bottom: 1rem; }
    /* 4. Interest & Fees Container */
    .table-borderless td:nth-child(4) { width: 50% !important; order: 4; background: #f8fafc; padding: 0.75rem !important; border-radius: 8px 0 0 8px; border: 1px solid #f1f5f9; border-right: none; font-size: 0.8rem; }
    .table-borderless td:nth-child(4)::before { content: "Interest"; display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; font-weight: 700; }
    .table-borderless td:nth-child(5) { width: 50% !important; order: 5; background: #f8fafc; padding: 0.75rem !important; border-radius: 0 8px 8px 0; border: 1px solid #f1f5f9; font-size: 0.8rem; }
    .table-borderless td:nth-child(5)::before { content: "Processing"; display: block; font-size: 0.65rem; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; font-weight: 700; }
    
    /* 5. Action Icons */
    .table-borderless td:nth-child(7) { position: absolute; top: 1.25rem; right: 1.25rem; width: auto !important; order: 0; }
    
    /* Hide ID */
    .table-borderless td:nth-child(1) { display: none !important; }
}
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert">

        </button>
    </div>
    @endif
    <div class="modern-card">
        <div class="modern-card-header">
            <h4>Bank Loan</h4>
            <div class="btn-actions-pane-right">
                <button type="button" class="btn-primary-custom" id="addButton"><i class="bi bi-plus-lg"></i> Add New Bank</button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive" id="main_table">
                <table id="myTable" class="table-borderless">
                    <thead>
                        <tr>
                            <th width="5%">ID</th>
                            <th width="15%">Logo</th>
                            <th width="20%">Bank Name</th>
                            <th width="15%">Interest Rate</th>
                            <th width="15%">Processing Fees</th>
                            <th width="15%">Status</th>
                            <th width="15%" class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data as $item)
                        <tr>
                            <td><span class="text-muted fw-bold">#{{$item->id}}</span></td>
                            <td>
                                <img src="{{ asset('user_upload/bank/' . $item->logo) }}" alt="Bank Logo" class="badge-icon-preview">
                            </td>
                            <td><span class="fw-bold text-dark">{{$item->bank_name}}</span></td>
                            <td><span class="badge bg-light text-primary border px-2 py-1"><i class="bi bi-percent"></i> {{$item->interest_rate}}%</span></td>
                            <td><span class="text-muted">+{{$item->processing_fees}}</span></td>
                            <td>
                                <input data-id="{{$item->id}}" class="status d-none" id="status" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status == 1  ? 'checked':''}}>
                            </td>
                            <td>
                                <div class="action-icons justify-content-center">
                                    <a href="javascript:void(0)" class="action-icon edit editButton" data-id="{{$item->id}}" title="Edit">
                                        <i class="bi bi-pencil-fill editButton" data-id="{{$item->id}}"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="action-icon delete deleteButton" data-id="{{$item->id}}" title="Delete">
                                        <i class="bi bi-trash3-fill deleteButton" data-id="{{$item->id}}"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection


@section('modals')
<!-- Modal -->
<div class="modal fade" id="bankModal" tabindex="-1" role="dialog" aria-labelledby="bankModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="bankModalLabel"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">

                </button>
            </div>
            <div class="modal-body">
                <form id="bankForm" enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="filename" id="file">
                    <input type="hidden" name="id" id="id">

                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="name" name="name" placeholder="" required>
                        <label for="name" class="form-label">Bank Name</label>
                        <div class="invalid-feedback" id="name_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="number" step="0.01" class="form-control" id="interest_rate" name="interest_rate" placeholder="" required>
                        <label for="interest_rate" class="form-label">Interest Rate (%)</label>
                        <div class="invalid-feedback" id="interest_rate_error"></div>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="number" step="0.01" class="form-control" id="processing_fees" name="processing_fees" placeholder="" required>
                        <label for="processing_fees" class="form-label">Processing Fees</label>
                        <div class="invalid-feedback" id="processing_fees_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="logo" class="form-label">Bank Logo</label>
                        <input type="file" class="form-control" id="logo" accept="image/*" required>
                        <div class="invalid-feedback" id="logo_error"></div>
                        <img id="logo_preview" src="" alt="Logo Preview" style="max-height: 80px; margin-top: 10px; display: none;">
                    </div>


                    <div class="mb-0">
                        <label class="form-label d-block">Status</label>
                        <div class="form-check form-check-inline">
                            <input type="radio" class="form-check-input" name="status" id="status_1" value="1" checked>
                            <label class="form-check-label" for="status_1">Active</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input type="radio" class="form-check-input" name="status" id="status_2" value="0">
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
    document.addEventListener('DOMContentLoaded', () => {
        $('[data-toggle="toggle"]').bootstrapToggle();
        const modalElement = document.getElementById('bankModal');
        const modal = new bootstrap.Modal(modalElement);
        const form = document.getElementById('bankForm');
        const logoInput = document.getElementById('logo');
        const fileInput = document.getElementById('file');
        const addButton = document.getElementById('addButton');
        const saveButton = document.getElementById('saveButton');
        const bankModalLabel = document.getElementById('bankModalLabel');

        // Event: Open modal and reset form
        addButton?.addEventListener('click', () => {
            form.reset();
            clearErrors();
            bankModalLabel.innerText = 'Add'
            modal.show();
        });

        // Event: Save form data
        saveButton?.addEventListener('click', async () => {
            clearErrors();
            const formData = new FormData(form);

            try {
                const response = await fetch(`{{ route('bank.loan.store') }}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    },
                });

                const result = await response.json();

                if (result.status) {
                    modal.hide();
                    // localStorage.setItem('successMessage', result.message);
                    location.reload();
                } else {
                    handleValidationErrors(result.errors);
                    alert('Something went wrong.');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('An unexpected error occurred.');
            }
        });

        // Event: Upload logo on file change
        logoInput?.addEventListener('change', async () => {
            const file = logoInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('logo', file);

            try {
                const response = await fetch(`{{ route('bank.loan.upload') }}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                    },
                });

                const result = await response.json();

                if (result.status) {
                    alert('Logo uploaded successfully!');
                    fileInput.value = result.file ?? '';
                } else {
                    alert('Logo upload failed.');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('An unexpected error occurred during upload.');
            }
        });

        // Delegated Event: Handle edit button clicks
        document.body.addEventListener('click', async (e) => {
            if (e.target.classList.contains('editButton')) {
                const id = e.target.dataset.id;
                if (!id) return;
                try {
                    const response = await fetch(`{{ route('bank.loan.edit', ['id' => '__ID__']) }}`.replace('__ID__', id));
                    const result = await response.json();

                    if (result) {
                        populateForm(result);
                        bankModalLabel.innerText = 'Edit'
                        modal.show();
                    }
                } catch (error) {
                    console.error('Edit fetch error:', error);
                    alert('Failed to load data for editing.');
                }
            }
        });

        // Delegated Event: Handle delete button clicks
        document.body.addEventListener('click', async (e) => {
            if (e.target.classList.contains('deleteButton')) {
                const id = e.target.dataset.id;
                if (!id) return;

                const confirmDelete = confirm('Are you sure you want to delete this bank loan?');
                if (!confirmDelete) return;

                try {
                    const response = await fetch(`{{ route('bank.loan.delete') }}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });

                    const result = await response.json();

                    if (result.status) {
                        // localStorage.setItem('successMessage', result.message);
                        location.reload();
                    } else {
                        alert(result.message || 'Delete failed.');
                    }

                } catch (error) {
                    console.error('Delete fetch error:', error);
                    alert('An error occurred while deleting the record.');
                }
            }
        });

        $(document).on('change', '#status', function() {
            const id = $(this).data('id');
            const status = $(this).prop('checked') ? 1 : 0;

            if (!id) return;

            $.ajax({
                url: `{{ route('bank.loan.status') }}`,
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val(),
                },
                contentType: 'application/json',
                data: JSON.stringify({
                    id,
                    status
                }),
                success: function(response) {
                    if (response.status) {
                        toastr.success('Request processed successfully.', "Status Changed");

                    } else {
                        alert('Status update failed.');
                    }
                },
                error: function(err) {
                    console.error('AJAX error:', err);
                    alert('An error occurred while updating status.');
                }
            });
        });
    });



    // Clear form validation errors
    function clearErrors() {
        ['name', 'interest_rate', 'processing_fees', 'logo'].forEach(id => {
            const input = document.getElementById(id);
            const errorDiv = document.getElementById(`${id}_error`);
            input?.classList.remove('is-invalid');
            if (errorDiv) errorDiv.textContent = '';
        });
    }

    // Display validation errors
    function handleValidationErrors(errors) {
        if (!errors) return;
        Object.keys(errors).forEach(key => {
            const input = document.getElementById(key);
            const errorDiv = document.getElementById(`${key}_error`);
            input?.classList.add('is-invalid');
            if (errorDiv) errorDiv.textContent = errors[key][0];
        });
    }

    function populateForm(response) {
        const form = document.getElementById('bankForm');
        form.reset();
        clearErrors();

        // Set simple inputs
        document.getElementById('id').value = response.data.id;
        document.getElementById('name').value = response.data.bank_name;
        document.getElementById('interest_rate').value = response.data.interest_rate;
        document.getElementById('processing_fees').value = response.data.processing_fees;
        document.getElementById('file').value = response.data.logo;

        // Set status radio
        if (response.data.status == 1) {
            document.getElementById('status_1').checked = true;
        } else {
            document.getElementById('status_2').checked = true;
        }

        // Optional: Preview the logo if needed
        if (response.data.logo_url) {
            const logoPreview = document.getElementById('logo_preview');
            if (logoPreview) {
                logoPreview.src = response.data.logo_url;
                logoPreview.style.display = 'block';
            }
        }
    }
</script>


@endpush