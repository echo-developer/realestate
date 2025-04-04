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
                    <li class="breadcrumb-item"><a href=""> Home</a></li>
                    <li class="breadcrumb-item active">Property Edit</li>
                </ol>
            </div>
        </div>
    </div>

    {{-- {{ $propertyData->settings }} --}}
    <section class="content">
        <div class="container-fluid">
            <ul id="myTab" class="nav nav-underline mb-3" role="tablist">
                <li class="nav-item"><a class="" href="{{ url('property/edit/'.$property_id) }}" aria-expanded="false">Property Details</a> </li>

                <li class="nav-item"><a class="" href="{{ url('property/edit-photos/'.$property_id) }}"  aria-expanded="true">Property Photos</a> </li>
            </ul>

            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="card-title">Basic Details </h4>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit('basic')"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">
                    <ul class="list-info">
                        <li>
                            <b>Post For:</b>
                            <span>{{ ucfirst(optional($propertyData->settings)->post_for ?? 'N/A') }}</span>
                        </li>
                        <li>
                            <b>Property Type:</b>
                            <span>{{get_name_by_id('property_category_names','category_id',$propertyData->settings->property_type,'en') ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Property For:</b>
                            <span>{{get_name_by_id('property_sub_category_names','sub_category_id',$propertyData->settings->property_type_for,'en') ?? 'N/A'}}</span>
                        </li>

                        <li>
                            <b>Price:</b>
                            <span>{{ $propertyData->settings->expected_price ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Message to Buyer:</b>
                            <span>{{ $propertyData->additional->buyer_message ?? 'N/A'}}</span>
                        </li>
                       
                        <li>
                            <b>Project/Society Name:</b>
                            <span>{{$propertyData->additional->project_name ?? 'N/A'}}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="card-title">Location </h4>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit('location')"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">
                    <ul class="list-info">
                        <li>
                            <b>City:</b>
                            <span>{{$propertyData->location->locality}}</span>
                        </li>
                        <li>
                            <b>Locality:</b>
                            <span>{{$propertyData->location->locality}}</span>
                        </li>
                        <li>
                            <b>Address:</b>
                            <span>{{$propertyData->location->property_address??'N/A'}}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="card-title">Floor Details </h4>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit('floor')"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">
                    <ul class="list-info">
                        <li>
                            <b>Flooring Types:</b>
                            <span>
                                @php
                                $flooring_style_map = [
                                'mosaic' => 'Mosaic',
                                'vitrified' => 'Vitrified',
                                'wooden' => 'Wooden',
                                'marbonite' => 'Marble',
                                'granite' => 'Granite',
                                'normal_tiles' => 'Normal Tiles/Kotah Stone',
                                'ceramic_tiles' => 'Ceramic Tiles'
                                ];

                                $flooring_styles = json_decode($propertyData->additional->flooring_style ?? '[]', true);
                                if ($flooring_styles) {
                                $formatted_styles = array_map(function($style) use ($flooring_style_map) {
                                return $flooring_style_map[$style] ?? $style;
                                }, $flooring_styles);
                                echo implode(', ', $formatted_styles);
                                } else {
                                echo 'N/A';
                                }
                                @endphp

                        </li>
                        <li>
                            <b>Floor No:</b>
                            <span>{{$propertyData->additional->floor ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Total Floors:</b>
                            <span>{{$propertyData->additional->total_floor ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Flats on the Floor:</b>
                            <span>{{$propertyData->additional->flat_each_floor ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Lifts in the Tower:</b>
                            <span>{{$propertyData->additional->lifts_in_tower ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Configuration:</b>
                            <span>N/A</span>
                        </li>
                        <li>
                            <b>Carpet Area:</b>
                            <span>{{$propertyData->settings->carpet_area??'N/A'}}</span>
                        </li>
                        <li>
                            <b>Super Area:</b>
                            <span>{{$propertyData->settings->super_area??'N/A'}}</span>
                        </li>
                        
                        <li>
                            <b>Furnished:</b>
                            <span>{{get_name_by_id('property_furnish_names','furnish_id',$propertyData->additional->property_furnish,'en')??'N/A'}}</span>
                        </li>
                        
                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="card-title">Additional Information </h4>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit('additional')"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">
                    <ul class="list-info">
                        <li>
                            <b>Water Availability:</b>
                            <span>{{$propertyData->additional->water_available ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Status of Electricity:</b>
                            <span>{{$propertyData->additional->electric_available ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Type of Ownership:</b>
                            <span>{{$propertyData->additional->ownership_type ?? 'N/A'}}</span>
                        </li>
                        <li>
                            <b>Possession Status:</b>
                            <span> {{get_name_by_id('property_status_names','status_id',$propertyData->additional->possession_status,'en')??'N/A'}}</span>
                        </li>

                        @if($propertyData->additional->possession_status == '1')
                        <li>
                            <b>Age Of Constraction:</b>
                            <span> {{$propertyData->additional->construct_year ?? 'N/A'}}</span>
                        </li>
                        @endif
                        @if($propertyData->additional->possession_status == '2')
                        @php
                            $month_arr = explode('-',$propertyData->additional->expected_possesion_month_year);
                            $construction_month = $month_arr[0];
                            $construction_year = $month_arr[1];
                        @endphp
                        <li>
                            <b>Expected Possesion Month Year:</b>
                            <span> {{ date('F Y', strtotime($propertyData->additional->expected_possesion_month_year)) ?? 'N/A'}}</span>
                        </li>
                        @endif

                        <li>
                            <b>Parking:</b>
                            <span>
                                @php
                                $parkingStatus = [
                                'av' => 'Available',
                                'na' => 'Not Available',
                                'uc' => 'Under Construction'
                                ];
                                @endphp
                                {{ $parkingStatus[$propertyData->settings->parking_ability] ?? 'N/A' }}
                            </span>
                        </li>
                        <li>
                            <b>Facing:</b>
                            <span>{{$propertyData->additional->facing_direction??'N/A'}}</span>
                        </li>
                        <li>
                            <b>OverLooking:</b>
                            <span>
                                @php
                                $overlooking = $propertyData->additional->overlooking ?? '';
                                $overlookingArray = !empty($overlooking) ? json_decode($overlooking, true) : [];
                                echo $overlookingArray ? implode(', ', $overlookingArray) : 'N/A';
                                @endphp
                            </span>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="card">
                <div class="card-header d-flex">
                    <h4 class="card-title">Property Landmark </h4>
                    <a href="javascript:void(0)" class="editInfo ml-auto ml-auto" data-id="1" onclick="edit('landmark')"><i class="fa fa-edit"></i></a>
                </div>
                <div class="card-body">

                    <div class="list-container">
                        @foreach ($landmark_categories as $category => $items)
                        @if (!empty($items))
                        <div class="list-category">
                            <b>{{ ucfirst($category) }}:</b>
                            <ul>
                                @foreach ($items as $item)
                                <li>{{ $item['name'] }} - {{ $item['distance'] }} meters</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif
                        @endforeach
                    </div>
                </div>
            </div>

        </div>
    </section>
</div>

@endsection
@push('custom-js')
<script>
    function edit(type){
        let property_id = "{{ $property_id }}";
        let url = `{{ url('property/load_ajax_page') }}?page=${type}&id=${property_id}`;
        $.get(url, function(data) {
            $('#ajaxModal').modal('show');
            $('#ajaxModal .modal-content').html(data);
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
        <button class="remove-btn" data-type="${type}" data-filename="${filename}">X</button>
        <input type="hidden" name="image[${type}][]" value="${filename}" />
    `);

        imgWrapper.find('.remove-btn').click(function() {
            removeImage(imgWrapper, filename, type);
        });

        $("#preview-" + type).append(imgWrapper);
    }


    $(document).ready(function() {
        $(".nav-link").click(function(e) {
            e.preventDefault();
            $(".nav-link").removeClass("active");
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

        $('.btn-next').click(function() {
            var formId = $("#post-property-form");
            var step = $(this).attr('data-step');
            alert(step);
            $.ajax({
                type: 'POST',
                url: '{{ url("/property/save-property") }}',
                data: $(formId).serialize(),
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'JSON',
                success: function(res) {
                    if (res.status == 'OK') {
                        $("#step-" + step).hide();
                        $("#step-" + (Number(step) + 1)).show();
                        $("#step").val(Number(step) + 1);
                        $(".tab-" + step).removeClass('active');
                        $(".tab-" + (Number(step) + 1)).addClass('active');
                    } else if (res.status == 'SUCCESS') {
                        Swal.fire({
                            title: "Success!",
                            text: res.message,
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = res.redirect;
                            }
                        });
                    }
                },
                error: function(xhr) {
                    var res = xhr.responseJSON;
                    if (res.errors) {
                        $.each(res.errors, function(index, error) {
                            $("." + index + "Error").html(error);
                            //alert(index+'/'+error);
                        });
                    }
                }
            });
        });

    });
</script>
<script>
    $(document).ready(function() {
        var w = $(window).width();
        if (w < 992) {
            $('.btn-next-1').click(function() {
                $('.spaceX').hide();
            });
            $('.btn-back-2').click(function() {
                $('.spaceX').show();
            });
        }

        // --------------------------------------------------------------------------------------------------------//

        function togglePropertyFeatures() {
            var selectedProperty = $('#property_type').val();

            if (selectedProperty == "1") { // Residential
                $('#residential_features').show();
                $('#commercial_features').hide();
            } else if (selectedProperty == "2") { // Commercial
                $('#residential_features').hide();
                $('#commercial_features').show();
            } else {
                $('#residential_features').hide();
                $('#commercial_features').hide();
            }
        }

        $(document).ready(function() {
            $(".property-status-radio").change(function() {
                let selectedValue = $("input[name='possession_status']:checked").val();

                // Hide all divs initially
                $(".available_features, .underConstruction_features").hide();

                if (selectedValue == "1") {
                    $(".available_features").show();
                    $(".underConstruction_features").hide();
                } else if (selectedValue == "2") {
                    $(".underConstruction_features").show();
                    $(".available_features").hide();
                }
            });
        });


        var firstPropertyId = $('#property_type').val(); // Get the first selected property type

        if (firstPropertyId) {
            loadPropertyFor(firstPropertyId);
        }

        function loadPropertyFor(propertyId) {
            let dropdown = $('#property_for');
            dropdown.empty();
            let selected_subcategory = "{{$propertyData->settings->property_type_for}}";

            $.ajax({
                url: "{{ url('/api/get_property_for') }}/" + propertyId,
                type: 'GET',
                dataType: 'json',
                success: function(response) {
                    if (response.status === 1) {
                        dropdown.append('<option value="">Select Sub Category</option>'); // Default option

                        $.each(response.data, function(index, item) {
                            let selected = item.sub_category_id == selected_subcategory ? 'selected' : '';
                            dropdown.append('<option value="' + item.sub_category_id + '" ' + selected + '>' + item.sub_category_name + '</option>');
                        });
                    } else {
                        console.error('Error: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                }
            });
        }

        togglePropertyFeatures();

        $('#property_type').on('change', function() {
            var propertyId = $(this).val();
            togglePropertyFeatures();
            loadPropertyFor(propertyId);
        });

        //$(".nav-link").removeClass("active");
        //$(".nav-link[data-tab='exterior']").addClass("active");

        // Handle tab switching on click
        // $(".nav-link").on("click", function(e) {
        //     e.preventDefault();
        //     $(".nav-link").removeClass("active");
        //     $(this).addClass("active");
        // });

        //let activeType = 'interior';
        //let uploadedFiles = {}; // Store images grouped by data-tab

        // $('.nav-link').click(function(e) {
        //     e.preventDefault();
        //     $('.nav-link.active').removeClass('active');
        //     $(this).addClass('active');
        //     activeType = $(this).data('tab');
        // });

        function removeImage(previewItem, filename, type) {
            previewItem.remove();
            if (uploadedFiles[type]) {
                uploadedFiles[type] = uploadedFiles[type].filter(file => file !== filename);
                if (uploadedFiles[type].length === 0) {
                    delete uploadedFiles[type]; // Remove empty categories
                }
            }
        }

        $("#post-property-form").on("submit", function(e) {
            e.preventDefault();
            let formData = new FormData(this);
            let actionUrl = "{{ url('property/post-property') }}";
            $.ajax({
                url: actionUrl,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content")
                },
                beforeSend: function() {
                    $("#submit-btn").prop("disabled", true).text(
                        "Posting...");
                },
                success: function(response) {
                    if (response.success) {
                        alert("Property submitted successfully!");
                        $("#post-property-form")[0].reset(); // Reset form
                        window.location.href = "{{ url('dashboard') }}";
                    } else {
                        alert("Error: " + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText); // Log errors
                    alert("Something went wrong. Please try again.");
                },
                complete: function() {
                    $("#submit-btn").prop("disabled", false).text(
                        "Post Property");
                }
            });
        });




    });
</script>
<script>
    let dimensionsData = <?php echo json_encode($propertyData->dimensions); ?>;

    $(document).ready(function() {
        dimensionsData.forEach(dimension => {
            let formContainer = $(`.form-field input[name='${dimension.room_type.split(/[0-9]/)[0]}_count']`).closest('.form-field').find('.size-forms');
            addForm(formContainer, dimension.room_type.split(/[0-9]/)[0], dimension);
        });

        $(".qtybutton").off("click").on("click", function() {
            let parent = $(this).closest(".form-field");
            let input = parent.find(".room-count");
            let formContainer = parent.find(".size-forms");
            var amenity = $(this).attr('amenity');

            let value = parseInt(input.val()) || 0;
            if ($(this).hasClass("plus")) {
                value++;
                input.val(value);
                addForm(formContainer, amenity, null, value);
            } else if ($(this).hasClass("minus") && value > 0) {
                value--;
                input.val(value);
                removeForm(formContainer);
            }
        });
    });

    function addForm(formContainer, amenity, dimension = null, value = null) {
        let widthValue = dimension ? JSON.parse(dimension.size).width : '';
        let heightValue = dimension ? JSON.parse(dimension.size).height : '';
        let roomTypeLabel = dimension ? `for ${dimension.room_type}` : '';
        let formHtml = `<div class="size-form mt-3 p-3 border rounded bg-light">  
                            <label class="fw-bold">Height & Width</label>  
                            <div class="row">  
                                <div class="col-6">  
                                    <input type="text" class="form-control mb-2" name="${amenity}[width][${value ?? dimension.pid}]" placeholder="Enter Width" value="${widthValue}" autocomplete="off">  
                                </div>  
                                <div class="col-6">  
                                    <input type="text" class="form-control" name="${amenity}[height][${value ?? dimension.pid}]" placeholder="Enter Height" value="${heightValue}" autocomplete="off">  
                                </div>  
                            </div>  
                        </div>`;
        formContainer.append(formHtml);
    }

    function removeForm(formContainer) {
        formContainer.find('.size-form').last().remove();
    }
</script>
@endpush

<div class="modal fade" id="ajaxModal">
    <div class="modal-dialog">
        <div class="modal-content">

        </div>
    </div>
</div>