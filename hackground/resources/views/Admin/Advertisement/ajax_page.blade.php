@if($page == 'add')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>

</div>
<div class="modal-body">
    <form role="form" id="add_form" class="mb-0" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <input type="hidden" name="user_id" value="{{ $user_id }}" />
        <input type="hidden" name="request_id" value="{{ $request_id }}" />
        <div class="box-body">
            
        <div class="form-group">
            <label class="form-label d-block" for="category_key">Category </label>
            <select class="form-select select-2" name="category[]" multiple>
                <option value="">-Select-</option>
                <?php foreach ($property_category as $c) { ?>
                    <option value="<?php echo $c->id; ?>" ><?php echo $c->name; ?></option>
                <?php } ?>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label d-block" for="category_key">City </label>
            <select class="form-select select-2" name="city[]" multiple>
                <option value="">-Select-</option>
                <?php foreach ($city as $c) { ?>
                    <option value="<?php echo $c->city_id; ?>" ><?php echo $c->name; ?></option>
                <?php } ?>
            </select>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="page" id="page" onchange="get_position()">
                <option value="">-Select-</option>
                <?php foreach ($pages as $page) { ?>
                    <option value="<?php echo $page['slug']; ?>" ><?php echo $page['name']; ?></option>
                <?php } ?>
            </select>
            <label for="category_key">Page </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="position" id="position" onchange="get_size($(this))">
                <option value="">-Select-</option>
            </select>
            <label for="category_key">Position </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="ad_size">
                <option value="">-Select-</option>
            </select>
            <label for="category_key">Size </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="ad_type" onchange="checkAdType()">
                <option value="image">Image</option>
                <option value="script">Script</option>
            </select>
            <label for="category_key">Type </label>
        </div>

        <div id="ad_image_wrapper">
            <div class="form-group">
                <label for="ufile">Advertisement Image</label>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" name="upload_file1" id="upload_file1"
                            class="custom-file-input">
                        <label class="custom-file-label" for="ufile">Choose file</label>
                    </div>
                </div>
            </div>
            <div class="form-group" id="ad_image_con">
                <img id="image_preview1" style="display:none; width: 100px; height: auto;" />
                <input type="hidden" class="filename" name="ad_image" id="ad_image" />
                <button type="button" id="delete_image_btn1" style="display:none;"
                    class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
            </div>
        </div>

        <div id="ad_image_mobile_wrapper">
            <div class="form-group">
                <label for="ufile">Advertisement Image Mobile</label>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" name="upload_file2" id="upload_file2"
                            class="custom-file-input">
                        <label class="custom-file-label" for="ufile">Choose file</label>
                    </div>
                </div>
            </div>
            <div class="form-group" id="ad_image_mobile_con">
                <img id="image_preview2" src=" " style="display:none; width: 100px; height: auto;" />
                <input type="hidden" class="filename" name="ad_image_mobile" id="ad_image_mobile" />
                <button type="button" id="delete_image_btn2" style="display:none;"
                    class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
            </div>
        </div>

        <div class="form-group" id="ad_code_wrapper" style="display:none">
            <label for="ad_code">Advertisement Code </label>
            <textarea class="form-control" name="ad_code"></textarea>
        </div>

        <div class="form-floating mb-3">
            <input type="text" class="form-control reset_field" id="ad_url" name="ad_url" placeholder="" autocomplete="off">
            <label for="ad_url">Ad URL </label>
        </div>

        <div class="form-floating mb-3">
            <input type="date" class="form-control reset_field" id="start_date" name="start_date" placeholder="" autocomplete="off">
            <label for="start_date">Start Date </label>
        </div>

        <div class="form-floating mb-3">
            <input type="date" class="form-control reset_field" id="expire_date" name="expire_date" placeholder="" autocomplete="off">
            <label for="expire_date">Expire Date </label>
        </div>

        <div class="form-group">
            <label class="form-label d-block">Status</label>
            <div class="form-check form-check-inline">
                <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked>
                <label class="form-check-label" for="status_1">Active</label>
            </div>
            <div class="form-check form-check-inline">
                <input type="radio" name="status" value="0" class="form-check-input" id="status_0">
                <label class="form-check-label" for="status_0">Inactive</label>
            </div>
        </div>

