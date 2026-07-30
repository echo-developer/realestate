@if($page == 'basic')
<div class="modal-header bg-light border-bottom-0 pt-3 pb-3">
    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-building"></i>
        </div>
        <?php echo $title; ?>
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body p-4">
    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <div class="box-body">
            <input type="hidden" name="property_id" value="{{ $property_id }}" />

        <div class="form-floating mb-4">
            <select class="form-select" name="postFor" id="postFor">
                <option value="">-Select-</option>
                <option value="rent" {{ $propertyData['settings']->post_for == 'rent' ? 'selected' : '' }}>Rent</option>
                <option value="sale" {{ $propertyData['settings']->post_for == 'sale' ? 'selected' : '' }}>Sale</option>
                <option value="pg" {{ $propertyData['settings']->post_for == 'pg' ? 'selected' : '' }}>PG/Hostel</option>
            </select>
            <label for="post_for">Post For </label>
            <span class="text-danger small" id="postForError"></span>
        </div>

        <div class="form-floating mb-4">
            <select class="form-select" name="property_type" id="property_type">
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
            <label for="property_type">Property Type</label>
            <span class="text-danger small" id="property_typeError"></span>
        </div>

        <div class="form-floating mb-4">

            <select class="form-select" name="property_for" id="property_for">

            </select>
            <label class="form-label">Property For</label>
            <span class="text-danger small" id="property_forError"></span>
        </div>

        <div class="input-group mb-4">
            <select class="form-select" data-width="fit" title="Currency" name="currency" style="max-width: 105px;">
                <option disabled="disabled">Currency</option>
                <option value="AED" {{ $propertyData->settings->price_currency == 'AED' ? 'selected' : '' }}>AED</option>
                <option value="EURO" {{ $propertyData->settings->price_currency == 'EURO' ? 'selected' : '' }}>EURO</option>
                <option value="POND" {{ $propertyData->settings->price_currency == 'POND' ? 'selected' : '' }}>POUND</option>
                <option value="USD" {{ $propertyData->settings->price_currency == 'USD' ? 'selected' : '' }}>USD</option>
            </select>
            <div class="form-floating">
                <input type="text" class="form-control" name="expected_price" placeholder="Enter Amount" value="{{ $propertyData->settings->expected_price }}" />
                <label>Price</label>
            </div>
        </div>

        <div class="form-floating mb-4">
            <input class="form-control" name="project_name" id="project_name" value="{{ $propertyData->settings->project_name }}" />
            <label class="form-label">Project Name</label>
            <span class="text-danger small" id="project_nameError"></span>
        </div>

        <div class="form-floating mb-4">
            <textarea class="form-control" name="buyer_message" id="buyer_message" placeholder="" style="min-height: 100px;">{{ $propertyData['additional']->buyer_message ? $propertyData['settings']->buyer_message : '' }}</textarea>
            <label for="buyer_message">Message to buyer</label>
            <span class="text-danger small" id="buyer_messageError"></span>
        </div>

</div>
        <div class="modal-footer border-top-0 px-0 pb-0 pt-3">
            <button type="button" class="btn btn-light border px-4 rounded-3 fw-medium" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary px-4 rounded-3 fw-bold shadow-sm">Save Changes</button>
        </div>
</form>
</div>

