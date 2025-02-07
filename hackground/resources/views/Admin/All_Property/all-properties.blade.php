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

    <form action="{{ url('allproperties/all-property-view') }}" method="get">
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

                <div class="btn-actions-pane-right">
                        <a href="{{ url('post-property') }}" class="btn btn-sm btn-success">Add Property</a>
                    </div>
                    

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
                                    <img src="{{ asset('user_upload/property_images/' . $property->filename) }}" alt="no image"
                                        class="rounded mr-2" height="42" width="64">
                                </a>
                            </td>
                            <td><a href="http://localhost:3002/property-details/{{$property->slug}}">{{ $property->name }}</a></td>
                            <td>{{ $property->post_for }}</td>
                            <td>{{ $property->property_address }}</td>
                            <td>{{ $property->expected_price }} <small>{{ $property->price_currency }}</small></td>
                            <td>{{ $property->created_at }}</td>
                            <td>
                                <div class="col-auto  mb-2">
                                    <select name="prop_status" id="prop_status"
                                        data-property-id="{{ $property->id }}"
                                        class="prop_status form-control form-control-sm">
                                        @foreach ($statusMapping as $key => $value)
                                        <option value="{{ $value }}"
                                            {{ $property->status == $key ? 'selected' : '' }}>
                                            {{ strtoupper($value) }}
                                        </option>
                                        @endforeach
                                        <option value="delete">DELETE</option>
                                    </select>

                                </div>
                                <div class="row">
                                    <!-- <div class="col-auto">
                                        <input type="checkbox" class=" prop_feature_status d-none"
                                            data-prop-id="{{ $property->id }}" data-toggle="toggle" data-on="FEATURED"
                                            data-off="MAKE FEATURED" data-onstyle="warning" data-offstyle="secondary"
                                            data-size="small" {{ $property->is_featured ? 'checked' : '' }}>
                                    </div>

                                    <div class="col-auto">
                                        <input type="checkbox" class=" prop_feature_status d-none"
                                            data-prop-id="{{ $property->id }}" data-toggle="toggle" data-on="TOP"
                                            data-off="MAKE TOP" data-onstyle="warning" data-offstyle="secondary"
                                            data-size="small" {{ $property->is_featured ? 'checked' : '' }}>
                                    </div> -->
                                    <input type="checkbox" class="prop_feature_status" data-prop-id="{{ $property->id }}" name="" id="" {{ $property->is_featured ? 'checked' : '' }}>Featured
                                    <input class="prop_top_status" data-prop-id="{{ $property->id }}" type="checkbox" name="" id="" {{ $property->is_top ? 'checked' : '' }}>Top

                                </div>
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




@push('custom-js')
<script>
    $(document).ready(function() {

        $('.prop_feature_status').change(function() {



            var id = $(this).data('prop-id');
            var status = this.checked ? 1 : 0;

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                type: 'POST',
                url: `{{ url('allproperties/feature_status') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    toastr.success('Request processed successfully.', data.message,
                        toastrOptions);
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });

        $('.prop_top_status').on('change',function() {

            var id = $(this).data('prop-id');
            var status = this.checked ? 1 : 0;

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });

            $.ajax({
                type: 'POST',
                url: `{{ url('allproperties/top_status') }}`,
                data: {
                    'status': status,
                    'id': id
                },
                success: function(data) {
                    toastr.success('Request processed successfully.', data.message,
                        toastrOptions);
                },
                error: function(msg) {
                    console.log(msg);
                    var errors = msg.responseJSON;
                }
            });
        });

        $('.prop_status').on('change', function() {
            var propertyId = $(this).data('property-id');
            var status = $(this).val();


            var url = (status === 'delete') ?
                `{{ url('allproperties/delete') }}` :
                `{{ url('allproperties/statusupdate') }}`;


            $.ajax({
                url: url,
                method: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    status: status,
                    propertyId: propertyId
                },
                success: function(response) {

                    console.log(response);
                    window.location.reload(true);
                },
                error: function(xhr, status, error) {

                    console.log(error);
                }
            });
        });

    });
</script>
@endpush