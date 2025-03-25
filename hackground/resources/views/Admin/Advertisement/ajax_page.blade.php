@if($page == 'add')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <div class="box-body">
                    
                    @php
                        $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                        <div class="form-group">
                            <label for="name">Name ({{ strtoupper($lang) }})</label>
                            <input type="text" class="form-control reset_field" id="package_name{{ $lang }}"
                                name="lang[package_name][{{ $lang }}]" autocomplete="off">
                            <div class="invalid-feedback" id="package_name{{ $lang }}_error"></div>
                        </div>
                    @endforeach
                    
                    <div class="form-group">
                      <label for="category_key">Page </label>
                      <select class="form-control" name="page" onchange="get_position()">
                        <option value="">-Select-</option>
                        <?php foreach($pages as $page){ ?>
                        <option value="<?php echo $page['slug'];?>"><?php echo $page['name'];?></option>
                        <?php } ?>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="category_key">Position </label>
                      <select class="form-control" name="position" onchange="get_size()">
                        <option value="">-Select-</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="category_key">Size </label>
                      <select class="form-control" name="ad_size">
                        <option value="">-Select-</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="duration">Duration In Week(s) </label>
                      <input type="text" class="form-control reset_field" id="duration" name="duration" autocomplete="off">
                    </div>

                    <div class="form-group" id="ad_code_wrapper">
                        <p><b>Creative</b></p>
                        <div class="radio-inline">
                            <input type="radio" name="creative" value="1" class="magic-radio" id="creative_1">
                            <label for="creative_1">Yes</label> 
                        </div>
                        <div class="radio-inline">
                            <input type="radio" name="creative" value="0" class="magic-radio" id="creative_0" checked>
                            <label for="creative_0">No</label> 
                        </div>
                    </div>
    
                    <div class="form-group">
                      <label for="price">Price(With Banner) </label>
                      <input type="text" class="form-control reset_field" id="price" name="price" autocomplete="off">
                    </div>
    
                    <div class="row" style="display:none" id="price-without-banner">
                        <div class="col-12 form-group">
                          <label for="price_without_banner">Price in INR(Without Banner) </label>
                          <input type="text" class="form-control reset_field" id="price_without_banner" name="price_without_banner" autocomplete="off">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="ufile">Advertisement Demo Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="upload_file1" id="upload_file1"
                                    class="custom-file-input" >
                                <label class="custom-file-label" for="ufile">Choose file</label>
                            </div>
                            <input type="hidden" name="demo_image" id="demo_image" />
                        </div>
                    </div>
                    <div class="form-group">
                        <img id="image_preview1" style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn1" style="display:none;"
                            class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>

                    <div class="form-group">
                        <label for="ufile">Advertisement Demo Image Mobile</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="upload_file2" id="upload_file2"
                                    class="custom-file-input">
                                <label class="custom-file-label" for="ufile">Choose file</label>
                            </div>
                            <input type="hidden" name="demo_image_mobile" id="demo_image_mobile" />
                        </div>
                    </div>
                    <div class="form-group">
                        <img id="image_preview2" src=" " style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn2" style="display:none;"
                            class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>

                    <div class="form-group">
                       <p><b>Status</b></p>
                        <div class="radio-inline">
                            <input type="radio" name="status" value="1" class="magic-radio" id="status_1" checked>
                            <label for="status_1">Active</label> 
                        </div>
                         <div class="radio-inline">
                          <input type="radio" name="status" value="0" class="magic-radio" id="status_0">
                          <label for="status_0">Inactive</label> 
                        </div>
                    </div>
                  
                  <div class="form-group">
                    <div>
                     <input type="checkbox" name="add_more" value="1" class="magic-checkbox" id="add_more">
                      <label for="add_more">Add more record</label>
                    </div>
                  </div>
                  
                  </div>
                  <!-- /.box-body -->
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
    </div>
    
    <script>
    
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
                
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if(res.errors)
                {
                    $.each(res.errors, function(index, error) {
                        $("."+index+"Error").html(error);
                        //alert(index+'/'+error);
                    });
                }
            }
        });
    }
    
    function onsuccess(res){
        if(res.cmd){
            if(res.cmd == 'reload'){
                location.reload();
            }else if(res.cmd == 'reset_form'){
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }		
            
        }
    }
    
    $("input[name=creative]").on('change',function(){
        var creative = $(this).val();
        alert(creative);
        if(creative == '1'){
            $("#price-without-banner").css('display','block');
        }else{
            $("#price-without-banner").css('display','none');
        }
    });
    
    function get_position(){
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('[name="page"] :selected').val();
        $.get('<?php echo url('ads-packages/options?option=page_position&page=')?>'+page, function(res){
            $('[name="position"]').html(res);
        });
    }
    
    function get_size(){
        reset_select([$('[name="ad_size"]')]);
        var position = $('[name="position"] :selected').val();
        var page = $('[name="page"] :selected').val();
        $.get('<?php echo url('ads-packages/options?option=ad_size&page=')?>'+page+'&position='+position, function(res){
            $('[name="ad_size"]').html(res);
        });
    }
    
    function reset_select(opt){
        if(opt.length > 0 && opt instanceof Array){
            opt.forEach(function(item, ind){
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }
    
    function checkAdType(){
        var selected_val = $('[name="ad_type"] :selected').val();
        if(selected_val == 'image'){
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        }else if(selected_val == 'script'){
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        }else{
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change',function(){
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
                alert(data.status);
                if (data.status == 'OK') { 
                    $("#demo_image").val(data.file_name);
                    $("#image_preview1").show();
                    $("#delete_image_btn1").show();
                    $("#image_preview1").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change',function(){
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
                alert(data.status);
                if (data.status == 'OK') { 
                    $("#demo_image_mobile").val(data.file_name);
                    $("#image_preview2").show();
                    $("#delete_image_btn2").show();
                    $("#image_preview2").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });
   
    </script>
@endif

@if($page == 'edit')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <input type="hidden" name="ID" value="<?php echo $ID?>"/>
                  <div class="box-body">
                    @php
                        $langs = explode(',', admin_default_lang());
                    @endphp
                    @foreach ($langs as $lang)
                        <div class="form-group">
                            <label for="name">Name ({{ strtoupper($lang) }})</label>
                            <input type="text" class="form-control reset_field" id="package_name_{{ $lang }}"
                                name="lang[package_name][{{ $lang }}]" value="{{ !empty($detail['lang']['package_name'][$lang]) ? $detail['lang']['package_name'][$lang] : '' }}" autocomplete="off" />
                            <div class="invalid-feedback" id="package_name{{ $lang }}_error"></div>
                        </div>
                    @endforeach
                    
                    <div class="form-group">
                      <label for="category_key">Page </label>
                      <select class="form-control" name="page" onchange="get_position()">
                        <option value="">-Select-</option>
                        <?php foreach($pages as $page){ ?>
                        <option value="<?php echo $page['slug'];?>" <?php if($page['slug'] == $detail['page']){echo "selected";} ?> ><?php echo $page['name'];?></option>
                        <?php } ?>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="category_key">Position </label>
                      <select class="form-control" name="position" onchange="get_size()">
                        <option value="">-Select-</option>
                        @if($positions) 
                            @foreach($positions as $p)
                            <option <?php if($p['name'] == $detail['position']){echo "selected";} ?>>{{ $p['name'] }}</option>
                            @endforeach
                        @endif
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="category_key">Size </label>
                      <select class="form-control" name="ad_size">
                        <option value="">-Select-</option>
                        @if($sizes) 
                            @foreach($sizes as $s)
                            <option <?php if($s == $detail['size']){echo "selected";} ?>>{{ $s }}</option>
                            @endforeach
                        @endif
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="duration">Duration In Week(s) </label>
                      <input type="text" class="form-control reset_field" id="duration" name="duration" autocomplete="off" value="{{ !empty($detail['duration']) ? $detail['duration'] : '' }}">
                    </div>

                    <div class="form-group" id="ad_code_wrapper">
                        <p><b>Creative</b></p>
                        <div class="radio-inline">
                            <input type="radio" name="creative" value="1" class="magic-radio" id="creative_1">
                            <label for="creative_1">Yes</label> 
                        </div>
                        <div class="radio-inline">
                            <input type="radio" name="creative" value="0" class="magic-radio" id="creative_0" <?php if($detail['creative'] == '0'){echo 'checked';} ?> >
                            <label for="creative_0">No</label> 
                        </div>
                    </div>
    
                    <div class="form-group">
                      <label for="price">Price(With Banner) </label>
                      <input type="text" class="form-control reset_field" id="price" name="price" autocomplete="off" value="{{ !empty($detail['price']) ? $detail['price'] : '' }}">
                    </div>
    
                    <div class="row" style="display:none" id="price-without-banner">
                        <div class="col-12 form-group">
                          <label for="price_without_banner">Price in INR(Without Banner) </label>
                          <input type="text" class="form-control reset_field" id="price_without_banner" name="price_without_banner" autocomplete="off" value="{{ !empty($detail['price_without_banner']) ? $detail['price_without_banner'] : '' }}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="ufile">Advertisement Demo Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="upload_file1" id="upload_file1"
                                    class="custom-file-input" >
                                <label class="custom-file-label" for="ufile">Choose file</label>
                            </div>
                            <input type="hidden" name="demo_image" id="demo_image" value="{{ !empty($detail['demo_image']) ? $detail['demo_image'] : '' }}" />
                        </div>
                    </div>
                    @if($detail['demo_image'])
                    <div class="form-group">
                        <img id="image_preview1" src="{{ asset('user_upload/advertisement/'.$detail['demo_image']) }}" style="width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn1" class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>
                    @else
                    <div class="form-group">
                        <img id="image_preview1" style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn1" style="display:none;"
                            class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>
                    @endif
                    

                    <div class="form-group">
                        <label for="ufile">Advertisement Demo Image Mobile</label>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" name="upload_file2" id="upload_file2"
                                    class="custom-file-input">
                                <label class="custom-file-label" for="ufile">Choose file</label>
                            </div>
                            <input type="hidden" name="demo_image_mobile" id="demo_image_mobile" value="{{ !empty($detail['demo_image_mobile']) ? $detail['demo_image_mobile'] : '' }}" />
                        </div>
                    </div>
                    @if($detail['demo_image_mobile'])
                    <div class="form-group">
                        <img id="image_preview2" src="src="{{ asset('user_upload/advertisement/'.$detail['demo_image_mobile']) }}" style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn2"
                            class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>
                    @else
                    <div class="form-group">
                        <img id="image_preview2" src="" style="display:none; width: 100px; height: auto;" />
                        <button type="button" id="delete_image_btn2" style="display:none;"
                            class="btn btn-danger mt-2" onclick="deleteUploadedImage()">Delete Image</button>
                    </div>
                    @endif

                    <div class="form-group">
                       <p><b>Status</b></p>
                        <div class="radio-inline">
                            <input type="radio" name="status" value="1" class="magic-radio" id="status_1" checked>
                            <label for="status_1">Active</label> 
                        </div>
                         <div class="radio-inline">
                          <input type="radio" name="status" value="0" class="magic-radio" id="status_0">
                          <label for="status_0">Inactive</label> 
                        </div>
                    </div>
                  
                  </div>
                  <!-- /.box-body -->
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
    </div>
    
    <script>
    
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
                
            },
            error: function(xhr) {
                var res = xhr.responseJSON;
                if(res.errors)
                {
                    $.each(res.errors, function(index, error) {
                        $("."+index+"Error").html(error);
                        //alert(index+'/'+error);
                    });
                }
            }
        });
    }
    
    function onsuccess(res){
        if(res.cmd){
            if(res.cmd == 'reload'){
                location.reload();
            }else if(res.cmd == 'reset_form'){
                var form = $('#add_form');
                form.find('.reset_field').val('');
            }		
            
        }
    }
    
    $("input[name=creative]").on('change',function(){
        var creative = $(this).val();
        alert(creative);
        if(creative == '1'){
            $("#price-without-banner").css('display','block');
        }else{
            $("#price-without-banner").css('display','none');
        }
    });
    
    function get_position(){
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('[name="page"] :selected').val();
        $.get('<?php echo url('ads-packages/options?option=page_position&page=')?>'+page, function(res){
            $('[name="position"]').html(res);
        });
    }
    
    function get_size(){
        reset_select([$('[name="ad_size"]')]);
        var position = $('[name="position"] :selected').val();
        var page = $('[name="page"] :selected').val();
        $.get('<?php echo url('ads-packages/options?option=ad_size&page=')?>'+page+'&position='+position, function(res){
            $('[name="ad_size"]').html(res);
        });
    }
    
    function reset_select(opt){
        if(opt.length > 0 && opt instanceof Array){
            opt.forEach(function(item, ind){
                $(item).html('<option value="">-Select-</option>');
            });
        }
    }
    
    function checkAdType(){
        var selected_val = $('[name="ad_type"] :selected').val();
        if(selected_val == 'image'){
            $('#ad_code_wrapper').hide();
            $('#ad_image_wrapper').show();
            $('#ad_image_mobile_wrapper').show();
        }else if(selected_val == 'script'){
            $('#ad_code_wrapper').show();
            $('#ad_image_wrapper').hide();
            $('#ad_image_mobile_wrapper').hide();
        }else{
            $('#ad_code_wrapper,#ad_image_wrapper,#ad_image_mobile_wrapper').show();
        }
    }

    $("#upload_file1").on('change',function(){
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
                alert(data.status);
                if (data.status == 'OK') { 
                    $("#demo_image").val(data.file_name);
                    $("#image_preview1").show();
                    $("#delete_image_btn1").show();
                    $("#image_preview1").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    $("#upload_file2").on('change',function(){
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
                alert(data.status);
                if (data.status == 'OK') { 
                    $("#demo_image_mobile").val(data.file_name);
                    $("#image_preview2").show();
                    $("#delete_image_btn2").show();
                    $("#image_preview2").attr('src',data.file_path);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
            }
        });
    });

    </script>
@endif
