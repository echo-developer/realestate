<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProject extends Model
{
    protected $table = 'pref_project';
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
    use HasFactory;
}
