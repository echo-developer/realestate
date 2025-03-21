@extends('Admin.Post_property_view.layout_for_property_post')

@section('content')
<section class="section post-page">
    <div class="container">
        <div class="row justify-content-center">
            <aside class="col-lg-12 col-12">
                <div class="card border-0 post-form">
                    <div class="card-header pb-0">
                        <ul class="nav nav-underline mb-0 gap-5 d-flex">

                            <li class="nav-item">
                                <a class="nav-link tab-2 active" href="javascript:void(0)">Property Details</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tab-3" href="javascript:void(0)">Location</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tab-4" href="javascript:void(0)">Feature</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tab-5" href="javascript:void(0)">Availability</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link tab-6" href="javascript:void(0)">Photos</a>
                            </li>
                        </ul>
                    </div>
                    <div class="card-body">
                        <form method="post" id='post-property-form'>
                            <input type="hidden" name="step" value="2" id="step" />
                            <input type="hidden" name="prop_id" value="{{$property_id}}" id="step" />


                            <div id="step-2" style="display:block;">
                                <div>
                                    <label class="form-label">You are here to</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group">
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio1"
                                            value="rent" autocomplete="off" {{ strpos($propertyData->settings->post_for, 'rent') !== false ? 'checked' : '' }}>
                                        <label class="btn btn-outline-light" for="btnradio1">Rent</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio2"
                                            value="sale" autocomplete="off" {{ strpos($propertyData->settings->post_for, 'sale') !== false ? 'checked' : '' }}>
                                        <label class="btn btn-outline-light" for="btnradio2">Sale</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio3"
                                            value="pg" autocomplete="off" {{ strpos($propertyData->settings->post_for, 'pg') !== false ? 'checked' : '' }}>
                                        <label class="btn btn-outline-light" for="btnradio3">PG/Hostel</label>
                                    </div>
                                    <span class="error postForError text-danger"></span>
                                </div>

                                <div>
                                    <label class="form-label">Property Type</label>
                                    <div class="mb-3">
                                        <select class="form-select" name="property_type" id="property_type">
                                            <option value="">Select Property Type</option>
                                            @isset($propertyTypes)
                                            @foreach ($propertyTypes as $propertyType)
                                            <option value="{{ $propertyType['category_id'] }}"
                                                {{ $propertyType['category_id'] == $propertyData->settings->property_type ? 'selected' : '' }}>
                                                {{ $propertyType['category_name'] }}
                                            </option>
                                            @endforeach
                                            @endisset
                                        </select>
                                        <span class="error property_typeError text-danger"></span>
                                    </div>
                                </div>

                                <div>
                                    <label class="form-label">Property For.</label>
                                    <div class="mb-3">
                                        <select class="form-select" name="property_for" id="property_for">

                                        </select>
                                        <span class="error property_forError text-danger"></span>
                                    </div>
                                </div>

                                <div>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Property Type">
                                        <input type="radio" class="btn-check" name="property_category"
                                            id="property_individual" value="individual" autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="property_individual">Standalone
                                            Property</label>

                                        <input type="radio" class="btn-check" name="property_category"
                                            id="property_project" value="project" autocomplete="off">
                                        <label class="btn btn-outline-light" for="property_project">Under a
                                            Project</label>
                                    </div>
                                    <span class="error property_categoryError text-danger"></span>
                                </div>


                                <div class="d-grid columns-2">
                                    <button type="button" class="btn btn-secondary btn-back-2"><i
                                            class="bi bi-arrow-left"></i> Back</button>
                                    <button type="button" class="btn btn-primary btn-next" data-step="2">Next <i
                                            class="bi bi-arrow-right"></i></button>
                                </div>
                            </div>

                            <div id="step-3" style="display:none;">
                                <div class="row gx-3">
                                    <div class="col-lg-6 col-12">
                                        <div class="form-field">
                                            <label class="form-label">City</label>
                                            <select id="city" name="city" class="form-control ">
                                                <option value="">Select City</option>
                                                @if (!empty($cities) && is_array($cities))
                                                @foreach ($cities as $city)
                                                <option value="{{ $city['city_id'] }}" {{ $city['city_id'] == $propertyData->location->city ? 'selected' : '' }}>{{ $city['name'] }}</option>
                                                @endforeach
                                                @else
                                                <option value="" disabled>No cities available</option>
                                                <!-- Fallback option -->
                                                @endif
                                            </select>
                                            <span class="error cityError text-danger"></span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-12">
                                        <div class="form-field">
                                            <label class="form-label">Landmark</label>
                                            <input class="form-control" placeholder="Enter landmark"
                                                id="landmark" required="" value="{{$propertyData->location->locality}}" type="text" name="landmark"
                                                autocomplete="off">
                                            <span class="error landmarkError text-danger"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-field">
                                    <label class="form-label">Name of Project Or Locality</label>
                                    <input type="text" name="locality" class="form-control"
                                        value="{{$propertyData->settings->project_name}}" placeholder="Enter Project Name Or Locality" />
                                    <span class="error localityError text-danger"></span>
                                </div>
                                <div class="form-field">
                                    <label class="form-label">Address</label>
                                    <textarea rows="3" class="form-control mb-2" name='address' placeholder="Enter Your Address"> {{$propertyData->location->property_address}} </textarea>
                                    <span class="error addressError text-danger"></span>
                                    <p class="text-end text-help">Maximum 300 words are allowed</p>
                                </div>

                                <div class="form-field">
                                    <label for="description">Property Description</label>
                                    <textarea id="description" name="description" rows="3" class="form-control "
                                        placeholder="Enter Property Description">{{$propertyData->additional->property_desc}}</textarea>
                                    <span class="error descriptionError text-danger"></span>
                                </div>

                                <div class="d-grid columns-2">
                                    <button type="button" class="btn btn-secondary btn-back-3"><i
                                            class="bi bi-arrow-left"></i>Back</button>
                                    <button type="button" class="btn btn-primary btn-next" data-step="3">Next<i
                                            class="bi bi-arrow-right"></i></button>
                                </div>
                            </div>

                            <div id="step-4" style="display:none;">

                                <div class="row gx-3">
                                    <!-- Bedroom -->
                                    <div class="col-lg-3 col-12">
                                        <div class="form-field">
                                            <label class="form-label">Bedroom</label>
                                            <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                                <button type="button" class="btn btn-danger minus qtybutton" amenity="bedroom">-</button>
                                                <input class="form-control text-center mx-2 room-count" name="bedroom_count" type="text" value="{{ $propertyData->settings->bedrooms }}" readonly style="max-width: 80px;">
                                                <button type="button" class="btn btn-success plus qtybutton" amenity="bedroom">+</button>
                                            </div>
                                            <span class="error bedroom_countError text-danger"></span>
                                            <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                        </div>
                                    </div>

                                    <!-- Balcony -->
                                    <div class="col-lg-3 col-12">
                                        <div class="form-field">
                                            <label class="form-label">Balcony</label>
                                            <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                                <button type="button" class="btn btn-danger minus qtybutton" amenity="balcony">-</button>
                                                <input class="form-control text-center mx-2 room-count" name="balcony_count" type="text" value="{{ $propertyData->additional->balcony }}" readonly style="max-width: 80px;">
                                                <button type="button" class="btn btn-success plus qtybutton" amenity="balcony">+</button>
                                            </div>
                                            <span class="error balcony_countError text-danger"></span>
                                            <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                        </div>
                                    </div>

                                    <!-- Bathroom -->
                                    <div class="col-lg-3 col-12">
                                        <div class="form-field">
                                            <label class="form-label">Bathroom</label>
                                            <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                                <button type="button" class="btn btn-danger minus qtybutton" amenity="bathroom">-</button>
                                                <input class="form-control text-center mx-2 room-count" name="bathroom_count" type="text" value="{{ $propertyData->settings->bathrooms }}" readonly style="max-width: 80px;">
                                                <button type="button" class="btn btn-success plus qtybutton" amenity="bathroom">+</button>
                                            </div>
                                            <span class="error bathroom_countError text-danger"></span>
                                            <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                        </div>
                                    </div>
                                </div>


                                <div class="row gx-3">
                                    <div class="col-lg-6 col-12">
                                        <div class="form-field"><label class="form-label">Carpet Area</label>
                                            <div class="input-group"><input class="form-control " name="carpet_area"
                                                    placeholder="Type Carpet Area" value="{{$propertyData->settings->carpet_area}}" type="number"><span
                                                    class="input-group-text">sqft</span>
                                            </div>
                                            <span class="error carpet_areaError text-danger"></span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-12">
                                        <div class="form-field"><label class="form-label">Super Area</label>
                                            <div class="input-group"><input class="form-control " name="super_area"
                                                    placeholder="Type Super Area" value="{{$propertyData->settings->super_area}}" type="number"><span
                                                    class="input-group-text">sqft</span>
                                            </div>
                                            <span class="error super_areaError text-danger"></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Floor No.</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Floors">
                                        @php
                                        $floorOptions = [
                                        'floors_1' => 'Lower Basement',
                                        'floors_2' => 'Upper Basement',
                                        'floors_3' => 'Ground',
                                        'floors_4' => '1',
                                        'floors_5' => '2',
                                        'floors_6' => '3',
                                        'floors_7' => '4',
                                        'floors_8' => '5',
                                        'floors_6_plus' => '<i class="bi bi-plus-lg"></i>'
                                        ];
                                        @endphp

                                        @foreach ($floorOptions as $value => $label)
                                        <input class="btn-check" id="{{ $value }}" value="{{ $value }}" autocomplete="off" type="radio" name="floors" {{ $propertyData->additional->floor === $value ? 'checked' : '' }}>
                                        <label class="btn btn-outline-light" for="{{ $value }}">{!! $label !!}</label>
                                        @endforeach
                                    </div>
                                    <span class="error floorsError text-danger"></span>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Total Floors</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Total Floors">
                                        @php
                                        $totalFloorOptions = range(1, 12);
                                        @endphp

                                        @foreach ($totalFloorOptions as $value)
                                        <input class="btn-check" id="total_floor_{{ $value }}" value="total_floor_{{ $value }}" autocomplete="off" type="radio" name="total_floors" {{ $propertyData->additional->total_floor == 'total_floor_'.$value ? 'checked' : '' }}>
                                        <label class="btn btn-outline-light" for="total_floor_{{ $value }}">{{ $value }}</label>
                                        @endforeach
                                        <input class="btn-check" id="total_floor_12_plus" value="total_floor_12_plus" autocomplete="off" type="radio" name="total_floors">
                                        <label class="btn btn-outline-light" for="total_floor_12_plus"><i class="bi bi-plus-lg"></i></label>
                                    </div>
                                    <span class="error total_floorsError text-danger"></span>
                                </div>


                                <div id="residential_features">
                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12"><label class="form-label">Facing</label>
                                            <div class="form-field">
                                                @php
                                                $floorOptions = [
                                                'east' => 'East',
                                                'north' => 'North',
                                                'north_east' => 'North - East',
                                                'north_west' => 'North - West',
                                                'south' => 'South',
                                                'south_east' => 'South - East',
                                                'south_west' => 'South - West',
                                                'west' => 'West',
                                                ];
                                                @endphp


                                                <select class="form-control"
                                                    name="facing_direction">
                                                    <option value="">Select Facing</option>
                                                    @foreach ($floorOptions as $value => $label)
                                                    <option value="{{ $value }}" {{ $propertyData->additional->facing_direction === $value ? 'selected' : '' }}>{{ $label }}</option>
                                                    @endforeach
                                                </select>
                                                <span class="error facing_directionError text-danger"></span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12"><label class="form-label">Parking</label>
                                            <div class="form-field">
                                                @php
                                                $floorOptions = [
                                                'av' => 'Available',
                                                'na' => 'Not Available',
                                                'uc' => 'Under Construction',
                                                ];
                                                @endphp
                                                <select class="form-control" name="parking">
                                                    <option value="">Select Parking Option</option>
                                                    @foreach ($floorOptions as $value => $label)
                                                    <option value="{{ $value }}" {{ $propertyData->settings->parking_ability === $value ? 'selected' : '' }}>{{ $label }}</option>
                                                    @endforeach
                                                </select>
                                                <span class="error parkingError text-danger"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group"><label class="form-label">Amenity Features : </label>

                                        @if (!empty($proepertyAmenities) && is_array($proepertyAmenities))
                                        @foreach ($proepertyAmenities as $amenity)
                                        @php
                                        $propertyAmenities = is_string($propertyData->additional->property_amenity)
                                        ? (str_starts_with($propertyData->additional->property_amenity, '[')
                                        ? json_decode($propertyData->additional->property_amenity, true)
                                        : explode(',', $propertyData->additional->property_amenity))
                                        : (array) $propertyData->additional->property_amenity;
                                        @endphp

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" name="amenities[]"
                                                id="amenity-{{ $amenity['amenity_id'] }}"
                                                value="{{ $amenity['amenity_id'] }}" type="checkbox" {{ in_array($amenity['amenity_id'], $propertyAmenities) ? 'checked' : '' }}>
                                            <label class="form-check-label"
                                                for="amenity-{{ $amenity['amenity_id'] }}">{{ $amenity['amenity_name'] }}
                                            </label>
                                        </div>
                                        @endforeach
                                        @else
                                        <div> No amenity Found ! </div>
                                        @endif
                                    </div>


                                    <div class="mb-3"><label class="form-label">Is This A Corner Plot:</label>
                                        <div class="form-check form-check-inline"><input class="form-check-input"
                                                id="corner_plot_1" type="radio" value="Yes"
                                                name="corner_plot" {{$propertyData->additional->corner_plot=='yes'?'checked':''}}><label class="form-check-label"
                                                for="corner_plot_1">Yes</label></div>
                                        <div class="form-check form-check-inline"><input class="form-check-input"
                                                id="corner_plot_2" type="radio" value="No"
                                                name="corner_plot" {{$propertyData->additional->corner_plot=='no'?'checked':''}}><label class="form-check-label"
                                                for="corner_plot_2">No</label></div>
                                        <span class="error corner_plotError text-danger"></span>
                                    </div>

                                    <div class="mb-3"><label class="form-label">Is Allowed for Floor
                                            Construction:</label>
                                        <div class="form-check form-check-inline"><input class="form-check-input"
                                                id="allowed_construction_1" type="radio" value="Yes"
                                                name="allowed_construction" {{$propertyData->additional->allowed_construction=='Yes'?'checked':''}}><label class="form-check-label"
                                                for="allowed_construction_1">Yes</label></div>
                                        <div class="form-check form-check-inline"><input class="form-check-input"
                                                id="allowed_construction_2" type="radio" value="No"
                                                name="allowed_construction"><label class="form-check-label"
                                                for="allowed_construction_2" {{$propertyData->additional->allowed_construction=='No'?'checked':''}}>No</label></div>
                                        <span class="error allowed_constructionError text-danger"></span>
                                    </div>
                                </div>

                                <div id="commercial_features" style="display: none;">
                                    <div class="mb-3">
                                        <label class="form-label">Personal Washroom:</label>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                id="personal_washroom_1"
                                                type="radio"
                                                value="Yes"
                                                name="personal_washroom"
                                                {{ $propertyData->additional->is_personal_washroom === 'Yes' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="personal_washroom_1">Yes</label>
                                        </div>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                id="personal_washroom_2"
                                                type="radio"
                                                value="No"
                                                name="personal_washroom"
                                                {{ $propertyData->additional->is_personal_washroom === 'No' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="personal_washroom_2">No</label>
                                        </div>
                                    </div>


                                    <div class="mb-3">
                                        <label class="form-label">Pantry/Cafeteria:</label>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                id="cafeteria_dry"
                                                type="radio"
                                                value="dry"
                                                name="cafeteria"
                                                {{ $propertyData->additional->pantry_cafeteria_status == 'dry' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="cafeteria_dry">Dry</label>
                                        </div>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                id="cafeteria_wet"
                                                type="radio"
                                                value="wet"
                                                name="cafeteria"
                                                {{ $propertyData->additional->pantry_cafeteria_status == 'wet' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="cafeteria_wet">Wet</label>
                                        </div>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input"
                                                id="cafeteria_not_available"
                                                type="radio"
                                                value="not_available"
                                                name="cafeteria"
                                                {{ $propertyData->additional->pantry_cafeteria_status == 'not_available' ? 'checked' : '' }}>
                                            <label class="form-check-label" for="cafeteria_not_available">Not Available</label>
                                        </div>
                                    </div>

                                </div>

                                <label class="form-label">Furnish Status</label>
                                <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                    aria-label="Property Status">
                                    @if (!empty($propertyFurnishes) && is_array($propertyFurnishes))
                                    @foreach ($propertyFurnishes as $furnish)
                                    <input type="radio" class="btn-check" name="property_furnish"
                                        value="{{ $furnish['furnish_id'] }}"
                                        id="property_status_{{ $furnish['furnish_id'] }}" autocomplete="off"
                                        {{ $propertyData->additional->property_furnish == $furnish['furnish_id'] ? 'checked' : '' }}>
                                    <label class="btn btn-outline-light"
                                        for="property_status_{{ $furnish['furnish_id'] }}">{{ $furnish['furnish_name'] }}</label>
                                    @endforeach
                                    @else
                                    No Furnish Found !
                                    @endif
                                </div>

                                <div class="d-grid columns-2">
                                    <button type="button" class="btn btn-secondary btn-back-4"><i
                                            class="bi bi-arrow-left"></i> Back</button>
                                    <button type="button" class="btn btn-primary btn-next" data-step="4">Next <i
                                            class="bi bi-arrow-right"></i></button>
                                </div>
                            </div>

                            <div id="step-5" style="display:none;">
                                <div class="mb-3">
                                    <label class="form-label">Possession Status :</label>
                                    @if (!empty($propertyStatus) && is_array($propertyStatus))
                                    @foreach ($propertyStatus as $status)


                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input property-status-radio" type="radio"
                                            name="possession_status" id="status_{{ $status['status_id'] }}"
                                            value="{{ $status['status_id'] }}" {{$propertyData->additional->possession_status== $status['status_id'] ? 'checked' : '' }}>
                                        <label class="form-check-label"
                                            for="status_{{ $status['status_id'] }}">{{ $status['status_name'] }}</label>
                                    </div>
                                    @endforeach
                                    @else
                                    No staus Found !
                                    @endif
                                </div>
                                <div class="available_features" style="display: none;">
                                    <label class="form-label">Age Of Construction :</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Floors">
                                        <input type="radio" class="btn-check" name="age" value="new"
                                            id="age_1" autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="age_1">New</label>

                                        <input type="radio" class="btn-check" name="age"
                                            value="less_than_5_years" id="age_2" autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_2">Less Than 5
                                            Years</label>

                                        <input type="radio" class="btn-check" name="age" value="5_10_years"
                                            id="age_3" autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_3">5-10 Years</label>

                                        <input type="radio" class="btn-check" name="age" value="10_15_years"
                                            id="age_4" autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_4">10-15 Years</label>

                                        <input type="radio" class="btn-check" name="age" value="15_20_years"
                                            id="age_5" autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_5">15-20 Years</label>
                                    </div>
                                </div>

                                <div class="underConstruction_features" style="display: none;">
                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12"><label class="form-label">Expected Month of
                                                Possession</label><select class="form-control "
                                                name="construction_month">
                                                <option value="">Select Month</option>
                                                <option value="01">January</option>
                                                <option value="02">February</option>
                                                <option value="03">March</option>
                                                <option value="04">April</option>
                                                <option value="05">May</option>
                                                <option value="06">June</option>
                                                <option value="07">July</option>
                                                <option value="08">August</option>
                                                <option value="09">September</option>
                                                <option value="10">October</option>
                                                <option value="11">November</option>
                                                <option value="12">December</option>
                                            </select></div>
                                        <div class="col-lg-6 col-12"><label class="form-label">Expected Year of
                                                Possession</label><select class="form-control "
                                                name="construction_year">
                                                <option value="">Select Year</option>
                                                <option value="2025">2025</option>
                                                <option value="2026">2026</option>
                                                <option value="2027">2027</option>
                                                <option value="2028">2028</option>
                                                <option value="2029">2029</option>
                                                <option value="2030">2030</option>
                                                <option value="2031">2031</option>
                                                <option value="2032">2032</option>
                                                <option value="2033">2033</option>
                                                <option value="2034">2034</option>
                                                <option value="2035">2035</option>
                                                <option value="2036">2036</option>
                                                <option value="2037">2037</option>
                                                <option value="2038">2038</option>
                                                <option value="2039">2039</option>
                                                <option value="2040">2040</option>
                                                <option value="2041">2041</option>
                                                <option value="2042">2042</option>
                                                <option value="2043">2043</option>
                                                <option value="2044">2044</option>
                                                <option value="2045">2045</option>
                                            </select></div>
                                    </div>
                                </div>

                                <div class="row gx-3">
                                    <div class="col-lg-6 col-12">
                                        <label class="form-label">Expected Price</label>
                                        <div class="input-group mb-3">
                                            <select class="" data-width="fit" title="Currency"
                                                name="currency">
                                                <option disabled="disabled">Currency</option>
                                                <option value="AED">AED</option>
                                                <option value="EURO">EURO</option>
                                                <option value="POND">POUND</option>
                                                <option value="USD">USD</option>
                                            </select>
                                            <input type="text" class="form-control" value="{{$propertyData->settings->expected_price}}" name="expected_price"
                                                placeholder="Enter Amount" />
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-12">
                                        <div class="form-field">
                                            <label class="form-label">Booking/Token Amount (optional)</label>
                                            <input type="number" class="form-control" name="token_amount"
                                                placeholder="Enter Token Amount" />
                                        </div>
                                    </div>
                                </div>
                                <div class="d-grid columns-2">
                                    <button type="button" class="btn btn-secondary btn-back-5"><i
                                            class="bi bi-arrow-left"></i> Back</button>
                                    <button type="button" class="btn btn-primary btn-next" data-step="5">Next <i
                                            class="bi bi-arrow-right"></i></button>
                                </div>
                            </div>

                            <div id="step-6" style="display:none;">
                                <div class="form-field">
                                    <div class="image-tab-content">
                                        <ul class="nav nav-underline nav-custom">

                                            <li class="nav-item"><a class="nav-link active" data-tab='living'
                                                    href="javascript:void(0)">Living room</a>
                                            </li>
                                            <li class="nav-item"><a class="nav-link" data-tab='bathroom'
                                                    href="javascript:void(0)">Bathroom</a></li>
                                            <li class="nav-item"><a class="nav-link" data-tab='balcony'
                                                    href="javascript:void(0)">Balconies</a>
                                            </li>
                                            <li class="nav-item"><a class="nav-link" data-tab='floor'
                                                    href="javascript:void(0)">Floor Plan</a>
                                            </li>
                                            <li class="nav-item"><a class="nav-link" data-tab='master'
                                                    href="javascript:void(0)">Master Plan</a>
                                            </li>
                                            <li class="nav-item"><a class="nav-link" data-tab='exterior'
                                                    href="javascript:void(0)">Exterior View</a></li>
                                            <li class="nav-item"><a class="nav-link" data-tab='other'
                                                    href="javascript:void(0)">Others</a></li>
                                        </ul>
                                    </div>
                                    <div class="form-field mt-2">
                                        <div class="upload-area" id="uploadfile">
                                            <input type="file" name="fileinput" id="fileinput" multiple>
                                            <i class="bi bi-upload"></i>
                                            <p>Drag & drop files here or <span class="text-site">click</span> to
                                                select
                                                files</p>
                                        </div>
                                    </div>

                                    <p class="text-help">Accepted formats are .jpg, .gif, .bmp & .png. Maximum size
                                        allowed is 20 MB. Minimum dimension allowed 600*400 Pixel</p>
                                </div>

                                @foreach(['living', 'bathroom', 'balcony', 'floor', 'master', 'exterior', 'other'] as $type)
                                <div class="img-content" id="tab-content-{{ $type }}" style="{{ $type == 'living' ? '' : 'display:none' }}">
                                    <div class="upload-gallery" id="preview-{{ $type }}">
                                        @if(!empty($groupedImages[$type]))
                                        @foreach($groupedImages[$type] as $image)
                                        <div class="preview-item">
                                            <img src="{{ asset('user_upload/property_images/' . $image->filename) }}" alt="Property Image" style="width: 150px; height: auto;">
                                            <button class="remove-btn" data-type="{{ $type }}" data-filename="{{ $image->filename }}">X</button>
                                            <input type="hidden" name="image[{{ $type }}][]" value="{{ $image->filename }}">
                                        </div>
                                        @endforeach
                                        @endif
                                    </div>
                                    <div class="form-field">
                                        <label class="form-label">Description</label>
                                        <textarea rows="3" class="form-control" name="image_desc[{{ $type }}]" placeholder="Write something..."></textarea>
                                    </div>
                                </div>
                                @endforeach



                                <div class="d-grid columns-2">
                                    <button type="button" class="btn btn-secondary btn-back-6"><i
                                            class="bi bi-arrow-left"></i> Back</button>
                                    <button type="button" class="btn btn-primary btn-next" data-step="6" id="submit-btn">Post
                                        Property</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</section>
@endsection
@push('custom-js')
<script>
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
        $(".nav-link").click(function(e) {
            e.preventDefault();
            $(".nav-link").removeClass("active");
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