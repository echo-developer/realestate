<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryModel extends Model
{
    protected $table = 'pref_property_category';
    protected $fillable = ['image', 'order', 'status'];

    /**
     * Create a new category and store it in the database.
     */
    public function createCategory(array $data)
    {
       
        $categoryId = DB::table('pref_property_category')->insertGetId([
            'image' => $data['image'] ?? null,
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $categoryNames = array_map(function ($lang, $name) use ($categoryId) {
            return [
                'category_id' => $categoryId,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_property_category_names')->insert($categoryNames);

        return [
            'message' => 'Category added successfully.',
            'category_id' => $categoryId
        ];
    }

 public function getCategories()
{
    $Categories = DB::table('pref_property_category_names')
        ->join('pref_property_category', 'pref_property_category_names.category_id', '=', 'pref_property_category.id')
        ->where([
            ['pref_property_category_names.lang', '=', 'en'],
            ['pref_property_category.status', '!=', config('constants.STATUS_DELETE')],
        ])
        ->select('pref_property_category.id','pref_property_category_names.name', 'pref_property_category.id as category_id', 'pref_property_category.order', 'pref_property_category.status', 'pref_property_category.image')
        ->get();

    return $Categories;
}
    public function getCategoriesDetails($id){
        $Categories = DB::table('pref_property_category_names')
            ->join('pref_property_category', 'pref_property_category_names.category_id', '=', 'pref_property_category.id')
            ->where('pref_property_category_names.category_id', '=', $id) // Filter by category_id, not id
            ->select(
                'pref_property_category_names.id',
                'pref_property_category_names.name',
                'pref_property_category.id as category_id',
                'pref_property_category.order',
                'pref_property_category.status',
                'pref_property_category.image',
                'pref_property_category_names.lang'  // Include language column to identify language
            )
            ->get();

    

    return $Categories;
}
public function updateCategory($data)
{
    // Start a transaction to ensure atomicity
    DB::beginTransaction();

    try {
        // Update the category data in the pref_property_category table
        $categoryData = [
            'order' => $data['order'],
            'status' => $data['status'],
            'image' => $data['image'],
            'updated_at' => now(),
        ];

        DB::table('pref_property_category')
            ->where('id', $data['category_id'])
            ->update($categoryData);

        // Prepare the data for updating the category names in the pref_property_category_names table
        $categoryNames = array_map(function ($lang, $name) use ($data) {
            return [
                'category_id' => $data['category_id'],
                'lang' => $lang,
                'name' => $name,
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        // Update the category names table (same as createCategory)
        foreach ($categoryNames as $categoryName) {
            DB::table('pref_property_category_names')
                ->where('category_id', $categoryName['category_id'])
                ->where('lang', $categoryName['lang'])
                ->update([
                    'name' => $categoryName['name'],
                    'updated_at' => $categoryName['updated_at'],
                ]);
        }

        // Commit the transaction
        DB::commit();

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


public function CategoryStatusUpdate($data){
    DB::table('pref_property_category')
    ->where('id', $data['id'])
    ->update([
        'status' => $data['status'],
        'updated_at' => now(),
    ]);
    return [
        'message' => 'category status updated.',
    ];
}
public function DeleteCategory($id=''){
    DB::table('pref_property_category')
    ->where('id', $id)
    ->update([
        'status' => config('constants.STATUS_DELETE'),
        'updated_at' => now(),
    ]);
    return [
        'message' => 'category deleted successfully.',
    ];
}
}
