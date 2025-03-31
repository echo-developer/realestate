<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyAdditional extends Model
{
    use HasFactory;
    protected $table = 'property_additional';
    protected $fillable = [
        'pid',
        'floor',
        'total_floor',
        'kitchen',
        'corner_plot',
        'construct_year',
        'possession_status',
        'property_furnish',
        'property_amenity',
        'total_flats',
        'token_amount',
        'allowed_construction',
        'is_personal_washroom',
        'pantry_cafeteria_status',
        'floor_plan_image',
        'is_corner_shop',
        'faces_main_road',
        'washroom',
        'balcony',
        'property_desc',
        'expected_possesion_month_year',
        'bhk_type',
        'bhk_id',
        'facing_direction',
        'brochure_file',
        'ownership_type',
        'flooring_style',
        'buyer_message',
        'electric_available',
        'water_available',
        'lifts_in_tower',
        'flat_each_floor',
        'car_parking',
        'approved_by',
        'total_open_sides',
        'road_width',
        'boundary_wall',
        'is_gated_colony',
        'construction_done',
        'launch_date',
        'ceiling_height'
    ];
    public $timestamps = false;

    protected $hidden = [
        'id',
        'pid',
    ];
}