<script>
    function checkAdType() {
        var selected_val = $('[name="ad_type"] :selected').val();
        if (selected_val == 'image') {
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        } else if (selected_val == 'script') {
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        } else {
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change', function() {
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
                    $("#image_preview1").attr('src', data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change', function() {
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
                    $("#image_preview2").attr('src', data.file_path);
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
        var property_for = '{{ optional($propertyData['settings'])->property_type_for }}';
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
<div class="modal-header bg-light border-bottom-0 pt-3 pb-3">
    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-geo-alt"></i>
        </div>
        <?php echo $title; ?>
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body p-4">
    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <div class="box-body">
            <input type="hidden" name="property_id" value="{{ $property_id }}" />

            <div class="form-floating mb-3">
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
                <label class="form-label">City</label>
                <span class="error cityError text-danger"></span>
            </div>

            <div class="form-floating mb-3">
                <select id="locality" name="locality" class="form-control">
                    <option value="">Select Locality</option>
                    <!-- Localities will be added via JS -->
                </select>
                <label class="form-label">Locality</label>
                <span class="error localityError text-danger"></span>
            </div>

            <div class="form-floating mb-3">
                <textarea rows="3" class="form-control mb-2" name='address' placeholder="Enter Your Address" style="min-height: 100px;">
                {{ $propertyData['location']->property_address }}
                </textarea>
                <label class="form-label">Address</label>
                <span class="error addressError text-danger"></span>
                <p class="text-end text-help small text-muted">Maximum 300 words allowed</p>
            </div>

        </div>
        <div class="modal-footer border-top-0 px-0 pb-0 pt-3">
            <button type="button" class="btn btn-light border px-4 rounded-3 fw-medium" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary px-4 rounded-3 fw-bold shadow-sm">Save Changes</button>
        </div>
    </form>
</div>
<script>
    $(document).ready(function() {
        const $citySelect = $('#city');
        const $localitySelect = $('#locality');
        const selectedLocality = `{{ $propertyData['location']->locality }}`; // prefilled value
        const selectedCity = $citySelect.val();

        // Fetch localities if editing (city is preselected)
        if (selectedCity) {
            fetchLocalities(selectedCity, selectedLocality);
        }

        $citySelect.on('change', function() {
            let cityId = $(this).val();
            fetchLocalities(cityId);
        });

        function fetchLocalities(cityId, preselected = null) {
            $localitySelect.empty().append('<option value="">Select Locality</option>');

            if (!cityId) return;

            $.ajax({
                url: `{{ url('get-locality') }}`,
                type: 'GET',
                data: {
                    city_id: cityId
                },
                success: function(response) {
                    if (response.localities && response.localities.length > 0) {
                        $.each(response.localities, function(index, locality) {
                            const selected = locality.id == preselected ? 'selected' : '';
                            $localitySelect.append(
                                `<option value="${locality.id}" ${selected}>${locality.name}</option>`
                            );
                        });
                    } else {
                        $localitySelect.append('<option value="">No localities available</option>');
                    }
                },
                error: function(xhr) {
                    console.error('Error loading localities', xhr);
                    $localitySelect.append('<option value="">Error loading localities</option>');
                }
            });
        }
    });
</script>


@endif

@if($page == 'features')
<div class="modal-header bg-light border-bottom-0 pt-3 pb-3">
    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
        <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
            <i class="bi bi-grid-3x3-gap"></i>
        </div>
        <?php echo $title; ?>
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
<div class="modal-body p-4">
    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <div class="box-body">
            <input type="hidden" name="property_id" value="{{ $property_id }}" />

            <h6 class="fw-bold text-primary mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                <i class="bi bi-sliders fs-5"></i> Configuration
            </h6>
            <div class="row g-3">
                <!-- Bedroom -->
                <div class="col-md-4 col-12">
                    <div class="form-field">
                        <label class="form-label small fw-bold text-muted mb-2">Bedroom</label>
                        <div class="d-inline-flex align-items-center border rounded-3 p-1 bg-white shadow-sm mb-2" style="height: 42px;">
                            <button type="button" class="btn btn-light border-0 text-dark rounded-2 minus qtybutton d-flex align-items-center justify-content-center" amenity="bedroom" style="width: 34px; height: 34px;">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <input class="form-control text-center fw-bold border-0 bg-transparent text-dark px-1 room-count" name="bedroom_count" type="text" readonly style="width: 45px; font-size: 1.1rem; box-shadow: none;" value="{{ $propertyData->settings->bedrooms ? $propertyData->settings->bedrooms : '0' }}">
                            <button type="button" class="btn btn-primary border-0 text-white rounded-2 plus qtybutton d-flex align-items-center justify-content-center" amenity="bedroom" style="width: 34px; height: 34px;">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <span class="error bedroom_countError text-danger"></span>
                        <div class="size-forms">
                            @php
                            $bedroomCount = intval($propertyData->settings->bedrooms ?? 0);
                            $bedroomDims = $propertyData->dimensions ? $propertyData->dimensions->where('room_type', 'bedroom')->values() : collect();
                            $bedroomFormsCount = max($bedroomCount, count($bedroomDims));
                            @endphp
                            @for($i = 0; $i < $bedroomFormsCount; $i++)
                            @php
                            $d = $bedroomDims[$i] ?? null;
                            $size = $d ? json_decode($d->size) : null;
                            @endphp
                            <div class="size-form mt-2 p-3 border rounded-3 bg-white shadow-2xs">
                                <label class="form-label fw-semibold small text-muted mb-2">Bedroom {{ $i + 1 }} Dimensions</label>
                                <div class="row gx-2">
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="bedroom[width][]" placeholder="Enter Width" value="{{ $size->width ?? '' }}" autocomplete="off">
                                            <label>Width</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="bedroom[height][]" placeholder="Enter Height" value="{{ $size->height ?? '' }}" autocomplete="off">
                                            <label>Height</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endfor
                        </div>
                    </div>
                </div>

                <!-- Balcony -->
                <div class="col-md-4 col-12">
                    <div class="form-field">
                        <label class="form-label small fw-bold text-muted mb-2">Balcony</label>
                        <div class="d-inline-flex align-items-center border rounded-3 p-1 bg-white shadow-sm mb-2" style="height: 42px;">
                            <button type="button" class="btn btn-light border-0 text-dark rounded-2 minus qtybutton d-flex align-items-center justify-content-center" amenity="balcony" style="width: 34px; height: 34px;">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <input class="form-control text-center fw-bold border-0 bg-transparent text-dark px-1 room-count" name="balcony_count" type="text" readonly style="width: 45px; font-size: 1.1rem; box-shadow: none;" value="{{ $propertyData->additional->balcony ? $propertyData->additional->balcony : '0' }}">
                            <button type="button" class="btn btn-primary border-0 text-white rounded-2 plus qtybutton d-flex align-items-center justify-content-center" amenity="balcony" style="width: 34px; height: 34px;">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <span class="error balcony_countError text-danger"></span>
                        <div class="size-forms">
                            @php
                            $balconyCount = intval($propertyData->additional->balcony ?? 0);
                            $balconyDims = $propertyData->dimensions ? $propertyData->dimensions->where('room_type', 'balcony')->values() : collect();
                            $balconyFormsCount = max($balconyCount, count($balconyDims));
                            @endphp
                            @for($i = 0; $i < $balconyFormsCount; $i++)
                            @php
                            $d = $balconyDims[$i] ?? null;
                            $size = $d ? json_decode($d->size) : null;
                            @endphp
                            <div class="size-form mt-2 p-3 border rounded-3 bg-white shadow-2xs">
                                <label class="form-label fw-semibold small text-muted mb-2">Balcony {{ $i + 1 }} Dimensions</label>
                                <div class="row gx-2">
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="balcony[width][]" placeholder="Enter Width" value="{{ $size->width ?? '' }}" autocomplete="off">
                                            <label>Width</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="balcony[height][]" placeholder="Enter Height" value="{{ $size->height ?? '' }}" autocomplete="off">
                                            <label>Height</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endfor
                        </div>
                    </div>
                </div>

                <!-- Bathroom -->
                <div class="col-md-4 col-12">
                    <div class="form-field">
                        <label class="form-label small fw-bold text-muted mb-2">Bathroom</label>
                        <div class="d-inline-flex align-items-center border rounded-3 p-1 bg-white shadow-sm mb-2" style="height: 42px;">
                            <button type="button" class="btn btn-light border-0 text-dark rounded-2 minus qtybutton d-flex align-items-center justify-content-center" amenity="bathroom" style="width: 34px; height: 34px;">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            <input class="form-control text-center fw-bold border-0 bg-transparent text-dark px-1 room-count" name="bathroom_count" type="text" readonly style="width: 45px; font-size: 1.1rem; box-shadow: none;" value="{{ $propertyData->settings->bathrooms ? $propertyData->settings->bathrooms : '0' }}">
                            <button type="button" class="btn btn-primary border-0 text-white rounded-2 plus qtybutton d-flex align-items-center justify-content-center" amenity="bathroom" style="width: 34px; height: 34px;">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <span class="error bathroom_countError text-danger"></span>
                        <div class="size-forms">
                            @php
                            $bathroomCount = intval($propertyData->settings->bathrooms ?? 0);
                            $bathroomDims = $propertyData->dimensions ? $propertyData->dimensions->where('room_type', 'bathroom')->values() : collect();
                            $bathroomFormsCount = max($bathroomCount, count($bathroomDims));
                            @endphp
                            @for($i = 0; $i < $bathroomFormsCount; $i++)
                            @php
                            $d = $bathroomDims[$i] ?? null;
                            $size = $d ? json_decode($d->size) : null;
                            @endphp
                            <div class="size-form mt-2 p-3 border rounded-3 bg-white shadow-2xs">
                                <label class="form-label fw-semibold small text-muted mb-2">Bathroom {{ $i + 1 }} Dimensions</label>
                                <div class="row gx-2">
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="bathroom[width][]" placeholder="Enter Width" value="{{ $size->width ?? '' }}" autocomplete="off">
                                            <label>Width</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" name="bathroom[height][]" placeholder="Enter Height" value="{{ $size->height ?? '' }}" autocomplete="off">
                                            <label>Height</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endfor
                        </div>
                    </div>
                </div>
            </div>

            <h6 class="fw-bold text-primary mb-3 mt-4 pb-2 border-bottom d-flex align-items-center gap-2">
                <i class="bi bi-layers fs-5"></i> Floor Details
            </h6>
            <div class="row g-3 mb-3">
                <div class="col-lg-6 col-12">
                    <div class="form-field">
                        <label class="form-label small fw-semibold">Carpet Area</label>
                        <div class="input-group">
                            <input class="form-control" name="carpet_area" placeholder="Type Carpet Area" type="number" value="{{ $propertyData['settings']->carpet_area }}">
                            <span class="input-group-text bg-light text-muted">sqft</span>
                        </div>
                        <span class="text-danger small" id="carpet_areaError"></span>
                    </div>
                </div>
                <div class="col-lg-6 col-12">
                    <div class="form-field">
                        <label class="form-label small fw-semibold">Super Area</label>
                        <div class="input-group">
                            <input class="form-control" name="super_area" placeholder="Type Super Area" type="number" value="{{ $propertyData['settings']->super_area }}">
                            <span class="input-group-text bg-light text-muted">sqft</span>
                        </div>
                        <span class="error text-danger small" id="super_areaError"></span>
                    </div>
                </div>
            </div>

            <div class="form-group mb-3">
                <label class="form-label small fw-semibold">Floor Type</label>
                <select class="form-select select-2" name="flooring_style[]" multiple>
                    <option value="">Select Floor Type</option>
                    @php
                    $floor_types = get_floor_types();
                    $style_string = $propertyData->additional->flooring_style ?? '';
                    $decoded = json_decode($style_string, true);
                    $style_arr = is_array($decoded) ? $decoded : array_filter(explode(',', $style_string));
                    @endphp
                    @if($floor_types)
                    @foreach($floor_types as $k=>$f)
                    <option value="{{$k}}" {{ is_array($style_arr) && in_array($k, $style_arr) ? 'selected' : '' }}>{{$f}}</option>
                    @endforeach
                    @endif
                </select>
                <span class="error floorsError text-danger small"></span>
            </div>

            <div class="row g-3 mb-3">
                <div class="col-lg-6 col-12">
                    <div class="form-floating">
                        <select class="form-select" name="flat_each_floor">
                            <option value="">Select</option>
                            @php
                            $flats_in_floor = flats_in_floor();
                            @endphp
                            @if($flats_in_floor)
                            @foreach($flats_in_floor as $f)
                            <option value="{{$f}}" {{ $propertyData->additional->flat_each_floor == $f ? 'selected' : '' }}>{{$f}}</option>
                            @endforeach
                            @endif
                        </select>
                        <label>Flats on the Floor</label>
                        <span class="error floorsError text-danger small"></span>
                    </div>
                </div>
                <div class="col-lg-6 col-12">
                    <div class="form-floating">
                        <select class="form-select" name="lifts_in_tower">
                            <option value="">Select</option>
                            @php
                            $lifts_in_tower = lifts_in_tower();
                            @endphp
                            @if($lifts_in_tower)
                            @foreach($lifts_in_tower as $f)
                            <option value="{{$f}}" {{ $propertyData->additional->lifts_in_tower == $f ? 'selected' : '' }}>{{$f}}</option>
                            @endforeach
                            @endif
                        </select>
                        <label>Lifts in the Tower</label>
                        <span class="error floorsError text-danger small"></span>
                    </div>
                </div>
            </div>

            <div class="row g-3 mb-3">
                <div class="col-lg-6 col-12">
                    <div class="form-floating">
                        <select class="form-select" name="floors">
                            <option value="">Select</option>
                            @php
                            $floor_numbers = get_floor_numbers();
                            @endphp
                            @if($floor_numbers)
                            @foreach($floor_numbers as $k=>$f)
                            <option value="{{$k}}" {{ $propertyData->additional->floor == $k ? 'selected' : '' }}>{{$f}}</option>
                            @endforeach
                            @endif
                        </select>
                        <label>Floor No.</label>
                        <span class="error floorsError text-danger small"></span>
                    </div>
                </div>

                <div class="col-lg-6 col-12">
                    <div class="form-floating">
                        <select class="form-select" name="total_floors">
                            <option value="">Select</option>
                            @php
                            $total_floors = get_total_floors();
                            @endphp
                            @if($total_floors)
                            @foreach($total_floors as $k=>$f)
                            <option value="{{$k}}" {{ $propertyData->additional->total_floor == $k ? 'selected' : '' }}>{{$f}}</option>
                            @endforeach
                            @endif
                        </select>
                        <label>Total Floors</label>
                    </div>
                    <span class="error total_floorsError text-danger small"></span>
                </div>
            </div>

            @php
            $amenities = $propertyData->additional->property_amenity;
            $amenity_arr = explode(',',$amenities);
            @endphp
            <div id="residential_features">
                <h6 class="fw-bold text-primary mb-3 mt-4 pb-2 border-bottom d-flex align-items-center justify-content-between">
                    <span class="d-flex align-items-center gap-2"><i class="bi bi-check2-circle fs-5"></i> Amenity Features</span>
                    <span class="text-muted small fw-normal">Scroll to view all</span>
                </h6>
                <div class="border rounded-3 p-3 bg-light mb-3" style="max-height: 220px; overflow-y: auto;">
                    <div class="row g-2">
                        @if (!empty($proepertyAmenities) && is_array($proepertyAmenities))
                        @foreach ($proepertyAmenities as $amenity)
                        <div class="col-md-4 col-6">
                            <div class="form-check custom-checkbox-card border bg-white rounded-3 p-2 px-3 d-flex align-items-center gap-2 shadow-2xs">
                                <input class="form-check-input m-0" name="amenities[]" id="amenity-{{ $amenity['amenity_id'] }}" value="{{ $amenity['amenity_id'] }}" type="checkbox" {{ in_array($amenity['amenity_id'],$amenity_arr) ? 'checked' : '' }}>
                                <label class="form-check-label small fw-semibold text-dark text-truncate cursor-pointer mb-0" for="amenity-{{ $amenity['amenity_id'] }}">{{ $amenity['amenity_name'] }}</label>
                            </div>
                        </div>
                        @endforeach
                        @else
                        <div class="col-12 text-muted small">No amenities found.</div>
                        @endif
                    </div>
                </div>

                <div class="row g-3 mb-3">
                    <div class="col-md-6 col-12">
                        <label class="form-label small fw-semibold d-block">Is This A Corner Plot:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="corner_plot_1" type="radio" value="Yes" name="corner_plot" {{ $propertyData->additional->corner_plot == 'yes' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="corner_plot_1">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="corner_plot_2" type="radio" value="No" name="corner_plot" {{ $propertyData->additional->corner_plot == 'no' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="corner_plot_2">No</label>
                        </div>
                        <span class="error corner_plotError text-danger small"></span>
                    </div>

                    <div class="col-md-6 col-12">
                        <label class="form-label small fw-semibold d-block">Is Allowed for Floor Construction:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="allowed_construction_1" type="radio" value="Yes" name="allowed_construction" {{ $propertyData['additional']->allowed_construction == 'Yes' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="allowed_construction_1">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="allowed_construction_2" type="radio" value="No" name="allowed_construction" {{ $propertyData['additional']->allowed_construction == 'No' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="allowed_construction_2">No</label>
                        </div>
                        <span class="error allowed_constructionError text-danger small"></span>
                    </div>
                </div>
            </div>

            <div id="commercial_features" style="display: none;">
                <div class="row g-3 mb-3">
                    <div class="col-md-6 col-12">
                        <label class="form-label small fw-semibold d-block">Personal Washroom:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="personal_washroom_1" type="radio" value="Yes" name="personal_washroom" {{ $propertyData['additional']->is_personal_washroom == 'Yes' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="personal_washroom_1">Yes</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="personal_washroom_2" type="radio" value="No" name="personal_washroom" {{ $propertyData['additional']->is_personal_washroom == 'No' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="personal_washroom_2">No</label>
                        </div>
                    </div>

                    <div class="col-md-6 col-12">
                        <label class="form-label small fw-semibold d-block">Pantry/Cafeteria:</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="cafeteria_dry" type="radio" value="dry" name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'dry' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="cafeteria_dry">Dry</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="cafeteria_wet" type="radio" value="wet" name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'wet' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="cafeteria_wet">Wet</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" id="cafeteria_not_available" type="radio" value="not_available" name="cafeteria" {{ $propertyData['additional']->pantry_cafeteria_status == 'cafeteria' ? 'checked' : '' }}>
                            <label class="form-check-label small" for="cafeteria_not_available">Not Available</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group mb-3">
                <label class="form-label small fw-semibold d-block">Furnish Status</label>
                <select class="form-select" name="property_furnish">
                    <option value="">--Select--</option>
                    @if($propertyFurnishes)
                    @foreach($propertyFurnishes as $k=>$furnish)
                    <option value="{{ $furnish['furnish_id'] }}" {{ $propertyData['additional']->property_furnish == $furnish['furnish_id'] ? 'selected' : '' }}>{{ $furnish['furnish_name'] }}</option>
                    @endforeach
                    @endif
                </select>
            </div>

        </div>

        <div class="modal-footer border-top-0 px-0 pb-0 pt-3">
            <button type="button" class="btn btn-light border px-4 rounded-3 fw-medium" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary px-4 rounded-3 fw-bold shadow-sm">Save Changes</button>
        </div>
    </form>
</div>

<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>
<script>
    /* $(function(){
            $('.select2').select2();
        }); */

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
        let labelName = amenity.charAt(0).toUpperCase() + amenity.slice(1);
        let formHtml = `<div class="size-form mt-2 p-3 border rounded-3 bg-white shadow-2xs">  
                <label class="form-label fw-semibold small text-muted mb-2">${labelName} ${value} Dimensions</label>
                <div class="row gx-2">
                    <div class="col-6">
                        <div class="form-floating">
                            <input type="text" class="form-control" name="${amenity}[width][]" placeholder="Enter Width" value="" autocomplete="off"> 
                            <label>Width</label>
                        </div>
                    </div>  
                    <div class="col-6">  
                        <div class="form-floating">
                            <input type="text" class="form-control" name="${amenity}[height][]" placeholder="Enter Height" value="" autocomplete="off"> 
                            <label>Height</label> 
                        </div>
                    </div>  
                </div>  
            </div>`;
        formContainer.append(formHtml);
    }

    function removeForm(formContainer) {
        formContainer.children().last().remove();
    }
</script>

@endif

@if($page == 'additional')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
    </button>

</div>
<div class="modal-body">
    <form role="form" id="add_form" class="mb-0" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <div class="box-body">
            <input type="hidden" name="property_id" value="{{ $property_id }}" />
            <div class="mb-3">
                <label class="form-label d-block">Possession Status :</label>
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
                        id="age_4" autocomplete="off" {{ $propertyData['additional']->construct_year == '10_15_years' ? 'checked' : '' }}>
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
                    <div class="col-lg-6 col-12">
                        <div class="form-floating mb-3">
                            <select class="form-select"
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
                            <label class="form-label">Expected Month of Possession</label>
                        </div>
                    </div>
                    <div class="col-lg-6 col-12">
                        <div class="form-floating mb-3">
                            <select class="form-select" name="construction_year">
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
                            <label class="form-label">Expected Year of Possession</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row gx-3">
                <div class="col-lg-6 col-12">
                    <div class="form-floating mb-3">
                        <select class="form-select" name="facing_direction">
                            <option value="">Select Facing</option>
                            <option value="east" {{ $propertyData['additional']->facing_direction == 'east' ? 'selected' : '' }}>East</option>
                            <option value="north" {{ $propertyData['additional']->facing_direction == 'north' ? 'selected' : '' }}>North</option>
                            <option value="north_east" {{ $propertyData['additional']->facing_direction == 'north_east' ? 'selected' : '' }}>North - East</option>
                            <option value="north_west" {{ $propertyData['additional']->facing_direction == 'north_west' ? 'selected' : '' }}>North - West</option>
                            <option value="south" {{ $propertyData['additional']->facing_direction == 'south' ? 'selected' : '' }}>South</option>
                            <option value="south_east" {{ $propertyData['additional']->facing_direction == 'south_east' ? 'selected' : '' }}>South - East</option>
                            <option value="south_west" {{ $propertyData['additional']->facing_direction == 'south_west' ? 'selected' : '' }}>South - West</option>
                            <option value="west" {{ $propertyData['additional']->facing_direction == 'west' ? 'selected' : '' }}>West</option>
                        </select>
                        <label class="form-label">Facing</label>
                        <span class="error facing_directionError text-danger"></span>
                    </div>
                </div>
                <div class="col-lg-6 col-12">
                    <div class="form-floating mb-3">
                        <select class="form-select" name="parking">
                            <option value="">Select Parking Option</option>
                            <option value="av" {{ $propertyData->additional->parking_ability == 'av' ? 'selected' : '' }}>Available</option>
                            <option value="na" {{ $propertyData->additional->parking_ability == 'na' ? 'selected' : '' }}>Not Available</option>
                            <option value="uc" {{ $propertyData->additional->parking_ability == 'uc' ? 'selected' : '' }}>Under Construction</option>
                        </select>
                        <label class="form-label">Parking</label>
                        <span class="error parkingError text-danger"></span>
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
                            <option value="{{ $k }}" {{ $propertyData->additional->water_available == $k ? 'selected' : '' }}>{{ $a }}</option>
                            @endforeach
                            @endif
                        </select>
                        <label class="form-label">Water Availability</label>
                        <span class="error facing_directionError text-danger"></span>
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
                            <option value="{{ $k }}" {{ $propertyData->additional->electric_available == $k ? 'selected' : '' }}>{{ $a }}</option>
                            @endforeach
                            @endif
                        </select>
                        <label class="form-label">Status of Electricity</label>
                        <span class="error electric_availableError text-danger"></span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Overlooking</label>
                <select class="form-select select-2" name="overlooking[]" multiple>
                    <option value="">Slect Overlooking</option>
                    @php
                    $overlooking_list = get_overlooking_list();
                    $overlooking_arr = json_decode($propertyData->additional->overlooking);
                    @endphp
                    @if($overlooking_list)
                    @foreach($overlooking_list as $k=>$f)
                    <option value="{{ $k }}" {{ $overlooking_arr && in_array($k, $overlooking_arr) ? 'selected' : '' }}>{{ $f }}</option>
                    @endforeach
                    @endif
                </select>
                <span class="error overlookingError text-danger"></span>
            </div>

            <div class="form-floating mb-3">
                <select class="form-select" name="ownership_type">
                    <option value="">Slect Ownership Type</option>
                    @php
                    $ownership_types = get_ownership_types();
                    @endphp
                    @if($ownership_types)
                    @foreach($ownership_types as $k=>$f)
                    <option value="{{ $k }}" {{ $propertyData->additional->ownwership_type ? 'selected' : '' }}>{{ $f }}</option>
                    @endforeach
                    @endif
                </select>
                <label>Ownership Type</label>
                <span class="error ownership_typeError text-danger"></span>
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

<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>
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

@if($page == 'landmark')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
    </button>

</div>
<div class="modal-body">
    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <div class="box-body">
            <input type="hidden" name="property_id" value="{{ $property_id }}" />

            <div class="image-tab-content">
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

            <div class="img-content" id="tab-content-education">
                <div class="form-field" id="education-field">
                    <button type="button" class="btn btn-primary" onclick="add_field('education')"><i class="fa fa-plus"></i> Add Education</button>
                    <div class="education-con my-3">
                        <?php
                        if ($propertyData['landmarks']) {
                            foreach ($propertyData['landmarks'] as $k => $l) {
                                if ($l->landmark_type == 'education') {
                                    $details = json_decode($l->landmark_details);
                                    if ($details) {
                                        $name = $details->name;
                                        $distance = $details->distance;
                        ?>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="education[name][]" placeholder="Name" value="<?php echo $name; ?>" />
                                            </div>
                                            <div class="col-md-5">
                                                <div class="form-group">
                                                    <input type="text" class="form-control input-group" name="education[distance][]" placeholder="Distance" value="<?php echo $distance; ?>" />
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div>
                                            </div>
                                        </div>
                        <?php
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>

            <div class="img-content" id="tab-content-healthcare" style="display:none">
                <div class="form-field">
                    <button type="button" class="btn btn-primary" onclick="add_field('healthcare')"><i class="fa fa-plus"></i> Add Healthcare</button>
                    <div class="healthcare-con my-3">
                        <?php
                        if ($propertyData['landmarks']) {
                            foreach ($propertyData['landmarks'] as $k => $l) {
                                if ($l->landmark_type == 'healthcare') {
                                    $details = json_decode($l->landmark_details);
                                    if ($details) {
                                        $name = $details->name;
                                        $distance = $details->distance;
                        ?>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="healthcare[name][]" placeholder="Name" value="<?php echo $name; ?>" />
                                            </div>
                                            <div class="col-md-5">
                                                <div class="form-group">
                                                    <input type="text" class="form-control input-group" name="healthcare[distance][]" placeholder="Distance" value="<?php echo $distance; ?>" />
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div>
                                            </div>
                                        </div>
                        <?php
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>

            <div class="img-content" id="tab-content-shopping" style="display:none">
                <div class="form-field">
                    <button type="button" class="btn btn-primary" onclick="add_field('shopping')"><i class="fa fa-plus"></i> Add Shopping</button>
                    <div class="shopping-con my-3">
                        <?php
                        if ($propertyData['landmarks']) {
                            foreach ($propertyData['landmarks'] as $k => $l) {
                                if ($l->landmark_type == 'shopping') {
                                    $details = json_decode($l->landmark_details);
                                    if ($details) {
                                        $name = $details->name;
                                        $distance = $details->distance;
                        ?>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="shopping[name][]" placeholder="Name" value="<?php echo $name; ?>" />
                                            </div>
                                            <div class="col-md-5">
                                                <div class="form-group">
                                                    <input type="text" class="form-control input-group" name="shopping[distance][]" placeholder="Distance" value="<?php echo $distance; ?>" />
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div>
                                            </div>
                                        </div>
                        <?php
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>

            <div class="img-content" id="tab-content-commercial" style="display:none">
                <div class="form-field">
                    <button type="button" class="btn btn-primary" onclick="add_field('commercial')"><i class="fa fa-plus"></i> Add Commercial</button>
                    <div class="commercial-con my-3">
                        <?php
                        if ($propertyData['landmarks']) {
                            foreach ($propertyData['landmarks'] as $k => $l) {
                                if ($l->landmark_type == 'commercial') {
                                    $details = json_decode($l->landmark_details);
                                    if ($details) {
                                        $name = $details->name;
                                        $distance = $details->distance;
                        ?>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="commercial[name][]" placeholder="Name" value="<?php echo $name; ?>" />
                                            </div>
                                            <div class="col-md-5">
                                                <div class="form-group">
                                                    <input type="text" class="form-control input-group" name="commercial[distance][]" placeholder="Distance" value="<?php echo $distance; ?>" />
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div>
                                            </div>
                                        </div>
                        <?php
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>

            <div class="img-content" id="tab-content-transaportation" style="display:none">
                <div class="form-field">
                    <button type="button" class="btn btn-primary" onclick="add_field('transaportation')"><i class="fa fa-plus"></i> Add transaportation</button>
                    <div class="transaportation-con my-3">
                        <?php
                        if ($propertyData['landmarks']) {
                            foreach ($propertyData['landmarks'] as $k => $l) {
                                if ($l->landmark_type == 'transaportation') {
                                    $details = json_decode($l->landmark_details);
                                    if ($details) {
                                        $name = $details->name;
                                        $distance = $details->distance;
                        ?>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control" name="transaportation[name][]" placeholder="Name" value="<?php echo $name; ?>" />
                                            </div>
                                            <div class="col-md-5">
                                                <div class="form-group">
                                                    <input type="text" class="form-control input-group" name="transaportation[distance][]" placeholder="Distance" value="<?php echo $distance; ?>" />
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div>
                                            </div>
                                        </div>
                        <?php
                                    }
                                }
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>

        </div>
        <!-- /.box-body -->
        <button type="submit" class="btn btn-primary">Save</button>
    </form>
</div>
<script>
    $(".nav-link").click(function(e) {
        e.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");
        var activeTab = $(this).attr("data-tab");
        $(".img-content").hide();
        $("#tab-content-" + activeTab).show();
    });

    function add_field(type) {
        var html = '';
        html += '<div class="row">';
        html += '<div class="col-md-5"><input type="text" class="form-control" name="' + type + '[name][]" placeholder="Name" /></div>';
        html += '<div class="col-md-5"><div class="form-group"><input type="text" class="form-control input-group" name="' + type + '[distance][]" placeholder="Distance" /></div></div>';
        html += '<div class="col-md-2"><div><a href="javascript:void(0)" onclick="remove_field(this)"><i class="fa fa-trash"></i></a></div></div>';
        html += '</div>';

        $('.' + type + '-con').append(html);
    }

    function remove_field(evt) {
        $(evt).parent().parent().parent().remove();
    }
</script>
@endif


<script>
    /* $(function(){
        $('.select2').select2();
    }); */

    function submitForm(form, event) {
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type: 'POST',
            url: url,
            data: $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'JSON',
            success: function(res) {
                if (res.status == 'OK') {
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
                } else {
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    }).then((result) => {});
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if (res.errors) {
                    $.each(res.errors, function(index, error) {
                        $("#" + index + "Error").html(error);
                    });
                }
            }
        });
    }

    function onsuccess(res) {
        if (res.cmd) {
            if (res.cmd == 'reload') {
                location.reload();
            } else if (res.cmd == 'reset_form') {
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }

        }
    }

    function reset_select(opt) {
        if (opt.length > 0 && opt instanceof Array) {
            opt.forEach(function(item, ind) {
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }
</script>