<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Others extends Model
{
    use HasFactory;
    protected $table = 'others_landmarks';
    protected $fillable = ['name', 'long', 'lat', 'status'];
}
