<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyLocation extends Model
{
    use HasFactory;
    protected $table = 'properties_location';
    protected $fillable = ['pid', 'city', 'locality', 'property_address', 'latitude', 'longitude'];
    public $timestamps = false;

    public function property()
    {
        return $this->belongsTo(PrefProperty::class, 'pid');
    }
}
