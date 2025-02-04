<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefCustomer extends Model
{
    use HasFactory;

    protected $table = 'pref_customer';

    protected $primaryKey = 'cid';

    protected $fillable = [
        'Phone',
        'Name',
        'Email',
        'status',
        'created_at' ,
        'updated_at',
    ];

    public function customer()
    {
        return $this->hasMany(ProjectEnquery::class, 'cid', 'cid');
    }
}
