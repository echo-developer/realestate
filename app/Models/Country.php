<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Country extends Model
{
    use HasFactory;

    public function createCountry(array $data)
    {

        $countryId = DB::table('pref_country')->insertGetId([
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $countryNames = array_map(function ($lang, $name) use ($countryId) {
            return [
                'country_id' => $countryId,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_country_names')->insert($countryNames);

        return [
            'message' => 'country added successfully.',
            'country_id' => $countryId
        ];
    }
    public function getCountry($term = null, $lang = '')
    {
        $query = DB::table('pref_country_names')
            ->join('pref_country', 'pref_country_names.country_id', '=', 'pref_country.id')
            ->where([
                ['pref_country_names.lang', '=', $lang],
                ['pref_country.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_country.id',
                'pref_country_names.name',
                'pref_country.order',
                'pref_country.status',
            );
        if ($term) {
            $query->where('pref_country_names.name', 'like', "%{$term}%");
        }
        return $query->paginate(2);
    }
    public function getCountryDetails($id)
    {
        $Country = DB::table('pref_country_names')
            ->join('pref_country', 'pref_country_names.country_id', '=', 'pref_country.id')
            ->where('pref_country_names.country_id', '=', $id) 
            ->select(
                'pref_country_names.id',
                'pref_country_names.name',
                'pref_country.id as country_id',
                'pref_country.order',
                'pref_country.status',
                'pref_country_names.lang'  
            )
            ->get();



        return $Country;
    }
    public function updateCountry(array $data)
    {
       
        DB::beginTransaction();

        try {
        
            $countryData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_country')
                ->where('id', $data['country_id'])
                ->update($countryData);

           
            $countryNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'country_id' => $data['country_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

           
            foreach ($countryNames as $countryName) {
                DB::table('pref_country_names')
                    ->where('country_id', $countryName['country_id'])
                    ->where('lang', $countryName['lang'])
                    ->update([
                        'name' => $countryName['name'],
                        'updated_at' => $countryName['updated_at'],
                    ]);
            }

            DB::commit();

            return [
                'message' => 'country updated successfully.',
                'country_id' => $data['country_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }
    public function CountryStatus($data)
    {
        DB::table('pref_country')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'country status updated.',
        ];
    }
    public function DeleteCountry($id = '')
    {
        DB::table('pref_country')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'country deleted successfully.',
        ];
    }
}
