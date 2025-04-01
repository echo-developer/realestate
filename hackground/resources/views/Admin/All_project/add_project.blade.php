@extends('Admin.layouts.app')
@push('custom-css')
<link href="{{ asset('assets/css/icons.css') }}" type="text/css" rel="stylesheet">
<link href="{{ asset('assets/css/google-material-icons.css') }}" type="text/css" rel="stylesheet">
<link href="{{ asset('assets/css/mmenu.css') }}" type="text/css" rel="stylesheet">
<link href="{{ asset('assets/css/style.css') }}" type="text/css" rel="stylesheet">
<link href="{{ asset('assets/css/ltr.css') }}" type="text/css" rel="stylesheet">
<link href="{{ asset('assets/css/responsive.css') }}" type="text/css" rel="stylesheet">

<style>
  .upload-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: red;
    color: white;
    border: none;
    width: 20px;
    height: 20px;
    font-size: 12px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
@endpush

@section('content')

<section class="section post-page">
  <div class="container">
    <div class="row justify-content-center">
      <aside class="col-lg-8 col-12">
        <div class="d-sm-flex justify-content-between mb-3">
          <h1 class="h3">Sell Or Rent Your project</h1>
          <p>You are posting this project for <b class="text-green h4">FREE!</b></p>
        </div>
        <div class="card border-0 post-form">
          <div class="card-header pb-0">
            <ul class="nav nav-underline mb-0 gap-5 d-flex">
              <li class="nav-item">
                <a class="nav-link active" href="#">Project Details</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Location</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Feature</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Availability</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Photos</a>
              </li>
            </ul>

          </div>
          <div class="card-body">
            <form method="post">

              <input type="hidden" id="user_id" name="uid" value="{{$uid}}">

              <div id="step-2" style="display:none1;">
                <label class="form-label">You are here to</label>

                <label class="form-label">Project Type</label>
                <div class="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Basic radio toggle button group">
                  @foreach($project_type as $items)
                  <input type="radio" class="btn-check" value="{{$items->id}}" name="project_type" id="project_{{$items->id}}" autocomplete="off" checked>
                  <label class="btn btn-outline-light" for="project_{{$items->id}}">{{$items->name}}</label>
                  @endforeach
                </div>
                <label class="form-label">Developer Name</label>
                <input class="form-control " type="text" value="" name="developer_name">

                <label class="form-label">Developer Details</label>
                <textarea class="form-control  mb-2" name="developer_details"></textarea>


                <div id="step-2" style="display: block;" class="d-grid">
                  <button type="button" class="btn btn-primary btn-next" data-step="2">Next <i class="bi bi-arrow-right"></i></button>
                </div>

              </div>

              <div id="step-3" style="display:none;">
                <div class="row gx-3">
                  <div class="col-lg-6 col-12">
                    <div class="form-field">
                      <label class="form-label">City</label>
                      <select class="selectpicker hide-tick" name="city" data-width="fit" data-size="7" title="Choose City">
                        @foreach($cities as $items)
                        <option value="{{$items['city_id']}}">{{$items['name']}}</option>

                        @endforeach
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-6 col-12">
                    <div class="form-field">
                      <label class="form-label">Locality</label>
                      <select class="selectpicker hide-tick" data-width="fit" data-size="7" title="Choose Locality">
                        <option>Abu Dhabi</option>
                        <option>Ajman</option>
                        <option>Dubai</option>
                        <option>Fujairah</option>
                        <option>Ras Al Khaimah</option>
                        <option>Sharjah</option>
                        <option>Umm Al-Quwain</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-field">
                  <label class="form-label">Name of Project</label>
                  <input type="text" class="form-control" name="project_name" placeholder="Enter Project Name Or Locality" />
                </div>
                <div class="form-field">
                  <label class="form-label">Address</label>
                  <textarea rows="3" name="project_address" class="form-control mb-2" placeholder="Enter Your Address"></textarea>
                  <p class="text-end text-help">Maximum 300 words are allowed</p>
                </div>
                <div class="form-field">
                  <label for="description">Project Description</label>
                  <textarea id="description" name="description" rows="3" class="form-control " placeholder="Enter Project Description"> </textarea>
                </div>

                <div id="step-3" style="display: none;" class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back">Back</button>
                  <button type="button" class="btn btn-primary btn-next" data-step="3">Next <i class="bi bi-arrow-right"></i></button>
                </div>

              </div>

              <div id="step-4" style="display:none;">
                <div class="row gx-3">
                  <div class="col-lg-6 col-12">
                    <div class="form-field"><label class="form-label">Occupied Area</label>
                      <div class="input-group"><input class="form-control" name="occupied_area" placeholder="Type Occupied Area"
                          type="text"><span class="input-group-text">sqft</span></div>
                    </div>
                  </div>
                  <div class="col-lg-6 col-12">
                    <div class="form-field">
                      <label class="form-label">Total Area</label>
                      <div class="input-group">
                        <input class="form-control" placeholder="Type Total Area" name="total_area" type="number" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                        <span class="input-group-text">sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group row align-items-center">
                  <div class="col-md-6">
                    <label class="form-label">No. of Total Towers</label>
                    <select class="form-select "
                      name="total_tower" style="max-height: 150px; overflow-y: auto;">
                      <option value="">Select Total Towers</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                      <option value="13">13</option>
                      <option value="14">14</option>
                      <option value="15">15</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Total Units</label>
                    <input class="form-control "
                      placeholder="Enter total units" min="1" type="number" name="total_unit">
                  </div>
                </div>

                <div class="row gx-3">
                  <div class="col-lg-6 col-12"><label class="form-label">Facing</label>
                    <div class="form-field"><select name="project_facing" class="form-control">
                        <option value="">Select Facing</option>
                        <option value="east">East</option>
                        <option value="north">North</option>
                        <option value="north_east">North - East</option>
                        <option value="north_west">North - West</option>
                        <option value="south">South</option>
                        <option value="south_east">South - East</option>
                        <option value="south_west">South - West</option>
                        <option value="west">West</option>
                      </select></div>
                  </div>
                  <div class="col-lg-6 col-12"><label class="form-label">Parking</label>
                    <div class="form-field"><select name="parking" class="form-control">
                        <option value="">Select Parking Option</option>
                        <option value="AV">Available</option>
                        <option value="NA">Not Available</option>
                        <option value="UC">Under Construction</option>
                      </select></div>
                  </div>
                </div>

                <div class="mb-3"><label class="form-label">Is Main Road Facing:</label>
                  <div class="form-check form-check-inline"><input class="form-check-input" id="main_road_facing_1"
                      type="radio" value="Yes" checked="" name="main_road_facing"><label class="form-check-label"
                      for="main_road_facing_1">Yes</label></div>
                  <div class="form-check form-check-inline"><input class="form-check-input" id="main_road_facing_2"
                      type="radio" value="No" name="main_road_facing"><label class="form-check-label"
                      for="main_road_facing_2">No</label></div>
                </div>
                <div class="form-group"><label class="form-label">Amenity Features:</label>
                  @foreach($proepertyAmenities as $items)
                  <div class="form-check form-check-inline">
                    <input name="amenities[]" value="{{ $items['amenity_id'] }}" class="form-check-input" id="feature-{{ $items['amenity_id'] }}" type="checkbox"><label class="form-check-label" for="feature-{{ $items['amenity_id'] }}">{{$items['amenity_name']}}</label>
                  </div>
                  @endforeach
                </div>
                <div class="btn-group btn-group-light d-flex mb-3 mt-3" role="group" aria-label="Property Status">



                  @foreach($propertyFurnishes as $items)
                  <input class="btn-check" id="project_furnish{{ $items['furnish_id']}}" value="{{ $items['furnish_id']}}" autocomplete="off" type="radio" checked=""
                    name="project_furnish"><label class="btn btn-outline-light" for="project_furnish{{ $items['furnish_id']}}">{{ $items['furnish_name']}}</label>
                  @endforeach




                </div>




                <div id="step-4" style="display: none;" class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back">Back</button>
                  <button type="button" class="btn btn-primary btn-next" data-step="4">Next <i class="bi bi-arrow-right"></i></button>
                </div>

              </div>

              <div id="step-5" style="display:none;">
                <div class="mb-3">
                  <label class="form-label">Possession Status :</label>
                  @foreach($propertyStatus as $items)
                  <div class="form-check form-check-inline">
                    <input class="form-check-input"
                      type="radio"
                      name="pstatus"
                      value="{{ $items['status_id'] }}"
                      id="pstatus{{ $items['status_id']}}"
                      {{ $loop->first ? 'checked' : '' }}> <!-- Automatically check first item -->
                    <label class="form-check-label" for="pstatus{{ $items['status_id']}}">
                      {{ $items['status_name'] }}
                    </label>
                  </div>
                  @endforeach
                </div>


                <label class="form-label">Age Of Construction :</label>
                <div class="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Floors">
                  <input type="radio" class="btn-check" name="age" id="age_1" autocomplete="off" checked>
                  <label class="btn btn-outline-light" for="age_1">New</label>

                  <input type="radio" class="btn-check" name="age" id="age_2" autocomplete="off">
                  <label class="btn btn-outline-light" for="age_2">Less Than 5 Years</label>

                  <input type="radio" class="btn-check" name="age" id="age_3" autocomplete="off">
                  <label class="btn btn-outline-light" for="age_3">5-10 Years</label>

                  <input type="radio" class="btn-check" name="age" id="age_4" autocomplete="off">
                  <label class="btn btn-outline-light" for="age_4">10-15 Years</label>

                  <input type="radio" class="btn-check" name="age" id="age_5" autocomplete="off">
                  <label class="btn btn-outline-light" for="age_5">15-20 Years</label>
                </div>
                <div class="row gx-3">
                  <div class="col-lg-6 col-12">
                    <label class="form-label">Expected Price</label>
                    <div class="input-group mb-3">
                      <select class="selectpicker" data-width="fit" title="Currency">
                        <option disabled="disabled">Currency</option>
                        <option>AED</option>
                        <option>EURO</option>
                        <option>POND</option>
                        <option>USD</option>
                      </select>
                      <input type="text" class="form-control" name="expected_price" placeholder="Enter Amount" />
                    </div>
                  </div>
                  <div class="col-lg-6 col-12">
                    <div class="form-field">
                      <label class="form-label">Booking/Token Amount (optional)</label>
                      <input type="text" class="form-control" placeholder="Enter Token Amount" />
                    </div>
                  </div>
                </div>

                <div id="step-5" style="display: none;" class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back">Back</button>
                  <button type="button" class="btn btn-primary btn-next" data-step="5">Next <i class="bi bi-arrow-right"></i></button>
                </div>
              </div>

              <div id="step-6" style="display:none;">
                <ul class="nav nav-tabs" id="imageTypeTabs">
                  <li class="nav-item">
                    <a class="nav-link active" data-tab="interior" href="#">Interior View</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-tab="exterior" href="#">Exterior View</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-tab="location" href="#">Location View</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-tab="other" href="#">Other View</a>
                  </li>
                </ul>


                <div class="form-field">
                  <div class="upload-area" id="uploadfile">
                    <input type="file" name="fileinput" id="fileinput" multiple>
                    <i class="bi bi-upload"></i>
                    <p>Drag & drop files here or <span class="text-site">click</span> to select files</p>
                  </div>
                </div>



                <!-- Hidden Field to Store Image Names -->
                <input type="hidden" id="uploadedImages" name="uploaded_images">

                <div class="img-content" id="tab-content-interior">
                  <div class="upload-gallery" id="preview-interior"></div>
                  <div class="form-field">
                    <label class="form-label">Description</label>
                    <textarea rows="3" class="form-control" name="image_desc[interior]" placeholder="Write something..."></textarea>
                  </div>
                </div>

                <div class="img-content" id="tab-content-exterior" style="display:none">
                  <div class="upload-gallery" id="preview-exterior"></div>
                  <div class="form-field">
                    <label class="form-label">Description</label>
                    <textarea rows="3" class="form-control" name="image_desc[exterior]" placeholder="Write something..."></textarea>
                  </div>
                </div>

                <div class="img-content" id="tab-content-location" style="display:none">
                  <div class="upload-gallery" id="preview-location"></div>
                  <div class="form-field">
                    <label class="form-label">Description</label>
                    <textarea rows="3" class="form-control" name="image_desc[location]" placeholder="Write something..."></textarea>
                  </div>
                </div>

                <div class="img-content" id="tab-content-other" style="display:none">
                  <div class="upload-gallery" id="preview-other"></div>
                  <div class="form-field">
                    <label class="form-label">Description</label>
                    <textarea rows="3" class="form-control" name="image_desc[other]" placeholder="Write something..."></textarea>
                  </div>
                </div>


                <div id="step-6" style="display: none;" class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back">Back</button>
                  <button type="submit" class="btn btn-primary btn-next">Submit Project</button>
                </div>

              </div>

            </form>
          </div>
        </div>
      </aside>
      <aside class="col-lg-4 col-12">
        <div class="card border-0 shadow-1 mt-3 mt-lg-0">
          <div class="card-body">
            <h3 class="mb-3">How To Find The Right Buyer?</h3>
            <div class="ad-post-points">
              <div class="d-flex mb-3">
                <div class="flex-shrink-0">
                  <img src="images/icons/17678554.png" alt="Icon" height="48" width="48">
                </div>
                <div class="flex-grow-1 ps-3">
                  <h4>Post your project Ad</h4>
                  <p>This is some content from a media component. You can replace this with any content and adjust it as needed.</p>
                </div>
              </div>
              <div class="d-flex mb-3">
                <div class="flex-shrink-0">
                  <img src="images/icons/13434917.png" alt="Icon" height="48" width="48">
                </div>
                <div class="flex-grow-1 ps-3">
                  <h4>Add Quality Photos</h4>
                  <p>This is some content from a media component. You can replace this with any content and adjust it as needed.</p>
                </div>
              </div>
              <div class="d-flex mb-3">
                <div class="flex-shrink-0">
                  <img src="images/icons/9094158.png" alt="Icon" height="48" width="48">
                </div>
                <div class="flex-grow-1 ps-3">
                  <h4>Add Correct Locality/Address</h4>
                  <p>This is some content from a media component. You can replace this with any content and adjust it as needed.</p>
                </div>
              </div>
              <div class="d-flex">
                <div class="flex-shrink-0">
                  <img src="images/icons/10209854.png" alt="Icon" height="48" width="48">
                </div>
                <div class="flex-grow-1 ps-3">
                  <h4>Write a Great Description</h4>
                  <p>This is some content from a media component. You can replace this with any content and adjust it as needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  </div>
