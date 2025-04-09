<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSearchActivity extends Model
{
    use HasFactory;
    protected $table = 'user_activity';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'property_type',
        'property_for',
        'post_for',
        'city_id',
        'min_budget',
        'max_budget',
        'json_filters',
    ];

    public $timestamps = true;
}
