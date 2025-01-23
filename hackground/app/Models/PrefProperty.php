<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProperty extends Model
{
    use HasFactory;
    protected $fillable = ['uid','slug','name','is_featured','is_deleted','views','is_populer', 'status', 'slug'];
}
