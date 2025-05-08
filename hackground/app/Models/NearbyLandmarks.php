<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NearbyLandmarks extends Model
{
    use HasFactory;
    protected $table = 'nearby_landmarks';
    protected $fillable = [
        'uid',
        'property_id',
        'loc_id',
        'landmark_type',
        'landmark_id',
        'distance',
    ];
}
