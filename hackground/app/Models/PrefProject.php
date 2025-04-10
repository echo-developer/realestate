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
    public function scopeFilter($query, $filters)
    {
        // Base query
        $query->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
            ->with([
                'settings:project_id,project_budget,parking_availability,total_towers',
                'additional:project_id,expected_price,project_amenity',
                'location:project_id,address',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ])
            ->orderBy('id', 'desc');


        if (!empty($filters['term'])) {
            $query->where('project_name', 'like', '%' . $filters['term'] . '%');
        }


        $query->when(!empty($filters['user_id']), fn($q) => $q->where('uid', $filters['user_id']));


        $query->when(!empty($filters['project_type']) || !empty($filters['occupied_area']) || !empty($filters['total_area']), function ($q) use ($filters) {
            $q->whereHas('settings', function ($subQ) use ($filters) {
                if (!empty($filters['project_type'])) {
                    $subQ->where('project_type', $filters['project_type']);
                }
                if (!empty($filters['occupied_area'])) {
                    $subQ->where('occupied_area', $filters['occupied_area']);
                }
                if (!empty($filters['total_area'])) {
                    $subQ->where('total_area', $filters['total_area']);
                }
            });
        });

        $query->when(!empty($filters['possession_status']) || !empty($filters['price']), function ($q) use ($filters) {
            $q->whereHas('additional', function ($subQ) use ($filters) {
                if (!empty($filters['possession_status'])) {
                    $subQ->where('possession_status', $filters['possession_status']);
                }
                if (!empty($filters['price'])) {
                    $subQ->where('expected_price', $filters['price']);
                }
            });
        });

        // Filter related location
        $query->when(!empty($filters['address']), function ($q) use ($filters) {
            $q->whereHas('location', function ($subQ) use ($filters) {
                $subQ->where('address', 'like', '%' . $filters['address'] . '%');
            });
        });

        return $query;
    }


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
