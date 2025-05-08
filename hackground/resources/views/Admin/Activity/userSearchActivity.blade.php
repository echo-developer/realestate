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
        </style>
        
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header d-flex">
                    <h4>Activity List</h4>
                </div>

                <div class="table-responsive" id="main_table">
                    <table class="mb-0 table" id="activity_table">
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
                                        <td>
                                            <a
                                                href="{{ route('memberUser.allDetails', $act->user_id) }}">{{ $act->user_name ?? 'N/A' }}</a>
                                            <br><small>{{ $act->user_email ?? 'N/A' }}</small>
                                            <br><small>{{ $act->user_phone ?? 'N/A' }}</small>
                                        </td>
                                        <td>
                                            @if ($act->post_for || $act->property_type || $act->property_for)
                                                @if ($act->post_for)
                                                    <span
                                                        class="badge bg-info">{{ $act->post_for === 'Sale' ? 'Buy' : 'Rent' }}</span><br>
                                                @endif

                                                @if ($act->property_type)
                                                    <span class="badge bg-success">{{ $act->property_type }}</span><br>
                                                @endif

                                                @if ($act->property_for)
                                                    <span
                                                        class="badge bg-warning"><small>{{ $act->property_for }}</small></span>
                                                @endif
                                            @else
                                                <span class="text-muted"><em>N/A</em></span>
                                            @endif
                                        </td>
                                        <td>{{ $act->city_id ?? 'N/A' }}</td>
                                        <td>
                                            @if ($act->min_budget || $act->max_budget)
                                                ₹{{ $act->min_budget ?? '0' }} - ₹{{ $act->max_budget ?? 'Any' }}
                                            @else
                                                <em>N/A</em>
                                            @endif
                                        </td>
                                        <td>
                                            @if ($act->json_filters)
                                                @php
                                                    $filters = $act->json_filters;
                                                @endphp
                                                @foreach ($filters as $key => $values)
                                                    <div><strong>{{ ucfirst($key) }}:</strong>
                                                        @foreach ((array) $values as $val)
                                                            <span class="badge bg-success">{{ $val }}</span>
                                                        @endforeach
                                                    </div>
                                                @endforeach
                                            @else
                                                <em>No filters</em>
                                            @endif
                                        </td>
                                        <td>
                                            <small>{{ $act->created_at }}</small>
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
