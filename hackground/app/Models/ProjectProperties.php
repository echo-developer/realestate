<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectProperties extends Model
{
    protected $table ='project_properties';
    protected $fillable = [
        'project_id',
        'tower_name',
        'lift_no',
        'floor_no',
        'flats_per_floor',
        'property_id',
        'created_at	',
        'updated_at',
    ];
    use HasFactory;
}
