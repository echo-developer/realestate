<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\LocalityAreaPrice;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\LocalityModel;
use App\Services\GoogleLocalityService;
use Illuminate\Support\Facades\Http;
use SebastianBergmann\CodeUnit\FunctionUnit;

class GoogleLocalityController extends Controller
{
    protected $localityModel;
    protected $localityService;


    public function __construct(GoogleLocalityService $googleLocalityService)
    {
        $this->localityModel = new LocalityModel;
        $this->localityService = $googleLocalityService;
    }
    public function fetchLocalityfromDatabase(Request $request)
    {
        try {
            $keyword = $request->keyWord;
            $cityId = $request->city_id;
            $lang = $request->input('lang', 'en');
            $data = DB::table('locality_names')
                ->leftJoin('locality', 'locality_names.locality_id', '=', 'locality.locality_id')
                ->select('locality_names.locality_id', 'locality_names.name')
                ->where('locality_names.lang', $lang)
                ->whereNotNull('locality.latitude')
                ->whereNotNull('locality.longitude')
                ->where('locality.city', $cityId)
                ->where('locality_names.name', 'LIKE', $keyword . '%')
                ->limit(11)
                ->get()
                ->toArray();


            $message = !empty($data) ? 'Locality Retrived' : 'No Locality Found';

            return response()->json([
                'status' => 1,
                'message' => $message,
                'data' => !empty($data) ? $data : []
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getGoogletLocalities1(Request $request)
    {
        try {
            $data = $this->localityService->fetchAndSaveLocalities($request);

            return response()->json([
                'status' => $data['status'],
                'message' => $data['message'],
                'data' => $data['data']
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveLocalityLatLong(Request $request)
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
                        DB::table('locality')
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

    /* ===============================================================================================================*/

    public function getYearlyPriceTrend(Request $req)
    {
        $data = (new LocalityAreaPrice())->getYearlyTrendData($req->input('locality_id'));

        // Group data by price_for (prop or proj)
        $grouped = [
            'property_price_trend' => [],
            'project_price_trend' => [],
        ];

        foreach ($data as $item) {
            $entry = [
                'locality_id' => $item->locality,
                'locality_name' => get_name_by_id("locality_names", "locality_id", $item->locality, "en"),
                'year' => $item->year,
                'avg_price_per_sqft' => $item->new_price ?? $item->price_per_sqft,
            ];

            if ($item->price_for === 'prop') {
                $grouped['property_price_trend'][] = $entry;
            } elseif ($item->price_for === 'proj') {
                $grouped['project_price_trend'][] = $entry;
            }
        }

        return response()->json(['status' => 1, 'data' => $grouped]);
    }
    public function landmark(Request $request)
    {
        $locality_id = $request->input('locality_id');
        $radius = 2;

        $locality = LocalityModel::select('latitude', 'longitude')
            ->where('locality_id', $locality_id)
            ->first();

        if (!$locality) {
            return response()->json(['status' => 0, 'message' => 'Locality not found.']);
        }

        $latitude = $locality->latitude;
        $longitude = $locality->longitude;

        $tables = [
            'education' => 'education',
            'metro' => 'metro_station',
            'railway' => 'railway_station',
            'bus_stand' => 'bus_stand',
            'hospital' => 'hospital'
        ];

        $landmarks = [];

        foreach ($tables as $key => $table) {
            $landmarks[$key] =  LocalityModel::getNearbyLandmarks($table, $latitude, $longitude, $radius);
        }

        return response()->json(['status' => 1, 'data' => $landmarks]);
    }

    public function saveGoogleLocality(Request $request)
    {
        try {
            $placeId = $request->input('place_id');
            $name = $request->input('name');
            $cityId = $request->input('city_id');
            $lang = $request->input('lang', 'en');

            if (empty($placeId) || empty($name) || empty($cityId)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'place_id, name, and city_id are required',
                    'data' => null
                ]);
            }

            $slug = Str::slug($name, '_');

            // Check if locality already exists in database
            $localityRecord = DB::table('locality')
                ->join('locality_names', 'locality.locality_id', '=', 'locality_names.locality_id')
                ->where('locality_names.lang', $lang)
                ->where('locality.city', $cityId)
                ->where(function ($query) use ($slug, $placeId) {
                    $query->where('locality.google_place_id', $placeId)
                        ->orWhere('locality.locality_key', $slug);
                })
                ->first();

            if ($localityRecord) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Locality already exists',
                    'data' => [
                        'locality_id' => $localityRecord->locality_id,
                        'name' => $localityRecord->name,
                        'latitude' => $localityRecord->latitude,
                        'longitude' => $localityRecord->longitude,
                    ]
                ]);
            }

            // Not existing, insert it
            $getId = DB::table('locality')->insertGetId([
                'city' => $cityId,
                'google_place_id' => $placeId,
                'locality_key' => $slug,
            ]);

            $langs = [
                'en' => $name,
                'ar' => $name,
            ];

            foreach ($langs as $langCode => $langName) {
                DB::table('locality_names')->insert([
                    'locality_id' => $getId,
                    'lang' => $langCode,
                    'name' => $langName,
                ]);
            }

            // Fetch coordinates from Google Places API
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

                    DB::table('locality')
                        ->where('locality_id', $getId)
                        ->update([
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                        ]);
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Locality saved successfully',
                'data' => [
                    'locality_id' => $getId,
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

    /* ===============================================================================================================*/
}
