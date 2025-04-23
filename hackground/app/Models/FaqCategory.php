<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;  // Add SoftDeletes

class FaqCategory extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'id';
    protected $fillable = [
        'name', 'slug', 'order', 'status',
    ];
    protected $casts = [
        'name' => 'array',
    ];
}

