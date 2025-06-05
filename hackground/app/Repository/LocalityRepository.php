<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocalityRepository
{
    public function storeNewLocalities(array $data, $lang, $cityId)
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

    public function checkIfLocalityExist($slug, $placeId, $cityId, $lang)
    {
        return DB::table('locality')
            ->join('locality_names', function ($join) use ($lang) {
                $join->on('locality.locality_id', '=', 'locality_names.locality_id')
                    ->where('locality_names.lang', '=', $lang);
            })
            ->where(function ($query) use ($slug, $placeId) {
                if ($placeId) {
                    $query->where('locality.google_place_id', $placeId)
                        ->orWhere(function ($q) use ($slug) {
                            $q->whereNull('locality.google_place_id')
                                ->where('locality.locality_key', $slug);
                        });
                } else {
                    $query->where('locality.locality_key', $slug);
                }
            })
            ->exists();
    }

    public function updateLatLng($placeId, $location)
    {
        DB::table('locality')
            ->where('google_place_id', $placeId)
            ->update([
                'latitude' => $location['lat'],
                'longitude' => $location['lng'],
            ]);
    }
}
