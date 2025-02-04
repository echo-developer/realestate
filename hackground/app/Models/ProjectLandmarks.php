<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectLandmarks extends Model
{

    protected $table = 'pref_project_landmarks';

    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'project_id',
        'landmark_type',
        'landmark_type_count',
        'landmark_details',
    ];

    public $timestamps = false;

    use HasFactory;

    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }
}
