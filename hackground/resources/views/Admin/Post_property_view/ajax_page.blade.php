@if($page == 'basic')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <div class="box-body">
                    <input type="hidden" name="property_id" value="{{ $property_id }}" />
        
                    <div class="form-group">
                      <label for="post_for">Post For </label>
                      <select class="form-control" name="postFor" id="postFor">
                        <option value="">-Select-</option>
                        <option value="rent" {{ $propertyData['settings']->post_for == 'rent' ? 'selected' : '' }}>Rent</option>
                        <option value="sale" {{ $propertyData['settings']->post_for == 'sale' ? 'selected' : '' }}>Sale</option>
                        <option value="pg" {{ $propertyData['settings']->post_for == 'pg' ? 'selected' : '' }}>PG/Hostel</option>
                      </select>
                      <span class="text-danger" id="postForError"></span>
                    </div>
                    
                    <div class="form-group">
                        <label for="property_type">Property Type</label>
                        <select class="form-control" name="property_type" id="property_type">
                            <option value="">Select Property Type</option>
                            @isset($propertyTypes)
                                @foreach ($propertyTypes as $propertyType)
                                    <option value="{{ $propertyType['category_id'] }}"
                                        {{ $propertyData['settings']->property_type == $propertyType['category_id'] ? 'selected' : '' }}>
                                        {{ $propertyType['category_name'] }}
                                    </option>
                                @endforeach
                            @endisset
                        </select>
                        <span class="text-danger" id="property_typeError"></span>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Property For</label>
                        <select class="form-control" name="property_for" id="property_for">

                        </select>
                        <span class="text-danger" id="property_forError"></span>
                    </div>

                    {{-- <div class="form-group">
                        <label for="price_currency">Currency </label>
                        <select class="form-control" name="price_currency" id="price_currency">
                            <option value="">-Select-</option>
                        </select>
                        <span class="text-danger" id="price_currencyError"></span>
                    </div> --}}

                    <select class="" data-width="fit" title="Currency" name="currency">
                        <option disabled="disabled">Currency</option>
                        <option value="AED">AED</option>
                        <option value="EURO">EURO</option>
                        <option value="POND">POUND</option>
                        <option value="USD">USD</option>
                    </select>
                    <input type="text" class="form-control" name="expected_price"
                        placeholder="Enter Amount" />

                    <div class="form-group">
                        <label for="buyer_message">Message to buyer</label>
                        <textarea class="form-control" name="buyer_message" id="buyer_message">{{ $propertyData['additional']->buyer_message ? $propertyData['settings']->buyer_message : '' }}</textarea>
                        <span class="text-danger" id="buyer_messageError"></span>
                    </div>

                    {{-- <div class="form-group">
                       <p><b>Status</b></p>
                        <div class="radio-inline">
                            <input type="radio" name="status" value="1" class="magic-radio" id="status_1" checked>
                            <label for="status_1">Active</label> 
                        </div>
                         <div class="radio-inline">
                          <input type="radio" name="status" value="0" class="magic-radio" id="status_0">
                          <label for="status_0">Inactive</label> 
                        </div>
                    </div> --}}
                  
                  </div>
                  <!-- /.box-body -->
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
    </div>
    
    <script>

    function checkAdType(){
        var selected_val = $('[name="ad_type"] :selected').val();
        if(selected_val == 'image'){
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        }else if(selected_val == 'script'){
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        }else{
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change',function(){
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') { 
                    $("#ad_image").val(data.file_name);
                    $("#image_preview1").show();
                    $("#delete_image_btn1").show();
                    $("#image_preview1").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change',function(){
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') { 
                    $("#ad_image_mobile").val(data.file_name);
                    $("#image_preview2").show();
                    $("#delete_image_btn2").show();
                    $("#image_preview2").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    var firstPropertyId = $('#property_type').val();
   
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

    var firstPropertyId = $('#property_type').val();

    if (firstPropertyId) {
        loadPropertyFor(firstPropertyId);
    }

    function loadPropertyFor(propertyId) {
        var dropdown = $('#property_for');
        dropdown.empty();
        var property_for = '{{ $propertyData['settings']->property_type_for }}';
        //alert(property_for);
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
                    dropdown.val(property_for).trigger('change');
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
    </script>
@endif

@if($page == 'location')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <div class="box-body">
                      <input type="hidden" name="property_id" value="{{ $property_id }}" />
                      
                    <div class="form-field">
                        <label class="form-label">City</label>
                        <select id="city" name="city" class="form-control ">
                            <option value="">Select City</option>
                            @if (!empty($cities) && is_array($cities))
                                @foreach ($cities as $city)
                                    <option value="{{ $city['city_id'] }}" {{ $propertyData['location']->city == $city['city_id'] ? 'selected' : '' }}>{{ $city['name'] }}
                                    </option>
                                @endforeach
                            @else
                                <option value="" disabled>No cities available</option>
                                <!-- Fallback option -->
                            @endif

                        </select>
                        <span class="error cityError text-danger"></span>
                    </div>
                    
                    <div class="form-field">
                        <label class="form-label">Landmark</label>
                        <input class="form-control" placeholder="Enter landmark" id="landmark" required="" type="text" name="landmark" autocomplete="off" >
                        <span class="error landmarkError text-danger"></span>
                    </div>
                    
                    <div class="form-field">
                        <label class="form-label">Locality</label>
                        <input type="text" name="locality" class="form-control" placeholder="Enter Project Name Or Locality" value="{{ $propertyData['location']->locality }}" />
                        <span class="error localityError text-danger"></span>
                    </div>
                    <div class="form-field">
                        <label class="form-label">Address</label>
                        <textarea rows="3" class="form-control mb-2" name='address' placeholder="Enter Your Address">{{ $propertyData['location']->property_address }}</textarea>
                        <span class="error addressError text-danger"></span>
                        <p class="text-end text-help">Maximum 300 words are allowed</p>
                    </div>

                  </div>
                  <!-- /.box-body -->
                <button type="submit" class="btn btn-primary">Save</button>
            </form>
    </div>
@endif

@if($page == 'floor')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <div class="box-body">
                      <input type="hidden" name="property_id" value="{{ $property_id }}" />
                      
                        <div class="row gx-3">
                            <!-- Bedroom -->
                            <div class="col-lg-3 col-12">
                                <div class="form-field">
                                    <label class="form-label">Bedroom</label>
                                    <div class="cart-plus-minus mb-4 d-flex align-items-center">
                                        <button type="button" class="btn btn-danger minus qtybutton" amenity="bedroom">-</button>
                                        <input class="form-control text-center mx-2 room-count" name="bedroom_count" type="text" value="0" readonly style="max-width: 80px;" value="{{ $propertyData['settings']->bedrooms }}">
                                        <button type="button" class="btn btn-success plus qtybutton" amenity="bedroom" >+</button>
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
                                        <button type="button" class="btn btn-danger minus qtybutton" amenity="balcony">-</button>
                                        <input class="form-control text-center mx-2 room-count" name="balcony_count" type="text" value="0" readonly style="max-width: 80px;" {{ $propertyData['additional']->balcony }}>
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
                                        <input class="form-control text-center mx-2 room-count" name="bathroom_count" type="text" value="0" readonly style="max-width: 80px;" {{ $propertyData['settings']->bathrooms }}>
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
                                            placeholder="Type Carpet Area" type="number" value="{{ $propertyData['settings']->carpet_area }}"><span
                                            class="input-group-text">sqft</span>
                                    </div>
                                    <span class="text-danger" id="carpet_areaError"></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-12">
                                <div class="form-field"><label class="form-label">Super Area</label>
                                    <div class="input-group"><input class="form-control " name="super_area"
                                            placeholder="Type Super Area" type="number" value="{{ $propertyData['settings']->super_area }}"><span
                                            class="input-group-text">sqft</span>
                                    </div>
                                    <span class="error text-danger" id="super_areaError"></span>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Floor No.</label>
                            <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                aria-label="Floors">
                                <input class="btn-check" id="floors_1" value="1" autocomplete="off"
                                    type="radio" name="floors" checked>
                                <label class="btn btn-outline-light" for="floors_1">Lower Basement</label>

                                <input class="btn-check" id="floors_2" value="2" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_2">Upper Basement</label>

                                <input class="btn-check" id="floors_3" value="3" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_3">Ground</label>

                                <input class="btn-check" id="floors_4" value="4" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_4">1</label>

                                <input class="btn-check" id="floors_5" value="5" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_5">2</label>

                                <input class="btn-check" id="floors_6" value="6" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_6">3</label>

                                <input class="btn-check" id="floors_7" value="7" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_7">4</label>

                                <input class="btn-check" id="floors_8" value="8" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_8">5</label>

                                <input class="btn-check" id="floors_6_plus" autocomplete="off"
                                    type="radio" name="floors">
                                <label class="btn btn-outline-light" for="floors_6_plus"><i
                                        class="bi bi-plus-lg"></i></label>
                            </div>
                            <span class="error floorsError text-danger"></span>
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
                            <span class="error total_floorsError text-danger"></span>
                        </div>

                        <div id="residential_features">
                            <div class="row gx-3">
                                <div class="col-lg-6 col-12"><label class="form-label">Facing</label>
                                    <div class="form-field">
                                        <select class="form-control"
                                            name="facing_direction">
                                            <option value="">Select Facing</option>
                                            <option value="east" {{ $propertyData['additional']->facing_direction == 'east' ? 'selected' : '' }} >East</option>
                                            <option value="north" {{ $propertyData['additional']->facing_direction == 'north' ? 'selected' : '' }}>North</option>
                                            <option value="north_east" {{ $propertyData['additional']->facing_direction == 'north_east' ? 'selected' : '' }}>North - East</option>
                                            <option value="north_west" {{ $propertyData['additional']->facing_direction == 'north_west' ? 'selected' : '' }}>North - West</option>
                                            <option value="south" {{ $propertyData['additional']->facing_direction == 'south' ? 'selected' : '' }}>South</option>
                                            <option value="south_east" {{ $propertyData['additional']->facing_direction == 'south_east' ? 'selected' : '' }}>South - East</option>
                                            <option value="south_west" {{ $propertyData['additional']->facing_direction == 'south_west' ? 'selected' : '' }}>South - West</option>
                                            <option value="west" {{ $propertyData['additional']->facing_direction == 'west' ? 'selected' : '' }}>West</option>
                                        </select>
                                        <span class="error facing_directionError text-danger"></span>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-12"><label class="form-label">Parking</label>
                                    <div class="form-field">
                                        <select class="form-control" name="parking">
                                            <option value="">Select Parking Option</option>
                                            <option value="av" {{ $propertyData['additional']->car_parking == 'av' ? 'selected' : '' }}>Available</option>
                                            <option value="na" {{ $propertyData['additional']->car_parking == 'na' ? 'selected' : '' }}>Not Available</option>
                                            <option value="uc" {{ $propertyData['additional']->car_parking == 'uc' ? 'selected' : '' }}>Under Construction</option>
                                        </select>
                                        <span class="error parkingError text-danger"></span>
                                    </div>
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
                                        name="corner_plot" {{ $propertyData['additional']->corner_plot == 'Yes' ? 'checked' : '' }}><label class="form-check-label"
                                        for="corner_plot_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="corner_plot_2" type="radio" value="No"
                                        name="corner_plot" {{ $propertyData['additional']->corner_plot == 'No' ? 'checked' : '' }}><label class="form-check-label"
                                        for="corner_plot_2">No</label></div>
                                <span class="error corner_plotError text-danger"></span>
                            </div>

                            <div class="mb-3"><label class="form-label">Is Allowed for Floor
                                    Construction:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="allowed_construction_1" type="radio" value="Yes"
                                        name="allowed_construction" {{ $propertyData['additional']->allowed_construction == 'Yes' ? 'checked' : '' }}><label class="form-check-label"
                                        for="allowed_construction_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="allowed_construction_2" type="radio" value="No"
                                        name="allowed_construction" {{ $propertyData['additional']->allowed_construction == 'No' ? 'checked' : '' }}><label class="form-check-label"
                                        for="allowed_construction_2">No</label></div>
                                <span class="error allowed_constructionError text-danger"></span>
                            </div>
                        </div>

                        <div id="commercial_features" style="display: none;">
                            <div class="mb-3"><label class="form-label">Personal Washroom:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="personal_washroom_1" type="radio" value="Yes"
                                        name="personal_washroom" {{ $propertyData['additional']->is_personal_washroom == 'Yes' ? 'checked' : '' }}><label class="form-check-label"
                                        for="personal_washroom_1">Yes</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="personal_washroom_2" type="radio" value="No"
                                        name="personal_washroom" {{ $propertyData['additional']->is_personal_washroom == 'No' ? 'checked' : '' }}><label class="form-check-label"
                                        for="personal_washroom_2">No</label></div>
                            </div>

                            <div class="mb-3"><label class="form-label">Pantry/Cafeteria:</label>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="cafeteria_dry" type="radio" value="dry"
                                        name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'dry' ? 'checked' : '' }}><label class="form-check-label"
                                        for="cafeteria_dry">Dry</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="cafeteria_wet" type="radio" value="wet"
                                        name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'wet' ? 'checked' : '' }}><label class="form-check-label"
                                        for="cafeteria_wet">Wet</label></div>
                                <div class="form-check form-check-inline"><input class="form-check-input"
                                        id="cafeteria_not_available" type="radio" value="not_available"
                                        name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'cafeteria' ? 'checked' : '' }}><label class="form-check-label"
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
                                        {{ $loop->first ? 'checked' : '' }} {{ $propertyData['additional']->property_furnish == $furnish['furnish_id'] ? 'checked' : '' }}>
                                    <label class="btn btn-outline-light"
                                        for="property_status_{{ $furnish['furnish_id'] }}">{{ $furnish['furnish_name'] }}</label>
                                @endforeach
                            @else
                                No Furnish Found !
                            @endif
                        </div>

                    </div>

                <button type="submit" class="btn btn-primary">Save</button>
            </form>
    </div>
    
