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
</style>


@endpush
@section('content')

<div class="app-main__inner">
  <div class="app-page-title">
    <div class="page-title-wrapper">
      <div class="page-title-heading">
        <div class="page-title-icon">
          <i class="bi bi-buildings"></i>
        </div>
        <div>Project Edit <div class="page-title-subheading">Project Setting <i class="bi bi-chevron-right"></i> Project Edit
          </div>
        </div>
      </div>
      <div class="page-title-actions">
        <ol class="breadcrumb float-lg-end">
          <li class="breadcrumb-item"><a href=""> Home</a></li>
          <li class="breadcrumb-item active">Project Edit</li>
        </ol>
      </div>
    </div>
  </div>


  <section class="content">
    <ul id="myTab" class="nav nav-underline mb-3" role="tablist">
      <li class="nav-item">
        <a class="nav-link {{ request('tab') == 'project-details' || !request('tab') ? 'active' : '' }}"
          href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'project-details']) }}">
          Project Details
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link phototab {{ request('tab') == 'project-photos' ? 'active' : '' }}"
          href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'project-photos']) }}">
          Project Photos
        </a>
      </li>
    </ul>

    <div class="tab-content">

      <!-- Property Details Tab -->
      <div class="tab-pane fade {{ request('tab') == 'project-details' || !request('tab') ? 'show active' : '' }}"
        id="project-details" role="tabpanel">
        <div class="card mb-4">
          <div class="card-header d-flex">
            <h4 class="card-title">Basic Details </h4>
            <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_project_modal(1, <?php echo $projectData->id ?>,'Basic')"><i class="bi bi-pencil-square"></i></a>
          </div>
          <div class="card-body">
            <ul class="list-info">
              <li>
                <b>Post For:</b>
                <span>{{ucfirst($projectData->settings->post_for)??'N/A'}}</span>
              </li>
              <li>
                <b>Project Type:</b>
                <span>{{get_name_by_id('property_category_names','category_id',$projectData->settings->project_type,'en')??'N/A'}}</span>
              </li>
              <li>
                <b>Developer Name:</b>
                <span>{{$projectData->additional->developer_name??'N/A'}}</span>
              </li>
              <li>
                <b>Developer Experience:</b>
                <span>{{$projectData->additional->developer_experience . ' Yr'??'N/A'}}</span>
              </li>
              <li>
                <b>Developer Details:</b>
                <span>{{ Str::limit($projectData->additional->developer_details ?? 'N/A', 10) }}</span>
              </li>
              <li>
                <b>Price:</b>
                <span>{{$projectData->additional->expected_price??'N/A'}}</span>
              </li>
              <li>
                <b>Token Amount:</b>
                <span>{{$projectData->additional->token_amount??'N/A'}}</span>
              </li>

              <li>
                <b>Instruction:</b>
                <span>{{$projectData->additional->instruction??'N/A'}}</span>
              </li>
              <li>
                <b>Address:</b>
                <span>{{$projectData->location->address??'N/A'}}</span>
              </li>
              <li>
                <b>Locality:</b>
                <span>{{get_name_by_id('locality_names', 'locality_id', $projectData->location->locality, 'en')  ?? 'N/A' }}</span>
              </li>
              <li>
                <b>Project/Society Name:</b>
                <span>{{$projectData->project_name??'N/A'}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header d-flex">
            <h4 class="card-title">Project Features </h4>
            <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_project_modal(2, <?php echo $projectData->id ?>,'Features')"><i class="bi bi-pencil-square"></i></a>
          </div>
          <div class="card-body">
            <ul class="list-info">
              <li>
                <b>Occupied Area:</b>
                <span>{{$projectData->settings->occupied_area??'N/A'}} Sqft</span>
              </li>
              <li>
                <b>Total Area:</b>
                <span>{{$projectData->settings->total_area??'N/A'}} Sqft</span>
              </li>
              <li>
                <b>Possession Status:</b>
                <span> {{get_name_by_id('property_status_names','status_id',$projectData->additional->possession_status,'en')??'N/A'}}</span>
              </li>
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
              <li>
                <b>Age Of Constraction:</b>
                <span>{{ $ageOptions[$projectData->additional->construct_year] ?? 'N/A' }}</span>
              </li>
              @endif
              @if($projectData->additional->possession_status==2)
              <li>
                <b>Expected Possesion Month Year:</b>
                <span>{{ $projectData->additional->possesion_month_possesion_year ? date('F Y', strtotime('01-' . $projectData->additional->possesion_month_possesion_year)) : 'N/A' }}</span>
              </li>
              @endif
              <li>
                <b>Furnished:</b>
                <span>{{get_name_by_id('property_furnish_names','furnish_id',$projectData->settings->project_furnish,'en')??'N/A'}}</span>
              </li>
              <li>
                <b>Parking:</b>
                <span>
                  @php
                  $parkingStatus = [
                  'AV' => 'Available',
                  'NA' => 'Not Available',
                  'UC' => 'Under Construction'
                  ];
                  @endphp
                  {{ $parkingStatus[$projectData->settings->parking_availability] ?? 'N/A' }}
                </span>
              </li>
              <li>
                <b>Facing:</b>
                <span>

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

                </span>
              </li>
              <li>
                <b>OverLooking:</b>
                <span>
                  @php
                  $overlooking = $projectData->additional->overlooking ?? '';
                  $overlookingArray = !empty($overlooking) ? json_decode($overlooking, true) : [];
                  echo $overlookingArray ? implode(', ', $overlookingArray) : 'N/A';
                  @endphp
                </span>
              </li>
              <li>
                <b>Flooring Types:</b>
                <span>
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
                <span>{{$projectData->settings->total_towers ?? 'N/A'}}</span>
              </li>
              <li>
                <b>Total Units:</b>
                <span>{{$projectData->settings->total_units ?? 'N/A'}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header d-flex">
            <h4 class="card-title">Additional Information </h4>
            <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_project_modal(3, <?php echo $projectData->id ?>,'Additional')"><i class="bi bi-pencil-square"></i></a>
          </div>
          <div class="card-body">
            <ul class="list-info">
              <li>
                <b>Water Availability:</b>
                <span>
                  @php
                  $waterAvailability = [
                  '24_hours' => '24 Hours Available',
                  'partially_available' => 'Partially Available',
                  'not_available' => 'Not Available',
                  ];
                  @endphp
                  {{ $waterAvailability[$projectData->additional->water_availability] ?? 'N/A'}}

                </span>
              </li>
              <li>
                <b>Status of Electricity:</b>
                <span>
                  @php
                  $electricityStatus = [
                  'full_power_backup' => 'Full Power Backup',
                  'partial_power_backup' => 'Partial Power Backup',
                  'no_power_backup' => 'No Power Backup',
                  ];
                  @endphp

                  {{$electricityStatus[$projectData->additional->electric_availability ]?? 'N/A'}}


                </span>
              </li>
              <li>
                <b>Type of Ownership:</b>
                <span>
                  @php
                  $ownershipType = [
                  'freehold' => 'Freehold',
                  'leasehold' => 'Leasehold',
                  'cooperative_society' => 'Co-operative Society',
                  'power_of_attorney' => 'Power of Attorney'
                  ];
                  @endphp
                  {{$ownershipType[$projectData->additional->type_of_ownership] ?? 'N/A'}}</span>
              </li>


            </ul>
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header d-flex">
            <h4 class="card-title">Project Landmark </h4>
            <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_project_modal(4, <?php echo $projectData->id ?>,'Landmark')"><i class="bi bi-pencil-square"></i></a>
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
      </div>
    </div>

    <div class="tab-pane fade{{ request('tab') == 'project-photos' || !request('tab') ? 'show active' : '' }} "
      id="project-photos" role="tabpanel" style="{{ request('tab') == '' ? 'display: none;' : 'display: block;' }}">
      <div class="card mb-4">
        <div class="card-header d-flex">
          <h4 class="card-title">Project Photos</h4>
          <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_project_modal(5, <?php echo $projectData->id ?>,'Photos')"><i class="bi bi-pencil-square"></i></a>

        </div>
        <div class="card-body">
          <div class="form-field">
            <div class="image-tab-content">
              <ul class="nav nav-underline nav-custom">
                @foreach($groupedGallery as $type => $images)
                <li class="nav-item">
                  <a class="nav-link {{ $loop->first ? 'active' : '' }}" data-tab="{{ $type }}" href="javascript:void(0)">
                    {{ ucfirst($type) }}
                  </a>
                </li>
                @endforeach
              </ul>
            </div>
          </div>

          @foreach($groupedGallery as $type => $images)
          <div class="img-content" id="tab-content-{{ $type }}" style="{{ $loop->first ? '' : 'display: none;' }}">
            <div class="upload-gallery" id="preview-{{ $type }}">
              @foreach($images as $galleryItem)
              @foreach($galleryItem->images as $image)
              <div class="image-box pic">
                <img src="{{ asset('user_upload/project_images/' . $image->filename) }}" alt="Image" class="img-fluid">
                <p class="image-caption">{{ $image->caption ?? 'No caption available' }}</p>
              </div>
              @endforeach
              @endforeach
            </div>
          </div>
          @endforeach

        </div>

      </div>
    </div>
  </section>
</div>

@endsection

@push('custom-js')
<script>
  const tabs = document.querySelectorAll(".nav-link");
  const phototab = document.querySelector(".phototab");
  const contents = document.querySelectorAll(".img-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      contents.forEach(content => content.style.display = "none");


      const selectedTab = this.getAttribute("data-tab");
      document.getElementById(`tab-content-${selectedTab}`).style.display = "block";
    });
  });


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
</script>
@endpush