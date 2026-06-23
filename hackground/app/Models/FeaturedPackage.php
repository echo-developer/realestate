<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeaturedPackage extends Model
{
    use HasFactory;

    protected $table = 'featured_packages';

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'status',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
