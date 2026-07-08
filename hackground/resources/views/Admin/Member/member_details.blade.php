@extends('Admin.layouts.app')
@php
    // log_anything($data);
    // log_anything($cities);

    $serviceAreas = $data->serviceArea;
    $social = $data->social;
@endphp
@push('custom-css')
    <style>
        #user_image_preview {
            border-radius: 0.5rem;
        }
    </style>
@endpush
@section('content')
<style>
    /* Premium Profile Design */
    .profile-card { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 1.5rem; background: #fff; overflow: hidden; }
    .profile-header { padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.75rem; }
    .profile-header h5 { margin: 0; font-size: 1.05rem; font-weight: 700; color: #1e293b; }
    .profile-header i { font-size: 1.2rem; color: #3b82f6; }
    .profile-body { padding: 1.5rem; }
    
    /* Image Upload UI */
    .avatar-wrapper { position: relative; width: 120px; height: 120px; margin: 0 auto; border-radius: 50%; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); border: 4px solid #fff; }
    .avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); padding: 0.4rem 0; text-align: center; cursor: pointer; opacity: 0; transition: opacity 0.3s; }
    .avatar-wrapper:hover .avatar-overlay { opacity: 1; }
    .avatar-overlay i { color: #fff; font-size: 1.2rem; }
    
    /* Form Control Additions */
    .form-control, .form-select { border-radius: 8px; border: 1px solid #cbd5e1; padding: 0.5rem 0.85rem; transition: all 0.2s; box-shadow: none; font-size: 0.95rem; height: 45px; }
    .form-select { padding-right: 2.25rem; }
    textarea.form-control { height: auto; }
    .form-control:focus, .form-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); z-index: 5; }
    .premium-label { font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 0.4rem; display: block; }
    
    /* Input Group Fixes */
    .input-group { display: flex; align-items: stretch; }
    .input-group > .form-select { border-top-right-radius: 0; border-bottom-right-radius: 0; flex: 0 0 auto; width: auto; max-width: 110px; }
    .input-group > .form-control { border-top-left-radius: 0; border-bottom-left-radius: 0; margin-left: -1px; flex: 1 1 auto; }
    
    /* Add More Dynamic Sub-Cards */
    .dynamic-field-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; position: relative; transition: all 0.2s; }
    .dynamic-field-block:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .btn-remove-dynamic { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; background: #fee2e2; color: #ef4444; border: none; transition: all 0.2s; }
    .btn-remove-dynamic:hover { background: #fecaca; color: #dc2626; }
    .btn-add-premium { border-radius: 50px; padding: 0.5rem 1.25rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; }
</style>

<div class="app-main__inner">
    <!-- Header -->
    <div class="app-page-title mb-4">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-user icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>User Profile
                    <div class="page-title-subheading">Manage details, contact info, and preferences.</div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">User Profile</li>
                </ol>
            </div>
        </div>
    </div>

    @if (session('success_msg'))
        <div class="alert alert-{{ session('message_type') }} alert-dismissible fade show shadow-sm border-0" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> {{ session('success_msg') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @endif

    <form method="POST" action="{{ route('save.user.details') }}" enctype="multipart/form-data">
        @csrf
        <input type="hidden" name="user_id" value="{{ $data?->id }}">
        <input type="hidden" name="user_type" value="{{ $data?->user_type }}">
        <input type="hidden" id="uploaded_user_photo" name="uploaded_user_photo" value="{{ !empty($data->image) ? $data->image : null }}">

        <div class="row">
            <!-- Left Column: Identity -->
            <div class="col-lg-4">
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="bi bi-person-badge"></i>
                        <h5>Identity</h5>
                    </div>
                    <div class="profile-body text-center">
                        <div class="avatar-wrapper mb-4">
                            <img id="user_image_preview" src="{{ !empty($data->image_url) ? $data->image_url : asset('user_upload/profile_image/user.jpg') }}" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name=User&background=f8fafc';" alt="User">
                            <label for="photo" class="avatar-overlay m-0">
                                <i class="bi bi-camera"></i>
                            </label>
                        </div>
                        <input type="file" name="photo" id="photo" class="d-none">
                        <div class="text-danger mt-1 small" id="photo-error"></div>

                        <div class="mb-3 text-start mt-3">
                            <label for="name" class="premium-label">Full Name</label>
                            <input type="text" name="name" id="name" class="form-control" placeholder="Enter Full Name" value="{{ old('name', $data?->name ?? '') }}">
                        </div>
                        <div class="mb-2 text-start">
                            <label for="email" class="premium-label">Email Address</label>
                            <input type="email" name="email" id="email" class="form-control" placeholder="Enter Email Address" value="{{ old('email', $data?->email ?? '') }}">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Details -->
            <div class="col-lg-8">
                <!-- Contact & Location Card -->
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="bi bi-geo-alt"></i>
                        <h5>Contact & Location</h5>
                    </div>
                    <div class="profile-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="phone" class="premium-label">Phone Number</label>
                                <div class="input-group">
                                    <select name="phone_code" id="phone_code" class="form-select" style="max-width: 110px; background-color: #f8fafc;">
                                        <option value="IND +91" {{ old('phone_code', $data?->phone_code ?? '') === 'IND +91' ? 'selected' : '' }}>+91</option>
                                        <option value="+71" {{ old('phone_code', $data?->phone_code ?? '') === '+71' ? 'selected' : '' }}>+71</option>
                                        <option value="+81" {{ old('phone_code', $data?->phone_code ?? '') === '+81' ? 'selected' : '' }}>+81</option>
                                        <option value="+30" {{ old('phone_code', $data?->phone_code ?? '') === '+30' ? 'selected' : '' }}>+30</option>
                                    </select>
                                    <input type="number" name="phone" id="phone" class="form-control" placeholder="Phone Number" value="{{ old('phone', $data?->phone ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="w_number" class="premium-label">WhatsApp Number</label>
                                <input type="number" name="w_number" id="w_number" class="form-control" placeholder="WhatsApp Number" value="{{ old('w_number', $data?->whatsapp_no ?? '') }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="address" class="premium-label">Full Address</label>
                                <input type="text" name="address" id="address" class="form-control" placeholder="Address" value="{{ old('address', $data?->userAdditional?->address ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="city" class="premium-label">City</label>
                                <select name="city" id="city" class="form-select">
                                    <option value="" disabled>- Select City -</option>
                                    @foreach ($cities as $city)
                                        <option value="{{ $city->city_id }}" {{ $data?->userAdditional?->city == $city->city_id ? 'selected' : '' }}>{{ $city->name }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Web & Bio Card -->
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="bi bi-globe"></i>
                        <h5>Web Profile & Biography</h5>
                    </div>
                    <div class="profile-body">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="web_title" class="premium-label">Website Title</label>
                                <input type="text" name="web_title" id="web_title" class="form-control" placeholder="Website Title" value="{{ old('web_title', $data?->userAdditional?->website_title ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="web_url" class="premium-label">Website URL</label>
                                <input type="text" name="web_url" id="web_url" class="form-control" placeholder="https://" value="{{ old('web_url', $data?->userAdditional?->website_url ?? '') }}">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="comment" class="premium-label">Biography / Additional Comments</label>
                            <textarea name="comment" id="comment" class="form-control" placeholder="Write a short biography..." style="height: 100px">{{ old('comment', $data?->userAdditional?->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                <!-- Agent Specific Details -->
                @if ($data?->user_type === 'A')
                <div class="profile-card border-primary" style="border: 1px solid #bfdbfe;">
                    <div class="profile-header bg-primary text-white" style="border-bottom: none;">
                        <i class="bi bi-briefcase text-white"></i>
                        <h5 class="text-white">Agent Professional Details</h5>
                    </div>
                    <div class="profile-body bg-light">
                        <div class="row align-items-center mb-4">
                            <div class="col-md-6 mb-3 mb-md-0">
                                <label class="premium-label mb-2 text-muted">Broker Type</label>
                                <div class="btn-group w-100" role="group">
                                    <input type="radio" class="btn-check" name="broker_type" id="indipendent" value="I" {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'I' ? 'checked' : '' }}>
                                    <label class="btn btn-outline-primary" for="indipendent">Independent</label>
                                  
                                    <input type="radio" class="btn-check" name="broker_type" id="agency" value="A" {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'A' ? 'checked' : '' }}>
                                    <label class="btn btn-outline-primary" for="agency">Agency</label>
                                  
                                    <input type="radio" class="btn-check" name="broker_type" id="franchise" value="F" {{ old('broker_type', $data?->agentAdditional?->broker_type) == 'F' ? 'checked' : '' }}>
                                    <label class="btn btn-outline-primary" for="franchise">Franchise</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="premium-label mb-2 text-muted">Certification / Document</label>
                                <div class="d-flex align-items-center gap-2">
                                    <input type="file" name="agent_doc" id="agent_doc" data-id="{{ $data?->id }}" class="form-control form-control-sm" accept=".pdf,.jpeg,.jpg,.png">
                                    @if (!empty($data?->agentAdditional?->agent_doc))
                                        <a href="{{ asset('user_upload/agent_docs/' . $data->agentAdditional->agent_doc) }}" target="_blank" class="btn btn-primary btn-sm px-3" id="previewDocBtn">View</a>
                                    @endif
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Company Name</label>
                                <input type="text" name="company_name" class="form-control" placeholder="Company Name" value="{{ old('company_name', $data?->agentAdditional?->company_name ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">License Number</label>
                                <input type="text" name="license_no" class="form-control" placeholder="License Number" value="{{ old('license_no', $data?->agentAdditional?->license_no ?? '') }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Years of Experience</label>
                                <input type="number" name="experience_yr" class="form-control" placeholder="Years of Experience" value="{{ old('experience_yr', $data?->agentAdditional?->experience_yr ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Specialization</label>
                                <input type="text" name="specialization" class="form-control" placeholder="Specialization" value="{{ old('specialization', $data?->agentAdditional?->specialization ?? '') }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Business Phone</label>
                                <input type="number" name="bussiness_phone" class="form-control" placeholder="Business Phone" value="{{ old('bussiness_phone', $data?->agentAdditional?->bussiness_phone ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Business Email</label>
                                <input type="email" name="bussiness_email" class="form-control" placeholder="Business Email" value="{{ old('bussiness_email', $data?->agentAdditional?->bussiness_email ?? '') }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Opening Hours</label>
                                <input type="time" step="60" name="opening_hours" id="opening_hours" class="form-control" value="{{ old('opening_hours', $data?->agentAdditional?->opening_hours ?? '') }}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="premium-label">Closing Hours</label>
                                <input type="time" step="60" name="closing_hours" id="closing_hours" class="form-control" value="{{ old('closing_hours', $data?->agentAdditional?->closing_hours ?? '') }}">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Service Areas -->
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="bi bi-map"></i>
                        <h5>Service Areas</h5>
                    </div>
                    <div class="profile-body">
                        <div id="business-address-wrapper"></div>
                        <div class="text-center mt-3">
                            <button type="button" class="btn btn-outline-primary btn-add-premium" id="add-more-btn">
                                <i class="bi bi-plus-lg"></i> Add Service Area
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Social Platforms -->
                <div class="profile-card">
                    <div class="profile-header">
                        <i class="bi bi-share"></i>
                        <h5>Social Platforms</h5>
                    </div>
                    <div class="profile-body">
                        <div id="business-social-wrapper"></div>
                        <div class="text-center mt-3">
                            <button type="button" class="btn btn-outline-primary btn-add-premium" id="add-more-btn-social">
                                <i class="bi bi-plus-lg"></i> Add Social Profile
                            </button>
                        </div>
                    </div>
                </div>
                @endif
                
                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-3 mt-4 mb-5">
                    <a href="{{ url()->previous() }}" class="btn btn-light border px-4 py-2 fw-semibold">Cancel</a>
                    <button type="submit" class="btn btn-success px-5 py-2 fw-bold shadow-sm">Save Profile</button>
                </div>
                
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
                    console.log(item);
                const div = document.createElement("div");
                div.className = "dynamic-field-block address-field";
                div.id = `field-${fieldCount}`;
                div.setAttribute("data-field-id", "");

                const cityOptions = cities.map(city => `
            <option value="${city.city_id}" ${city.city_id == cityId ? 'selected' : ''}>${city.name}</option>`).join('');

                div.innerHTML = `
            <div class="row gx-3">
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="premium-label">City</label>
                    <select name="service_area[city_id][]" class="form-select">
                        <option value="">Select City</option>
                        ${cityOptions}
                    </select>
                </div>
                <div class="col-md-5 position-relative locality-col">
                     <label class="premium-label">Locality</label>
                     <input type="text" name="service_area[locality_id][]" class="form-control service_area" placeholder="Locality" value="${locality.locality_name || locality || ''}">
                </div>
                <div class="col-md-2 d-flex align-items-end justify-content-end mt-3 mt-md-0">
                    <input type="hidden" name="service_area[field_unique_key][]" value="${locKey}">
                    ${index > 0 ? '<button type="button" class="btn-remove-dynamic remove-field"><i class="bi bi-trash"></i></button>' : ''}
                </div>
            </div>
`;

                parentSeviceArea.appendChild(div);
                fieldCount++;

                function debounce(fn, delay) {
                let timeoutId;
                return function(...args) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => fn.apply(this, args), delay);
                };
            }
    

            const localityInput = document.querySelectorAll('.service_area');
            const arr = [...localityInput];

            // const suggesstionList = document.createElement('ul');
            // suggesstionList.className = 'list-group position-absolute w-100 shadow d-none';

            // localityInput.parentElement.classList.add('position-relative');
            // localityInput.parentElement.appendChild(suggestionList);

            arr.forEach(item => {
                const suggestionList = document.createElement('ul');
                suggestionList.className = 'list-group position-absolute w-100 shadow';
                suggestionList.style.zIndex = '100';

                const col = item.closest('.locality-col');
                    if (col) {
                        col.appendChild(suggestionList);
                    }

                    console.log("suggestionList", suggestionList)
                item.addEventListener('keyup', debounce(function() {
                    fetch(`https://realestate.scriptlisting.com/hackground/api/stored-localities?keyWord=${this.value}`).then(res => res.json()).then(data => {
                        if(data && data.status == 1) {
                            data.data.forEach((locality) => {
                                const li = document.createElement('li');
                                li.className = 'list-group-item list-group-item-action';
                                li.textContent = locality.name;
                                console.log('locality loop', locality);
                                console.log("li", li)
                                li.addEventListener("click", function() {
                                    item.value = locality.name; 
                                    suggestionList.classList.add('d-none')
                                })
                                suggestionList.appendChild(li);
                            })
                            suggestionList.classList.remove('d-none')
                            console.log("suggestionList", suggestionList)
                        }
                    })
                }, 300))
            })
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
                div.className = "dynamic-field-block social-field";
                div.id = `field-${fieldCountSocial}`;
                div.setAttribute("data-field-id", "");

                div.innerHTML = `
            <div class="row gx-3">
                <div class="col-md-5 mb-3 mb-md-0">
                    <label class="premium-label">Platform Name</label>
                    <input type="text" name="social_platform[platform_name][]" placeholder="Platform Name" class="form-control" value="${platform_name}">
                </div>
                <div class="col-md-5">
                    <label class="premium-label">Platform URL</label>
                    <input type="text" name="social_platform[platform_url][]" placeholder="https://" class="form-control" value="${platform_url}">
                </div>
                <div class="col-md-2 d-flex align-items-end justify-content-end mt-3 mt-md-0">
                    <input type="hidden" name="social_platform[field_unique_key][]" value="${platform_key}">
                    ${index > 0 ? '<button type="button" class="btn-remove-dynamic remove-field-social"><i class="bi bi-trash"></i></button>' : ''}
                </div>
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
