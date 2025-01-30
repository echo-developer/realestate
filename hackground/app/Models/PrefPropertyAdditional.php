<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyAdditional extends Model
{
    use HasFactory;
    protected $table = 'pref_property_additional';
    protected $fillable = [
        'pid',
        'floor',
        'kitchen',
        'corner_plot',
        'construct_year',
        'possession_status',
        'property_furnish',
        'property_amenity',
        'total_flats',
        'token_amount',
        'total_floor',
        'is_personal_washroom',
        'pantry_cafeteria_status',
        'is_corner_shop',
        'faces_main_road',
        'washroom',
        'balcony',
        'property_desc',
        'expected_possesion_month_year',
        'bhk_type',
        'bhk_id'

    ];
    public $timestamps = false; 
}
