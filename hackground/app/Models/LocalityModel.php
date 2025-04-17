<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocalityModel extends Model
{
    use HasFactory;

    // Define table prefix constant
    const TABLE_PREFIX = '';

    // Define the tables with the prefix appended
    protected $localityTable = self::TABLE_PREFIX . 'locality';
    protected $localityNamesTable = self::TABLE_PREFIX . 'locality_names';

    public function createLocality(array $data)
    {
        $localityId = DB::table($this->localityTable)->insertGetId([
            'city' => $data['city_id'],
            'locality_key' => $data['key'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $localityNames = array_map(function ($lang, $name) use ($localityId) {
            return [
                'locality_id' => $localityId,
                'lang' => $lang,
                'name' => $name,
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table($this->localityNamesTable)->insert($localityNames);

        return [
            'message' => 'Locality added successfully.',
            'locality_id' => $localityId
        ];
    }

    public function getLocality($term = null, $lang = 'en', $paginate)
    {
        $query = DB::table($this->localityNamesTable)
            ->join($this->localityTable, $this->localityNamesTable . '.locality_id', '=', $this->localityTable . '.locality_id')
            ->where([
                [$this->localityNamesTable . '.lang', '=', $lang],
                [$this->localityTable . '.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                $this->localityTable . '.locality_id',
                $this->localityNamesTable . '.name',
                $this->localityTable . '.locality_key',
                $this->localityTable . '.city',
                $this->localityTable . '.status',
            );


        if ($term) {
            $query->where($this->localityNamesTable . '.name', 'like', "%{$term}%");
        }

        $query->orderBy($this->localityTable . '.locality_id', 'desc');
        return $query->paginate($paginate);
    }

    public function getLocalityDetails($id)
    {
        $locality = DB::table($this->localityNamesTable)
            ->join($this->localityTable, $this->localityNamesTable . '.locality_id', '=', $this->localityTable . '.locality_id')
            ->where($this->localityNamesTable . '.locality_id', '=', $id)
            ->select(
                $this->localityTable . '.city',
                $this->localityNamesTable . '.name',
                $this->localityTable . '.locality_id as locality_id',
                $this->localityTable . '.locality_key',
                $this->localityTable . '.latitude',
                $this->localityTable . '.longitude',
                $this->localityTable . '.status',
                $this->localityNamesTable . '.lang'
            )
            ->get();

        return $locality;
    }

    public function updateLocality(array $data)
    {
        DB::beginTransaction();

        try {
            $LocalityData = [
                'city' => $data['city_id'],
                'locality_key' => $data['key'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table($this->localityTable)
                ->where('locality_id', $data['locality_id'])
                ->update($LocalityData);

            $localityNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'locality_id' => $data['locality_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            foreach ($localityNames as $localityName) {
                DB::table($this->localityNamesTable)
                    ->where('locality_id', $localityName['locality_id'])
                    ->where('lang', $localityName['lang'])
                    ->update([
                        'name' => $localityName['name']
                    ]);
            }

            DB::commit();

            return [
                'message' => 'Locality updated successfully.',
                'locality_id' => $data['locality_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function localityStatus($data)
    {
        DB::table($this->localityTable)
            ->where('locality_id', $data['locality_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Locality status updated.',
        ];
    }

    public function deleteLocality($id = '')
    {
        DB::table($this->localityTable)
            ->where('locality_id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Locality deleted successfully.',
        ];
    }

    public function localityAddfromExcel(array $data)
    {
        try {
            $langs = explode(',', admin_default_lang());
            foreach ($data as $row) {

                $newLocId =  DB::table($this->localityTable)->insertGetId([
                    'city'         => $row[0],
                    'locality_key' => Str::slug($row[3], '_'),
                    'latitude'     => $row[1],
                    'longitude'    => $row[2],
                    'order'        => rand(1, 4),
                    'status'       => config('constants.STATUS_ACTIVE'),
                ]);
                
                $nameByLang = [
                    'en' => $row[3] ?? null,
                    'ar' => $row[4] ?? null,
                ];

                foreach ($langs as $lang) {
                    DB::table($this->localityNamesTable)->insert([
                        'locality_id' => $newLocId,
                        'lang'        => $lang,
                        'name'        => $nameByLang[$lang] ?? null,
                    ]);
                }
            }

            return [
                'message' => 'Locality added successfully.',
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
