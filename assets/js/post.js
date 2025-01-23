$(document).ready(function() {
    $(document).on('click', '.landmark-tabs .landmarks-inner .landmark-rm', function() {
        $(this).closest('.col-12').remove();
    });
    $('.landmark-tabs .landmark-add').on('click', function() {
        var act_tab = $('.landmark-tabs .pop-landmark li a.active').attr('id');
        var html = $('.landmark-tabs .landmarks-blanks .' + act_tab + '.blank').html();
        html = '<div class="col-12 ' + act_tab + '">' + html + '</div>';
        $('.landmark-tabs .landmarks-inner').append(html);
    });

    $('.property_for').on('click', function() {
        showHidePropertyFor($(this).val());
    });
    showHidePropertyFor($('.property_for:checked').val());

    if ($('#property_type_for').val() > 0) {
        showHidePropertyTypeFor($('#property_type_for').val());
    }
    $('#property_type_for').on('change', function() {
        showHidePropertyTypeFor($(this).val());
    });

    $('.maintenance-price-currency').html($('#currency option:checked').text());
    $('#currency').on('change', function() {
        $('.maintenance-price-currency').html($('#currency option:checked').text());
    });

    $('#project_gallery').click(function() {
        $('.post-gallery-lb').show();
        if ($(this).prop('checked')) {
            $('.post-gallery-lb').hide();
        }
    });
});

function setPostFields() {
    var property_for = $('input[name=property_for]:checked').val();
    if (property_for == 'sale') {
        $('#floors_allowed_construction').closest('.col-12').removeClass('hide');
        $('#road_width_facing_plot').closest('.col-12').removeClass('hide');
        $('#video_link').closest('.floating-label-group').removeClass('hide');
    } else if (property_for == 'rent') {
        $('#floors_allowed_construction').closest('.col-12').addClass('hide');
        $('#road_width_facing_plot').closest('.col-12').addClass('hide');
        $('#video_link').closest('.floating-label-group').addClass('hide');
    } else if (property_for == 'hostel') {
        $('#floors_allowed_construction').closest('.col-12').addClass('hide');
        $('#road_width_facing_plot').closest('.col-12').addClass('hide');
        $('#video_link').closest('.floating-label-group').addClass('hide');
    }
}

function showHidePropertyTypeFor(val) {
    var property_type = $('#property_type_for option[value="' + val + '"]').parent().attr('label');
    if (property_type == 'Commercial') {
        $('#rooms').closest('.col-12').addClass('hide');
        $('#bedrooms').closest('.col-12').addClass('hide');
        $('#balcony').closest('.col-12').addClass('hide');
        $('#bathrooms').closest('.col-12').addClass('hide');
        $('#kitchen').closest('.col-12').addClass('hide');
        $('#garage').closest('.col-12').addClass('hide');
        $('#reference_id').closest('.col-12').addClass('hide');
        $('#facing').closest('.col-12').addClass('hide');
        $('#floors_allowed_construction').closest('.col-12').addClass('hide');
        $('#open_sides').closest('.col-12').addClass('hide');
        $('#road_width_facing_plot').closest('.col-12').addClass('hide');
        $('#amenities').closest('.col-12').addClass('hide');
        $('#kitchen_area_type').closest('.col-12').addClass('hide');
        $('#property_society').closest('.col-12').addClass('hide');

        $('#washroom').closest('.col-12').removeClass('hide');
        $('#personal_washroom').closest('.col-12').removeClass('hide');
        $('#pantry').closest('.col-12').removeClass('hide');
        $('#landzone').closest('.col-12').removeClass('hide');
        $('#propertyideals').closest('.col-12').removeClass('hide');
        $('.property-post .landmark-wrap').removeClass('hide');
    } else if (property_type == 'Residential') {
        $('#rooms').closest('.col-12').removeClass('hide');
        $('#bedrooms').closest('.col-12').removeClass('hide');
        $('#balcony').closest('.col-12').removeClass('hide');
        $('#bathrooms').closest('.col-12').removeClass('hide');
        $('#kitchen').closest('.col-12').removeClass('hide');
        $('#garage').closest('.col-12').removeClass('hide');
        $('#reference_id').closest('.col-12').removeClass('hide');
        $('#facing').closest('.col-12').removeClass('hide');
        $('#floors_allowed_construction').closest('.col-12').removeClass('hide');
        $('#open_sides').closest('.col-12').removeClass('hide');
        $('#road_width_facing_plot').closest('.col-12').removeClass('hide');
        $('#amenities').closest('.col-12').removeClass('hide');
        $('#kitchen_area_type').closest('.col-12').removeClass('hide');
        $('#property_society').closest('.col-12').removeClass('hide');

        $('#washroom').closest('.col-12').addClass('hide');
        $('#personal_washroom').closest('.col-12').addClass('hide');
        $('#pantry').closest('.col-12').addClass('hide');
        $('#landzone').closest('.col-12').addClass('hide');
        $('#propertyideals').closest('.col-12').addClass('hide');
        $('.property-post .landmark-wrap').addClass('hide');
    }
}

