@extends('Admin.layouts.app')
@push('custom-css')
<link rel="stylesheet" href="{{ asset('assets/dist/css/adminlte.css')}}">
<link rel="stylesheet" type="text/css" href="{{ asset('assets/dist/css/style.css') }}">

@endpush
@section('content')

<div class="app-main__inner">
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="pe-7s-notebook icon-gradient bg-mixed-hopes"></i>
                </div>
                <div>Property Edit <div class="page-title-subheading">Property &gt;Property Edit
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ url('/') }}"> Home</a></li>
                    <li class="breadcrumb-item active">Property Edit</li>
                </ol>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            <ul id="myTab" class="nav nav-underline mb-3" role="tablist">
                <li class="nav-item"><a class="nav-link" href="{{ url('property/edit/'.$property_id) }}" id="home-tab" role="tab" aria-expanded="false">Property Details</a> </li>

                <li class="nav-item"><a class="nav-link active" href="{{ url('property/edit-photos/'.$property_id) }}" role="tab" id="profile-tab2" aria-expanded="true">Property Photos</a> </li>
            </ul>

            <div class="card">
                <div class="card-header d-flex">
                    <h5 class="card-title">Property Photos </h5>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit()"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">
                    <div class="form-field">
                        <div class="image-tab-content">
                            <ul class="nav nav-underline nav-custom mb-3">
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

                        <div class="form-field mt-2" id="upload-con" style="display: none">
                            <div class="upload-area" id="uploadfile">
                                <input type="file" name="fileinput" id="fileinput" multiple>
                                <i class="bi bi-upload"></i>
                                <p>Drag & drop files here or <span class="text-site">click</span> to
                                    select
                                    files</p>
                            </div>
                        </div>

                        <p class="text-help">Accepted formats are .jpg, .gif, .bmp & .png. Maximum size
                            allowed is 20 MB. Minimum dimension allowed 600*400 Pixel</p>
                    </div>
                    <!-- Hidden Field to Store Image Names -->
                    
                    <?php  
                        if($images)
                        {
                            $living_images = '';
                            $bathroom_images = '';
                            $balcony_images = '';
                            $floor_images = '';
                            $master_images = '';
                            $exterior_images = '';
                            $other_images = '';
                            $living_desc = '';
                            $bathroom_desc = '';
                            $balcony_desc = '';
                            $floor_desc = '';
                            $master_desc = '';
                            $exterior_desc = '';
                            $other_desc = '';
                            foreach($images as $k=>$i)
                            {
                                $type = $i->image_type;
                                $filePath = 'user_upload/property_images/';
                                $filename = $i->filename;
                                $imageUrl = asset($filePath . $filename);
                                if($i->image_type == 'living')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $living_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button type="button" class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $living_desc = $i->description;
                                }
                                if($i->image_type == 'bathroom')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $bathroom_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button type="button" class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $bathroom_desc = $i->description;
                                }
                                if($i->image_type == 'balcony')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $balcony_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $balcony_desc = $i->description;
                                }
                                if($i->image_type == 'floor')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $floor_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $floor_desc = $i->description;
                                }
                                if($i->image_type == 'master')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $master_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $master_desc = $i->description;
                                }
                                if($i->image_type == 'exterior')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $exterior_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $exterior_desc = $i->description;
                                }
                                if($i->image_type == 'other')
                                { 
                                    if ($filename && file_exists(public_path('user_upload/property_images/'.$filename))) {
                                        $other_images .= '<div class="preview-item"><img src="'.$imageUrl.'" alt="Uploaded Image" style="width: 150px; height: auto;">
                                        <button class="remove-btn" data-type="'.$type.'" data-filename="'.$filename.'" onclick="removeImage($(this))">X</button>
                                        <input type="hidden" name="image['.$type.'][]" value="'.$filename.'" /></div>';
                                    }
                                    $other_desc = $i->description;
                                }
                            }
                        }
                    ?>

                    <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                        <div class="img-content" id="tab-content-living">
                            <div class="upload-gallery" id="preview-living">
                                <?php echo $living_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[living]" placeholder="Write something...">{{ $living_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-bathroom" style="display:none">
                            <div class="upload-gallery" id="preview-bathroom">
                                <?php echo $bathroom_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[bathroom]" placeholder="Write something...">{{ $bathroom_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-balcony" style="display:none">
                            <div class="upload-gallery" id="preview-balcony">
                                <?php echo $balcony_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[balcony]" placeholder="Write something...">{{ $balcony_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-floor" style="display:none">
                            <div class="upload-gallery" id="preview-floor">
                                <?php echo $floor_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[floor]" placeholder="Write something...">{{ $floor_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-master" style="display:none">
                            <div class="upload-gallery" id="preview-master">
                                <?php echo $master_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[master]" placeholder="Write something...">{{ $master_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-exterior" style="display:none">
                            <div class="upload-gallery" id="preview-exterior">
                                <?php echo $exterior_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[exterior]" placeholder="Write something...">{{ $exterior_desc }}</textarea>
                            </div>
                        </div>

                        <div class="img-content" id="tab-content-other" style="display:none">
                            <div class="upload-gallery" id="preview-other">
                                <?php echo $other_images; ?>
                            </div>
                            <div class="form-field">
                                <label class="form-label">Description</label>
                                <textarea rows="3" class="form-control" name="image_desc[other]" placeholder="Write something...">{{ $other_desc }}</textarea>
                            </div>
                        </div>

                        <div class="d-grid columns-2">
                            <button type="submit" class="btn btn-primary" id="submit-btn">Save Now</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </section>