</section>
@endsection
@push('custom-js')

<script>
  $(document).ready(function() {
    $('.minus').click(function() {
      var $input = $(this).parent().find('input');
      var count = parseInt($input.val()) - 1;
      count = count < 1 ? 1 : count;
      $input.val(count);
      $input.change();
      return false;
    });
    $('.plus').click(function() {
      var $input = $(this).parent().find('input');
      $input.val(parseInt($input.val()) + 1);
      $input.change();
      return false;
    });

    var w = $(window).width();
    if (w < 992) {
      $('.btn-next-1').click(function() {
        $('.spaceX').hide();
      });
      $('.btn-back-2').click(function() {
        $('.spaceX').show();
      });
    }
  });
  document.addEventListener("DOMContentLoaded", function() {
    let activeTab = "interior"; // Default active tab

    // Handle tab switching
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelectorAll(".nav-link").forEach(nav => nav.classList.remove("active"));

        const tabName = this.getAttribute("data-tab");
        this.classList.add("active");
        activeTab = tabName; // Update active tab
      });
    });
  });
</script>
<script>
  $(document).ready(function() {
    let activeTab = "interior"; // Default active tab
    let uploadedFilesByTab = {
      interior: [],
      exterior: [],
      location: [],
      other: []
    };

    // Tab switching
    $("#imageTypeTabs .nav-link").click(function(e) {
      e.preventDefault();

      $("#imageTypeTabs .nav-link").removeClass("active");
      $(this).addClass("active");

      activeTab = $(this).data("tab");

      $(".img-content").hide();
      $("#tab-content-" + activeTab).show();
    });

    // File upload
    $("#fileinput").on("change", function(event) {
      let files = event.target.files;
      if (files.length === 0) {
        alert("Please select at least one file.");
        return;
      }

      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images[]", files[i]);
        previewImage(URL.createObjectURL(files[i]), files[i].name, activeTab); // Show preview
      }
      formData.append("type", activeTab);

      fetch(`{{url('project/store_project_image')}}`, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-TOKEN": "{{ csrf_token() }}",
          },
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            data.images.forEach((image) => {
              uploadedFilesByTab[activeTab].push(image.filename);
            });
            updateHiddenField();
            $("#fileinput").val(""); // Clear file input
          } else {
            alert("Upload failed.");
          }
        })
        .catch((error) => console.error(error));
    });

    // Function to preview image
    function previewImage(imageUrl, filename, tab) {
      let previewContainer = $("#preview-" + tab);
      let imageHtml = `
            <div class="image-box" data-filename="${filename}">
                <img src="${imageUrl}" alt="Preview">
                <button class="remove-image" data-filename="${filename}">×</button>
            </div>
        `;
      previewContainer.append(imageHtml);
    }

    // Remove image functionality
    $(document).on("click", ".remove-image", function() {
      let filename = $(this).data("filename");
      $(this).closest(".image-box").remove();

      if (uploadedFilesByTab[activeTab]) {
        uploadedFilesByTab[activeTab] = uploadedFilesByTab[activeTab].filter(name => name !== filename);
      }

      updateHiddenField();
    });

    // Save uploaded file names in a hidden input
    function updateHiddenField() {
      $("#uploadedImages").val(JSON.stringify(uploadedFilesByTab));
    }
  });
