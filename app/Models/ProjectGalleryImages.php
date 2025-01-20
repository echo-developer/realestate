<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectGalleryImages extends Model
{
    protected $table = 'pref_project_gallery_images';

    // Specify the fillable attributes
    protected $fillable = [
        'gallary_id',
        'filename',
        'caption'
    ];
    public $timestamps = false; 
    
    use HasFactory;
}
