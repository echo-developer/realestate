<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metro extends Model
{
    use HasFactory;
    protected $table='metro_station';
    protected $fillable=['name','long','lat','status'];
}
