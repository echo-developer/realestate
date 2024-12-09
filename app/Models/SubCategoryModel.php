<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SubCategoryModel extends Model
{
    use HasFactory;

    protected $table = 'pref_property_sub_category';
    protected $fillable = ['image', 'order', 'category_id', 'status'];

    private $subCategoryTable = 'pref_property_sub_category';
    private $subCategoryNamesTable = 'pref_property_sub_category_names';
    private $categoryNamesTable = 'pref_property_category_names';
    private $categoryTable = 'pref_property_category';

    public function getCategories()
    {
        return DB::table($this->categoryNamesTable)
            ->join($this->categoryTable, "{$this->categoryNamesTable}.category_id", '=', "{$this->categoryTable}.id")
            ->where([
                ["{$this->categoryNamesTable}.lang", '=', 'en'],
                ["{$this->categoryTable}.status", '!=', config('constants.STATUS_DELETE')],
            ])
            ->select("{$this->categoryTable}.id", "{$this->categoryNamesTable}.name")
            ->get();
    }

    public function getsubCategories($term, $lang = 'en', $paginate)
    {
        $query = DB::table($this->subCategoryNamesTable)
            ->join($this->subCategoryTable, "{$this->subCategoryNamesTable}.sub_category_id", '=', "{$this->subCategoryTable}.id")
            ->where([
                ["{$this->subCategoryNamesTable}.lang", '=', $lang],
                ["{$this->subCategoryTable}.status", '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                "{$this->subCategoryTable}.id",
                "{$this->subCategoryNamesTable}.name",
                "{$this->subCategoryTable}.id as sub_category_id",
                "{$this->subCategoryTable}.order",
                "{$this->subCategoryTable}.status",
                "{$this->subCategoryTable}.image"
            );

        if ($term) {
            $query->where("{$this->subCategoryNamesTable}.name", 'like', "%{$term}%");
        }

         if($paginate){
        return $query->paginate($paginate);
        }
        return $query->get();
    }

    public function createsubCategory(array $data)
    {
        $subcategoryId = DB::table($this->subCategoryTable)->insertGetId([
            'image' => $data['image'] ?? null,
            'category_id' => $data['category_id'],
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $subcategoryNames = array_map(function ($lang, $name) use ($subcategoryId) {
            return [
                'lang' => $lang,
                'sub_category_id' => $subcategoryId,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table($this->subCategoryNamesTable)->insert($subcategoryNames);
        set_flash_message('add');
        return [
            'message' => 'Category added successfully.',
            'subcategory_id' => $subcategoryId,
        ];
    }

    public function getSubCategoriesDetails($id)
    {
        return DB::table($this->subCategoryNamesTable)
            ->join($this->subCategoryTable, "{$this->subCategoryNamesTable}.sub_category_id", '=', "{$this->subCategoryTable}.id")
            ->where("{$this->subCategoryNamesTable}.sub_category_id", '=', $id)
            ->select(
                "{$this->subCategoryNamesTable}.id",
                "{$this->subCategoryNamesTable}.name",
                "{$this->subCategoryTable}.id as sub_category_id",
                "{$this->subCategoryTable}.category_id",
                "{$this->subCategoryTable}.order",
                "{$this->subCategoryTable}.status",
                "{$this->subCategoryTable}.image",
                "{$this->subCategoryNamesTable}.lang"
            )
            ->get();
    }

    public function updateSubCategory($data)
    {
        DB::beginTransaction();

        try {
            $subcategoryData = [
                'order' => $data['order'],
                'category_id' => $data['category_id'],
                'status' => $data['status'],
                'image' => $data['image'],
                'updated_at' => now(),
            ];

            DB::table($this->subCategoryTable)
                ->where('id', $data['subcategory_id'])
                ->update($subcategoryData);

            foreach ($data['name'] as $lang => $name) {
                DB::table($this->subCategoryNamesTable)
                    ->where('sub_category_id', $data['subcategory_id'])
                    ->where('lang', $lang)
                    ->update([
                        'name' => $name,
                        'updated_at' => now(),
                    ]);
            }

            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Category updated successfully.',
                'category_id' => $data['category_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function SubCategoryStatusUpdate($data)
    {
        DB::table($this->subCategoryTable)
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);

        return [
            'message' => 'Category status updated.',
        ];
    }

    public function DeleteSubCategory($id = '')
    {
        DB::table($this->subCategoryTable)
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);

        set_flash_message('delete');
        return [
            'message' => 'Subcategory deleted successfully.',
        ];
    }
}
