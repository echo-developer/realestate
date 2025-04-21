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
                    <div>Loan Enquery
                        <div class="page-title-subheading">Bank &gt; Loan Enquery List</div>
                    </div>
                </div>
                <div class="page-title-actions">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                        <li class="breadcrumb-item active">Loan Enquery List</li>
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
                    
                </button>
            </div>
        @endif

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Loan Enquery List

                </div>

                <div class="table-responsive" id="main_table">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Loan Amount (₹)</th>
                                <th>Tenure (Months)</th>
                                <th>Property Identified</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data as $item)
                                <tr>
                                    <td>{{ $item->user_name ?? 'N/A' }}</td>
                                    <td>{{ $item->phone ?? 'N/A' }}</td>
                                    <td>{{ $item->email ?? 'N/A' }}</td>
                                    <td>{{ $item->address ?? 'N/A' }}</td>
                                    <td>{{ number_format($item->loan_amount, 2) }}</td>
                                    <td>{{ $item->tenure }} months</td>
                                    <td>
                                        @if ($item->is_property_identified)
                                            <span class="badge bg-success">Yes</span>
                                        @else
                                            <span class="badge bg-warning">No</span>
                                        @endif
                                    </td>
                                    <td><small>{{ \Carbon\Carbon::parse($item->created_at)->format('d M Y h:i A') }}</small>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>


                </div>
                @if ($data->isNotEmpty())
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
                @endif
            </div>
        </div>
    </div>
@endsection
