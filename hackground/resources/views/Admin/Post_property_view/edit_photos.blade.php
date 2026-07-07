@extends('Admin.layouts.app')
@push('custom-css')
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">
<style>
    /* ── Photo page ── */
    .photo-tab-pill { display: inline-flex; align-items: center; gap: 6px; padding: 0.45rem 0.9rem; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
    .photo-tab-pill.active { background: #2563eb; color: #fff; border-color: #2563eb; box-shadow: 0 2px 8px rgba(37,99,235,.25); }
    .photo-tab-pill:not(.active):hover { background: #f1f5f9; border-color: #cbd5e1; color: #334155; }
    .photo-tab-pill i { font-size: 0.95rem; }
    .photo-tabs-wrapper { display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
    .photo-tabs-wrapper::-webkit-scrollbar { display: none; }

    /* Upload dropzone tile (matches image tile size) */
    .upload-dropzone-tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 100%; aspect-ratio: 4/3; border: 2px dashed #bfdbfe; border-radius: 10px; background: #f8faff; cursor: pointer; transition: all .2s; text-align: center; padding: 1rem; }
    .upload-dropzone-tile:hover { border-color: #2563eb; background: #eff6ff; }
    .upload-dropzone-tile i { font-size: 2rem; color: #6366f1; }
    .upload-dropzone-tile .dz-text { font-size: 0.75rem; font-weight: 600; color: #475569; line-height: 1.3; }
    .upload-dropzone-tile small { font-size: 0.7rem; color: #94a3b8; }
    .upload-dropzone-tile .dz-browse-btn { background: #fff; border: 1.5px solid #2563eb; color: #2563eb; border-radius: 6px; padding: 0.3rem 0.9rem; font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: all .2s; margin-top: 2px; }
    .upload-dropzone-tile:hover .dz-browse-btn { background: #2563eb; color: #fff; }

    /* Gallery grid */
    .gallery-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 4/3; background: #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,.08); transition: transform .2s, box-shadow .2s; }
    .gallery-item:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.13); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .gallery-item .gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background .2s; display: flex; align-items: flex-start; justify-content: space-between; padding: 7px; }
    .gallery-item:hover .gallery-overlay { background: rgba(0,0,0,0.28); }
    .gallery-item .badge-featured { background: #2563eb; color: #fff; font-size: 0.63rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: .3px; }
    .gallery-item .btn-delete { background: #ef4444; color: #fff; border: none; border-radius: 6px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; cursor: pointer; opacity: 0; transition: opacity .2s; }
    .gallery-item:hover .btn-delete { opacity: 1; }
    .gallery-item .file-info { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,.7), transparent); color: #fff; font-size: 0.65rem; padding: 12px 7px 5px; display: flex; align-items: center; gap: 3px; }
    .gallery-empty { border: 2px dashed #e2e8f0; border-radius: 10px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 0.8rem; }

    /* Info banner */
    .info-banner { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 0.6rem 1rem; font-size: 0.81rem; color: #1d4ed8; display: flex; align-items: center; gap: 8px; }
    .info-banner i { font-size: 0.95rem; flex-shrink: 0; }

    /* Description textarea */
    .desc-textarea { border-radius: 10px; border: 1.5px solid #e2e8f0; resize: none; font-size: 0.875rem; transition: border-color .2s; }
    .desc-textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.1); outline: none; }
    .char-counter { font-size: 0.73rem; color: #94a3b8; text-align: right; }
</style>
@endpush

@section('content')
<div class="app-main__inner mb-3">

    {{-- Header --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                <i class="bi bi-house-gear fs-4"></i>
            </div>
            <div>
                <h4 class="mb-1 fw-bold">Property Edit</h4>
                <div class="text-muted small fw-medium">Property &gt; Property Edit</div>
            </div>
        </div>
        <div class="text-muted small fw-medium">
            <a href="{{ url('/') }}" class="text-decoration-none text-primary">Home</a> &gt; Property Edit
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            {{-- Tabs & Back --}}
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <ul class="nav nav-underline border-0" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link text-muted fw-medium" href="{{ url('property/edit/'.$property_id) }}">Property Details</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active fw-bold text-primary" href="{{ url('property/edit-photos/'.$property_id) }}">Property Photos</a>
                    </li>
                </ul>
                <a href="{{ url('allproperties/all-property-view') }}" class="btn btn-light border shadow-sm btn-sm fw-medium rounded-3 px-3 py-2 d-flex align-items-center gap-2">
                    <i class="bi bi-arrow-left"></i> Back to List
                </a>
            </div>

            {{-- Main Photos Card --}}
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-3" style="display:flex; align-items:center; gap:12px;">
                    <div class="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex align-items-center justify-content-center" style="width:32px;height:32px;flex-shrink:0;">
                        <i class="bi bi-images"></i>
                    </div>
                    <h5 class="fw-bold mb-0">Property Photos</h5>
                </div>
                <div class="card-body px-4 pb-4 pt-0">

                    {{-- Photo type tabs --}}
                    <div class="photo-tabs-wrapper mb-4 image-tab-content">
                        @php
                            $tabIcons = ['living'=>'bi-sofa','bathroom'=>'bi-droplet','balcony'=>'bi-columns-gap','floor'=>'bi-layout-split','master'=>'bi-map','exterior'=>'bi-building','other'=>'bi-three-dots'];
                            $tabLabels = ['living'=>'Living Room','bathroom'=>'Bathroom','balcony'=>'Balconies','floor'=>'Floor Plan','master'=>'Master Plan','exterior'=>'Exterior View','other'=>'Others'];
                        @endphp
                        @foreach($tabLabels as $key => $label)
                        <button class="photo-tab-pill {{ $key === 'living' ? 'active' : '' }}" data-tab="{{ $key }}">
                            <i class="bi {{ $tabIcons[$key] }}"></i> {{ $label }}
                        </button>
                        @endforeach
                    </div>

                    {{-- Info banner --}}
                    <div class="info-banner mb-4">
                        <i class="bi bi-info-circle-fill"></i>
                        Accepted formats are .jpg, .jpeg, .png, .gif, .bmp. Maximum size allowed is 20 MB. Minimum dimension allowed 600*400 Pixel.
                    </div>

                    {{-- Build image arrays --}}
                    @php
                        $types = ['living','bathroom','balcony','floor','master','exterior','other'];
                        $typeImages = array_fill_keys($types, '');
                        $typeDescs  = array_fill_keys($types, '');

                        if($images) {
                            foreach($images as $img) {
                                $t = $img->image_type;
                                $fn = $img->filename;
                                $url = asset('user_upload/property_images/'.$fn);
                                $isFeatured = ($img->is_featured ?? 0) ? '<span class="badge-featured">Featured</span>' : '';
                                if($fn && file_exists(public_path('user_upload/property_images/'.$fn))) {
                                    $typeImages[$t] .= '
                                    <div class="col-md-3 col-sm-4 col-6 mb-3">
                                        <div class="gallery-item">
                                            <img src="'.$url.'" alt="Photo">
                                            <div class="gallery-overlay">
                                                '.$isFeatured.'
                                                <button type="button" class="btn-delete ms-auto" data-type="'.$t.'" data-filename="'.$fn.'" onclick="removeImage($(this))" title="Delete"><i class="bi bi-trash3-fill"></i></button>
                                            </div>
                                            <div class="file-info"><i class="bi bi-image"></i>'.basename($fn).'</div>
                                            <input type="hidden" name="image['.$t.'][]" value="'.$fn.'">
                                        </div>
                                    </div>';
                                }
                                $typeDescs[$t] = $img->description ?? '';
                            }
                        }
                    @endphp

                    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
                        @foreach($types as $type)
                        <div class="img-content" id="tab-content-{{ $type }}" {{ $type !== 'living' ? 'style=display:none' : '' }}>

                            {{-- Gallery grid with dropzone tile as first item --}}
                            <h6 class="fw-semibold text-dark mb-3" style="font-size:.9rem;">Upload Photos</h6>
                            <div class="row g-3 mb-4" id="preview-{{ $type }}">

                                {{-- Dropzone tile (same size as image tiles) --}}
                                <div class="col-md-3 col-sm-4 col-6">
                                    <label class="upload-dropzone-tile h-100" for="fileinput-{{ $type }}">
                                        <i class="bi bi-cloud-upload"></i>
                                        <span class="dz-text">Drag & drop your files here</span>
                                        <small class="text-muted">or</small>
                                        <span class="dz-browse-btn">Browse Files</span>
                                    </label>
                                    <input type="file" id="fileinput-{{ $type }}" data-tab="{{ $type }}" class="d-none photo-file-input" multiple accept=".jpg,.jpeg,.png,.gif,.bmp">
                                </div>

                                {{-- Existing images --}}
                                {!! $typeImages[$type] !!}
                            </div>

                            {{-- Description --}}
                            <div class="mb-2 d-flex justify-content-between align-items-center">
                                <label class="fw-semibold text-dark mb-0" style="font-size:.9rem;">Description <span class="text-muted fw-normal" style="font-size:.8rem;">(Optional)</span></label>
                            </div>
                            <div class="position-relative">
                                <textarea rows="4" class="form-control desc-textarea" name="image_desc[{{ $type }}]" placeholder="Write something about these photos..." maxlength="500" oninput="updateCounter(this)">{{ $typeDescs[$type] }}</textarea>
                                <div class="char-counter mt-1">{{ strlen($typeDescs[$type]) }} / 500</div>
                            </div>
                        </div>
                        @endforeach

                        {{-- Bottom Actions --}}
                        <div class="d-flex justify-content-between align-items-center mt-5 border-top pt-4">
                            <a href="{{ url('allproperties/all-property-view') }}" class="btn btn-outline-secondary rounded-3 px-4 py-2 fw-medium">Cancel</a>
                            <div class="d-flex gap-3">
                                <a href="{{ url('property/edit/'.$property_id) }}" class="btn btn-light text-primary bg-primary bg-opacity-10 rounded-3 px-4 py-2 fw-bold border-0">
                                    <i class="bi bi-eye"></i> Preview
                                </a>
                                <button type="submit" class="btn btn-primary rounded-3 px-4 py-2 fw-bold shadow-sm" id="submit-btn">
                                    <i class="bi bi-save"></i> Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('custom-js')
<script>
    // Tab switching
    $(document).ready(function() {
        $(".photo-tabs-wrapper .photo-tab-pill").click(function(e) {
            e.preventDefault();
            $(".photo-tabs-wrapper .photo-tab-pill").removeClass("active");
            $(this).addClass("active");
            var activeTab = $(this).attr("data-tab");
            $(".img-content").hide();
            $("#tab-content-" + activeTab).show();
        });
    });

    // File upload
    $(document).on('change', '.photo-file-input', function() {
        var activeTab = $(this).attr('data-tab');
        let files = this.files;
        if (files.length === 0) return;

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        $.ajax({
            url: "{{ url('/property/store_property_image') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success: function(data) {
                if (data.success) {
                    $.each(data.images, function(index, image) {
                        previewImage(image.imageUrl, image.filename, activeTab);
                    });
                }
            },
            error: function(xhr, status, error) { console.error('AJAX Error:', error); }
        });
    });

    function previewImage(imageUrl, filename, type) {
        let html = `
            <div class="col-md-2 col-sm-3 col-4 mb-3">
                <div class="gallery-item">
                    <img src="${imageUrl}" alt="Photo">
                    <div class="gallery-overlay">
                        <button type="button" class="btn-delete ms-auto" data-type="${type}" data-filename="${filename}" onclick="removeImage($(this))" title="Delete"><i class="bi bi-trash3-fill"></i></button>
                    </div>
                    <div class="file-label"><i class="bi bi-grip-horizontal"></i>${filename}</div>
                    <input type="hidden" name="image[${type}][]" value="${filename}">
                </div>
            </div>`;
        // Insert before the dropzone (first child)
        $("#preview-" + type).children().first().after($(html));
    }

    function removeImage(btn) {
        btn.closest('.col-md-2, .col-sm-3, .col-4').remove();
    }

    function updateCounter(el) {
        el.nextElementSibling.textContent = el.value.length + ' / 500';
    }

    function submitForm(form, event) {
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $("#submit-btn").prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2"></span>Saving...');
        $.ajax({
            type: 'POST',
            url: url,
            data: $(formId).serialize(),
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            dataType: 'JSON',
            success: function(res) {
                if (res.status == 'OK') {
                    Swal.fire({ title: "Success!", text: res.message, icon: "success", confirmButtonText: "OK" }).then(() => { window.location = location.href; });
                } else {
                    Swal.fire({ title: "Failed!", text: res.message, icon: "error", confirmButtonText: "OK" });
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if (res && res.errors) { $.each(res.errors, function(index, error) { $("#" + index + "Error").html(error); }); }
            },
            complete: function() {
                $("#submit-btn").prop("disabled", false).html('<i class="bi bi-save"></i> Save Changes');
            }
        });
    }
</script>
@endpush