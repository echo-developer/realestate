<div class="modal-header">
    <h5 class="modal-title" id="ajaxModalLabel">Edit Project</h5>
    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="modal-body">
    <form role="form" id="add_form">
        @csrf
        <input type="hidden" name="project_id" value="{{ $projectData->id }}" />
        <input type="hidden" name="step" value="{{ $step }}" />

        @if($step == 1)
        <div class="form-group">
            <label>Select Project Budget:</label>
            <input placeholder="Enter Project Budget" class="form-control" name="project_price" type="number"
                value="{{ $projectData->additional->expected_price }}">
        </div>

        <div class="form-group">
            <label>Post For:</label>
            <div>
                <label>
                    <input type="radio" name="post_for" value="rent"
                        {{ $projectData->settings->post_for == 'rent' ? 'checked' : '' }}> Rent
                </label>
                <label class="ms-3">
                    <input type="radio" name="post_for" value="sale"
                        {{ $projectData->settings->post_for == 'sale' ? 'checked' : '' }}> Sale
                </label>
            </div>
        </div>

        <div class="form-group">
            <label>Property Type</label>
            <select class="form-control" name="project_type">
                <option value="">Select Project Type</option>
                @foreach ($projectTypes as $projectType)
                <option value="{{ $projectType->id }}"
                    {{ isset($projectData->settings->project_type) && $projectData->settings->project_type == $projectType->id ? 'selected' : '' }}>
                    {{ $projectType->name }}
                </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="developer_name">Enter Developer Name</label>
            <input placeholder="Enter Developer Name" name="developer_name" id="developer_name"
                class="form-control" value="{{ $projectData->additional->developer_name ?? '' }}" type="text">
        </div>

        <div class="form-group">
            <label for="developer_details">Enter Developer Details</label>
            <textarea placeholder="Enter Developer Details" name="developer_details" id="developer_details"
                class="form-control" rows="4">{{ $projectData->additional->developer_details ?? '' }}</textarea>
        </div>

        <div class="form-group">
            <label for="developer_experience">Enter Developer Experience (in years)</label>
            <input placeholder="Enter Developer Experience" name="developer_experience" id="developer_experience"
                class="form-control" type="number" min="0"
                value="{{ $projectData->additional->developer_experience ?? '' }}">
        </div>

        <div class="form-group">
            <label>Enter the value for instruction</label>
            <input placeholder="Edit Instruction" class="form-control" name="instruction" type="text"
                value="{{ $projectData->additional->instruction }}">
        </div>

        <div class="form-group">
            <label>Enter the Address:</label>
            <textarea placeholder="Enter the address here" rows="4" name="project_address" class="form-control"
                style="height: 100px;">{{ $projectData->location->address }}</textarea>
        </div>

        <div class="form-group">
            <label for="locality">Locality</label>
            <input id="locality" class="form-control" type="text" name="project_locality" placeholder="Enter a location"
                value="{{ $projectData->location->locality }}">
        </div>

        <div class="form-group">
            <label>Enter The Project Name</label>
            <input placeholder="Edit Project Name" name="project_name" class="form-control" type="text"
                value="{{ $projectData->project_name }}">
        </div>
        @endif

        @if($step == 2)
        <div class="form-group">
            <label>Enter the Occupied Area:</label>
            <input placeholder="Occupied Area" class="form-control" name="occupied_area" type="number"
                value="{{$projectData->settings->occupied_area}}">
        </div>

        <div class="form-group">
            <label>Enter the Total Area:</label>
            <input placeholder="Total Area" class="form-control" name="total_area" type="number"
                value="{{$projectData->settings->total_area}}">
        </div>

        <div class="form-group">
            <label>Possession Status:</label>
            <div>
                @foreach ($propertyStatus as $status)
                <label class="me-3">
                    <input type="radio" name="possession_status" id="status" value="{{ $status['status_id'] }}"
                        {{ isset($projectData->additional->possession_status) && $projectData->additional->possession_status == $status['status_id'] ? 'checked' : '' }}>
                    {{ $status['status_name'] }}
                </label>
                @endforeach
            </div>
        </div>

        <div class="form-group" id="age_of_const" style="display:none;">
            <label>Age of Construction</label>
            <select class="form-control" name="age_of_construction">
                <option value="">Select Age</option>
                @php
                $ageOptions = [
                'new' => 'New Construction',
                'less_than_5_years' => 'Less than 5 years',
                '5_10_years' => '5 to 10 years',
                '10_15_years' => '10 to 15 years',
                '15_20_years' => '15 to 20 years',
                'above_20_years' => 'Above 20 years'
                ];
                @endphp

                @foreach($ageOptions as $value => $label)
                <option value="{{ $value }}" {{ ($projectData->additional->construct_year ?? '') == $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
                @endforeach
            </select>
        </div>
        <div id="month_year" style="display:none;">
            <div class="dropdown-container d-flex gap-3">
                @php
                $expectedDate = isset($projectData->additional->possesion_month_possesion_year)
                ? explode('-', $projectData->additional->possesion_month_possesion_year)
                : ['', ''];

                $monthNumber = trim($expectedDate[0] ?? ''); // Trim spaces just in case
                $selectedYear = trim($expectedDate[1] ?? '');

                $months = [
                '01' => 'January', '02' => 'February', '03' => 'March',
                '04' => 'April', '05' => 'May', '06' => 'June',
                '07' => 'July', '08' => 'August', '09' => 'September',
                '10' => 'October', '11' => 'November', '12' => 'December'
                ];

                $selectedMonth = $months[$monthNumber] ?? '';
                @endphp

                <div class="dropdown-container d-flex gap-3">
                    <div class="dropdown">
                        <label for="month">Month</label>
                        <select name="month" id="month" class="form-control">
                            <option disabled>Select Month</option>
                            @foreach ($months as $num => $month)
                            <option value="{{ $num }}" {{ str_pad($monthNumber, 2, '0', STR_PAD_LEFT) == $num ? 'selected' : '' }}>
                                {{ $month }}
                            </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="dropdown">
                        <label for="year">Year</label>
                        <select name="year" id="year" class="form-control">
                            <option disabled>Select Year</option>
                            @for ($i = date('Y'); $i <= date('Y') + 30; $i++)
                                <option value="{{ $i }}" {{ $selectedYear == $i ? 'selected' : '' }}>{{ $i }}</option>
                                @endfor
                        </select>
                    </div>
                </div>

            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Furnish Status</label>
            <select class="form-control" name="project_furnish">
                <option value="">Select Furnish Status</option>
                @foreach ($projectFurnishes as $furnish)
                <option value="{{ $furnish['furnish_id'] }}"
                    {{ $projectData->settings->project_furnish == $furnish['furnish_id'] ? 'selected' : '' }}>
                    {{ $furnish['furnish_name'] }}
                </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            @php
            $parking_availability = [
            'AV' => 'Available',
            'NA' => 'Not Available',
            'UC' => 'Under Construction',
            ];
            @endphp

            <label class="form-label">Parking Status</label>
            <select class="form-control" name="parking">
                <option value="">Select Parking Option</option>
                @foreach ($parking_availability as $value => $label)
                <option value="{{ $value }}" {{ $projectData->settings->parking_availability === $value ? 'selected' : '' }}>{{ $label }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
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

            <label class="form-label">Project Facing</label>
            <select class="form-control" name="facing_direction">
                <option value="">Select Facing</option>
                @foreach ($floorOptions as $value => $label)
                <option value="{{ $value }}" {{ $projectData->settings->project_facing === $value ? 'selected' : '' }}>{{ $label }}</option>
                @endforeach
            </select>
        </div>

        <div>
            <label class="form-label d-block form-label">Select Overlooking Features:</label>
            @php
            $overlooking = json_decode($projectData->additional->overlooking, true) ?? [];
            @endphp
            <div class="form-check-inline form-check">
                <input id="Pool" class="form-check-input" type="checkbox"
                    {{ in_array('pool', $overlooking) ? 'checked' : '' }} value="pool" name="overlooking[]">
                <label title="" for="Pool" class="form-check-label">Pool</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="Garden_Park" class="form-check-input" type="checkbox"
                    {{ in_array('garden_park', $overlooking) ? 'checked' : '' }} value="garden_park" name="overlooking[]">
                <label title="" for="Garden_Park" class="form-check-label">Garden/Park</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="main_road" class="form-check-input" type="checkbox"
                    {{ in_array('main_road', $overlooking) ? 'checked' : '' }} value="main_road" name="overlooking[]">
                <label title="" for="main_road" class="form-check-label">Main Road</label>
            </div>
        </div>


        <div>
            <label class="form-label d-block form-label">Select Flooring Types:</label>
            @php
            $flooringStyles = json_decode($projectData->additional->flooring_style, true) ?? [];
            @endphp
            <div class="form-check-inline form-check">
                <input id="mosaic" class="form-check-input" type="checkbox"
                    {{ in_array('mosaic', $flooringStyles) ? 'checked' : '' }} value="mosaic" name="flooring_style[]">
                <label title="" for="mosaic" class="form-check-label">Mosaic</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="vitrified" class="form-check-input" type="checkbox"
                    {{ in_array('vitrified', $flooringStyles) ? 'checked' : '' }} value="vitrified" name="flooring_style[]">
                <label title="" for="vitrified" class="form-check-label">Vitrified</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="wooden" class="form-check-input" type="checkbox"
                    {{ in_array('wooden', $flooringStyles) ? 'checked' : '' }} value="wooden" name="flooring_style[]">
                <label title="" for="wooden" class="form-check-label">Wooden</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="ceramic_tiles" class="form-check-input" type="checkbox"
                    {{ in_array('ceramic_tiles', $flooringStyles) ? 'checked' : '' }} value="ceramic_tiles" name="flooring_style[]">
                <label title="" for="ceramic_tiles" class="form-check-label">Ceramic Tiles</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="marble" class="form-check-input" type="checkbox"
                    {{ in_array('marble', $flooringStyles) ? 'checked' : '' }} value="marble" name="flooring_style[]">
                <label title="" for="marble" class="form-check-label">Marble</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="normal_tiles" class="form-check-input" type="checkbox"
                    {{ in_array('normal_tiles', $flooringStyles) ? 'checked' : '' }} value="normal_tiles" name="flooring_style[]">
                <label title="" for="normal_tiles" class="form-check-label">Normal Tiles/Kotah Stone</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="granite" class="form-check-input" type="checkbox"
                    {{ in_array('granite', $flooringStyles) ? 'checked' : '' }} value="granite" name="flooring_style[]">
                <label title="" for="granite" class="form-check-label">Granite</label>
            </div>
            <div class="form-check-inline form-check">
                <input id="marbonite" class="form-check-input" type="checkbox"
                    {{ in_array('marbonite', $flooringStyles) ? 'checked' : '' }} value="marbonite" name="flooring_style[]">
                <label title="" for="marbonite" class="form-check-label">Marbonite</label>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Total Tower</label>
            <select class="form-control" name="total_tower">
                <option value="">Select Total Tower</option>
                @for ($i = 1; $i <= 15; $i++)
                    <option value="{{ $i }}" {{ ($projectData->settings->total_towers ?? '') == $i ? 'selected' : '' }}>{{ $i }}</option>
                    @endfor
            </select>
        </div>
        <div class="form-group">
            <label>Total Units</label>
            <input placeholder="Carpet Area" class="form-control" name="total_units" type="number"
                value="{{$projectData->settings->total_units}}">
        </div>
        @endif
        @if($step == 3)

        <div class="form-group">
            <label for="floatingSelect">Select Water Availability:</label>
            @php
            $waterAvailability = [
            '24_hours' => '24 Hours Available',
            'partially_available' => 'Partially Available',
            'not_available' => 'Not Available',
            ];
            @endphp
            <select class="form-control" id="floatingSelect" name="water_availability">
                <option value="">Select Water Availability</option>
                @foreach ($waterAvailability as $value => $label)
                <option value="{{ $value }}" {{ ($projectData->additional->water_availability ?? '') == $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="floatingSelect">Select Electricity Status:</label>
            @php
            $electricityStatus = [
            'full_power_backup' => 'Full Power Backup',
            'partial_power_backup' => 'Partial Power Backup',
            'no_power_backup' => 'No Power Backup',
            ];
            @endphp
            <select class="form-control" id="" name="electricity_status">
                <option value="">Select Water Availability</option>
                @foreach ($electricityStatus as $value => $label)
                <option value="{{ $value }}" {{ ($projectData->additional->electric_availability ?? '') == $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="floatingSelect">Select Ownership Type:</label>
            @php
            $ownershipType = [
            'freehold' => 'Freehold',
            'leasehold' => 'Leasehold',
            'cooperative_society' => 'Co-operative Society',
            'power_of_attorney' => 'Power of Attorney'
            ];
            @endphp
            <select class="form-control" id="" name="ownership_type">
                <option value="">Select Ownership Type:</option>
                @foreach ($ownershipType as $value => $label)
                <option value="{{ $value }}" {{ ($projectData->additional->type_of_ownership ?? '') == $value ? 'selected' : '' }}>
                    {{ $label }}
                </option>
                @endforeach
            </select>
        </div>

        @endif
        @if($step == 4)

        <?php

        $jsonData = $projectData->landmarks;
        $landmarksData = json_decode($jsonData, true);
        $typeMappings = [
            "education" => "education",
            "healthcare" => "healthcare",
            "shopping" => "shopping-center",
            "commercial" => "commercial-hub",
            "transport" => "transportation"
        ];

        $groupedLandmarks = [];

        foreach ($landmarksData as $landmark) {
            // Extract main category from landmark_type (e.g., "education1" -> "education")
            preg_match('/([a-zA-Z_]+)/', $landmark["landmark_type"], $matches);
            $typeKey = $matches[1] ?? null; // Extract "education" from "education1"

            if (!$typeKey || !isset($typeMappings[$typeKey])) continue; // Skip unknown types

            $frontendType = $typeMappings[$typeKey]; // Get frontend name
            $details = json_decode($landmark["landmark_details"], true);

            // Ignore empty values
            if (empty($details["name"]) || empty($details["distance"])) continue;

            $groupedLandmarks[$frontendType][] = $details;
        }
        ?>
        <div class="container mt-3">
            <!-- Navigation Tabs -->
            <ul class="nav nav-tabs" id="ed-nav">
                <?php foreach ($typeMappings as $backendType => $frontendType): ?>
                    <li class="nav-item">
                        <a class="nav-link <?= ($frontendType == "education") ? "active" : "" ?>"
                            href="#tab-<?= $frontendType ?>"
                            data-type="<?= $frontendType ?>">
                            <?= ucfirst(str_replace('-', ' ', $frontendType)) ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>

            <!-- Tab Contents -->
            <div class="tab-contents mt-3">
                <?php foreach ($typeMappings as $backendType => $frontendType): ?>
                    <div id="tab-<?= $frontendType ?>" class="tab-content" style="display: <?= ($frontendType == "education") ? "block" : "none" ?>;">
                        <div class="mt-3">
                            <a href="javascript:void(0)">
                                <button type="button" class="btn btn-success add-btn" data-type="<?= $frontendType ?>">
                                    + Add <?= ucfirst(str_replace('-', ' ', $frontendType)) ?>
                                </button>
                            </a>
                        </div>
                        <div class="items-container" data-type="<?= $frontendType ?>">
                            <?php if (!empty($groupedLandmarks[$frontendType])): ?>
                                <?php foreach ($groupedLandmarks[$frontendType] as $index => $landmark): ?>
                                    <div class="item mt-3 p-3 border rounded">
                                        <h6><?= htmlspecialchars($landmark["name"]) ?></h6>
                                        <div class="row">
                                            <div class="col-md-5">
                                                <input type="text" class="form-control"
                                                    value="<?= htmlspecialchars($landmark["name"]) ?>"
                                                    placeholder="Name"
                                                    name="<?= $frontendType ?>_name[]">
                                            </div>
                                            <div class="col-md-5 d-flex">
                                                <input type="text" class="form-control"
                                                    value="<?= htmlspecialchars($landmark["distance"]) ?>"
                                                    placeholder="Distance"
                                                    name="<?= $frontendType ?>_distance[]">
                                                <span class="ms-2 mt-2">meter</span>
                                            </div>
                                            <div class="col-md-2">
                                                <button class="btn btn-danger remove-btn">✖</button>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <!-- Show an empty input field if there are no landmarks -->
                                <div class="item mt-3 p-3 border rounded">
                                    <h6><?= ucfirst(str_replace('-', ' ', $frontendType)) ?> 1</h6>
                                    <div class="row">
                                        <div class="col-md-5">
                                            <input type="text" class="form-control" placeholder="Name" name="<?= $frontendType ?>_name[]">
                                        </div>
                                        <div class="col-md-5 d-flex">
                                            <input type="text" class="form-control" placeholder="Distance" name="<?= $frontendType ?>_distance[]">
                                            <span class="ms-2 mt-2">meter</span>
                                        </div>
                                        <div class="col-md-2">
                                            <button class="btn btn-danger remove-btn" disabled>✖</button>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        @endif
        @if($step == 5)

        <input type="hidden" id="activeTabName" name="activeTabName">

        <div class="image-tab-content" id="image-upload-page">
            <ul class="nav nav-underline nav-custom mb-3" id="image-tab-nav-upload">
                @foreach($groupedGallery as $type => $images)
                <li class="nav-item">
                    <a class="image-tab-link-upload {{ $loop->first ? 'active' : '' }}" id="tab-upload-{{ $type }}" data-tab="{{ $type }}" href="javascript:void(0)">
                        {{ ucfirst($type) }}
                    </a>
                </li>
                @endforeach
            </ul>
        </div>

        <div class="form-field">
            <div class="upload-area" id="uploadfile">
                <input id="fileinput" multiple type="file" name="fileinput">
                <i class="bi bi-upload"></i>
                <p>Drag & drop files here or <span class="text-site">click</span> to select files</p>
            </div>
        </div>

        @foreach($groupedGallery as $type => $images)
        <div class="img-content-upload" id="tab-content-upload-{{ $type }}" style="{{ $loop->first ? '' : 'display: none;' }}">
            <div class="upload-gallery" id="preview-upload-{{ $type }}">
                @foreach($images as $galleryItem)
                @foreach($galleryItem->images as $image)
                <div class="image-box" data-filename="{{ $image->filename }}">
                    <img src="{{ asset('user_upload/project_images/' . $image->filename) }}" alt="Image">
                    <p class="image-caption">{{ $image->filename }}</p>
                    <button class="remove-image" data-filename="{{ $image->filename }}">×</button>
                </div>
                @endforeach
                @endforeach
            </div>
            <!-- Hidden field for tab-wise image tracking -->
            <input type="hidden" class="uploaded-files-input" id="uploadedFiles-{{ $type }}" name="uploadedFiles[{{ $type }}]">
        </div>
        @endforeach




        @endif
        <button type="submit" class="btn btn-primary mt-3">Save</button>
    </form>
</div>

<script>
    $(document).on('submit', '#add_form', function(e) {
        e.preventDefault();

        var formData = $(this).serialize();

        $.ajax({
            url: "{{ url('project/update-project') }}",
            type: "POST",
            data: formData,
            success: function(response) {
                $('#ajax_modal').modal('hide');
                setTimeout(() => {
                    c_alert(response.success ? "Data saved successfully!" : "Error saving data.", response.success ? "success" : "error");
                    if (response.success) location.reload();
                }, 500);
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            }
        });
    });

    $(document).ready(function() {
        chekedStatus();
        handleInitialSelection();
    });

    let chekedStatus = () => {
        $("input[name='possession_status']").change(function() {
            updateDropdowns($(this).val());
        });
    };

    let handleInitialSelection = () => {
        let checkedRadio = $("input[name='possession_status']:checked");
        if (checkedRadio.length > 0) {
            updateDropdowns(checkedRadio.val());
        }
    };

    let updateDropdowns = (id) => {
        let ageConstructionDropdown = document.getElementById('age_of_const');
        let monthYearDropdown = document.getElementById('month_year');
        ageConstructionDropdown.style.display = "none";
        monthYearDropdown.style.display = "none";

        if (id == 1) {
            ageConstructionDropdown.style.display = "block";
        } else if (id == 2) {
            monthYearDropdown.style.display = "block";
        }
    };
</script>
<script>
    $(document).ready(function() {
        // Tab switching - Updated to be more specific
        $('#ed-nav .nav-link').on('click', function(e) {
            e.preventDefault();
            $('#ed-nav .nav-link').removeClass('active');
            $(this).addClass('active');

            $('.tab-contents .tab-content').hide();
            $($(this).attr('href')).show();
        });

        // Add item functionality (unchanged)
        $('.add-btn').on('click', function() {
            const type = $(this).data('type');
            const $container = $(`.items-container[data-type="${type}"]`);
            let count = $container.children().length + 1;

            const newItem = $(`
            <div class="item mt-3 p-3 border rounded">
                <h6>${type.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ${count}</h6>
                <div class="row">
                    <div class="col-md-5">
                        <input type="text" class="form-control" placeholder="Name" name="${type}_name[]">
                    </div>
                    <div class="col-md-5 d-flex">
                        <input type="text" class="form-control" placeholder="Distance" name="${type}_distance[]">
                        <span class="ms-2 mt-2">meter</span>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-danger remove-btn">✖</button>
                    </div>
                </div>
            </div>
        `);

            $container.append(newItem);
            $container.find('.remove-btn').prop('disabled', false);
        });

        // Remove item functionality (unchanged)
        $('.tab-contents').on('click', '.remove-btn', function() {
            const $container = $(this).closest('.items-container');
            $(this).closest('.item').remove();

            if ($container.children().length === 1) {
                $container.find('.remove-btn:first').prop('disabled', true);
            }
        });
    });
</script>
<script>
    $(document).ready(function() {
        let activeTab = $(".image-tab-link-upload.active").data("tab");
        $("#activeTabName").val(activeTab);
        let uploadedFilesByTab = {};

        $(".upload-gallery").each(function() {
            let tabId = $(this).attr("id").replace("preview-upload-", "");
            uploadedFilesByTab[tabId] = [];

            $(this).find(".image-box").each(function() {
                let filename = $(this).data("filename");
                uploadedFilesByTab[tabId].push(filename);
            });
            $("#uploadedFiles-" + tabId).val(JSON.stringify(uploadedFilesByTab[tabId]));
        });


        $("#image-tab-nav-upload .image-tab-link-upload").click(function() {
            activeTab = $(this).data("tab");
            $("#activeTabName").val(activeTab);

            $(".img-content-upload").hide();
            $("#tab-content-upload-" + activeTab).show();
            $("#uploadedFiles-" + activeTab).val(JSON.stringify(uploadedFilesByTab[activeTab]));
        });

        $("#fileinput").on("change", function(event) {
            let files = event.target.files;
            let previewContainer = $("#preview-upload-" + activeTab);
            if (!uploadedFilesByTab[activeTab]) {
                uploadedFilesByTab[activeTab] = [];
            }

            $.each(files, function(index, file) {
                let reader = new FileReader();

                reader.onload = function(e) {
                    let imageHtml = `
                        <div class="image-box" data-filename="${file.name}">
                            <img src="${e.target.result}" alt="Preview">
                            <p class="image-caption">${file.name}</p>
                            <button class="remove-image" data-filename="${file.name}">×</button>
                        </div>
                    `;
                    previewContainer.append(imageHtml);
                };

                reader.readAsDataURL(file);
                uploadedFilesByTab[activeTab].push(file.name);
            });

            $("#uploadedFiles-" + activeTab).val(JSON.stringify(uploadedFilesByTab[activeTab]));
        });


        $(document).on("click", ".remove-image", function() {
            let fileName = $(this).data("filename");
            $(this).closest(".image-box").remove();
            if (uploadedFilesByTab[activeTab]) {
                uploadedFilesByTab[activeTab] = uploadedFilesByTab[activeTab].filter(name => name !== fileName);
            }

            $("#uploadedFiles-" + activeTab).val(JSON.stringify(uploadedFilesByTab[activeTab]));
        });

        $(".img-content-upload").first().show();
    });
</script>