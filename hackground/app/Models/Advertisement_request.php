<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement_request extends Model
{
    use HasFactory;
    protected $primary_key = 'request_id';
    protected $table = 'advertisement_request';
	// protected $lang_table = 'advertisement_packages_names';

    protected $fillable = [
        'request_id',
        'advertiser_name',
        'email',
        'phone_code',
        'phone',
        'city_id',
        'locality_id',
        'page',
        'position',
        'duration',
        'status',
        'created_at',
    ];
}
