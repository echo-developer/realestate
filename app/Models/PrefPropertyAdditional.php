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
        'property_status',
        'property_amenity',
        'total_flats',
        'token_amount',
    ];
    public $timestamps = false; 
}