@endif

@if($page == 'additional')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                <div class="box-body">
                    <input type="hidden" name="property_id" value="{{ $property_id }}" />
                    <div class="mb-3">
                        <label class="form-label">Possession Status :</label>
                        @if (!empty($propertyStatus) && is_array($propertyStatus))
                            @foreach ($propertyStatus as $status)
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input property-status-radio" type="radio"
                                        name="possession_status" id="status_{{ $status['status_id'] }}"
                                        value="{{ $status['status_id'] }}" {{ $propertyData['additional']->possession_status == $status['status_id'] ? 'checked' : '' }}>
                                    <label class="form-check-label" for="status_{{ $status['status_id'] }}">{{ $status['status_name'] }}</label>
                                </div>
                            @endforeach
                        @else
                            No staus Found !
                        @endif
                    </div>
                    @php
                     if($propertyData['additional']->possession_status == '1')
                     {
                        $construction_age = 'block';
                     }else{
                        $construction_age = 'none';
                     }   
                    @endphp
                    <div class="available_features" style="display: {{ $construction_age }};">
                        <label class="form-label">Age Of Construction :</label>
                        <div class="btn-group btn-group-light d-flex mb-3" role="group"
                            aria-label="Floors">
                            <input type="radio" class="btn-check" name="age" value="new"
                                id="age_1" autocomplete="off" {{ $propertyData['additional']->construct_year == 'new' ? 'checked' : '' }}>
                            <label class="btn btn-outline-light" for="age_1">New</label>

                            <input type="radio" class="btn-check" name="age"
                                value="less_than_5_years" id="age_2" autocomplete="off" {{ $propertyData['additional']->construct_year == 'less_than_5_years' ? 'checked' : '' }}>
                            <label class="btn btn-outline-light" for="age_2">Less Than 5
                                Years</label>

                            <input type="radio" class="btn-check" name="age" value="5_10_years"
                                id="age_3" autocomplete="off" {{ $propertyData['additional']->construct_year == '5_10_years' ? 'checked' : '' }}>
                            <label class="btn btn-outline-light" for="age_3">5-10 Years</label>

                            <input type="radio" class="btn-check" name="age" value="10_15_years"
                                id="age_4" autocomplete="off" {{ $propertyData['additional']->construct_year == '10_15_years' ? 'checked' : '' }} >
                            <label class="btn btn-outline-light" for="age_4">10-15 Years</label>

                            <input type="radio" class="btn-check" name="age" value="15_20_years"
                                id="age_5" autocomplete="off" {{ $propertyData['additional']->construct_year == '15_20_years' ? 'checked' : '' }}>
                            <label class="btn btn-outline-light" for="age_5">15-20 Years</label>
                        </div>
                    </div>
                    @php
                     $construction_month = "";
                     $construction_year = "";
                     if($propertyData['additional']->possession_status == '2')
                     {
                        $uc_feature_display = 'block';
                     }else{
                        $uc_feature_display = 'none';
                     } 
                     if($propertyData['additional']->expected_possesion_month_year)
                     {
                        $month_arr = explode('-',$propertyData['additional']->expected_possesion_month_year);
                        $construction_month = $month_arr[0];
                        $construction_year = $month_arr[1];
                     }  
                    @endphp
                    
                    <div class="underConstruction_features" style="display: {{ $uc_feature_display }};">
                        <div class="row gx-3">
                            <div class="col-lg-6 col-12"><label class="form-label">Expected Month of
                                    Possession</label><select class="form-control "
                                    name="construction_month">
                                    <option value="">Select Month</option>
                                    @php
                                        $months = [
                                            '01' => 'January', '02' => 'February', '03' => 'March', '04' => 'April',
                                            '05' => 'May', '06' => 'June', '07' => 'July', '08' => 'August',
                                            '09' => 'September', '10' => 'October', '11' => 'November', '12' => 'December'
                                        ];
                                    @endphp

                                    @foreach ($months as $key => $month)
                                        <option value="{{ $key }}" {{ isset($construction_month) && $construction_month == $key ? 'selected' : '' }}>
                                            {{ $month }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-lg-6 col-12"><label class="form-label">Expected Year of
                                    Possession</label>
                                <select class="form-control" name="construction_year">
                                    <option value="">Select Year</option>
                                    @php
                                        $currentYear = date('Y');
                                        $endYear = $currentYear + 20;
                                    @endphp

                                    @for ($year = $currentYear; $year <= $endYear; $year++)
                                        <option value="{{ $year }}" {{ isset($construction_year) && $construction_year == $year ? 'selected' : '' }}>
                                            {{ $year }}
                                        </option>
                                    @endfor
                                </select>
                            </div>
                        </div>
                    </div>

                    {{-- <div class="row gx-3">
                        <div class="col-lg-6 col-12">
                            <div class="form-field">
                                <label class="form-label">Booking/Token Amount (optional)</label>
                                <input type="number" class="form-control" name="token_amount"
                                    placeholder="Enter Token Amount" />
                            </div>
                        </div>
                    </div> --}}
                    
                </div>

                <button type="submit" class="btn btn-primary">Save</button>
            </form>
    </div>

    <script>
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
    </script>
    
@endif

<script>
    $(function(){
        $('.select2').select2();
    });

    function submitForm(form, event){
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type : 'POST',
            url : url,
            data : $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType : 'JSON',
            success : function(res){ 
                if(res.status == 'OK')
                {
                    Swal.fire({
                        title: "Success!",
                        text: res.message,
                        icon: "success",
                        confirmButtonText: "OK"
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = location.href;
                        }
                    });
                }else{
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                        }).then((result) => {
                    });
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if(res.errors)
                {
                    $.each(res.errors, function(index, error) {
                        $("#"+index+"Error").html(error);
                    });
                }
            }
        });
    }

    function onsuccess(res){
        if(res.cmd){
            if(res.cmd == 'reload'){
                location.reload();
            }else if(res.cmd == 'reset_form'){
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }		
            
        }
    }

    function reset_select(opt){
        if(opt.length > 0 && opt instanceof Array){
            opt.forEach(function(item, ind){
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }
</script>