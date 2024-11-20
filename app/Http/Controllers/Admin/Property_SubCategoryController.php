<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubCategoryModel;
use Illuminate\Http\Request;

class Property_SubCategoryController extends Controller
{
    protected $subCategoryModel;

    public function __construct(SubCategoryModel $SubcategoryModel)
    {
        $this->subCategoryModel = $SubcategoryModel;
    }

    public function PropertysubcategoryView()
    {
        $category_data = $this->subCategoryModel->getCategories();
        return view('Admin.Property_Setting.property_subcategory', compact('category_data'));
        // , compact('data')
    }


    public function AddSubCategory(Request $req)
    {
        // return response()->json($req->all());
        $langs = array_keys($req->input('name', []));


        $rules = [
            'category_id' => 'required',
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);

        try {
            $response = $this->subCategoryModel->createsubCategory($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
