<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectLocation extends Model
{
    protected $table = 'project_location';
    protected $hidden = ['project_id'];
    // Specify the fillable attributes
    protected $fillable = [
        'project_id',
        'locality',
        'city',
        'address',
        'latitude',
        'longitude'
    ];
    public $timestamps = false;

    public function locality_det()
    {
        return $this->belongsTo(LocalityModel::class, 'locality');
    }
    use HasFactory;
}