</div>

@endsection
@push('custom-js')
<script>
    function edit(){
       $("#upload-con").show();
    }

    function submitForm(form, event){
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type : 'POST',
            url : url,
            data : $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType : 'JSON',
            success : function(res){ 
                if(res.status == 'OK')
                {
                    Swal.fire({
                        title: "Success!",
                        text: res.message,
                        icon: "success",
                        confirmButtonText: "OK"
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location = location.href;
                        }
                    });
                }else{
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                        }).then((result) => {
                    });
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if(res.errors)
                {
                    $.each(res.errors, function(index, error) {
                        $("#"+index+"Error").html(error);
                    });
                }
            }
        });
    }

    $('#fileinput').on('change', function() {
        var activeTab = $(".image-tab-content .nav-link.active").attr("data-tab");
        let files = this.files;
        if (files.length === 0) {
            alert('Please select at least one file.');
            return;
        }

        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }
        //formData.append('type', activeType);

        $.ajax({
            url: "{{ url('/property/store_property_image') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.success) {
                    $.each(data.images, function(index, image) {
                        previewImage(image.imageUrl, image.filename,
                            activeTab);
                    });

                    //updateHiddenField();
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    function previewImage(imageUrl, filename, type) {
        let imgWrapper = $('<div class="preview-item"></div>');
        imgWrapper.html(`
            <img src="${imageUrl}" alt="Uploaded Image" style="width: 150px; height: auto;">
            <button class="remove-btn" data-type="${type}" data-filename="${filename}" onclick="removeImage($(this))">X</button>
            <input type="hidden" name="image[${type}][]" value="${filename}" />
        `);

        $("#preview-" + type).append(imgWrapper);
    }

    function removeImage(evt) {
        $(evt).parent().remove();
    }



    $(document).ready(function() {
        $(".image-tab-content .nav-link").click(function(e) {
            e.preventDefault();
            $(".image-tab-content .nav-link").removeClass("active");
            $(this).addClass("active");
            var activeTab = $(this).attr("data-tab");
            $(".img-content").hide();
            $("#tab-content-" + activeTab).show();
        });

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

    });
</script>

@endpush

<div class="modal fade" id="ajaxModal">
    <div class="modal-dialog">
        <div class="modal-content">

        </div>
    </div>
</div>