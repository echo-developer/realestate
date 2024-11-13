<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin_Role extends Model
{

    protected $table = 'pref_admin_role';
    protected $fillable = [

        'id',
        'name',
        'slug',
        'status',
        'created_at',
        'updated_at',
    ];
    use HasFactory;
}
