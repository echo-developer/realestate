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
                <div>Membership Plan <div class="page-title-subheading">Membership Plan &gt; All Membership Plan List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}">
                            Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan</li>
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
        <button type="button" class="btn-close" data-bs-dismiss="alert">
            
        </button>
    </div>
    @endif
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Membership Plan <div
                    class="btn-actions-pane-right">
                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                    {{-- @if (in_array('MEN0006_Add', $rolePermissions)) --}}
                    <button type="button" class="btn btn-site btn-sm btn-primary" id='addMembershipPlan'>Add Membership Plan </button>
                    {{-- @endif --}}
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="table">
                    <thead>
                        <tr>
                            <th style="width:35%">Plan</th>
                            <th style="width:20%">Price</th>
                            <th style="width:20%">Duration</th>
                            <th style="width:10%">Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="membershipPlan">
                        @foreach ($MembershipPlans as $membershipPlan)
                        <tr>
                            <td>{{ optional($membershipPlan->plan_type_names)->plan_name ?? 'N/A' }}</td>
                            <td>{{ $membershipPlan->price }}</td>
                            <td>{{ $membershipPlan->validity_days }} Days</td>
                            <td>
                                <input data-id="{{ $membershipPlan->id }}" class="membershipPlanStatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $membershipPlan->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md editButton"
                                    data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                                <i class="fa fa-trash text-danger fa-md deleteButton"
                                    data-membershipPlanId="{{ $membershipPlan->id }}"></i>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>

                </table>
            </div>
            {{ $MembershipPlans->links('vendor.pagination.bootstrap-5') }}

        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="MembershipPlanModal" tabindex="-1" role="dialog" aria-labelledby="MembershipPlanAddEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="MembershipPlanAddEditModalLabel"> </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal">
                    
                </button>
            </div>
            <div class="modal-body">
                <!-- Example form -->
                <form id="MembershipPlanformData">
                    <!-- Hidden input for user ID -->
                    <input type="text" class='d-none' id="membershipPlanId" name="id">
                    <div class="form-group">
                        <label for="ufile">Plan Type</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <select name="plan_type" id="plan_type" class="form-control">
                                    <option value="">Select Plan Type</option>
                                    @if (isset($plan_type))
                                    @foreach ($plan_type as $items)
                                    <option value="{{ $items->id }}">{{ $items->plan_name }}</option>
                                    @endforeach
                                    @endif
                                </select>
                            </div>
                        </div>
                    </div>
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-group">
                        <label for="About_Plan">{{ __('About Plan') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control" id="about_plan_{{ $lang }}" name="about_plan[{{ $lang }}]" required>
                        <div class="invalid-feedback" id="about_plan_{{ $lang }}_error"></div>
                    </div>
                    @endforeach



                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="number" class="form-control" id="price" name="price" required min="0" step="0.01">
                        <div class="invalid-feedback" id="price_error"></div>
                    </div>

                    <div class="form-group">
                        <label for="duration">Duration (Days)</label>
                        <input type="number" class="form-control" id="validity_days" name="validity_days" required min="1">
                        <div class="invalid-feedback" id="validity_days_error"></div>
                    </div>

                    <!-- <div class="form-group">
                        <label for="discount">Discount (%)</label>
                        <input type="number" class="form-control" id="discount" name="discount" min="0" max="100" step="0.01">
                        <div class="invalid-feedback" id="discount_error"></div>
                    </div> -->

                    <div class="form-group">
                        <label for="discounted_price">Discounted Price</label>
                        <input type="number" class="form-control" id="discounted_price" name="discounted_price">
                        <div class="invalid-feedback" id="discounted_price_error"></div>
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
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="SaveButton" class="btn btn-primary"></button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')

<script>
    $(document).ready(function() {

        const addButton = $('#addMembershipPlan');
        const modalTitle = $('#MembershipPlanAddEditModalLabel');
        const membershipPlanModal = new bootstrap.Modal($('#MembershipPlanModal')[0]);
        const saveButton = $('#SaveButton');
        const membershipPlanForm = $('#MembershipPlanformData');


        addButton.on('click', function() {
            resetForm();
            modalTitle.text('Add Membership Plan');
            saveButton.text('Add');
            membershipPlanModal.show();
        });


        $(document).on('click', '.editButton', function() {
            resetForm();
            saveButton.text('Update');
            modalTitle.text('Edit Membership Plan');

            const id = $(this).data('membershipplanid');

            $.get(`{{ route('plan.edit', ':id') }}`.replace(':id', id))
                .done(function(response) {
                    if (response.success) {
                        populateForm(response.data);
                        membershipPlanModal.show();
                    }
                })
                .fail(function(xhr) {
                    console.error('Error fetching data:', xhr.responseText);
                });
        });


        saveButton.on('click', function() {
            saveButton.prop('disabled', true).text('Saving...');

            let formData = new FormData(membershipPlanForm[0]);
            let plan_id = $('#membershipPlanId').val();
            let url = "";
            let method = "POST"; // Default for adding new plans

            if (plan_id) {
                url = `{{ route('plan.update') }}`;
            } else {
                url = "{{ route('plan.store') }}"; // Ensure you have a named route for adding
            }

            $.ajax({
                url: url,
                type: method,
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        membershipPlanModal.hide();
                        window.location.reload();
                    }
                },
                error: function(response) {
                    handleErrors(response.responseJSON.errors);
                },
                complete: function() {
                    saveButton.prop('disabled', false).text('Save');
                }
            });
        });


        $(document).on('click', '.deleteButton', function() {
            const id = $(this).data('membershipplanid');

            if (confirm('Are you sure you want to delete this plan?')) {
                $.ajax({
                    url: `{{ route('plan.destroy') }}`,
                    type: 'DELETE',
                    data: {
                        id: id
                    },
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function(response) {
                        if (response.success) {
                            window.location.reload();
                        }
                    },
                    error: function(xhr) {
                        console.error('Error deleting plan:', xhr.responseText);
                    }
                });
            }
        });

        $(document).on('change', '.membershipPlanStatus', function() {
            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
            const id = $(this).data('id');
            const status = this.checked ? 1 : 0;
            $.ajax({
                url: `{{ route('plan.status') }}`,
                type: 'POST',
                data: {
                    id: id,
                    status: status
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {

                },
                error: function(xhr) {
                    console.error('Error deleting plan:', xhr.responseText);
                }
            });

        });

        function resetForm() {
            membershipPlanForm[0].reset();
            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');
        }


        function populateForm(data) {
            console.log(data)
            $('#membershipPlanId').val(data.id);
            $('#plan_type').val(data.plan_type_id);
            $('#price').val(data.price);
            $('#validity_days').val(data.validity_days);
            $('#discounted_price').val(data.discounted_price);
            $(`input[name="status"][value="${data.status}"]`).prop('checked', true);

            if (data.names) {
                data.names.forEach(function(nameObj) {
                    $(`#about_plan_${nameObj.lang}`).val(nameObj.about_plan);
                });
            }
        }


        function handleErrors(errors) {
            $('.invalid-feedback').text('').hide();
            $('.form-control').removeClass('is-invalid');

            Object.entries(errors).forEach(([field, messages]) => {
                const fieldId = field.replace('.', '_');
                $(`#${fieldId}`).addClass('is-invalid');
                $(`#${fieldId}_error`).text(messages[0]).show();
            });
        }
    });
</script>
@endpush