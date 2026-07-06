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
<style>
    /* 2026 Amenity Modal Design */
    #amenityModal .modal-content {
        border-radius: 16px;
        border: none;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    #amenityModal .modal-header {
        border-bottom: none;
        padding: 1.5rem 1.5rem 1rem;
        align-items: center;
        background: #ffffff !important; /* Force white background to override default theme grey */
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
    }
    #amenityModal .modal-title-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    #amenityModal .modal-title-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        color: #0f172a; /* Match the title color */
    }
    #amenityModal .modal-title {
        font-weight: 700;
        font-size: 1.25rem;
        color: #0f172a;
    }
    #amenityModal .info-alert {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #334155;
        font-size: 0.9rem;
        margin: 0 1.5rem 1rem;
    }
    #amenityModal .info-alert i {
        color: #2563eb;
        font-size: 1.1rem;
    }
    #amenityModal .controls-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1.5rem 1.5rem;
        gap: 1rem;
    }
    #amenityModal .search-input {
        flex-grow: 1;
        max-width: 300px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        font-size: 0.9rem;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%2394a3b8" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>') no-repeat 0.75rem center;
        background-color: #fff;
    }
    #amenityModal .search-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    #amenityModal .select-all-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #475569;
        font-size: 0.9rem;
        cursor: pointer;
    }
    #amenityModal .amenity-grid {
        padding: 0 0.5rem;
        margin-bottom: 1rem;
    }
    #amenityModal .amenity-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid #f1f5f9;
        cursor: pointer;
        width: 100%;
    }
    #amenityModal .amenity-item:hover { background: #f8fafc; border-radius: 8px; border-bottom-color: transparent; }
    #amenityModal .form-check-input {
        width: 1.25rem;
        height: 1.25rem;
        margin-top: 0;
        cursor: pointer;
        border-color: #cbd5e1;
    }
    #amenityModal .form-check-input:checked {
        background-color: #2563eb;
        border-color: #2563eb;
    }
    #amenityModal .amenity-icon-box {
        width: 36px;
        height: 36px;
        background: #eff6ff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0.75rem;
    }
    #amenityModal .amenity-icon-box img {
        width: 20px;
        height: 20px;
        object-fit: contain;
    }
    #amenityModal .amenity-label {
        font-size: 0.95rem;
        color: #334155;
        font-weight: 500;
        user-select: none;
    }
    #amenityModal .modal-footer {
        border-top: none;
        padding: 1rem 1.5rem 1.5rem;
        justify-content: space-between;
    }
    #amenityModal .btn-cancel {
        background: #fff;
        border: 1px solid #cbd5e1;
        color: #475569;
        font-weight: 600;
        padding: 0.6rem 1.5rem;
        border-radius: 8px;
    }
    #amenityModal .btn-cancel:hover { background: #f1f5f9; }
    #amenityModal .btn-save {
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        padding: 0.6rem 2rem;
        border-radius: 8px;
        border: none;
    }
    #amenityModal .btn-save:hover { background: #1d4ed8; }
