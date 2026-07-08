@extends('Admin.layouts.app')
{{-- {{ log_anything($data) }} --}}
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
                    <div>Activity
                        <div class="page-title-subheading">Activity &gt; Activity List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Activity List</li>
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
            /* Modern Table & Mobile Card Design */
            .table-borderless { border-collapse: separate; border-spacing: 0; width: 100%; margin-bottom: 0; }
            .table-borderless thead th { background-color: #f8fafc; color: #1e293b; font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-top: none; padding: 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
            .table-borderless tbody td { vertical-align: middle; border-bottom: 1px solid #e2e8f0 !important; border-top: none; padding: 1.25rem 1rem; color: #475569; }
            .table-borderless tbody tr:hover { background-color: #f8fafc; }
            
            /* Modern Soft Badges */
            .badge-soft { padding: 0.35em 0.8em; border-radius: 50px; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.3px; display: inline-block; margin-bottom: 0.25rem; }
            .badge-soft-info { background-color: #e0f2fe; color: #0284c7; }
            .badge-soft-success { background-color: #dcfce3; color: #16a34a; }
            .badge-soft-warning { background-color: #fef3c7; color: #d97706; }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .table-borderless thead { display: none; }
                .table-borderless tbody tr { display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); overflow: hidden; padding: 0; }
                .table-borderless tbody td { border: none !important; padding: 1rem 1.25rem !important; display: block; width: 100% !important; border-bottom: 1px dashed #e2e8f0 !important; }
                .table-borderless tbody td:last-child { border-bottom: none !important; }
                
                /* Mobile Labels */
                .table-borderless tbody td::before { content: attr(data-label); display: block; font-weight: 700; color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px; }
            }
        </style>
        
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header d-flex">
                    <h4>Activity List</h4>
                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table table-borderless" id="activity_table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Intent</th>
                                <th>City</th>
                                <th>Budget</th>
                                <th>Filters</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (isset($data))
                                @foreach ($data as $act)
                                    <tr>
                                        <td data-label="User">
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-icon-wrapper me-3">
                                                    <div class="avatar-icon rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; font-weight: bold; font-size: 1.2rem;">
                                                        {{ strtoupper(substr($act->user_name ?? 'U', 0, 1)) }}
                                                    </div>
                                                </div>
                                                <div>
                                                    <a href="{{ route('memberUser.allDetails', $act->user_id) }}" class="fw-bold text-dark text-decoration-none">{{ $act->user_name ?? 'N/A' }}</a>
                                                    <div class="text-muted small"><i class="bi bi-envelope me-1"></i>{{ $act->user_email ?? 'N/A' }}</div>
                                                    <div class="text-muted small"><i class="bi bi-telephone me-1"></i>{{ $act->user_phone ?? 'N/A' }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td data-label="Intent">
                                            @if ($act->post_for || $act->property_type || $act->property_for)
                                                @if ($act->post_for)
                                                    <span class="badge-soft badge-soft-info">{{ $act->post_for === 'Sale' ? 'Buy' : 'Rent' }}</span>
                                                @endif

                                                @if ($act->property_type)
                                                    <span class="badge-soft badge-soft-success">{{ $act->property_type }}</span>
                                                @endif

                                                @if ($act->property_for)
                                                    <span class="badge-soft badge-soft-warning">{{ $act->property_for }}</span>
                                                @endif
                                            @else
                                                <span class="text-muted"><em>N/A</em></span>
                                            @endif
                                        </td>
                                        <td data-label="City" class="fw-medium text-dark">{{ $act->city_id ?? 'N/A' }}</td>
                                        <td data-label="Budget" class="fw-bold text-success">
                                            @if ($act->min_budget || $act->max_budget)
                                                ₹{{ $act->min_budget ?? '0' }} - ₹{{ $act->max_budget ?? 'Any' }}
                                            @else
                                                <span class="text-muted fw-normal"><em>N/A</em></span>
                                            @endif
                                        </td>
                                        <td data-label="Filters">
                                            @if ($act->json_filters)
                                                @php
                                                    $filters = $act->json_filters;
                                                @endphp
                                                @foreach ($filters as $key => $values)
                                                    <div class="mb-1"><span class="text-muted fw-medium">{{ ucfirst($key) }}:</span>
                                                        @foreach ((array) $values as $val)
                                                            <span class="badge-soft badge-soft-success">{{ $val }}</span>
                                                        @endforeach
                                                    </div>
                                                @endforeach
                                            @else
                                                <span class="text-muted"><em>No filters</em></span>
                                            @endif
                                        </td>
                                        <td data-label="Date">
                                            <span class="text-muted fw-medium"><i class="bi bi-calendar3 me-1"></i>{{ date('M d, Y', strtotime($act->created_at)) }}</span>
                                            <br><small class="text-muted"><i class="bi bi-clock me-1"></i>{{ date('h:i A', strtotime($act->created_at)) }}</small>
                                        </td>
                                    </tr>
                                @endforeach
                            @endif
                        </tbody>
                    </table>

                </div>
                {!! $data->links('vendor.pagination.bootstrap-5') !!}
            </div>
        </div>
    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {
            var table = $('#activity_table').DataTable({
                "paging": false,
                "searching": false,
                "info": false,
                "ordering": true,
                "order": [
                    [5, 'desc']
                ],
                "columnDefs": [{
                        "orderable": true,
                        "targets": [0]
                    },
                    {
                        "orderable": false,
                        "targets": [1, 2, 3, 4]
                    }
                ]
            });
        });
    </script>
@endpush
