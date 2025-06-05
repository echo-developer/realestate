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
        $countryCode = $this->get_country_code($request->city_id);
        $radius = $request->input('radius', 50000);
        $cityName = $request->city_name;

        if (!$apiKey) {
            return ['status' => 0, 'message' => 'API key not found', 'data' => []];
        }

        $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query([
            'input' => $request->keyWord,
            'types' => 'geocode',
            'language' => $request->input('lang', 'en'),
            'key' => $apiKey,
            'components' => "country:$countryCode",
            'locationbias' => "circle:$radius@{$request->city_latitude},{$request->city_longitude}"
        ]);

        $response = Http::get($autocompleteUrl)->json();

        $results = collect($response['predictions'] ?? [])->filter(function ($item) use ($cityName) {
            $hasCorrectType = collect($item['types'])->contains(
                fn($type) =>
                in_array($type, ['sublocality', 'sublocality_level_1', 'locality'])
            );

            $matchesCity = isset($item['structured_formatting']['secondary_text']) &&
                str_contains(strtolower($item['structured_formatting']['secondary_text']), strtolower($cityName));

            return $hasCorrectType && $matchesCity;
        })->map(function ($item) {
            return [
                'name' => $item['structured_formatting']['main_text'],
                'place_id' => $item['place_id'],
            ];
        })->values()->toArray();

        $asyncUrl = env('APP_URL') . '/api' . '/saveLocalityLatLong';

        $saved = $this->localityRepo->storeNewLocalities($results, $request->input('lang', 'en'), $request->city_id);

        Http::pool(fn($pool) => [
            $pool->as('locality')->async()->post($asyncUrl, [
                'data' => $saved
            ])
        ]);

        return [
            'status' => 1,
            'message' => count($saved) ? 'Locality Retrieved' : 'No Locality Found',
            'data' => $saved
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
