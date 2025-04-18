<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class City extends Model
{
    use HasFactory;

    // Define table prefix constant
    const TABLE_PREFIX = '';

    // Define the tables with the prefix appended
    protected $cityTable = self::TABLE_PREFIX . 'city';
    protected $cityNamesTable = self::TABLE_PREFIX . 'city_names';

    public function createCity(array $data)
    {
        $cityId = DB::table($this->cityTable)->insertGetId([
            'country' => $data['country_id'],
            'state' => $data['state_id'],
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

        DB::table($this->cityNamesTable)->insert($cityNames);

        return [
            'message' => 'City added successfully.',
            'city_id' => $cityId
        ];
    }

    public function getCity($term = null, $lang = 'en', $paginate)
    {
        $query = DB::table($this->cityNamesTable)
            ->join($this->cityTable, $this->cityNamesTable . '.city_id', '=', $this->cityTable . '.city_id')
            ->where([
                [$this->cityNamesTable . '.lang', '=', $lang],
                [$this->cityTable . '.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                $this->cityTable . '.city_id',
                $this->cityNamesTable . '.name',
                $this->cityTable . '.order',
                $this->cityTable . '.status',
            );

        if ($term) {
            $query->where($this->cityNamesTable . '.name', 'like', "%{$term}%");
        }

        $query->orderBy($this->cityTable . '.city_id', 'desc');
        return $query->paginate($paginate);
    }

    public function getCityDetails($id)
    {
        $state = DB::table($this->cityNamesTable)
            ->join($this->cityTable, $this->cityNamesTable . '.city_id', '=', $this->cityTable . '.city_id')
            ->where($this->cityNamesTable . '.city_id', '=', $id)
            ->select(
                $this->cityTable . '.country',
                $this->cityNamesTable . '.name',
                $this->cityTable . '.city_id as city_id',
                $this->cityTable . '.order',
                $this->cityTable . '.state',
                $this->cityTable . '.status',
                $this->cityNamesTable . '.lang'
            )
            ->get();

        return $state;
    }

    public function updateCity(array $data)
    {
        DB::beginTransaction();

        try {
            $CityData = [
                'country' => $data['country_id'],
                'state' => $data['state_id'],
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table($this->cityTable)
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
                DB::table($this->cityNamesTable)
                    ->where('city_id', $cityName['city_id'])
                    ->where('lang', $cityName['lang'])
                    ->update([
                        'name' => $cityName['name']
                    ]);
            }

            DB::commit();

            return [
                'message' => 'City updated successfully.',
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
        DB::table($this->cityTable)
            ->where('city_id', $data['city_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'City status updated.',
        ];
    }

    public function deleteCity($id = '')
    {
        DB::table($this->cityTable)
            ->where('city_id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'City deleted successfully.',
        ];
    }

    public function cityAddfromExcel(array $data)
    {
        try {
            // log_anything($data);
            $langs = explode(',', admin_default_lang());
            foreach ($data as $row) {

                $newCityId =  DB::table($this->cityTable)->insertGetId([
                    'country' => $row[0],
                    'state' =>  $row[1],
                    'order'  => rand(1, 4),
                    'status' => config('constants.STATUS_ACTIVE'),
                ]);

                $nameByLang = [
                    'en' => $row[2] ?? null,
                    'ar' => $row[3] ?? null,
                ];

                foreach ($langs as $lang) {
                    DB::table($this->cityNamesTable)->insert([
                        'city_id' => $newCityId,
                        'lang'        => $lang,
                        'name'        => $nameByLang[$lang] ?? null,
                    ]);
                }
            }

            return [
                'message' => 'City added successfully.',
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
