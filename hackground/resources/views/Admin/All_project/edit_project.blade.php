@extends('Admin.layouts.app')
@push('custom-css')
<link rel="stylesheet" href="{{ asset('assets/dist/css/adminlte.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">

<style>
  #ed-nav {
    white-space: nowrap;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .dropdown-container {
    display: flex;
    gap: 10px;
  }

  .dropdown {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .image-caption {
    font-size: 14px;
    color: #333;
    margin-top: 5px;
    white-space: nowrap;
  }

  /* ── Photo page ── */
  .photo-tab-pill { display: inline-flex; align-items: center; gap: 6px; padding: 0.45rem 0.9rem; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
  .photo-tab-pill.active { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,.25); }
  .photo-tab-pill:not(.active):hover { background: #f1f5f9; border-color: #cbd5e1; color: #334155; }
  .photo-tab-pill i { font-size: 0.95rem; }
  .photo-tabs-wrapper { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
  .photo-tabs-wrapper::-webkit-scrollbar { display: none; }

  /* Gallery grid */
  .gallery-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 4/3; background: #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,.08); transition: transform .2s, box-shadow .2s; }
  .gallery-item:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.13); }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .gallery-item .gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background .2s; display: flex; align-items: flex-start; justify-content: space-between; padding: 7px; }
  .gallery-item:hover .gallery-overlay { background: rgba(0,0,0,0.28); }
  .gallery-item .badge-featured { background: #2563eb; color: #fff; font-size: 0.63rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: .3px; }
  .gallery-item .file-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,.7), transparent); color: #fff; font-size: 0.65rem; padding: 12px 7px 5px; display: flex; align-items: center; gap: 3px; }
  .btn-delete { background: #fee2e2; color: #ef4444; border: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer; transition: all .2s; opacity: 0; transform: scale(0.8); }
  .gallery-item:hover .btn-delete { opacity: 1; transform: scale(1); }
  .btn-delete:hover { background: #ef4444; color: #fff; transform: scale(1.1) !important; }
</style>


@endpush
@section('content')

<div class="app-main__inner mb-3">

    {{-- Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <i class="bi bi-buildings fs-4"></i>
            </div>
            <div>
                <h4 class="mb-1 fw-bold">Project Edit</h4>
                <div class="text-muted small fw-medium">Project Setting &gt; Project Edit</div>
            </div>
        </div>
        <div class="text-muted small fw-medium">
            <a href="{{ url('/') }}" class="text-decoration-none text-primary">Home</a> &gt; Project Edit
        </div>
    </div>

    <div class="row">
        <div class="col-lg-8 col-xl-9">
            {{-- Tabs & Back --}}
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <ul class="nav nav-underline border-0" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link fw-bold {{ request('tab') == 'project-details' || !request('tab') ? 'active text-primary' : 'text-muted' }}" 
                           href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'project-details']) }}">
                            Project Details
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-bold {{ request('tab') == 'project-photos' ? 'active text-primary' : 'text-muted' }}" 
                           href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'project-photos']) }}">
                            Project Photos
                        </a>
                    </li>
                </ul>
                <a href="{{ url('allproject/all-project-view') }}" class="btn btn-light border shadow-sm btn-sm fw-medium rounded-3 px-3 py-2 d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-left"></i> Back to List
                </a>
            </div>

            <div class="tab-content">


      <!-- Property Details Tab -->
      <div class="tab-pane fade {{ request('tab') == 'project-details' || !request('tab') ? 'show active' : '' }}"
        id="project-details" role="tabpanel">
        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
  <h5 class="fw-bold mb-0">
     <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
         <i class="bi bi-card-text"></i>
     </div>
     Basic Details
  </h5>
  <button class="btn btn-sm d-flex align-items-center gap-2 fw-semibold" onclick="edit_project_modal(1, <?php echo $projectData->id ?>,'Basic')" style="border: 1.5px solid #e2e8f0; border-radius: 8px; color: #475569; background: #fff; padding: 0.35rem 0.85rem; transition: all .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
     <i class="bi bi-pencil" style="font-size:.85rem;"></i> Edit
  </button>
