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

        if (!empty($filters['slug'])) {
            $query->where('slug', $filters['slug']);
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


    // public function searchProject($data, $user_id, $hasLatLang)
    // {
    //     // log::info($data);
    //     $query = PrefProject::where([
    //         ['uid', '!=', $this->auth_user_id],
    //         ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
    //         ['status', '=', config('constants.STATUS_ACTIVE')],
    //     ])
    //         ->with([
    //             'settings:project_id,project_budget,post_for,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type,area_in_sqft',
    //             'additional:project_id,main_road_facing,project_amenity,possession_status,construct_year,possesion_month_possesion_year,currency,token_amount,expected_price,developer_details,developer_name,developer_experience',
    //             'location:project_id,locality,city,address,latitude,longitude',
    //             'gallery:id,project_id,image_type',
    //             'gallery.images:gallary_id,filename,caption'
    //         ])
    //         ->get();

    //     // log::info('$filteredData' . json_encode($query, JSON_PRETTY_PRINT));


    //     $filteredData = $query->filter(function ($project) use ($data, $hasLatLang) {

    //         $settings = $project->settings;
    //         $location = $project->location;
    //         $additional = $project->additional;

    //         if (!empty($data['city_id'])) {
    //             $cityIds = array_map('intval', explode(',', $data['city_id']));
    //             if (!$location || !in_array((int)$location->city, $cityIds)) {
    //                 return false;
    //             }
    //         }

    //         if ($hasLatLang == 1) {
    //             if (
    //                 !$location ||
    //                 empty($location->latitude) ||
    //                 empty($location->longitude)
    //             ) {
    //                 return false;
    //             }
    //         }


    //         if (!empty($data['locality'])) {
    //             if (!$location || ($location->locality == $data['locality']) === false) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['project_name'])) {
    //             if (stripos($project->project_name, $data['project_name']) === false) {
    //                 return false;
    //             }
    //         }


    //         if (!empty($data['project_amenity'])) {

    //             $selectedAmenities = array_map('intval', $data['project_amenity']);
    //             $projectAmenities = $additional->project_amenity ? json_decode($additional->project_amenity, true) : [];
    //             if (empty(array_intersect($selectedAmenities, $projectAmenities))) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['project_furnish'])) {
    //             $data['project_furnish'] = array_map('intval', $data['project_furnish']);
    //             if (!$settings || !in_array($settings->project_furnish, $data['project_furnish'])) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['parking_availability'])) {
    //             if (!$settings || !in_array(strtolower($settings->parking_availability), $data['parking_availability'])) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['project_facing'])) {
    //             if (!$settings || !in_array(strtolower($settings->project_facing), $data['project_facing'])) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['total_towers'])) {
    //             $data['total_towers'] = array_map('intval', $data['total_towers']);
    //             if (!$settings || !in_array($settings->total_towers, $data['total_towers'])) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['project_type'])) {
    //             if (!$settings || $settings->project_type != $data['project_type']) {
    //                 return false;
    //             }
    //         }
    //         if (!empty($data['project_for'])) {
    //             if (!$settings || $settings->post_for != $data['project_for']) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['possession_status'])) {
    //             if (!$additional || $additional->possession_status != $data['possession_status']) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['min_price']) || !empty($data['max_price'])) {
    //             if (!$additional) {
    //                 return false;
    //             }
    //             $expectedPrice = $additional->expected_price ?? 0;
    //             $minBudget = $data['min_price'] ?? 0;
    //             $maxBudget = $data['max_price'] ?? PHP_INT_MAX;

    //             if ($expectedPrice < $minBudget || $expectedPrice > $maxBudget) {
    //                 return false;
    //             }
    //         }

    //         if (!empty($data['occupied_area[min]']) || !empty($data['occupied_area[max]'])) {
    //             if (!$settings) {
    //                 return false;
    //             }
    //             $occupiedArea = $settings->occupied_area ?? 0;
    //             $minOccupied = $data['occupied_area[min]'] ?? 0;
    //             $maxOccupied = $data['occupied_area[max]'] ?? PHP_INT_MAX;
    //             if ($occupiedArea < $minOccupied || $occupiedArea > $maxOccupied) {
    //                 return false;
    //             }
    //         }


    //         return true;
    //     });
    //     return $filteredData;
    // }


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
        return $this->hasMany(ProjectReports::class, 'project_id', 'id');
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
