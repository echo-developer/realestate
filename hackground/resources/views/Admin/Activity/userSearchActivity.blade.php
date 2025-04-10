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
                        <li class="breadcrumb-item"><a href=""> Home</a></li>
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
        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        @endif

        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="card-header p-0">
                    <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Activity List

                </div>

                <div class="table-responsive" id="main_table">
                    <table class="table table-bordered">
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
                            @foreach ($data as $act)
                                <tr>
                                    <td>{{ $act->user_name ?? 'N/A' }}</td>
                                    <td>
                                        <span class="badge bg-info">{{ $act->post_for }}</span>
                                        <br>
                                        <span class="badge bg-success">{{ $act->property_type }}</span><br>
                                        <span class="badge bg-warning"><small>{{ $act->property_for }}</small></span>
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
