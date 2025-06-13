@extends('Admin.layouts.app')
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

<div class="app-main__inner">

    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="bi bi-buildings"></i>
                </div>
                <div>Project
                    <div class="page-title-subheading">Project Setting <i class="bi bi-chevron-right"></i> Project List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-lg-end">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Project List</li>
                </ol>
            </div>
        </div>
    </div>
    <div id="successMessageContainer"></div>
    <style>
        .advance-search-panel {
            background-color: #fff;
            box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
            padding: 1rem;
            margin-top: 1rem;
        }

        #certificate {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1050;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #advanceFilter {
            display: none;

        }
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
        </button>
    </div>
    @endif

    <form action="{{ url('allproject/all-project-view') }}" method="get">
        <section class="content-header mb-4">
            <!-- Basic Search Row -->
            <div class="row gx-3">
                <div class="col-lg col-12">
                    <!-- <label for="prop_category_search" class="form-label">Project Name</label> -->
                    <input type="text" class="form-control" id="prop_category_search" name="term" placeholder="Project Name" value="{{ request('term') }}">
                </div>
                <div class="col-lg-auto col-12">
                    <button type="submit" class="btn btn-primary btn-block">Search</button>
                </div>
                <div class="col-lg-auto col-12">
                    <button type="button" onclick="$('#advanceFilter').slideToggle();" class="btn btn-outline-primary">
                        <i class="bi bi-funnel"></i> Advanced
                    </button>
                </div>
            </div>

            <div class="card mt-3" id="advanceFilter" style="display: none;">
                <div class="card-body pt-4">
                    <div class="row gx-3 -mb-3">
                        <!-- Project Type -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">

                                <select class="form-select" name="project_type">
                                    <option value="">Select</option>
                                    @foreach($project_type as $items)
                                    <option value="{{ $items->id }}"
                                        {{ request('project_type') == $items->id ? 'selected' : '' }}>
                                        {{ $items->name }}
                                    </option>
                                    @endforeach
                                </select>
                                <label>Project Type</label>
                            </div>
                        </div>

                        <!-- Address -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">
                                <input type="text" value="{{ request('address') }}" class="form-control" name="address" placeholder="Enter Address">
                                <label>Address</label>
                            </div>
                        </div>

                        <!-- Occupied Area -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">
                                <input type="number" value="{{ request('occupied_area') }}" class="form-control" name="occupied_area" placeholder="Occupied Area">
                                <label>Occupied Area (sq.ft)</label>
                            </div>
                        </div>

                        <!-- Total Area -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">
                                <input type="number" value="{{ request('total_area') }}" class="form-control" name="total_area" placeholder="Total Area">
                                <label>Total Area (sq.ft)</label>
                            </div>
                        </div>

                        <!-- Possession Status -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">
                                <select class="form-select" name="possession_status">
                                    <option value="">Select</option>
                                    @foreach ($projectStatus as $status)
                                    <option value="{{ $status['status_id'] }}"
                                        {{ request('possession_status') == $status['status_id'] ? 'selected' : '' }}>
                                        {{ $status['status_name'] }}
                                    </option>
                                    @endforeach

                                </select>
                                <label>Possession Status</label>
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-floating mb-4">
                                <input type="number" value="{{ request('price') }}" class="form-control" name="price" placeholder="Enter Price">
                                <label>Price</label>
                            </div>
                        </div>

                        <!-- Search Button -->
                        <div class="col-xl-3 col-lg-4 col-sm-6">
                            <div class="form-group mb-0">
                                <button type="submit" class="btn btn-primary btn-block">Search</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>



    @if ($user_id)
    <div class="text-end mb-3">
        <a href="{{ url('project/add_project?uid=' . $user_id) }}">
            <button type="button" class="btn btn-sm btn-success">Add Project</button>
        </a>
    </div>
    @endif

    <div class="row" id="main_table">
        @if ($project->count() > 0)
        @foreach ($project as $proj)
        <article class="col-lg-4 col-sm-6">
            <div class="card card-ads">
                <div class="card-image">
                    @php
                    $defaultImage = asset(config('constants.NO_IMAGE_PROPERTY'));
                    $imageToShow = $defaultImage;
                    if ($proj->gallery->count() > 0) {
                    $firstGallery = $proj->gallery->first();
                    $firstImage = $firstGallery->images->first();
                    if ($firstImage && isset($firstImage->filename)) {
                    $relativePath =
                    'user_upload/project_images/' . $firstImage->filename;
                    $localPath = public_path($relativePath);
                    if (file_exists($localPath)) {
                    $imageToShow = asset($relativePath);
                    }
                    }
                    }
                    @endphp
                    <img src="{{ $imageToShow }}" alt="Project Photo" class="card-img" height="250" width="300" />
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <!-- Displaying Project Name (Assuming `name` exists) -->
                        <h4><a href="{{ url('project/edit') }}/{{ $proj->id }}">{{ $proj->project_name }}</a></h4>

                        <span>
                            <a href="{{ url('/enquiry/project-leads/' . $proj->id) }}" title="View Leads"><i class="ri-eye-fill"></i></a>
                            {{ projectLeadsCount($proj->id) }}
                        </span>
                    </div>

                    <!-- Displaying Address -->
                    <p class="mb-2"><i class="ri-map-pin-line"></i> {{ $proj->location->address }}</p>

                    <!-- Displaying Post Date (Assuming `created_at` exists) -->
                    <p class="mb-2"><i class="ri-calendar-line"></i> {{ $proj->created_at->format('d-M-Y') }}</p>

                    <div class="d-flex flex-wrap gap-2 mb-3">
                        <button class="btn btn-sm btn-outline-warning"
                            onclick="addAmenity(`{{ $proj->id }}`)"><i class="bi bi-plus-lg"></i> Amenity</button>

                        <button type="button" onclick="addProperty(`{{ $proj->id }}`)"
                            class="btn btn-sm btn-outline-primary"><i class="bi bi-plus-lg"></i> Property</button>

                        <button onclick="addFloorConfig(`{{ $proj->id }}`)"
                            class="btn btn-sm btn-outline-success"><i class="bi bi-plus-lg"></i> Floor Data</button>
                        <button class="btn btn-sm btn-outline-primary"
                            onclick="AddCertificate(`{{ $proj->id }}`)"><i class="bi bi-plus-lg"></i> Certificate</button>
                        <button class="btn btn-sm btn-outline-danger"
                            onclick="openBrochureModal(`{{ $proj->id }}`)">
                            <i class="bi bi-upload"></i> Brochure
                        </button>
                    </div>

                    <div class="row">
                        <div class="col-xxl">
                            <div class="form-check-inline small">
                                <input type="checkbox" class="form-check-input prop_feature_status" id="featured" data-prop-id="{{ $proj->id }}" {{ $proj->is_featured ? 'checked' : '' }}>
                                <label class="form-check-label" for="featured">Featured</label>
                            </div>
                            <div class="form-check-inline small">
                                <input type="checkbox" class="form-check-input prop_top_status" id="top" data-prop-id="{{ $proj->id }}" {{ $proj->is_top ? 'checked' :'' }}>
                                <label class="form-check-label" for="top">Top</label>
                            </div>
                        </div>
                        <div class="col-xxl-auto">
                            <select name="prop_status" id="prop_status"
                                data-project-id="{{ $proj->id }}"
                                class="prop_status form-select form-select-sm">
                                @foreach ($statusMapping as $key => $value)
                                <option value="{{ $value }}"
                                    {{ $proj->status == $key ? 'selected' : '' }}>
                                    {{ strtoupper($value) }}
                                </option>
                                @endforeach
                                <option value="delete">DELETE</option>
                                <option value="edit_view">Edit And View</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        @endforeach
        @else
        <article class="col-12">
            <div class="card">
                <div class="card-body">
                    <i class="icon-feather-thumbs-down fa-md"></i> &nbsp; Sorry, No records !
                </div>
            </div>
        </article>
        @endif
    </div>

    {!! $project->links('vendor.pagination.bootstrap-5') !!}
