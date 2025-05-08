<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    public static function nearby_landmarks($property_id)
    {
        $landmarks = DB::table('nearby_landmarks')
            ->where('property_id', $property_id)
            ->get();

        $result = [];

        // Count landmarks per type
        $typeCounts = $landmarks->groupBy('landmark_type')->map->count();

        foreach ($landmarks as $index => $landmark) {
            // Get the table name based on landmark_type
            $tableMap = [
                'education' => 'education',
                'metro' => 'metro_station',
                'rail' => 'railway_station',
                'bus' => 'bus_stand',
                'healthcare' => 'hospital',
                'others' => 'others_landmarks'
            ];

            $landmarkTable = $tableMap[$landmark->landmark_type] ?? null;

            if (!$landmarkTable) continue;

            // Get the landmark name from the respective table
            $name = DB::table($landmarkTable)
                ->where('id', $landmark->landmark_id)
                ->value('name') ?? '';

            // Prepare landmark data
            $data = [
                'name' => $name,
                'distance' => (float) $landmark->distance,
            ];

            // Push to result
            $result[$landmark->landmark_type][] = $data;
        }

        return  $result;
    }
}
