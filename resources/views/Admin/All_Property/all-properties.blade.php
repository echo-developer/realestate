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
                    <div>Property
                        <div class="page-title-subheading">Property &gt; Property List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
                        <li class="breadcrumb-item active">Property List</li>
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

        <form action="{{ url('property/category') }}" method="get">
            <section class="content-header mb-2">
                <div class="row">
                    <div class="offset-sm-8 col-sm-4">
                        <div class="input-group">
                            <input class="form-control" id="prop_category_search" placeholder="Search..." name="term"
                                value="{{ request('term') }}" />
                            <div class="input-group-append">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Property List

                    {{-- <div class="btn-actions-pane-right">
                        <button type="button" class="btn btn-sm btn-success" onclick="add_prop_category()">Add Property
                            Category</button>
                    </div> --}}

                </div>

                <div class="table-responsive" id="main_table">
                    <table id='table' class="mb-0 table">
                        <thead>
                            <tr>
                                <th style="width:10%">Photo</th>
                                <th style="width:20%">Property</th>
                                <th style="width:8%">Type</th>
                                <th style="width:20%">Address</th>
                                <th style="width:8%">Price</th>
                                <th style="width:15%">Post Date</th>
                                <th style="min-width:5px;" class="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data as $key => $property)
                                <tr>
                                    <td>
                                        <a href="#" class="d-flex align-items-center" style="line-height:1.25;">
                                            <img src="{{ asset('property_images/' . $property->filename) }}" alt="no image"
                                                class="rounded mr-2" height="42" width="64">
                                        </a>
                                    </td>
                                    <td>{{ $property->name }}</td>
                                    <td>{{ $property->post_for }}</td>
                                    <td>{{ $property->property_address }}</td>
                                    <td>{{ $property->expected_price }} <small>{{ $property->price_currency }}</small></td>
                                    <td>{{ $property->created_at }}</td>
                                    <td class="d-flex justify-content-end">
                                        <div class="col-8">
                                            <select name="staus" id="status" class="form-control form-control-sm">
                                                <option value=""></option>
                                                <option value=""></option>
                                                <option value=""></option>
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>


                    </table>
                </div>


                {{-- @if ($data->isNotEmpty())
                    <div class="card-footer pagination-rounded clearfix justify-content-center">
                        <ul class="pagination small mb-0">
                            @if ($data->currentPage() == $data->lastPage() && $data->currentPage() != 1)
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url(1) }}" class="page-link"
                                        rel="start">
                                        <i class="fa fa-chevron-left"></i> First
                                    </a>
                                </li>
                            @endif

                            <li class="page-item {{ $data->currentPage() == 1 ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->previousPageUrl() }}"
                                    class="page-link" rel="prev">
                                    <i class="fa fa-chevron-left"></i>
                                </a>
                            </li>

                            @for ($i = max($data->currentPage() - 1, 1); $i <= min($data->currentPage() + 1, $data->lastPage()); $i++)
                                <li class="page-item {{ $data->currentPage() == $i ? 'active' : '' }}">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($i) }}"
                                        class="page-link">{{ $i }}</a>
                                </li>
                            @endfor

                            <li class="page-item {{ $data->currentPage() == $data->lastPage() ? 'disabled' : '' }}">
                                <a href="{{ $data->appends(['term' => request('term')])->nextPageUrl() }}"
                                    class="page-link" rel="next">
                                    <i class="fa fa-chevron-right"></i>
                                </a>
                            </li>

                            @if ($data->currentPage() != $data->lastPage())
                                <li class="page-item">
                                    <a href="{{ $data->appends(['term' => request('term')])->url($data->lastPage()) }}"
                                        class="page-link" rel="end">
                                        Last <i class="fa fa-chevron-right"></i>
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </div>
                @endif --}}
            </div>
        </div>
    </div>
@endsection
