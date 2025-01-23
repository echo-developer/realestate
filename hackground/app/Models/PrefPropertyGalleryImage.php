<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyGalleryImage extends Model
{
    use HasFactory;
    protected $table = 'pref_property_gallary_images';

    // Specify which fields are mass assignable
    protected $fillable = [
        'gallary_id',
        'filename',
        'type',
    ];
    public $timestamps = false; 
}