</div>
@endsection


@section('modals')
<!-- Modal for Property Amenity Configuration -->
<div class="modal fade" id="amenityModal" tabindex="-1" aria-labelledby="amenityModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-fullscreen-lg-down" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="amenityModalLabel">Add Amenity Data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body amenity-container">
                <input type="hidden" name="project_id" id="project_id">

                <div class="row">
                    @foreach ($projectAmenities as $projectAmenitie)
                    <article class="col-xxl-3 col-xl-4 col-sm-6">
                        <div class="form-check">
                            <input class="form-check-input amenity-checkbox" type="checkbox" value="{{ $projectAmenitie->id }}">
                            <label class="form-check-label d-flex align-items-center ms-2">
                                <img alt="Parking" height="24" width="24" class="me-2"
                                    src="{{ asset('user_upload/amenity_image/' . $projectAmenitie->image) }}">
                                {{ $projectAmenitie->name }}
                            </label>
                        </div>
                    </article>
                    @endforeach
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveAmenityBtn">Save</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal for Property Configuration -->
<div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-fullscreen-lg-down" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Property Configuration</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                <!-- Tower Container (dynamic content) -->
                <div id="tower-container-modal"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="propertySaveButton">Save</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal for Floor Configuration-->
<div class="modal fade" id="floorModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Floor Data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Nav Tabs -->
                <ul class="nav nav-tabs" id="propertyTabs" role="tablist"></ul>
                <!-- Tab Content -->
                <div class="tab-content mt-3" id="propertyTabsContent"></div>
            </div>
            <div class="modal-footer">
                <button type="button" id="saveAllButton" class="btn btn-primary">Save All</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal for Certificate start-->
