@extends('Admin.layouts.app')

{{-- @dd($data) --}}
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

    @php
        $post_for = get_property_for_types();
        $property_types = get_all_property_category();
        $cities = get_all_city();
    @endphp

    <form action="{{ url('allproperties/all-property-view') }}" method="get" class="form-horizontal">
        <div class="card mb-4 shadow-sm border-0" style="border-radius: 12px; background-color: #fff;">
            <div class="card-body p-4">
                <!-- Row 1: Search Term & Date Range -->
                <div class="row g-3 align-items-end mb-3">
                    <div class="col-lg-7 col-md-12">
                        <div class="form-group mb-0 position-relative">
                            <span class="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted" style="pointer-events: none; z-index: 5;">
                                <i class="bi bi-search" style="font-size: 1.1rem; color: #94a3b8;"></i>
                            </span>
                            <input type="text" class="form-control" name="term"
                                   placeholder="Search by Property Name, User Name, City, etc."
                                   value="{{ request('term') }}"
                                   style="padding-left: 2.75rem; height: 50px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 0.95rem; color: #1e293b;">
                        </div>
                    </div>
                    <div class="col-lg-5 col-md-12">
                        <div class="form-group mb-0">
                            <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Filter by Date Range</label>
                            <div class="d-flex align-items-center justify-content-between p-1 bg-white border" style="height: 50px; border-radius: 10px; border: 1px solid #e2e8f0 !important;">
                                <input type="date" class="form-control border-0 shadow-none bg-transparent" name="start_date" placeholder="Start Date" value="{{ request('start_date') }}" style="height: 100%; font-size: 0.9rem; color: #1e293b;">
                                <span class="mx-2 text-muted fw-medium" style="font-size: 1.1rem;">→</span>
                                <input type="date" class="form-control border-0 shadow-none bg-transparent" name="end_date" placeholder="End Date" value="{{ request('end_date') }}" style="height: 100%; font-size: 0.9rem; color: #1e293b;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Dropdowns & Action Buttons -->
                <div class="row g-3 align-items-end">
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="form-group mb-0">
                            <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Property For</label>
                            <select class="form-select" name="post_for" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                                <option value="">Select</option>
                                @foreach ($post_for as $k => $t)
                                    <option value="{{ $k }}" {{ request('post_for') == $k ? 'selected' : '' }}>{{ $t }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="form-group mb-0">
                            <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">City</label>
                            <select class="form-select" name="city" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                                <option value="">Select</option>
                                @foreach ($cities as $k => $c)
                                    <option value="{{ $c->city_id }}" {{ request('city') == $c->city_id ? 'selected' : '' }}>{{ $c->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <div class="form-group mb-0">
                            <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Property Type</label>
                            <select class="form-select" name="property_type" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                                <option value="">Select</option>
                                @foreach ($property_types as $k => $t)
                                    <option value="{{ $t->id }}" {{ request('property_type') == $t->id ? 'selected' : '' }}>{{ $t->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-6 d-flex align-items-center justify-content-end gap-3 pt-2">
                        <a href="{{ url('allproperties/all-property-view') }}" class="btn btn-outline-primary fw-medium px-4 d-flex align-items-center justify-content-center gap-2" style="height: 48px; border-radius: 8px; font-size: 0.9rem; border: 1px solid #3b82f6; color: #3b82f6; transition: all 0.2s; background: transparent;">
                            <i class="bi bi-arrow-counterclockwise" style="font-size: 1.1rem;"></i> Reset
                        </a>
                        <button type="submit" class="btn btn-primary fw-medium px-4 d-flex align-items-center justify-content-center gap-2" style="height: 48px; border-radius: 8px; font-size: 0.9rem; background-color: #3b82f6; border-color: #3b82f6; transition: all 0.2s; flex-grow: 1;">
                            <i class="bi bi-search" style="font-size: 1rem;"></i> Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <div class="d-flex">
        <p></p>
        @if (!empty($srch['user_id']))
        <div class="btn-actions-pane-right">
            <a href="{{ url('post-property?uid=' . $srch['user_id']) }}" class="btn btn-sm btn-success mb-2">Add
                Property</a>
        </div>
        @endif
    </div>

    <div class="row" id="main_table">
        @forelse ($data as $key => $property)
        <article class="col-lg-4 col-sm-6 mb-4">
            <div class="custom-prop-card">
                <!-- Card Image Wrapper -->
                <div class="prop-card-img-wrapper">
                    @php
                    $relativePath = 'user_upload/property_images/' . $property->filename;
                    $localPath = public_path($relativePath);

                    $imageToShow = isset($property->filename) && file_exists($localPath)
                        ? asset($relativePath)
                        : asset(config('constants.NO_IMAGE_PROPERTY'));
                    @endphp
                    <a href="#">
                        <img src="{{ $imageToShow }}" alt="Property Image" class="prop-card-img">
                    </a>

                    <!-- Left Overlay Badges -->
                    <div class="prop-badges-left">
                        <span class="prop-badge-type {{ $property->post_for === 'rent' ? 'rent' : 'sale' }}">
                            {{ strtoupper($property->post_for) }}
                        </span>
                        @if($property->is_featured)
                        <span class="prop-badge-featured">
                            <i class="bi bi-star-fill me-1 text-white"></i> Featured
                        </span>
                        @endif
                        @if($property->is_top)
                        <span class="prop-badge-top">
                            <i class="bi bi-fire me-1 text-white"></i> Top Pick
                        </span>
                        @endif
                    </div>

                    <!-- Right Absolute 3-Dot Actions -->
                    <div class="dropdown custom-dropdown pos-three-dots">
                        <button class="btn btn-three-dots" type="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                            <li>
                                <a class="dropdown-item toggle-featured-btn"
                                   href="#"
                                   data-property-id="{{ $property->id }}"
                                   data-status="{{ $property->is_featured ? 0 : 1 }}">
                                   @if($property->is_featured)
                                   <i class="bi bi-check2 me-1 text-primary"></i>
                                   @endif
                                   Featured
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item toggle-top-btn"
                                   href="#"
                                   data-property-id="{{ $property->id }}"
                                   data-status="{{ $property->is_top ? 0 : 1 }}">
                                   @if($property->is_top)
                                   <i class="bi bi-check2 me-1 text-primary"></i>
                                   @endif
                                   Top
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Card Content Body -->
                <div class="prop-card-body">
                    <!-- Price and Leads Counter -->
                    <div class="prop-price-row">
                        <span class="prop-price">
                            {{ get_setting('site-currency') . formatPrice($property->expected_price, get_setting('site-currency-code')) }}
                        </span>
                        <a href="{{ url('/enquiry/property-leads/' . $property->id) }}" class="prop-leads-badge-new" title="View Leads">
                            <i class="bi bi-eye text-primary me-1 fs-5"></i>
                            <span class="prop-leads-count-new">{{ propertyLeadsCount($property->id) }}</span>
                        </a>
                    </div>

                    <!-- Title -->
                    <h4 class="prop-title">
                        <a href="{{ url('property/edit/' . $property->id) }}" title="{{ $property->name }}">{{ $property->name }}</a>
                    </h4>

                    <!-- Specs Row -->
                    <div class="prop-specs-row">
                        @if(!empty($property->bedrooms))
                        <span class="prop-spec-item" title="Bedrooms">
                            <i class="bi bi-door-closed"></i> {{ $property->bedrooms }} Bed{{ $property->bedrooms > 1 ? 's' : '' }}
                        </span>
                        @endif
                        @if(!empty($property->bathrooms))
                        <span class="prop-spec-item" title="Bathrooms">
                            <i class="bi bi-droplet"></i> {{ $property->bathrooms }} Bath{{ $property->bathrooms > 1 ? 's' : '' }}
                        </span>
                        @endif
                        @if(!empty($property->super_area) || !empty($property->carpet_area))
                        <span class="prop-spec-item" title="Area">
                            <i class="bi bi-arrows-angle-expand"></i> {{ $property->super_area ?: $property->carpet_area }} Sq-ft
                        </span>
                        @endif
                    </div>

                    <!-- Location and Date info -->
                    <div class="prop-info-list">
                        <div class="prop-info-item" title="{{ $property->property_address }}">
                            <i class="ri-map-pin-line"></i>
                            <span class="text-truncate" style="max-width: 100%;">{{ $property->property_address }}</span>
                        </div>
                        <div class="prop-info-item">
                            <i class="ri-calendar-line"></i>
                            <span>{{ date('Y-m-d', strtotime($property->created_at)) }}</span>
                        </div>
                    </div>

                    <!-- Footer controls -->
                    <div class="prop-card-footer">
                        <div class="prop-actions">
                            <!-- Actions Dropdown -->
                            <div class="dropdown custom-dropdown">
                                <button class="btn btn-actions dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-sliders2 me-1"></i> Actions <i class="bi bi-chevron-down ms-1"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                    @foreach ($statusMapping as $k => $val)
                                    <li>
                                        <a class="dropdown-item change-status-btn {{ $property->status == $k ? 'active' : '' }}"
                                           href="#"
                                           data-property-id="{{ $property->id }}"
                                           data-status="{{ $val }}">
                                           @if($property->status == $k)
                                           <i class="bi bi-check2 me-1 text-primary"></i>
                                           @endif
                                           {{ ucfirst(strtolower($val)) }}
                                        </a>
                                    </li>
                                    @endforeach
                                    <li>
                                        <a class="dropdown-item change-status-btn text-danger"
                                           href="#"
                                           data-property-id="{{ $property->id }}"
                                           data-status="delete">
                                           Delete
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <!-- Edit and View Button -->
                            <a href="{{ url('property/edit/' . $property->id) }}" class="btn btn-edit-view">
                                <i class="bi bi-pencil-square me-1"></i> Edit and View
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        @empty
        <div class="col-12">
            <div class="card">
                <div class="card-body text-center py-5">
                    <i class="ri-home-line" style="font-size: 48px; color: #ccc;"></i>
                    <h5 class="mt-3 text-muted">No Properties Found</h5>
                </div>
            </div>
        </div>
        @endforelse
    </div>
    {{ $data->links('vendor.pagination.bootstrap-5') }}
</div>
@endsection

@push('custom-js')
<script>
    $(document).ready(function() {

        $(document).on('click', '.toggle-featured-btn', function(e) {
            e.preventDefault();
            var id = $(this).data('property-id');
            var status = $(this).data('status');

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
                    window.location.reload(true);
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        });

        $(document).on('click', '.toggle-top-btn', function(e) {
            e.preventDefault();
            var id = $(this).data('property-id');
            var status = $(this).data('status');

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
                    window.location.reload(true);
                },
                error: function(msg) {
                    console.log(msg);
                }
            });
        });

        $(document).on('click', '.change-status-btn', function(e) {
            e.preventDefault();
            var propertyId = $(this).data('property-id');
            var status = $(this).data('status');

            if (status === 'delete') {
                common_delete_confirm(function() {
                    $.ajax({
                        url: `{{ url('allproperties/delete') }}`,
                        method: 'POST',
                        data: {
                            _token: '{{ csrf_token() }}',
                            status: status,
                            propertyId: propertyId
                        },
                        success: function(response) {
                            window.location.reload(true);
                        },
                        error: function(xhr, status, error) {
                            console.log(error);
                        }
                    });
                }, 'Delete Property?', 'Are you sure you want to delete this property?');
            } else {
                $.ajax({
                    url: `{{ url('allproperties/statusupdate') }}`,
                    method: 'POST',
                    data: {
                        _token: '{{ csrf_token() }}',
                        status: status,
                        propertyId: propertyId
                    },
                    success: function(response) {
                        window.location.reload(true);
                    },
                    error: function(xhr, status, error) {
                        console.log(error);
                    }
                });
            }
        });

    });
</script>
@endpush
