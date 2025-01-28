<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectProperty extends Model
{
    protected $table;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = prefixed_table_name('project_properties');
    }

    protected $fillable = [
        'project_id',
        'tower_name',
        'lift_no',
        'floor_no',
        'flats_per_floor',
        'property_id'
    ];

}