<div class="modal fade" id="certificateModal" tabindex="-1" aria-labelledby="certificateModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Upload Documents</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h6>Previous Documents</h6>
                <ul class="list-unstyled certificate-list" id="certificate-list"></ul>
                <hr>
                <h6 class="mb-3">Upload New Document</h6>
                <form action="" id='saveCertificate'>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" name="certificate_number"
                            placeholder="Enter Registration Number">
                        <label class="form-label">Registration Number</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" name="certificate_name"
                            placeholder="Enter Document Name">
                        <label class="form-label">Document Name</label>
                    </div>
                    <div>
                        <label class="form-label">Upload File</label>
                        <input type="file" id="file" name="file" class="form-control mb-2">
                        <input type="hidden" id="fileName" name="fileName" class="form-control">
                        <div id="fileUploadContainer" style="display: none;">
                            <a id="uploadedFileLink" href="#" target="_blank" class="small">View Uploaded File</a>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveDocumentBtn">Save Document</button>
            </div>
        </div>
    </div>
</div>
<!-- Modal for certificate end -->

<!-- Modal for Brochure start-->
<div class="modal fade" id="brochureModal" tabindex="-1" aria-labelledby="certificateModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title h4">Upload Project Brochure</div>
                <button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <div class="upload-area" id="uploadfile">
                    <input id="fileinput" accept="application/pdf" type="file">
                    <i class="bi bi-upload"></i>
                    <p>Drag &amp; Drop files here or <span class="text-site">Click</span> to select files</p>
                </div>
                <p class="text-help">Accepted formats are .jpg, .gif, .bmp &amp; .png.</p>
                <div id="previewContainer" class="mt-3"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="saveBrochureModal">Upload</button>
            </div>
        </div>
    </div>
</div>
<!-- Modal for Brochure end-->
@endsection
@push('custom-js')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const successMessage = localStorage.getItem('successMessage');
        if (successMessage) {
            toastr.success(successMessage, '', toastrOptions);
            localStorage.removeItem('successMessage');
        }
    });
</script>
<!-- Amenities Start -->
<script>
    // Initialize AJAX setup with CSRF token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    /**
     * Fetch and check amenities for a given project
     * @param {int} project_id
     */
    function getAmenities(project_id) {
        $.ajax({
            url: "{{ route('get.amenities') }}",
            type: "GET",
            data: {
                projId: project_id
            },
            success: function(response) {
                let selectedAmenities = [];

                if (response.project_amenity?.project_amenity) {
                    let amenities = response.project_amenity.project_amenity;
                    selectedAmenities = amenities.startsWith('[') ? JSON.parse(amenities).map(String) :
                        amenities.split(',').map(String);
                }

                $(".amenity-checkbox").each(function() {
                    $(this).prop('checked', selectedAmenities.includes($(this).val()));
                });
            },
            error: function(xhr) {
                console.error("Error fetching amenities:", xhr.responseText);
            }
        });
    }

    /**
     * Open the amenity modal for a specific project
     * @param {int} projectId
     */
    function addAmenity(projectId) {
        $('#project_id').val(projectId);
        getAmenities(projectId);
        $('#amenityModal').modal('show');
    }

    // Click event for saving amenities
    $("#saveAmenityBtn").click(saveAmenities);

    function saveAmenities() {
        let project_id = $('#project_id').val();
        let checkedAmenities = $(".amenity-checkbox:checked").map(function() {
            return $(this).val();
        }).get();

        $.ajax({
            url: "{{ route('save.amenities') }}",
            type: "POST",
            data: {
                projId: project_id,
                selectedAmenities: checkedAmenities
            },
            success: function() {
                $('#amenityModal').modal('hide');
                localStorage.setItem('successMessage', 'Amenities updated successfully!');
                location.reload();
            },
            error: function(xhr) {
                console.error("Error saving amenities:", xhr.responseText);
            }
        });
    }
    /**
     * Update the status of a property (Top, Feature, General)
     * @param {string} url
     * @param {int} id
     * @param {int} status
     */
    function updateStatus(url, id, status) {
        $.ajax({
            type: 'POST',
            url: url,
            data: {
                id: id,
                status: status
            },
            success: function(data) {
                toastr.success('Request processed successfully.', data.message, toastrOptions);
            },
            error: function(xhr) {
                console.error("Error updating status:", xhr.responseText);
            }
        });
    }

    // Handle Top Status Toggle
    $('.prop_top_status').change(function() {
        updateStatus(`{{ url('allproject/top_status') }}`, $(this).data('prop-id'), this.checked ? 1 : 0);
    });

    // Handle Feature Status Toggle
    $('.prop_feature_status').change(function() {
        updateStatus(`{{ url('allproject/feature_status') }}`, $(this).data('prop-id'), this.checked ? 1 : 0);
    });

    // Handle Property Status Change (Delete, Edit, Update)
    $('.prop_status').change(function() {
        let projectId = $(this).data('project-id');
        let status = $(this).val();
        let url = '';

        switch (status) {
            case 'delete':
                url = `{{ url('allproject/delete') }}`;
                break;
            case 'edit_view':
                window.location.href = `{{ url('project/edit') }}/${projectId}`;
                return;
            default:
                url = `{{ url('allproject/statusupdate') }}`;
                break;
        }

        updateStatus(url, projectId, status);
        location.reload();
    });