function showHidePropertyFor(val) {
    $('.monthly-post').show();
    $('#hostel_posting_as').closest('.col-12').addClass('hide');
    $('#preferred_gender').closest('.col-12').addClass('hide');
    $('#roomfacilities').closest('.col-12').addClass('hide');
    $('#roomtenants').closest('.col-12').addClass('hide');
    $('#commonamenities').closest('.col-12').addClass('hide');

    $('#property_type_for').closest('.col-12').removeClass('hide');
    $('#budget').closest('.col-12').removeClass('hide');
    $('#floors').closest('.col-12').removeClass('hide');
    $('#total_floors').closest('.col-12').removeClass('hide');
    $('#propertytransactions').closest('.col-12').removeClass('hide');
    $('#propertyareas').closest('.col-12').removeClass('hide');
    $('#carpet_area_type').closest('.col-12').removeClass('hide');

    if (val == 'sale') {
        $('.monthly-post').hide();
    } else if (val == 'hostel') {
        $('#hostel_posting_as').closest('.col-12').removeClass('hide');
        $('#bedrooms').closest('.col-12').removeClass('hide');
        $('#preferred_gender').closest('.col-12').removeClass('hide');
        $('#roomfacilities').closest('.col-12').removeClass('hide');
        $('#roomtenants').closest('.col-12').removeClass('hide');
        $('#commonamenities').closest('.col-12').removeClass('hide');

        $('#property_type_for').closest('.col-12').addClass('hide');
        $('#budget').closest('.col-12').addClass('hide');
        $('#rooms').closest('.col-12').addClass('hide');
        $('#balcony').closest('.col-12').addClass('hide');
        $('#floors').closest('.col-12').addClass('hide');
        $('#total_floors').closest('.col-12').addClass('hide');
        $('#propertytransactions').closest('.col-12').addClass('hide');
        $('#propertyareas').closest('.col-12').addClass('hide');
        $('#carpet_area_type').closest('.col-12').addClass('hide');
        $('#bathrooms').closest('.col-12').addClass('hide');
        $('#kitchen').closest('.col-12').addClass('hide');
        $('#garage').closest('.col-12').addClass('hide');
        $('#reference_id').closest('.col-12').addClass('hide');
        $('#facing').closest('.col-12').addClass('hide');
        $('#floors_allowed_construction').closest('.col-12').addClass('hide');
        $('#open_sides').closest('.col-12').addClass('hide');
        $('#road_width_facing_plot').closest('.col-12').addClass('hide');
        $('#amenities').closest('.col-12').addClass('hide');
        $('#kitchen_area_type').closest('.col-12').addClass('hide');
        $('#property_society').closest('.col-12').addClass('hide');
    }
}

function popLandTabOpen(id) {
    $('.landmark-tabs .pop-landmark li a').removeClass('active');
    //$('.landmark-tabs .landmarks-inner .col-12').hide();
    $('#' + id).addClass('active');
    $('.landmark-tabs .landmarks-inner .col-12.' + id).show();
}