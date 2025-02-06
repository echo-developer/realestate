<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefFloorPlanType extends Model
{
    use HasFactory;
    protected $table = 'pref_floor_plan_type';

   
    protected $primaryKey = 'id';

  
    protected $fillable = [
        'slug',
        'status',
    ];
    public function names()
    {
        return $this->hasMany(PrefFloorPlanTypeNames::class, 'fpt_id', 'id');
    }
}