</script>
<!-- Amenities End -->

<!-- Project Property Start -->
<script>
    document.getElementById('addPropertyBtn').addEventListener('click', addProperty);

    const towerContainerModal = document.getElementById("tower-container-modal");

    function addProperty(project_id) {

        $.ajax({
            url: "{{ route('get.towers') }}",
            type: "GET",
            data: {
                projId: project_id,
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                console.log(response);

                let towersData = response.towers_data || []; // Ensure towersData is an array
                const totalTowers = response.total_towers || towersData
                    .length; // Use total_towers if available
                const modalContainer = document.getElementById("tower-container-modal");
                modalContainer.innerHTML = "";

                // Loop through the total towers and create UI
                for (let i = 0; i < totalTowers; i++) {
                    let towerData = towersData[i] || {}; // Use existing data if available, else empty object
                    createTower(towerData, i + 1, modalContainer, project_id);
                }

                // Show modal after data is populated
                $('#propertyModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
            }
        });
    }


    function createTower(towerData, towerIndex, container, project_id) {
        const tower = document.createElement("div");
        tower.classList.add("mb-4", "border", "p-3");
        $('#propertySaveButton').val(project_id);
        let slug = 'tower' + towerIndex;
        tower.innerHTML = `
        <input class="form-control" name="project_id" type="hidden" value="${project_id}">
        <h5>${'tower'+towerIndex}</h5>
        <div class="row gx-3">
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" name="tower_name" placeholder="" value="${towerData.tower_name??''}">
                    <label>Tower Name</label>
                </div>
            </div>
            <input class="form-control" name="slug" type="hidden" value="${slug}">
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="lift_no" placeholder="" value="${towerData.lift_no}">
                    <label>Lift Number</label>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="stair_no" placeholder="" value="${towerData.stair_no}">
                    <label>Stair Number</label>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="fire_safety" placeholder="" value="${towerData.fire_safety}">
                    <label>Fire Safety</label>
                </div>
            </div>
        </div>
        <div class="floor-container"></div>
        <button type="button" class="btn btn-primary btn-sm add-floor">Add Floor</button>`;

        container.appendChild(tower);

        const floorContainer = tower.querySelector(".floor-container");


        if (towerData.floor_data) {
            towerData.floor_data.forEach((floor, floorIndex) => {
                createFloor(floorContainer, floorIndex + 1, floor);
            });
        }


        tower.querySelector(".add-floor").addEventListener("click", function() {
            createFloor(floorContainer, floorContainer.children.length + 1);
        });
    }


    function createFloor(floorContainer, floorIndex, floorData = null) {
        const floor = document.createElement("fieldset");
        floor.classList.add("border", "p-3", "mb-3", "position-relative");

        floor.innerHTML =
            `<legend>Floor ${floorIndex}</legend>
        <button type="button" title="Remove Floor" class="btn btn-danger btn-delete btn-sm remove-floor mb-3"><i class="bi bi-x-lg"></i></button>
        <div class="row gx-3">
            <div class="col-sm-6">
                <div class="form-floating mb-3">
                    <input class="form-control" name="floor_no" type="number" placeholder="" value="${floorData ? floorData.floor_no : ''}">
                    <label>Floor Number</label>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-floating mb-3">
                    <input class="form-control" name="flat_no" type="number" placeholder="" value="${floorData ? floorData.flat_no : ''}">
                    <label>Flat Number</label>
                </div>
            </div>
        </div>
        <div class="bhk-container"></div>
        <button type="button" class="btn btn-primary btn-sm add-bhk">Add BHK</button>`;

        floorContainer.appendChild(floor);

        const bhkContainer = floor.querySelector(".bhk-container");

        // Load existing BHK data
        if (floorData && floorData.bhk_configurations) {
            floorData.bhk_configurations.forEach((bhk, bhkIndex) => {
                createBHK(bhkContainer, bhkIndex + 1, bhk);
            });
        }
        floor.querySelector(".remove-floor").addEventListener("click", function() {
            floor.remove();
        });

        // Add BHK event listener
        floor.querySelector(".add-bhk").addEventListener("click", function() {
            createBHK(bhkContainer, bhkContainer.children.length + 1);
        });
    }

    function createBHK(bhkContainer, bhkIndex, bhkData = null) {
        console.log(bhkData);
        const bhk = document.createElement("div");
        bhk.classList.add("mb-3");
        bhk.innerHTML =
            `<fieldset class="position-relative"><legend>Flats ${bhkIndex}</legend>
            <button type="button" class="btn btn-danger btn-delete btn-sm remove-bhk mb-3"><i class="bi bi-x-lg"></i></button>
            <div class="row gx-3 -mb-3">
                <div class="col-lg-4 col-sm-6">
                    <div class="form-floating mb-3">
                        <select class="form-select">
                            <option value="1BHK" ${bhkData && bhkData.bhk_type === '1BHK' ? 'selected' : ''}>1BHK</option>
                            <option value="2BHK" ${bhkData && bhkData.bhk_type === '2BHK' ? 'selected' : ''}>2BHK</option>
                            <option value="3BHK" ${bhkData && bhkData.bhk_type === '3BHK' ? 'selected' : ''}>3BHK</option>
                            <option value="4BHK" ${bhkData && bhkData.bhk_type === '4BHK' ? 'selected' : ''}>4BHK</option>
                            <option value="5BHK" ${bhkData && bhkData.bhk_type === '5BHK' ? 'selected' : ''}>5BHK</option>
                        </select>
                        <label>BHK Type</label>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="form-floating mb-3">
                        <input class="form-control" type="number" placeholder="" value="${bhkData ? bhkData.carpet_area : ''}">
                        <label>Carpet Area</label>
                    </div>
                </div>
                 <input class="form-control floor_plan_image_name" type="hidden" value="${bhkData ? bhkData.floor_plan_image : ''}" name="floor_plan_image_name">
                <div class="col-lg-4 col-sm-6">
                    <div class="form-floating mb-3">
                        <input class="form-control" type="number" placeholder="" value="${bhkData ? bhkData.super_area : ''}">
                        <label>Super Area</label>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="form-floating mb-3">
                        <input class="form-control" type="number" placeholder="" value="${bhkData ? bhkData.property_price : ''}">
                        <label>Price</label>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="form-floating mb-3">
                        <select class="form-select">
                            <option value="east" ${bhkData && bhkData.property_facing === 'east' ? 'selected' : ''}>East</option>
                            <option value="north" ${bhkData && bhkData.property_facing === 'north' ? 'selected' : ''}>North</option>
                            <option value="north_east" ${bhkData && bhkData.property_facing === 'north_east' ? 'selected' : ''}>North - East</option>
                            <option value="north_west" ${bhkData && bhkData.property_facing === 'north_west' ? 'selected' : ''}>North - West</option>
                            <option value="south" ${bhkData && bhkData.property_facing === 'south' ? 'selected' : ''}>South</option>
                            <option value="south_east" ${bhkData && bhkData.property_facing === 'south_east' ? 'selected' : ''}>South - East</option>
                            <option value="south_west" ${bhkData && bhkData.property_facing === 'south_west' ? 'selected' : ''}>South - West</option>
                            <option value="west" ${bhkData && bhkData.property_facing === 'west' ? 'selected' : ''}>West</option>
                        </select>
                        <label>Facing</label>
                    </div>
                </div>
            <div class="col-lg-4 col-sm-6">
                <div class="form-floating mb-3">
                    <input class="form-control floor-plan-input" type="file" accept="image/*">
                    <label>Upload Floor Image</label>
                </div>
                <img class="preview-image" src="${bhkData && bhkData.image_url ? bhkData.image_url : ''}" 
                    style="max-width: 100px; display: ${bhkData && bhkData.image_url ? 'block' : 'none'}; margin-top: 5px;">
                <button type="button" class="btn btn-danger btn-sm delete-floor-plan" 
                        style="display: ${bhkData && bhkData.image_url ? 'block' : 'none'}; margin-top: 5px;">
                    Delete
                </button>
            </div></div></fieldset>`;

        bhkContainer.appendChild(bhk);
        const fileInput = bhk.querySelector(".floor-plan-input");
        const previewImg = bhk.querySelector(".preview-image");
        const deleteImg = bhk.querySelector(".delete-floor-plan");

        fileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const objectURL = URL.createObjectURL(file);
                previewImg.src = objectURL;
                previewImg.style.display = "block";
                deleteImg.style.display = "block";
            }

            let formData = new FormData();
            formData.append("floor_plan_image", file);
            formData.append("_token", $('meta[name="csrf-token"]').attr("content"));

            $.ajax({
                url: "{{ route('upload.floor.plan') }}",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    if (response.status) {
                        fileInput.closest('.bhk-container > div').querySelector(
                            '.floor_plan_image_name').value = response.files;
                    } else {
                        alert("File upload failed");
                    }
                },
                error: function(xhr) {
                    console.error("Upload error:", xhr.responseText);
                }
            });
        });

        deleteImg.addEventListener("click", function() {
            previewImg.src = "";
            previewImg.style.display = "none";
            fileInput.value = "";
            deleteImg.style.display = "none";

            const hiddenInput = bhk.querySelector('input[name="floor_plan_image_name"]');
            if (hiddenInput) {
                hiddenInput.remove();
            }
        });

        bhk.querySelector(".remove-bhk").addEventListener("click", function() {
            bhk.remove();
        });
    }