</div>
<!-- /.box-body -->
<button type="submit" class="btn btn-primary">Add</button>
</form>
</div>

<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>
<script>    
    /* $(function() {
        $('.select2').select2();
    }); */

    function submitForm(form, event) {
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type: 'POST',
            url: url,
            data: $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'JSON',
            success: function(res) {
                if (res.status == 'OK') {
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
                } else {
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    }).then((result) => {});
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if (res.errors) {
                    $.each(res.errors, function(index, error) {
                        $("." + index + "Error").html(error);
                    });
                }
            }
        });
    }

    function onsuccess(res) {
        if (res.cmd) {
            if (res.cmd == 'reload') {
                location.reload();
            } else if (res.cmd == 'reset_form') {
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }

        }
    }

    $("input[name=creative]").on('change', function() {
        var creative = $(this).val();
        if (creative == '1') {
            $("#price-without-banner").css('display', 'block');
        } else {
            $("#price-without-banner").css('display', 'none');
        }
    });

    function get_position() {
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=page_position&page=') ?>' + page, function(res) {
            $('[name="position"]').html(res);
        });
    }

    function get_size() {
        reset_select([$('[name="ad_size"]')]);
        var position = $('#add_form [name="position"] :selected').val();
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=ad_size&page=') ?>' + page + '&position=' + position, function(res) {
            $('[name="ad_size"]').html(res);
        });
    }

    function reset_select(opt) {
        if (opt.length > 0 && opt instanceof Array) {
            opt.forEach(function(item, ind) {
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }

    function checkAdType() {
        var selected_val = $('[name="ad_type"] :selected').val();
        if (selected_val == 'image') {
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        } else if (selected_val == 'script') {
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        } else {
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview1" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image" id="ad_image" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn1" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview2" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image_mobile" id="ad_image_mobile" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn2" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_mobile_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    function deleteUploadedImage() {
        $(event.target).closest('button').siblings('img').first().attr('src', '');
        $(event.target).closest('button').siblings('.filename').first().val('');
        $(event.target).closest('button').hide();
    }
</script>
@endif

@if($page == 'approve')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>

</div>
<div class="modal-body">
    <form role="form" id="add_form" class="mb-0" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <input type="hidden" name="user_id" value="{{ $user_id }}" />
        <input type="hidden" name="request_id" value="{{ $request_id }}" />
        <div class="box-body">
            
        <div class="form-group">
            <label class="form-label d-block" for="category_key">Category </label>
            <select class="form-select select-2" name="category[]" multiple>
                <option value="">-Select-</option>
                <?php foreach ($property_category as $c) { ?>
                    <option value="<?php echo $c->id; ?>" ><?php echo $c->name; ?></option>
                <?php } ?>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label d-block" for="category_key">City </label>
            <select class="form-select select-2" name="city[]" multiple>
                <option value="">-Select-</option>
                <?php foreach ($city as $c) { ?>
                    <option value="<?php echo $c->city_id; ?>" {{ ($detail->city_id == $c->city_id) ? 'selected' : '' }} ><?php echo $c->name; ?></option>
                <?php } ?>
            </select>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="page" id="page" onchange="get_position()">
                <option value="">-Select-</option>
                <?php foreach ($pages as $page) { ?>
                    <option value="<?php echo $page['slug']; ?>" {{ ($detail->page == $page['slug']) ? 'selected' : '' }}><?php echo $page['name']; ?></option>
                <?php } ?>
            </select>
            <label for="category_key">Page </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="position" id="position" onchange="get_size($(this))">
                <option value="">-Select-</option>
            </select>
            <label for="category_key">Position </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="ad_size">
                <option value="">-Select-</option>
            </select>
            <label for="category_key">Size </label>
        </div>

        <div class="form-floating mb-3">
            <select class="form-select" name="ad_type" onchange="checkAdType()">
                <option value="image">Image</option>
                <option value="script">Script</option>
            </select>
            <label for="category_key">Type </label>
        </div>

        <div id="ad_image_wrapper">
            <div class="form-group">
                <label for="ufile">Advertisement Image</label>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" name="upload_file1" id="upload_file1"
                            class="custom-file-input">
                        <label class="custom-file-label" for="ufile">Choose file</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group" id="ad_image_con">
            @if($detail->ad_image)
                <img src="{{ asset('user_upload/advertisement/'.$detail->ad_image) }}" id="image_preview1" style="width: 100px; height: auto;" />
                <input type="hidden" class="filename" name="ad_image" id="ad_image" value="{{ $detail->ad_image }}" />
                <button type="button" id="delete_image_btn1" class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
            @endif
            </div>
            
        </div>

        <div id="ad_image_mobile_wrapper">
            <div class="form-group">
                <label for="ufile">Advertisement Image Mobile</label>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" name="upload_file2" id="upload_file2"
                            class="custom-file-input">
                        <label class="custom-file-label" for="ufile">Choose file</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group" id="ad_image_mobile_con">
                @if($detail->ad_image_mobile)
                    <img id="image_preview2" src="{{ asset('user_upload/advertisement/'.$detail->ad_image_mobile) }}" style="width: 100px; height: auto;" />
                    <input type="hidden" class="filename" name="ad_image_mobile" id="ad_image_mobile" value="{{ $detail->ad_image_mobile }}" />
                    <button type="button" id="delete_image_btn2" class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                @endif
            </div>
            
        </div>

        <div class="form-group" id="ad_code_wrapper" style="display:none">
            <label for="ad_code">Advertisement Code </label>
            <textarea class="form-control" name="ad_code"></textarea>
        </div>

        <div class="form-floating mb-3">
            <input type="text" class="form-control reset_field" id="ad_url" name="ad_url" placeholder="" autocomplete="off">
            <label for="ad_url">Ad URL </label>
        </div>
        <div class="mb-3">
            <label for="ad_url">Duration : {{ $detail->duration ? $detail->duration.' Weeks' : '' }} </label>
        </div>
        <?php
            $today = '';
            $expire = '';
            $duration = $detail->duration*7;
            if($duration)
            {
                $today = date('Y-m-d');
                $expire = date('Y-m-d', strtotime('+'.$duration.' days'));
            }
        ?>
        <div class="form-floating mb-3">
            <input type="date" value="{{ $today }}" class="form-control reset_field" id="start_date" name="start_date" placeholder="" autocomplete="off">
            <label for="start_date">Start Date </label>
        </div>

        <div class="form-floating mb-3">
            <input type="date" value="{{ $expire }}" class="form-control reset_field" id="expire_date" name="expire_date" placeholder="" autocomplete="off">
            <label for="expire_date">Expire Date </label>
        </div>

        <div class="form-group">
            <label class="form-label d-block">Status</label>
            <div class="form-check form-check-inline">
                <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked>
                <label class="form-check-label" for="status_1">Active</label>
            </div>
            <div class="form-check form-check-inline">
                <input type="radio" name="status" value="0" class="form-check-input" id="status_0">
                <label class="form-check-label" for="status_0">Inactive</label>
            </div>
        </div>

</div>
<!-- /.box-body -->
<button type="submit" class="btn btn-primary">Add</button>
</form>
</div>

<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>
<script>    
    /* $(function() {
        $('.select2').select2();
    }); */

    function submitForm(form, event) {
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type: 'POST',
            url: url,
            data: $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'JSON',
            success: function(res) {
                if (res.status == 'OK') {
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
                } else {
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    }).then((result) => {});
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if (res.errors) {
                    $.each(res.errors, function(index, error) {
                        $("." + index + "Error").html(error);
                    });
                }
            }
        });
    }

    function onsuccess(res) {
        if (res.cmd) {
            if (res.cmd == 'reload') {
                location.reload();
            } else if (res.cmd == 'reset_form') {
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }

        }
    }

    $("input[name=creative]").on('change', function() {
        var creative = $(this).val();
        if (creative == '1') {
            $("#price-without-banner").css('display', 'block');
        } else {
            $("#price-without-banner").css('display', 'none');
        }
    });

    var page = $('#add_form [name="page"] :selected').val();
    if(page != '')
    {
        get_position();
    }
    
    function get_position() {
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=page_position&page=') ?>' + page, function(res) {
            $('[name="position"]').html(res);
        });
    }

    function get_size() {
        reset_select([$('[name="ad_size"]')]);
        var position = $('#add_form [name="position"] :selected').val();
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=ad_size&page=') ?>' + page + '&position=' + position, function(res) {
            $('[name="ad_size"]').html(res);
        });
    }

    function reset_select(opt) {
        if (opt.length > 0 && opt instanceof Array) {
            opt.forEach(function(item, ind) {
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }

    function checkAdType() {
        var selected_val = $('[name="ad_type"] :selected').val();
        if (selected_val == 'image') {
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        } else if (selected_val == 'script') {
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        } else {
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview1" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image" id="ad_image" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn1" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview2" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image_mobile" id="ad_image_mobile" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn2" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_mobile_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    function deleteUploadedImage() {
        $(event.target).closest('button').siblings('img').first().attr('src', '');
        $(event.target).closest('button').siblings('.filename').first().val('');
        $(event.target).closest('button').hide();
    }
</script>
@endif

@if($page == 'edit')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal">

    </button>

</div>
<div class="modal-body">
    <form role="form" id="add_form" action="<?php echo $form_action; ?>" onsubmit="submitForm(this, event)">
        <input type="hidden" name="ID" value="<?php echo $ID ?>" />
        <div class="box-body">

            <div class="form-group">
                <label class="form-label d-block" for="category_key">Category </label>
                <select class="form-select select-2" name="category[]" multiple>
                    <option value="">-Select-</option>
                    <?php foreach ($property_category as $c) { ?>
                        <option value="<?php echo $c->id; ?>" <?php if (in_array($c->id, $detail['ad_cats'])) {
                                                                    echo "selected";
                                                                } ?>><?php echo $c->name; ?></option>
                    <?php } ?>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label d-block" for="category_key">City </label>
                <select class="form-select select-2" name="city[]" multiple>
                    <option value="">-Select-</option>
                    <?php foreach ($city as $c) { ?>
                        <option value="<?php echo $c->city_id; ?>" <?php if (in_array($c->city_id, $detail['ad_locations'])) {
                                                                        echo "selected";
                                                                    } ?>><?php echo $c->name; ?></option>
                    <?php } ?>
                </select>
            </div>

            <div class="form-floating mb-3">                
                <select class="form-select" name="page" onchange="get_position()">
                    <option value="">-Select-</option>
                    <?php foreach ($pages as $page) { ?>
                        <option value="<?php echo $page['slug']; ?>" <?php if ($page['slug'] == $detail['page']) {
                                                                            echo "selected";
                                                                        } ?>><?php echo $page['name']; ?></option>
                    <?php } ?>
                </select>
                <label for="category_key">Page </label>
            </div>

            <div class="form-floating mb-3">                
                <select class="form-select" name="position" id="position" onchange="get_size()">
                    <option value="">-Select-</option>
                    @if($positions)
                    @foreach($positions as $p)
                    <option <?php if ($p['name'] == $detail['position']) {
                                echo "selected";
                            } ?>>{{ $p['name'] }}</option>
                    @endforeach
                    @endif
                </select>
                <label for="category_key">Position </label>
            </div>

            <div class="form-floating mb-3">
                <select class="form-select" name="ad_size">
                    <option value="">-Select-</option>
                    @if($sizes)
                    @foreach($sizes as $s)
                    <option <?php if ($s == $detail['ad_size']) {
                                echo "selected";
                            } ?>>{{ $s }}</option>
                    @endforeach
                    @endif
                </select>
                <label for="category_key">Size </label>
            </div>

            <div class="form-floating mb-3">
                <select class="form-select" name="ad_type" onchange="checkAdType()">
                    <option value="image" <?php if ($detail['ad_type'] == 'image') {
                                                echo "selected";
                                            } ?>>Image</option>
                    <option value="script" <?php if ($detail['ad_type'] == 'script') {
                                                echo "selected";
                                            } ?>>Script</option>
                </select>
                <label for="category_key">Type </label>
            </div>

            <div id="ad_image_wrapper">
                <div class="form-group">
                    <label for="ufile">Advertisement Image</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" name="upload_file1" id="upload_file1"
                                class="custom-file-input">
                            <label class="custom-file-label" for="ufile">Choose file</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-group" id="ad_image_con">
                    @if($detail['ad_image'])
                        <img id="image_preview1" src="{{ asset('user_upload/advertisement/'.$detail['ad_image']) }}" style="width: 100px; height: auto;" />
                        <input type="hidden" class="filename" name="ad_image" id="ad_image" value="{{ !empty($detail['ad_image']) ? $detail['ad_image'] : '' }}" />
                        <button type="button" id="delete_image_btn1" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>
                    @endif
                </div>
                
            </div>

            <div id="ad_image_mobile_wrapper">
                <div class="form-group">
                    <label for="ufile">Advertisement Image Mobile</label>
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" name="upload_file2" id="upload_file2"
                                class="custom-file-input">
                            <label class="custom-file-label" for="ufile">Choose file</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-group" id="ad_image_mobile_con">
                    @if($detail['ad_image_mobile'])
                        <img id="image_preview2" src="{{ asset('user_upload/advertisement/'.$detail['ad_image_mobile']) }}" style="width: 100px; height: auto;" />
                        <input type="hidden" class="filename" name="ad_image_mobile" id="ad_image_mobile" value="{{ !empty($detail['ad_image_mobile']) ? $detail['ad_image_mobile'] : '' }}" />
                        <button type="button" id="delete_image_btn2" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>
                    @endif
                </div>
                
            </div>

            <div class="form-group" id="ad_code_wrapper">
                <label for="ad_code">Advertisement Code </label>
                <textarea class="form-control" name="ad_code">{{ !empty($detail['ad_code']) ? $detail['ad_code'] : '' }}</textarea>
            </div>

            <div class="form-floating mb-3">
                <input type="text" class="form-control reset_field" id="ad_url" name="ad_url" placeholder="" autocomplete="off" value="{{ !empty($detail['ad_url']) ? $detail['ad_url'] : '' }}">
                <label for="ad_url">Ad URL </label>
            </div>
            
            <div class="form-floating mb-3">
                <input type="date" class="form-control reset_field" id="start_date" name="start_date" placeholder="" autocomplete="off" value="{{ !empty($detail['start_date']) ? date('Y-m-d', strtotime($detail['start_date'])) : '' }}">
                <label for="start_date">Start Date </label>
            </div>

            <div class="form-floating mb-3">
                <input type="date" class="form-control reset_field" id="expire_date" name="expire_date" placeholder="" autocomplete="off" value="{{ !empty($detail['expire_date']) ? date('Y-m-d', strtotime($detail['expire_date'])) : '' }}">
                <label for="expire_date">Expire Date </label>
            </div>

            <div class="form-group mb-0">
                <label class="form-label d-block">Status</label>
                <div class="form-check form-check-inline">
                    <input type="radio" name="status" value="1" class="form-check-input" id="status_1" checked>
                    <label class="form-check-label" for="status_1">Active</label>
                </div>
                <div class="form-check form-check-inline">
                    <input type="radio" name="status" value="0" class="form-check-input" id="status_0">
                    <label class="form-check-label" for="status_0">Inactive</label>
                </div>
            </div>

        </div>
        <!-- /.box-body -->
        <button type="submit" class="btn btn-primary">Add</button>
    </form>
</div>

<script src="{{ asset('assets/dist/js/select2.js') }}"></script>
<script>
    $(".select-2").select2({
        theme: "bootstrap-5",
        selectionCssClass: "select2--single",
        dropdownCssClass: "select2--single",
    });
</script>

<script>
    /* $(function() {
        $('.select2').select2();
    });*/

    function submitForm(form, event) {
        event.preventDefault();
        var formId = $("#add_form");
        var url = $(form).attr('action');
        $.ajax({
            type: 'POST',
            url: url,
            data: $(formId).serialize(),
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'JSON',
            success: function(res) {
                if (res.status == 'OK') {
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
                } else {
                    Swal.fire({
                        title: "Failed!",
                        text: res.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    }).then((result) => {});
                }
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if (res.errors) {
                    $.each(res.errors, function(index, error) {
                        $("." + index + "Error").html(error);
                    });
                }
            }
        });
    }

    function onsuccess(res) {
        if (res.cmd) {
            if (res.cmd == 'reload') {
                location.reload();
            } else if (res.cmd == 'reset_form') {
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }

        }
    }

    $("input[name=creative]").on('change', function() {
        var creative = $(this).val();
        if (creative == '1') {
            $("#price-without-banner").css('display', 'block');
        } else {
            $("#price-without-banner").css('display', 'none');
        }
    });

    function get_position() {
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=page_position&page=') ?>' + page, function(res) {
            $('[name="position"]').html(res);
        });
    }

    function get_size() {
        reset_select([$('[name="ad_size"]')]);
        var position = $('#add_form [name="position"] :selected').val();
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=ad_size&page=') ?>' + page + '&position=' + position, function(res) {
            $('[name="ad_size"]').html(res);
        });
    }

    function reset_select(opt) {
        if (opt.length > 0 && opt instanceof Array) {
            opt.forEach(function(item, ind) {
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }

    function checkAdType() {
        var selected_val = $('[name="ad_type"] :selected').val();
        if (selected_val == 'image') {
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        } else if (selected_val == 'script') {
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        } else {
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview1" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image" id="ad_image" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn1" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change', function() {
        let file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: "{{ url('/ads-packages/uplaod_file') }}",
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function(data) {
                if (data.status == 'OK') {
                    var html = '';
                    html += '<img id="image_preview2" src="'+data.file_path+'" style="width: 100px; height: auto;" /><input type="hidden" class="filename" name="ad_image" id="ad_image" value="'+data.file_name+'" />';
                    html +=  '<button type="button" id="delete_image_btn2" class="btn btn-sm btn-danger" onclick="deleteUploadedImage()" title="Delete Image"><i class="bi bi-trash3-fill"></i></button>';
                    $("#ad_image_mobile_con").html(html);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    function deleteUploadedImage() {
        $(event.target).closest('button').siblings('img').first().attr('src', '');
        $(event.target).closest('button').siblings('.filename').first().val('');
        $(event.target).closest('button').hide();
    }
</script>
@endif

@if($page == 'view-request')
<div class="modal-header">
    <h4 class="modal-title"><?php echo $title; ?></h4>
    <button type="button" class="btn-close" data-bs-dismiss="modal">

    </button>

</div>
@php  
@endphp
<div class="modal-body">
    <ul>
        <li>Advertiser Name:</li>
        <li>{{ $detail->name }}</li>
    </ul>
    <ul>
        <li>Email:</li>
        <li>{{ $detail->email }}</li>
    </ul>
    <ul>
        <li>Phone:</li>
        <li>{{ $detail->phone }}</li>
    </ul>
    <ul>
        <li>Page:</li>
        <li>{{ $detail->page }}</li>
    </ul>
    <ul>
        <li>Position:</li>
        <li>{{ $detail->position }}</li>
    </ul>
    <ul>
        <li>Duration in weeks:</li>
        <li>{{ $detail->duration }}</li>
    </ul>
    <ul>
        <li>Location:</li>
        <li>{{ get_name_by_id('locality_names','locality_id',$detail->locality_id,'en').', '.get_name_by_id('city_names','city_id',$detail->city_id,'en') }}</li>
    </ul>
    <ul>
        <li>Is banner uploaded ?</li>
        <li>{{ $detail->has_banner == 1 ? 'Yes' : 'No' }}</li>
    </ul>
    @if($detail->ad_image)
    <div>
        <label>Ad Image</label>
        <img src="{{ asset('user_upload/advertisement/'.$detail->ad_image) }}"  />
    </div>
    @endif
    @if($detail->ad_image_mobile)
    <div>
        <label>Ad Image for mobile</label>
        <img src="{{ asset('user_upload/advertisement/'.$detail->ad_image_mobile) }}"  />
    </div>
    @endif
</div>
@endif