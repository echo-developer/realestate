<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefFloorPlanValue extends Model
{
    use HasFactory;

    protected $table = 'floor_plan_values';

    protected $fillable = [
        'project_id', 
        'fpt_id', 
        'fp_id', 
        'desc'
    ];
    public $timestamps = false; 

    public function floorPlan()
    {
        return $this->belongsTo(FloorPlan::class, 'fp_id');
    }

    public function floorPlanType()
    {
        return $this->belongsTo(PrefFloorPlanType::class, 'fpt_id');
    }

    
}
