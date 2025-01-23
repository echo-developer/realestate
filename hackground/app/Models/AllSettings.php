<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllSettings extends Model
{

    protected $table = 'pref_all_setting';

    protected $fillable = [
        'title',
        'setting_key',
        'setting_value',
        'editable',
        'deletable',
        'display_order',
        'status',
        'setting_group',
    ];
    use HasFactory;
}
