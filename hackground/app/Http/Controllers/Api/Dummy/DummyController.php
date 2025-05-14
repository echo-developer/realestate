<?php

namespace App\Http\Controllers\Api\Dummy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class DummyController extends Controller
{
    public function cityLatlang()
    {

        try {
            DB::beginTransaction();

            $cityIds = range(201, 287);
            $apiKey = get_setting('google-api-key');

            $cityRecords = DB::table('city_names')
                ->whereIn('city_id', $cityIds)
                ->where('lang', 'en')
                ->pluck('name', 'city_id');

            $updates = [];

            foreach ($cityRecords as $cityId => $cityName) {
                $geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($cityName) . "&key=$apiKey";
                $geoResponse = Http::get($geoUrl)->json();

                if (!empty($geoResponse['results'])) {
                    $cityLocation = $geoResponse['results'][0]['geometry']['location'];
                    $updates[] = [
                        'city_id'   => $cityId,
                        'latitude'  => $cityLocation['lat'],
                        'longitude' => $cityLocation['lng'],
                    ];
                }
            }

            foreach ($updates as $data) {
                DB::table('city')
                    ->where('city_id', $data['city_id'])
                    ->update([
                        'latitude'  => $data['latitude'],
                        'longitude' => $data['longitude'],
                    ]);
            }

            DB::commit();
            return 'mass insert success';
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
