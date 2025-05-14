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
    // public function getLocalityDropdownList(Request $request)
    // {
    //     try {
    //         $keyword = $request->keyWord;
    //         $lang = $request->input('lang', 'en');
    //         $databaseReturn = $this->fetchLocalityfromDatabase($keyword, $lang);

    //         // $googleApiReturn = [];
    //         // if (count($databaseReturn) < 10) {
    //         //     $googleApiReturn = $this->getGoogletLocalities($keyword, $lang);
    //         // }

    //         // $data = array_merge($databaseReturn, $googleApiReturn);

    //         return $databaseReturn;
    //     } catch (\Throwable $th) {
    //         throw $th;
    //     }
    // }

    protected $localityModel;


    public function __construct()
    {
        $this->localityModel = new LocalityModel;
    }
    public function fetchLocalityfromDatabase(Request $request)
    {
        try {
            $keyword = $request->keyWord;
            $lang = $request->input('lang', 'en');
            $data = DB::table('locality_names')
                ->select('locality_id', 'name')
                ->where('lang', $lang)
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
            $keyword = $request->keyWord;
            $cityId = 21 ?? $request->city_id;
            $cityName = 'kolkata'  ?? $request->city_name;
            $cityLat = 22.5744 ?? $request->city_name;
            $cityLang = 88.3629 ?? $request->city_name;
            $lang = $request->input('lang', 'en');
            $apiKey = get_setting('google-api-key');

            if (!empty($apiKey)) {
                //     $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" . urlencode($keyword) . "&key=$apiKey";
                //     $autoResponse = Http::get($autocompleteUrl)->json();
                //     $results = [];

                //     if (($autoResponse['status'] ?? 'INVALID_REQUEST') !== 'OK') {
                //         return response()->json(
                //             [
                //                 'status' => 1,
                //                 'message' => $autoResponse['error_message'] ?? 'Autocomplete request failed'
                //             ]
                //         );
                //     }

                //     foreach ($autoResponse['predictions'] ?? [] as $prediction) {
                //         $placeId = $prediction['place_id'];

                //         $detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&fields=name,geometry,address_components&key=$apiKey";
                //         $detail = Http::get($detailsUrl)->json();
                //         $loc = $detail['result']['geometry']['location'] ?? ['lat' => null, 'lng' => null];
                //         $addressComponents = $detail['result']['address_components'] ?? [];

                //         $city = collect($addressComponents)->firstWhere('types', ['locality', 'political'])['long_name'] ??
                //             collect($addressComponents)->firstWhere('types', ['administrative_area_level_3', 'political'])['long_name'] ?? null;


                //         $results[] = [
                //             'name' => $detail['result']['name'] ?? $prediction['description'],
                //             'lat' => $loc['lat'],
                //             'lng' => $loc['lng'],
                //             'city' => $city,
                //         ];
                //     }
                //     $savedData = $this->storeandReturnResult($results, $lang);

                //     $message = !empty($savedData) ? 'Locality Retrived' : 'No Locality Found';

                //     


                // $geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($cityName) . "&key=$apiKey";
                // $geoResponse = Http::get($geoUrl)->json();

                // if (empty($geoResponse['results'])) {
                //     return response()->json(['success' => false, 'message' => 'City not found']);
                // }

                // $cityLocation = $geoResponse['results'][0]['geometry']['location'];
                // $lat = $cityLocation['lat'];
                // $lng = $cityLocation['lng'];


                $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query([
                    'input' => $keyword,
                    'types' => 'geocode',
                    'location' => "$cityLat,$cityLang",
                    'radius' => 50000,
                    'language' => $lang,
                    'key' => $apiKey
                ]);
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
                // cURL_request('saveLocalityLatLong', $savedData);



                $message = !empty($savedData) ? 'Locality Retrived' : 'No Locality Found';
                return response()->json([
                    'status' => 1,
                    'message' => $message,
                    'data' => !empty($savedData) ? $savedData : []
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'API key not found',
                    'data' =>  []
                ]);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    private function storeandReturnResult(array $data, $lang, $cityId)
    {
        $response = [];

        foreach ($data as $locality) {
            // $slug = Str::slug($locality['name'], '_');

            $existing = $this->checkIfLocalityExist($locality['place_id'], $lang);

            if (!$existing) {
                $getId = DB::table('locality')->insertGetId([
                    'city' => $cityId ?? get_setting('other-city-id'),
                    'google_place_id' => $locality['place_id'],
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
                    'name' => $locality['name'],
                ];
            }
        }

        return $response;
    }

    public function saveLocalityLatLong($data)
    {


        // $detailedResults = $filteredResults->map(function ($prediction) use ($apiKey) {
        //     $placeId = $prediction['place_id'];

        //     $detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
        //         'place_id' => $placeId,
        //         'fields' => 'geometry,name,formatted_address',
        //         'key' => $apiKey
        //     ]);

        //     $detailsResponse = Http::get($detailsUrl)->json();

        //     if (isset($detailsResponse['result'])) {
        //         return [
        //             'place_id' => $placeId,
        //             'name' => $detailsResponse['result']['name'] ?? null,
        //             'address' => $detailsResponse['result']['formatted_address'] ?? null,
        //             'latitude' => $detailsResponse['result']['geometry']['location']['lat'] ?? null,
        //             'longitude' => $detailsResponse['result']['geometry']['location']['lng'] ?? null,
        //         ];
        //     }

        //     return null;
        // })->filter()->values();
    }

    private function checkIfLocalityExist($place_id, $lang)
    {
        return DB::table('locality')
            ->leftJoin('locality_names', 'locality.locality_id', '=', 'locality_names.locality_id')
            ->select('locality.locality_id', 'locality_names.name')
            ->where('locality.google_place_id', $place_id)
            ->where('locality_names.lang', $lang)
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
