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

<div class="app-main__inner mb-3">

    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="bi bi-houses"></i>
                </div>
                <div>Property
                    <div class="page-title-subheading">Property Setting <i class="bi bi-chevron-right"></i> Property List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
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
    <div class="alert alert-{{ session('message_type') }} alert-dismissible">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">

        </button>
    </div>
    @endif

    {{-- <form action="{{ url('allproperties/all-property-view') }}" method="get">
    <section class="content-header mb-2">
        <div class="row justify-content-end">
            <div class="col-xl-4 col-lg-6">
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
    </form> --}}

    <form action="{{ url('allproperties/all-property-view') }}" method="get" class="form-horizontal">
        {{-- <div class="row">
            <div class="col-xl-4 col-lg-6 col-12">
                <div class="form-field">
                <label>Search by ID</label>
                <div class="input-group">
                    <input type="search" class="form-control rounded-2" name="unique_id" placeholder="Profile ID" value="<?php echo !empty($srch['unique_id']) ? $srch['unique_id'] : ''; ?>">
                    <a href="javascript:void(0)" class="btn btn-site ml-3" title="Advance Search" onclick="$('#advanceFilter').slideToggle();"><i class="bi bi-funnel"></i></a>
                </div>
                </div>
            </div>
            </div> --}}
        <div class="row gx-3 mb-4">
            <div class="col-lg col-12">
                <input type="text" class="form-control" name="term" placeholder="Property Name" value="<?php echo !empty($srch['term']) ? $srch['term'] : ''; ?>">
            </div>
            <div class="col-lg-auto col-12">
                <button type="submit" class="btn btn-primary btn-block">Search</button>
            </div>
            <div class="col-lg-auto col-12">
                <button type="button" onclick="$('#advanceFilter').slideToggle();" class="btn btn-outline-primary">
                <i class="bi bi-funnel"></i> Advanced
                </button>
            </div>
        </div>


        <div class="card mb-3" id="advanceFilter" style="display: none;">
            <div class="card-body pt-4">
                <div class="row gx-3 -mb-3">

                    @if (!$user_id)
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">

                            <input type="text" class="form-control" name="username" placeholder="Name"
                                value="<?php echo !empty($srch['username']) ? $srch['username'] : ''; ?>">
                            <label>User Name</label>
                        </div>
                    </div>
                    @endif

                    @php
                    $post_for = get_property_for_types();
                    @endphp
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">

                            <select class="form-select" name="post_for">
                                <option value="">--Select--</option>
                                @if ($post_for)
                                @foreach ($post_for as $k => $t)
                                <option value="{{ $k }}" <?php echo !empty($srch['post_for']) && $srch['post_for'] == $k ? 'selected' : ''; ?>>{{ $t }}</option>
                                @endforeach
                                @endif
                            </select>
                            <label>Post For</label>
                        </div>
                    </div>

                    @php
                    $property_types = get_all_property_category();
                    @endphp
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">
                            <select class="form-select" name="property_type">
                                <option value="">--Select--</option>
                                @if ($property_types)
                                @foreach ($property_types as $k => $t)
                                <option value="{{ $t->id }}" <?php echo !empty($srch['property_types']) && $srch['property_types'] == $t->id ? 'selected' : ''; ?>>{{ $t->name }}</option>
                                @endforeach
                                @endif
                            </select>
                            <label>Property Type</label>
                        </div>
                    </div>

                    @php
                    $property_types_for = get_all_property_sub_category();
                    @endphp
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">
                            <select class="form-select" name="property_for">
                                <option value="">--Select--</option>
                                @if ($property_types_for)
                                @foreach ($property_types_for as $k => $t)
                                <option value="{{ $t->id }}" <?php echo !empty($srch['property_for']) && $srch['property_for'] == $t->id ? 'selected' : ''; ?>>{{ $t->name }}</option>
                                @endforeach
                                @endif
                            </select>
                            <label>Property For</label>
                        </div>
                    </div>

                    @php
                    $cities = get_all_city();
                    @endphp
                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">

                            <select class="form-select" name="city">
                                <option value="">--Select--</option>
                                @if ($cities)
                                @foreach ($cities as $k => $c)
                                <option value="{{ $c->city_id }}" <?php echo !empty($srch['city']) && $srch['city'] == $c->city_id ? 'selected' : ''; ?>>{{ $c->name }}
                                </option>
                                @endforeach
                                @endif
                            </select>
                            <label>City</label>
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-floating mb-4">
                            <input type="date" class="form-control" name="post_date" placeholder="Post Date"
                                value="<?php echo !empty($srch['post_date']) ? $srch['post_date'] : ''; ?>" autocomplete="off">
                            <label>Post Date</label>
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-4 col-sm-6">
                        <div class="form-field mb-0">
                            <button class="btn btn-primary btn-block">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="d-flex">
        <p></p>
        @if ($srch['user_id'])
        <div class="btn-actions-pane-right">
            <a href="{{ url('post-property?uid=' . $srch['user_id']) }}" class="btn btn-sm btn-success">Add
                Property</a>
        </div>
        @endif
    </div>

    <div class="row" id="main_table">
        @foreach ($data as $key => $property)
        <article class="col-lg-4 col-sm-6">
            <div class="card card-ads">
                <div class="card-image">
                    @php
                    $relativePath = 'user_upload/property_images/' . $property->filename;
                    $localPath = public_path($relativePath);

                    $imageToShow =
                    isset($property->filename) && file_exists($localPath)
                    ? asset($relativePath)
                    : asset(config('constants.NO_IMAGE_PROPERTY'));
                    @endphp
                    <a href="#">
                        <img src="{{ $imageToShow }}" alt="no image" class="card-img" height="250" width="300">
                    </a>
                    <span class="ads-type {{ $property->post_for=== 'rent'?'rent':'sale' }}">{{ $property->post_for }}</span>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h3><small>{{ $property->price_currency }}</small>{{ $property->expected_price }}</h3>

                        <span>
                            <a href="{{ url('/enquiry/property-leads/' . $property->id) }}" title="View Leads"><i class="ri-eye-fill"></i></a>
                            {{ propertyLeadsCount($property->id) }}
                        </span>
                    </div>

                    <h4><a href="{{ url('property/edit/' . $property->id) }}">{{ $property->name }}</a></h4>
                    <p class="mb-2"><i class="ri-map-pin-line"></i> {{ $property->property_address }}</p>
                    <p><i class="ri-calendar-line"></i> {{ $property->created_at }}</p>
                    <div class="row">
                        <div class="col-xxl">
                            <div class="form-check-inline small">
                                <input type="checkbox" class="form-check-input prop_feature_status"
                                    data-prop-id="{{ $property->id }}" name="" id="featured"
                                    {{ $property->is_featured ? 'checked' : '' }}>
                                <label class="form-check-label" for="featured">Featured</label>
                            </div>
                            <div class="form-check-inline small">
                                <input class="form-check-input prop_top_status" data-prop-id="{{ $property->id }}"
                                    type="checkbox" name="" id="top"
                                    {{ $property->is_top ? 'checked' : '' }}>
                                <label class="form-check-label" for="top">Top</label>
                            </div>
                        </div>
                        <div class="col-xxl-auto">
                            <select name="prop_status" id="prop_status"
                                data-property-id="{{ $property->id }}"
                                class="prop_status form-select form-select-sm">
                                @foreach ($statusMapping as $key => $value)
                                <option value="{{ $value }}"
                                    {{ $property->status == $key ? 'selected' : '' }}>
                                    {{ strtoupper($value) }}
                                </option>
                                @endforeach
                                <option value="delete">DELETE</option>
                                <option value="edit_view">Edit And View</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </article>
        @endforeach
    </div>
    {{ $data->links('vendor.pagination.bootstrap-5') }}
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

        $('.prop_top_status').on('change', function() {

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
            switch (status) {
                case 'delete':
                    var url = `{{ url('allproperties/delete') }}`
                    break;
                case 'edit_view':
                    window.location.href = `{{ url('property/edit') }}/${propertyId}`
                    return;
                default:
                    var url = `{{ url('allproperties/statusupdate') }}`
                    break;
            }

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