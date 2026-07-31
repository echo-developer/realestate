<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CategoryName;
use App\Models\FaqCategory;
use App\Models\FaqCategoryName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FaqController extends Controller
{
    protected $categoryname;

    public function __construct(FaqCategoryName $categoryname)
    {
        $this->categoryname = $categoryname;
        $this->middleware('view_permit:faq-category');
    }
    public function category_view(Request $request)
    {
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $paginate = 10;
        $data = $this->categoryname->getCategory($term, $lang, $paginate);
        return view('Admin.Faq.faq-category', compact('data'));
    }


    public function submit_Category(Request $request)
    {
        $langs = array_keys($request->input('name', []));
        if (empty($langs)) {
            $langs = explode(',', admin_default_lang());
        }

        $rules = [
            'status' => 'required',
            'slug' => 'nullable|string',
        ];

        $messages = [];
        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:250';
            $messages["name.$lang.required"] = 'The Category Name (' . strtoupper($lang) . ') is required.';
        }

        $validated = $request->validate($rules, $messages);

        if (empty($validated['slug']) && !empty($validated['name']['en'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']['en']);
        }

        $validated['category_id'] = $request->input('categoryID');
        $validated['order'] = $request->input('order', null);

        try {
            if (!empty($validated['category_id'])) {
                $response = $this->categoryname->updateCategory($validated);
                $msg = 'FAQ category updated successfully.';
            } else {
                $response = $this->categoryname->createCategory($validated);
                $msg = 'FAQ category created successfully.';
            }
            return response()->json([
                'success' => true,
                'message' => $response['message'] ?? $msg,
                'category_id' => $response['category_id'] ?? null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function update_faqcategory(Request $req)
    {
        return $this->submit_Category($req);
    }
    public function category_details($id)
    {
        $category = DB::table('faq_categories')->where('id', $id)->first();

        $names = DB::table('faq_categories_names')
            ->where('category_id', $id)
            ->pluck('name', 'lang')
            ->toArray();

        return response()->json([
            'id' => $category->id,
            'slug' => $category->slug,
            'order' => $category->order,
            'status' => $category->status,
            'name' => $names,
        ]);
    }
    public function faqcategory_status(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->categoryname->categoryStatus($data);
        return response()->json($response);
    }
    public function categoryDelete(Request $req)
    {

        $response = $this->categoryname->categoryDelete($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}
