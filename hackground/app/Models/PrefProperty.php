<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProperty extends Model
{
    use HasFactory;
    protected $table = 'properties';
    protected $fillable = [
        'uid',
        'slug',
        'name',
        'is_featured',
        'is_deleted',
        'views',
        'is_populer',
        'status',
        'slug',
        'is_under_project',
        
    ];

    public function settings()
    {
        return $this->hasOne(PrefPropertySetting::class, 'pid', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'uid', 'id');
    }

    public function additional()
    {
        return $this->hasOne(PrefPropertyAdditional::class, 'pid', 'id');
    }

    public function location()
    {
        return $this->hasOne(PrefPropertyLocation::class, 'pid', 'id');
    }
    public function dimensions()
    {
        return $this->hasMany(PrefPropertyDimension::class, 'pid', 'id');
    }
    public function projectProperty()
    {
        return $this->hasOne(ProjectProperties::class, 'property_id', 'id');
    }
    public function gallery()
    {
        return $this->hasMany(PrefPropertyGallery::class, 'pid', 'id');
    }
    public function landmarks()
    {
        return $this->hasMany(PrefPropertyLandmark::class, 'property_id', 'id');
    }
    public function projectMapping()
    {
        return $this->hasOne(ProjectPropertyMapping::class, 'property_id', 'id');
    }

    public function reports()
    {
        return $this->hasMany(PrefPropertyReport::class, 'property_id', 'id');
    }

    public function views()
    {
        return $this->hasMany(PropertyView::class, 'property_id', 'id');
    }

    public function certificates()
    {
        return $this->hasMany(CertificatesModel::class, 'property_id')->whereNotNull('property_id');
    }
}
