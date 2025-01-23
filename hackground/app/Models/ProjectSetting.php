<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectSetting extends Model
{
    protected $table = 'pref_project_settings';
    protected $hidden = ['project_id'];
    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'project_budget',
        'parking_availability',
        'floor',
        'carpet_area',
        'super_area',
        'total_units',
        'project_furnish',
        'project_type',
    ];
    public $timestamps = false; 
    use HasFactory;
}
