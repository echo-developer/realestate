@extends('Admin.layouts.app')

@section('title', 'New Admin | Admin')

@section('content')
<div class="app-main__inner">
    <div class="app-page-title app-page-title-simple">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div>
                    <div class="page-title-head center-elem">
                        <span class="d-inline-block pr-2">
                            <i class="lnr-apartment opacity-6"></i>
                        </span>
                        <span class="d-inline-block">Minimal Dashboard</span>
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
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-primary card"  onclick="window.location.href='{{ url('allproperties/all-property-view') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Property</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_properties'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-success card" onclick="location.href='{{ url('member/memberUser/Agent') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Agents</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_agents'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-warning card" onclick="location.href='{{ url('member/memberUser/Builder') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Builder</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_builder'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-danger card" onclick="location.href='{{ url('transaction/transaction_list') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Revenue</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_revenue'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-warning border-info card" onclick="location.href='{{ url('allproject/all-project-view') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Projects</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['properties_for_sale'] }}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-success border-alternate card" onclick="location.href='{{ url('member/memberUser/Owner') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Total Owner</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_owner'] }}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-warning border-alternate card" onclick="location.href='{{ url('admin_notifiaction') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Notification</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['notification'] ?? 0 }}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-alternate card" onclick="location.href='{{ url('enquiry/list') }}'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">All Enquires</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['enquiry'] }}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="overview-card">
        <div class="header">
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
                        <td class="text-center text-muted" style="width: 80px;"> {{UniquePropertyCode($property->id)}}</td>
                        <td class="text-center"><a href="javascript:void(0)"></a>{{$property->name}}</td>
                        <td class="text-center"><a href="javascript:void(0)"></a>{{$property->location->locality??'N/A'}}</td>
                        <td class="text-center"><a href="javascript:void(0)"></a>{{ date('d F Y', strtotime($property->created_at)) }}</td>


                        <td class="text-center">
                            {{get_name_by_id('property_category_names','category_id',$property->settings->property_type,'en') ?? 'N/A'}}

                        </td>

                        <td class="text-center">
                            <div role="group" class="btn-group-sm btn-group">
                                <a class="btn-shadow btn btn-primary" href="#"> On {{$property->settings->post_for}} </a>
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
  const saleData = [<?php echo implode(',', array_map(function($sale) { return '"' . $sale . '"'; }, $data['chart_sale'])); ?>].map(Number);
  const rentData = [<?php echo implode(',', array_map(function($rent) { return '"' . $rent . '"'; }, $data['chart_rent'])); ?>].map(Number);

  const allData = saleData.concat(rentData);
  const maxValue = Math.max(...allData);
  const suggestedMax = Math.ceil(maxValue / 10) * 10; 

  const ctx = document.getElementById('overviewChart').getContext('2d');
  const overviewChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [<?php echo implode(',', array_map(function($month) { return '"' . $month . '"'; }, $data['chart_labels'])); ?>],
      datasets: [
        {
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