<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'pref_admin_notifications';
    protected $fillable = [
        
        'message',
        'read_status',
        'link',
        'template_key',
    ];
    use HasFactory;
    use HasFactory;
}
