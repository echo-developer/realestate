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
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Bank Loan
                    <div class="page-title-subheading">Bank Loan &gt; Bank Loan List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Bank Loan</li>
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
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Bank Loan
                {{-- @if (in_array('MEN0005_Add', $Permissions)) --}}
                <div class="btn-actions-pane-right">
                    <button type="button" class="btn btn-sm btn-success" id="addButton">Add</button>
                </div>
                {{-- @endif --}}
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:15%">Bank Name</th>
                            <th style="width:20%">Rate of Interest </th>
                            <th style="width:15%">Processing fees</th>
                            <th style="min-width:110px; width:20%">Logo</th>
                            <th style="width:10%">Status</th>
                            <th style="min-width:80px;" class="text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody id="user">
                        @foreach($data as $item)
                        <tr>
                            <td>{{$item->id}}</td>
                            <td>{{$item->bank_name}}</td>
                            <td>{{$item->interest_rate}}%</td>
                            <td>+{{$item->processing_fees}}</td>
                            <td>
                                <img src="{{ asset('user_upload/bank/' . $item->logo) }}" alt="Bank Logo" width="90" height="50">
                            </td>
                            <td>
                                <input data-id="" class="userstatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini" {{$item->status == 1  ? 'checked':''}}>
                            </td>

                            <td class="text-right">

                                <i class="fa fa-edit text-success fa-md editButton"
                                    data-userid="{{$item->id}}"></i>

                                <i class="fa fa-trash text-danger fa-md UserDeleteButton"
                                    data-userid="{{$item->id}}"></i>

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
<div class="modal fade" id="bankModal" tabindex="-1" aria-labelledby="bankModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="bankModalLabel">Add/Edit Bank</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="bankForm" enctype="multipart/form-data">
                    @csrf
                    <input type="hidden" name="filename" id="file">

                    <div class="mb-3">
                        <label for="name" class="form-label">Bank Name</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                        <div class="invalid-feedback" id="name_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="interest_rate" class="form-label">Interest Rate (%)</label>
                        <input type="number" step="0.01" class="form-control" id="interest_rate" name="interest_rate" required>
                        <div class="invalid-feedback" id="interest_rate_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="processing_fees" class="form-label">Processing Fees</label>
                        <input type="number" step="0.01" class="form-control" id="processing_fees" name="processing_fees" required>
                        <div class="invalid-feedback" id="processing_fees_error"></div>
                    </div>

                    <div class="mb-3">
                        <label for="logo" class="form-label">Bank Logo</label>
                        <input type="file" class="form-control" id="logo" accept="image/*" required>
                        <div class="invalid-feedback" id="logo_error"></div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="status" id="status_1" value="1" checked>
                                <label class="form-check-label" for="status_1">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="status" id="status_2" value="0">
                                <label class="form-check-label" for="status_2">Inactive</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="saveButton" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>
</div>

@endsection

@push('custom-js')

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const saveButton = document.getElementById('saveButton');
        const modalElement = document.getElementById('bankModal');
        const modal = new bootstrap.Modal(modalElement);
        const form = document.getElementById('bankForm');
        const logoInput = document.getElementById('logo');
        const fileInput = document.getElementById('file');
        const addButton = document.getElementById('addButton');

        // Reset form and show modal
        addButton?.addEventListener('click', () => {
            form.reset();
            clearErrors();
            modal.show();
        });

        // Save form data
        saveButton.addEventListener('click', async () => {
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
                    alert('Saved successfully!');
                    modal.hide();
                    // Optionally refresh your data table here
                } else {
                    alert('Something went wrong.');
                    console.log(result);
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('An unexpected error occurred.');
            }
        });

        // Upload logo immediately on file change
        logoInput.addEventListener('change', async () => {
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

        // Clear validation errors
        function clearErrors() {
            ['name', 'interest_rate', 'processing_fees', 'logo'].forEach(id => {
                const input = document.getElementById(id);
                const errorDiv = document.getElementById(`${id}_error`);

                if (input) input.classList.remove('is-invalid');
                if (errorDiv) errorDiv.textContent = '';
            });
        }
    });
</script>

@endpush