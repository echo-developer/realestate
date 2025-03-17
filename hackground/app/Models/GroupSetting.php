<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupSetting extends Model
{

    protected $table = 'setting_group';

    
    protected $fillable = [
        'group_name',
        'group_key',
        'status',
    ];
    use HasFactory;
}
