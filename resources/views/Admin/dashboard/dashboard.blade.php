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

   
        <div class="row" hidden="">
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content">
                            <h6 class="widget-subheading">Income</h6>
                            <div class="widget-chart-flex">
                                <div class="widget-numbers mb-0 w-100">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <small class="opacity-5">$</small>
                                            5,456
                                        </div>
                                        <div class="ml-auto">
                                            <div class="widget-title ml-auto font-size-lg font-weight-normal text-muted"><span class="text-success pl-2">+14%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content">
                            <h6 class="widget-subheading">Expenses</h6>
                            <div class="widget-chart-flex">
                                <div class="widget-numbers mb-0 w-100">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4 text-danger">
                                            <small class="opacity-5 text-muted">$</small>
                                            4,764
                                        </div>
                                        <div class="ml-auto">
                                            <div class="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                                <span class="text-danger pl-2">
                                                    <span class="pr-1">
                                                        <i class="fa fa-angle-up"></i>
                                                    </span>
                                                    8%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content">
                            <h6 class="widget-subheading">Spendings</h6>
                            <div class="widget-chart-flex">
                                <div class="widget-numbers mb-0 w-100">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <span class="text-success pr-2">
                                                <i class="fa fa-angle-down"></i>
                                            </span>
                                            <small class="opacity-5">$</small>
                                            1.5M
                                        </div>
                                        <div class="ml-auto">
                                            <div class="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                                <span class="text-success pl-2">
                                                    <span class="pr-1">
                                                        <i class="fa fa-angle-down"></i>
                                                    </span>
                                                    15%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-chat-wrapper-outer">
                        <div class="widget-chart-content">
                            <h6 class="widget-subheading">Totals</h6>
                            <div class="widget-chart-flex">
                                <div class="widget-numbers mb-0 w-100">
                                    <div class="widget-chart-flex">
                                        <div class="fsize-4">
                                            <small class="opacity-5">$</small>
                                            31,564
                                        </div>
                                        <div class="ml-auto">
                                            <div class="widget-title ml-auto font-size-lg font-weight-normal text-muted">
                                                <span class="text-warning pl-2">+76%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div class="row" hidden="">
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-content p-0 w-100">
                        <div class="widget-content-outer">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left pr-2 fsize-1">
                                    <div class="widget-numbers mt-0 fsize-3 text-danger">71%</div>
                                </div>
                                <div class="widget-content-right w-100">
                                    <div class="progress-bar-xs progress">
                                        <div class="progress-bar bg-danger" role="progressbar" aria-valuenow="71" aria-valuemin="0" aria-valuemax="100" style="width: 71%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left fsize-1">
                                <div class="text-muted opacity-6">Income Target</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-content p-0 w-100">
                        <div class="widget-content-outer">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left pr-2 fsize-1">
                                    <div class="widget-numbers mt-0 fsize-3 text-success">54%</div>
                                </div>
                                <div class="widget-content-right w-100">
                                    <div class="progress-bar-xs progress">
                                        <div class="progress-bar bg-success" role="progressbar" aria-valuenow="54" aria-valuemin="0" aria-valuemax="100" style="width: 54%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left fsize-1">
                                <div class="text-muted opacity-6">Expenses Target</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-content p-0 w-100">
                        <div class="widget-content-outer">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left pr-2 fsize-1">
                                    <div class="widget-numbers mt-0 fsize-3 text-warning">32%</div>
                                </div>
                                <div class="widget-content-right w-100">
                                    <div class="progress-bar-xs progress">
                                        <div class="progress-bar bg-warning" role="progressbar" aria-valuenow="32" aria-valuemin="0" aria-valuemax="100" style="width: 32%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left fsize-1">
                                <div class="text-muted opacity-6">Spendings Target</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-shadow-primary mb-3 widget-chart widget-chart2 text-left card">
                    <div class="widget-content p-0 w-100">
                        <div class="widget-content-outer">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left pr-2 fsize-1">
                                    <div class="widget-numbers mt-0 fsize-3 text-info">89%</div>
                                </div>
                                <div class="widget-content-right w-100">
                                    <div class="progress-bar-xs progress">
                                        <div class="progress-bar bg-info" role="progressbar" aria-valuenow="89" aria-valuemin="0" aria-valuemax="100" style="width: 89%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="widget-content-left fsize-1">
                                <div class="text-muted opacity-6">Totals Target</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" hidden="">
            <div class="col-sm-12 col-lg-4">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-normal">Total Sales</div>
                        <div class="btn-actions-pane-right text-capitalize actions-icon-btn">
                            <div class="btn-group dropdown">
                                <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-icon btn-icon-only btn btn-link">
                                    <i class="lnr-cog btn-icon-wrapper"></i>
                                </button>
                                <div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link dropdown-menu">
                                    <h6 tabindex="-1" class="dropdown-header">Header</h6>
                                    <button type="button" tabindex="0" class="dropdown-item"><i class="dropdown-icon lnr-inbox"> </i><span>Menus</span></button>
                                    <button type="button" tabindex="0" class="dropdown-item"><i class="dropdown-icon lnr-file-empty"> </i><span>Settings</span></button>
                                    <button type="button" tabindex="0" class="dropdown-item"><i class="dropdown-icon lnr-book"> </i><span>Actions</span></button>
                                    <div tabindex="-1" class="dropdown-divider"></div>
                                    <div class="p-1 text-right">
                                        <button class="mr-2 btn-shadow btn-sm btn btn-link">View Details</button>
                                        <button class="mr-2 btn-shadow btn-sm btn btn-primary">Action</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="position: relative;">
                        <div id="chart-col-1" style="min-height: 200px;">
                            <div id="apexcharts1wujf2ft" class="apexcharts-canvas apexcharts1wujf2ft" style="width: 0px; height: 200px;"><svg id="SvgjsSvg1414" width="0" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;">
                                    <g id="SvgjsG1416" class="apexcharts-inner apexcharts-graphical">
                                        <defs id="SvgjsDefs1415"></defs>
                                    </g>
                                </svg>
                                <div class="apexcharts-legend"></div>
                            </div>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 1px; height: 1px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                    <div class="p-0 d-block card-footer">
                        <div class="grid-menu grid-menu-2col">
                            <div class="no-gutters row">
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-car text-primary opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Admin
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-bullhorn text-danger opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Blog
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-bug text-success opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Register
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-heart text-warning opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Directory
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-lg-4">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-normal">Daily Sales</div>
                        <div class="btn-actions-pane-right text-capitalize">
                            <button class="btn-wide btn-outline-2x btn btn-outline-focus btn-sm">View All</button>
                        </div>
                    </div>
                    <div class="card-body" style="position: relative;">
                        <div id="chart-col-2" style="min-height: 200px;">
                            <div id="apexcharts7o5j0ggxg" class="apexcharts-canvas apexcharts7o5j0ggxg" style="width: 0px; height: 200px;"><svg id="SvgjsSvg1417" width="0" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;">
                                    <g id="SvgjsG1419" class="apexcharts-inner apexcharts-graphical">
                                        <defs id="SvgjsDefs1418"></defs>
                                    </g>
                                </svg>
                                <div class="apexcharts-legend"></div>
                            </div>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 1px; height: 1px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                    <div class="p-0 d-block card-footer">
                        <div class="grid-menu grid-menu-2col">
                            <div class="no-gutters row">
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-apartment text-dark opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Overview
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-database text-dark opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Support
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-printer text-dark opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Activities
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-dark">
                                        <i class="lnr-store text-dark opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Marketing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-lg-4">
                <div class="mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-normal">Total Expenses</div>
                        <div class="btn-actions-pane-right text-capitalize">
                            <button class="btn-wide btn-outline-2x btn btn-outline-primary btn-sm">View All</button>
                        </div>
                    </div>
                    <div class="card-body" style="position: relative;">
                        <div id="chart-col-3" style="min-height: 200px;">
                            <div id="apexchartsrqkifgzj" class="apexcharts-canvas apexchartsrqkifgzj" style="width: 0px; height: 200px;"><svg id="SvgjsSvg1420" width="0" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" class="apexcharts-svg" xmlns:data="ApexChartsNS" transform="translate(0, 0)" style="background: transparent;">
                                    <g id="SvgjsG1422" class="apexcharts-inner apexcharts-graphical">
                                        <defs id="SvgjsDefs1421"></defs>
                                    </g>
                                </svg>
                                <div class="apexcharts-legend"></div>
                            </div>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 1px; height: 1px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                    <div class="p-0 d-block card-footer">
                        <div class="grid-menu grid-menu-2col">
                            <div class="no-gutters row">
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-success">
                                        <i class="lnr-lighter text-success opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Accounts
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-warning">
                                        <i class="lnr-construction text-warning opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Contacts
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-info">
                                        <i class="lnr-bus text-info opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Products
                                    </button>
                                </div>
                                <div class="p-2 col-sm-6">
                                    <button class="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-alternate">
                                        <i class="lnr-gift text-alternate opacity-7 btn-icon-wrapper mb-2"> </i>
                                        Services
                                    </button>
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