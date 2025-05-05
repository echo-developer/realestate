<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Railway extends Model
{
    use HasFactory;
    protected $table='railway_station';
    protected $fillable=['name','long','lat','status'];
}
