<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\GoogleCityService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleCityController extends Controller
{
    protected $cityService;

    public function __construct(GoogleCityService $googleCityService)
    {
        $this->cityService = $googleCityService;
    }

    public function fetchCityfromDatabase(Request $request)
    {
        try {
            $keyword = $request->keyWord;
            $lang = $request->input('lang', 'en');
            
            $data = DB::table('city_names')
                ->leftJoin('city', 'city_names.city_id', '=', 'city.city_id')
                ->select('city_names.city_id', 'city_names.name', 'city.latitude', 'city.longitude')
                ->where('city_names.lang', $lang)
                ->where('city.status', 1)
                ->where('city_names.name', 'LIKE', $keyword . '%')
                ->limit(11)
                ->get()
                ->toArray();

            $message = !empty($data) ? 'City Retrieved' : 'No City Found';

            return response()->json([
                'status' => 1,
                'message' => $message,
                'data' => !empty($data) ? $data : []
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getGoogleCities(Request $request)
    {
        try {
            $data = $this->cityService->fetchAndSaveCities($request);

            return response()->json([
                'status' => $data['status'],
                'message' => $data['message'],
                'data' => $data['data']
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveCityLatLong(Request $request)
    {
        try {
            $apiKey = get_setting('google-api-key');
            $cURLRequest = collect($request->input('data'));

            $cURLRequest->each(function ($item) use ($apiKey) {
                $placeId = $item['place_id'] ?? null;

                if (!empty($placeId)) {
                    $detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
                        'place_id' => $placeId,
                        'fields' => 'geometry',
                        'key' => $apiKey
                    ]);

                    $detailsResponse = Http::get($detailsUrl)->json();
                    if (isset($detailsResponse['result']['geometry']['location'])) {
                        DB::table('city')
                            ->where('google_place_id', $placeId)
                            ->update([
                                'latitude' => $detailsResponse['result']['geometry']['location']['lat'] ?? null,
                                'longitude' => $detailsResponse['result']['geometry']['location']['lng'] ?? null,
                            ]);
                    }
                }
            });
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveGoogleCity(Request $request)
    {
        try {
            $placeId = $request->input('place_id');
            $name = $request->input('name');
            $lang = $request->input('lang', 'en');

            if (empty($placeId) || empty($name)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'place_id and name are required',
                    'data' => null
                ]);
            }

            // Check if city already exists in the database
            $slug = Str::slug($name, '_');
            $cityRecord = DB::table('city')
                ->join('city_names', 'city.city_id', '=', 'city_names.city_id')
                ->where('city_names.lang', $lang)
                ->where(function ($query) use ($slug, $placeId) {
                    $query->where('city.google_place_id', $placeId)
                        ->orWhere('city.slug', $slug);
                })
                ->first();

            if ($cityRecord) {
                return response()->json([
                    'status' => 1,
                    'message' => 'City already exists',
                    'data' => [
                        'city_id' => $cityRecord->city_id,
                        'name' => $cityRecord->name,
                        'latitude' => $cityRecord->latitude,
                        'longitude' => $cityRecord->longitude,
                    ]
                ]);
            }

            // Not existing, so save it
            $countryId = get_setting('other-country-id') ?? 101;
            $stateId = get_setting('other-state-id') ?? 1;

            $getId = DB::table('city')->insertGetId([
                'country' => $countryId,
                'state' => $stateId,
                'google_place_id' => $placeId,
                'slug' => $slug,
                'order' => rand(1, 4),
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $langs = [
                'en' => $name,
                'ar' => $name,
            ];

            foreach ($langs as $langCode => $langName) {
                DB::table('city_names')->insert([
                    'city_id' => $getId,
                    'lang' => $langCode,
                    'name' => $langName,
                ]);
            }

            // Fetch geometry/coordinates from Google Places API
            $apiKey = get_setting('google-api-key');
            $latitude = null;
            $longitude = null;

            if (!empty($apiKey)) {
                $detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
                    'place_id' => $placeId,
                    'fields' => 'geometry',
                    'key' => $apiKey
                ]);

                $detailsResponse = Http::get($detailsUrl)->json();
                if (isset($detailsResponse['result']['geometry']['location'])) {
                    $latitude = $detailsResponse['result']['geometry']['location']['lat'] ?? null;
                    $longitude = $detailsResponse['result']['geometry']['location']['lng'] ?? null;

                    DB::table('city')
                        ->where('city_id', $getId)
                        ->update([
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                        ]);
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'City saved successfully',
                'data' => [
                    'city_id' => $getId,
                    'name' => $name,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => $th->getMessage(),
                'data' => null
            ]);
        }
    }
}
