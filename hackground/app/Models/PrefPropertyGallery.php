<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyGallery extends Model
{
    use HasFactory;
    protected $table = 'property_gallary';

    // Specify which fields are mass assignable
    protected $fillable = [
        'pid',
        'image_type',
        'caption',
    ];
    public $timestamps = false; 
    public function images()
    {
        return $this->hasMany(PrefPropertyGalleryImage::class, 'gallary_id', 'id');
    }
}
