<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\LocalityAreaPrice;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\LocalityModel;
use Illuminate\Support\Facades\Http;
use SebastianBergmann\CodeUnit\FunctionUnit;

class GoogleLocalityController extends Controller
{
    protected $localityModel;


    public function __construct()
    {
        $this->localityModel = new LocalityModel;
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
                ->where('lang', $lang)
                ->where('locality.city', $cityId)
                ->where('name', 'LIKE', $keyword . '%')
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

    public function getGoogletLocalities(Request $request)
    {
        try {
            DB::beginTransaction();
            $keyword = $request->keyWord;
            $cityId = $request->city_id;
            $cityName = $request->city_name;
            $cityLat = $request->city_latitude;
            $cityLang = $request->city_longitude;
            $lang = $request->input('lang', 'en');
            $apiKey = get_setting('google-api-key');

            $countryCode = env('GOOGLE_MAPS_COUNTRY_CODE');

            if (empty($apiKey)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'API key not found',
                    'data' =>  []
                ]);
            }

            $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query([
                'input' => $keyword,
                'types' => 'geocode',
                'location' => "$cityLat,$cityLang",
                'radius' => 50000,
                'language' => $lang,
                'key' => $apiKey,
                'components' => "country:IN"
            ]).'&strictbounds';
            $autoResponse = Http::get($autocompleteUrl)->json();


            $filteredResults = collect($autoResponse['predictions'])->filter(function ($prediction) {
                return collect($prediction['types'])->contains(function ($type) {
                    return in_array($type, ['sublocality', 'sublocality_level_1']);
                });
            })->map(function ($prediction) {
                return [
                    'name' => $prediction['structured_formatting']['main_text'],
                    'place_id'   => $prediction['place_id'],
                ];
            })->values();



            $savedData = $this->storeandReturnResult($filteredResults->toArray(), $lang, $cityId);
            cURL_request('saveLocalityLatLong', $savedData);

            $message = !empty($savedData) ? 'Locality Retrived' : 'No Locality Found';

            DB::commit();
            return response()->json([
                'status' => 1,
                'message' => $message,
                'data' => !empty($savedData) ? $savedData : []
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    private function storeandReturnResult(array $data, $lang, $cityId)
    {
        $response = [];

        foreach ($data as $locality) {
            $slug = Str::slug($locality['name'], '_');

            $existing = $this->checkIfLocalityExist($slug, $locality['place_id'], $cityId, $lang);

            if (!$existing) {
                $getId = DB::table('locality')->insertGetId([
                    'city' => $cityId ?? get_setting('other-city-id'),
                    'google_place_id' => $locality['place_id'],
                    'locality_key' => $slug,
                ]);

                $langs = [
                    'en' => $locality['name'],
                    'ar' => null,
                ];

                foreach ($langs as $langCode => $langName) {
                    DB::table('locality_names')->insert([
                        'locality_id' => $getId,
                        'lang' => $langCode,
                        'name' => $langName,
                    ]);
                }

                $response[] = [
                    'locality_id' => $getId,
                    'place_id' => $locality['place_id'],
                    'name' => $locality['name'],
                ];
            }
        }

        return $response;
    }

    public function saveLocalityLatLong(Request $request)
    {
        try {
            DB::transaction();

            $apiKey = get_setting('google-api-key');
            $cURLRequest = collect($request->input('data'));

            $cURLRequest->each(function ($item) use ($apiKey) {
                $placeId = $item['place_id'] ?? null;

                if (!$placeId) {
                    return;
                }

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
            });
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    private function checkIfLocalityExist($slug, $place_id, $cityId, $lang)
    {
        return DB::table('locality')
            ->join('locality_names', function ($join) use ($lang) {
                $join->on('locality.locality_id', '=', 'locality_names.locality_id')
                    ->where('locality_names.lang', '=', $lang);
            })
            ->where([
                ['locality.city', '=', $cityId],
                ['locality.locality_key', '=', $slug],
                ['locality.google_place_id', '=', $place_id],
            ])
            ->select('locality.locality_id')
            ->limit(1)
            ->exists();
    }




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
}
