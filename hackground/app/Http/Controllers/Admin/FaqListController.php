<?php

namespace App\Http\Controllers\Admin;

use \Log;
use App\Http\Controllers\Controller;
use App\Models\faqlistname;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use \App\Models\FaqList;
use Illuminate\Support\Carbon;

class FaqListController extends Controller
{
    protected $listname;
    public function __construct(faqlistname $listname)
    {
        $this->listname = $listname;
        $this->middleware('view_permit:faq-list');
    }
    public function list_view(Request $request)
    {
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $paginate = 10;
        $data = $this->listname->getlist($term, $lang, $paginate);
        $categories = DB::table('faq_categories_names')
            ->join('faq_categories', 'faq_categories_names.category_id', '=', 'faq_categories.id')
            ->where('faq_categories_names.lang', $lang)
            ->where('faq_categories.status', config('constants.STATUS_ACTIVE'))
            ->select('faq_categories_names.category_id', 'faq_categories_names.name')
            ->get();
        return view('Admin.Faq.faq-list', compact('data', 'categories'));
    }
    public function list_submit(Request $request)
{
    $langs = array_keys($request->input('question', []));

    $rules = [
        'faq_category_id' => 'required|integer|exists:faq_categories,id',
         'status' => 'required|boolean',
    ];

    foreach ($langs as $lang) {
        $rules["question.$lang"] = 'required|string|max:1000';
        $rules["answer.$lang"] = 'required|string|max:2000';
    }

    $validated = $request->validate($rules);

     $order = $request->input('order', null); 

    $faqId = $request->input('faq_id');

    try {
        DB::beginTransaction();

        if ($faqId) {
            DB::table('faq_list')->where('id', $faqId)->update([
                'faq_category_id' => $validated['faq_category_id'],
                'order' => $order,
                'status' => $validated['status'],
                'updated_at' => now(),
            ]);
        } else {
            $faqId = DB::table('faq_list')->insertGetId([
                'faq_category_id' => $validated['faq_category_id'],
                'order' => $order,
                'status' => $validated['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('faq_list_names')->where('faq_id', $faqId)->delete();

        $insertData = [];
        foreach ($langs as $lang) {
            $insertData[] = [
                'faq_id' => $faqId,
                'lang' => $lang,
                'question' => $request->input("question.$lang"),
                'answer' => $request->input("answer.$lang"),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('faq_list_names')->insert($insertData);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => $faqId ? 'FAQ updated successfully!' : 'FAQ created successfully!',
            'faq_id' => $faqId,
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Something went wrong while saving FAQ.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    public function list_category($id)
    {
        $list = DB::table('faq_list')->where('id', $id)->first();

        if (!$list) {
            return response()->json(['error' => 'FAQ not found'], 404);
        }

        $names = DB::table('faq_list_names')
            ->where('faq_id', $id)
            ->get();

        $questions = [];
        $answers = [];

        foreach ($names as $name) {
            $questions[$name->lang] = $name->question;
            $answers[$name->lang] = $name->answer;
        }

        return response()->json([
            'id' => $list->id,
            'faq_category_id' => $list->faq_category_id,
            'order' => $list->order,
            'status' => $list->status,
            'question' => $questions,
            'answer' => $answers,
        ]);
    }

    public function list_delete(Request $request)
    {
        $id = $request->id;

        try {
            DB::beginTransaction();

            $faq = DB::table('faq_list')->where('id', $id)->first();

            if ($faq) {
                DB::table('faq_list')->where('id', $id)->update([
                    'status' => config('constants.STATUS_DELETE'),
                    'updated_at' => now(),
                ]);

                DB::commit();
                return response()->json(['success' => true, 'message' => 'FAQ marked as deleted.']);
            } else {
                DB::rollBack();
                return response()->json(['success' => false, 'message' => 'FAQ not found.']);
            }
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while deleting the FAQ.',
                'error' => $e->getMessage(),
            ]);
        }
    }
    public function list_status(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->listname->categoryStatus($data);
        return response()->json($response);
    }


    public function update_list(Request $request)
    {
        $faqId = $request->id;
        $faq = FaqList::find($faqId);
        if (!$faq) {
            return response()->json(['error' => 'FAQ not found.'], 404);
        }
        $faq->faq_category_id = $request->faq_category_id;
        $faq->order = $request->order ?? 0;
        $faq->status = $request->status ?? 0;
        $faq->save();

        DB::table('faq_list_names')->where('faq_id', $faqId)->delete();

        if ($request->has('question') && $request->has('answer')) {
            $now = Carbon::now();
            foreach ($request->question as $lang => $question) {
                DB::table('faq_list_names')->insert([
                    'faq_id' => $faqId,
                    'lang' => $lang,
                    'question' => $question,
                    'answer' => $request->answer[$lang] ?? '',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        return response()->json(['message' => 'FAQ updated successfully.']);
    }
}
