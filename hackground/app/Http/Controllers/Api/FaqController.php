<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FaqController extends Controller
{
    public function fetchFaqListsforAPI(Request $request)
    {

        try {
            $lang = $request->input('lang', 'en');
            $data =  DB::table('faq_categories')
                ->select(
                    'faq_categories.id as category_id',
                    'faq_categories.slug',
                    'faq_categories.status as category_status',
                    'faq_categories.created_at as category_created_at',
                    'faq_categories.updated_at as category_updated_at',
                    'faq_categories_names.name as category_name',

                    'faq_list.id as faq_id',
                    'faq_list.faq_category_id',
                    'faq_list.status as faq_status',
                    'faq_list_names.question',
                    'faq_list_names.answer'

                )
                ->leftJoin('faq_categories_names', 'faq_categories.id', '=', 'faq_categories_names.category_id')
                ->leftJoin('faq_list', 'faq_categories.id', '=', 'faq_list.faq_category_id')
                ->leftJoin('faq_list_names', 'faq_list.id', '=', 'faq_list_names.faq_id')
                ->where([
                    'faq_categories.status' => config('constants.STATUS_ACTIVE'),
                    'faq_categories_names.lang' => $lang,
                    'faq_list_names.lang' => $lang,
                ])
                ->get();

            $grouped = $data->groupBy('category_id')->map(function ($items) {
                $first = $items->first();

                return [
                    'id' => $first->category_id,
                    'slug' => $first->slug,
                    'status' => $first->category_status,
                    'created_at' => $first->category_created_at,
                    'updated_at' => $first->category_updated_at,
                    'name' => $first->category_name,
                    'faq_list' => $items->map(function ($faq) {
                        return [
                            'faq_id' => $faq->faq_id,
                            'faq_category_id' => $faq->faq_category_id,
                            'status' => $faq->faq_status,
                            'question' => $faq->question,
                            'answer' => $faq->answer,
                        ];
                    })->values(),
                ];
            })->values();

            // log_anything($grouped);
            return response()->json([
                'status' => 1,
                'data' => $grouped->isEmpty() ? [] : $grouped,
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
