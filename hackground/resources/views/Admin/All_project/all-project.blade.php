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
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Project
                    <div class="page-title-subheading">Project &gt; Project List</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
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

        .amenity-container {
            display: flex;
            flex-wrap: wrap;
            /* Allows items to move to the next row */
            gap: 10px;
            /* Adds spacing between items */
        }

        .amenity-item {
            display: flex;
            align-items: center;
            width: 45%;
            /* Adjust for two items per row */
        }
    </style>
    @if (session('success_msg'))
    <div class="alert alert-{{ session('message_type') }}">
        {{ session('success_msg') }}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    @endif

    <form action="{{ url('allproject/all-project-view') }}" method="get">
        <section class="content-header mb-2">
            <div class="row">
                <div class="offset-sm-8 col-sm-4">
                    <div class="input-group">
                        <input class="form-control" id="prop_category_search" placeholder="Search..." name="term"
                            value="{{ request('term') }}" />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </form>

    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="card-header p-0">
                <i class="header-icon lnr-layers icon-gradient bg-plum-plate"> </i> Project List
                @if($user_id)
                <div class="btn-actions-pane-right">
                    <a href="{{ url('project/add_project?uid=' . $user_id) }}">
                        <button type="button" class="btn btn-sm btn-success">Add Project</button>
                    </a>
                </div>
                @endif
            </div>

            <div class="table-responsive" id="main_table">
                <table id='table' class="mb-0 table">
                    <thead>
                        <tr>
                            <th style="width:10%">Photo</th>
                            <th style="width:20%">Project</th>
                            <th style="width:20%">Address</th>
                            <th style="width:15%">Post Date</th>
                            <th style="width:10%">Leads</th>
                            <th style="width:10%">Action</th>
                            <th style="min-width:5px;" class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($project as $proj)
                        <tr>
                            <!-- Displaying Photo -->
                            <td>
                                @if($proj->gallery->count() > 0)
                                <img src="{{ asset('user_upload/project_images/' . $proj->gallery->first()->images->first()->filename) }}" alt="Project Photo" width="50" height="50" />
                                @else
                                <span>No Photo</span>
                                @endif
                            </td>

                            <!-- Displaying Project Name (Assuming `name` exists) -->
                            <td><a href="{{url('project/project_details')}}/{{$proj->id}}">{{ $proj->project_name }}</a></td>

                            <!-- Displaying Address -->
                            <td>{{$proj->location->address}}</td>

                            <!-- Displaying Post Date (Assuming `created_at` exists) -->
                            <td>{{ $proj->created_at->format('d-M-Y') }}</td>

                            <td>
                                {{ projectLeadsCount($proj->id) }}
                                <a href="{{ url('/enquiry/project-leads/'.$proj->id) }}" title="View Leads"><i class="fa fa-eye"></i></a>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="addAmenity(`{{$proj->id}}`)">Add Amenity</button>
                                <button type="button" onclick="addProperty(`{{$proj->id}}`)" class="btn btn-primary">Add Property</button>

                                <button onclick="addFloorConfig(`{{$proj->id}}`)" class="btn btn-sm btn-success">Add Floor Data</button>
                                <button class="btn btn-sm btn-primary" onclick="AddCertificate()">Add Certificate</button>
                                <button class="btn btn-sm btn-danger">Upload Brochure</button>
                            </td>
                            <!-- Displaying Status -->
                            <td>
                                <div class="col-auto  mb-2">

                                    <select name="prop_status" id="prop_status"
                                        data-property-id="{{ $proj->id }}"
                                        class="prop_status form-control form-control-sm">
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
                                <div class="col-auto">

                                    <input type="checkbox" class="prop_feature_status"
                                        data-prop-id="{{ $proj->id }}" {{ $proj->is_featured ? 'checked' : '' }}>Make Featured
                                    <input type="checkbox" class="prop_top_status"
                                        data-prop-id="{{ $proj->id }}" {{ $proj->is_top ? 'checked' : '' }}>Make Top


                                </div>

                            </td>
                        </tr>
                        @endforeach
                    </tbody>


                </table>
            </div>
            @if ($project->isNotEmpty())
            <div class="card-footer pagination-rounded clearfix justify-content-center">
                <ul class="pagination small mb-0">
                    @if ($project->currentPage() == $project->lastPage() && $project->currentPage() != 1)
                    <li class="page-item">
                        <a href="{{ $project->appends(['term' => request('term')])->url(1) }}" class="page-link"
                            rel="start">
                            <i class="fa fa-chevron-left"></i> First
                        </a>
                    </li>
                    @endif

                    <li class="page-item {{ $project->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $project->appends(['term' => request('term')])->previousPageUrl() }}"
                            class="page-link" rel="prev">
                            <i class="fa fa-chevron-left"></i>
                        </a>
                    </li>

                    @for ($i = max($project->currentPage() - 1, 1); $i <= min($project->currentPage() + 1, $project->lastPage()); $i++)
                        <li class="page-item {{ $project->currentPage() == $i ? 'active' : '' }}">
                            <a href="{{ $project->appends(['term' => request('term')])->url($i) }}"
                                class="page-link">{{ $i }}</a>
                        </li>
                        @endfor

                        <li class="page-item {{ $project->currentPage() == $project->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $project->appends(['term' => request('term')])->nextPageUrl() }}"
                                class="page-link" rel="next">
                                <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>

                        @if ($project->currentPage() != $project->lastPage())
                        <li class="page-item">
                            <a href="{{ $project->appends(['term' => request('term')])->url($project->lastPage()) }}"
                                class="page-link" rel="end">
                                Last <i class="fa fa-chevron-right"></i>
                            </a>
                        </li>
                        @endif
                </ul>
            </div>
            @endif


        </div>
    </div>
