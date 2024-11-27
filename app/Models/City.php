<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    public function createCity(array $data)
    {

        $cityId = DB::table('pref_city')->insertGetId([
            'country'=>$data['country_id'],
            'state'=>$data['state_id'],
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cityNames = array_map(function ($lang, $name) use ($cityId) {
            return [
                'city_id' => $cityId,
                'lang' => $lang,
                'name' => $name,
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_city_names')->insert($cityNames);

        return [
            'message' => 'city added successfully.',
            'city_id' => $cityId
        ];
    }
 
    public function getCity($term = null, $lang = 'en',$peginate)
    {
        $query = DB::table('pref_city_names')
            ->join('pref_city', 'pref_city_names.city_id', '=', 'pref_city.city_id')
            ->where([
                ['pref_city_names.lang', '=', $lang],
                ['pref_city.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_city.city_id',
                'pref_city_names.name',
                'pref_city.order',
                'pref_city.status',
            );
        if ($term) {
            $query->where('pref_city_names.name', 'like', "%{$term}%");
        }
        $query->orderBy('pref_city.city_id', 'desc');
        return $query->paginate($peginate);
    }
    public function getCityDetails($id)
    {
        $State = DB::table('pref_city_names')
            ->join('pref_city', 'pref_city_names.city_id', '=', 'pref_city.city_id')
            ->where('pref_city_names.city_id', '=', $id) 
            ->select(
                'pref_city.country',
                'pref_city_names.name',
                'pref_city.city_id as city_id',
                'pref_city.order',
                'pref_city.state',
                'pref_city.status',
                'pref_city_names.lang'  
            )
            ->get();



        return $State;
    }
    public function updateCity(array $data)
    {
       
        DB::beginTransaction();

        try {
        
            $CityData = [
                'country'=>$data['country_id'],
                'state'=>$data['state_id'],
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_city')
                ->where('city_id', $data['city_id'])
                ->update($CityData);

           
            $cityNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'city_id' => $data['city_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

           
            foreach ($cityNames as $cityName) {
                DB::table('pref_city_names')
                    ->where('city_id', $cityName['city_id'])
                    ->where('lang', $cityName['lang'])
                    ->update([
                        'name' => $cityName['name']
                    ]);
            }

            DB::commit();

            return [
                'message' => 'city updated successfully.',
                'city_id' => $data['city_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }
    public function cityStatus($data)
    {
        DB::table('pref_city')
            ->where('city_id', $data['city_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'city status updated.',
        ];
    }
    public function Deletecity($id = '')
    {
        DB::table('pref_city')
            ->where('city_id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'city deleted successfully.',
        ];
    }

}
