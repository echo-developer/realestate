<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class faqlistname extends Model
{
    public function getlist($term = null, $lang = 'en', $paginate = 10)
    {
        $query = DB::table('faq_list')
            ->leftJoin('faq_list_names', 'faq_list.id', '=', 'faq_list_names.faq_id')
            ->leftJoin('faq_categories', 'faq_list.faq_category_id', '=', 'faq_categories.id')
            ->where([
                'faq_list_names.lang'=> $lang,
                'faq_list.status' => config('constants.STATUS_ACTIVE'),
                'faq_categories.status' => config('constants.STATUS_ACTIVE'),
            ])
            ->select(
                'faq_list.id',
                'faq_list.faq_category_id',
                'faq_list_names.question',
                'faq_list.order',
                'faq_list.status',
                'faq_categories.status',
            );

        if ($term) {
            $query->where('faq_list_names.question', 'like', "%{$term}%");
        }

        $query->orderBy('faq_list.id', 'desc');

        return $query->paginate($paginate);
    }

    public function getFaqListDetails($id)
    {
        return DB::table('faq_list_names')
            ->join('faq_list', 'faq_list_names.faq_id', '=', 'faq_list.id')
            ->where('faq_list_names.faq_id', '=', $id)
            ->select(
                'faq_list_names.id',
                'faq_list_names.lang',
                'faq_list_names.question',
                'faq_list_names.answer',
                'faq_list.id as faq_id',
                'faq_list.faq_category_id',
                'faq_list.order',
                'faq_list.status'
            )
            ->get();
    }
    public function updateFaqStatus(array $data)
    {
        try {
            DB::beginTransaction();

            DB::table('faq_list')
                ->whereIn('id', $data['faq_id'])
                ->update([
                    'status' => $data['status'],
                    'updated_at' => now(),
                ]);

            DB::commit();

            return [
                'message' => 'FAQ status updated successfully.',
            ];
        } catch (\Exception $e) {

            DB::rollBack();


            return [
                'error' => 'There was an error updating the FAQ status.',
                'details' => $e->getMessage(),
            ];
        }
    }
    public function categoryStatus($data)
    {
        DB::table('faq_list')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'country status updated.',
        ];
    }
//     public function updateFaq(array $data)
// {
//     DB::beginTransaction();

//     try {
//         DB::table('faq_list')->where('id', $data['id'])->update([
//             'faq_category_id' => $data['faq_category_id'],
//             'order' => $data['order'],
//             'status' => $data['status'],
//             'updated_at' => now(),
//         ]);

//         foreach ($data['question'] as $lang => $question) {
//             DB::table('faq_list_names')->updateOrInsert(
//                 ['faq_id' => $data['id'], 'lang' => $lang],
//                 [
//                     'question' => $question,
//                     'answer' => $data['answer'][$lang] ?? '',
//                     'updated_at' => now(),
//                 ]
//             );
//         }

//         DB::commit();
//         return [
//             'message' => 'FAQ updated successfully.',
//             'faq_id' => $data['id'],
//         ];
//     } catch (\Exception $e) {
//         DB::rollBack();

//         return [
//             'error' => 'Error updating FAQ.',
//             'details' => $e->getMessage(),
//         ];
//     }
// }
}

