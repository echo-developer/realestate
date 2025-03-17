<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectAdditional extends Model
{
    protected $table = 'project_additional';
    protected $hidden = ['id','project_id'];
    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'main_road_facing',
        'project_amenity',
        'construct_year',
        'possession_status',
        'possesion_month_possesion_year',
        'currency',
        'token_amount',
        'expected_price',
        'developer_details',
        'developer_name',
        'overlooking',
        'flooring_style',
        'water_availability',
        'electric_availability',
        'type_of_ownership',
        'brochure_file'
    ];
    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }
    public $timestamps = false;

    use HasFactory;
}
