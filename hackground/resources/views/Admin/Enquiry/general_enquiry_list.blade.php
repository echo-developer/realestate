@extends('Admin.layouts.app')
{{-- @dd($list) --}}
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
                <div>{{ $main_title }}
                    <div class="page-title-subheading">{{ $second_title }} &gt; {{ $title }}</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">{{ $main_title }}</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>

    <div class="custom-tabs-container">
        <ul class="custom-tabs">
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/list') ? 'active' : '' }}"
                    href="{{ url('enquiry/list') }}" data-url="{{ url('enquiry/assign-list/') }}">
                    Project and Property Leads
                </a>
            </li>
            <li>
                <a class="custom-tab-link ajax-link {{ Request::is('enquiry/general-leads') ? 'active' : '' }}"
                    href="{{ url('/enquiry/general-leads') }}" data-url="{{ url('/enquiry/general-leads') }}">
                    General Leads
                </a>
            </li>
        </ul>
    </div>

    <form action="" method="get">
        <div class="custom-card p-4 mb-4">
            <div class="row align-items-end">
                <div class="col-md-3 col-sm-4">
                    <label for="enquery_date" class="form-label" style="font-weight: 500; color: #475569; font-size: 0.88rem;">Leads Date</label>
                    <div class="form-group mb-0">
                        <input type="date" class="form-control custom-input" id="enquery_date" name="enquery_date" value="{{ request('enquery_date') }}" />
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <label for="member_name" class="form-label" style="font-weight: 500; color: #475569; font-size: 0.88rem;">Member Name</label>
                    <div class="form-group mb-0">
                        <input class="form-control custom-input" id="member_name" placeholder="Search by member" name="member_name" value="{{ request('member_name') }}" />
                    </div>
                </div>
                <div class="col-md-3 col-sm-4">
                    <div class="form-group mb-0 d-flex gap-2">
                        <button type="submit" class="btn btn-primary d-inline-flex align-items-center gap-2" style="background-color: #0d6efd; border: none; padding: 0.6rem 1.25rem; font-weight: 500; box-shadow: 0 4px 10px rgba(13, 110, 253, 0.15);">
                            <i class="fa fa-search"></i> Search
                        </button>
                        <a href="{{ url()->current() }}" class="btn btn-secondary d-inline-flex align-items-center gap-2" style="background-color: #64748b; border: none; padding: 0.6rem 1.25rem; font-weight: 500;">
                            <i class="fa fa-undo"></i> Reset
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="custom-card">
        <div class="custom-card-header">
            <h4><i class="fa fa-list"></i> {{ $title }}</h4>
        </div>
        <div class="custom-card-body p-0">
            <div class="table-responsive" id="main_table">
                <table id="myTable" class="custom-table mb-0">
                    <thead>
                        <tr>
                            <th style="width:5%">ID</th>
                            <th style="width:15%">Buyer Name</th>
                            <th style="width:15%">
                                Agent Name
                                <small class="d-block" style="font-weight: 400; font-size: 0.72rem; margin-top: 0.15rem;">
                                    <span class="badge bg-warning text-dark px-2 py-1" style="border-radius: 4px;">Only for agent leads</span>
                                </small>
                            </th>
                            <th style="width:15%">Phone</th>
                            <th style="width:15%">Email</th>
                            <th style="width:15%">Enquiry For</th>
                            <th style="width:15%">Budget</th>
                            <th style="width:15%">Date</th>
                            <th class="text-right" style="width:10%;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($list as $item)
                            <tr>
                                <td>{{ $item?->id }}</td>
                                <td style="font-weight: 500; color: #334155;">{{ $item?->name }}</td>
                                <td>
                                    @php $agentName = !empty($item->agent_id) ? get_user_name($item->agent_id) : ''; @endphp
                                    @if (!empty($agentName))
                                        <span class="badge text-white px-2 py-1" style="font-size: 0.75rem; font-weight: 600; background-color: #0d6efd; border-radius: 4px;">
                                            {{ $agentName }}
                                        </span>
                                    @else
                                        <span class="text-muted" style="font-size: 0.85rem;">N/A</span>
                                    @endif
                                </td>

                                <td>{{ $item?->phone }}</td>
                                <td>{{ $item?->email }}</td>
                                @php
                                    $sub = get_property_sub_category_name($item?->property_for);
                                    $cat = get_property_category_name($item?->property_type);
                                @endphp

                                <td style="font-size: 0.88rem; color: #475569;">
                                    {{ !empty($sub) || !empty($cat) ? trim($sub . (!empty($sub) && !empty($cat) ? ', ' : '') . $cat) : 'N/A' }}
                                </td>

                                <td style="font-weight: 600; color: #1e293b; font-size: 0.88rem;">
                                    {{ !empty($item?->min_budget) && !empty($item?->max_budget)
                                        ? $item?->min_budget . ' - ' . $item?->max_budget
                                        : (!empty($item?->min_budget)
                                            ? $item->min_budget
                                            : (!empty($item?->max_budget)
                                                ? $item?->max_budget
                                                : 'N/A')) }}
                                </td>

                                <td class="text-nowrap">{{ date('d-M-Y', strtotime($item?->created_at)) }}</td>
                                <td class="text-right">
                                    <div class="d-flex justify-content-end gap-2">
                                        @php
                                            $url = empty($item->agent_id)
                                                    ? url('/enquiry/general-assign-list/' . $item?->id)
                                                    : url('/enquiry/general-agent-leads-assign-list/' . $item?->id);
                                        @endphp
                                        <a href="{{ $url }}" class="action-btn btn-assign-lead" title="Assign Lead">
                                            <i class="fa fa-plus"></i>
                                        </a>
                                        <button type="button" class="action-btn btn-view-lead" onclick="viewLead('{{ $item->id }}','G')" title="View Details">
                                            <i class="fa fa-eye"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center py-4 text-muted">
                                    <i class="fa fa-info-circle me-1"></i> Sorry, no records found!
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="custom-table-footer">
                <div class="custom-table-info">
                    Showing {{ $list->firstItem() ?? 0 }} to {{ $list->lastItem() ?? 0 }} of {{ $list->total() ?? 0 }} entries
                </div>
                <div>
                    {!! $list->links('vendor.pagination.bootstrap-5') !!}
                </div>
            </div>
        </div>
    </div>
