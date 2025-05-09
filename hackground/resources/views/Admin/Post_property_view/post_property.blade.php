@extends('Admin.layouts.app')
@push('custom-css')

<link href="{{ asset('assets/dist/css/bootstrap-select.css') }}" type="text/css" rel="stylesheet">
<script src="{{ asset('assets/dist/js/bootstrap-select.min.js') }}"></script>

<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/select2-bootstrap-5-theme.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">

@endpush

@section('content')
<div class="app-main__inner">
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="bi bi-house-add"></i>
                </div>
                <div>Post Property <div class="page-title-subheading">Property <i class="bi bi-chevron-right"></i> Sell Or Rent Your Property
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-lg-end">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Post Property</li>
                </ol>
            </div>
        </div>
    </div>
    <section class="">
        <ul class="nav nav-underline mb-3 gap-5 d-flex">
            {{-- <li class="nav-item">
            <a class="nav-link tab-1 active" href="javascript:void(0)">Personal Info</a>
        </li> --}}
            <li class="nav-item">
                <a class="nav-link tab-2 active" href="javascript:void(0)">Basic Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link tab-3" href="javascript:void(0)">Location Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link tab-4" href="javascript:void(0)">Landmark Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link tab-5" href="javascript:void(0)">Property Features</a>
            </li>
            <li class="nav-item">
                <a class="nav-link tab-6" href="javascript:void(0)">Additional Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link tab-7" href="javascript:void(0)">Photos/Gallery</a>
            </li>
        </ul>
        <div class="card border-0 post-form">

            <div class="card-body">
                <form method="post" id='post-property-form'>
                    <input type="hidden" name="step" value="2" id="step" />
                    <input type="hidden" name="user_id" value="{{ $userData->id }}" id="user_id" />

                    <div id="step-2" style="display:none1;">
                        <div class="row gx-3">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">                            
                                    <select name="postAs" id="postAs" class="form-select">
                                        <option value="O" <?= $userData->user_type == 'O' ? 'selected' : '' ?>>Owner</option>
                                        <option value="A" <?= $userData->user_type == 'A' ? 'selected' : '' ?>>Agent</option>
                                        <option value="B" <?= $userData->user_type == 'B' ? 'selected' : '' ?>>Builder</option>
                                    </select>
                                    <label class="form-label">User Type</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select name="postFor" id="postFor" class="form-select">
                                        <option value="rent" >Rent</option>
                                        <option value="sale" >Sale</option>
                                        <option value="pg">PG/Hostel</option>
                                    </select>
                                    <label class="form-label">You are here to</label>
                                    <span class="error postForError text-danger"></span>
                                </div>
                            </div>
                        
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
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
                                    <label class="form-label">Property Type</label>
                                    <span class="error property_typeError text-danger"></span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select class="form-select" name="property_for" id="property_for">
                                    </select>
                                    <label class="form-label">Property For</label>
                                    <span class="error property_forError text-danger"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="col-lg-6 col-12">

                                <div class="input-group mb-4">
                                    <select class="selectpicker" data-width="fit" title="Currency"
                                        name="currency">
                                        <option disabled="disabled">Currency</option>
                                        <option value="AED">AED</option>
                                        <option value="EURO">EURO</option>
                                        <option value="POND">POUND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                    <div class="form-floating">
                                        <input type="text" class="form-control" name="expected_price" placeholder="Enter Amount" />
                                        <label class="form-label">Expected Price</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-4">
                                    <input type="number" class="form-control" name="token_amount" placeholder="Enter Token Amount" />
                                    <label class="form-label">Booking/Token Amount (optional)</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-floating mb-3">                                 
                            <select name="user_type" id="user_type" class="form-select">
                                <option value="individual" >Standalone Property</option>
                                <option value="project" > Under a Project</option>
                            </select>
                            <label class="form-label">Property Under:</label>       
                            <span class="error property_categoryError text-danger"></span>
                        </div>

                        <div class="form-floating mb-4 project-name">
                            <input class="form-control" name="project_name" id="project_name" value="" placeholder="" />
                            <label class="form-label">Project Name</label>
                            <span class="text-danger" id="project_nameError"></span>
                        </div>

                        <div class="form-floating mb-4">
                            <textarea class="form-control" name="buyer_message" id="buyer_message" placeholder="" style="min-height: 100px;"></textarea>
                            <label for="buyer_message">Message to buyer</label>
                            <span class="text-danger" id="buyer_messageError"></span>
                        </div>

                        <div class="">

                            <button type="button" class="btn btn-primary btn-next" data-step="2">Next <i
                                    class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>

                    <div id="step-3" style="display:none;">
                        <div class="row gx-3">
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">
                                    <select id="city" name="city" class="selectpicker" onchange="loadLocality($(this))">
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
                                    <label class="form-label">City</label>
                                    <span class="error cityError text-danger"></span>
                                </div>
                            </div>

                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">
                                    <select class="selectpicker" name="locality" id="locality">

                                    </select>
                                    <label class="form-label">Locality</label>
                                    <span class="error localityError text-danger"></span>
                                </div>
                            </div>

                        </div>

                        <div class="form-floating mb-3">
                            <textarea rows="3" class="form-control mb-2" name='address' placeholder="Enter Your Address" style="min-height: 75px;"></textarea>
                            <label class="form-label">Address</label>
                            <span class="error addressError text-danger"></span>
                            <p class="text-end text-help">Maximum 300 words are allowed</p>
                        </div>

                        <div class="form-floating mb-3">
                            <textarea id="description" name="description" rows="3" class="form-control "
                                placeholder="Enter Property Description" style="min-height: 75px;"></textarea>
                            <label for="description">Property Description</label>
                            <span class="error descriptionError text-danger"></span>
                        </div>

                        <div class="">
                            <button type="button" class="btn btn-secondary btn-back-3 me-2"><i
                                    class="bi bi-arrow-left"></i> Back</button>
                            <button type="button" class="btn btn-primary btn-next" data-step="3">Next <i
                                    class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>

                    <div id="step-4" style="display:none">
                        <div class="landmark-tab-content">
                            <ul class="nav nav-underline nav-custom">
                                <li class="nav-item"><a class="nav-link active" data-tab='education'
                                        href="javascript:void(0)">Education</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" data-tab='healthcare'
                                        href="javascript:void(0)">Healthcare</a></li>
                                <li class="nav-item"><a class="nav-link" data-tab='shopping'
                                        href="javascript:void(0)">Shopping Center</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" data-tab='commercial'
                                        href="javascript:void(0)">Commercial Hub</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" data-tab='transaportation'
                                        href="javascript:void(0)">Transaportation Hub</a>
                                </li>
                            </ul>
                        </div>

                        <div class="landmark-content" id="tab-content-education">
                            <div class="form-field" id="education-field">
                                <button type="button" class="btn btn-primary" onclick="add_landmark('education')"><i class="fa fa-plus"></i> Add Education</button>
                                <div class="education-con my-3">

                                </div>
                            </div>
                        </div>

                        <div class="landmark-content" id="tab-content-healthcare" style="display:none">
                            <div class="form-field">
                                <button type="button" class="btn btn-primary" onclick="add_landmark('healthcare')"><i class="fa fa-plus"></i> Add Healthcare</button>
                                <div class="healthcare-con my-3">

                                </div>
                            </div>
                        </div>

                        <div class="landmark-content" id="tab-content-shopping" style="display:none">
                            <div class="form-field">
                                <button type="button" class="btn btn-primary" onclick="add_landmark('shopping')"><i class="fa fa-plus"></i> Add Shopping</button>
                                <div class="shopping-con my-3">

                                </div>
                            </div>
                        </div>

                        <div class="landmark-content" id="tab-content-commercial" style="display:none">
                            <div class="form-field">
                                <button type="button" class="btn btn-primary" onclick="add_landmark('commercial')"><i class="fa fa-plus"></i> Add Commercial</button>
                                <div class="commercial-con my-3">

                                </div>
                            </div>
                        </div>

                        <div class="landmark-content" id="tab-content-transaportation" style="display:none">
                            <div class="form-field">
                                <button type="button" class="btn btn-primary" onclick="add_landmark('transaportation')"><i class="fa fa-plus"></i> Add transaportation</button>
                                <div class="transaportation-con my-3">

                                </div>
                            </div>
                        </div>

                        <div class="">
                            <button type="button" class="btn btn-secondary btn-back-4 me-2"><i
                                    class="bi bi-arrow-left"></i> Back</button>
                            <button type="button" class="btn btn-primary btn-next" data-step="4">Next <i
                                    class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>

                    <div id="step-5" style="display:none;">

                        <div class="row gx-3">
                            <!-- Bedroom -->
                            <div class="col-lg-3 col-12">
                                <div class="form-field">
                                    <label class="form-label">Bedroom</label>
                                    <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                        <button type="button" class="btn btn-danger minus qtybutton" amenity="bedroom"><i class="bi bi-dash-lg"></i></button>
                                        <input class="form-control text-center mx-2 room-count" name="bedroom_count" type="text" value="0" readonly style="max-width: 80px;">
                                        <button type="button" class="btn btn-success plus qtybutton" amenity="bedroom"><i class="bi bi-plus-lg"></i></button>
                                    </div>
                                    <span class="error bedroom_countError text-danger"></span>
                                    <div class="size-forms"></div>
                                </div>
                            </div>

                            <!-- Balcony -->
                            <div class="col-lg-3 col-12">
                                <div class="form-field">
                                    <label class="form-label">Balcony</label>
                                    <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                        <button type="button" class="btn btn-danger minus qtybutton" amenity="balcony"><i class="bi bi-dash-lg"></i></button>
                                        <input class="form-control text-center mx-2 room-count" name="balcony_count" type="text" value="0" readonly style="max-width: 80px;">
                                        <button type="button" class="btn btn-success plus qtybutton" amenity="balcony"><i class="bi bi-plus-lg"></i></button>
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
                                        <button type="button" class="btn btn-danger minus qtybutton" amenity="bathroom"><i class="bi bi-dash-lg"></i></button>
                                        <input class="form-control text-center mx-2 room-count" name="bathroom_count" type="text" value="0" readonly style="max-width: 80px;">
                                        <button type="button" class="btn btn-success plus qtybutton" amenity="bathroom"><i class="bi bi-plus-lg"></i></button>
                                    </div>
                                    <span class="error bathroom_countError text-danger"></span>
                                    <div class="size-forms"></div> <!-- ✅ Container for dynamic forms -->
                                </div>
                            </div>
                        </div>


                        <div class="row gx-3">
                            <div class="col-md-6 col-12">
                                <div class="input-group mb-3">
                                    <div class="form-floating">
                                        <input class="form-control" name="carpet_area" placeholder="Type Carpet Area" type="number">
                                        <label>Carpet Area</label>
                                    </div>
                                    <span class="input-group-text">sqft</span>
                                    <span class="error carpet_areaError text-danger"></span>
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="input-group mb-3">
                                    <div class="form-floating">
                                        <input class="form-control " name="super_area" placeholder="Type Super Area" type="number">
                                        <label>Super Area</label>
                                    </div>
                                    <span class="input-group-text">sqft</span>
                                    <span class="error super_areaError text-danger"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="form-group col-lg-6 col-12">
                                <label class="form-label">Floor Type</label>
                                <select class="form-control select-2" name="flooring_style[]" multiple>
                                    <option value="">Slect Floor Type</option>
                                    @php
                                    $floor_types = get_floor_types();
                                    @endphp
                                    @if($floor_types)
                                    @foreach($floor_types as $k=>$f)
                                    <option value="{{$k}}">{{$f}}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <span class="error flooring_styleError text-danger"></span>
                            </div>

                            <div class="form-group col-lg-6 col-12">
                                <label class="form-label">Floor No.</label>
                                <select class="form-select" name="floors">
                                    <option value="">--Select--</option>
                                    @php
                                    $floor_numbers = get_floor_numbers();
                                    @endphp
                                    @if($floor_numbers)
                                    @foreach($floor_numbers as $k=>$f)
                                    <option value="{{$k}}">{{$f}}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <span class="error floorsError text-danger"></span>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">                                
                                <select class="form-select" name="total_floors">
                                    <option value="">--Select--</option>
                                    @php
                                    $total_floors = get_total_floors();
                                    @endphp
                                    @if($total_floors)
                                    @foreach($total_floors as $k=>$f)
                                    <option value="{{$k}}">{{$f}}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <label class="form-label">Total Floors</label>
                                <span class="error total_floorsError text-danger"></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">                                
                                <select class="form-select" name="lifts_in_tower">
                                    <option value="">--Select--</option>
                                    @php
                                    $lifts_in_tower = lifts_in_tower();
                                    @endphp
                                    @if($lifts_in_tower)
                                    @foreach($lifts_in_tower as $f)
                                    <option value="{{$f}}">{{$f}}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <label class="form-label">Lifts in the Tower</label>
                                <span class="error floorsError text-danger"></span>
                                </div>
                            </div>
                        </div>

                        <div id="residential_features">
                            <div class="form-group">
                                <label class="form-label d-block">Amenity Features: </label>
                                <div class="row">
                                    @if (!empty($proepertyAmenities) && is_array($proepertyAmenities))
                                    @foreach ($proepertyAmenities as $amenity)
                                    <div class="col-md-4 col-sm-6">
                                        <div class="form-check">
                                            <input class="form-check-input" name="amenities[]"
                                                id="amenity-{{ $amenity['amenity_id'] }}"
                                                value="{{ $amenity['amenity_id'] }}" type="checkbox">
                                            <label class="form-check-label"
                                                for="amenity-{{ $amenity['amenity_id'] }}">{{ $amenity['amenity_name'] }}
                                            </label>
                                        </div>
                                    </div>
                                    @endforeach
                                    @else
                                    <div> No amenity Found ! </div>
                                    @endif
                                </div>
                            </div>


                            <div class="mb-3"><label class="form-label d-block">Is This A Corner Plot:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="corner_plot_1" type="radio" value="Yes"
                                        name="corner_plot"><label class="form-check-label"
                                        for="corner_plot_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="corner_plot_2" type="radio" value="No"
                                        name="corner_plot"><label class="form-check-label"
                                        for="corner_plot_2">No</label></div>
                                <span class="error corner_plotError text-danger"></span>
                            </div>

                            <div class="mb-3"><label class="form-label d-block">Is Allowed for Floor
                                    Construction:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="allowed_construction_1" type="radio" value="Yes"
                                        name="allowed_construction"><label class="form-check-label"
                                        for="allowed_construction_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="allowed_construction_2" type="radio" value="No"
                                        name="allowed_construction"><label class="form-check-label"
                                        for="allowed_construction_2">No</label></div>
                                <span class="error allowed_constructionError text-danger"></span>
                            </div>
                        </div>

                        <div id="commercial_features" style="display: none;">
                            <div class="mb-3"><label class="form-label d-block">Personal Washroom:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="personal_washroom_1" type="radio" value="Yes"
                                        name="personal_washroom"><label class="form-check-label"
                                        for="personal_washroom_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="personal_washroom_2" type="radio" value="No"
                                        name="personal_washroom"><label class="form-check-label"
                                        for="personal_washroom_2">No</label></div>
                            </div>

                            <div class="mb-3"><label class="form-label d-block">Pantry/Cafeteria:</label>
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

                        
                            
                            <div class="mb-3">
                                <label class="form-label d-block">Furnish Status</label>
                                @if (!empty($propertyFurnishes) && is_array($propertyFurnishes))
                                @foreach ($propertyFurnishes as $furnish)
                                <div class="form-check form-check-inline">
                                    <input type="radio" class="form-check-input" name="property_furnish" value="{{ $furnish['furnish_id'] }}" id="property_status_{{ $furnish['furnish_id'] }}" autocomplete="off" {{ $loop->first ? 'checked' : '' }}>
                                    <label class="form-check-label" for="property_status_{{ $furnish['furnish_id'] }}">{{ $furnish['furnish_name'] }}</label>
                                </div>
                                @endforeach
                                @else
                                No Furnish Found !
                                @endif
                            </div>

                        

                        <div class="">
                            <button type="button" class="btn btn-secondary btn-back-5 me-2"><i class="bi bi-arrow-left"></i> Back</button>
                            <button type="button" class="btn btn-primary btn-next" data-step="5">Next <i class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>

                    <div id="step-6" style="display:none;">
                        <div class="mb-3">
                            <label class="form-label d-block">Possession Status :</label>
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
                        <div class="mb-3 available_features" style="display: none;">
                            <label class="form-label d-block">Age Of Construction :</label>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="age" value="new"
                                    id="age_1" autocomplete="off" checked>
                                <label class="form-check-label" for="age_1">New</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="age"
                                    value="less_than_5_years" id="age_2" autocomplete="off">
                                <label class="form-check-label" for="age_2">Less Than 5 Years</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="age" value="5_10_years"
                                    id="age_3" autocomplete="off">
                                <label class="form-check-label" for="age_3">5-10 Years</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="age" value="10_15_years"
                                    id="age_4" autocomplete="off">
                                <label class="form-check-label" for="age_4">10-15 Years</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" class="form-check-input" name="age" value="15_20_years"
                                    id="age_5" autocomplete="off">
                                <label class="form-check-label" for="age_5">15-20 Years</label>
                            </div>
                        </div>

                        <div class="underConstruction_features" style="display: none;">
                            <div class="row gx-3">
                                <div class="col-lg-6 col-12">
                                    <div class="form-floating mb-3">
                                    <select class="form-select" name="construction_month">
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
                                    </select>
                                    <label>Expected Month of Possession</label>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-12">  
                                    <div class="form-floating mb-3">                                  
                                    <select class="form-select" name="construction_year">
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
                                    </select>
                                    <label>Expected Year of Possession</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">   
                                    <select class="form-select" name="water_available">
                                        <option value="">--Select Water Availability--</option>
                                        @php
                                        $water_availability = get_water_availability();
                                        @endphp
                                        @if($water_availability)
                                        @foreach($water_availability as $k=>$a)
                                        <option value="{{ $k }}">{{ $a }}</option>
                                        @endforeach
                                        @endif
                                    </select>
                                    <label>Water Availability</label>
                                    <span class="error water_availableError text-danger"></span>
                                </div>
                            </div>

                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">   
                                    <select class="form-select" name="electric_available">
                                        <option value="">Select status of electricity</option>
                                        @php
                                        $electricity_status = electricity_status();
                                        @endphp
                                        @if($electricity_status)
                                        @foreach($electricity_status as $k=>$a)
                                        <option value="{{ $k }}">{{ $a }}</option>
                                        @endforeach
                                        @endif
                                    </select>
                                    <label>Status of Electricity</label>
                                    <span class="error electric_availableError text-danger"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="col-lg-6 col-12">
                                
                                <div class="form-floating mb-3">  
                                    <select class="form-select"
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
                                    </select>
                                    <label>Facing</label>
                                    <span class="error facing_directionError text-danger"></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="form-floating mb-3">  
                                    <select class="form-select" name="parking">
                                        <option value="">Select Parking Option</option>
                                        <option value="av">Available</option>
                                        <option value="na">Not Available</option>
                                        <option value="uc">Under Construction</option>
                                    </select>
                                    <label>Parking</label>
                                    <span class="error parkingError text-danger"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row gx-3">
                            <div class="form-group col-lg-6 col-12">
                                <label class="form-label">Overlooking</label>
                                <select class="form-select select-2" name="overlooking[]" multiple>
                                    <option value="">Slect Overlooking</option>
                                    @php
                                    $overlooking_list = get_overlooking_list();
                                    @endphp
                                    @if($overlooking_list)
                                    @foreach($overlooking_list as $k=>$f)
                                    <option value="{{ $k }}">{{ $f }}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <span class="error overlookingError text-danger"></span>
                            </div>

                            <div class="form-group col-lg-6 col-12">
                                <label class="form-label">Ownership Type</label>
                                <select class="form-select" name="ownership_type">
                                    <option value="">Slect Ownership Type</option>
                                    @php
                                    $ownership_types = get_ownership_types();
                                    @endphp
                                    @if($ownership_types)
                                    @foreach($ownership_types as $k=>$f)
                                    <option value="{{ $k }}">{{ $f }}</option>
                                    @endforeach
                                    @endif
                                </select>
                                <span class="error ownership_typeError text-danger"></span>
                            </div>
                        </div>

                        <div class="">
                            <button type="button" class="btn btn-secondary btn-back-6 me-2"><i
                                    class="bi bi-arrow-left"></i> Back</button>
                            <button type="button" class="btn btn-primary btn-next" data-step="6">Next <i
                                    class="bi bi-arrow-right"></i></button>
                        </div>
                    </div>

                    <div id="step-7" style="display:none;">
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
                        <!-- Hidden Field to Store Image Names -->

                        <div class="img-content" id="tab-content-living">
                            <div class="upload-gallery" id="preview-living"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[living]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-bathroom" style="display:none">
                            <div class="upload-gallery" id="preview-bathroom"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[bathroom]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-balcony" style="display:none">
                            <div class="upload-gallery" id="preview-balcony"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[balcony]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-floor" style="display:none">
                            <div class="upload-gallery" id="preview-floor"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[floor]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-master" style="display:none">
                            <div class="upload-gallery" id="preview-master"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[master]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-exterior" style="display:none">
                            <div class="upload-gallery" id="preview-exterior"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[exterior]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-other" style="display:none">
                            <div class="upload-gallery" id="preview-other"></div>
                            <div class="form-floating mb-3">                                
                                <textarea rows="3" class="form-control" name="image_desc[other]" placeholder="Write something..." style="min-height:75px;"></textarea>
                                <label>Description</label>
                            </div>
                        </div>

                        <div class="">
                            <button type="button" class="btn btn-secondary btn-back-7 me-2"><i
                                    class="bi bi-arrow-left"></i> Back</button>
                            <button type="button" class="btn btn-primary btn-next" data-step="7" id="submit-btn">Post
                                Property</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</div>
