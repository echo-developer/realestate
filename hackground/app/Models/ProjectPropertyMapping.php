<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectPropertyMapping extends Model
{
    use HasFactory;

    protected $table = 'project_property_mapping';
    protected $fillable = [
        'project_id',
        'tower_id',
        'property_id'
    ];
    public function property()
    {
        return $this->belongsTo(PrefProperty::class, 'property_id', 'id');
    }
    public $timestamps = false; 
}
