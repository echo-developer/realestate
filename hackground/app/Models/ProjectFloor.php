<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectFloor extends Model
{
    use HasFactory;

    protected $table = 'project_floors';
    protected $fillable = [
        'tower_id',
        'floor_no'
    ];

    // Relationship with Tower
    public function tower() {
        return $this->belongsTo(ProjectProperties::class, 'tower_id', 'id');
    }

    // Relationship with Property Mappings
    public function properties() {
        return $this->hasMany(ProjectPropertyMapping::class, 'floor_id', 'id');
    }
}
