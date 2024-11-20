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

    public function getsubCategories()
    {
        $SubCategories = DB::table('pref_property_sub_category_names')
            ->join('pref_property_sub_category', 'pref_property_sub_category_names.sub_category_id', '=', 'pref_property_sub_category.id')
            ->where([
                ['pref_property_sub_category_names.lang', '=', 'en'],
                ['pref_property_sub_category.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select('pref_property_sub_category.id', 'pref_property_sub_category_names.name', 'pref_property_sub_category.id as sub_category_id', 'pref_property_sub_category.order', 'pref_property_sub_category.status', 'pref_property_sub_category.image')
            ->paginate(3);

        return $SubCategories;
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

        return [
            'message' => 'Category added successfully.',
            'subcategory_id' => $subcategoryId
        ];
    }
    use HasFactory;
}