</script>

<script>
    function collectData() {

        const towers = [];



        document.querySelectorAll('.mb-4.border.p-3').forEach((towerElement) => {
            const towerData = {
                tower_name: towerElement.querySelector('input[name="tower_name"]').value,
                slug: towerElement.querySelector('input[name="slug"]').value,
                lift_no: towerElement.querySelector('input[name="lift_no"]').value,
                stair_no: towerElement.querySelector('input[name="stair_no"]').value,
                fire_safety: towerElement.querySelector('input[name="fire_safety"]').value,
                floor_data: []
            };

            towerElement.querySelectorAll('.floor-container').forEach((floorElement) => {
                const floorData = {
                    floor_no: floorElement.querySelector('input[name="floor_no"]').value,
                    flat_no: floorElement.querySelector('input[name="flat_no"]').value,
                    bhk_configurations: []
                };

                floorElement.querySelectorAll('.bhk-container > div').forEach((bhkElement) => {
                    const floorPlanInput = bhkElement.querySelector('.floor_plan_image_name');
                    const bhkData = {
                        bhk_type: bhkElement.querySelector('select').value,
                        carpet_area: bhkElement.querySelector('input[type="number"]').value,
                        super_area: bhkElement.querySelectorAll('input[type="number"]')[1]
                            .value,
                        property_price: bhkElement.querySelectorAll('input[type="number"]')[
                            2].value,
                        property_facing: bhkElement.querySelectorAll('select')[1].value,
                        floor_plan_image: floorPlanInput ? floorPlanInput.value : ''

                    };
                    floorData.bhk_configurations.push(bhkData);
                });

                towerData.floor_data.push(floorData);
            });

            towers.push(towerData);
        });

        return towers;
    }

    document.getElementById('propertySaveButton').addEventListener('click', function() {
        const project_id = $('#propertySaveButton').val();
        const towersData = collectData();
        $.ajax({
            url: "{{ route('save.towers') }}",
            type: "POST",
            data: {
                towers: towersData,
                project_id: project_id,
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                $('#propertyModal').modal('hide');
                localStorage.setItem('successMessage', 'Towers updated successfully!');
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
            }
        });

    });
