<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CityRepository
{
    public function storeNewCities(array $data, $lang)
    {
        $response = [];

        foreach ($data as $city) {
            $slug = Str::slug($city['name'], '_');

            $existing = $this->checkIfCityExist($slug, $city['place_id'], $lang);

            if (!$existing) {
                $countryId = get_setting('other-country-id') ?? 101;
                $stateId = get_setting('other-state-id') ?? 1;

                $getId = DB::table('city')->insertGetId([
                    'country' => $countryId,
                    'state' => $stateId,
                    'google_place_id' => $city['place_id'],
                    'slug' => $slug,
                    'order' => rand(1, 4),
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $langs = [
                    'en' => $city['name'],
                    'ar' => $city['name'],
                ];

                foreach ($langs as $langCode => $langName) {
                    DB::table('city_names')->insert([
                        'city_id' => $getId,
                        'lang' => $langCode,
                        'name' => $langName,
                    ]);
                }

                $response[] = [
                    'city_id' => $getId,
                    'place_id' => $city['place_id'],
                    'name' => $city['name'],
                ];
            } else {
                $cityRecord = DB::table('city')
                    ->join('city_names', 'city.city_id', '=', 'city_names.city_id')
                    ->where('city_names.lang', $lang)
                    ->where(function ($query) use ($slug, $city) {
                        $query->where('city.google_place_id', $city['place_id'])
                            ->orWhere('city.slug', $slug);
                    })
                    ->first();

                if ($cityRecord) {
                    $response[] = [
                        'city_id' => $cityRecord->city_id,
                        'place_id' => $city['place_id'],
                        'name' => $cityRecord->name,
                    ];
                }
            }
        }

        return $response;
    }

    public function checkIfCityExist($slug, $placeId, $lang)
    {
        return DB::table('city')
            ->join('city_names', function ($join) use ($lang) {
                $join->on('city.city_id', '=', 'city_names.city_id')
                    ->where('city_names.lang', '=', $lang);
            })
            ->where(function ($query) use ($slug, $placeId) {
                if ($placeId) {
                    $query->where('city.google_place_id', $placeId)
                        ->orWhere(function ($q) use ($slug) {
                            $q->whereNull('city.google_place_id')
                                ->where('city.slug', $slug);
                        });
                } else {
                    $query->where('city.slug', $slug);
                }
            })
            ->exists();
    }

    public function updateLatLng($placeId, $location)
    {
        DB::table('city')
            ->where('google_place_id', $placeId)
            ->update([
                'latitude' => $location['lat'],
                'longitude' => $location['lng'],
            ]);
    }
}
