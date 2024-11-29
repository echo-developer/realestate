<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CmsModel extends Model
{
    use HasFactory;

    // Define table prefix constant
    const TABLE_PREFIX = 'pref_';

    // Define the tables with the prefix appended
    protected $cmsTable = self::TABLE_PREFIX . 'cms';
    protected $cmsNamesTable = self::TABLE_PREFIX . 'cms_names';

    public function createCms(array $data)
    {
        $cmsId = DB::table($this->cmsTable)->insertGetId([
            'country' => $data['country_id'],
            'state' => $data['state_id'],
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cmsNames = array_map(function ($lang, $name) use ($cmsId) {
            return [
                'cms_id' => $cmsId,
                'lang' => $lang,
                'name' => $name,
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table($this->cmsNamesTable)->insert($cmsNames);

        return [
            'message' => 'Cms added successfully.',
            'cms_id' => $cmsId
        ];
    }

    public function getCms($term = null, $lang = 'en', $paginate)
    {
        $query = DB::table($this->cmsNamesTable)
            ->join($this->cmsTable, $this->cmsNamesTable . '.cms_id', '=', $this->cmsTable . '.cms_id')
            ->where([
                [$this->cmsNamesTable . '.lang', '=', $lang],
                [$this->cmsTable . '.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                $this->cmsTable . '.cms_id',
                $this->cmsNamesTable . '.name',
                $this->cmsTable . '.order',
                $this->cmsTable . '.status',
            );

        if ($term) {
            $query->where($this->cmsNamesTable . '.name', 'like', "%{$term}%");
        }

        $query->orderBy($this->cmsTable . '.cms_id', 'desc');
        return $query->paginate($paginate);
    }

    public function getCmsDetails($id)
    {
        $state = DB::table($this->cmsNamesTable)
            ->join($this->cmsTable, $this->cmsNamesTable . '.cms_id', '=', $this->cmsTable . '.cms_id')
            ->where($this->cmsNamesTable . '.cms_id', '=', $id)
            ->select(
                $this->cmsTable . '.country',
                $this->cmsNamesTable . '.name',
                $this->cmsTable . '.cms_id as cms_id',
                $this->cmsTable . '.order',
                $this->cmsTable . '.state',
                $this->cmsTable . '.status',
                $this->cmsNamesTable . '.lang'
            )
            ->get();

        return $state;
    }

    public function updateCms(array $data)
    {
        DB::beginTransaction();

        try {
            $CmsData = [
                'country' => $data['country_id'],
                'state' => $data['state_id'],
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table($this->cmsTable)
                ->where('cms_id', $data['cms_id'])
                ->update($CmsData);

            $cmsNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'cms_id' => $data['cms_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            foreach ($cmsNames as $cmsName) {
                DB::table($this->cmsNamesTable)
                    ->where('cms_id', $cmsName['cms_id'])
                    ->where('lang', $cmsName['lang'])
                    ->update([
                        'name' => $cmsName['name']
                    ]);
            }

            DB::commit();

            return [
                'message' => 'Cms updated successfully.',
                'cms_id' => $data['cms_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function cmsStatus($data)
    {
        DB::table($this->cmsTable)
            ->where('cms_id', $data['cms_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Cms status updated.',
        ];
    }

    public function deleteCms($id = '')
    {
        DB::table($this->cmsTable)
            ->where('cms_id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Cms deleted successfully.',
        ];
    }
}
