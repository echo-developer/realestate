@extends('Admin.layouts.app')

@push('custom-css')
<style>
    .card-fact {
        border-radius: 0.5rem;
    }
</style>
@endpush

@section('title', 'New Admin | Admin')

@section('content')
<div class="app-main__inner">
    <div class="app-page-title app-page-title-simple">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div>
                    <div class="page-title-head center-elem">
                        <span class="d-inline-block pr-2">
                            <i class="fa fa-rocket opacity-6"></i>
                        </span>
                        <span class="d-inline-block">Dashboard</span>
                    </div>
                    <div class="page-title-subheading opacity-10">

                    </div>
                </div>
            </div>
            <div class="page-title-actions">


            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4" onclick="window.location.href='{{ url('allproperties/all-property-view') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['total_properties'] }}</h2>
                            <p>Total Property</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/home-2.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('member/memberUser/Agent') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['total_agents'] }}</h2>
                            <p>Total Agents</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/agent.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('member/memberUser/Builder') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['total_builder'] }}</h2>
                            <p>Total Builder</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/builder.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('transaction/transaction_list') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['total_revenue'] }}</h2>
                            <p>Total Revenue</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/wallet.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('allproject/all-project-view') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['properties_for_sale'] }}</h2>
                            <p>Total Projects</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/project.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('member/memberUser/Owner') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['total_owner'] }}</h2>
                            <p>Total Owner</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/owner.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('admin_notifiaction') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['notification'] ?? 0 }}</h2>
                            <p>Notification</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/notification.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card card-fact border-0 shadow-sm mb-4"
                onclick="location.href='{{ url('enquiry/list') }}'">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-grow-1">
                            <h2>{{ $data['enquiry'] }}</h2>
                            <p>All Enquires</p>
                        </div>
                        <div class="flex-shrink-0">
                            <img src="{{ asset('assets/icons/950299.png') }}" alt="Property" height="48">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="overview-card">
        <div class="header align-items-start">
            <h3>Overview</h3>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-icon">🏠</div>
                    <div>
                        <div>Total Sale</div>
                        <div class="metric-value"> {{ $data['properties_for_sale'] }}</div>
                    </div>
                </div>
                <div class="metric green">
                    <div class="metric-icon">🏢</div>
                    <div>
                        <div>Total Rent</div>
                        <div class="metric-value"> {{ $data['properties_for_rent'] }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="overviewChart"></canvas>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-header">
            <div class="card-header-title font-size-lg text-capitalize font-weight-normal">Property Overview</div>
            <div class="btn-actions-pane-right">
                <a href=" class=" btn-icon btn-wide btn-outline-2x btn btn-outline-focus btn-sm d-flex">
                    See All Properties
                    <span class="pl-2 align-middle opacity-7">
                        <i class="fa fa-angle-right"></i>
                    </span>
                </a>


            </div>
        </div>
        <div class="table-responsive">
            <table class="align-middle text-truncate mb-0 table table-borderless table-hover">
                <thead>
                    <tr>
                        <th class="text-center">id</th>
                        <th class="text-center">Name</th>
                        <th class="text-center">Locality</th>
                        <th class="text-center">Date</th>
                        <th class="text-center">Type</th>
                        <th class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data['properties_lists'] as $property)
                    <tr>
                        <td class="text-center text-muted" style="width: 80px;">
                            {{ UniquePropertyCode($property->id) }}
                        </td>
                        <td class="text-center"><a href="javascript:void(0)"></a>{{ $property->name }}</td>
                        <td class="text-center">
                            {{ get_name_by_id('locality_names', 'locality_id', optional($property->location)->locality, 'en') ?? 'N/A' }}
                        </td>

                        <td class="text-center"><a
                                href="javascript:void(0)"></a>{{ date('d F Y', strtotime($property->created_at)) }}
                        </td>


                        <td class="text-center">
                            {{ get_name_by_id('property_category_names', 'category_id', $property->settings->property_type, 'en') ?? 'N/A' }}
                        </td>

                        <td class="text-center">
                            <div role="group" class="btn-group-sm btn-group">
                                <a class="btn-shadow btn btn-primary" href="#"> On
                                    {{ $property->settings->post_for }} </a>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection

@push('custom-js')
<script>
    const saleData = [<?php echo implode(
                            ',',
                            array_map(function ($sale) {
                                return '"' . $sale . '"';
                            }, $data['chart_sale']),
                        ); ?>].map(Number);
    const rentData = [<?php echo implode(
                            ',',
                            array_map(function ($rent) {
                                return '"' . $rent . '"';
                            }, $data['chart_rent']),
                        ); ?>].map(Number);

    const allData = saleData.concat(rentData);
    const maxValue = Math.max(...allData);
    const suggestedMax = Math.ceil(maxValue / 10) * 10;

    const ctx = document.getElementById('overviewChart').getContext('2d');
    const overviewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [<?php echo implode(
                            ',',
                            array_map(function ($month) {
                                return '"' . $month . '"';
                            }, $data['chart_labels']),
                        ); ?>],
            datasets: [{
                    label: 'Total Sale',
                    data: saleData,
                    fill: true,
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderColor: '#4f46e5',
                    tension: 0.4
                },
                {
                    label: 'Total Rent',
                    data: rentData,
                    fill: true,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: '#22c55e',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: suggestedMax,
                    ticks: {
                        callback: value => value
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
</script>
@endpush