</div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Post For</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{ucfirst($projectData->settings->post_for)??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Project Type</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{get_name_by_id('property_category_names','category_id',$projectData->settings->project_type,'en')??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Developer Name</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->additional->developer_name??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Developer Experience</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->additional->developer_experience . ' Yr'??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Developer Details</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{ Str::limit($projectData->additional->developer_details ?? 'N/A', 10) }}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Price</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->additional->expected_price??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Token Amount</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->additional->token_amount??'N/A'}}
    </div>
</div>

              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Instruction</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->additional->instruction??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Address</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->location->address??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Locality</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{get_name_by_id('locality_names', 'locality_id', $projectData->location->locality, 'en')  ?? 'N/A' }}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Project/Society Name</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->project_name??'N/A'}}
    </div>
</div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
  <h5 class="fw-bold mb-0">
     <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
         <i class="bi bi-list-check"></i>
     </div>
     Project Features
  </h5>
  <button class="btn btn-sm d-flex align-items-center gap-2 fw-semibold" onclick="edit_project_modal(2, <?php echo $projectData->id ?>,'Features')" style="border: 1.5px solid #e2e8f0; border-radius: 8px; color: #475569; background: #fff; padding: 0.35rem 0.85rem; transition: all .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
     <i class="bi bi-pencil" style="font-size:.85rem;"></i> Edit
  </button>
</div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Occupied Area</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->settings->occupied_area??'N/A'}} Sqft
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Total Area</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->settings->total_area??'N/A'}} Sqft
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Possession Status</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{get_name_by_id('property_status_names','status_id',$projectData->additional->possession_status,'en')??'N/A'}}
    </div>
</div>
              @if($projectData->additional->possession_status==1)
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
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Age Of Constraction</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{ $ageOptions[$projectData->additional->construct_year] ?? 'N/A' }}
    </div>
</div>
              @endif
              @if($projectData->additional->possession_status==2)
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Expected Possesion Month Year</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{ $projectData->additional->possesion_month_possesion_year ? date('F Y', strtotime('01-' . $projectData->additional->possesion_month_possesion_year)) : 'N/A' }}
    </div>
