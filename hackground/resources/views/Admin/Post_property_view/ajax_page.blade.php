@if($page == 'basic')
    <div class="modal-header">
    <h4 class="modal-title"><?php echo $title;?></h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span></button>
        
    </div>
    <div class="modal-body">
            <form role="form" id="add_form" action="<?php echo $form_action;?>" onsubmit="submitForm(this, event)">
                  <div class="box-body">
                    
                    {{-- <div class="form-group">
                        <label for="category_key">City </label>
                        <select class="form-control select2" name="city[]" multiple>
                          <option value="">-Select-</option>
                          <?php foreach($city as $c){ ?>
                          <option value="<?php echo $c->city_id;?>" ><?php echo $c->name;?></option>
                          <?php } ?>
                        </select>
                    </div> --}}
                    
                    <div class="form-group">
                      <label for="category_key">Post For </label>
                      <select class="form-control" name="post_for" id="post_for">
                        <option value="">-Select-</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="category_key">Property Type</label>
                      <select class="form-control" name="property_type" id="property_type">
                        <option value="">-Select-</option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="category_key">Property For </label>
                        <select class="form-control" name="property_type_for" id="property_type_for">
                            <option value="">-Select-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="price_currency">Currency </label>
                        <select class="form-control" name="price_currency" id="price_currency">
                            <option value="">-Select-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="category_key">Price</label>
                        <input class="form-control" name="expected_price" id="expected_price" />
                    </div>

                    <div class="form-group" id="ad_code_wrapper" style="display:none">
                        <label for="ad_code">Advertisement Code </label>
                        <textarea class="form-control" name="ad_code"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="ad_url">Ad URL </label>
                        <input type="text" class="form-control reset_field" id="ad_url" name="ad_url" autocomplete="off">
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
                  
                  </div>
                  <!-- /.box-body -->
                <button type="submit" class="btn btn-primary">Add</button>
            </form>
    </div>
    
    <script>
    $(function(){
        $('.select2').select2();
    });

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
                        $("."+index+"Error").html(error);
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
        if(creative == '1'){
            $("#price-without-banner").css('display','block');
        }else{
            $("#price-without-banner").css('display','none');
        }
    });
    
    function get_position(){
        reset_select([$('[name="position"]'), $('[name="ad_size"]')]);
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=page_position&page=')?>'+page, function(res){
            $('[name="position"]').html(res);
        });
    }
    
    function get_size(){
        reset_select([$('[name="ad_size"]')]);
        var position = $('#add_form [name="position"] :selected').val();
        var page = $('#add_form [name="page"] :selected').val();
        $.get('<?php echo url('advertisement/options?option=ad_size&page=')?>'+page+'&position='+position, function(res){
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
                if (data.status == 'OK') { 
                    $("#ad_image").val(data.file_name);
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
                if (data.status == 'OK') { 
                    $("#ad_image_mobile").val(data.file_name);
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
