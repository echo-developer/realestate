<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FloorPlan extends Model
{
    use HasFactory;

    protected $table = 'pref_floor_plan';
    protected $fillable = ['status', 'fp_type'];

    public function names()
    {
        return $this->hasMany(FloorPlanName::class, 'fp_id');
    }
}