</script>
<!-- Project Property End -->

<!-- Project Floor Start -->
<script>
    function addFloorConfig(project_id) {
        floorData(project_id);
        let modal = new bootstrap.Modal(document.getElementById('floorModal'));
        modal.show();
    }

    function floorData(project_id) {
        $.ajax({
            url: "{{ route('floor.plan.type') }}",
            type: "GET",
            data: {
                project_id: project_id,
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                let tabsContainer = document.getElementById("propertyTabs");
                let contentContainer = document.getElementById("propertyTabsContent");

                // Clear previous content
                tabsContainer.innerHTML = "";
                contentContainer.innerHTML = "";

                // Loop through floorPlanTypes to create tabs and content
                response.data.floor_plan_types.forEach((type, index) => {
                    let isActive = index === 0 ? "active" : "";

                    // Create tab button
                    let tabButton = `
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${isActive}" id="${type.slug}-tab" 
                                data-bs-toggle="tab" data-bs-target="#${type.slug}" type="button" role="tab">
                                ${type.name}
                            </button>
                        </li>
                    `;
                    tabsContainer.innerHTML += tabButton;

                    // Filter items for this category
                    let items = response.data.floor_plans.filter(item => item.type_id === type.id);
                    let itemsHtml = items.map(item => `
                                                    <li>
                                                        <div class="form-floating mb-3">                                                        
                                                           <input type="text" class="form-control item-input" 
                                                                placeholder="Enter description for ${item.item}" 
                                                                value="${item.description ? item.description : ''}" 
                                                                data-item-id="${item.item_id}" 
                                                                data-type-id="${type.id}">
                                                            <label>${item.item}:</label>
                                                        </div>
                                                    </li>
                                                `).join("");


                    // Create tab content
                    let tabContent = `
                        <div class="tab-pane fade ${isActive ? "show active" : ""}" id="${type.slug}" role="tabpanel">
                            <ul class="list-unstyled">${itemsHtml}</ul>
                        </div>
                    `;
                    contentContainer.innerHTML += tabContent;
                });
                document.getElementById("saveAllButton").onclick = function() {
                    saveAllFloorPlans(project_id);
                };
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
            }
        });
    }

    function saveAllFloorPlans(project_id) {
        let floorData = [];

        document.querySelectorAll(".tab-pane").forEach(tab => {
            tab.querySelectorAll(".item-input").forEach(input => {
                let item_id = input.getAttribute("data-item-id");
                let type_id = input.getAttribute("data-type-id");
                let label = input.closest(".form-floating")?.querySelector("label");
                let item_name = label ? label.innerText.replace(":", "").trim() : "Unknown";
                let description = input.value.trim();

                if (item_id && type_id) {
                    floorData.push({
                        id: item_id,
                        item: item_name,
                        description: description,
                        type_id: type_id
                    });
                }
            });


            let newItem = tab.querySelector(".new-item")?.value?.trim();
            let newDescription = tab.querySelector(".new-description")?.value?.trim();
            let type_id = tab.querySelector(".new-item")?.getAttribute("data-type-id");

            if (newItem && newDescription && type_id) {
                floorData.push({
                    id: null,
                    item: newItem,
                    description: newDescription,
                    type_id: type_id
                });
            }
        });

        if (floorData.length === 0) {
            alert("No data to save.");
            return;
        }

        console.log("Sending floor data:", floorData);
        $.ajax({
            url: "{{ route('floor.addFloorPlan') }}",
            type: "POST",
            data: {
                project_id: project_id,
                floor_data: JSON.stringify(floorData),
                _token: "{{ csrf_token() }}"
            },
            success: function(response) {
                $("#floorModal").modal("hide");
                localStorage.setItem('successMessage', 'Floor updated successfully!');
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Error saving data.");
            }
        });
    }
