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
        return $this->hasMany(PropertyReports::class, 'property_id', 'id');
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
        \Illuminate\Support\Facades\Log::info("===== START NEARBY LANDMARKS =====");
        \Illuminate\Support\Facades\Log::info("Property ID: " . $property_id);

        $property = DB::table('properties_location')
            ->where('pid', $property_id)
            ->select('latitude', 'longitude')
            ->first();

        $latitude = $property->latitude ?? null;
        $longitude = $property->longitude ?? null;
        \Illuminate\Support\Facades\Log::info("Initial Property Location coordinates - Lat: " . ($latitude ?? 'null') . ", Lng: " . ($longitude ?? 'null'));

        $isValidCoordinate = function($lat, $lng) {
            return !empty($lat) && !empty($lng) && is_numeric($lat) && is_numeric($lng) && (float)$lat != 0 && (float)$lng != 0;
        };

        // Fallback 1: Locality Coordinates
        if (!$isValidCoordinate($latitude, $longitude)) {
            $localityId = DB::table('properties_location')
                ->where('pid', $property_id)
                ->value('locality');
            \Illuminate\Support\Facades\Log::info("Coordinates invalid. Fetching locality ID: " . ($localityId ?? 'null'));

            if ($localityId) {
                $locality = DB::table('locality')
                    ->where('locality_id', $localityId)
                    ->select('latitude', 'longitude')
                    ->first();
                
                if ($locality && $isValidCoordinate($locality->latitude, $locality->longitude)) {
                    $latitude = $locality->latitude;
                    $longitude = $locality->longitude;
                    \Illuminate\Support\Facades\Log::info("Locality Coordinates Fallback Success - Lat: $latitude, Lng: $longitude");
                }
            }
        }

        // Fallback 2: City Coordinates
        if (!$isValidCoordinate($latitude, $longitude)) {
            $cityId = DB::table('properties_location')
                ->where('pid', $property_id)
                ->value('city');
            \Illuminate\Support\Facades\Log::info("Coordinates still invalid. Fetching City ID: " . ($cityId ?? 'null'));

            if ($cityId) {
                $city = DB::table('city')
                    ->where('city_id', $cityId)
                    ->select('latitude', 'longitude')
                    ->first();
                
                if ($city && $isValidCoordinate($city->latitude, $city->longitude)) {
                    $latitude = $city->latitude;
                    $longitude = $city->longitude;
                    \Illuminate\Support\Facades\Log::info("City Coordinates Fallback Success - Lat: $latitude, Lng: $longitude");
                }
            }
        }

        if (!$isValidCoordinate($latitude, $longitude)) {
            \Illuminate\Support\Facades\Log::error("No valid coordinates found after fallbacks for property: " . $property_id);
            return [];
        }

        \Illuminate\Support\Facades\Log::info("Final resolved coordinates - Lat: $latitude, Lng: $longitude");
        return self::nearby_landmarks_from_google($latitude, $longitude);
    }

    public static function nearby_landmarks_from_google($latitude, $longitude)
    {
        $apiKey = get_setting('google-api-key');
        if (!$apiKey) {
            \Illuminate\Support\Facades\Log::error("Google API key is missing in settings!");
            return [];
        }
        \Illuminate\Support\Facades\Log::info("Google API Key fetched successfully: " . substr($apiKey, 0, 8) . "...");

        // Round coordinates to 3 decimal places (~110m grid) for highly consolidated, performant caches
        $roundedLat = round((float)$latitude, 3);
        $roundedLng = round((float)$longitude, 3);
        $cacheKey = "google_landmarks_v5_" . md5($roundedLat . "_" . $roundedLng);
        \Illuminate\Support\Facades\Log::info("Rounding coordinates to 3 decimal places - Lat: $roundedLat, Lng: $roundedLng (Cache Key: $cacheKey)");

        $result = \Illuminate\Support\Facades\Cache::remember($cacheKey, 86400 * 30, function() use ($roundedLat, $roundedLng, $latitude, $longitude, $apiKey) {
            return self::fetch_landmarks_direct($roundedLat, $roundedLng, $latitude, $longitude, $apiKey);
        });

        // Cache-Busting/Self-Healing logic:
        // If the cached results are empty arrays across all categories, it means a previous API attempt failed or was unbilled.
        // We will automatically flush this bad cache and fetch fresh results.
        $totalItems = 0;
        if (is_array($result)) {
            foreach ($result as $items) {
                if (is_array($items)) {
                    $totalItems += count($items);
                }
            }
        }

        if ($totalItems === 0 || request()->has('flush_cache')) {
            \Illuminate\Support\Facades\Log::info("CACHE BYPASS/RESET - Cached result was empty (or flush_cache requested). Fetching fresh from Google.");
            \Illuminate\Support\Facades\Cache::forget($cacheKey);
            
            $freshResult = self::fetch_landmarks_direct($roundedLat, $roundedLng, $latitude, $longitude, $apiKey);
            
            $freshTotal = 0;
            if (is_array($freshResult)) {
                foreach ($freshResult as $items) {
                    if (is_array($items)) {
                        $freshTotal += count($items);
                    }
                }
            }

            if ($freshTotal > 0) {
                \Illuminate\Support\Facades\Cache::put($cacheKey, $freshResult, 86400 * 30);
                \Illuminate\Support\Facades\Log::info("Successfully populated cache with fresh landmarks ($freshTotal items).");
            }
            return $freshResult;
        }

        \Illuminate\Support\Facades\Log::info("Cache hit successfully returned " . $totalItems . " landmarks.");
        return $result;
    }

    private static function fetch_landmarks_direct($roundedLat, $roundedLng, $latitude, $longitude, $apiKey)
    {
        \Illuminate\Support\Facades\Log::info("FETCH DIRECT - Requesting landmarks from Google Places API for grid center: $roundedLat, $roundedLng");
        $types = [
            'education' => 'school|university',
            'metro' => 'subway_station',
            'rail' => 'train_station',
            'bus' => 'transit_station',
            'healthcare' => 'hospital|doctor',
            'shopping' => 'shopping_mall|supermarket',
            'park' => 'park'
        ];

        $result = [];

        // Make concurrent parallel requests to Google Places API in a pool to slash latency
        $responses = \Illuminate\Support\Facades\Http::pool(function (\Illuminate\Http\Client\Pool $pool) use ($roundedLat, $roundedLng, $types, $apiKey) {
            $poolRequests = [];
            foreach ($types as $key => $googleType) {
                $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
                $params = [
                    'location' => "$roundedLat,$roundedLng",
                    'radius' => 3000,
                    'key' => $apiKey
                ];
                
                // For transit-based or official singular Google types, use 'type' to avoid text-match confusions.
                // For multi-keyword searches, fall back to 'keyword' parameter.
                if ($key === 'metro' || $key === 'rail' || $key === 'bus' || $key === 'park') {
                    $params['type'] = $googleType;
                } else {
                    $params['keyword'] = str_replace('|', ' OR ', $googleType);
                }
                
                $poolRequests[$key] = $pool->as($key)->get($url, $params);
            }
            return $poolRequests;
        });

        foreach ($types as $key => $googleType) {
            try {
                if (isset($responses[$key])) {
                    $successful = $responses[$key]->successful();
                    $status = $responses[$key]->status();
                    \Illuminate\Support\Facades\Log::info("Category $key response received: HTTP status $status" . ($successful ? " (Success)" : " (Fail)"));
                    
                    $response = $successful ? $responses[$key]->json() : null;
                    
                    if ($response) {
                        $apiStatus = $response['status'] ?? 'UNKNOWN';
                        \Illuminate\Support\Facades\Log::info("Category $key Google API status: $apiStatus");
                        
                        if ($apiStatus !== 'OK' && $apiStatus !== 'ZERO_RESULTS') {
                            \Illuminate\Support\Facades\Log::error("Category $key Google API Error detail: " . json_encode($response));
                        }
                    }
                } else {
                    \Illuminate\Support\Facades\Log::error("No response found in pool for category: $key");
                    $response = null;
                }

                if (!empty($response['results'])) {
                    $items = [];
                    foreach ($response['results'] as $place) {
                        $placeLat = $place['geometry']['location']['lat'] ?? null;
                        $placeLng = $place['geometry']['location']['lng'] ?? null;

                        if ($placeLat && $placeLng) {
                            // Distance calculation uses precise coordinates ($latitude, $longitude) for absolute precision
                            $distance = self::calculate_haversine_distance($latitude, $longitude, $placeLat, $placeLng);
                            $items[] = [
                                'name' => $place['name'] ?? '',
                                'distance' => (float) $distance
                            ];
                        }
                    }

                    // Sort closest landmarks first
                    usort($items, function($a, $b) {
                        return $a['distance'] <=> $b['distance'];
                    });

                    // Deduplicate by name (keep closest entry for each unique name)
                    $seen = [];
                    $unique = [];
                    foreach ($items as $item) {
                        $normalizedName = strtolower(trim($item['name']));
                        if (!isset($seen[$normalizedName])) {
                            $seen[$normalizedName] = true;
                            $unique[] = $item;
                        }
                    }

                    // Limit to top 5 landmarks per category
                    $result[$key] = array_slice($unique, 0, 5);
                    \Illuminate\Support\Facades\Log::info("Category $key successfully fetched " . count($result[$key]) . " landmarks.");
                } else {
                    $result[$key] = [];
                    \Illuminate\Support\Facades\Log::info("Category $key returned 0 landmarks.");
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Error processing Google landmarks for category $key: " . $e->getMessage());
                $result[$key] = [];
            }
        }

        return $result;
    }

    private static function calculate_haversine_distance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // in meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c; // distance in meters
    }
}
