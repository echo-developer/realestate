<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProject extends Model
{
    protected $table = 'pref_project';
    protected $fillable = [
        'uid',
        'project_name',
        'slug',
        'project_desc',
        'status',
    ];
    use HasFactory;
}