</script>
<!-- Project Floor End -->

<!-- Save certificate details -->
<script>
    let certificateModalInstance;

    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("file").addEventListener("change", function() {
            let projectId = document.getElementById("saveDocumentBtn").dataset.projectId;
            uploadFile(projectId);
        });

        // document.getElementById("certificateModal").addEventListener("hidden.bs.modal", function() {
        //     document.body.classList.remove("modal-open");
        //     let backdrop = document.querySelector(".modal-backdrop");
        //     if (backdrop) {
        //         backdrop.remove();
        //     }
        // });
    });

    function resetFileUpload() {
        ["fileUploadContainer", "uploadedFileLink", "fileName", "certificate-list"].forEach(id => {
            let element = document.getElementById(id);
            if (element) {
                if (id === "fileUploadContainer") {
                    element.style.display = "none";
                } else if (id === "uploadedFileLink") {
                    element.href = "#";
                    element.textContent = "";
                } else if (id === "certificate-list") {
                    element.innerHTML = "";
                } else {
                    element.value = "";
                }
            }
        });
    }

    function AddCertificate(projectId) {
        const modalEl = document.getElementById("certificateModal");
        if (!certificateModalInstance) {
            certificateModalInstance = new bootstrap.Modal(modalEl);
        }
        document.getElementById("saveCertificate").reset();
        document.getElementById("file").value = "";
        resetFileUpload()
        getProjectCertificates(projectId);
        certificateModalInstance.show();

        let saveButton = document.getElementById("saveDocumentBtn");
        saveButton.dataset.projectId = projectId;

        saveButton.addEventListener("click", function() {
            saveDocument(projectId);
        });
        saveButton.dataset.listenerAdded = "true";

    }

    function uploadFile(projectId) {
        let fileInput = document.getElementById("file");
        let file = fileInput.files[0];

        if (!file) {
            alert("Please select a file.");
            return;
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("project_id", projectId);
        fetch("{{ route('upload.certificates.images') }}", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    toastr.success(data.message, '', toastrOptions);

                    document.getElementById("fileName").value = data.fileName;

                    let fileContainer = document.getElementById(
                        "fileUploadContainer");
                    let fileLink = document.getElementById("uploadedFileLink");

                    if (fileContainer && fileLink) {
                        fileLink.href = data.filename_url;
                        fileLink.textContent = "View Uploaded File";
                        fileContainer.style.display = "block";
                    }
                } else {
                    toastr.error("File upload failed.", "Please try again.", toastrOptions);
                }
            })
            .catch(error => {
                console.error("Upload Error:", error);
                alert("An error occurred while uploading the file.");
            });
    }

    function saveDocument(projectId) {
        let form = document.getElementById("saveCertificate");
        let formData = new FormData(form);
        formData.append("project_id", projectId);

        let saveButton = document.getElementById("saveDocumentBtn");
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        fetch("{{ route('upload.certificates.details') }}", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    toastr.success(data.message, '', toastrOptions);
                    certificateModalInstance.hide();

                } else {
                    toastr.error(data.message || 'Something went wrong.', '', toastrOptions);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                toastr.error('Something went wrong.', '', toastrOptions);
            })
            .finally(() => {
                saveButton.disabled = false;
                saveButton.textContent = "Save Document";
            });
    }


    function getProjectCertificates(projectId) {
        fetch(`{{ route('certificates.details') }}?project_id=${projectId}`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 1 && Array.isArray(data.data) && data?.data?.length > 0) {
                    renderProjectCertificates(data.data);
                } else {
                    renderProjectCertificates(data.data);
                    toastr.error(data?.data?.message || "No data Found", "", toastrOptions);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                toastr.error("Something went wrong. Please try again.", "", toastrOptions);
            });
    }


    function renderProjectCertificates(certificates) {
        let container = document.querySelector(".certificate-list");
        if (!container) return;

        container.innerHTML = "";

        if (certificates.length === 0) {
            container.innerHTML = "<li class='text-muted fst-italic'>No documents found.</li>";
            return;
        }

        certificates.forEach(cert => {
            let certItem = document.createElement("li");
            certItem.classList.add("d-flex", "align-items-center", "mb-3");

            certItem.innerHTML = `<span class="me-3">${cert.certificate_name} (Reg No: ${cert.certificate_number}) -</span>
                <a href="${cert.filename_url}" target="_blank" rel="noopener noreferrer">View</a>`;

            container.appendChild(certItem);
        });
    }
