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
                            <div class="widget-title opacity-5 text-uppercase">Enroll</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                        210 </div>
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
                            <div class="widget-title opacity-5 text-uppercase">Quote</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                        104 </div>
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
                            <div class="widget-title opacity-5 text-uppercase">Open Enrollment</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                        0 </div>
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
                            <div class="widget-title opacity-5 text-uppercase">Notification</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                       
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
                            <div class="widget-title opacity-5 text-uppercase">Contact</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                        20
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
                            <div class="widget-title opacity-5 text-uppercase">Member</div>
                            <div class="widget-numbers mt-2 fsize-4 mb-0 w-100">
                                <div class="widget-chart-flex align-items-center">
                                    <div>
                                      
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
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">Latest Enrollment</div>
                <div class="btn-actions-pane-right">
                    <a href=" class="btn-icon btn-wide btn-outline-2x btn btn-outline-focus btn-sm d-flex">
                        View All
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
                            <th class="text-center">#</th>
                            <th class="text-center">Name</th>
                            <th class="text-center">Email</th>
                            <th class="text-center">Phone</th>
                            <th class="text-center">Effective Date</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center text-muted" style="width: 80px;">#8282910701</td>
                            <td class="text-center"><a href="javascript:void(0)">guna jay</a></td>
                            <td class="text-center"><a href="javascript:void(0)">gowthu4594@gmail.com</a></td>
                            <td class="text-center"><a href="javascript:void(0)">4554545454</a></td>


                            <td class="text-center">
                                <span class="pr-2 opacity-6">
                                    <i class="fa fa-business-time"></i>
                                </span>
                                01 Apr, 2024
                            </td>

                            <td class="text-center">
                                <div role="group" class="btn-group-sm btn-group">
                                    <a class="btn-shadow btn btn-primary" href="#">View</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-muted" style="width: 80px;">#2853767601</td>
                            <td class="text-center"><a href="javascript:void(0)">Anusha k</a></td>
                            <td class="text-center"><a href="javascript:void(0)">anusha.krishnan@qualibar.com</a></td>
                            <td class="text-center"><a href="javascript:void(0)">34242424242434</a></td>


                            <td class="text-center">
                                <span class="pr-2 opacity-6">
                                    <i class="fa fa-business-time"></i>
                                </span>
                                01 Apr, 2024
                            </td>

                            <td class="text-center">
                                <div role="group" class="btn-group-sm btn-group">
                                    <a class="btn-shadow btn btn-primary" href="#">View</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-muted" style="width: 80px;">#5496339401</td>
                            <td class="text-center"><a href="javascript:void(0)">Katie Test</a></td>
                            <td class="text-center"><a href="javascript:void(0)">katie.feeney@selfgood.com</a></td>
                            <td class="text-center"><a href="javascript:void(0)">6097909875</a></td>


                            <td class="text-center">
                                <span class="pr-2 opacity-6">
                                    <i class="fa fa-business-time"></i>
                                </span>
                                01 Apr, 2024
                            </td>

                            <td class="text-center">
                                <div role="group" class="btn-group-sm btn-group">
                                    <a class="btn-shadow btn btn-primary" href="#">View</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-muted" style="width: 80px;">#9895933601</td>
                            <td class="text-center"><a href="javascript:void(0)">gowthami dm</a></td>
                            <td class="text-center"><a href="javascript:void(0)">gowthu4594@gmail.com</a></td>
                            <td class="text-center"><a href="javascript:void(0)">4554545454</a></td>


                            <td class="text-center">
                                <span class="pr-2 opacity-6">
                                    <i class="fa fa-business-time"></i>
                                </span>
                                01 Apr, 2024
                            </td>

                            <td class="text-center">
                                <div role="group" class="btn-group-sm btn-group">
                                    <a class="btn-shadow btn btn-primary" href="#">View</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-center text-muted" style="width: 80px;">#2360623201</td>
                            <td class="text-center"><a href="javascript:void(0)">test good</a></td>
                            <td class="text-center"><a href="javascript:void(0)">gowthu4594@gmail.com</a></td>
                            <td class="text-center"><a href="javascript:void(0)">6545678765</a></td>


                            <td class="text-center">
                                <span class="pr-2 opacity-6">
                                    <i class="fa fa-business-time"></i>
                                </span>
                                01 Apr, 2024
                            </td>

                            <td class="text-center">
                                <div role="group" class="btn-group-sm btn-group">
                                    <a class="btn-shadow btn btn-primary" href="#">View</a>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
 
@endsection