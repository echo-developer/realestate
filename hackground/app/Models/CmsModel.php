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
            'slug' => $data['slug'],
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // $cmsNames = array_map(function ($lang, $title, $content, $meta_title, $meta_keys, $meta_desc) use ($cmsId) {
        //     return [
        //         'cms_id' => $cmsId,
        //         'lang' => $lang,
        //         'title' => $title,
        //         'content' => $content,
        //         'meta_title' => $meta_title,
        //         'meta_keys' => $meta_keys,
        //         'meta_desc' => $meta_desc,
        //     ];
        // }, array_keys($data['title']), $data['title'], $data['content'], $data['meta_title'], $data['meta_keys'], $data['meta_desc']);

        $langKeys = array_keys($data['title']);
        $cmsNames = array_map(function ($lang) use ($cmsId, $data) {
            return [
                'cms_id' => $cmsId,
                'lang' => $lang,
                'title' => $data['title'][$lang],
                'content' => $data['content'][$lang],
                'meta_title' => $data['meta_title'][$lang],
                'meta_keys' => $data['meta_keys'][$lang],
                'meta_desc' => $data['meta_desc'][$lang],
            ];
        }, $langKeys);

        DB::table($this->cmsNamesTable)->insert($cmsNames);

        return [
            'message' => 'Cms added successfully.',
            'cms_id' => $cmsId
        ];
    }

    public function getCms($term = null, $lang = 'en', $paginate)
    {
        $query = DB::table($this->cmsNamesTable)
            ->join($this->cmsTable, $this->cmsNamesTable . '.cms_id', '=', $this->cmsTable . '.id')
            ->where([
                [$this->cmsNamesTable . '.lang', '=', $lang],
                [$this->cmsTable . '.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                $this->cmsTable . '.id',
                $this->cmsNamesTable . '.title',
                $this->cmsTable . '.slug',
                $this->cmsTable . '.order',
                $this->cmsTable . '.status',
            );

        if ($term) {
            $query->where($this->cmsNamesTable . '.title', 'like', "%{$term}%");
        }

        $query->orderBy($this->cmsTable . '.id', 'desc');
        return $query->paginate($paginate);
    }

    public function getCmsDetails($id)
    {
        $cms = DB::table($this->cmsNamesTable)
            ->join($this->cmsTable, $this->cmsNamesTable . '.cms_id', '=', $this->cmsTable . '.id')
            ->where($this->cmsNamesTable . '.cms_id', '=', $id)
            ->select(
                $this->cmsNamesTable . '.title',
                $this->cmsNamesTable . '.content',
                $this->cmsNamesTable . '.meta_desc',
                $this->cmsNamesTable . '.meta_title',
                $this->cmsNamesTable . '.meta_keys',
                $this->cmsTable . '.id as cms_id',
                $this->cmsTable . '.order',
                $this->cmsTable . '.slug',
                $this->cmsTable . '.status',
                $this->cmsNamesTable . '.lang'
            )
            ->get();

        return $cms;
    }

    public function updateCms(array $data)
    {
        DB::beginTransaction();

        try {
            $CmsData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table($this->cmsTable)
                ->where('id', $data['cms_id'])
                ->update($CmsData);

            $langKeys = array_keys($data['title']);
            $cmsNames = array_map(function ($lang) use ($data) {
                return [
                    'cms_id' => $data['cms_id'],
                    'lang' => $lang,
                    'title' => $data['title'][$lang],
                    'content' => $data['content'][$lang],
                    'meta_title' => $data['meta_title'][$lang],
                    'meta_keys' => $data['meta_keys'][$lang],
                    'meta_desc' => $data['meta_desc'][$lang],
                ];
            }, $langKeys);

            foreach ($cmsNames as $cmsName) {
                DB::table($this->cmsNamesTable)
                    ->where('cms_id', $cmsName['cms_id'])
                    ->where('lang', $cmsName['lang'])
                    ->update([
                        'title' => $cmsName['title'],
                        'content' => $cmsName['content'],
                        'meta_title' => $cmsName['meta_title'],
                        'meta_keys' => $cmsName['meta_keys'],
                        'meta_desc' => $cmsName['meta_desc']
                    ]);
            }

            DB::commit();
            set_flash_message('update');

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

    public function CmsStatusUpdate($data)
    {
        DB::table($this->cmsTable)
            ->where('id', $data['cms_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Cms status updated.',
        ];
    }

    public function DeleteCms($id = '')
    {
        DB::table($this->cmsTable)
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'Cms deleted successfully.',
        ];
    }
}
