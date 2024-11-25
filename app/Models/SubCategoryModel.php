<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SubCategoryModel extends Model
{
    protected $table = 'pref_property_sub_category';
    protected $fillable = ['image', 'order', 'category_id', 'status'];

    public function getCategories()
    {
        $Categories = DB::table('pref_property_category_names')
            ->join('pref_property_category', 'pref_property_category_names.category_id', '=', 'pref_property_category.id')
            ->where([
                ['pref_property_category_names.lang', '=', 'en'],
                ['pref_property_category.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select('pref_property_category.id', 'pref_property_category_names.name')
            ->get();

        return $Categories;
    }

    public function getsubCategories($term)
    {
        $SubCategories = DB::table('pref_property_sub_category_names')
            ->join('pref_property_sub_category', 'pref_property_sub_category_names.sub_category_id', '=', 'pref_property_sub_category.id')
            ->where([
                ['pref_property_sub_category_names.lang', '=', 'en'],
                ['pref_property_sub_category.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select('pref_property_sub_category.id', 'pref_property_sub_category_names.name', 'pref_property_sub_category.id as sub_category_id', 'pref_property_sub_category.order', 'pref_property_sub_category.status', 'pref_property_sub_category.image');

        if ($term) {
            $SubCategories->where('pref_property_sub_category_names.name', 'like', "%{$term}%");
        }

        return $SubCategories->paginate(2);
    }

    public function createsubCategory(array $data)
    {

        $subcategoryId = DB::table('pref_property_sub_category')->insertGetId([
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

        DB::table('pref_property_sub_category_names')->insert($subcategoryNames);
        set_flash_message('add');
        return [
            'message' => 'Category added successfully.',
            'subcategory_id' => $subcategoryId
        ];
    }

    public function getSubCategoriesDetails($id)
    {
        $SubCategories = DB::table('pref_property_sub_category_names')
            ->join('pref_property_sub_category', 'pref_property_sub_category_names.sub_category_id', '=', 'pref_property_sub_category.id')
            ->where('pref_property_sub_category_names.sub_category_id', '=', $id) // Filter by Sub_category_id, not id
            ->select(
                'pref_property_sub_category_names.id',
                'pref_property_sub_category_names.name',
                'pref_property_sub_category.id as sub_category_id',
                'pref_property_sub_category.category_id',
                'pref_property_sub_category.order',
                'pref_property_sub_category.status',
                'pref_property_sub_category.image',
                'pref_property_sub_category_names.lang'  // Include language column to identify language
            )
            ->get();



        return $SubCategories;
    }

    public function updateSubCategory($data)
    {
        // Start a transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the pref_property_category table
            $subcategoryData = [
                'order' => $data['order'],
                'category_id' => $data['category_id'],
                'status' => $data['status'],
                'image' => $data['image'],
                'updated_at' => now(),
            ];

            DB::table('pref_property_sub_category')
                ->where('id', $data['subcategory_id'])
                ->update($subcategoryData);

            // Prepare the data for updating the sub_category names in the pref_property_category_names table
            $subcategoryNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'sub_category_id' => $data['subcategory_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            // Update the category names table (same as createCategory)
            foreach ($subcategoryNames as $subcategoryName) {
                DB::table('pref_property_sub_category_names')
                    ->where('sub_category_id', $subcategoryName['sub_category_id'])
                    ->where('lang', $subcategoryName['lang'])
                    ->update([
                        'name' => $subcategoryName['name'],
                        'updated_at' => $subcategoryName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Category updated successfully.',
                'category_id' => $data['category_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function SubCategoryStatusUpdate($data)
    {
        DB::table('pref_property_sub_category')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'category status updated.',
        ];
    }

    public function DeleteSubCategory($id = '')
    {
        DB::table('pref_property_sub_category')
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


    use HasFactory;
}