</script>


<script>
  let currentStep = 2; // Start at step 2

  document.querySelectorAll(".btn-next").forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();

      let form = document.querySelector("form");
      let formData = new FormData(form);
      formData.append('step', currentStep); // Add current step

      // Clear previous errors
      document.querySelectorAll('.error-message').forEach(el => el.remove());

      fetch(`{{ url('project/savedata') }}`, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 0) {
            // Show validation errors
            Object.keys(data.errors).forEach(fieldName => {
              let field = document.querySelector(`[name='${fieldName}']`);
              if (field) {
                let errorDiv = document.createElement("div");
                errorDiv.className = "error-message text-danger mt-1";
                errorDiv.textContent = data.errors[fieldName][0];

                // Special handling for fields inside .input-group
                let inputGroup = field.closest(".input-group");
                if (inputGroup) {
                  inputGroup.insertAdjacentElement("afterend", errorDiv);
                } else {
                  field.insertAdjacentElement("afterend", errorDiv);
                }
              }

            });
          } else {

            document.getElementById(`step-${currentStep}`).style.display = "none";
            currentStep++;
            document.getElementById(`step-${currentStep}`).style.display = "block";
            activateTab(currentStep);
          }
        })
    });
  });

  document.querySelectorAll(".btn-back").forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById(`step-${currentStep}`).style.display = "none";
      currentStep--;
      document.getElementById(`step-${currentStep}`).style.display = "block";
      activateTab(currentStep);
    });
  });


  function activateTab(step) {

    document.querySelectorAll(".nav-link").forEach(tab => {
      tab.classList.remove("active");
    });
    let tabIndex = step - 2;
    let tabs = document.querySelectorAll(".nav-item .nav-link");
    if (tabs[tabIndex]) {
      tabs[tabIndex].classList.add("active");
    }
  }
</script>
@endpush