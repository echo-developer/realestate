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
                <div>Membership Plan Type <div class="page-title-subheading">Membership Plan Type &gt; All Membership Plan Types</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="https://scriptlisting.com/selfgood-live/hackground/">Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan Type</li>
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
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Membership Plan Type <div
                    class="btn-actions-pane-right">
                    <div class="btn-group" id="global_action_btn" style="display:none">
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="deleteSelected()" data-original-title="Delete selected"><i
                                class="fa fa-trash"></i></button>
                        <button type="button" class="btn btn-success btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(1)" data-original-title="Make active"><i
                                class="fa fa-thumbs-up"></i></button>
                        <button type="button" class="btn btn-danger btn-sm" data-toggle="tooltip" title=""
                            onclick="changeStatusAll(0)" data-original-title="Make inactive"><i
                                class="fa  fa-thumbs-down"></i></button>
                    </div>
                    &nbsp;
                </div>
            </div>

            <div class="table-responsive" id="main_table">
                <table id="myTable" class="table">
                    <thead>
                        <tr>
                            <th style="width:45%">Plan Type Name</th>
                            <th style="width:35%">Access</th>
                            <th style="width:10%">Status</th>
                            <th class="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody id="membershipPlanType">
                        @foreach ($MembershipPlanTypes as $planType)
                        <tr>
                            <td>{{$planType->english_name}}</td>
                            <td>
                                Listings Allowed: {{$planType->listings_allowed}}
                                <br>
                                Contact Owners : {{$planType->owner_contacted}}
                                <br>
                                Listing Visibility : {{$planType->listing_visibility}}
                                <br>
                                Social Media Promotion : {{$planType->social_media_promotion}}
                                <br>
                                Verified Badge: {{$planType->verified_badge}}
                                <br>
                                Relationship Manager : {{$planType->relationship_manager}}

                            </td>
                            <td>
                                <input data-planTypeId="{{ $planType->id }}" id="status" class="status d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $planType->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md editButton" data-planTypeId="{{ $planType->id }}"></i>

                                <i class="fa fa-trash text-danger fa-md deleteButton"
                                    data-planTypeId="{{ $planType->id }}"></i>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            {{ $MembershipPlanTypes->links('vendor.pagination.bootstrap-5') }}
        </div>
    </div>
</div>
@endsection

@section('modals')
<div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="ModalLabel">Edit Plan Type </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="formData">
                    <input type="text" class='d-none' id="planTypeId" name="id">
                    @php
                    $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach($langs as $lang)
                    <div class="form-group">
                        <label for="type_name">{{ __('Plan Type Name') }} ({{ strtoupper($lang) }})</label>
                        <input type="text" class="form-control" id="type_name_{{ $lang }}" name="type_name[{{ $lang }}]" required>
                        <div class="invalid-feedback" id="type_name_{{ $lang }}_error"></div>
                    </div>
                    @endforeach

                    <div class="form-group">
                        <label for="contact_owners">Contact Owners:</label>
                        <input type="text" class="form-control" id="owner_contacted" name="owner_contacted">
                        <div class="invalid-feedback" id="contact_owners_error"></div>
                    </div>

                    <div class="form-group">
                        <label for="listing_visibility">Listing Visibility</label>
                        <input type="text" class="form-control" id="listing_visibility" name="listing_visibility">
                        <div class="invalid-feedback" id="listing_visibility_error"></div>
                    </div>

                    <div class="form-group">
                        <label for="listings_allowed">Listings Allowed</label>
                        <input type="text" class="form-control" id="listings_allowed" name="listings_allowed">
                        <div class="invalid-feedback" id="listings_allowed_error"></div>
                    </div>

                    <div class="form-group">
                        <label>Social Media Promotion</label>
                        <div class="radio-inline">
                            <input type="radio" name="social_media_promotion" value="Y" class="magic-radio" id="social_media_promotion_y">
                            <label for="social_media_promotion_y">Yes</label>
                            <input type="radio" name="social_media_promotion" value="N" class="magic-radio" id="social_media_promotion_n" checked>
                            <label for="social_media_promotion_n">No</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Verified Badge</label>
                        <div class="radio-inline">
                            <input type="radio" name="verified_badge" value="Y" class="magic-radio" id="verified_badge_y">
                            <label for="verified_badge_y">Yes</label>
                            <input type="radio" name="verified_badge" value="N" class="magic-radio" id="verified_badge_n" checked>
                            <label for="verified_badge_n">No</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Relationship Manager</label>
                        <div class="radio-inline">
                            <input type="radio" name="relationship_manager" value="Y" class="magic-radio" id="relationship_manager_y">
                            <label for="relationship_manager_y">Yes</label>
                            <input type="radio" name="relationship_manager" value="N" class="magic-radio" id="relationship_manager_n" checked>
                            <label for="relationship_manager_n">No</label>
                        </div>
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
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" id="SaveButton" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')

<script>
    $(document).ready(function() {

        const Modal = new bootstrap.Modal($('#Modal')[0]);
        const saveButton = $('#SaveButton');
        const deleteButton = $('.deleteButton');
        const status = $('#status');
        const formdata = $('#formData');

        $(document).on('click', '.editButton', function() {

            const id = $(this).data('plantypeid');

            $.get(`{{ route('plan_type.edit', ':id') }}`.replace(':id', id))
                .done(function(response) {
                    if (response.success) {
                        populateForm(response.data);
                        Modal.show();
                    }
                })
                .fail(function(xhr) {
                    console.error('Error fetching data:', xhr.responseText);
                });
        });

        saveButton.on('click', function() {
            saveButton.prop('disabled', true).text('Saving...');

            let data = new FormData(formdata[0]);

            $.ajax({
                url: `{{ route('plan_type.update') }}`,
                type: "POST",
                data: data,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    if (response.success) {
                        Modal.hide();
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


        deleteButton.on('click', function() {
            const id = $(this).data('plantypeid');

            if (confirm('Are you sure you want to delete this plan?')) {
                $.ajax({
                    url: `{{ route('plan_type.destroy') }}`,
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

        status.on('change', function() {
            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);
            const id = $(this).data('plantypeid');
            const status = this.checked ? 1 : 0;
            $.ajax({
                url: `{{ route('plan_type.status') }}`,
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

        function populateForm(data) {
            $('#planTypeId').val(data.id);
            $('#owner_contacted').val(data.owner_contacted);
            $('#listing_visibility').val(data.listing_visibility);
            $('#listings_allowed').val(data.listings_allowed);
            $(`input[name="status"][value="${data.status}"]`).prop('checked', true);
            $(`input[name="social_media_promotion"][value="${data.social_media_promotion}"]`).prop('checked', true);
            $(`input[name="verified_badge"][value="${data.verified_badge}"]`).prop('checked', true);
            $(`input[name="relationship_manager"][value="${data.relationship_manager}"]`).prop('checked', true);
            console.log(data)
            if (data.names) {
                data.names.forEach(function(nameObj) {
                    $(`#type_name_${nameObj.lang}`).val(nameObj.plan_name);
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

<script>
$(document).ready(function () {
    // Ensure modal closes when clicking close button or outside the modal
    $('#Modal').on('hidden.bs.modal', function () {
        $(this).find("form").trigger("reset"); // Reset form fields after closing
    });

    // Close modal on close button click
    $('.close, .btn-secondary').on('click', function () {
        $('#Modal').modal('hide');
    });
});

</script>


@endpush