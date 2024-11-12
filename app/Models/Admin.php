<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'pref_admin';
    protected $fillable = [

        'id',
        'username',
        'email',
        'password',
        'full_name',
        'role',
        'status',
        'registered_on',
        'remember_token'
    ];

    use HasFactory;
}
