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
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-primary border-primary card" onclick="location.href='ist_record'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">All Property</div>
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
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-success card" onclick="location.href='st_record'">
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
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-warning card" onclick="location.href='llment/list_record'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Customers</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['total_customer'] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-danger border-danger card" onclick="location.href='/Notification'">
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
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-warning border-info card" onclick="location.href='list_record'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Properties for Sale</div>
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
            <div class="widget-chart widget-chart2 text-left mb-3 card-btm-border card-shadow-success border-alternate card" onclick="location.href='/member'">
                <div class="widget-chat-wrapper-outer">
                    <div class="widget-chart-content">
                        <div class="widget-title opacity-5 text-uppercase">Properties for Rent</div>
                        <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                            <div class="widget-chart-flex align-items-center">
                                <div>
                                    {{ $data['properties_for_rent'] }}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                        <td class="text-center"><a href="javascript:void(0)"></a>{{$property->location->locality}}</td>
                        <td class="text-center"><a href="javascript:void(0)"></a>{{$property->created_at}}</td>


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