<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAdditional extends Model
{
    protected $table = 'user_additional_data';
    protected $fillable = [
        'user_id',
        'address',
        'city',
        'website_url',
        'website_title',
        'description'
    ];
    protected $hidden = [
        'id', 
        'user_id', 
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    use HasFactory;
}