</script>
<!-- Save certificate details end-->

<!-- Save Brochure details -->
<script>
    let brochuremodalInstance;

    function openBrochureModal(projectId) {
        const brochureModal = document.getElementById('brochureModal');
        brochuremodalInstance = new bootstrap.Modal(brochureModal);

        document.getElementById("fileinput").value = "";
        document.getElementById("previewContainer").innerHTML = "";
        brochuremodalInstance.show();

        document.getElementById("saveBrochureModal").dataset.projectId = projectId;
    }

    document.getElementById("fileinput").addEventListener("change", function(event) {
        let file = event.target.files[0];
        if (!file) return;

        let previewContainer = document.getElementById("previewContainer");
        previewContainer.innerHTML = ""; // Clear previous content

        let fileURL = URL.createObjectURL(file);
        let fileType = file.type;

        if (fileType.includes("pdf")) {
            previewContainer.innerHTML = `<iframe src="${fileURL}" width="100%" height="300px"></iframe>`;
        } else if (fileType.includes("image")) {
            previewContainer.innerHTML = `<img src="${fileURL}" width="100%" class="img-thumbnail">`;
        } else {
            alert("Invalid file type. Please select a PDF or image.");
            event.target.value = ""; // Reset input
        }
    });

    // Upload file function
    document.getElementById("saveBrochureModal").addEventListener("click", function() {
        let fileInput = document.getElementById("fileinput");
        let file = fileInput.files[0];
        let projectId = this.dataset.projectId;

        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        let formData = new FormData();
        formData.append("brochure_data", file);
        formData.append("project_id", projectId);

        fetch("{{ route('uplaod.project.brochure') }}", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute(
                        "content")
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === 1) {
                    toastr.success(data.message, '', toastrOptions);
                    brochuremodalInstance.hide();
                } else {
                    toastr.error("File upload failed. Please try again.", '', toastrOptions);
                }
            })
            .catch(error => {
                console.error("Upload Error:", error);
                toastr.error("An error occurred while uploading the file.", '', toastrOptions);
            });
    });
</script>
<!-- Save Brochure details end-->
@endpush