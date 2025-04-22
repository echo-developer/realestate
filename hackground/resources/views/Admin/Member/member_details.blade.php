@extends('Admin.layouts.app')
@php
    // log_anything($data);
    // log_anything($cities);
    $serviceAreas = $data->serviceArea;
    $social = $data->social;
@endphp
@push('custom-css')
    <style>
        .card {
            width: 1200px;
            margin: 1rem auto;
            background: #fff;
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        #user_image_preview {
            border-radius: 0.5rem;
        }
    </style>
@endpush
@section('content')
    <div class="card w-[700px] mx-auto bg-white p-6 rounded shadow-md">
        <div class="row mb-4 justify-content-between">
            <div class="col-7">
                <h2 class="text-xl font-semibold mb-2">User Details</h2>
                <p class="text-sm text-gray-600 mb-4">Update your profile information below.</p>
            </div>
            <div class="col-3">
                <div class="mb-4 text-center">
                    <img id="user_image_preview"
                        src="{{ !empty($data->image_url) ? $data->image_url : asset('user_upload/profile_image/user.jpg') }}"
                        alt="User Image" class="" height="150">
                </div>
                <input type="file" name="photo" id="photo" class="form-control">
                <div class="text-danger mt-1" id="photo-error"></div>
            </div>

        </div>

        @if (session('success_msg'))
            <div class="alert alert-{{ session('message_type') }}">
                {{ session('success_msg') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">x</button>
            </div>
        @endif
        <form method="POST" action="{{ route('save.user.details') }}" enctype="multipart/form-data" class="container mt-4">
            @csrf
            <h4><strong>Basic details</strong></h4>
            <hr>
            <!-- First Name and Last Name -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" name="name" id="name" class="form-control"
                        value="{{ old('name', $data?->name ?? '') }}">
                    <input type="hidden" name="user_id" value="{{ $data?->id }}">
                    <input type="hidden" name="user_type" value="{{ $data?->user_type }}">
                </div>
                <input type="hidden" id="uploaded_user_photo" name="uploaded_user_photo"
                    value="{{ !empty($data->image) ? $data->image : null }}">
                <div class="col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" name="email" id="email" class="form-control"
                        value="{{ old('email', $data?->email ?? '') }}">
                </div>
            </div>

            <!-- Email and Phone -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <label for="phone" class="form-label">Phone</label>
                    <div class="d-flex align-items-center">
                        <select name="phone_code" id="phone_code" class="form-select me-2 form-control"
                            style="max-width: 100px;">
                            <option value="IND +91"
                                {{ old('phone_code', $data?->phone_code ?? '') === 'IND +91' ? 'selected' : '' }}>+91
                            </option>
                            <option value="+71"
                                {{ old('phone_code', $data?->phone_code ?? '') === '+71' ? 'selected' : '' }}>+71</option>
                            <option value="+81"
                                {{ old('phone_code', $data?->phone_code ?? '') === '+81' ? 'selected' : '' }}>+81</option>
                            <option value="+30"
                                {{ old('phone_code', $data?->phone_code ?? '') === '+30' ? 'selected' : '' }}>+30</option>
                        </select>

                        <input type="number" name="phone" id="phone" class="form-control"
                            placeholder="Enter your phone number" value="{{ old('phone', $data?->phone ?? '') }}">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="w_number" class="form-label">Whatsapp Number</label>
                    <input type="number" name="w_number" id="w_number" class="form-control"
                        value="{{ old('w_number', $data?->whatsapp_no ?? '') }}">
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-6">
                    <label for="address" class="form-label">Address</label>
                    <input type="text" name="address" id="address" class="form-control"
                        value="{{ old('address', $data?->userAdditional?->address ?? '') }}">
                </div>
                <div class="col-md-6">
                    <label for="city" class="form-label">City</label>
                    <select name="city" id="city" class="form-control">
                        <option value="kolkata">kolkata</option>
                        <option value="varanasi">Varanasi</option>
                    </select>

                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-6">
                    <label for="web_title" class="form-label">Website Title</label>
                    <input type="text" name="web_title" id="web_title" class="form-control"
                        value="{{ old('web_title', $data?->userAdditional?->website_title ?? '') }}">
                </div>

                <div class="col-md-6">
                    <label for="web_url" class="form-label">Website Url</label>
                    <input type="text" name="web_url" id="web_url" class="form-control"
                        value="{{ old('web_url', $data?->userAdditional?->website_url ?? '') }}">
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-12">
                    <label for="comment" class="form-label">Comment</label>
                    <textarea name="comment" id="comment" class="form-control">{{ old('comment', $data?->userAdditional?->description ?? '') }}</textarea>
                </div>

            </div>

            <!-- Start Agent Only Section -->
            @if ($data?->user_type === 'A')
                <h5><strong>Agent Additional Details</strong></h5>
                <hr>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Broker Type</label><br>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="broker_type" id="indipendent"
                                value="I"
                                {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'I' ? 'checked' : '' }}>
                            <label class="form-check-label" for="indipendent">Independent</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="broker_type" id="agency"
                                value="A"
                                {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'A' ? 'checked' : '' }}>
                            <label class="form-check-label" for="agency">Agency</label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="broker_type" id="franchise"
                                value="F"
                                {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'F' ? 'checked' : '' }}>
                            <label class="form-check-label" for="franchise">Franchise</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Upload Certificate/Document</label>
                        <input type="file" name="agent_doc" id="agent_doc" data-id ="{{ $data?->id }}"
                            class="form-control" accept=".pdf,.jpeg,.jpg,.png">

                        @if (!empty($data?->agentAdditional?->agent_doc))
                            <a href="{{ asset('user_upload/agent_docs/' . $data->agentAdditional->agent_doc) }}"
                                target="_blank" class="btn btn-sm btn-primary mt-2" id="previewDocBtn">
                                View Doc
                            </a>
                        @else
                            <button type="button" class="btn btn-sm btn-primary mt-2 d-none"
                                id="previewDocBtn">View</button>
                        @endif
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Company Name</label>
                        <input type="text" name="company_name" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->company_name ?? '') }}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">License Number</label>
                        <input type="text" name="license_no" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->license_no ?? '') }}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Years of Experience</label>
                        <input type="number" name="experience_yr" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->experience_yr ?? '') }}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Specialization</label>
                        <input type="text" name="specialization" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->specialization ?? '') }}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Bussiness phone</label>
                        <input type="number" name="bussiness_phone" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->bussiness_phone ?? '') }}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Bussiness Email</label>
                        <input type="email" name="bussiness_email" class="form-control"
                            value="{{ old('address', $data?->agentAdditional?->bussiness_email ?? '') }}">
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Opening Hours</label><br>
                        <input type="time" step="60" name="opening_hours" id="opening_hours"
                            class="form-control"
                            value="{{ old('opening_hours', $data?->agentAdditional?->opening_hours ?? '') }}">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Closing Hours</label>
                        <input type="time" step="60" name="closing_hours" id="closing_hours"
                            class="form-control"
                            value="{{ old('closing_hours', $data?->agentAdditional?->closing_hours ?? '') }}">
                    </div>
                </div>
                <br>
                <hr>
                <label for="">Service Area</label>
                <div id="business-address-wrapper">
                    {{-- <div class="row mb-3 address-field" id="field-1" data-field-id="">
                        <div class="col">
                            <select name="service_area[city_id][]" class="form-control me-2">
                                <option value="">Select City</option>
                                @foreach ($cities as $city)
                                    <option value="{{ $city->city_id }}">{{ $city->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col">
                            <select name="service_area[locality_id][]" class="form-control me-2">
                                <option value="">Locality</option>
                                <option value="1">Kasba</option>
                            </select>
                        </div>
                        <div class="col-auto">
                            <input type="hidden" name="service_area[field_unique_key][]" value="service_1">
                        </div>
                    </div> --}}
                </div>

                <div class="text-start">
                    <button type="button" class="btn btn-primary mb-2" id="add-more-btn">Add More</button>
                </div>
                <hr>
                <br>
                <label for="">Social Platform</label>
                <div id="business-social-wrapper">

                </div>

                <div class="text-start">
                    <button type="button" class="btn btn-primary mb-2" id="add-more-btn-social">Add More</button>
                    {{-- <button type="button" class="btn btn-danger remove-field-social">🗑️</button> --}}
                </div>
                <hr>
            @endif
            <!-- End Agent Only Section -->


            <!-- Save Button -->
            <div class="row">
                <div class="col-12 text-end">
                    <button type="submit" class="btn btn-success">Save</button>
                </div>
            </div>
        </form>

    </div>
@endsection

@push('custom-js')
    <script>
        $(document).ready(function() {
            const cities = @json($cities);
            const serviceAreas = @json($serviceAreas ?? []);
            const social = @json($social ?? []);
            const parentSeviceArea = document.getElementById('business-address-wrapper')
            const parentSocial = document.getElementById('business-social-wrapper')
            const serviceAddMoreBtn = document.getElementById("add-more-btn");
            const socialAddMoreBtn = document.getElementById("add-more-btn-social");

            let fieldCount = 1;
            let fieldCountSocial = 1;

            if (serviceAreas.length === 0) {
                serviceAreas.push({
                    "loc_key": "",
                    "city": "",
                    "locality": "",
                    "latitude": "",
                    "longitude": ""
                });
            }

            if (social.length === 0) {
                social.push({
                    "platform_key": "",
                    "platform_name": "",
                    "platform_url": "",
                });
            }


            function appendServiceAreaField(item = {}, index = fieldCount) {
                const locKey = item.loc_key || `service_${fieldCount}`;
                const cityId = item.city || "";
                const locality = item.locality || "";

                const div = document.createElement("div");
                div.className = "row mb-3 address-field";
                div.id = `field-${fieldCount}`;
                div.setAttribute("data-field-id", "");

                const cityOptions = cities.map(city => `
            <option value="${city.city_id}" ${city.city_id == cityId ? 'selected' : ''}>${city.name}</option>
        `).join('');

                div.innerHTML = `
            <div class="col">
                <select name="service_area[city_id][]" class="form-control me-2">
                    <option value="">Select City</option>
                    ${cityOptions}
                </select>
            </div>
            <div class="col">
                 <input type="text" name="service_area[locality_id][]" class="form-control me-2" placeholder="Locality" value="${locality}">
            </div>
            <div class="col-auto">
                <input type="hidden" name="service_area[field_unique_key][]" value="${locKey}">
                ${index > 0 ? '<button type="button" class="btn btn-danger remove-field">🗑️</button>' : ''}
            </div>
        `;

                parentSeviceArea.appendChild(div);
                fieldCount++;
            }

            serviceAreas.forEach((sa, i) => appendServiceAreaField(sa, i));


            serviceAddMoreBtn.addEventListener("click", () => {
                appendServiceAreaField();
            });


            $(document).on('click', '.remove-field', function() {
                $(this).closest('.address-field').remove();
                fieldCount--;
            });



            function appendSocialPaltFormField(item = {}, index = fieldCountSocial) {
                const platform_key = item.platform_key || `social_${fieldCountSocial}`;
                const platform_name = item.platform_name || "";
                const platform_url = item.platform_url || "";

                const div = document.createElement("div");
                div.className = "row mb-3 social-field";
                div.id = `field-${fieldCountSocial}`;
                div.setAttribute("data-field-id", "");

                div.innerHTML = `
                        <div class="col">
                            <input type="text" name="social_platform[platform_name][]" placeholder='Paltform Name'
                                class="form-control me-2" value="${platform_name}">
                        </div>
                        <div class="col">
                            <input type="text" name="social_platform[platform_url][]" placeholder='Paltform URL'
                                class="form-control me-2" value="${platform_url}"">
                        </div>
                        <div class="col-auto">
                            <input type="hidden" name="social_platform[field_unique_key][]" value="${platform_key}">
                            ${index > 0 ? '<button type="button" class="btn btn-danger remove-field-social">🗑️</button>' : ''}
                        </div>
        `;
                parentSocial.appendChild(div);
                fieldCountSocial++;
            }

            social.forEach((s, i) => appendSocialPaltFormField(s, i));

            socialAddMoreBtn.addEventListener("click", () => {
                appendSocialPaltFormField();
            });


            $(document).on('click', '.remove-field-social', function() {
                $(this).closest('.social-field').remove();
                fieldCount--;
            });

        });


        $('#agent_doc').on('change', function() {
            let fileInput = this.files[0];
            if (!fileInput) return;

            let formData = new FormData();
            formData.append('file', fileInput);
            formData.append('user_id', $('#agent_doc').data('id'));

            $.ajax({
                url: '{{ route('agent.doc.upload') }}',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.success === 1 && res.doc_url) {
                        toastr.success('Document Upload', 'Request Success', toastrOptions);

                        let $btn = $('#previewDocBtn');

                        if ($btn.is('a')) {
                            $btn.attr('href', res.doc_url).removeClass('d-none');
                        } else {
                            let $newBtn = $('<a>', {
                                id: 'previewDocBtn',
                                href: res.doc_url,
                                target: '_blank',
                                class: 'btn btn-sm btn-primary mt-2',
                                text: 'View Doc'
                            });

                            $btn.replaceWith($newBtn);
                        }
                    } else {
                        toastr.error('Something went wrong during upload', 'Request Failed',
                            toastrOptions);
                    }
                },
                error: function() {
                    toastr.error('Something went wrong during upload', 'Request Failed',
                        toastrOptions);
                }
            });
        });


        $('#photo').on('change', function(event) {
            var file = event.target.files[0];

            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#user_image_preview').attr('src', e.target.result).show();
                };
                reader.readAsDataURL(file);

                var formData = new FormData();
                formData.append('file', file);

                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

                $.ajax({
                    url: `{{ url('/member/memberUSer-image') }}`, // same route
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        console.log('File uploaded successfully');
                        $('#uploaded_user_photo').val(response
                            .fileName);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error uploading file:', error);
                        if (xhr.status === 422) {
                            const response = xhr.responseJSON;
                            if (response.errors && response.errors.file) {
                                $('#photo-error').text(response.errors.file[0]);
                            }
                        }
                    }
                });
            }
        });
    </script>
@endpush