</style>

    <div class="modal fade" id="amenityModal" tabindex="-1" aria-labelledby="amenityModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-fullscreen-lg-down" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title-box">
                        <div class="modal-title-icon">
                            <i class="bi bi-buildings"></i>
                        </div>
                        <h5 class="modal-title" id="amenityModalLabel">Add Amenity Data</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                
                <div class="info-alert">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>Select the amenities available in this property.</span>
                </div>

                <div class="controls-row">
                    <input type="text" id="searchAmenity" class="search-input" placeholder="Search amenities...">
                    <label class="select-all-box">
                        <input type="checkbox" id="selectAllAmenities" class="form-check-input">
                        Select All
                    </label>
                </div>

                <div class="modal-body amenity-container" style="padding-top: 0;">
                    <input type="hidden" name="project_id" id="project_id">

                    <div class="row amenity-grid" id="amenityGrid">
                        @foreach ($projectAmenities as $projectAmenitie)
                            <article class="col-xxl-4 col-xl-4 col-md-6 col-12 amenity-card">
                                <label class="amenity-item">
                                    <input class="form-check-input amenity-checkbox" type="checkbox"
                                        value="{{ $projectAmenitie->id }}">
                                    <div class="amenity-icon-box">
                                        <img alt="Amenity" 
                                            src="{{ asset('user_upload/amenity_image/' . $projectAmenitie->image) }}">
                                    </div>
                                    <span class="amenity-label amenity-name">{{ $projectAmenitie->name }}</span>
                                </label>
                            </article>
                        @endforeach
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-save" id="saveAmenityBtn">Save</button>
                </div>
            </div>
        </div>
    </div>

    <!-- JS for Amenity Search and Select All -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchAmenity');
            const selectAllCheck = document.getElementById('selectAllAmenities');
            
            if(searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const term = e.target.value.toLowerCase();
                    const cards = document.querySelectorAll('.amenity-card');
                    cards.forEach(card => {
                        const name = card.querySelector('.amenity-name').textContent.toLowerCase();
                        if(name.includes(term)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }
            
            if(selectAllCheck) {
                selectAllCheck.addEventListener('change', function(e) {
                    const isChecked = e.target.checked;
                    // Only select checkboxes that are currently visible (matching search)
                    const visibleCards = document.querySelectorAll('.amenity-card[style*="display: block"], .amenity-card:not([style*="display: none"])');
                    visibleCards.forEach(card => {
                        const cb = card.querySelector('.amenity-checkbox');
                        if(cb) cb.checked = isChecked;
                    });
                });
            }
        });
    </script>

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

    <style>
    /* Floor Data Modal */
    #floorModal .modal-content { border-radius: 16px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.12); }
    #floorModal .modal-header { border-bottom: 1px solid #f1f5f9; padding: 1.25rem 1.5rem; background: #fff; border-top-left-radius: 16px; border-top-right-radius: 16px; }
    #floorModal .modal-title { font-weight: 700; font-size: 1.2rem; color: #0f172a; }
    #floorModal .modal-body { padding: 1.5rem; background: #fff; }
    #floorModal .modal-footer { border-top: 1px solid #f1f5f9; padding: 1rem 1.5rem; background: #fff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; justify-content: flex-end; }
    #floorModal .modal-footer .btn-save-all { background: #2563eb; color: #fff; font-weight: 600; padding: 0.55rem 1.8rem; border-radius: 8px; border: none; font-size: 0.95rem; }
    #floorModal .modal-footer .btn-save-all:hover { background: #1d4ed8; }

    /* Tab Nav with scroll arrows */
    .floor-tabs-wrapper { display: flex; align-items: center; gap: 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 1.5rem; }
    .floor-tab-scroll-btn { background: none; border: none; color: #64748b; padding: 0.4rem 0.5rem; cursor: pointer; flex-shrink: 0; font-size: 1rem; line-height: 1; display: flex; align-items: center; }
    .floor-tab-scroll-btn:hover { color: #2563eb; }
    .floor-tabs-scroll { overflow: hidden; flex: 1; }
    #propertyTabs { display: flex; flex-wrap: nowrap; gap: 0; list-style: none; padding: 0; margin: 0; }
    #propertyTabs .nav-item { flex-shrink: 0; }
    #propertyTabs .nav-link {
        background: none; border: none; border-bottom: 3px solid transparent;
        padding: 0.65rem 1.1rem; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.04em;
        color: #94a3b8; cursor: pointer; white-space: nowrap; text-transform: uppercase;
        transition: color 0.2s, border-color 0.2s;
    }
    #propertyTabs .nav-link:hover { color: #2563eb; }
    #propertyTabs .nav-link.active { color: #2563eb; border-bottom-color: #2563eb; }

    /* Floor form fields */
    .floor-field-group { margin-bottom: 1.1rem; }
    .floor-field-label { font-size: 0.88rem; font-weight: 600; color: #334155; margin-bottom: 0.35rem; display: block; }
    .floor-field-input {
        width: 100%; border: 1px solid #e2e8f0; border-radius: 8px;
        padding: 0.7rem 1rem; font-size: 0.95rem; color: #0f172a;
        transition: border-color 0.2s, box-shadow 0.2s; background: #fff; resize: none;
    }
    .floor-field-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .floor-field-input::placeholder { color: #94a3b8; }
    </style>

    <div class="modal fade" id="floorModal" tabindex="-1" aria-labelledby="floorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="floorModalLabel">Floor Data</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="floor-tabs-wrapper">
                        <button class="floor-tab-scroll-btn" id="floorTabPrev" onclick="scrollFloorTabs(-1)">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <div class="floor-tabs-scroll">
                            <ul class="nav" id="propertyTabs" role="tablist"></ul>
                        </div>
                        <button class="floor-tab-scroll-btn" id="floorTabNext" onclick="scrollFloorTabs(1)">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <div class="tab-content" id="propertyTabsContent"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" id="saveAllButton" class="btn-save-all">Save All</button>
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

    <style>
    /* 2026 Property Config Design */
    #propertyModal .modal-content { border-radius: 16px; border: none; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
    #propertyModal .modal-header { border-bottom: 1px solid #f1f5f9; padding: 1.5rem; background: #fff !important; border-top-left-radius: 16px; border-top-right-radius: 16px; }
    #propertyModal .modal-title { font-weight: 700; font-size: 1.25rem; color: #0f172a; }
    #propertyModal .modal-body { padding: 1.5rem; background: #f8fafc; }
    #propertyModal .modal-footer { border-top: 1px solid #f1f5f9; padding: 1rem 1.5rem; background: #fff; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; justify-content: flex-end; gap: 1rem; }
    #propertyModal .modal-footer .btn-secondary { background: #fff; border: 1px solid #cbd5e1; color: #475569; font-weight: 600; padding: 0.6rem 1.5rem; border-radius: 8px; }
    #propertyModal .modal-footer .btn-primary { background: #2563eb; color: #fff; font-weight: 600; padding: 0.6rem 2rem; border-radius: 8px; border: none; }

    /* Tower Card */
    .prop-tower-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; overflow: hidden; }
    .prop-tower-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; user-select: none; }
    .prop-tower-header-left { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; color: #0f172a; font-size: 1.05rem; }
    .prop-tower-header-left i { color: #475569; font-size: 1.2rem; }
    .prop-tower-body { padding: 1.5rem; }

    /* Floor Card */
    .prop-floor-card { border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 1.5rem; }
    .prop-floor-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; border-top-left-radius: 12px; border-top-right-radius: 12px; cursor: pointer; user-select: none; }
    .prop-floor-header-left { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #334155; }
    .prop-floor-header-left i { color: #64748b; font-size: 1.1rem; }
    .prop-floor-body { padding: 1.25rem; background: #fff; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
    .btn-delete-floor { color: #ef4444; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 0.3rem; padding: 0; }
    .btn-delete-floor:hover { color: #dc2626; }

    /* Form Elements */
    .prop-form-group { margin-bottom: 1rem; }
    .prop-form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.4rem; }
    .prop-form-control { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.6rem 0.8rem; font-size: 0.95rem; color: #334155; transition: border-color 0.2s; }
    .prop-form-control:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .prop-form-select { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.6rem 0.8rem; font-size: 0.95rem; color: #334155; appearance: none; background: #fff url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%2364748b" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>') no-repeat right 0.8rem center; }

    /* File Upload */
    .prop-file-upload { border: 1px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; padding: 0.4rem 0.5rem; gap: 0.5rem; background: #f8fafc; }
    .prop-file-btn { background: #eff6ff; color: #2563eb; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; }
    .prop-file-text { font-size: 0.85rem; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Buttons */
    .btn-add-bhk { border: 1px solid #3b82f6; color: #3b82f6; background: #fff; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
    .btn-add-bhk:hover { background: #eff6ff; }
    .btn-add-floor { background: #2563eb; color: #fff; border: none; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; }
    .btn-add-floor:hover { background: #1d4ed8; }

    /* BHK Card */
    .bhk-card { border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 0.75rem; overflow: hidden; }
    .bhk-card-header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .bhk-card-title { font-size: 0.9rem; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 0.4rem; }
    .bhk-card-title i { color: #2563eb; }
    .bhk-card-body { padding: 1rem; background: #fff; }
    .btn-remove-bhk { background: none; border: none; color: #ef4444; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem; border-radius: 5px; }
    .btn-remove-bhk:hover { background: #fef2f2; }

    /* Prefix Input (₹) */
    .prop-input-prefix { position: relative; display: flex; align-items: center; }
    .prop-input-prefix .prefix-icon { position: absolute; left: 10px; color: #64748b; font-size: 0.95rem; pointer-events: none; z-index: 1; }
    .prop-input-prefix .prop-form-control { padding-left: 1.8rem; }
    </style>

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
            tower.classList.add("prop-tower-card", "tower-item");
            $('#propertySaveButton').val(project_id);
            let slug = 'tower' + towerIndex;
            tower.innerHTML = `
        <div class="prop-tower-header" onclick="const b = this.nextElementSibling; b.style.display = b.style.display === 'none' ? 'block' : 'none'; const i = this.querySelector('.bi-chevron-down, .bi-chevron-up'); if(i) { i.classList.toggle('bi-chevron-down'); i.classList.toggle('bi-chevron-up'); }">
            <div class="prop-tower-header-left">
                <i class="bi bi-building"></i> Tower ${towerIndex}
            </div>
            <i class="bi bi-chevron-up text-secondary"></i>
        </div>
        <div class="prop-tower-body">
            <input class="form-control" name="project_id" type="hidden" value="${project_id}">
            <input class="form-control" name="slug" type="hidden" value="${towerData.slug??slug}">
            <div class="row gx-3 mb-3">
                <div class="col-lg-3 col-sm-6 prop-form-group">
                    <label>Tower Name</label>
                    <input type="text" class="prop-form-control" name="tower_name" placeholder="Enter tower name" value="${towerData.tower_name??''}">
                </div>
                <div class="col-lg-3 col-sm-6 prop-form-group">
                    <label>Lift Number</label>
                    <input type="number" class="prop-form-control" name="lift_no" placeholder="Enter lift number" value="${towerData.lift_no ?? ''}">
                </div>
                <div class="col-lg-3 col-sm-6 prop-form-group">
                    <label>Stair Number</label>
                    <input type="number" class="prop-form-control" name="stair_no" placeholder="Enter stair number" value="${towerData.stair_no ?? ''}">
                </div>
                <div class="col-lg-3 col-sm-6 prop-form-group">
                    <label>Fire Safety</label>
                    <input type="text" class="prop-form-control" name="fire_safety" placeholder="Enter fire safety" value="${towerData.fire_safety ?? ''}">
                </div>
            </div>
            <div class="floor-container"></div>
            <button type="button" class="btn-add-floor add-floor"><i class="bi bi-plus"></i> Add Floor</button>
        </div>`;

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
            const floor = document.createElement("div");
            floor.classList.add("prop-floor-card", "floor-fieldset");

            floor.innerHTML = `
        <div class="prop-floor-header" onclick="if(event.target.closest('.remove-floor')) return; const b = this.nextElementSibling; b.style.display = b.style.display === 'none' ? 'block' : 'none'; const i = this.querySelector('.bi-chevron-down, .bi-chevron-up'); if(i) { i.classList.toggle('bi-chevron-down'); i.classList.toggle('bi-chevron-up'); }">
            <div class="prop-floor-header-left">
                <i class="bi bi-layers"></i> <span class="floor-legend">Floor ${floorIndex}</span>
                <button type="button" class="btn btn-link btn-delete-floor remove-floor ms-3 text-decoration-none" title="Delete Floor">
                    <i class="bi bi-trash3"></i> Delete
                </button>
            </div>
            <i class="bi bi-chevron-up text-secondary"></i>
        </div>
        <div class="prop-floor-body">
            <div class="row gx-3 mb-3">
                <input type="hidden" class="floor_id" value="${floorData ? floorData.floor_id : ''}">
                <div class="col-sm-6 prop-form-group">
                    <label>Floor Number</label>
                    <input class="prop-form-control" name="floor_no" type="number" placeholder="Enter floor number" value="${floorData ? floorData.floor_no : ''}">
                </div>
                <div class="col-sm-6 prop-form-group">
                    <label>Flat Number</label>
                    <input class="prop-form-control" name="flat_no" type="number" placeholder="Enter flat number" value="${floorData ? floorData.flat_no : ''}">
                </div>
            </div>
            
            <div class="mb-2">
                <label class="d-block font-weight-bold mb-2" style="font-size: 0.95rem; font-weight: 600; color: #0f172a;">Flats</label>
                <div class="bhk-container"></div>
                <button type="button" class="btn-add-bhk add-bhk"><i class="bi bi-plus"></i> Add BHK</button>
            </div>
        </div>`;

            floorContainer.appendChild(floor);

            const bhkContainer = floor.querySelector(".bhk-container");

            if (floorData && floorData.bhk_configurations) {
                floorData.bhk_configurations.forEach((bhk, bhkIndex) => {
                    createBHK(bhkContainer, bhkIndex + 1, bhk);
                });
            }
            floor.querySelector(".remove-floor").addEventListener("click", function(e) {
                e.stopPropagation();
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
            const bhk = document.createElement("div");
            bhk.classList.add("mb-2", "bhk-item");
            bhk.innerHTML = `
            <div class="bhk-card">
                <div class="bhk-card-header">
                    <span class="bhk-card-title"><i class="bi bi-house-door"></i> Flat ${bhkIndex}</span>
                    <button type="button" class="btn-remove-bhk remove-bhk">
                        <i class="bi bi-trash3"></i> Remove
                    </button>
                </div>
                <div class="bhk-card-body">
                    <input class="form-control floor_plan_image_name" type="hidden" value="${bhkData ? bhkData.floor_plan_image : ''}" name="floor_plan_image_name">
                    <input type="hidden" class="property_id" value="${bhkData ? bhkData.property_id : ''}">
                    <div class="row gx-3">
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>BHK Type</label>
                            <select class="prop-form-select">
                                <option value="1BHK" ${bhkData && bhkData.bhk_type === '1BHK' ? 'selected' : ''}>1BHK</option>
                                <option value="2BHK" ${bhkData && bhkData.bhk_type === '2BHK' ? 'selected' : ''}>2BHK</option>
                                <option value="3BHK" ${bhkData && bhkData.bhk_type === '3BHK' ? 'selected' : ''}>3BHK</option>
                                <option value="4BHK" ${bhkData && bhkData.bhk_type === '4BHK' ? 'selected' : ''}>4BHK</option>
                                <option value="5BHK" ${bhkData && bhkData.bhk_type === '5BHK' ? 'selected' : ''}>5BHK</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>Carpet Area <small class="text-muted">(sq.ft)</small></label>
                            <input class="prop-form-control" type="number" placeholder="e.g. 800" value="${bhkData ? bhkData.carpet_area : ''}">
                        </div>
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>Super Area <small class="text-muted">(sq.ft)</small></label>
                            <input class="prop-form-control" type="number" placeholder="e.g. 1250" value="${bhkData ? bhkData.super_area : ''}">
                        </div>
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>Price</label>
                            <div class="prop-input-prefix">
                                <span class="prefix-icon">₹</span>
                                <input class="prop-form-control" type="number" placeholder="Amount" value="${bhkData ? bhkData.property_price : ''}">
                            </div>
                        </div>
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>Facing</label>
                            <select class="prop-form-select">
                                <option value="east" ${bhkData && bhkData.property_facing === 'east' ? 'selected' : ''}>East</option>
                                <option value="north" ${bhkData && bhkData.property_facing === 'north' ? 'selected' : ''}>North</option>
                                <option value="north_east" ${bhkData && bhkData.property_facing === 'north_east' ? 'selected' : ''}>North - East</option>
                                <option value="north_west" ${bhkData && bhkData.property_facing === 'north_west' ? 'selected' : ''}>North - West</option>
                                <option value="south" ${bhkData && bhkData.property_facing === 'south' ? 'selected' : ''}>South</option>
                                <option value="south_east" ${bhkData && bhkData.property_facing === 'south_east' ? 'selected' : ''}>South - East</option>
                                <option value="south_west" ${bhkData && bhkData.property_facing === 'south_west' ? 'selected' : ''}>South - West</option>
                                <option value="west" ${bhkData && bhkData.property_facing === 'west' ? 'selected' : ''}>West</option>
                            </select>
                        </div>
                        <div class="col-lg-2 col-sm-4 prop-form-group">
                            <label>Floor Image</label>
                            <div class="prop-file-upload position-relative">
                                <input class="floor-plan-input" type="file" accept="image/*" style="opacity:0;position:absolute;width:100%;height:100%;cursor:pointer;z-index:2;">
                                <div class="prop-file-btn"><i class="bi bi-cloud-arrow-up"></i></div>
                                <div class="prop-file-text preview-filename">${bhkData && bhkData.image_url ? 'Uploaded' : 'Choose file'}</div>
                            </div>
                            <img class="preview-image mt-1" src="${bhkData && bhkData.image_url ? bhkData.image_url : ''}"
                                style="max-width:80px;border-radius:6px;display:${bhkData && bhkData.image_url ? 'block' : 'none'};">
                            <button type="button" class="btn btn-link text-danger p-0 delete-floor-plan"
                                style="font-size:0.8rem;display:${bhkData && bhkData.image_url ? 'block' : 'none'};text-decoration:none;">
                                <i class="bi bi-x-circle"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;

            bhkContainer.appendChild(bhk);
            const fileInput = bhk.querySelector(".floor-plan-input");
            const previewImg = bhk.querySelector(".preview-image");
            const deleteImg = bhk.querySelector(".delete-floor-plan");
            const previewFilename = bhk.querySelector(".preview-filename");

            fileInput.addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                    previewFilename.textContent = file.name;
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
                            fileInput.closest('.bhk-item').querySelector(
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
                previewFilename.textContent = "No file chosen";

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

            document.querySelectorAll('.tower-item').forEach((towerElement) => {
                const towerData = {
                    tower_name: towerElement.querySelector('input[name="tower_name"]')?.value || '',
                    slug: towerElement.querySelector('input[name="slug"]')?.value || '',
                    lift_no: towerElement.querySelector('input[name="lift_no"]')?.value || '',
                    stair_no: towerElement.querySelector('input[name="stair_no"]')?.value || '',
                    fire_safety: towerElement.querySelector('input[name="fire_safety"]')?.value || '',
                    floor_data: []
                };

                // FIX: Look specifically for '.floor-fieldset' which are the individual floors
                towerElement.querySelectorAll('.floor-fieldset').forEach((floorElement) => {
                    const floorNoInput = floorElement.querySelector('input[name="floor_no"]');
                    const flatNoInput = floorElement.querySelector('input[name="flat_no"]');

                    if (!floorNoInput || !flatNoInput) return;

                    const floorData = {
                        floor_no: floorNoInput.value,
                        flat_no: flatNoInput.value,
                        bhk_configurations: []
                    };

                    floorElement.querySelectorAll('.bhk-item').forEach((bhkElement) => {
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
                            <div class="floor-field-group">
                                <label class="floor-field-label">${item.item}:</label>
                                <textarea class="floor-field-input item-input" rows="2"
                                    placeholder="Enter ${item.item.toLowerCase()} details"
                                    data-item-id="${item.item_id}"
                                    data-type-id="${type.id}">${item.description ? item.description : ''}</textarea>
                            </div>
                        `).join("");

                        let tabContent = `
                            <div class="tab-pane fade ${isActive ? "show active" : ""}" id="${type.slug}" role="tabpanel">
                                ${itemsHtml}
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

        function scrollFloorTabs(direction) {
            const scrollEl = document.querySelector('.floor-tabs-scroll');
            if (scrollEl) scrollEl.scrollLeft += direction * 150;
        }

        function saveAllFloorPlans(project_id) {
            let floorData = [];

            document.querySelectorAll(".tab-pane").forEach(tab => {
                tab.querySelectorAll(".item-input").forEach(input => {
                    let item_id = input.getAttribute("data-item-id");
                    let type_id = input.getAttribute("data-type-id");
                    let item_name = input.closest(".floor-field-group")?.querySelector(".floor-field-label")?.innerText?.replace(":", "").trim() 
                                    || input.closest(".form-floating")?.querySelector("label")?.innerText?.replace(":", "").trim() 
                                    || "Unknown";
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
