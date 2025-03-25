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
                <div>Membership Plan Type Management <div class="page-title-subheading">Membership Plan Type Management &gt; All Membership Plan Types</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="https://scriptlisting.com/selfgood-live/hackground/">Home</a></li>
                    <li class="breadcrumb-item active">Membership Plan Type Management</li>
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
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Membership Plan Type Management <div
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
                                No. of Contactable Owners: {{$planType->no_of_owners_contactable}}<br>
                                Validity Days: {{$planType->validity_days}}
                            </td>
                            <td>
                                <input data-id="{{ $planType->id }}" class="planTypeStatus d-none" type="checkbox"
                                    data-toggle="toggle" data-on="Active" data-off="Inactive"
                                    data-onstyle="success" data-offstyle="danger" data-size="mini"
                                    {{ $planType->status ? 'checked' : '' }}>
                            </td>
                            <td class="text-right">
                                <i class="fa fa-edit text-success fa-md editButton"
                                    data-Id="1"></i>
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
<div class="modal fade" id="MembershipPlanTypeModal" tabindex="-1" role="dialog" aria-labelledby="MembershipPlanTypeAddEditModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="MembershipPlanTypeAddEditModalLabel"> </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="MembershipPlanTypeformData">
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
                <button type="button" id="SaveButton" class="btn btn-primary"></button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')

<script>
    $(document).on('click', '.editButton', function() {
        const membershipPlanTypeModal = new bootstrap.Modal($('#MembershipPlanTypeModal')[0]);
        const saveButton = $('#SaveButton');

        const id = $(this).data('planTypeId');
          alert(id);
        $.get(`{{ route('plan_type.edit', ':id') }}`.replace(':id', id))
            .done(function(response) {
                if (response.success) {
                    populateForm(response.data);
                    membershipPlanTypeModal.show();
                }
            })
            .fail(function(xhr) {
                console.error('Error fetching data:', xhr.responseText);
            });

        function populateForm(data) {
            // $('#membershipPlanId').val(data.id);
            // $('#price').val(data.price);
            // $('#validity_days').val(data.validity_days);
            // $('#discounted_price').val(data.discounted_price);
            // $(`input[name="status"][value="${data.status}"]`).prop('checked', true);
console.log(data)
            if (data.names) {
                data.names.forEach(function(nameObj) {
                    $(`#type_name_${nameObj.lang}`).val(nameObj.name);
                });
            }
        }
    });
</script>




@endpush