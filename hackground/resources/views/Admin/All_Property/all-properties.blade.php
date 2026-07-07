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

<style>
    @media (max-width: 767px) {
        .prop-card-mobile {
            display: flex;
            flex-direction: column;
            background: #fff;
            border: 1px solid #f1f5f9;
            border-radius: 14px;
            padding: 14px;
            margin-bottom: 12px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .prop-card-mobile .prop-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
        .prop-card-mobile .prop-meta { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
        .filter-dropdowns {
            position: fixed;
            bottom: -100%;
            left: 0;
            width: 100%;
            background: #fff;
            border-radius: 24px 24px 0 0;
            box-shadow: 0 -4px 25px rgba(0,0,0,0.15);
            z-index: 1050;
            transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 24px 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .filter-dropdowns.open { bottom: 0; }
        .filter-dropdowns select { width: 100% !important; height: 48px !important; border-radius: 12px !important; background-color: #f8fafc !important; border: 1px solid #f1f5f9 !important; font-size: 0.95rem !important; }
        .mobile-filter-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 1040; display: none;
        }
        .mobile-filter-overlay.open { display: block; }
        .desktop-table { display: none !important; }
        .mobile-cards { display: block !important; }
        .summary-col { flex: 0 0 50%; max-width: 50%; }
        .page-header { flex-direction: column; align-items: flex-start !important; gap: 6px; }
        .breadcrumb-mobile { font-size: 0.8rem; }
    }
    @media (min-width: 768px) {
        .filter-dropdowns { display: flex; align-items: center; gap: 0.5rem; }
        .mobile-filter-overlay, .mobile-filter-header { display: none !important; }
        .mobile-cards { display: none !important; }
        .desktop-table { display: block !important; }
    }
    .prop-row-hover:hover { background-color: #f8fafc !important; transition: background 0.15s; }
    .action-btn { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; transition: all 0.2s; }
    .action-btn:hover { transform: scale(1.1); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
</style>

<div class="app-main__inner mb-3" style="max-width: 100%; overflow-x: hidden;">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 page-header">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <i class="bi bi-buildings fs-4"></i>
            </div>
            <div>
                <h4 class="mb-0 fw-bold">Property Listing</h4>
                <p class="text-muted mb-0 small">Manage all properties listed on your platform.</p>
            </div>
        </div>
        <div class="text-muted small fw-medium breadcrumb-mobile">
            <a href="{{ url('/') }}" class="text-decoration-none text-primary">Home</a> &gt; Properties
        </div>
    </div>

    <div id="successMessageContainer"></div>

    @php
        $post_for = get_property_for_types();
        $property_types = get_all_property_category();
        $cities = get_all_city();
    @endphp

    <!-- Summary Cards: 2-col on mobile, 4-col on desktop -->
    <div class="row mb-4 g-3 m-0">
        @php
        $cards = [
            ['icon'=>'bi-house','color'=>'primary','label'=>'Total Properties','value'=>$data->total(),'change'=>$changes['total']],
            ['icon'=>'bi-check-circle','color'=>'success','label'=>'Active Properties','value'=>$counts->active ?? 0,'change'=>$changes['active']],
            ['icon'=>'bi-clock','color'=>'warning','label'=>'Pending Properties','value'=>$counts->pending ?? 0,'change'=>$changes['pending']],
            ['icon'=>'bi-x','color'=>'danger','label'=>'Inactive Properties','value'=>$counts->inactive ?? 0,'change'=>$changes['inactive']],
        ];
        @endphp
        @foreach($cards as $card)
        <div class="col-6 col-md-3 summary-col">
            <div class="card border shadow-sm rounded-4 h-100" style="border-color: #f1f5f9 !important;">
                <div class="card-body p-3 p-md-4 d-flex align-items-center">
                    <div class="bg-{{ $card['color'] }} bg-opacity-10 text-{{ $card['color'] }} me-3 d-flex align-items-center justify-content-center flex-shrink-0" style="width:50px;height:50px;border-radius:14px;">
                        <i class="bi {{ $card['icon'] }} fs-5"></i>
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-muted mb-1 fw-medium text-truncate" style="font-size:0.8rem;">{{ $card['label'] }}</p>
                        <h5 class="fw-bold mb-0 text-dark">{{ $card['value'] }}</h5>
                        <span class="small fw-bold {{ $card['change'] >= 0 ? 'text-success' : 'text-danger' }}">
                            <i class="bi bi-arrow-{{ $card['change'] >= 0 ? 'up' : 'down' }}"></i> {{ abs($card['change']) }}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>

    <!-- Table Container -->
    <div class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-3 p-md-4">

            <!-- Filter Bar -->
            <form action="{{ url('allproperties/all-property-view') }}" method="get">
                <div class="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-4 filter-bar">
                    
                    <!-- Search & Filter Toggle -->
                    <div class="d-flex flex-grow-1 gap-2 w-100 w-md-auto">
                        <div class="position-relative search-box flex-grow-1" style="max-width:100%; @media(min-width:768px){max-width:280px;}">
                            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style="font-size:0.9rem;"></i>
                            <input type="text" class="form-control ps-5 border-0 bg-light w-100 shadow-sm" name="term" placeholder="Search properties..." value="{{ request('term') }}" style="border-radius:12px; height:46px; font-size:0.9rem;">
                        </div>
                        
                        <button type="button" class="btn bg-light border-0 d-md-none text-dark toggle-filter-btn flex-shrink-0 shadow-sm" style="border-radius:12px; height:46px; width:46px; display:inline-flex; align-items:center; justify-content:center;">
                            <i class="bi bi-sliders text-primary fs-5"></i>
                        </button>
                    </div>

                    <!-- Filters Bottom Sheet -->
                    <div class="mobile-filter-overlay toggle-filter-btn"></div>
                    <div class="filter-dropdowns">
                        <div class="d-flex justify-content-between align-items-center mb-1 mobile-filter-header w-100">
                            <h5 class="mb-0 fw-bold fs-4">Filters</h5>
                            <button type="button" class="btn bg-light rounded-circle toggle-filter-btn d-flex align-items-center justify-content-center" style="width:36px; height:36px; border:none;"><i class="bi bi-x fs-5"></i></button>
                        </div>
                        <select class="form-select border-0 bg-light text-muted shadow-sm" name="post_for" onchange="this.form.submit()" style="width:140px; border-radius:12px; height:46px; font-size:0.9rem;">
                            <option value="">All Status</option>
                            @foreach ($post_for as $k => $t)
                                <option value="{{ $k }}" {{ request('post_for') == $k ? 'selected' : '' }}>{{ $t }}</option>
                            @endforeach
                        </select>
                        <select class="form-select border-0 bg-light text-muted shadow-sm" name="property_type" onchange="this.form.submit()" style="width:140px; border-radius:12px; height:46px; font-size:0.9rem;">
                            <option value="">All Type</option>
                            @foreach ($property_types as $k => $t)
                                <option value="{{ $t->id }}" {{ request('property_type') == $t->id ? 'selected' : '' }}>{{ $t->name }}</option>
                            @endforeach
                        </select>
                        <select class="form-select border-0 bg-light text-muted shadow-sm" name="city" onchange="this.form.submit()" style="width:140px; border-radius:12px; height:46px; font-size:0.9rem;">
                            <option value="">All Location</option>
                            @foreach ($cities as $k => $c)
                                <option value="{{ $c->city_id }}" {{ request('city') == $c->city_id ? 'selected' : '' }}>{{ $c->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Add & Export Buttons -->
                    <div class="d-flex align-items-center gap-2 w-100 w-md-auto ms-md-auto">
                        @if (!empty($srch['user_id']))
                        <a href="{{ url('post-property?uid='.$srch['user_id']) }}" class="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-bold flex-grow-1 btn-add shadow-sm" style="border-radius:12px; height:46px; font-size:0.95rem;">
                            <i class="bi bi-plus-lg fs-5"></i> <span>Add Property</span>
                        </a>
                        @else
                        <a href="{{ url('post-property') }}" class="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-bold flex-grow-1 btn-add shadow-sm" style="border-radius:12px; height:46px; font-size:0.95rem;">
                            <i class="bi bi-plus-lg fs-5"></i> <span>Add Property</span>
                        </a>
                        @endif
                        <button type="button" class="btn bg-light border-0 d-flex align-items-center justify-content-center flex-shrink-0 text-dark fw-medium shadow-sm" style="border-radius:12px; height:46px; width:46px; font-size:1.1rem;">
                            <i class="bi bi-download"></i>
                        </button>
                    </div>
                </div>
            </form>

            <!-- Desktop Table -->
            <div class="desktop-table">
                <table class="table table-borderless align-middle mb-0 w-100">
                    <thead>
                        <tr class="text-dark">
                            <th class="fw-bold py-3 ps-3 fs-6 border-0" style="background:#f8fafc; border-radius:10px 0 0 10px;">Property</th>
                            <th class="fw-bold py-3 fs-6 border-0" style="background:#f8fafc;">Location</th>
                            <th class="fw-bold py-3 fs-6 border-0" style="background:#f8fafc;">Price</th>
                            <th class="fw-bold py-3 fs-6 border-0" style="background:#f8fafc;">Status</th>
                            <th class="fw-bold py-3 pe-3 fs-6 text-center border-0" style="background:#f8fafc; border-radius:0 10px 10px 0;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($data as $property)
                        @php
                            $relativePath = 'user_upload/property_images/' . $property->filename;
                            $imageToShow = isset($property->filename) && file_exists(public_path($relativePath))
                                ? asset($relativePath) : asset(config('constants.NO_IMAGE_PROPERTY'));
                        @endphp
                        <tr class="prop-row-hover" style="border-bottom: 1px solid #f1f5f9;">
                            <td class="py-3 ps-3">
                                <div class="d-flex align-items-center gap-3">
                                    <img src="{{ $imageToShow }}" alt="Property" class="rounded-3 object-fit-cover flex-shrink-0" width="68" height="48" style="box-shadow:0 1px 4px rgba(0,0,0,0.08);">
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark" style="font-size:0.9rem;">{{ Str::limit($property->name, 35) }}</h6>
                                        <p class="text-muted mb-0" style="font-size:0.78rem;">ID: RE-{{ str_pad($property->id, 6, '0', STR_PAD_LEFT) }}</p>
                                        <p class="text-muted mb-0" style="font-size:0.78rem;">{{ date('M d, Y', strtotime($property->created_at)) }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="bi bi-geo-alt text-muted"></i>
                                    <span class="d-block text-dark fw-semibold text-truncate" style="max-width:200px; font-size:0.875rem;">{{ $property->property_address ?? 'N/A' }}</span>
                                </div>
                            </td>
                            <td class="py-3 fw-bold text-dark" style="font-size:0.9rem;">
                                {{ get_setting('site-currency') . formatPrice($property->expected_price, get_setting('site-currency-code')) }}
                            </td>
                            <td class="py-3">
                                @if($property->status == 1 || $property->status == '1')
                                    <span class="badge fw-semibold text-success" style="background:#dcfce7; padding:6px 12px; border-radius:6px;">Active</span>
                                @elseif($property->status == 2)
                                    <span class="badge fw-semibold text-warning" style="background:#fef3c7; padding:6px 12px; border-radius:6px;">Pending</span>
                                @elseif($property->status == 0 || $property->status == '0' || $property->status == 3)
                                    <span class="badge fw-semibold text-danger" style="background:#fee2e2; padding:6px 12px; border-radius:6px;">Sold</span>
                                @else
                                    <span class="badge fw-semibold text-secondary" style="background:#f1f5f9; padding:6px 12px; border-radius:6px;">{{ ucfirst($property->status) }}</span>
                                @endif
                            </td>
                            <td class="py-3 text-center">
                                <div class="d-flex justify-content-center gap-2">
                                    <a href="{{ url('/enquiry/property-leads/'.$property->id) }}" class="action-btn text-secondary"><i class="bi bi-eye"></i></a>
                                    <a href="{{ url('property/edit/'.$property->id) }}" class="action-btn text-primary"><i class="bi bi-pencil"></i></a>
                                    <button class="action-btn text-danger change-status-btn" data-property-id="{{ $property->id }}" data-status="delete"><i class="bi bi-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-5">
                                <i class="bi bi-house text-muted" style="font-size:3rem;"></i>
                                <h6 class="mt-3 text-muted">No Properties Found</h6>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Mobile Cards -->
            <div class="mobile-cards" style="display:none;">
                @forelse ($data as $property)
                @php
                    $relativePath = 'user_upload/property_images/' . $property->filename;
                    $imageToShow = isset($property->filename) && file_exists(public_path($relativePath))
                        ? asset($relativePath) : asset(config('constants.NO_IMAGE_PROPERTY'));
                @endphp
                <div class="prop-card-mobile">
                    <div class="prop-top">
                        <img src="{{ $imageToShow }}" alt="Property" class="rounded-3 object-fit-cover flex-shrink-0" width="72" height="54">
                        <div class="flex-grow-1 overflow-hidden">
                            <h6 class="mb-0 fw-bold text-dark" style="font-size:0.88rem; line-height:1.3;">{{ $property->name }}</h6>
                            <p class="text-muted mb-1" style="font-size:0.75rem;">ID: RE-{{ str_pad($property->id, 6, '0', STR_PAD_LEFT) }} &bull; {{ date('M d, Y', strtotime($property->created_at)) }}</p>
                            <div class="d-flex align-items-center gap-1 text-muted" style="font-size:0.78rem;">
                                <i class="bi bi-geo-alt"></i>
                                <span class="text-truncate">{{ $property->property_address ?? 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="prop-meta">
                        <span class="fw-bold text-dark" style="font-size:0.9rem;">{{ get_setting('site-currency') . formatPrice($property->expected_price, get_setting('site-currency-code')) }}</span>
                        @if($property->status == 1 || $property->status == '1')
                            <span class="badge fw-semibold text-success" style="background:#dcfce7; padding:5px 10px; border-radius:6px; font-size:0.75rem;">Active</span>
                        @elseif($property->status == 2)
                            <span class="badge fw-semibold text-warning" style="background:#fef3c7; padding:5px 10px; border-radius:6px; font-size:0.75rem;">Pending</span>
                        @elseif($property->status == 0 || $property->status == '0' || $property->status == 3)
                            <span class="badge fw-semibold text-danger" style="background:#fee2e2; padding:5px 10px; border-radius:6px; font-size:0.75rem;">Sold</span>
                        @else
                            <span class="badge fw-semibold text-secondary" style="background:#f1f5f9; padding:5px 10px; border-radius:6px; font-size:0.75rem;">{{ ucfirst($property->status) }}</span>
                        @endif
                        <div class="d-flex gap-2 ms-auto">
                            <a href="{{ url('/enquiry/property-leads/'.$property->id) }}" class="action-btn text-secondary"><i class="bi bi-eye"></i></a>
                            <a href="{{ url('property/edit/'.$property->id) }}" class="action-btn text-primary"><i class="bi bi-pencil"></i></a>
                            <button class="action-btn text-danger change-status-btn" data-property-id="{{ $property->id }}" data-status="delete"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
                @empty
                <div class="text-center py-5">
                    <i class="bi bi-house text-muted" style="font-size:3rem;"></i>
                    <h6 class="mt-3 text-muted">No Properties Found</h6>
                </div>
                @endforelse
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

        $(document).on('click', '.toggle-filter-btn', function() {
            $('.filter-dropdowns').toggleClass('open');
            $('.mobile-filter-overlay').toggleClass('open');
            $('body').toggleClass('overflow-hidden');
        });

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
