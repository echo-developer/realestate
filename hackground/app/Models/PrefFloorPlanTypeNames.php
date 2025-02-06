<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefFloorPlanTypeNames extends Model
{
    use HasFactory;

    // Define the table name
    protected $table = 'pref_floor_plan_type_names';

    // Define fillable columns (for mass assignment)
    protected $fillable = [
        'fpt_id',
        'type',
        'lang',
    ];

    
    public function floorPlanType()
    {
        return $this->belongsTo(PrefFloorPlanType::class, 'fpt_id', 'id');
    }
}