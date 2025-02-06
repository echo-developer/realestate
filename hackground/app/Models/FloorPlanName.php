<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FloorPlanName extends Model
{
    use HasFactory;

    protected $table = 'pref_floor_plan_names';
    protected $fillable = ['fp_id', 'item', 'desc', 'lang'];
    public $timestamps = false; 
}