</div>

            </div>
        </div>
    </div>
@endsection
@section('modals')
    <div class="modal fade" id="modal_action" tabindex="-1" role="dialog" aria-labelledby="viewLeadModal"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

            </div>
        </div>
    </div>
@endsection
@push('custom-js')
    <script>
        function add() {
            $('.form-control').removeClass('is-invalid');
            $('.invalid-feedback').empty();
            AddEdit('Add', 'Add');
        }

        function viewLead(id, lead_type) {
            if (id) {
                $.get(`{{ url('/enquiry/details') }}/${id}/${lead_type}`, function(data) {
                    $('#modal_action').modal('show');
                    $('#modal_action .modal-content').html(data);
                });
            }

        }

        function add_edit() {
            var data = $("#formData").serializeArray();
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            var url = $('#countryId').val() ?
                `{{ url('/edit/country') }}` :
                `{{ url('/add/country') }}`;

            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(response) {
                    localStorage.setItem('successMessage', response.message);
                    window.location.reload(true);
                    $('#modal_action').modal('hide');
                    $('#formData')[0].reset();
                },
                error: function(response) {
                    var errors = response.responseJSON.errors;

                    // Reset previous error messages and invalid class
                    $('.invalid-feedback').text('').hide();
                    $('.form-control').removeClass('is-invalid');

                    // Loop through errors and update the DOM
                    Object.entries(errors).forEach(([field, messages]) => {
                        const fieldId = field.replace('.', '_'); // Convert 'name.en' to 'name_en'
                        const inputSelector = `#${fieldId}`;
                        const errorSelector = `#${fieldId}_error`;

                        $(inputSelector).addClass('is-invalid');
                        $(errorSelector).text(messages[0]).show();
                    });

                }

            });
        }



        $('.status').change(function() {

            toastr.success('Request processed successfully.', 'Request Status', toastrOptions);

            var id = $(this).data('id');
            var status = this.checked ? 1 : 0;
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                type: 'POST',
                url: `{{ url('/country/status') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    // Handle success response if needed
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });

        function Delete(id) {
            var result = confirm('Are you sure you want to delete this?');
            console.log(id);
            if (result) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    type: 'POST',
                    url: `{{ url('/country/delete') }}`,
                    data: {
                        'id': id
                    },
                    success: function(response) {
                        localStorage.setItem('successMessage', response.message);
                        window.location.reload(true);
                    },
                    error: function(msg) {
                        console.log(msg);
                        var errors = msg.responseJSON;
                    }
                });
            }
        }

        $(document).ready(function() {
            var table = $('#myTable').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [0, 'desc']
                ],
                "columnDefs": [{
                        "orderable": true,
                        "targets": [0]
                    },
                    {
                        "orderable": false,
                        "targets": [2, 3, 4]
                    }
                ]
            });
        });
    </script>
@endpush
