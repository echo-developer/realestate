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
                        <div class="page-title-subheading">Project Setting <i class="bi bi-chevron-right"></i> Project List
                        </div>
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

        <form action="{{ url('allproject/all-project-view') }}" method="get">
            <div class="card mb-4 shadow-sm border-0" style="border-radius: 12px; background-color: #fff;">
                <div class="card-body p-4">
                    <div class="row g-3 align-items-end mb-3">
                        <div class="col-lg-7 col-md-12">
                            <div class="form-group mb-0 position-relative">
                                <span class="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted" style="pointer-events: none; z-index: 5;">
                                    <i class="bi bi-search" style="font-size: 1.1rem; color: #94a3b8;"></i>
                                </span>
                                <input type="text" class="form-control" name="term"
                                       placeholder="Search by Project Name, Address, City, etc."
                                       value="{{ request('term') }}"
                                       style="padding-left: 2.75rem; height: 50px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 0.95rem; color: #1e293b;">
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-12">
                            <div class="form-group mb-0">
                                <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Filter by Date Range</label>
                                <div class="d-flex align-items-center justify-content-between p-1 bg-white border" style="height: 50px; border-radius: 10px; border: 1px solid #e2e8f0 !important;">
                                    <input type="date" class="form-control border-0 shadow-none bg-transparent" name="start_date" placeholder="Start Date" value="{{ request('start_date') }}" style="height: 100%; font-size: 0.9rem; color: #1e293b;">
                                    <span class="mx-2 text-muted fw-medium" style="font-size: 1.1rem;">→</span>
                                    <input type="date" class="form-control border-0 shadow-none bg-transparent" name="end_date" placeholder="End Date" value="{{ request('end_date') }}" style="height: 100%; font-size: 0.9rem; color: #1e293b;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 align-items-end">
                        <div class="col-lg-3 col-md-4 col-sm-6">
                            <div class="form-group mb-0">
                                <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Project Type</label>
                                <select class="form-select" name="project_type" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                                    <option value="">Select</option>
                                    @foreach ($project_type as $items)
                                        <option value="{{ $items->id }}" {{ request('project_type') == $items->id ? 'selected' : '' }}>{{ $items->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6">
                            <div class="form-group mb-0">
                                <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Possession Status</label>
                                <select class="form-select" name="possession_status" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                                    <option value="">Select</option>
                                    @foreach ($projectStatus as $status)
                                        <option value="{{ $status['status_id'] }}" {{ request('possession_status') == $status['status_id'] ? 'selected' : '' }}>{{ $status['status_name'] }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-6">
                            <div class="form-group mb-0">
                                <label class="form-label mb-1 fw-semibold" style="font-size: 0.85rem; color: #475569;">Address</label>
                                <input type="text" class="form-control" name="address" placeholder="Enter Address" value="{{ request('address') }}" style="height: 48px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.9rem; color: #1e293b;">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-12 col-sm-6 d-flex align-items-center justify-content-end gap-3 pt-2">
                            <a href="{{ url('allproject/all-project-view') }}" class="btn btn-outline-primary fw-medium px-4 d-flex align-items-center justify-content-center gap-2" style="height: 48px; border-radius: 8px; font-size: 0.9rem; border: 1px solid #3b82f6; color: #3b82f6; transition: all 0.2s; background: transparent;">
                                <i class="bi bi-arrow-counterclockwise" style="font-size: 1.1rem;"></i> Reset
                            </a>
                            <button type="submit" class="btn btn-primary fw-medium px-4 d-flex align-items-center justify-content-center gap-2" style="height: 48px; border-radius: 8px; font-size: 0.9rem; background-color: #3b82f6; border-color: #3b82f6; transition: all 0.2s; flex-grow: 1;">
                                <i class="bi bi-search" style="font-size: 1rem;"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

        @if (!empty($user_id))
            <div class="text-end mb-3">
                <a href="{{ url('project/add_project?uid=' . $user_id) }}">
                    <button type="button" class="btn btn-sm btn-success">Add Project</button>
                </a>
            </div>
        @endif

        <div class="row" id="main_table">
            @if ($project->count() > 0)
                @foreach ($project as $proj)
                    <article class="col-lg-4 col-sm-6 mb-4">
                        <div class="custom-prop-card">
                            <div class="prop-card-img-wrapper">
                                @php
                                    $defaultImage = asset(config('constants.NO_IMAGE_PROPERTY'));
                                    $imageToShow = $defaultImage;
                                    if ($proj->gallery->count() > 0) {
                                        $firstImage = null;
                                        $exteriorGallery = $proj->gallery->firstWhere('image_type', 'exterior');
                                        if ($exteriorGallery && $exteriorGallery->images->count() > 0) {
                                            $firstImage = $exteriorGallery->images->first();
                                        }

                                        if (!$firstImage || !isset($firstImage->filename)) {
                                            foreach ($proj->gallery as $gallery) {
                                                if ($gallery->images->count() > 0) {
                                                    $imgCandidate = $gallery->images->first();
                                                    if ($imgCandidate && isset($imgCandidate->filename)) {
                                                        $firstImage = $imgCandidate;
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if ($firstImage && isset($firstImage->filename)) {
                                            $relativePath = 'user_upload/project_images/' . $firstImage->filename;
                                            $localPath = public_path($relativePath);
                                            if (file_exists($localPath)) {
                                                $imageToShow = asset($relativePath);
                                            }
                                        }
                                    }
                                @endphp
                                <a href="#">
                                    <img src="{{ $imageToShow }}" alt="Project Photo" class="prop-card-img" />
                                </a>

                                <div class="prop-badges-left">
                                    <span class="prop-badge-type sale">
                                        PROJECT
                                    </span>
                                    @if($proj->is_featured)
                                    <span class="prop-badge-featured">
                                        <i class="bi bi-star-fill me-1 text-white"></i> Featured
                                    </span>
                                    @endif
                                    @if($proj->is_top)
                                    <span class="prop-badge-top">
                                        <i class="bi bi-fire me-1 text-white"></i> Top Pick
                                    </span>
                                    @endif
                                </div>

                                <div class="dropdown custom-dropdown pos-three-dots">
                                    <button class="btn btn-three-dots" type="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                        <li>
                                            <a class="dropdown-item toggle-featured-btn"
                                               href="#"
                                               data-project-id="{{ $proj->id }}"
                                               data-status="{{ $proj->is_featured ? 0 : 1 }}">
                                               @if($proj->is_featured)
                                               <i class="bi bi-check2 me-1 text-primary"></i>
                                               @endif
                                               Featured
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item toggle-top-btn"
                                               href="#"
                                               data-project-id="{{ $proj->id }}"
                                               data-status="{{ $proj->is_top ? 0 : 1 }}">
                                               @if($proj->is_top)
                                               <i class="bi bi-check2 me-1 text-primary"></i>
                                               @endif
                                               Top
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div class="prop-card-body">
                                <div class="prop-price-row mb-2">
                                    <h4 class="prop-title mb-0" style="height: auto; max-width: 75%;">
                                        <a href="{{ url('project/edit') }}/{{ $proj->id }}" title="{{ $proj->project_name }}">{{ $proj->project_name }}</a>
                                    </h4>
                                    <a href="{{ url('/enquiry/project-leads/' . $proj->id) }}" class="prop-leads-badge-new" title="View Leads">
                                        <i class="bi bi-eye text-primary me-1 fs-5"></i>
                                        <span class="prop-leads-count-new">{{ projectLeadsCount($proj->id) }}</span>
                                    </a>
                                </div>

                                <div class="prop-info-list">
                                    <div class="prop-info-item" title="{{ $proj->location?->address }}">
                                        <i class="ri-map-pin-line"></i>
                                        <span class="text-truncate" style="max-width: 100%;">{{ $proj->location?->address }}</span>
                                    </div>
                                    <div class="prop-info-item">
                                        <i class="ri-calendar-line"></i>
                                        <span>{{ $proj->created_at->format('Y-m-d') }}</span>
                                    </div>
                                </div>

                                <div class="project-amenity-buttons">
                                    <button class="btn btn-action-pill btn-outline-warning-pill"
                                        onclick="addAmenity(`{{ $proj->id }}`)">
                                        <i class="bi bi-plus-lg me-1"></i> Amenity
                                    </button>

                                    <button type="button" onclick="addProperty(`{{ $proj->id }}`)"
                                        class="btn btn-action-pill btn-outline-primary-pill">
                                        <i class="bi bi-plus-lg me-1"></i> Property
                                    </button>

                                    <button onclick="addFloorConfig(`{{ $proj->id }}`)"
                                        class="btn btn-action-pill btn-outline-success-pill">
                                        <i class="bi bi-plus-lg me-1"></i> Floor Data
                                    </button>

                                    <button class="btn btn-action-pill btn-outline-primary-pill"
                                        onclick="AddCertificate(`{{ $proj->id }}`)">
                                        <i class="bi bi-plus-lg me-1"></i> Certificate
                                    </button>

                                    <button class="btn btn-action-pill btn-outline-danger-pill"
                                        onclick="openBrochureModal(`{{ $proj->id }}`)">
                                        <i class="bi bi-upload me-1"></i> Brochure
                                    </button>
                                </div>

                                <div class="prop-card-footer">
                                    <div class="prop-actions">
                                        <div class="dropdown custom-dropdown">
                                            <button class="btn btn-actions dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="bi bi-sliders2 me-1"></i> Actions <i class="bi bi-chevron-down ms-1 fs-7"></i>
                                            </button>
                                            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                                @foreach ($statusMapping as $k => $val)
                                                <li>
                                                    <a class="dropdown-item change-status-btn {{ $proj->status == $k ? 'active' : '' }}"
                                                       href="#"
                                                       data-project-id="{{ $proj->id }}"
                                                       data-status="{{ $val }}">
                                                       @if($proj->status == $k)
                                                       <i class="bi bi-check2 me-1 text-primary"></i>
                                                       @endif
                                                       {{ ucfirst(strtolower($val)) }}
                                                    </a>
                                                </li>
                                                @endforeach
                                                <li>
                                                    <a class="dropdown-item change-status-btn text-danger"
                                                       href="#"
                                                       data-project-id="{{ $proj->id }}"
                                                       data-status="delete">
                                                       Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        <a href="{{ url('project/edit/' . $proj->id) }}" class="btn btn-edit-view">
                                            <i class="bi bi-pencil-square me-1"></i> Edit and View
                                        </a>
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
                                    <input class="form-check-input amenity-checkbox" type="checkbox"
                                        value="{{ $projectAmenitie->id }}">
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

    <div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-lg-down" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Property Configuration</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                    <div id="tower-container-modal"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="propertySaveButton">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="floorModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Floor Data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" id="propertyTabs" role="tablist"></ul>
                    <div class="tab-content mt-3" id="propertyTabsContent"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="saveAllButton" class="btn btn-primary">Save All</button>
                </div>
            </div>
        </div>
    </div>

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
                            <input type="text" class="form-control" name="certificate_name"
                                placeholder="Enter Document Name">
                            <label class="form-label">Document Name</label>
                            <div class="invalid-feedback"></div>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" name="certificate_number"
                                placeholder="Enter Registration Number">
                            <label class="form-label">Registration Number</label>
                            <div class="invalid-feedback"></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Upload File</label>
                            <input type="file" id="file" name="file" class="form-control mb-2">
                            <input type="hidden" id="fileName" name="fileName" class="form-control">
                            <div class="invalid-feedback"></div>
                            <div id="fileUploadContainer" style="display: none;">
                                <a id="uploadedFileLink" href="#" target="_blank" class="small">View Uploaded
                                    File</a>
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
@endsection
@push('custom-js')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
        });
    </script>
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

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

        function addAmenity(projectId) {
            $('#project_id').val(projectId);
            getAmenities(projectId);
            $('#amenityModal').modal('show');
        }

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
                    location.reload();
                },
                error: function(xhr) {
                    console.error("Error saving amenities:", xhr.responseText);
                }
            });
        }

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

        $(document).on('click', '.toggle-featured-btn', function(e) {
            e.preventDefault();
            let projectId = $(this).data('project-id');
            let status = $(this).data('status');
            $.ajax({
                type: 'POST',
                url: `{{ url('allproject/feature_status') }}`,
                data: {
                    id: projectId,
                    status: status,
                    _token: '{{ csrf_token() }}'
                },
                success: function(data) {
                    location.reload();
                }
            });
        });

        $(document).on('click', '.toggle-top-btn', function(e) {
            e.preventDefault();
            let projectId = $(this).data('project-id');
            let status = $(this).data('status');
            $.ajax({
                type: 'POST',
                url: `{{ url('allproject/top_status') }}`,
                data: {
                    id: projectId,
                    status: status,
                    _token: '{{ csrf_token() }}'
                },
                success: function(data) {
                    location.reload();
                }
            });
        });

        $(document).on('click', '.change-status-btn', function(e) {
            e.preventDefault();
            let projectId = $(this).data('project-id');
            let status = $(this).data('status');

            if (status === 'delete') {
                common_delete_confirm(function() {
                    $.ajax({
                        type: 'POST',
                        url: `{{ url('allproject/delete') }}`,
                        data: {
                            id: projectId,
                            status: status,
                            _token: '{{ csrf_token() }}'
                        },
                        success: function(data) {
                            location.reload();
                        },
                        error: function(xhr) {
                            console.error("Error updating status:", xhr.responseText);
                        }
                    });
                }, 'Delete Project?', 'Are you sure you want to delete this project?');
            } else {
                $.ajax({
                    type: 'POST',
                    url: `{{ url('allproject/statusupdate') }}`,
                    data: {
                        id: projectId,
                        status: status,
                        _token: '{{ csrf_token() }}'
                    },
                    success: function(data) {
                        location.reload();
                    },
                    error: function(xhr) {
                        console.error("Error updating status:", xhr.responseText);
                    }
                });
            }
        });
    </script>

    <script>
        document.getElementById('addPropertyBtn')?.addEventListener('click', addProperty);

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

                    let towersData = response.towers_data || [];
                    const totalTowers = response.total_towers || towersData.length;
                    const modalContainer = document.getElementById("tower-container-modal");
                    modalContainer.innerHTML = "";

                    for (let i = 0; i < totalTowers; i++) {
                        let towerData = towersData[i] || {};
                        createTower(towerData, i + 1, modalContainer, project_id);
                    }

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
            <input class="form-control" name="slug" type="hidden" value="${towerData.slug??slug}">
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="lift_no" placeholder="" value="${towerData.lift_no ?? ''}">
                    <label>Lift Number</label>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="stair_no" placeholder="" value="${towerData.stair_no ?? ''}">
                    <label>Stair Number</label>
                </div>
            </div>
            <div class="col-lg-3 col-sm-6">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="fire_safety" placeholder="" value="${towerData.fire_safety ?? ''}">
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
            floor.classList.add("border", "p-3", "mb-3", "position-relative", "floor-fieldset");

            floor.innerHTML =
                `<legend class="float-none w-auto px-2 small fw-bold floor-legend">
                    Floor ${floorIndex}
                    <button type="button" class="btn btn-link text-danger remove-floor p-0 ms-3 text-decoration-none small" style="font-size: 11px; vertical-align: baseline;">
                        <i class="bi bi-trash3 me-1"></i>Remove
                    </button>
                </legend>
        <div class="row gx-3">
            <input type="hidden" class="floor_id" value="${floorData ? floorData.floor_id : ''}">
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

            if (floorData && floorData.bhk_configurations) {
                floorData.bhk_configurations.forEach((bhk, bhkIndex) => {
                    createBHK(bhkContainer, bhkIndex + 1, bhk);
                });
            }
            floor.querySelector(".remove-floor").addEventListener("click", function() {
                if (confirm("Are you sure you want to remove this floor and all its flat configurations?")) {
                    floor.remove();
                    reindexLabels(floorContainer, '.floor-fieldset', '.floor-legend', 'Floor');
                }
            });

            floor.querySelector(".add-bhk").addEventListener("click", function() {
                createBHK(bhkContainer, bhkContainer.children.length + 1);
            });
        }

        function createBHK(bhkContainer, bhkIndex, bhkData = null) {
            console.log(bhkData);
            const bhk = document.createElement("div");
            bhk.classList.add("mb-3", "position-relative", "bhk-item");
            bhk.innerHTML =
                `<fieldset class="position-relative border p-3">
                <legend class="float-none w-auto px-2 small bhk-legend">
                    Flats ${bhkIndex}
                    <button type="button" class="btn btn-link text-danger remove-bhk p-0 ms-3 text-decoration-none small" style="font-size: 11px; vertical-align: baseline;">
                        <i class="bi bi-trash3 me-1"></i>Remove
                    </button>
                </legend>
            <div class="row gx-3">
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
                <input type="hidden" class="property_id" value="${bhkData ? bhkData.property_id : ''}">
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
                    tower_name: towerElement.querySelector('input[name="tower_name"]')?.value || '',
                    slug: towerElement.querySelector('input[name="slug"]')?.value || '',
                    lift_no: towerElement.querySelector('input[name="lift_no"]')?.value || '',
                    stair_no: towerElement.querySelector('input[name="stair_no"]')?.value || '',
                    fire_safety: towerElement.querySelector('input[name="fire_safety"]')?.value || '',
                    floor_data: []
                };

                towerElement.querySelectorAll('.floor-container').forEach((floorElement) => {
                    const floorNoInput = floorElement.querySelector('input[name="floor_no"]');
                    const flatNoInput = floorElement.querySelector('input[name="flat_no"]');

                    if (!floorNoInput || !flatNoInput) return;

                    const floorData = {
                        floor_no: floorNoInput.value,
                        flat_no: flatNoInput.value,
                        bhk_configurations: []
                    };

                    floorElement.querySelectorAll('.bhk-container > div').forEach((bhkElement) => {
                        const bhkTypeSelect = bhkElement.querySelector('select');
                        const numberInputs = bhkElement.querySelectorAll('input[type="number"]');
                        const facingSelect = bhkElement.querySelectorAll('select')[1];
                        const floorPlanInput = bhkElement.querySelector('.floor_plan_image_name');

                        if (!bhkTypeSelect || numberInputs.length < 3 || !facingSelect) return;

                        const bhkData = {
                            bhk_type: bhkTypeSelect.value,
                            carpet_area: numberInputs[0].value,
                            super_area: numberInputs[1].value,
                            property_price: numberInputs[2].value,
                            property_facing: facingSelect.value,
                            floor_plan_image: floorPlanInput ? floorPlanInput.value : ''
                        };

                        floorData.bhk_configurations.push(bhkData);
                    });

                    if (floorData.bhk_configurations.length > 0) {
                        towerData.floor_data.push(floorData);
                    }
                });

                if (towerData.floor_data.length > 0) {
                    towers.push(towerData);
                }
            });

            return towers;
        }

        document.getElementById('propertySaveButton')?.addEventListener('click', function() {
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
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                }
            });

        });
    </script>

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

                    tabsContainer.innerHTML = "";
                    contentContainer.innerHTML = "";

                    response.data.floor_plan_types.forEach((type, index) => {
                        let isActive = index === 0 ? "active" : "";

                        let tabButton = `
                            <li class="nav-item" role="presentation">
                                <button class="nav-link ${isActive}" id="${type.slug}-tab" 
                                    data-bs-toggle="tab" data-bs-target="#${type.slug}" type="button" role="tab">
                                    ${type.name}
                                </button>
                            </li>
                        `;
                        tabsContainer.innerHTML += tabButton;

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
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                    alert("Error saving data.");
                }
            });
        }
    </script>

    <script>
        let certificateModalInstance;

        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("file")?.addEventListener("change", function() {
                let projectId = document.getElementById("saveDocumentBtn")?.dataset.projectId;
                if (projectId) uploadFile(projectId);
            });
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
            document.getElementById("saveCertificate")?.reset();
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
                        toastr.success(data.message, 'Success', toastrOptions);
                        certificateModalInstance.hide();
                        location.reload();
                    } else {
                        toastr.error(data.message || 'Something went wrong', 'Error', toastrOptions);
                        saveButton.disabled = false;
                        saveButton.textContent = "Save Document";
                    }
                })
                .catch(error => {
                    console.error("Save Error:", error);
                    alert("An error occurred while saving.");
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
                    if (data.status === 1 && Array.isArray(data.data)) {
                        renderProjectCertificates(data.data);
                    } else {
                        renderProjectCertificates([]);
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
            previewContainer.innerHTML = "";

            let fileURL = URL.createObjectURL(file);
            let fileType = file.type;

            if (fileType.includes("pdf")) {
                previewContainer.innerHTML = `<iframe src="${fileURL}" width="100%" height="300px"></iframe>`;
            } else if (fileType.includes("image")) {
                previewContainer.innerHTML = `<img src="${fileURL}" width="100%" class="img-thumbnail">`;
            } else {
                alert("Invalid file type. Please select a PDF or image.");
                event.target.value = "";
            }
        });

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
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
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
@endpush
