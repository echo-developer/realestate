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

    <div class="app-main__inner" style="min-width: 0; max-width: 100%; overflow-x: hidden;">
    <style>
        .app-main__inner { width: 100%; padding-bottom: 2rem; }
        .table-responsive { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .btn-pill-group { display: inline-flex; flex-wrap: wrap; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; width: 100%; max-width: max-content; }
        .btn-pill-group .btn { border: none; border-radius: 0; font-weight: 600; padding: 0.5rem 0.75rem; font-size: 0.8rem; box-shadow: none !important; flex: 1 1 auto; white-space: nowrap; text-align: center; }
        .btn-pill-group .btn.active { background-color: #2563eb; color: #ffffff; }
        .btn-pill-group .btn.inactive { background-color: #ffffff; color: #64748b; }
        .btn-pill-group .btn.inactive:hover { background-color: #f8fafc; color: #0f172a; }
        
        .search-box-responsive { border-radius: 12px; }
        @media (min-width: 768px) {
            .search-box-responsive { border-radius: 50rem !important; }
            .btn-pill-group .btn { font-size: 0.85rem; padding: 0.5rem 1rem; }
            .btn-pill-group { width: auto; }
        }
    </style>

    <!-- New Modern Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div style="min-width: 0;">
            <h2 class="fw-bold text-dark mb-1" style="font-size: 1.5rem; letter-spacing: -0.5px;">Leads</h2>
            <div class="text-muted text-truncate" style="font-size: 0.8rem; font-weight: 500;">
                Dashboard <span class="mx-1">&gt;</span> Leads Management <span class="mx-1">&gt;</span> {{ $title }}
            </div>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-3">
            <div class="btn-pill-group">
                <a href="{{ url('enquiry/list') }}" class="btn inactive">Project & Property Leads</a>
                <a href="{{ url('/enquiry/general-leads') }}" class="btn active">General Leads</a>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>

    <!-- Premium Search Bar -->
    <form action="" method="get" class="mb-4">
        <div class="bg-white rounded-4 p-3 shadow-sm" style="border: 1px solid #e2e8f0;">
            <div class="row g-3 align-items-end">
                <div class="col-md-4 col-12 mb-2 mb-md-0">
                    <label class="form-label text-muted mb-1 px-1" style="font-size: 0.75rem; font-weight: 600;">Date Filter</label>
                    <div class="d-flex align-items-center bg-light rounded-3 px-3" style="height: 42px;">
                        <i class="fa fa-calendar-o text-muted opacity-50 me-2 d-none d-md-inline"></i>
                        <input type="date" class="form-control shadow-none bg-transparent border-0 p-0 w-100" id="enquery_date" name="enquery_date" value="{{ request('enquery_date') }}" style="font-weight: 500; font-size: 0.85rem;" title="Leads Date">
                    </div>
                </div>
                <div class="col-md-5 col-12 mb-2 mb-md-0">
                    <label class="form-label text-muted mb-1 px-1" style="font-size: 0.75rem; font-weight: 600;">Search Member</label>
                    <div class="d-flex align-items-center bg-light rounded-3 px-3" style="height: 42px;">
                        <i class="fa fa-search text-muted opacity-50 me-2"></i>
                        <input type="text" class="form-control shadow-none bg-transparent border-0 p-0 w-100" id="member_name" placeholder="Search by member name..." name="member_name" value="{{ request('member_name') }}" style="font-weight: 500; font-size: 0.85rem;">
                    </div>
                </div>
                <div class="col-md-3 col-12 d-flex gap-2 justify-content-end mt-3 mt-md-0 pt-3 border-top d-md-block d-md-flex" style="border-color: #f1f5f9 !important;">
                    <a href="{{ url()->current() }}" class="btn btn-sm btn-light text-muted px-4 rounded-pill d-flex align-items-center justify-content-center" style="font-weight: 600; font-size: 0.8rem; height: 38px;">Reset</a>
                    <button type="submit" class="btn btn-sm btn-dark px-4 rounded-pill d-flex align-items-center justify-content-center" style="font-weight: 600; font-size: 0.8rem; height: 38px;">Apply Filters</button>
                </div>
            </div>
        </div>
    </form>

    <!-- Modern Card List Layout -->
    <div class="bg-white rounded border border-light w-100">
        <div class="p-3 border-bottom border-light">
            <h5 class="mb-0 fw-bold text-dark-main fs-6"><i class="fa fa-list me-2"></i>{{ $title }}</h5>
        </div>
        
        <style>
            .hover-bg-light { transition: background-color 0.2s ease; }
            .hover-bg-light:hover { background-color: #f8fafc; }
            .badge-soft-primary { background-color: #eff6ff; color: #2563eb; padding: 0.35rem 0.65rem; border-radius: 4px; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.3px; }
            .badge-soft-success { background-color: #f0fdf4; color: #16a34a; padding: 0.35rem 0.65rem; border-radius: 4px; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.3px; }
            .badge-soft-warning { background-color: #fffbeb; color: #b45309; padding: 0.35rem 0.65rem; border-radius: 4px; font-weight: 600; font-size: 0.7rem; letter-spacing: 0.3px; }
            .text-dark-main { color: #1e293b; }
            .text-sub { color: #64748b; }
            .btn-icon-subtle { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; color: #64748b; background: transparent; border: 1px solid transparent; transition: all 0.2s; }
            .btn-icon-subtle:hover { background-color: #f1f5f9; color: #0f172a; }
            .btn-icon-primary { color: #2563eb; }
            .btn-icon-primary:hover { background-color: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        </style>

        <!-- Desktop Header Row -->
        <div class="d-none d-lg-block p-3 border-bottom" style="background-color: #f8fafc; border-color: #e2e8f0 !important;">
            <div class="row align-items-center text-uppercase text-sub" style="font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px;">
                <div class="col-lg-1">ID</div>
                <div class="col-lg-3">Enquiry For</div>
                <div class="col-lg-3">Buyer Details</div>
                <div class="col-lg-2">Agent</div>
                <div class="col-lg-2">Date</div>
                <div class="col-lg-1 text-end pe-4">Actions</div>
            </div>
        </div>

        <!-- List Items -->
        <div>
            @forelse($list as $item)
                @php
                    $agentName = !empty($item->agent_id) ? get_user_name($item->agent_id) : '';
                    $sub = get_property_sub_category_name($item?->property_for);
                    $cat = get_property_category_name($item?->property_type);
                    $enquiryFor = !empty($sub) || !empty($cat) ? trim($sub . (!empty($sub) && !empty($cat) ? ', ' : '') . $cat) : 'General Enquiry';
                    
                    $budget = !empty($item?->min_budget) && !empty($item?->max_budget)
                            ? $item?->min_budget . ' - ' . $item?->max_budget
                            : (!empty($item?->min_budget) ? $item->min_budget : (!empty($item?->max_budget) ? $item?->max_budget : ''));
                @endphp
            <div class="p-0 border-bottom hover-bg-light position-relative" style="border-color: #f1f5f9 !important;">
                
                <!-- DESKTOP VIEW -->
                <div class="d-none d-lg-block p-3">
                    <div class="row align-items-center">
                        <!-- ID -->
                        <div class="col-lg-1 text-sub fw-medium" style="font-size: 0.85rem;">#{{ $item->id }}</div>
                        
                        <!-- Enquiry For -->
                        <div class="col-lg-3">
                            <div class="fw-bold text-dark-main text-truncate mb-1" style="font-size: 0.95rem;" title="{{ $enquiryFor }}">
                                {{ $enquiryFor }}
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge-soft-success">General</span>
                                @if($budget)
                                <span class="text-sub" style="font-size: 0.8rem;">&bull; Budget: {{ $budget }}</span>
                                @endif
                            </div>
                        </div>
                        
                        <!-- Buyer Details -->
                        <div class="col-lg-3">
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <div class="fw-semibold text-dark-main" style="font-size: 0.85rem;">{{ $item->name }}</div>
                            </div>
                            <div class="d-flex flex-wrap align-items-center gap-3 text-sub" style="font-size: 0.8rem;">
                                <span><i class="fa fa-envelope-o me-1"></i>{{ $item->email ?? 'N/A' }}</span>
                                <span><i class="fa fa-phone me-1"></i>{{ $item->phone ?? 'N/A' }}</span>
                            </div>
                        </div>

                        <!-- Agent Name -->
                        <div class="col-lg-2">
                            @if (!empty($agentName))
                                <span class="badge-soft-primary">{{ $agentName }}</span>
                            @else
                                <span class="text-sub" style="font-size: 0.85rem;">N/A</span>
                            @endif
                        </div>
                        
                        <!-- Date -->
                        <div class="col-lg-2 text-sub" style="font-size: 0.85rem;">
                            {{ date('d M, Y', strtotime($item->created_at)) }}
                        </div>
                        
                        <!-- Action -->
                        <div class="col-lg-1 d-flex justify-content-end gap-1 pe-2">
                            @php
                                $url = empty($item->agent_id)
                                        ? url('/enquiry/general-assign-list/' . $item?->id)
                                        : url('/enquiry/general-agent-leads-assign-list/' . $item?->id);
                            @endphp
                            <a href="{{ url('/enquiry/details/'.$item->id.'/G') }}" class="btn-icon-subtle btn-icon-primary" title="View Details"><i class="fa fa-eye"></i></a>
                        </div>
                    </div>
                </div>

                <!-- MOBILE VIEW (Premium Card) -->
                <div class="d-block d-lg-none">
                    <div class="p-3">
                        <!-- Title & Badges Row -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div class="fw-bold text-dark-main fs-6 lh-sm pe-3">{{ $enquiryFor }}</div>
                                <span class="badge bg-light text-sub border px-2 py-1" style="font-size: 0.7rem;">#{{ $item->id }}</span>
                            </div>
                            <div class="d-flex flex-wrap align-items-center gap-2">
                                <span class="badge-soft-success">General</span>
                                @if($budget)
                                <span class="text-sub" style="font-size: 0.75rem;">Budget: {{ $budget }}</span>
                                @endif
                            </div>
                        </div>

                        <!-- Buyer Info Box (Subtle Well) -->
                        <div class="rounded p-2 mb-3" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                            <div class="fw-semibold text-dark-main mb-1" style="font-size: 0.85rem;">
                                <i class="fa fa-user-circle-o text-primary me-2 opacity-75"></i>{{ $item->name }}
                            </div>
                            <div class="d-flex flex-column gap-1 text-sub" style="font-size: 0.8rem; padding-left: 1.5rem;">
                                <div><i class="fa fa-envelope-o me-2 opacity-50"></i>{{ $item->email ?? 'N/A' }}</div>
                                <div><i class="fa fa-phone me-2 opacity-50"></i>{{ $item->phone ?? 'N/A' }}</div>
                            </div>
                        </div>
                        
                        @if (!empty($agentName))
                        <div class="mb-3 d-flex align-items-center gap-2 text-sub" style="font-size: 0.8rem;">
                            <i class="fa fa-id-badge opacity-50"></i> Agent: <span class="badge-soft-primary">{{ $agentName }}</span>
                        </div>
                        @endif

                        <!-- Footer Row -->
                        <div class="d-flex justify-content-between align-items-center pt-1 border-top" style="border-color: #f1f5f9 !important;">
                            <div class="d-flex align-items-center gap-3 text-sub" style="font-size: 0.8rem; margin-top: 0.5rem;">
                                <span class="d-flex align-items-center gap-1"><i class="fa fa-calendar-o opacity-50"></i> {{ date('d M, Y', strtotime($item->created_at)) }}</span>
                            </div>
                            <div class="d-flex gap-1" style="margin-top: 0.5rem;">
                                <a href="{{ url('/enquiry/details/'.$item->id.'/G') }}" class="btn-icon-subtle btn-icon-primary" style="background-color: #eff6ff;" title="View Details">
                                    <i class="fa fa-eye"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Thick mobile separator -->
                    <div class="w-100" style="height: 14px; background-color: #f1f5f9; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;"></div>
                </div>

            </div>
            @empty
            <div class="text-center py-5 text-muted">
                <i class="fa fa-folder-open-o fs-1 mb-3 text-light"></i>
                <h5 class="fw-bold text-dark-main">No Leads Found</h5>
                <p class="mb-0 text-sub">We couldn't find any leads matching your criteria.</p>
            </div>
            @endforelse
        </div>

        <!-- Pagination -->
        <div class="mt-4 w-100 p-3">
            {!! $list->links('vendor.pagination.bootstrap-5') !!}
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
            // DataTable removed because it conflicts with the new custom flex-grid list UI
        });
    </script>
@endpush
