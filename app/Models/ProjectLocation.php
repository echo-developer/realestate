<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectLocation extends Model
{
    protected $table = 'pref_project_location';

    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'locality',
        'city',
        'address',
    ];
    use HasFactory;
}