@endsection
@push('custom-js')
<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>
<script>
    function loadLocality(evt) {
        var city_id = $(evt).val();
        var dropdown = $('#locality');
        dropdown.empty();
        $.ajax({
            url: "{{ url('/api/get_locality') }}/" + city_id,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 1) {
                    dropdown.append(
                        '<option value="">Select Locality</option>');

                    $.each(response.data, function(index, item) {
                        dropdown.append('<option value="' + item.locality_id +
                            '">' + item.locality_name + '</option>');
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

    function toggleProjectName() {
        if ($('input[name="property_category"]:checked').val() === 'project') {
            $('.project-name').show();
        } else {
            $('.project-name').hide();
        }
    }

    toggleProjectName();

    $('input[name="property_category"]').change(function() {
        toggleProjectName();
    });

    /* $(function() {
        $('.select2').select2();
    }); */

    function add_landmark(type) {
        var html = '';
        html += '<div class="card p-3 mb-3">';
        html += '<div class="row">';
        html += '<div class="col-md"><div class="form-group"><input type="text" class="form-control" name="' + type + '[name][]" placeholder="Name" /></div></div>';
        html += '<div class="col-md-3"><div class="form-group"><input type="text" class="form-control" name="' + type + '[distance][]" placeholder="Distance" /></div></div>';
        html += '<div class="col-md-auto"><a href="javascript:void(0)" class="btn btn-danger" onclick="remove_landmark(this)"><i class="bi bi-trash3-fill"></i></a></div>';
        html += '</div></div>';

        $('.' + type + '-con').append(html);
    }

    function remove_landmark(evt) {
        $(evt).parent().parent().parent().remove();
    }

    function previewImage(imageUrl, filename, type) {
        let gallery = $('#previewGallery');
        let imgWrapper = $('<div class="preview-item"></div>');
        imgWrapper.html(`
        <img src="${imageUrl}" alt="Uploaded Image">
        <button class="remove-btn" data-type="${type}" data-filename="${filename}">X</button><input type="hidden" name="image[${type}][]" value="${filename}" />`);
        imgWrapper.find('.remove-btn').click(function() {
            let fileType = $(this).data('type'); // Get the type
            removeImage(imgWrapper, filename, fileType);
        });
        $("#preview-" + type).append(imgWrapper);
    }

    $(document).ready(function() {
        $(".landmark-tab-content .nav-link").click(function(e) {
            e.preventDefault();
            $(".landmark-tab-content .nav-link").removeClass("active");
            $(this).addClass("active");
            var activeTab = $(this).attr("data-tab");
            $(".landmark-content").hide();
            $("#tab-content-" + activeTab).show();
        });

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


        $(".qtybutton").off("click").on("click", function() {
            let parent = $(this).closest(".form-field");
            let input = parent.find(".room-count");
            let formContainer = parent.find(".size-forms");
            var amenity = $(this).attr('amenity');

            let value = parseInt(input.val()) || 0;
            if ($(this).hasClass("plus")) {
                value++;
                input.val(value);
                addForm(formContainer, amenity, value);
            } else if ($(this).hasClass("minus") && value > 0) {
                value--;
                input.val(value);
                removeForm(formContainer);
            }
        });

        function addForm(formContainer, amenity, value) {
            let formHtml = `<div class="size-form mt-3 p-3 border rounded bg-light">                  
                <div class="row gx-3">  
                    <div class="col-6">
                        <label class="form-label fw-medium">Height</label>  
                        <input type="text" class="form-control" name="` + amenity + `[width][` + value + `]" placeholder="Enter Height" value="" autocomplete="off">  
                    </div>  
                    <div class="col-6"> 
                        <label class="form-label fw-medium">Width</label>  
                        <input type="text" class="form-control" name="` + amenity + `[height][` + value + `]" placeholder="Enter Width" value="" autocomplete="off">  
                    </div>  
                </div>  
            </div>`;
            formContainer.append(formHtml);
        }

        function removeForm(formContainer) {
            formContainer.children().last().remove();
        }

    });
</script>
@endpush