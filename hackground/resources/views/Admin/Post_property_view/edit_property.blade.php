@extends('Admin.layouts.app')
@push('custom-css')

<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2-bootstrap-5-theme.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">


@endpush
@section('content')

<div class="app-main__inner mb-3">

    <!-- Header Title -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <i class="bi bi-house-gear fs-4"></i>
            </div>
            <div>
                <h4 class="mb-1 fw-bold">Property Edit</h4>
                <div class="text-muted small fw-medium">
                    Property &gt; Property Edit
                </div>
            </div>
        </div>
        <div class="text-muted small fw-medium">
            <a href="{{ url('/') }}" class="text-decoration-none text-primary">Home</a> &gt; Property Edit
        </div>
    </div>

    <div class="row">
        <div class="col-lg-8 col-xl-9">
            <!-- Tabs & Back Button -->
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <ul class="nav nav-underline border-0" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active fw-bold text-primary" href="{{ url('property/edit/'.$property_id) }}">Property Details</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-muted fw-medium" href="{{ url('property/edit-photos/'.$property_id) }}">Property Photos</a>
                    </li>
                </ul>
                <a href="{{ url('allproperties/all-property-view') }}" class="btn btn-light border shadow-sm btn-sm fw-medium rounded-3 px-3 py-2 d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-left"></i> Back to List
                </a>
            </div>

            <!-- Basic Details Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
                        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                            <i class="bi bi-building"></i>
                        </div>
                        Basic Details
                    </h5>
                    <button class="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" onclick="edit('basic')">
                        <i class="bi bi-pencil"></i> Edit <i class="bi bi-chevron-down ms-2"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-medium mb-1">Name</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
                                {{ ucfirst($propertyData->name ?? 'N/A') }}
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">Post For</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center" style="height: 42px;">
                                <span>{{ ucfirst(optional($propertyData->settings)->post_for ?? 'N/A') }}</span>
                                <i class="bi bi-chevron-down text-muted small"></i>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">Property Type</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center text-truncate" style="height: 42px;">
                                <span class="text-truncate">{{ get_name_by_id('property_category_names','category_id',optional($propertyData->settings)->property_type,'en') ?? 'N/A' }}</span>
                                <i class="bi bi-chevron-down text-muted small"></i>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-medium mb-1">Price</label>
                            <div class="d-flex gap-2">
                                <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center" style="height: 42px; width: 100px;">
                                    <span>{{ optional($propertyData->settings)->price_currency ?? 'USD' }}</span>
                                    <i class="bi bi-chevron-down text-muted small"></i>
                                </div>
                                <div class="p-2 border rounded-3 bg-light text-dark fw-medium flex-grow-1" style="height: 42px; line-height: 24px;">
                                    {{ optional($propertyData->settings)->expected_price ?? 'N/A' }}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">Project / Society Name</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
                                {{ optional($propertyData->settings)->project_name ?? 'N/A' }}
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">Property For</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center text-truncate" style="height: 42px;">
                                <span class="text-truncate">{{ get_name_by_id('property_sub_category_names','sub_category_id',optional($propertyData->settings)->property_type_for,'en') ?? 'N/A' }}</span>
                                <i class="bi bi-chevron-down text-muted small"></i>
                            </div>
                        </div>

                        <div class="col-12 mt-3">
                            <label class="form-label text-muted small fw-medium mb-1">Message to Buyer (Optional)</label>
                            <div class="p-3 border rounded-3 bg-light text-dark position-relative" style="min-height: 100px;">
                                {{ optional($propertyData->additional)->buyer_message ?? 'Write a message to buyer...' }}
                                <div class="position-absolute bottom-0 end-0 p-2 text-muted small">0 / 500</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Location Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
                        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                            <i class="bi bi-geo-alt"></i>
                        </div>
                        Location
                    </h5>
                    <button class="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" onclick="edit('location')">
                        <i class="bi bi-pencil"></i> Edit <i class="bi bi-chevron-down ms-2"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">City</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center text-truncate" style="height: 42px;">
                                <span class="text-truncate">{{ get_name_by_id('city_names', 'city_id', optional($propertyData->location)->city, 'en') }}</span>
                                <i class="bi bi-chevron-down text-muted small"></i>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label text-muted small fw-medium mb-1">Locality</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium d-flex justify-content-between align-items-center text-truncate" style="height: 42px;">
                                <span class="text-truncate">{{ optional($propertyData->location)->locality ? get_name_by_id('locality_names', 'locality_id', $propertyData->location->locality, 'en') : 'N/A' }}</span>
                                <i class="bi bi-chevron-down text-muted small"></i>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label text-muted small fw-medium mb-1">Address</label>
                            <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
                                {{ optional($propertyData->location)->property_address ?? 'N/A' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Property Features Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
                        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                            <i class="bi bi-grid-3x3-gap"></i>
                        </div>
                        Property Features
                    </h5>
                    <button class="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" onclick="edit('features')">
                        <i class="bi bi-pencil"></i> Edit <i class="bi bi-chevron-down ms-2"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-md-4">
                            <h6 class="fw-bold mb-3 fs-6">Configuration</h6>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Bedrooms</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->settings)->bedrooms ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Bathrooms</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->settings)->bathrooms ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Balcony</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->balcony ?? 'N/A' }}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold mb-3 fs-6">Floor Details</h6>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Flooring Types</span>
                                <span class="fw-bold text-dark text-end">
                                    @php
                                    $style_arr = json_decode(optional($propertyData->additional)->flooring_style);
                                    if(is_array($style_arr) && count($style_arr) > 0) {
                                        echo 'Multiple Types';
                                    } else {
                                        echo 'N/A';
                                    }
                                    @endphp
                                </span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Floor No.</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->floor ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Total Floors</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->total_floor ? get_total_floors($propertyData->additional->total_floor) : 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Flats on the Floor</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->flat_each_floor ?? 'N/A' }}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold mb-3 fs-6">More Details</h6>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Lifts in the Tower</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->lifts_in_tower ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Carpet Area (sq.ft)</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->settings)->carpet_area ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Super Area (sq.ft)</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->settings)->super_area ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-medium">Furnished</span>
                                <span class="fw-bold text-dark text-end">{{ get_name_by_id('property_furnish_names','furnish_id',optional($propertyData->additional)->property_furnish,'en') ?? 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional Information Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
                        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                            <i class="bi bi-info-circle"></i>
                        </div>
                        Additional Information
                    </h5>
                    <button class="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" onclick="edit('additional')">
                        <i class="bi bi-pencil"></i> Edit <i class="bi bi-chevron-down ms-2"></i>
                    </button>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Water Availability</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->water_available ? get_water_availability($propertyData->additional->water_available) : 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Type of Ownership</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->ownership_type ? get_ownership_types($propertyData->additional->ownership_type) : 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Parking</span>
                                <span class="fw-bold text-dark">
                                    @php
                                    $parkingStatus = ['av' => 'Available', 'na' => 'Not Available', 'uc' => 'Under Construction'];
                                    @endphp
                                    {{ $parkingStatus[optional($propertyData->settings)->parking_ability] ?? 'N/A' }}
                                </span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom border-light">
                                <span class="text-muted small fw-medium">Overlooking</span>
                                <span class="fw-bold text-dark">
                                    @php
                                    $overlooking = optional($propertyData->additional)->overlooking ?? '';
                                    $overlookingArray = !empty($overlooking) ? json_decode($overlooking, true) : null;
                                    echo $overlookingArray ? implode(', ', $overlookingArray) : 'N/A';
                                    @endphp
                                </span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Status of Electricity</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->electric_available ? electricity_status($propertyData->additional->electric_available) : 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Possession Status</span>
                                <span class="fw-bold text-dark">{{ get_name_by_id('property_status_names','status_id',optional($propertyData->additional)->possession_status,'en') ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                                <span class="text-muted small fw-medium">Facing</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->facing_direction ?? 'N/A' }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom border-light">
                                <span class="text-muted small fw-medium">Age of Property</span>
                                <span class="fw-bold text-dark">{{ optional($propertyData->additional)->construct_year ?? 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Actions -->
            <div class="d-flex justify-content-between align-items-center mt-5 mb-3">
                <a href="{{ url('allproperties/all-property-view') }}" class="btn btn-outline-secondary rounded-3 px-4 py-2 fw-medium border shadow-sm">Cancel</a>
                <div class="d-flex gap-3">
                    <button class="btn btn-light text-primary bg-primary bg-opacity-10 rounded-3 px-4 py-2 fw-bold border-0"><i class="bi bi-eye"></i> Preview</button>
                    <button class="btn btn-primary rounded-3 px-4 py-2 fw-bold shadow-sm"><i class="bi bi-save"></i> Update Property</button>
                </div>
            </div>

        </div>

        <!-- Right Sidebar -->
        <div class="col-lg-4 col-xl-3">
            <!-- Property Summary Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                    <h6 class="fw-bold mb-0 text-dark">Property Summary</h6>
                </div>
                <div class="card-body p-4 pt-2">
                    <div class="position-relative mb-4">
                        @php
                        $imageToShow = asset('assets/images/property_placeholder.png');
                        if (isset($groupedImages['exterior'][0])) {
                            $imageToShow = asset('user_upload/property_images/'.$groupedImages['exterior'][0]->filename);
                        }
                        @endphp
                        <img src="{{ $imageToShow }}" alt="Property" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 140px;">
                    </div>
                    
                    <ul class="list-unstyled mb-0">
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-info-circle fs-6"></i> Property ID</span>
                            <span class="fw-bold text-dark fs-6">RE-{{ str_pad($property_id, 6, '0', STR_PAD_LEFT) }}</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-circle fs-6"></i> Status</span>
                            <span class="badge bg-success bg-opacity-10 text-success rounded-3 px-3 py-1 fw-bold">Active</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-calendar fs-6"></i> Added On</span>
                            <span class="fw-bold text-dark fs-6">{{ $propertyData->created_at ? date('M d, Y', strtotime($propertyData->created_at)) : 'N/A' }}</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-clock-history fs-6"></i> Last Updated</span>
                            <span class="fw-bold text-dark fs-6">{{ $propertyData->updated_at ? date('M d, Y', strtotime($propertyData->updated_at)) : 'N/A' }}</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-eye fs-6"></i> Views</span>
                            <span class="fw-bold text-dark fs-6">120</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-chat-square-text fs-6"></i> Inquiries</span>
                            <span class="fw-bold text-dark fs-6">8</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Actions Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                    <h6 class="fw-bold mb-0 text-dark">Actions</h6>
                </div>
                <div class="card-body p-4 pt-2">
                    <button class="btn btn-light bg-white border shadow-sm w-100 mb-3 rounded-3 text-dark fw-bold d-flex align-items-center justify-content-center gap-2 py-2">
                        <i class="bi bi-eye"></i> Preview Property
                    </button>
                    <button class="btn btn-primary shadow-sm w-100 mb-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 py-2">
                        <i class="bi bi-save"></i> Update Property
                    </button>
                    <button class="btn btn-outline-danger w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 py-2 bg-danger bg-opacity-10 border-danger">
                        <i class="bi bi-trash"></i> Delete Property
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection


@push('custom-js')

<script>
    function edit(type) {
        let property_id = "{{ $property_id }}";
        let url = `{{ url('property/load_ajax_page') }}?page=${type}&id=${property_id}`;
        $.get(url, function(data) {
            $('#ajaxModal').modal('show');
            $('#ajaxModal .modal-content').html(data);
        });
    }

    $('#fileinput').on('change', function() {
        var activeTab = $(".image-tab-content .nav-link.active").attr("data-tab");
        let files = this.files;
        if (files.length === 0) {
            alert('Please select at least one file.');
            return;
        }

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }
        //formData.append('type', activeType);

        $.ajax({
            url: "{{ url('/property/store_property_image') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.success) {
                    $.each(data.images, function(index, image) {
                        previewImage(image.imageUrl, image.filename,
                            activeTab);
                    });

                    //updateHiddenField();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    function previewImage(imageUrl, filename, type) {
        let imgWrapper = $('<div class="preview-item"></div>');
        imgWrapper.html(`
        <img src="${imageUrl}" alt="Uploaded Image" style="width: 150px; height: auto;">
        <button class="remove-btn" data-type="${type}" data-filename="${filename}">X</button>
        <input type="hidden" name="image[${type}][]" value="${filename}" />
    `);

        imgWrapper.find('.remove-btn').click(function() {
            removeImage(imgWrapper, filename, type);
        });

        $("#preview-" + type).append(imgWrapper);
    }


    $(document).ready(function() {
        $(".image-tab-content .nav-link").click(function(e) {
            e.preventDefault();
            $(".image-tab-content .nav-link").removeClass("active");
            $(this).addClass("active");
            var activeTab = $(this).attr("data-tab");
            $(".img-content").hide();
            $("#tab-content-" + activeTab).show();
        });

        $('.minus').click(function() {
            var $input = $(this).parent().find('input');
            var count = parseInt($input.val()) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            return false;
        });
        $('.plus').click(function() {
            var $input = $(this).parent().find('input');
            $input.val(parseInt($input.val()) + 1);
            $input.change();
            return false;
        });

        $('.btn-next').click(function() {
            var formId = $("#post-property-form");
            var step = $(this).attr('data-step');
            alert(step);
            $.ajax({
                type: 'POST',
                url: '{{ url("/property/save-property") }}',
                data: $(formId).serialize(),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == 'OK') {
                        $("#step-" + step).hide();
                        $("#step-" + (Number(step) + 1)).show();
                        $("#step").val(Number(step) + 1);
                        $(".tab-" + step).removeClass('active');
                        $(".tab-" + (Number(step) + 1)).addClass('active');
                    } else if (res.status == 'SUCCESS') {
                        Swal.fire({
                            title: "Success!",
                            text: res.message,
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = res.redirect;
                            }
                        });
                    }
                },
                error: function(xhr) {
                    var res = xhr.responseJSON;
                    if (res.errors) {
                        $.each(res.errors, function(index, error) {
                            $("." + index + "Error").html(error);
                            //alert(index+'/'+error);
                        });
                    }
                }
            });
        });

    });
</script>
<script>
    $(document).ready(function() {
        var w = $(window).width();
        if (w < 992) {
            $('.btn-next-1').click(function() {
                $('.spaceX').hide();
            });
            $('.btn-back-2').click(function() {
                $('.spaceX').show();
            });
        }

        // --------------------------------------------------------------------------------------------------------//

        function togglePropertyFeatures() {
            var selectedProperty = $('#property_type').val();

            if (selectedProperty == "1") { // Residential
                $('#residential_features').show();
                $('#commercial_features').hide();
            } else if (selectedProperty == "2") { // Commercial
                $('#residential_features').hide();
                $('#commercial_features').show();
            } else {
                $('#residential_features').hide();
                $('#commercial_features').hide();
            }
        }

        $(document).ready(function() {
            $(".property-status-radio").change(function() {
                let selectedValue = $("input[name='possession_status']:checked").val();

                // Hide all divs initially
                $(".available_features, .underConstruction_features").hide();

                if (selectedValue == "1") {
                    $(".available_features").show();
                    $(".underConstruction_features").hide();
                } else if (selectedValue == "2") {
                    $(".underConstruction_features").show();
                    $(".available_features").hide();
                }
            });
        });


        var firstPropertyId = $('#property_type').val(); // Get the first selected property type

        if (firstPropertyId) {
            loadPropertyFor(firstPropertyId);
        }

        function loadPropertyFor(propertyId) {
            let dropdown = $('#property_for');
            dropdown.empty();
            let selected_subcategory = "{{$propertyData->settings->property_type_for}}";

            $.ajax({
                url: "{{ url('/api/get_property_for') }}/" + propertyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.status === 1) {
                        dropdown.append('<option value="">Select Sub Category</option>'); // Default option

                        $.each(response.data, function(index, item) {
                            let selected = item.sub_category_id == selected_subcategory ? 'selected' : '';
                            dropdown.append('<option value="' + item.sub_category_id + '" ' + selected + '>' + item.sub_category_name + '</option>');
                        });
                    } else {
                        console.error('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                }
            });
        }

        togglePropertyFeatures();

        $('#property_type').on('change', function() {
            var propertyId = $(this).val();
            togglePropertyFeatures();
            loadPropertyFor(propertyId);
        });

        //$(".nav-link").removeClass("active");
        //$(".nav-link[data-tab='exterior']").addClass("active");

        // Handle tab switching on click
        // $(".nav-link").on("click", function(e) {
        //     e.preventDefault();
        //     $(".nav-link").removeClass("active");
        //     $(this).addClass("active");
        // });

        //let activeType = 'interior';
        //let uploadedFiles = {}; // Store images grouped by data-tab

        // $('.nav-link').click(function(e) {
        //     e.preventDefault();
        //     $('.nav-link.active').removeClass('active');
        //     $(this).addClass('active');
        //     activeType = $(this).data('tab');
        // });

        function removeImage(previewItem, filename, type) {
            previewItem.remove();
            if (uploadedFiles[type]) {
                uploadedFiles[type] = uploadedFiles[type].filter(file => file !== filename);
                if (uploadedFiles[type].length === 0) {
                    delete uploadedFiles[type]; // Remove empty categories
                }
            }
        }

        $("#post-property-form").on("submit", function(e) {
            e.preventDefault();
            let formData = new FormData(this);
            let actionUrl = "{{ url('property/post-property') }}";
            $.ajax({
                url: actionUrl,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content")
                },
                beforeSend: function() {
                    $("#submit-btn").prop("disabled", true).text(
                        "Posting...");
                },
                success: function(response) {
                    if (response.success) {
                        alert("Property submitted successfully!");
                        $("#post-property-form")[0].reset(); // Reset form
                        window.location.href = "{{ url('dashboard') }}";
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText); // Log errors
                    alert("Something went wrong. Please try again.");
                },
                complete: function() {
                    $("#submit-btn").prop("disabled", false).text(
                        "Post Property");
                }
            });
        });




    });
</script>
<script>
    let dimensionsData = <?php echo json_encode($propertyData->dimensions); ?>;

    $(document).ready(function() {
        dimensionsData.forEach(dimension => {
            let formContainer = $(`.form-field input[name='${dimension.room_type.split(/[0-9]/)[0]}_count']`).closest('.form-field').find('.size-forms');
            addForm(formContainer, dimension.room_type.split(/[0-9]/)[0], dimension);
        });

        $(".qtybutton").off("click").on("click", function() {
            let parent = $(this).closest(".form-field");
            let input = parent.find(".room-count");
            let formContainer = parent.find(".size-forms");
            var amenity = $(this).attr('amenity');

            let value = parseInt(input.val()) || 0;
            if ($(this).hasClass("plus")) {
                value++;
                input.val(value);
                addForm(formContainer, amenity, null, value);
            } else if ($(this).hasClass("minus") && value > 0) {
                value--;
                input.val(value);
                removeForm(formContainer);
            }
        });
    });

    function addForm(formContainer, amenity, dimension = null, value = null) {
        let widthValue = dimension ? JSON.parse(dimension.size).width : '';
        let heightValue = dimension ? JSON.parse(dimension.size).height : '';
        let roomTypeLabel = dimension ? `for ${dimension.room_type}` : '';
        let formHtml = `<div class="size-form mt-3 p-3 border rounded bg-light">  
                            <label class="fw-bold">Height & Width</label>  
                            <div class="row">  
                                <div class="col-6">  
                                    <input type="text" class="form-control mb-2" name="${amenity}[width][${value ?? dimension.pid}]" placeholder="Enter Width" value="${widthValue}" autocomplete="off">  
                                </div>  
                                <div class="col-6">  
                                    <input type="text" class="form-control" name="${amenity}[height][${value ?? dimension.pid}]" placeholder="Enter Height" value="${heightValue}" autocomplete="off">  
                                </div>  
                            </div>  
                        </div>`;
        formContainer.append(formHtml);
    }

    function removeForm(formContainer) {
        formContainer.find('.size-form').last().remove();
    }
</script>
@endpush

<div class="modal fade" id="ajaxModal">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">

        </div>
    </div>
</div>