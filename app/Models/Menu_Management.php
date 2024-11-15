<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu_Management extends Model
{
    protected $table = 'menu__management';
    protected $fillable = [
        
        '_menu_name',
        '_menu_slug',
        '_menu_url',
        '_menu_icon',
    ];
    use HasFactory;
}