</div>
              @endif
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Furnished</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{get_name_by_id('property_furnish_names','furnish_id',$projectData->settings->project_furnish,'en')??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Parking</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $parkingStatus = [
                  'AV' => 'Available',
                  'NA' => 'Not Available',
                  'UC' => 'Under Construction'
                  ];
                  @endphp
                  {{ $parkingStatus[$projectData->settings->parking_availability] ?? 'N/A' }}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Facing</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $project_facing = [
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
                  {{$project_facing[$projectData->settings->project_facing] ??'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">OverLooking</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $overlooking = $projectData->additional->overlooking ?? '';
                  $overlookingArray = !empty($overlooking) ? json_decode($overlooking, true) : [];
                  echo $overlookingArray ? implode(', ', $overlookingArray) : 'N/A';
                  @endphp
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Flooring Types</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $flooring_style_map = [
                  'mosaic' => 'Mosaic',
                  'vitrified' => 'Vitrified',
                  'wooden' => 'Wooden',
                  'marbonite' => 'Marble',
                  'granite' => 'Granite',
                  'normal_tiles' => 'Normal Tiles/Kotah Stone',
                  'ceramic_tiles' => 'Ceramic Tiles'
                  ];

                  $flooring_styles = json_decode($projectData->additional->flooring_style ?? '[]', true);
                  if ($flooring_styles) {
                  $formatted_styles = array_map(function($style) use ($flooring_style_map) {
                  return $flooring_style_map[$style] ?? $style;
                  }, $flooring_styles);
                  echo implode(', ', $formatted_styles);
                  } else {
                  echo 'N/A';
                  }
                  @endphp

              </li>
              <li>
                <b>Total Tower:</b>
                <span>{{$projectData->settings->total_towers ?? 'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Total Units</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        {{$projectData->settings->total_units ?? 'N/A'}}
    </div>
</div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
  <h5 class="fw-bold mb-0">
     <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
         <i class="bi bi-info-square"></i>
     </div>
     Additional Information
  </h5>
  <button class="btn btn-sm d-flex align-items-center gap-2 fw-semibold" onclick="edit_project_modal(3, <?php echo $projectData->id ?>,'Additional')" style="border: 1.5px solid #e2e8f0; border-radius: 8px; color: #475569; background: #fff; padding: 0.35rem 0.85rem; transition: all .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
     <i class="bi bi-pencil" style="font-size:.85rem;"></i> Edit
  </button>
</div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Water Availability</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $waterAvailability = [
                  '24_hours' => '24 Hours Available',
                  'partially_available' => 'Partially Available',
                  'not_available' => 'Not Available',
                  ];
                  @endphp
                  {{ $waterAvailability[$projectData->additional->water_availability] ?? 'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Status of Electricity</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $electricityStatus = [
                  'full_power_backup' => 'Full Power Backup',
                  'partial_power_backup' => 'Partial Power Backup',
                  'no_power_backup' => 'No Power Backup',
                  ];
                  @endphp

                  {{$electricityStatus[$projectData->additional->electric_availability ]?? 'N/A'}}
    </div>
</div>
              <div class="col-md-6 col-lg-4 mb-3">
    <label class="form-label text-muted small fw-medium mb-1">Type of Ownership</label>
    <div class="p-2 border rounded-3 bg-light text-dark fw-medium text-truncate" style="height: 42px; line-height: 24px;">
        @php
                  $ownershipType = [
                  'freehold' => 'Freehold',
                  'leasehold' => 'Leasehold',
                  'cooperative_society' => 'Co-operative Society',
                  'power_of_attorney' => 'Power of Attorney'
                  ];
                  @endphp
                  {{$ownershipType[$projectData->additional->type_of_ownership] ?? 'N/A'}}
    </div>
</div>


            </div>
          </div>
        </div>
        {{--
        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
  <h5 class="fw-bold mb-0">
     <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
         <i class="bi bi-geo-alt"></i>
     </div>
     Project Landmark
  </h5>
  <button class="btn btn-sm d-flex align-items-center gap-2 fw-semibold" onclick="edit_project_modal(4, <?php echo $projectData->id ?>,'Landmark')" style="border: 1.5px solid #e2e8f0; border-radius: 8px; color: #475569; background: #fff; padding: 0.35rem 0.85rem; transition: all .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
     <i class="bi bi-pencil" style="font-size:.85rem;"></i> Edit
  </button>
</div>
          <div class="card-body">
            <div class="list-container">
              @foreach ($landmark_categories as $category => $items)
              @if (!empty($items))
              <div class="list-category">
                <b>{{ ucfirst($category) }}:</b>
        <ul>
          @foreach ($items as $item)
          <li>{{ $item['name'] }} - {{ $item['distance'] }} meters</li>
          @endforeach
        </ul>
      </div>
      @endif
      @endforeach
    </div>

</div>
</div>
--}}

</div>

<div class="tab-pane fade{{ request('tab') == 'project-photos' || !request('tab') ? 'show active' : '' }} "
  id="project-photos" role="tabpanel" style="{{ request('tab') == '' ? 'display: none;' : 'display: block;' }}">
  <div class="card border-0 shadow-sm rounded-4 mb-4">
    <div class="card-header bg-white border-bottom-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
      <h5 class="fw-bold mb-0">
         <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-flex align-items-center justify-content-center me-2" style="width:32px;height:32px;">
             <i class="bi bi-images"></i>
         </div>
         Project Photos
      </h5>
    </div>
    <div class="card-body px-4 pb-4 pt-0">
        {{-- Info banner --}}
        <div class="info-banner mb-4 p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center gap-2" style="font-size: 0.9rem;">
            <i class="bi bi-info-circle-fill"></i>
            Accepted formats are .jpg, .jpeg, .png, .gif, .bmp. Maximum size allowed is 20 MB.
        </div>

        @php
            $types = ['interior','exterior','location','other'];
            $typeImages = array_fill_keys($types, '');
            $typeDescs  = array_fill_keys($types, '');
            $typeFilenames = array_fill_keys($types, []);

            if(!empty($groupedGallery)) {
                foreach($groupedGallery as $type => $images) {
                    $t = strtolower($type);
                    if (!in_array($t, $types)) {
                        $t = 'other'; // fallback
                    }
                    foreach($images as $galleryItem) {
                        $typeDescs[$t] = $galleryItem->description ?? '';
                        foreach($galleryItem->images as $img) {
                            $fn = $img->filename;
                            $url = asset('user_upload/project_images/'.$fn);
                            if($fn && file_exists(public_path('user_upload/project_images/'.$fn))) {
                                $typeFilenames[$t][] = $fn;
                                $typeImages[$t] .= '
                                <div class="col-md-3 col-sm-4 col-6 mb-3">
                                    <div class="gallery-item h-100 position-relative">
                                        <img src="'.$url.'" alt="Photo" class="img-fluid w-100 h-100 object-fit-cover rounded-3">
                                        <div class="gallery-overlay">
                                            <button type="button" class="btn-delete ms-auto" data-type="'.$t.'" data-filename="'.$fn.'" onclick="removeImage($(this))" title="Delete"><i class="bi bi-trash3-fill"></i></button>
                                        </div>
                                        <div class="file-info position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-75 rounded-bottom-3" style="font-size: 0.75rem;">
                                            <i class="bi bi-image me-1"></i><span class="text-truncate d-inline-block" style="max-width: 80%;">'.basename($fn).'</span>
                                        </div>
                                    </div>
                                </div>';
                            }
                        }
                    }
                }
            }
        @endphp

        <form role="form" id="project-photos-form">
            <input type="hidden" name="project_id" value="{{ $projectData->id }}">
            <input type="hidden" name="step" value="5">

            <div class="photo-tabs-wrapper mb-4 image-tab-content">
                @php
                    $tabIcons = ['interior'=>'bi-sofa','exterior'=>'bi-building','location'=>'bi-geo-alt','other'=>'bi-three-dots'];
                    $tabLabels = ['interior'=>'Interior View','exterior'=>'Exterior View','location'=>'Location Map','other'=>'Others'];
                @endphp
                @foreach($types as $type)
                @php 
                    $icon = $tabIcons[$type] ?? 'bi-images';
                    $label = $tabLabels[$type] ?? ucfirst($type);
                @endphp
                <button type="button" class="photo-tab-pill nav-link {{ $loop->first ? 'active' : '' }}" data-tab="{{ $type }}" style="border-radius: 8px;">
                    <i class="bi {{ $icon }}"></i> {{ $label }}
                </button>
                @endforeach
            </div>

            @foreach($types as $type)
            <div class="img-content" id="tab-content-{{ $type }}" {{ $type !== 'interior' ? 'style=display:none' : '' }}>
                
                <h6 class="fw-semibold text-dark mb-3" style="font-size:.9rem;">Upload {{ ucfirst($type) }} Photos</h6>
                <div class="row g-3 mb-4 preview-container" id="preview-{{ $type }}">
                    
                    {{-- Dropzone tile --}}
                    <div class="col-md-3 col-sm-4 col-6 mb-3">
                        <label class="upload-dropzone-tile h-100 d-flex flex-column align-items-center justify-content-center p-4 border rounded-3 text-center cursor-pointer" for="fileinput-{{ $type }}" style="background: #f8fafc; border: 2px dashed #cbd5e1 !important; min-height: 140px; cursor: pointer;">
                            <i class="bi bi-cloud-upload fs-2 text-primary mb-2"></i>
                            <span class="dz-text fw-semibold text-dark" style="font-size: 0.85rem;">Drag & drop files</span>
                            <small class="text-muted my-1" style="font-size: 0.75rem;">or</small>
                            <span class="dz-browse-btn text-primary fw-bold" style="font-size: 0.85rem;">Browse Files</span>
                        </label>
                        <input type="file" id="fileinput-{{ $type }}" data-tab="{{ $type }}" class="d-none photo-file-input" multiple accept=".jpg,.jpeg,.png,.gif,.bmp">
                    </div>

                    {{-- Existing images --}}
                    {!! $typeImages[$type] !!}

                </div>
                <input type="hidden" id="uploadedFiles-{{ $type }}" name="uploadedFiles[{{ $type }}]" value="{{ json_encode($typeFilenames[$type]) }}">

                {{-- Description --}}
                <div class="mb-2 d-flex justify-content-between align-items-center">
                    <label class="fw-semibold text-dark mb-0" style="font-size:.9rem;">Description <span class="text-muted fw-normal" style="font-size:.8rem;">(Optional)</span></label>
                </div>
                <div class="position-relative">
                    <textarea rows="4" class="form-control desc-textarea bg-light" name="image_desc[{{ $type }}]" placeholder="Write something about these photos..." maxlength="500" oninput="updateCounter(this)" style="border-radius: 12px; resize: none;">{{ $typeDescs[$type] }}</textarea>
                    <div class="char-counter mt-1 text-end text-muted" style="font-size: 0.75rem;">{{ strlen($typeDescs[$type]) }} / 500</div>
                </div>

            </div>
            @endforeach
            
            <div class="d-flex justify-content-end mt-4">
                <button type="button" class="btn btn-primary rounded-3 px-4 py-2 fw-bold shadow-sm" id="submit-photos-btn" onclick="submitProjectPhotos()">
                    <i class="bi bi-save"></i> Save Photos
                </button>
            </div>
        </form>

    </div>
  </div>
</div>
            </div> <!-- End tab-content -->
        </div> <!-- End col-lg-8 -->

        <!-- Right Sidebar -->
        <div class="col-lg-4 col-xl-3">
            <!-- Project Summary Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                    <h6 class="fw-bold mb-0 text-dark">Project Summary</h6>
                </div>
                <div class="card-body p-4 pt-2">
                    <div class="position-relative mb-4">
                        @php
                        $imageToShow = asset('assets/images/no-image.jpg');
                        // Safely get the first available image across any group
                        $firstImage = null;
                        if (!empty($groupedGallery)) {
                            foreach($groupedGallery as $group) {
                                if(isset($group[0]->images[0])) {
                                    $firstImage = $group[0]->images[0]->filename;
                                    break;
                                }
                            }
                        }
                        if ($firstImage && file_exists(public_path('user_upload/project_images/'.$firstImage))) {
                            $imageToShow = asset('user_upload/project_images/'.$firstImage);
                        }
                        @endphp
                        <img src="{{ $imageToShow }}" alt="Project" class="img-fluid rounded-4 shadow-sm w-100 object-fit-cover" style="height: 140px;">
                    </div>

                    <ul class="list-unstyled mb-0">
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-info-circle fs-6"></i> Project ID</span>
                            <span class="fw-bold text-dark fs-6">PR-{{ str_pad($projectData->id, 6, '0', STR_PAD_LEFT) }}</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-circle fs-6"></i> Status</span>
                            <span class="badge bg-success bg-opacity-10 text-success rounded-3 px-3 py-1 fw-bold">{{ $projectData->status == 1 ? 'Active' : 'Inactive' }}</span>
                        </li>
                        <li class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small fw-medium d-flex align-items-center gap-2"><i class="bi bi-calendar fs-6"></i> Added On</span>
                            <span class="fw-bold text-dark fs-6">{{ $projectData->created_at ? date('M d, Y', strtotime($projectData->created_at)) : 'N/A' }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Actions Card -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-2">
                    <h6 class="fw-bold mb-0 text-dark">Actions</h6>
                </div>
                <div class="card-body p-4 pt-2">
                    <a href="{{ url('project/view/' . $projectData->id) }}" target="_blank"
                        class="btn btn-light bg-white border shadow-sm w-100 mb-3 rounded-3 text-dark fw-bold d-flex align-items-center justify-content-center gap-2 py-2">
                        <i class="bi bi-eye"></i> Preview Project
                    </a>
                    <button onclick="updateProject()" class="btn btn-primary shadow-sm w-100 mb-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 py-2">
                        <i class="bi bi-save"></i> Update Project
                    </button>
                    <button onclick="deleteProject()" class="btn btn-outline-danger w-100 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 py-2 bg-danger bg-opacity-10 border-danger">
                        <i class="bi bi-trash"></i> Delete Project
                    </button>
                </div>
            </div>
        </div> <!-- End col-lg-4 -->
    </div> <!-- End row -->
</div> <!-- End app-main__inner -->


@endsection

@push('custom-js')
<script>
  // Removed buggy generic nav-link tab switcher


  edit_project_modal = (step, project_id, title) => {
    $.ajax({
      url: '{{url("project/load-modal")}}' + '?step=' + step + '&project_id=' + project_id,
      type: 'GET',
      success: function(response) {
        if (step == 5) {
          $('#ajaxModalLabel').text(`Edit Project ${title}`);
        } else {
          $('#ajaxModalLabel').text(`Edit ${title} Details`);
        }
        $('#ajax_modal_body').html(response);
        $('#ajax_modal').modal('show');
      },
      error: function(xhr) {
        console.error("Error loading modal:", xhr.responseText);
      }
    });
  }

  function updateProject() {
      toastr.success("Project changes are already saved!");
      setTimeout(() => {
          window.location.href = "{{ url('allproject/all-project-view') }}";
      }, 1500);
  }

  function deleteProject() {
      Swal.fire({
          title: 'Delete Project?',
          text: 'Are you sure you want to delete this project?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
          if (result.isConfirmed) {
              $.ajax({
                  url: `{{ url('allproject/delete') }}`,
                  method: 'POST',
                  data: {
                      _token: '{{ csrf_token() }}',
                      status: 'delete',
                      id: '{{ $projectData->id }}'
                  },
                  success: function(response) {
                      window.location.href = "{{ url('allproject/all-project-view') }}";
                  },
                  error: function(xhr, status, error) {
                      toastr.error("Failed to delete project.");
                      console.log(error);
                  }
              });
          }
      });
  }

<script>
let uploadedFilesByTab = {};
@foreach(['interior','exterior','location','other'] as $tab)
    uploadedFilesByTab['{{$tab}}'] = JSON.parse($("#uploadedFiles-{{$tab}}").val() || '[]');
@endforeach

$(document).on('change', '.photo-file-input', function() {
    var activeTab = $(this).attr('data-tab');
    let files = this.files;
    if (files.length === 0) return;

    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
    }
    formData.append("type", activeTab);

    $.ajax({
        url: "{{ url('/project/store_project_image') }}",
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function(data) {
            if (data.success) {
                $.each(data.images, function(index, image) {
                    uploadedFilesByTab[activeTab].push(image.filename);
                    previewImage(image.imageUrl, image.filename, activeTab);
                });
                $("#uploadedFiles-" + activeTab).val(JSON.stringify(uploadedFilesByTab[activeTab]));
            }
        },
        error: function(xhr, status, error) { console.error('AJAX Error:', error); toastr.error("Failed to upload image"); }
    });
});

function previewImage(imageUrl, filename, type) {
    let html = `
        <div class="col-md-3 col-sm-4 col-6 mb-3">
            <div class="gallery-item h-100 position-relative">
                <img src="${imageUrl}" alt="Photo" class="img-fluid w-100 h-100 object-fit-cover rounded-3">
                <div class="gallery-overlay">
                    <button type="button" class="btn-delete ms-auto" data-type="${type}" data-filename="${filename}" onclick="removeImage($(this))" title="Delete"><i class="bi bi-trash3-fill"></i></button>
                </div>
                <div class="file-info position-absolute bottom-0 start-0 w-100 p-2 text-white bg-dark bg-opacity-75 rounded-bottom-3" style="font-size: 0.75rem;">
                    <i class="bi bi-image me-1"></i><span class="text-truncate d-inline-block" style="max-width: 80%;">${filename}</span>
                </div>
            </div>
        </div>`;
    $("#preview-" + type).children().first().after($(html));
}

function removeImage(btn) {
    let type = btn.attr('data-type');
    let filename = btn.attr('data-filename');
    
    btn.closest('.col-md-3').remove();
    
    if (uploadedFilesByTab[type]) {
        uploadedFilesByTab[type] = uploadedFilesByTab[type].filter(name => name !== filename);
        $("#uploadedFiles-" + type).val(JSON.stringify(uploadedFilesByTab[type]));
    }
}

function updateCounter(el) {
    el.nextElementSibling.textContent = el.value.length + ' / 500';
}

function submitProjectPhotos() {
    var form = $("#project-photos-form");
    var btn = $("#submit-photos-btn");
    btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2"></span>Saving...');
    
    $.ajax({
        type: 'POST',
        url: "{{ url('project/update-project') }}",
        data: form.serialize(),
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        success: function(res) {
            if(res.success) {
                toastr.success("Photos saved successfully!");
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                toastr.error("Error saving photos.");
            }
        },
        error: function(xhr) {
            toastr.error("Error saving photos.");
            console.error(xhr.responseText);
        },
        complete: function() {
            btn.prop("disabled", false).html('<i class="bi bi-save"></i> Save Photos');
        }
    });
}
</script>
@endpush