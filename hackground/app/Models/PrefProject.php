<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProject extends Model
{
    protected $table = 'project';
    protected $hidden = ['updated_at'];

    protected $fillable = [
        'uid',
        'project_name',
        'slug',
        'project_desc',
        'is_popular',
        'status'
    ];
    public function settings()
    {
        return $this->hasOne(ProjectSetting::class, 'project_id', 'id');
    }

    public function additional()
    {
        return $this->hasOne(ProjectAdditional::class, 'project_id', 'id');
    }

    public function location()
    {
        return $this->hasOne(ProjectLocation::class, 'project_id', 'id');
    }

    public function gallery()
    {
        return $this->hasMany(ProjectGallery::class, 'project_id', 'id');
    }

    public function galleries() //this particular realation used in GetProjects in ProjectHomeController,
    {
        return $this->hasMany(ProjectGallery::class, 'project_id', 'id');
    }
    public function favorite()
    {
        return $this->hasMany(ProjectFavorite::class, 'project_id', 'id');
    }

    public function enquery()
    {
        return $this->hasMany(ProjectEnquery::class, 'project_id', 'id');
    }
    public function landmarks()
    {
        return $this->hasMany(ProjectLandmarks::class, 'project_id', 'id');
    }

    public function reports()
    {
        return $this->hasMany(PrefProjectReport::class, 'project_id', 'id');
    }

    public function propertyMapping()
    {
        return $this->hasMany(ProjectPropertyMapping::class, 'project_id', 'id');
    }

    public function certificates()
    {
        return $this->hasMany(CertificatesModel::class, 'project_id')->whereNotNull('project_id');
    }
    use HasFactory;
}
