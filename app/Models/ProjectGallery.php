<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectGallery extends Model
{
    protected $table = 'pref_project_gallery';

    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'image_type',
        'description',
    ];
    use HasFactory;
}
