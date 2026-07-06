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

    <!-- Header Title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <i class="bi bi-gear fs-4"></i>
            </div>
            <div>
                <h4 class="mb-1 fw-bold">Property Listing</h4>
                <p class="text-muted mb-0">Manage all properties listed on your platform.</p>
            </div>
        </div>
        <div class="text-muted small fw-medium">
            <a href="{{ url('/') }}" class="text-decoration-none text-primary">Home</a> &gt; Properties
        </div>
    </div>
    <div id="successMessageContainer"></div>

    @php
        $post_for = get_property_for_types();
        $property_types = get_all_property_category();
        $cities = get_all_city();
    @endphp

    <!-- Summary Cards -->
    <div class="row mb-4 g-3">
        <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-3 text-primary me-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                        <i class="bi bi-house fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-1 fs-6">Total Properties</p>
                        <h4 class="fw-bold mb-1">{{ $data->total() ?? '1,256' }}</h4>
                        <span class="text-success small fw-semibold"><i class="bi bi-arrow-up"></i> 12.5%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 rounded-3 text-success me-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                        <i class="bi bi-check-circle fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-1 fs-6">Active Properties</p>
                        <h4 class="fw-bold mb-1">982</h4>
                        <span class="text-success small fw-semibold"><i class="bi bi-arrow-up"></i> 18.4%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-warning bg-opacity-10 rounded-3 text-warning me-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                        <i class="bi bi-clock fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-1 fs-6">Pending Properties</p>
                        <h4 class="fw-bold mb-1">156</h4>
                        <span class="text-success small fw-semibold"><i class="bi bi-arrow-up"></i> 8.6%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card border-0 shadow-sm rounded-3 h-100">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-danger bg-opacity-10 rounded-3 text-danger me-3 d-flex align-items-center justify-content-center" style="width: 54px; height: 54px;">
                        <i class="bi bi-x-circle fs-4"></i>
                    </div>
                    <div>
                        <p class="text-muted mb-1 fs-6">Inactive Properties</p>
                        <h4 class="fw-bold mb-1">118</h4>
                        <span class="text-danger small fw-semibold"><i class="bi bi-arrow-up"></i> 6.3%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Table Container -->
    <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4">
            <!-- Filter Actions -->
            <form action="{{ url('allproperties/all-property-view') }}" method="get">
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div class="d-flex gap-2 flex-grow-1 flex-wrap">
                        <div class="position-relative" style="min-width: 250px;">
                            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input type="text" class="form-control ps-5 bg-light border-0 shadow-none" name="term" placeholder="Search properties..." value="{{ request('term') }}" style="border-radius: 8px; height: 42px;">
                        </div>
                        <select class="form-select bg-light border-0 shadow-none text-muted" name="post_for" style="width: 130px; border-radius: 8px; height: 42px;">
                            <option value="">All Status</option>
                            @foreach ($post_for as $k => $t)
                                <option value="{{ $k }}" {{ request('post_for') == $k ? 'selected' : '' }}>{{ $t }}</option>
                            @endforeach
                        </select>
                        <select class="form-select bg-light border-0 shadow-none text-muted" name="property_type" style="width: 130px; border-radius: 8px; height: 42px;">
                            <option value="">All Type</option>
                            @foreach ($property_types as $k => $t)
                                <option value="{{ $t->id }}" {{ request('property_type') == $t->id ? 'selected' : '' }}>{{ $t->name }}</option>
                            @endforeach
                        </select>
                        <select class="form-select bg-light border-0 shadow-none text-muted" name="city" style="width: 130px; border-radius: 8px; height: 42px;">
                            <option value="">All Location</option>
                            @foreach ($cities as $k => $c)
                                <option value="{{ $c->city_id }}" {{ request('city') == $c->city_id ? 'selected' : '' }}>{{ $c->name }}</option>
                            @endforeach
                        </select>
                        <button type="submit" class="btn btn-outline-secondary d-flex align-items-center gap-2 border-1" style="border-radius: 8px; height: 42px;">
                            <i class="bi bi-funnel"></i> Filter
                        </button>
                    </div>
                    <div class="d-flex gap-2">
                        @if (!empty($srch['user_id']))
                        <a href="{{ url('post-property?uid=' . $srch['user_id']) }}" class="btn btn-primary d-flex align-items-center gap-2" style="border-radius: 8px; height: 42px;">
                            <i class="bi bi-plus fs-5"></i> Add New Property
                        </a>
                        @else
                        <a href="{{ url('post-property') }}" class="btn btn-primary d-flex align-items-center gap-2" style="border-radius: 8px; height: 42px;">
                            <i class="bi bi-plus fs-5"></i> Add New Property
                        </a>
                        @endif
                        <button type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2 border-1" style="border-radius: 8px; height: 42px;">
                            <i class="bi bi-download"></i> Export
                        </button>
                    </div>
                </div>
            </form>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-borderless align-middle mb-0" style="min-width: 1000px;">
                    <thead>
                        <tr class="text-muted" style="border-bottom: 2px solid #f1f5f9;">
                            <th class="fw-semibold pb-3 fs-6">Property</th>
                            <th class="fw-semibold pb-3 fs-6">Location</th>
                            <th class="fw-semibold pb-3 fs-6">Type</th>
                            <th class="fw-semibold pb-3 fs-6">Price</th>
                            <th class="fw-semibold pb-3 fs-6">Status</th>
                            <th class="fw-semibold pb-3 fs-6">Added On</th>
                            <th class="fw-semibold pb-3 fs-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($data as $property)
                        <tr style="border-bottom: 1px solid #f8fafc;">
                            <td class="py-3">
                                <div class="d-flex align-items-center gap-3">
                                    @php
                                    $relativePath = 'user_upload/property_images/' . $property->filename;
                                    $localPath = public_path($relativePath);
                                    $imageToShow = isset($property->filename) && file_exists($localPath)
                                        ? asset($relativePath)
                                        : asset(config('constants.NO_IMAGE_PROPERTY'));
                                    @endphp
                                    <img src="{{ $imageToShow }}" alt="Property" class="rounded-3 object-fit-cover shadow-sm" width="70" height="50">
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark fs-6">{{ $property->name }}</h6>
                                        <p class="text-muted mb-0 small fw-medium">ID: RE-{{ str_pad($property->id, 6, '0', STR_PAD_LEFT) }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="bg-light p-2 rounded-circle text-muted d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                                        <i class="bi bi-geo-alt"></i>
                                    </div>
                                    <div>
                                        <span class="d-block text-dark fw-bold fs-6 text-truncate" style="max-width: 200px;">{{ $property->property_address ?? 'N/A' }}</span>
                                        <span class="text-muted small fw-medium">
                                            @php
                                            $cityName = '';
                                            $propCity = $property->city ?? ($property->city_id ?? null);
                                            if ($propCity) {
                                                foreach($cities as $c) {
                                                    if($c->city_id == $propCity) {
                                                        $cityName = $c->name;
                                                        break;
                                                    }
                                                }
                                            }
                                            echo $cityName ? $cityName : 'Unknown';
                                            @endphp
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3 text-muted fw-medium">
                                @php
                                $typeName = 'Apartment';
                                $propType = $property->property_type ?? ($property->type_id ?? null);
                                if ($propType) {
                                    foreach($property_types as $t) {
                                        if($t->id == $propType) {
                                            $typeName = $t->name;
                                            break;
                                        }
                                    }
                                }
                                echo $typeName;
                                @endphp
                            </td>
                            <td class="py-3 fw-bold text-dark fs-6">
                                {{ get_setting('site-currency') . formatPrice($property->expected_price, get_setting('site-currency-code')) }}
                            </td>
                            <td class="py-3">
                                @if($property->status == 'active' || $property->status == 1 || $property->status == '1')
                                    <span class="badge text-success fw-bold" style="background-color: #dcfce7; padding: 0.5rem 1rem; border-radius: 6px;">Active</span>
                                @elseif($property->status == 'pending' || $property->status == 2)
                                    <span class="badge text-warning fw-bold" style="background-color: #fef3c7; padding: 0.5rem 1rem; border-radius: 6px;">Pending</span>
                                @elseif($property->status == 'sold' || $property->status == 3 || $property->status == '0')
                                    <span class="badge text-danger fw-bold" style="background-color: #fee2e2; padding: 0.5rem 1rem; border-radius: 6px;">Sold</span>
                                @else
                                    <span class="badge text-secondary fw-bold" style="background-color: #f1f5f9; padding: 0.5rem 1rem; border-radius: 6px;">{{ ucfirst($property->status) }}</span>
                                @endif
                            </td>
                            <td class="py-3 text-muted fw-medium">
                                {{ date('M d, Y', strtotime($property->created_at)) }}
                            </td>
                            <td class="py-3 text-center">
                                <div class="d-flex justify-content-center gap-2">
                                    <a href="{{ url('/enquiry/property-leads/' . $property->id) }}" class="btn btn-sm btn-light rounded-circle text-secondary border shadow-sm" style="width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="{{ url('property/edit/' . $property->id) }}" class="btn btn-sm btn-light rounded-circle text-primary border shadow-sm" style="width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="bi bi-pencil"></i>
                                    </a>
                                    <button class="btn btn-sm btn-light rounded-circle text-danger border shadow-sm change-status-btn" data-property-id="{{ $property->id }}" data-status="delete" style="width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s;">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" class="text-center py-5">
                                <i class="bi bi-house text-muted" style="font-size: 3rem;"></i>
                                <h5 class="mt-3 text-muted">No Properties Found</h5>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="mt-4 pt-3 border-top">
                {{ $data->links('vendor.pagination.bootstrap-5') }}
            </div>
        </div>
    </div>
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
