<?php

namespace App\Services;

use App\Repository\CityRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GoogleCityService
{
    protected $cityRepo;

    public function __construct(CityRepository $cityRepo)
    {
        $this->cityRepo = $cityRepo;
    }

    public function fetchAndSaveCities($request)
    {
        $apiKey = get_setting('google-api-key');

        if (!$apiKey) {
            return ['status' => 0, 'message' => 'API key not found', 'data' => []];
        }

        $countryCode = $request->input('country_code');
        if (!$countryCode) {
            $countryCode = DB::table('country')->where('status', 1)->value('country_code');
        }
        if (!$countryCode) {
            $countryCode = 'IN'; // fallback default
        }

        $params = [
            'input' => $request->keyWord,
            'types' => '(cities)',
            'language' => $request->input('lang', 'en'),
            'key' => $apiKey,
        ];

        if (!empty($countryCode)) {
            $params['components'] = "country:$countryCode";
        }

        $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query($params);

        $response = Http::get($autocompleteUrl)->json();

        $results = collect($response['predictions'] ?? [])->map(function ($item) {
            return [
                'name' => $item['structured_formatting']['main_text'],
                'place_id' => $item['place_id'],
                'is_google' => true,
            ];
        })->values()->toArray();

        return [
            'status' => 1,
            'message' => count($results) ? 'City Retrieved' : 'No City Found',
            'data' => $results
        ];
    }
}
