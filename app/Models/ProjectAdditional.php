<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAdditional extends Model
{
    protected $table = 'pref_project_additional';

    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'main_road_facing',
        'parking_availability',
        'project_amenity',
        'possession_status',
        'currency',
        'token_amount',
        'expected_price',
        'developer_details',
        'developer_name',
    ];
    use HasFactory;
}
