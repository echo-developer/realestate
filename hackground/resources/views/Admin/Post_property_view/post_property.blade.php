@extends('Admin.Post_property_view.layout_for_property_post')

@section('content')
    <section class="section post-page">
        <div class="container">
            <div class="row justify-content-center">
                <aside class="col-lg-12 col-12">
                    <div class="card border-0 post-form">
                        <div class="card-header pb-0">
                            <ul class="nav nav-underline mb-0 gap-5 d-flex">
                                <li class="nav-item">
                                    <a class="nav-link active" href="#">Personal Info</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Property Details</a>
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
                                        <input type="radio" class="btn-check" name="postAs" id="owner"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="owner"><img
                                                src="{{ asset('assets/icons/owner.png') }}" alt="Icon" height="24"
                                                width="24" />
                                            Owner</label>
                                        <input type="radio" class="btn-check" name="postAs" id="agent"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="agent"><img
                                                src="{{ asset('assets/icons/agent.png') }}" alt="Icon" height="24"
                                                width="24" />
                                            Agent</label>
                                        <input type="radio" class="btn-check" name="postAs" id="builder"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="builder"><img
                                                src="{{ asset('assets/icons/builder.png') }}" alt="Icon" height="24"
                                                width="24" /> Builder</label>
                                    </div>

                                    <div class="form-field mb-3">
                                        <label for="name" class="form-label">Name</label>
                                        <input type="text" class="form-control" name="name"
                                            placeholder="Enter Your Name">
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
                                        <p class="ps-3">Enter your <span class="text-green">WhatsApp Number</span> to get
                                            enqueries from buyer/tenant</p>
                                    </div>

                                    <div class="form-field mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" name="email" class="form-control"
                                            placeholder="Enter Your Email I’d">
                                        <span class="error emailError text-danger"></span>
                                    </div>

                                    <div class="d-grid">
                                        <button type="button" class="btn btn-primary btn-next-1">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>
                                <div id="step-2" style="display:none;">
                                    <label class="form-label">You are here to</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group">
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio1"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="btnradio1"><img
                                                src="images/icons/rent-3.png" alt="Icon" height="24"
                                                width="24" /> Rent</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio2"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="btnradio2"><img
                                                src="images/icons/sale-2.png" alt="Icon" height="24"
                                                width="24" /> Sale</label>
                                        <input type="radio" class="btn-check" name="postFor" id="btnradio3"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="btnradio3"><img
                                                src="images/icons/hostel.png" alt="Icon" height="24"
                                                width="24" /> PG/Hostel</label>
                                    </div>
                                    <label class="form-label">Property Type</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Basic radio toggle button group">
                                        <input type="radio" class="btn-check" name="propery_type" id="propery_1"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="propery_1">Flat</label>

                                        <input type="radio" class="btn-check" name="propery_type" id="propery_2"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="propery_2">House</label>

                                        <input type="radio" class="btn-check" name="propery_type" id="propery_3"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="propery_3">Villa</label>

                                        <input type="radio" class="btn-check" name="propery_type" id="propery_4"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="propery_4">Plot</label>

                                        <input type="radio" class="btn-check" name="propery_type" id="propery_5"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="propery_5">Penthouse</label>
                                    </div>
                                    <label class="form-label">Total No. Of Flats In Your Society </label>
                                    <div class="cart-plus-minus mb-4">
                                        <input type="text" class="form-control" value="1">
                                        <div class="minus qtybutton"><i class="icon-line-awesome-minus"></i></div>
                                        <div class="plus qtybutton"><i class="icon-line-awesome-plus"></i></div>
                                    </div>



                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-2"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="button" class="btn btn-primary btn-next-2">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>
                                <div id="step-3" style="display:none;">
                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">City</label>
                                                <select class="selectpicker hide-tick" data-width="fit" data-size="7"
                                                    title="Choose City">
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
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Locality</label>
                                                <select class="selectpicker hide-tick" data-width="fit" data-size="7"
                                                    title="Choose Locality">
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
                                        <label class="form-label">Name of Project Or Locality</label>
                                        <input type="text" class="form-control"
                                            placeholder="Enter Project Name Or Locality" />
                                    </div>
                                    <div class="form-field">
                                        <label class="form-label">Address</label>
                                        <textarea rows="3" class="form-control mb-2" placeholder="Enter Your Address"></textarea>
                                        <p class="text-end text-help">Maximum 300 words are allowed</p>
                                    </div>



                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-3"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="button" class="btn btn-primary btn-next-3">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>
                                <div id="step-4" style="display:none;">
                                    <div class="row gx-3">
                                        <div class="col-lg-3 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Bedrooms</label>
                                                <div class="cart-plus-minus mb-4">
                                                    <input type="text" class="form-control" value="2">
                                                    <div class="minus qtybutton"><i class="icon-line-awesome-minus"></i>
                                                    </div>
                                                    <div class="plus qtybutton"><i class="icon-line-awesome-plus"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Bathrooms</label>
                                                <div class="cart-plus-minus mb-4">
                                                    <input type="text" class="form-control" value="1">
                                                    <div class="minus qtybutton"><i class="icon-line-awesome-minus"></i>
                                                    </div>
                                                    <div class="plus qtybutton"><i class="icon-line-awesome-plus"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Kitchens</label>
                                                <div class="cart-plus-minus mb-4">
                                                    <input type="text" class="form-control" value="1">
                                                    <div class="minus qtybutton"><i class="icon-line-awesome-minus"></i>
                                                    </div>
                                                    <div class="plus qtybutton"><i class="icon-line-awesome-plus"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Carpet Area</label>
                                                <div class="input-group">
                                                    <select class="selectpicker" data-width="fit" title="sq ft">
                                                        <option>Acre</option>
                                                        <option>Hectare</option>
                                                        <option>sq ft</option>
                                                        <option>sq m</option>
                                                        <option>Sq-yrd</option>
                                                    </select>
                                                    <input type="text" class="form-control" placeholder="Type Area" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Plot Area</label>
                                                <div class="input-group">
                                                    <select class="selectpicker" data-width="fit" title="sq ft">
                                                        <option>Acre</option>
                                                        <option>Hectare</option>
                                                        <option>sq ft</option>
                                                        <option>sq m</option>
                                                        <option>Sq-yrd</option>
                                                    </select>
                                                    <input type="text" class="form-control" placeholder="Type Area" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row gx-3">
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Property Type</label>
                                                <select class="selectpicker">
                                                    <option selected="selected" disabled="disabled"></option>
                                                    <option>Residential</option>
                                                    <option>Commercial</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Property For</label>
                                                <select class="selectpicker" data-width="fit" data-size="7"
                                                    title="">
                                                    <optgroup label="Residential" data-max-options="2">
                                                        <option>Flats</option>
                                                        <option>House/Villa</option>
                                                        <option>Penthouse</option>
                                                        <option>Residential Plots</option>
                                                        <option>Bungalow</option>
                                                    </optgroup>
                                                    <optgroup label="Commercial" data-max-options="2">
                                                        <option>Office Space</option>
                                                        <option>Shop/Showroom</option>
                                                        <option>Warehouse</option>
                                                        <option>Commercial Plot</option>
                                                        <option>Industrial Land</option>
                                                        <option>Hotels</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <label class="form-label">Budget</label>
                                            <div class="form-field">
                                                <select class="selectpicker hide-tick1" data-width="fit" data-size="7">
                                                    <option>$99 - $199</option>
                                                    <option>$200 - $300</option>
                                                    <option>$301 - $499</option>
                                                    <option>$500 - $999</option>
                                                    <option>Above $1000</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-12">
                                            <div class="form-field">
                                                <label class="form-label">Parking</label>
                                                <select class="selectpicker" data-width="fit" title="">
                                                    <option>Available</option>
                                                    <option>Not Available</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <label class="form-label">Floors</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Floors">
                                        <input type="radio" class="btn-check" name="floors" id="floors_1"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="floors_1">Lower Basement</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_2"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_2">Upper Basement</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_3"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_3">Ground</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_4"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_4">1</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_5"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_5">2</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_6"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_6">3</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_7"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_7">4</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_8"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_8">5</label>

                                        <input type="radio" class="btn-check" name="floors" id="floors_6"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="floors_6"><i
                                                class="bi bi-plus-lg"></i></label>
                                    </div>

                                    <label class="form-label">Property Status</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Property Status">
                                        <input type="radio" class="btn-check" name="property_status"
                                            id="property_status_1" autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="property_status_1">Furnished</label>

                                        <input type="radio" class="btn-check" name="property_status"
                                            id="property_status_2" autocomplete="off">
                                        <label class="btn btn-outline-light"
                                            for="property_status_2">Semi-Furnished</label>

                                        <input type="radio" class="btn-check" name="property_status"
                                            id="property_status_3" autocomplete="off">
                                        <label class="btn btn-outline-light" for="property_status_3">Unfurnished</label>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Is This A Corner Plot :</label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="plot" id="plot1"
                                                value="option1">
                                            <label class="form-check-label" for="plot1">Yes</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="plot" id="plot2"
                                                value="option2">
                                            <label class="form-check-label" for="plot2">No</label>
                                        </div>
                                    </div>

                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-4"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="button" class="btn btn-primary btn-next-4">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>

                                <div id="step-5" style="display:none;">
                                    <div class="mb-3">
                                        <label class="form-label">Possession Status :</label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="pstatus" id="pstatus1"
                                                value="option1">
                                            <label class="form-check-label" for="pstatus1">Under Construction</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="pstatus" id="pstatus2"
                                                value="option2">
                                            <label class="form-check-label" for="pstatus2">Ready to Move</label>
                                        </div>
                                    </div>

                                    <label class="form-label">Age Of Construction :</label>
                                    <div class="btn-group btn-group-light d-flex mb-3" role="group"
                                        aria-label="Floors">
                                        <input type="radio" class="btn-check" name="age" id="age_1"
                                            autocomplete="off" checked>
                                        <label class="btn btn-outline-light" for="age_1">New</label>

                                        <input type="radio" class="btn-check" name="age" id="age_2"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_2">Less Than 5 Years</label>

                                        <input type="radio" class="btn-check" name="age" id="age_3"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_3">5-10 Years</label>

                                        <input type="radio" class="btn-check" name="age" id="age_4"
                                            autocomplete="off">
                                        <label class="btn btn-outline-light" for="age_4">10-15 Years</label>

                                        <input type="radio" class="btn-check" name="age" id="age_5"
                                            autocomplete="off">
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
                                                <input type="text" class="form-control"
                                                    placeholder="Enter Token Amount" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-5"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="button" class="btn btn-primary btn-next-5">Next <i
                                                class="bi bi-arrow-right"></i></button>
                                    </div>
                                </div>
                                <div id="step-6" style="display:none;">
                                    <div class="form-field">
                                        <div class="upload-area" id="uploadfile">
                                            <input type="file" name="fileinput" id="fileinput" multiple="true">
                                            <i class="bi bi-upload"></i>
                                            <p>Drag &amp; drop file here
                                                or
                                                <span class="text-site">click</span> to select file
                                            </p>
                                        </div>
                                        <p class="text-help">Accepted formats are .jpg, .gif, .bmp & .png. Maximum size
                                            allowed is 20 MB. Minimum dimension allowed 600*400 Pixel</p>
                                    </div>
                                    <div class="form-field">
                                        <label class="form-label">Description</label>
                                        <textarea rows="3" class="form-control" placeholder="Write something..."></textarea>
                                    </div>
                                    <div class="upload-gallery">
                                        <div class="pic"> <img src="images/uploads/property-1.jpg" alt="Property" />
                                            <a href="" class="btn-trash"><i class="icon-feather-trash"></i></a>
                                        </div>
                                        <div class="pic"> <img src="images/uploads/property-2.jpg" alt="Property" />
                                            <a href="" class="btn-trash"><i class="icon-feather-trash"></i></a>
                                        </div>
                                        <div class="pic"> <img src="images/uploads/property-3.jpg" alt="Property" />
                                            <a href="" class="btn-trash"><i class="icon-feather-trash"></i></a>
                                        </div>
                                        <div class="pic"> <img src="images/uploads/property-4.jpg" alt="Property" />
                                            <a href="" class="btn-trash"><i class="icon-feather-trash"></i></a>
                                        </div>
                                    </div>

                                    <div class="d-grid columns-2">
                                        <button type="button" class="btn btn-secondary btn-back-6"><i
                                                class="bi bi-arrow-left"></i> Back</button>
                                        <button type="submit" class="btn btn-primary btn-next-6">Post Property</button>
                                    </div>
                                </div>
                            </form>
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
    </script>
@endpush
