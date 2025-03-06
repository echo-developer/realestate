@extends('Admin.Post_property_view.layout_for_property_post')
{{-- @dd($propertyStatus); --}}
@section('content')
    <section class="section post-page">
        <div class="container">
            <div class="row justify-content-center">
                <aside class="col-lg-12 col-12">
                    <div class="card border-0 post-form">
                        <div class="card-header pb-0">
                            <ul class="nav nav-underline mb-0 gap-5 d-flex">
                                <li class="nav-item">
                                    <a class="nav-link active tab-1" href="#">Personal Info</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link tab-2" href="#">Property Details</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link tab-3" href="#">Location</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link tab-4" href="#">Feature</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link tab-5" href="#">Availability</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link tab-6" href="#">Photos</a>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <form method="post" id='post-property-form'>
                                <input type="hidden" name="step" value="1" id="step" />
                                
                                <div id="step-1" style="display:none1;">
                                    <label class="d-block mb-2">I'm a</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group">
                                        <input type="radio" class="btn-check" name="postAs" id="owner"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="owner"><img
                                                src="{{ asset('assets/icons/owner.png') }}" alt="Icon" height="24"
                                                width="24" />
                                            Owner</label>
                                        <input type="radio" class="btn-check" name="postAs" id="agent"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="agent"><img
                                                src="{{ asset('assets/icons/agent.png') }}" alt="Icon" height="24"
                                                width="24" />
                                            Agent</label>
                                        <input type="radio" class="btn-check" name="postAs" id="builder"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="builder"><img
                                                src="{{ asset('assets/icons/builder.png') }}" alt="Icon" height="24"
                                                width="24" /> Builder</label>
                                    </div>

                                    <div class="form-field mb-3">
                                        <label for="name" class="form-label">Name</label>
                                        <input type="text" class="form-control" name="name"
                                            value="" placeholder="Enter Your Name">
                                        <span class="error nameError text-danger"></span>
                                    </div>

                                    {{-- <div class="input-group mb-3">
                                        <select class="" data-width="fit">
                                            <option>IND +91</option>
                                            <option>+81</option>
                                            <option>+71</option>
                                            <option>+61</option>
                                            <option>+51</option>
                                        </select>
                                        <input type="number" class="form-control" name="whatsapp" placeholder="WhatsApp No." required />
                                    </div> --}}

                                    <div class="alert alert-success d-flex align-items-center">
                                        <img src="{{ asset('assets/icons/whatsapp.png') }}" alt="whatsapp" height="48"
                                            width="48" />
                                        <p class="ps-3">Enter your <span class="text-green">WhatsApp Number</span> to get
                                            enqueries from buyer/tenant</p>
                                    </div>

                                    <div class="form-field mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" name="email" class="form-control"
                                            value="" placeholder="Enter Your Email I’d">
                                        <span class="error emailError text-danger"></span>
                                    </div>

                                    <div class="d-grid">
                                        <button type="button" class="btn btn-primary btn-next" data-step="1">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>
                                 
                                <div id="step-2" style="display:none;">
                                    <label class="form-label">You are here to</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group">
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio1"
                                            value="rent" autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="btnradio1">Rent</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio2"
                                            value="sale" autocomplete="off">
                                        <label class="btn btn-outline-light" for="btnradio2">Sale</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio3"
                                            value="pg" autocomplete="off">
                                        <label class="btn btn-outline-light" for="btnradio3">PG/Hostel</label>
                                    </div>
                                    <label class="form-label">Property Type</label>
                                    <div class="mb-3">
                                        <select class="form-select" name="property_type" id="property_type">
                                            <option value="">Select Property Type</option>
                                            @isset($propertyTypes)
                                                @foreach ($propertyTypes as $propertyType)
                                                    <option value="{{ $propertyType['category_id'] }}"
                                                        {{ $loop->first ? 'selected' : '' }}>
                                                        {{ $propertyType['category_name'] }}
                                                    </option>
                                                @endforeach
                                            @endisset
                                        </select>
                                    </div>

                                    <label class="form-label">Property For.</label>
                                    <div class="mb-3">
                                        <select class="form-select" name="property_for" id="property_for">

                                        </select>
                                    </div>

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
                                                            <option value="{{ $city['city_id'] }}">{{ $city['name'] }}
                                                            </option>
                                                        @endforeach
                                                    @else
                                                        <option value="" disabled>No cities available</option>
                                                        <!-- Fallback option -->
                                                    @endif

                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Landmark</label>
                                                <input class="form-control pac-target-input" placeholder="Enter landmark"
                                                    id="landmark" required="" type="text" name="landmark"
                                                    autocomplete="off">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-field">
                                        <label class="form-label">Name of Project Or Locality</label>
                                        <input type="text" name="Project_ Locality_Name" class="form-control"
                                            placeholder="Enter Project Name Or Locality" />
                                    </div>
                                    <div class="form-field">
                                        <label class="form-label">Address</label>
                                        <textarea rows="3" class="form-control mb-2" name='address' placeholder="Enter Your Address"></textarea>
                                        <p class="text-end text-help">Maximum 300 words are allowed</p>
                                    </div>


                                    <div class="form-field">
                                        <label for="description">Property Description</label>
                                        <textarea id="description" name="description" rows="3" class="form-control "
                                            placeholder="Enter Property Description"></textarea>
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
                                                    <button class="btn btn-danger minus qtybutton">-</button>
                                                    <input class="form-control text-center mx-2 room-count" type="text" value="0" readonly style="max-width: 80px;">
                                                    <button class="btn btn-success plus qtybutton">+</button>
                                                </div>
                                                <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                            </div>
                                        </div>
                                    
                                        <!-- Balcony -->
                                        <div class="col-lg-3 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Balcony</label>
                                                <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                                    <button class="btn btn-danger minus qtybutton">-</button>
                                                    <input class="form-control text-center mx-2 room-count" type="text" value="0" readonly style="max-width: 80px;">
                                                    <button class="btn btn-success plus qtybutton">+</button>
                                                </div>
                                                <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                            </div>
                                        </div>
                                    
                                        <!-- Bathroom -->
                                        <div class="col-lg-3 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Bathroom</label>
                                                <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                                    <button class="btn btn-danger minus qtybutton">-</button>
                                                    <input class="form-control text-center mx-2 room-count" type="text" value="0" readonly style="max-width: 80px;">
                                                    <button class="btn btn-success plus qtybutton">+</button>
                                                </div>
                                                <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                            </div>
                                        </div>
                                    </div>
                                    

                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field"><label class="form-label">Carpet Area</label>
                                                <div class="input-group"><input class="form-control " name="carpet_area"
                                                        placeholder="Type Carpet Area" type="number"><span
                                                        class="input-group-text">sqft</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field"><label class="form-label">Super Area</label>
                                                <div class="input-group"><input class="form-control " name="super_area"
                                                        placeholder="Type Super Area" type="number"><span
                                                        class="input-group-text">sqft</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Floor No.</label>
                                        <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                            aria-label="Floors">
                                            <input class="btn-check" id="floors_1" value="floors_1" autocomplete="off"
                                                type="radio" name="floors" checked>
                                            <label class="btn btn-outline-light" for="floors_1">Lower Basement</label>

                                            <input class="btn-check" id="floors_2" value="floors_2" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_2">Upper Basement</label>

                                            <input class="btn-check" id="floors_3" value="floors_3" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_3">Ground</label>

                                            <input class="btn-check" id="floors_4" value="floors_4" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_4">1</label>

                                            <input class="btn-check" id="floors_5" value="floors_5" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_5">2</label>

                                            <input class="btn-check" id="floors_6" value="floors_6" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_6">3</label>

                                            <input class="btn-check" id="floors_7" value="floors_7" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_7">4</label>

                                            <input class="btn-check" id="floors_8" value="floors_8" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_8">5</label>

                                            <input class="btn-check" id="floors_6_plus" autocomplete="off"
                                                type="radio" name="floors">
                                            <label class="btn btn-outline-light" for="floors_6_plus"><i
                                                    class="bi bi-plus-lg"></i></label>
                                        </div>
                                    </div>


                                    <div class="form-group">
                                        <label class="form-label">Total Floors</label>
                                        <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                            aria-label="Total Floors">
                                            <input class="btn-check" id="total_floor_1" value="total_floor_1"
                                                autocomplete="off" type="radio" name="total_floors" checked>
                                            <label class="btn btn-outline-light" for="total_floor_1">1</label>

                                            <input class="btn-check" id="total_floor_2" value="total_floor_2"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_2">2</label>

                                            <input class="btn-check" id="total_floor_3" value="total_floor_3"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_3">3</label>

                                            <input class="btn-check" id="total_floor_4" value="total_floor_4"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_4">4</label>

                                            <input class="btn-check" id="total_floor_5" value="total_floor_5"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_5">5</label>

                                            <input class="btn-check" id="total_floor_6" value="total_floor_6"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_6">6</label>

                                            <input class="btn-check" id="total_floor_7" value="total_floor_7"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_7">7</label>

                                            <input class="btn-check" id="total_floor_8" value="total_floor_8"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_8">8</label>

                                            <input class="btn-check" id="total_floor_9" value="total_floor_9"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_9">9</label>

                                            <input class="btn-check" id="total_floor_10" value="total_floor_10"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_10">10</label>

                                            <input class="btn-check" id="total_floor_11" value="total_floor_11"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_11">11</label>

                                            <input class="btn-check" id="total_floor_12" value="total_floor_12"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="total_floor_12">12</label>

                                            <input class="btn-check" id="floors_12_plus" value="floors_12_plus"
                                                autocomplete="off" type="radio" name="total_floors">
                                            <label class="btn btn-outline-light" for="floors_12_plus">
                                                <i class="bi bi-plus-lg"></i>
                                            </label>

                                        </div>
                                    </div>



                                    <div id="residential_features">
                                        <div class="row gx-3">
                                            <div class="col-lg-6 col-12"><label class="form-label">Facing</label>
                                                <div class="form-field"><select class="form-control"
                                                        name="facing_direction">
                                                        <option value="">Select Facing</option>
                                                        <option value="east">East</option>
                                                        <option value="north">North</option>
                                                        <option value="north_east">North - East</option>
                                                        <option value="north_west">North - West</option>
                                                        <option value="south">South</option>
                                                        <option value="south_east">South - East</option>
                                                        <option value="south_west">South - West</option>
                                                        <option value="west">West</option>
                                                    </select></div>
                                            </div>
                                            <div class="col-lg-6 col-12"><label class="form-label">Parking</label>
                                                <div class="form-field"><select class="form-control">
                                                        <option value="">Select Parking Option</option>
                                                        <option value="av">Available</option>
                                                        <option value="na">Not Available</option>
                                                        <option value="uc">Under Construction</option>
                                                    </select></div>
                                            </div>
                                        </div>
                                        <div class="form-group"><label class="form-label">Amenity Features : </label>

                                            @if (!empty($proepertyAmenities) && is_array($proepertyAmenities))
                                                @foreach ($proepertyAmenities as $amenity)
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" name="amenities[]"
                                                            id="amenity-{{ $amenity['amenity_id'] }}"
                                                            value="{{ $amenity['amenity_id'] }}" type="checkbox">
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
                                                    name="corner_plot"><label class="form-check-label"
                                                    for="corner_plot_1">Yes</label></div>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="corner_plot_2" type="radio" value="No"
                                                    name="corner_plot"><label class="form-check-label"
                                                    for="corner_plot_2">No</label></div>
                                        </div>

                                        <div class="mb-3"><label class="form-label">Is Allowed for Floor
                                                Construction:</label>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="allowed_construction_1" type="radio" value="Yes"
                                                    name="allowed_construction"><label class="form-check-label"
                                                    for="allowed_construction_1">Yes</label></div>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="allowed_construction_2" type="radio" value="No"
                                                    name="allowed_construction"><label class="form-check-label"
                                                    for="allowed_construction_2">No</label></div>
                                        </div>
                                    </div>

                                    <div id="commercial_features" style="display: none;">
                                        <div class="mb-3"><label class="form-label">Personal Washroom:</label>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="personal_washroom_1" type="radio" value="Yes"
                                                    name="personal_washroom"><label class="form-check-label"
                                                    for="personal_washroom_1">Yes</label></div>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="personal_washroom_2" type="radio" value="No"
                                                    name="personal_washroom"><label class="form-check-label"
                                                    for="personal_washroom_2">No</label></div>
                                        </div>

                                        <div class="mb-3"><label class="form-label">Pantry/Cafeteria:</label>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="cafeteria_dry" type="radio" value="dry"
                                                    name="cafeteria"><label class="form-check-label"
                                                    for="cafeteria_dry">Dry</label></div>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="cafeteria_wet" type="radio" value="wet"
                                                    name="cafeteria"><label class="form-check-label"
                                                    for="cafeteria_wet">Wet</label></div>
                                            <div class="form-check form-check-inline"><input class="form-check-input"
                                                    id="cafeteria_not_available" type="radio" value="not_available"
                                                    name="cafeteria"><label class="form-check-label"
                                                    for="cafeteria_not_available">Not Available</label></div>
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
                                                    {{ $loop->first ? 'checked' : '' }}>
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
                                                        value="{{ $status['status_id'] }}">
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
                                                <input type="text" class="form-control" name="expected_price"
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

                                                <li class="nav-item"><a class="nav-link" data-tab='living'
                                                        href="#">Living room</a>
                                                </li>
                                                <li class="nav-item"><a class="nav-link" data-tab='bathroom'
                                                        href="#">Bathroom</a></li>
                                                <li class="nav-item"><a class="nav-link" data-tab='balcony'
                                                        href="#">Balconies</a>
                                                </li>
                                                <li class="nav-item"><a class="nav-link" data-tab='floor'
                                                        href="#">Floor Plan</a>
                                                </li>
                                                <li class="nav-item"><a class="nav-link" data-tab='master'
                                                        href="#">Master Plan</a>
                                                </li>
                                                <li class="nav-item"><a class="nav-link" data-tab='exterior'
                                                        href="#">Exterior
                                                        View</a></li>
                                                <li class="nav-item"><a class="nav-link" data-tab='other'
                                                        href="#">Others</a></li>
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
                                    <!-- Hidden Field to Store Image Names -->
                                    <input type="hidden" id="uploadedImages" name="uploaded_images">

                                    <div class="form-field">
                                        <label class="form-label">Description</label>
                                        <textarea rows="3" class="form-control" name="image_desc" placeholder="Write something..."></textarea>
                                    </div>

                                    <div class="upload-gallery">
                                        <div class="upload-gallery" id="previewGallery">

                                        </div>
                                    </div>

                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-6"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="submit" class="btn btn-primary btn-next" data-step="6" id="submit-btn">Post
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
        $(document).ready(function() {
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

            $('.btn-next').click(function(){
                var formId = $("#post-property-form");
                var step = $(this).attr('data-step');
                $.ajax({
                    type : 'POST',
                    url : '{{ url("/property/save-property") }}',
                    data : $(formId).serialize(),
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    dataType : 'JSON',
                    success : function(res){
                       if(res.status == 'OK')
                       {
                         $("#step-"+step).hide();
                         $("#step-"+(Number(step)+1)).show();
                         $("#step").val(Number(step)+1);
                         $(".tab-"+step).removeClass('active');
                         $(".tab-"+(Number(step)+1)).addClass('active');
                       }
                    },
                    error: function(xhr) {
                        var res = xhr.responseJSON;
                    }
                });
            });

            $('.btn-next-1').click(function() {
                $('#step-1').hide();
                $('#step-2').show();
                $('.nav-underline li:nth-child(1) .nav-link').removeClass('active');
                $('.nav-underline li:nth-child(2) .nav-link').addClass('active');
            });
            $('.btn-back-2').click(function() {
                $('#step-1').show();
                $('#step-2').hide();
                $('.nav-underline li:nth-child(1) .nav-link').addClass('active');
                $('.nav-underline li:nth-child(2) .nav-link').removeClass('active');
            });
            $('.btn-next-2').click(function() {
                $('#step-2').hide();
                $('#step-3').show();
                $('.nav-underline li:nth-child(2) .nav-link').removeClass('active');
                $('.nav-underline li:nth-child(3) .nav-link').addClass('active');
            });
            $('.btn-back-3').click(function() {
                $('#step-2').show();
                $('#step-3').hide();
                $('.nav-underline li:nth-child(2) .nav-link').addClass('active');
                $('.nav-underline li:nth-child(3) .nav-link').removeClass('active');
            });
            $('.btn-next-3').click(function() {
                $('#step-3').hide();
                $('#step-4').show();
                $('.nav-underline li:nth-child(3) .nav-link').removeClass('active');
                $('.nav-underline li:nth-child(4) .nav-link').addClass('active');
            });
            $('.btn-back-4').click(function() {
                $('#step-3').show();
                $('#step-4').hide();
                $('.nav-underline li:nth-child(3) .nav-link').addClass('active');
                $('.nav-underline li:nth-child(4) .nav-link').removeClass('active');
            });
            $('.btn-next-4').click(function() {
                $('#step-4').hide();
                $('#step-5').show();
                $('.nav-underline li:nth-child(4) .nav-link').removeClass('active');
                $('.nav-underline li:nth-child(5) .nav-link').addClass('active');
            });
            $('.btn-back-5').click(function() {
                $('#step-4').show();
                $('#step-5').hide();
                $('.nav-underline li:nth-child(4) .nav-link').addClass('active');
                $('.nav-underline li:nth-child(5) .nav-link').removeClass('active');
            });
            $('.btn-next-5').click(function() {
                $('#step-5').hide();
                $('#step-6').show();
                $('.nav-underline li:nth-child(5) .nav-link').removeClass('active');
                $('.nav-underline li:nth-child(6) .nav-link').addClass('active');
            });
            $('.btn-back-6').click(function() {
                $('#step-5').show();
                $('#step-6').hide();
                $('.nav-underline li:nth-child(5) .nav-link').addClass('active');
                $('.nav-underline li:nth-child(6) .nav-link').removeClass('active');
            });
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
                var dropdown = $('#property_for');
                dropdown.empty();

                $.ajax({
                    url: "{{ url('/api/get_property_for') }}/" + propertyId,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        if (response.status === 1) {
                            dropdown.append(
                                '<option value="">Select Sub Category</option>'); // Default option

                            $.each(response.data, function(index, item) {
                                dropdown.append('<option value="' + item.sub_category_id +
                                    '">' + item.sub_category_name + '</option>');
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

            $(".nav-link").removeClass("active");
            $(".nav-link[data-tab='exterior']").addClass("active");

            // Handle tab switching on click
            $(".nav-link").on("click", function(e) {
                e.preventDefault();
                $(".nav-link").removeClass("active");
                $(this).addClass("active");
            });





            let activeType = 'interior';
            let uploadedFiles = {}; // Store images grouped by data-tab


            $('.nav-link').click(function(e) {
                e.preventDefault();
                $('.nav-link.active').removeClass('active');
                $(this).addClass('active');
                activeType = $(this).data('tab');
            });

            $('#fileinput').on('change', function() {
                let files = this.files;
                if (files.length === 0) {
                    alert('Please select at least one file.');
                    return;
                }

                let formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('images[]', files[i]);
                }
                formData.append('type', activeType);

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
                            if (!uploadedFiles[activeType]) {
                                uploadedFiles[activeType] = [];
                            }

                            $.each(data.images, function(index, image) {
                                uploadedFiles[activeType].push(image.filename);
                                previewImage(image.imageUrl, image.filename,
                                    activeType);
                            });

                            updateHiddenField();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', error);
                    }
                });
            });

            function previewImage(imageUrl, filename, type) {

                let gallery = $('#previewGallery');
                let imgWrapper = $('<div class="preview-item"></div>');
                imgWrapper.html(`
            <img src="${imageUrl}" alt="Uploaded Image">
            <button class="remove-btn" data-type="${type}" data-filename="${filename}">X</button>`);
                imgWrapper.find('.remove-btn').click(function() {
                    let fileType = $(this).data('type'); // Get the type
                    removeImage(imgWrapper, filename, fileType);
                });
                gallery.append(imgWrapper);
            }


            function removeImage(previewItem, filename, type) {
                previewItem.remove();
                if (uploadedFiles[type]) {
                    uploadedFiles[type] = uploadedFiles[type].filter(file => file !== filename);
                    if (uploadedFiles[type].length === 0) {
                        delete uploadedFiles[type]; // Remove empty categories
                    }
                }
                updateHiddenField();
            }

            function updateHiddenField() {
                $('#uploadedImages').val(JSON.stringify(uploadedFiles));
            }


            $("#post-property-form").on("submit", function(e) {
                console.log('sudhanshu ');
                e.preventDefault(); // Prevent default form submission

                let formData = new FormData(this); // Get form data
                let actionUrl = "{{ url('property/post-property') }}"; // Get form action URL

                $.ajax({
                    url: actionUrl,
                    type: "POST",
                    data: formData,
                    processData: false, // Required for FormData
                    contentType: false, // Required for FormData
                    headers: {
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                            "content") // Add CSRF Token
                    },
                    beforeSend: function() {
                        $("#submit-btn").prop("disabled", true).text(
                            "Posting..."); // Disable button & show loading text
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
                            "Post Property"); // Re-enable button
                    }
                });
            });


            $(".qtybutton").off("click").on("click", function () {  
    let parent = $(this).closest(".form-field");  
    let input = parent.find(".room-count"); 
    let formContainer = parent.find(".size-forms");  

    let value = parseInt(input.val()) || 0;  

    if ($(this).hasClass("plus")) {  
        value++;  
        input.val(value);  
        addForm(formContainer); // Remove passing value  
    } else if ($(this).hasClass("minus") && value > 0) {  
        value--;  
        input.val(value);  
        removeForm(formContainer);  
    }  
});  

function addForm(formContainer) {  
    let formHtml = `  
        <div class="size-form mt-3 p-3 border rounded bg-light">  
            <label class="fw-bold">Height & Width</label>  
            <div class="row">  
                <div class="col-6">  
                    <input type="text" class="form-control mb-2" placeholder="Enter Height" value="" autocomplete="off">  
                </div>  
                <div class="col-6">  
                    <input type="text" class="form-control" placeholder="Enter Width" value="" autocomplete="off">  
                </div>  
            </div>  
        </div>  
    `;  
    formContainer.append(formHtml);  
}  

function removeForm(formContainer) {  
    formContainer.children().last().remove();  
}  


            

        });
    </script>
@endpush
