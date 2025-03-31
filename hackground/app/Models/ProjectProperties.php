<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectProperties extends Model
{
    protected $table = 'project_properties';
    protected $fillable = [
        'project_id',
        'tower_name',
        'slug',
        'lift_no',
        'stair_no',
        'fire_safety',
        'created_at	',
        'updated_at',
    ];
    public function properties()
    {
        return $this->hasMany(ProjectPropertyMapping::class, 'tower_id', 'id');
    }

    public function floors()
    {
        return $this->hasMany(ProjectFloor::class, 'tower_id', 'id');
    }
    use HasFactory;
}
