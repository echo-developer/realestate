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
                <a class="nav-link active" href="#">Personal Info</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Project Details</a>
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
              <div id="step-1" style="display:none1;">
                <label class="d-block mb-2">I'm a</label>
                <div class="btn-group btn-group-light d-flex mb-3" role="group">
                  <input type="radio" class="btn-check" name="postAs" id="owner" autocomplete="off" checked>
                  <label class="btn btn-outline-light" for="owner"><img src="images/icons/owner.png" alt="Icon" height="24" width="24" /> Owner</label>
                  <input type="radio" class="btn-check" name="postAs" id="agent" autocomplete="off">
                  <label class="btn btn-outline-light" for="agent"><img src="images/icons/agent.png" alt="Icon" height="24" width="24" /> Agent</label>
                  <input type="radio" class="btn-check" name="postAs" id="builder" autocomplete="off">
                  <label class="btn btn-outline-light" for="builder"><img src="images/icons/builder.png" alt="Icon" height="24" width="24" /> Builder</label>
                </div>

                <div class="form-field mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" name="name" placeholder="Enter Your Name">
                  <span class="error nameError text-danger"></span>
                </div>

                <div class="input-group mb-3">
                  <select class="selectpicker" data-width="fit">
                    <option>IND +91</option>
                    <option>+81</option>
                    <option>+71</option>
                    <option>+61</option>
                    <option>+51</option>
                  </select>
                  <input type="number" class="form-control" placeholder="WhatsApp No." required />
                </div>

                <div class="alert alert-success d-flex align-items-center">
                  <img src="images/whatsapp.png" alt="whatsapp" height="48" width="48" />
                  <p class="ps-3">Enter your <span class="text-green">WhatsApp Number</span> to get enqueries from buyer/tenant</p>
                </div>

                <div class="form-field mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" name="email" class="form-control" placeholder="Enter Your Email I’d">
                  <span class="error emailError text-danger"></span>
                </div>

                <div class="d-grid">
                  <button type="button" class="btn btn-primary btn-next-1">Next <i class="bi bi-arrow-right"></i></button>
                </div>
              </div>
              <div id="step-2" style="display:none;">
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

                <div class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back-2"><i class="bi bi-arrow-left"></i> Back</button>
                  <button type="button" class="btn btn-primary btn-next-2">Next <i class="bi bi-arrow-right"></i></button>
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
                <div class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back-3"><i class="bi bi-arrow-left"></i> Back</button>
                  <button type="button" class="btn btn-primary btn-next-3">Next <i class="bi bi-arrow-right"></i></button>
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
                    <div class="form-field"><label class="form-label">Total Area</label>
                      <div class="input-group"><input class="form-control " placeholder="Type Total Area" name="total_area" type="text">
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
                    name="project_furnish[]"><label class="btn btn-outline-light" for="project_furnish{{ $items['furnish_id']}}">{{ $items['furnish_name']}}</label>
                  @endforeach




                </div>



                <div class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back-4"><i class="bi bi-arrow-left"></i> Back</button>
                  <button type="button" class="btn btn-primary btn-next-4">Next <i class="bi bi-arrow-right"></i></button>
                </div>
              </div>

              <div id="step-5" style="display:none;">
                <div class="mb-3">
                  <label class="form-label">Possession Status :</label>
                  @foreach($propertyStatus as $items)
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="pstatus" value="{{ $items['status_id'] }}" id="pstatus{{ $items['status_id']}}">
                    <label class="form-check-label" for="pstatus{{ $items['status_id']}}">{{ $items['status_name']}}</label>
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
                      <input type="text" class="form-control" placeholder="Enter Amount" />
                    </div>
                  </div>
                  <div class="col-lg-6 col-12">
                    <div class="form-field">
                      <label class="form-label">Booking/Token Amount (optional)</label>
                      <input type="text" class="form-control" placeholder="Enter Token Amount" />
                    </div>
                  </div>
                </div>
                <div class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back-5"><i class="bi bi-arrow-left"></i> Back</button>
                  <button type="button" class="btn btn-primary btn-next-5">Next <i class="bi bi-arrow-right"></i></button>
                </div>
              </div>
              <div id="step-6" style="display:none;">
                <ul class="nav nav-tabs" id="imageTypeTabs">
                  <li class="nav-item">
                    <a class="nav-link" data-tab="interior" href="#">Interior View</a>
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


                <div class="form-field">
                  <label class="form-label">Description</label>
                  <textarea rows="3" class="form-control" placeholder="Write something..."></textarea>
                </div>
                <!-- Preview Container -->
                <div class="upload-gallery" id="previewGallery"></div>

                <div class="d-grid columns-2">
                  <button type="button" class="btn btn-secondary btn-back-6"><i class="bi bi-arrow-left"></i> Back</button>
                  <button type="submit" class="btn btn-primary btn-next-6">Post project</button>
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

    $('.btn-next-1').click(function() {
      $('#step-1').hide();
      $('#step-2').show();
      $('.nav-underline li:nth-child(1) .nav-link').removeClass('active');
      $('.nav-underline li:nth-child(2) .nav-link').addClass('active');
    });
    $('.btn-back-2').click(function() {
      $('#step-1').show();
      $('#step-2').hide();
      $('.nav-underline li:nth-child(1) .nav-link').addClass('active');
      $('.nav-underline li:nth-child(2) .nav-link').removeClass('active');
    });
    $('.btn-next-2').click(function() {
      $('#step-2').hide();
      $('#step-3').show();
      $('.nav-underline li:nth-child(2) .nav-link').removeClass('active');
      $('.nav-underline li:nth-child(3) .nav-link').addClass('active');
    });
    $('.btn-back-3').click(function() {
      $('#step-2').show();
      $('#step-3').hide();
      $('.nav-underline li:nth-child(2) .nav-link').addClass('active');
      $('.nav-underline li:nth-child(3) .nav-link').removeClass('active');
    });
    $('.btn-next-3').click(function() {
      $('#step-3').hide();
      $('#step-4').show();
      $('.nav-underline li:nth-child(3) .nav-link').removeClass('active');
      $('.nav-underline li:nth-child(4) .nav-link').addClass('active');
    });
    $('.btn-back-4').click(function() {
      $('#step-3').show();
      $('#step-4').hide();
      $('.nav-underline li:nth-child(3) .nav-link').addClass('active');
      $('.nav-underline li:nth-child(4) .nav-link').removeClass('active');
    });
    $('.btn-next-4').click(function() {
      $('#step-4').hide();
      $('#step-5').show();
      $('.nav-underline li:nth-child(4) .nav-link').removeClass('active');
      $('.nav-underline li:nth-child(5) .nav-link').addClass('active');
    });
    $('.btn-back-5').click(function() {
      $('#step-4').show();
      $('#step-5').hide();
      $('.nav-underline li:nth-child(4) .nav-link').addClass('active');
      $('.nav-underline li:nth-child(5) .nav-link').removeClass('active');
    });
    $('.btn-next-5').click(function() {
      $('#step-5').hide();
      $('#step-6').show();
      $('.nav-underline li:nth-child(5) .nav-link').removeClass('active');
      $('.nav-underline li:nth-child(6) .nav-link').addClass('active');
    });
    $('.btn-back-6').click(function() {
      $('#step-5').show();
      $('#step-6').hide();
      $('.nav-underline li:nth-child(5) .nav-link').addClass('active');
      $('.nav-underline li:nth-child(6) .nav-link').removeClass('active');
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
  document.addEventListener('DOMContentLoaded', function() {
    let activeTab = 'interior'; // Default tab
    let uploadedImages = {}; // Store images by tab type

    // Initialize object with tab categories
    ['interior', 'exterior', 'location', 'other'].forEach(tab => {
      uploadedImages[tab] = [];
    });

    // Handle tab switching
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.nav-link.active')?.classList.remove('active');
        this.classList.add('active');
        activeTab = this.getAttribute('data-tab'); // Update active tab
      });
    });

    // Handle file uploads
    document.getElementById('fileinput').addEventListener('change', function() {
      let files = this.files;
      if (files.length === 0) {
        alert('Please select at least one file.');
        return;
      }

      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
      }
      formData.append('type', activeTab); // Send tab info

      fetch(`{{url('project/store_project_image')}}`, {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            data.images.forEach(image => {
              uploadedImages[activeTab].push(image.filename);
              previewImage(image.imageUrl, image.filename, activeTab);
            });
            updateHiddenField();
          } else {
            alert('Upload failed.');
          }
        })
        .catch(error => console.error(error));
    });

    // Function to preview uploaded images
    function previewImage(imageUrl, filename, tab) {
      let gallery = document.getElementById('previewGallery');
      let imgWrapper = document.createElement('div');
      imgWrapper.classList.add('preview-item');
      imgWrapper.innerHTML = `
            <img src="${imageUrl}" alt="Uploaded Image">
            <button type="button" class="remove-btn" data-filename="${filename}" data-tab="${tab}">X</button>
        `;
      gallery.appendChild(imgWrapper);
    }

    // Function to update hidden field with tab-wise uploaded images
    function updateHiddenField() {
      let filteredImages = {};
      Object.keys(uploadedImages).forEach(tab => {
        if (uploadedImages[tab].length > 0) {
          filteredImages[tab] = uploadedImages[tab];
        }
      });
      document.getElementById('uploadedImages').value = JSON.stringify(filteredImages);
    }

    // Event delegation for removing images
    document.getElementById('previewGallery').addEventListener('click', function(event) {
      if (event.target.classList.contains('remove-btn')) {
        let filename = event.target.getAttribute('data-filename');
        let tab = event.target.getAttribute('data-tab');
        uploadedImages[tab] = uploadedImages[tab].filter(file => file !== filename);
        event.target.parentElement.remove();
        updateHiddenField();
      }
    });

    // Handle form submission
    document.querySelector(".btn-next-6").addEventListener("click", function(e) {
      e.preventDefault();
      updateHiddenField();

      let form = document.querySelector("form");
      let formData = new FormData(form);

      fetch(`{{url('project/savedata')}}`, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert("Project posted successfully!");
            form.reset();
            document.getElementById('previewGallery').innerHTML = '';
            uploadedImages = {
              interior: [],
              exterior: [],
              location: [],
              other: []
            };
            updateHiddenField();
          } else {
            alert("Error posting project.");
          }
        })
        .catch(error => console.error("Error:", error));
    });
  });
</script>

@endpush