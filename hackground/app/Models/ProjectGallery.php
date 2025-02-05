<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectGallery extends Model
{
    protected $table = 'pref_project_gallery';
    protected $hidden = ['project_id'];
    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'image_type',
        'description'
    ];
    public $timestamps = false;

    public function images()
    {
        return $this->hasMany(ProjectGalleryImages::class, 'gallary_id', 'id');
    }
    use HasFactory;
}
