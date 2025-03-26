@extends('Admin.layouts.app')
@push('custom-css')

@endpush
@section('content')

<div class="app-main__inner">
  <div class="app-page-title">
    <div class="page-title-wrapper">
      <div class="page-title-heading">
        <div class="page-title-icon">
          <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
        </div>
        <div>Project Edit <div class="page-title-subheading">Project &gt;Project Edit
          </div>
        </div>
      </div>
      <div class="page-title-actions">
        <ol class="breadcrumb float-sm-right">
          <li class="breadcrumb-item"><a href=""> Home</a></li>
          <li class="breadcrumb-item active">Project Edit</li>
        </ol>
      </div>
    </div>
  </div>


  <section class="content">
    <div class="container-fluid">
      <ul id="myTab" class="nav nav-underline mb-3" role="tablist">
        <li class="nav-item">
          <a class="nav-link {{ request('tab') == 'property-details' || !request('tab') ? 'active' : '' }}"
            href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'property-details']) }}">
            Property Details
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link {{ request('tab') == 'property-photos' ? 'active' : '' }}"
            href="{{ route('project.edit', ['project_id' => $projectData->id, 'tab' => 'property-photos']) }}">
            Property Photos
          </a>
        </li>
      </ul>

      <div class="tab-content">

        <!-- Property Details Tab -->
        <div class="tab-pane fade {{ request('tab') == 'property-details' || !request('tab') ? 'show active' : '' }}" 
         id="property-details" role="tabpanel">
          <div class="card">
            <div class="card-header d-flex">
              <h4 class="card-title">Basic Details </h4>
              <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_profile_modal(9, 125)"><i class="fa fa-edit"></i></a>
            </div>
            <div class="card-body">
              <ul class="list-info">
                <li>
                  <b>Price:</b>
                  <span>{{$projectData->additional->expected_price??'N/A'}}</span>
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
                  <span>{{$projectData->location->locality}}</span>
                </li>
                <li>
                  <b>Project/Society Name:</b>
                  <span>{{$projectData->project_name??'N/A'}}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex">
              <h4 class="card-title">Project Features </h4>
              <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_profile_modal(9, 125)"><i class="fa fa-edit"></i></a>
            </div>
            <div class="card-body">
              <ul class="list-info">
                <li>
                  <b>Configuration:</b>
                  <span>N/A</span>
                </li>
                <li>
                  <b>Occupied Area:</b>
                  <span>{{$projectData->settings->occupied_area??'N/A'}}</span>
                </li>
                <li>
                  <b>Total Area:</b>
                  <span>{{$projectData->settings->total_area??'N/A'}}</span>
                </li>
                <li>
                  <b>Possession Status:</b>
                  <span> {{get_name_by_id('property_status_names','status_id',$projectData->additional->possession_status,'en')??'N/A'}}</span>
                </li>
                @if($projectData->additional->possession_status==1)
                <li>
                  <b>Age Of Constraction:</b>
                  <span> {{$projectData->additional->construct_year??'N/A'}}</span>
                </li>
                @endif
                @if($projectData->additional->possession_status==2)
                <li>
                  <b>Expected Possesion Month Year:</b>
                  <span> {{ date('F Y', strtotime($projectData->additional->expected_possesion_month_year)) ??'N/A'}}</span>
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
                  <span>{{$projectData->settings->project_facing??'N/A'}}</span>
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

          <div class="card">
            <div class="card-header d-flex">
              <h4 class="card-title">Additional Information </h4>
              <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_profile_modal(9, 125)"><i class="fa fa-edit"></i></a>
            </div>
            <div class="card-body">
              <ul class="list-info">
                <li>
                  <b>Water Availability:</b>
                  <span>{{$projectData->additional->water_availability ?? 'N/A'}}</span>
                </li>
                <li>
                  <b>Status of Electricity:</b>
                  <span>{{$projectData->additional->electric_availability ?? 'N/A'}}</span>
                </li>
                <li>
                  <b>Type of Ownership:</b>
                  <span>{{$projectData->additional->type_of_ownership ?? 'N/A'}}</span>
                </li>


              </ul>
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex">
              <h4 class="card-title">Project Landmark </h4>
              <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_profile_modal(9, 125)"><i class="fa fa-edit"></i></a>
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

      <div class="tab-pane fade{{ request('tab') == 'property-photos' || !request('tab') ? 'show active' : '' }}" 
         id="property-details" role="tabpanel">
        <div class="card">
          <div class="card-header d-flex">
            <h4 class="card-title">Property Photos</h4>
            <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit_profile_modal(9, 125)"><i class="fa fa-edit"></i></a>

          </div>
          <div class="card-body">
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
            </div>
            <!-- Hidden Field to Store Image Names -->

            <div class="img-content" id="tab-content-living">
              <div class="upload-gallery" id="preview-living"></div>
              <div class="form-field">
                <label class="form-label">Description</label>
                <textarea rows="3" class="form-control" name="image_desc[living]" placeholder="Write something..."></textarea>
              </div>
            </div>

    
          </div>
        </div>
      </div>

    </div>
  </section>
</div>
<div class="modal fade" id="ajaxModal">
  <div class="modal-dialog">
    <div class="modal-content">

    </div>
  </div>
</div>

@endsection
@push('custom-js')
<script>
  document.addEventListener("DOMContentLoaded", function() {
    let uploadBox = document.querySelector(".upload-area");
    let fileInput = document.getElementById("fileinput");

    // Upload box click karein to file input open ho
    uploadBox.addEventListener("click", function() {
      fileInput.click();
    });

    // File select hone ke baad filename show karein
    fileInput.addEventListener("change", function() {
      let files = fileInput.files;
      if (files.length > 0) {
        uploadBox.innerHTML = `<i class="bi bi-upload"></i><p>${files.length} file(s) selected</p>`;
      }
    });
  });
</script>
@endpush