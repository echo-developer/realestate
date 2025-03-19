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
        'floor_no',
        'flat_no'
    ];

    
    public function tower() {
        return $this->belongsTo(ProjectProperties::class, 'tower_id', 'id');
    }

    public function properties() {
        return $this->hasMany(ProjectPropertyMapping::class, 'floor_id', 'id');
    }
}
