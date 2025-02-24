<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertySetting extends Model
{
    use HasFactory;
    protected $table = 'pref_properties_settings';
    protected $fillable = [
        'pid',
        'parking_ability',
        'property_type_for',
        'bedrooms',
        'bathrooms',
        'project_name',
        'unit_type',
        'property_type',
        'carpet_area',
        'plot_area',
        'rooms',
        'expected_price',
        'post_for',
        'price_currency',
        'property_budget',
        'super_area'
    ];
    public $timestamps = false; 
}
