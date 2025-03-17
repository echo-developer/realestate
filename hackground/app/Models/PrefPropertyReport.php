<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyReport extends Model
{
    use HasFactory;


    protected $table = 'property_report';

   
    protected $fillable = [
        'property_id',
        'property_posted_by',
        'user_id',
        'reason',
        'feedback',
        'status',
        'created_at',
        'updated_at',
    ];

  
    public $timestamps = false;

    public function property()
    {
        return $this->belongsTo(PrefProperty::class, 'property_id', 'id');
    }
}
