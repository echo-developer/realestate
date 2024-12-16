<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyGallery extends Model
{
    use HasFactory;
    protected $table = 'table_pref_property_gallary';

    // Specify which fields are mass assignable
    protected $fillable = [
        'pid',
        'gallery',
        'caption',
    ];
    public $timestamps = false; 
}
