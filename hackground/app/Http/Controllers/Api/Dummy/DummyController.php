<?php

namespace App\Http\Controllers\Api\Dummy;

use App\Http\Controllers\Controller;
use App\Models\ProjectLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DummyController extends Controller
{
    public function insertSlug()
    {

        $cities = DB::table('city_names')->select('city_id', 'name')->where('lang', 'en')->get()->toArray();

        foreach ($cities as $city) {
            $slug =  Str::slug($city->name, '_');

            DB::table('city')->where('city_id', $city->city_id)->update(['slug' => $slug]);
        }
        return 'Done';
    }

    public function get_data_address()
    {
        // try {
        //     $data = DB::table('project_location')
        //         ->join('locality_names', 'project_location.locality', '=', 'locality_names.locality_id')
        //         ->join('city_names', 'project_location.city', '=', 'city_names.city_id')
        //         ->where('locality_names.lang', 'en')
        //         ->where('city_names.lang', 'en')
        //         ->select(
        //             'project_location.locality',
        //             'project_location.project_id',
        //             'project_location.address',
        //             'locality_names.name as locality_name',
        //             'city_names.name as city_name'
        //         )
        //         ->get();
        //     $updatedProjects = [];
        //     foreach ($data as $project) {
        //         $updatedProjects[] = [
        //             'city_name' => $project->city_name,
        //             'locality_name' => $project->locality_name,
        //             'project_id' => $project->project_id,
        //             'address' => '',
        //         ];
        //     }
        //     return response()->json([
        //         'status' => 'completed',
        //         'updated' => $updatedProjects,
        //     ]);
        // } catch (\Throwable $th) {
        //     throw $th;
        // }

        /* ============================================================================================ */
        // $projectsPerCity = ProjectLocation::select('city', DB::raw('COUNT(*) as project_count'))
        //     ->groupBy('city')
        //     ->orderByDesc('project_count')
        //     ->get();

        // $cityids = $projectsPerCity->map(function ($items) {
        //     return $items->city;
        // });

        // $localitiesIds = DB::table('locality')->select('locality.city', 'locality.locality_id', 'locality_names.name', 'city_names.name as city_name')
        //     ->join('locality_names', 'locality.locality_id', '=', 'locality_names.locality_id')
        //     ->join('city_names', 'locality.city', '=', 'city_names.city_id')
        //     ->where('locality_names.lang', 'en')
        //     ->where('city_names.lang', 'en')
        //     ->where('locality.locality_id', '<=', 758)
        //     ->whereIn('locality.city', $cityids)
        //     ->whereNot('locality.city', 281)
        //     ->whereNotNull('locality.latitude')
        //     ->whereNotNull('locality.longitude')
        //     ->get()
        //     ->groupBy('city_name');

        // $cityWiseLocalityIds = [];

        // foreach ($localitiesIds as $cityName => $items) {
        //     $key = Str::snake($cityName);
        //     $cityWiseLocalityIds[$key] = $items->pluck('locality_id')->toArray();
        // }


        // return [
        //     '1' => $projectsPerCity,
        //     '2' => $cityids,
        //     '3' => $localitiesIds,
        //     '4' => $cityWiseLocalityIds,
        // ];


        /** ======================================================== */
        // $autocompleteUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?" . http_build_query([
        //     'input' => 'kaloor',
        //     'types' => 'geocode',
        //     'language' => 'en',
        //     'key' => 'AIzaSyChn8rDJqxakdzRIEAIGvCnZVce_soXW3s',
        //     'components' => "country:IN",
        // ]);

        // $url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

        // $response = Http::get($autocompleteUrl);

        // if ($response->successful()) {
        //     $data = $response->json();

        //     // Handle Google-specific errors
        //     if (isset($data['status']) && $data['status'] !== 'OK') {
        //         return [
        //             'error' => true,
        //             'status' => $data['status'],
        //             'message' => $data['error_message'] ?? 'Google API returned a non-OK status.',
        //         ];
        //     }

        //     return $data['predictions'];
        // }

        // // Handle HTTP-level errors (non-200 response)
        // return [
        //     'error' => true,
        //     'http_status' => $response->status(),
        //     'message' => $response->json()['error_message'] ?? $response->body(),
        // ];

        /** ===================================================================================================== */


        $data = DB::table('locality')
        ->whereNull('latitude')
        ->whereNull('longitude')
        ->pluck('locality_id')
        ->toArray();
        return $data;
    }


    public function update_address()
    {
        try {
            $array = [
                [
                    "project_id" => 141,
                    "address" => "Siripuram Circle, Waltair Uplands Road, Near HSBC Office, Visakhapatnam, Andhra Pradesh 530003"
                ],
                [
                    "project_id" => 142,
                    "address" => "Garlapadu Main Road, Near NH-16 Bypass, Vijayawada Rural, Andhra Pradesh 522509"
                ],
                [
                    "project_id" => 143,
                    "address" => "7-3-45, Collector Office Road, Guntur City, Near GMC Hospital, Andhra Pradesh 522002"
                ],
                [
                    "project_id" => 144,
                    "address" => "48/1A, Kali Temple Road, Kalighat, Near Kalighat Temple, Kolkata, West Bengal 700026"
                ],
                [
                    "project_id" => 145,
                    "address" => "Opp. Chincholi Bunder Road, New City Church Campus, Malad West, Mumbai, Maharashtra 400064"
                ],
                [
                    "project_id" => 146,
                    "address" => "Plot No. 203, Link Road, Malad West, Near Inorbit Mall, Mumbai, Maharashtra 400064"
                ],
                [
                    "project_id" => 147,
                    "address" => "Mulund West, LBS Marg, Near Johnson & Johnson Signal, Mumbai, Maharashtra 400080"
                ],
                [
                    "project_id" => 148,
                    "address" => "17 Baghajatin Place, Near Railway Station, Kolkata, West Bengal 700086"
                ],
                [
                    "project_id" => 149,
                    "address" => "27th Main Road, Sector 2, HSR Layout, Near BDA Complex, Bengaluru, Karnataka 560102"
                ],
                [
                    "project_id" => 150,
                    "address" => "Hazrat Nizamuddin Railway Station, Bhogal, Near Sarai Kale Khan, New Delhi, Delhi 110013"
                ],
                [
                    "project_id" => 151,
                    "address" => "Bhusandapur Village Road, Near Railway Station, Khordha District, Bhubaneswar, Odisha 752050"
                ],
                [
                    "project_id" => 152,
                    "address" => "Beach Road, Opp. RK Beach, Near VUDA Park, Visakhapatnam, Andhra Pradesh 530003"
                ],
                [
                    "project_id" => 153,
                    "address" => "Siripuram Junction, Opp. YMCA, Near HSBC Office, Visakhapatnam, Andhra Pradesh 530003"
                ],
                [
                    "project_id" => 154,
                    "address" => "Dondaparthy Main Road, Near Railway Station, Visakhapatnam, Andhra Pradesh 530016"
                ]
            ];
            DB::beginTransaction();
            foreach ($array as $items) {
                DB::table('project_location')->where('project_id', $items['project_id'])->update(['address' => $items['address']]);
            }
            DB::commit();
            return 'Done';
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        /* ===============================================================================================*/

        // $cityId = 2;

        // $projectLocations = DB::table('project_location')
        //     ->where('city', $cityId)
        //     ->get();

        // $localityIds = DB::table('locality')
        //     ->where('city', $cityId)
        //     ->whereNotNull('latitude')
        //     ->whereNotNull('longitude')
        //     ->whereIn('locality_id',[811,1008,1083,1085,1086])
        //     ->pluck('locality_id')
        //     ->toArray();

        // $locationCount = $projectLocations->count();
        // $selectedLocalities = [];

        // if (count($localityIds) >= $locationCount) {
        //     $selectedLocalities = collect($localityIds)->shuffle()->take($locationCount)->values()->toArray();
        // } else {

        //     while (count($selectedLocalities) < $locationCount) {
        //         $selectedLocalities = array_merge(
        //             $selectedLocalities,
        //             collect($localityIds)->shuffle()->toArray()
        //         );
        //     }
        //     $selectedLocalities = array_slice($selectedLocalities, 0, $locationCount);
        // }

        // foreach ($projectLocations as $index => $location) {
        //     DB::table('project_location')
        //         ->where('id', $location->id)
        //         ->update(['locality' => $selectedLocalities[$index]]);
        // }
        // return 'done done';
    }

    public function get_usedcity_in_project()
    {
        try {


            $groupedCities = ProjectLocation::select('city')
                ->groupBy('city')
                ->get();
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
