<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use SebastianBergmann\CodeUnit\FunctionUnit;
use Illuminate\Support\Str;

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
    public function fetchLocalityfromDatabase(Request $request)
    {
        try {
            $keyword = $request->keyWord;
            $lang = $request->input('lang', 'en');
            $data = DB::table('locality_names')
                ->select(
                    'locality_id',
                    'name'
                )
                ->where('lang', $lang)
                ->where('name', 'LIKE', $keyword . '%')
                ->get()->toArray();

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
            $lang = $request->input('lang', 'en');
            $apiKey = get_setting('google-api-key');

            if (!empty($apiKey)) {
                $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" . urlencode($keyword) . "&key=$apiKey";
                $autoResponse = Http::get($autocompleteUrl)->json();
                $results = [];

                if (($autoResponse['status'] ?? 'INVALID_REQUEST') !== 'OK') {
                    return response()->json(
                        [
                            'status' => 1,
                            'message' => $autoResponse['error_message'] ?? 'Autocomplete request failed'
                        ]
                    );
                }

                foreach ($autoResponse['predictions'] ?? [] as $prediction) {
                    $placeId = $prediction['place_id'];

                    $detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$placeId&fields=name,geometry,address_components&key=$apiKey";
                    $detail = Http::get($detailsUrl)->json();
                    $loc = $detail['result']['geometry']['location'] ?? ['lat' => null, 'lng' => null];
                    $addressComponents = $detail['result']['address_components'] ?? [];

                    $city = collect($addressComponents)->firstWhere('types', ['locality', 'political'])['long_name'] ??
                        collect($addressComponents)->firstWhere('types', ['administrative_area_level_3', 'political'])['long_name'] ?? null;


                    $results[] = [
                        'name' => $detail['result']['name'] ?? $prediction['description'],
                        'lat' => $loc['lat'],
                        'lng' => $loc['lng'],
                        'city' => $city,
                    ];
                }
                $savedData = $this->storeandReturnResult($results, $lang);

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


    private function storeandReturnResult(array $data, $lang)
    {
        $response = [];

        foreach ($data as $locality) {
            $slug = Str::slug($locality['name'], '_');

            $existing = $this->checkSlug(trim($slug), $lang);

            if (!$existing) {
                $getId = DB::table('locality')->insertGetId([
                    'city' => null,
                    'locality_key' => $slug,
                    'latitude' => $locality['lat'],
                    'longitude' => $locality['lng'],
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

    private function checkSlug($slug, $lang)
    {
        return DB::table('locality')
            ->leftJoin('locality_names', 'locality.locality_id', '=', 'locality_names.locality_id')
            ->select('locality.locality_id', 'locality_names.name')
            ->where('locality.locality_key', $slug)
            ->where('locality_names.lang', $lang)
            ->exists();
    }
}
