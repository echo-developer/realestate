<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Admin extends Model
{
    use Notifiable;
    protected $table = 'admin';
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

    public $timestamps = false;


    public function admin_role()
    {
        return $this->belongsTo(Admin_Role::class, 'role', 'id');
    }

    use HasFactory;
}
