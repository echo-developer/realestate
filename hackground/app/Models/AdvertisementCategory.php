<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdvertisementCategory extends Model
{
    use HasFactory;

    protected $primary_key = 'advertisement_id';
    protected $table = 'advertisement_category';
	// protected $lang_table = 'advertisement_packages_names';

    protected $fillable = [
        'advertisement_id',
        'property_category',
        'property_sub_category',
    ];
}