</div>
@endsection


@section('modals')
<!-- Modal for Property Amenity Configuration -->
<div class="modal fade" id="amenityModal" tabindex="-1" aria-labelledby="amenityModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="amenityModalLabel">Add Amenity Data</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body amenity-container">
                <input type="hidden" name="project_id" id="project_id">


                @foreach($projectAmenities as $projectAmenitie)
                <div class="form-check amenity-item">
                    <input class="form-check-input" type="checkbox"
                        value="{{ $projectAmenitie->id }}">
                    <label class="form-check-label d-flex align-items-center ms-2">
                        <img alt="Parking" height="24" width="24" class="me-2" src="{{ asset('user_upload/amenity_image/' . $projectAmenitie->image) }}">
                        {{ $projectAmenitie->name }}
                    </label>
                </div>
                @endforeach

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveAmenityBtn">Save</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal for Property Configuration -->
<div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
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
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveButton">Save</button>
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
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="saveAllButton" class="btn btn-primary">Save All</button>
            </div>
        </div>
    </div>
</div>


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
                    selectedAmenities = amenities.startsWith('[') ? JSON.parse(amenities).map(String) : amenities.split(',').map(String);
                }

                $(".amenity-item .form-check-input").each(function() {
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

    /**
     * Save selected amenities for a project
     */
    function saveAmenities() {
        let project_id = $('#project_id').val();
        let checkedAmenities = $(".amenity-item .form-check-input:checked").map(function() {
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

    // Click event for saving amenities
    $("#saveAmenityBtn").click(saveAmenities);

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
        let propertyId = $(this).data('property-id');
        let status = $(this).val();
        let url = '';

        switch (status) {
            case 'delete':
                url = `{{ url('allproject/delete') }}`;
                break;
            case 'edit_view':
                window.location.href = `{{ url('project/edit') }}/${propertyId}`;
                return;
            default:
                url = `{{ url('allproject/statusupdate') }}`;
                break;
        }

        updateStatus(url, propertyId, status);
        location.reload();
    });
</script>
<!-- Amenities End -->

<!-- Project Property Start -->
<script>

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

                const modalContainer = document.getElementById("tower-container-modal");
                modalContainer.innerHTML = "";

                let towersData = response.towers_data || [];
                let totalTowers = response.total_towers || towersData.length;

                for (let i = 0; i < totalTowers; i++) {
                    createTower(towersData[i] || {}, i + 1, modalContainer, project_id);
                }

                // Show the modal
                $("#propertyModal").modal("show");
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            },
        });
    }

    function createTower(towerData, towerIndex, container, project_id) {
        const tower = document.createElement("div");
        tower.classList.add("mb-4", "border", "p-3");

        $('#saveButton').val(project_id);
        let slug = "tower" + towerIndex;

        tower.innerHTML = `
            <input type="hidden" name="project_id" value="${project_id}">
            <h5>${slug}</h5>
            <div class="row gx-2">
                <div class="col-md-3">
                <label>Tower Name</label>
                    <input class="form-control" name="tower_name" type="text" value="${towerData.tower_name || ''}">
                </div>
                <input type="hidden" name="slug" value="${slug}">
                <div class="col-md-3">
                <label>Lift Number</label>
                    <input class="form-control" name="lift_no" type="number" value="${towerData.lift_no || ''}">
                </div>
                <div class="col-md-3">
                <label>Stair Number</label>
                    <input class="form-control" name="stair_no" type="number" value="${towerData.stair_no || ''}">
                </div>
                <div class="col-md-3">
                <label>Fire Safety</label>
                    <input class="form-control" name="fire_safety" type="number" value="${towerData.fire_safety || ''}">
                </div>
            </div>
            <div class="floor-container"></div>
            <button type="button" class="btn btn-primary btn-sm add-floor">Add Floor</button>
        `;

        container.appendChild(tower);

        const floorContainer = tower.querySelector(".floor-container");

        if (towerData.floor_data) {
            towerData.floor_data.forEach((floor, index) => {
                createFloor(floorContainer, index + 1, floor);
            });
        }

        tower.querySelector(".add-floor").addEventListener("click", () => {
            createFloor(floorContainer, floorContainer.children.length + 1);
        });
    }

    function createFloor(floorContainer, floorIndex, floorData = {}) {
        const floor = document.createElement("fieldset");
        floor.classList.add("border", "p-3", "mb-3", "position-relative");

        floor.innerHTML = `
            <legend>Floor ${floorIndex}</legend>
            <button type="button" class="btn btn-danger btn-sm remove-floor">Remove Floor</button>
            <div class="row gx-2">
                <div class="col-md-4">
                <label>Floor Number</label>
                    <input class="form-control" name="floor_no" type="number" value="${floorData.floor_no || ''}">
                </div>
                <div class="col-md-4">
                <label>Flat Number</label>
                    <input class="form-control" name="flat_no" type="number" value="${floorData.flat_no || ''}">
                </div>
            </div>
            <div class="bhk-container"></div>
            <button type="button" class="btn btn-primary btn-sm add-bhk">Add BHK</button>
        `;

        floorContainer.appendChild(floor);
        const bhkContainer = floor.querySelector(".bhk-container");

        if (floorData.bhk_configurations) {
            floorData.bhk_configurations.forEach((bhk, index) => {
                createBHK(bhkContainer, index + 1, bhk);
            });
        }

        floor.querySelector(".remove-floor").addEventListener("click", () => {
            floor.remove();
        });

        floor.querySelector(".add-bhk").addEventListener("click", () => {
            createBHK(bhkContainer, bhkContainer.children.length + 1);
        });
    }

    function createBHK(bhkContainer, bhkIndex, bhkData = {}) {
        const bhk = document.createElement("div");
        bhk.classList.add("mb-3");

        bhk.innerHTML = `
            <legend>Flats ${bhkIndex}</legend>
            <button type="button" class="btn btn-danger btn-sm remove-bhk">Remove</button>
            <div class="row gx-2">
                <div class="col-md-4">
                <label>BHK Type</label>
                    <select class="form-select">
                        <option value="1BHK" ${bhkData.bhk_type === '1BHK' ? 'selected' : ''}>1BHK</option>
                        <option value="2BHK" ${bhkData.bhk_type === '2BHK' ? 'selected' : ''}>2BHK</option>
                        <option value="3BHK" ${bhkData.bhk_type === '3BHK' ? 'selected' : ''}>3BHK</option>
                    </select>
                </div>
                <div class="col-md-4">
                <label>Carpet Area</label>
                    <input class="form-control" type="number" value="${bhkData.carpet_area || ''}">
                </div>
                <div class="col-md-4">
                <label>Super Area</label>
                    <input class="form-control" type="number" value="${bhkData.super_area || ''}">
                </div>
            </div>
        `;

        bhkContainer.appendChild(bhk);

        bhk.querySelector(".remove-bhk").addEventListener("click", () => {
            bhk.remove();
        });
    }

    function collectData() {
        const towers = [];
        document.querySelectorAll(".mb-4.border.p-3").forEach((towerElement) => {
            const towerData = {
                tower_name: towerElement.querySelector('[name="tower_name"]').value,
                slug: towerElement.querySelector('[name="slug"]').value,
                lift_no: towerElement.querySelector('[name="lift_no"]').value,
                stair_no: towerElement.querySelector('[name="stair_no"]').value,
                fire_safety: towerElement.querySelector('[name="fire_safety"]').value,
                floor_data: []
            };

            towerElement.querySelectorAll(".floor-container fieldset").forEach((floorElement) => {
                const floorData = {
                    floor_no: floorElement.querySelector('[name="floor_no"]').value,
                    flat_no: floorElement.querySelector('[name="flat_no"]').value,
                };
                towerData.floor_data.push(floorData);
            });

            towers.push(towerData);
        });

        return towers;
    }

    document.getElementById("saveButton").addEventListener("click", function() {
        const project_id = this.value;
        const towersData = collectData();
        $.ajax({
            url: "{{ route('save.towers') }}",
            type: "POST",
            data: {
                towers: towersData,
                project_id,
                _token: "{{ csrf_token() }}"
            },
            success: function() {
                $("#propertyModal").modal("hide");
                localStorage.setItem("successMessage", "Towers updated successfully!");
                location.reload();
            },
            error: function(xhr) {
                console.error("Error:", xhr.responseText);
            },
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
                                                        <label>${item.item}:</label>
                                                           <input type="text" class="form-control item-input" 
                                                                placeholder="Enter description for ${item.item}" 
                                                                value="${item.description ? item.description : ''}" 
                                                                data-item-id="${item.item_id}" 
                                                                data-type-id="${type.id}">

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
@endpush