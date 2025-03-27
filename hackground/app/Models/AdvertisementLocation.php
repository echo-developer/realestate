<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertisementLocation extends Model
{
    use HasFactory;

    protected $primary_key = 'advertisement_id';
    protected $table = 'advertisement_locations';
	// protected $lang_table = 'advertisement_packages_names';

    protected $fillable = [
        'advertisement_id',
        'location_id',
        'city_id',
        'country_id'
    ];
}
