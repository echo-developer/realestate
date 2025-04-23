<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CategoryName extends Model
{
    public function createCategory(array $data)
    {
        DB::beginTransaction();

        try {
            $categoryID = DB::table('faq_categories')->insertGetId([
                'order' => $data['order'],
                'status' => $data['status'],
                'slug' => $data['slug'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $faqCategoryNames = [];
            foreach ($data['name'] as $lang => $name) {
                $faqCategoryNames[] = [
                    'category_id' => $categoryID,
                    'lang' => $lang,
                    'name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('faq_categories_names')->insert($faqCategoryNames);

            DB::commit();

            return [
                'message' => 'Category added successfully.',
                'category_id' => $categoryID,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function getCategory($term = null, $lang = 'en', $paginate = 10)
    {
        $query = DB::table('faq_categories')
            ->join('faq_categories_names', 'faq_categories.id', '=', 'faq_categories_names.category_id')
            ->where([
                ['faq_categories_names.lang', '=', $lang],
                ['faq_categories.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'faq_categories.id',
                'faq_categories_names.name',
                'faq_categories.slug',
                'faq_categories.status'
            );

        if ($term) {
            $query->where('faq_categories_names.name', 'like', "%{$term}%");
        }

        $query->orderBy('faq_categories.id', 'desc');

        return $query->paginate($paginate);
    }
    public function getCategoryDetails($id)
    {
        return DB::table('faq_categories_names')
            ->join('faq_categories', 'faq_categories_names.category_id', '=', 'faq_categories.id')
            ->where('faq_categories_names.category_id', '=', $id)
            ->select(
                'faq_categories_names.id',
                'faq_categories_names.name',
                'faq_categories.id as category_id',
                'faq_categories.slug',
                'faq_categories.status',
                'faq_categories_names.lang'
            )
            ->get();
    }
    public function updateCategory(array $data)
    {
        DB::beginTransaction();

        try {

            DB::table('faq_categories')->where('id', $data['category_id'])->update([
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
            foreach ($data['name'] as $lang => $name) {
                DB::table('faq_categories_names')
                    ->updateOrInsert(
                        ['category_id' => $data['category_id'], 'lang' => $lang],
                        ['name' => $name, 'updated_at' => now()]
                    );
            }
            DB::commit();
            return [
                'message' => 'Category updated successfully.',
                'category_id' => $data['category_id'],
            ];
        } catch (\Exception $e) {

            DB::commit();


            return [
                'error' => 'There was an error updating the category.',
                'details' => $e->getMessage(),
            ];
        }
    }
    public function categoryStatus($data)
    {
        DB::table('faq_categories')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'country status updated.',
        ];
    }
    public function categoryDelete($id)
    {
        $category = DB::table('faq_categories')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);

        return [
            'message' => 'Category deleted successfully.',
        ];
    }
}
