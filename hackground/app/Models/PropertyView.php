<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyView extends Model
{
    use HasFactory;
    protected $table = 'property_views'; 
    public $timestamps = false; // No created_at & updated_at
    protected $fillable = ['property_id', 'view_date', 'view_count'];
}
