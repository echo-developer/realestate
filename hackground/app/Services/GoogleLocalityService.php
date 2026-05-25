<?php

namespace App\Services;

use App\Repository\LocalityRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GoogleLocalityService
{

    protected $localityRepo;

    public function __construct(LocalityRepository $localityRepo)
    {
        $this->localityRepo = $localityRepo;
    }

    public function fetchAndSaveLocalities($request)
    {
        $apiKey = get_setting('google-api-key');

        if (!$apiKey) {
            return ['status' => 0, 'message' => 'API key not found', 'data' => []];
        }

        $countryCode = $this->get_country_code($request->city_id);
        $radius = $request->input('radius', 50000);
        $cityName = $request->city_name;

        if (!$countryCode) {
            $countryCode = DB::table('country')->where('status', 1)->value('country_code');
        }
        if (!$countryCode) {
            $countryCode = 'IN'; // fallback default
        }

        $queryParams = [
            'input' => $request->keyWord,
            'types' => 'geocode',
            'language' => $request->input('lang', 'en'),
            'key' => $apiKey,
        ];

        if (!empty($countryCode)) {
            $queryParams['components'] = "country:$countryCode";
        }

        if (!empty($request->city_latitude) && !empty($request->city_longitude)) {
            $queryParams['locationrestriction'] = "circle:$radius@{$request->city_latitude},{$request->city_longitude}";
        }

        $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query($queryParams);

        \Illuminate\Support\Facades\Log::error("Google Autocomplete Request: " . $autocompleteUrl);

        $response = Http::get($autocompleteUrl)->json();

        \Illuminate\Support\Facades\Log::error("Google Autocomplete Response: " . json_encode($response));

        $results = collect($response['predictions'] ?? [])->filter(function ($item) use ($cityName) {
            $hasCorrectType = collect($item['types'])->contains(
                fn($type) =>
                in_array($type, [
                    'sublocality', 'sublocality_level_1', 'sublocality_level_2', 
                    'sublocality_level_3', 'sublocality_level_4', 'sublocality_level_5', 
                    'locality', 'neighborhood', 'political', 'route', 'premise', 'geocode'
                ])
            );

            return $hasCorrectType;
        })->map(function ($item) {
            return [
                'name' => $item['structured_formatting']['main_text'],
                'place_id' => $item['place_id'],
                'is_google' => true,
            ];
        })->values()->toArray();

        return [
            'status' => 1,
            'message' => count($results) ? 'Locality Retrieved' : 'No Locality Found',
            'data' => $results
        ];
    }

    public function get_country_code($cityID)
    {
        return DB::table('city')
            ->leftJoin('country', 'city.country', '=', 'country.id')
            ->where('city.city_id', $cityID)
            ->value('country.country_code');
    }
}
