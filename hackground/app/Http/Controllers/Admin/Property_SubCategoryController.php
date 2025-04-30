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
        $this->middleware('view_permit:property-sub-category');
    }

    public function PropertysubcategoryView(Request $request)
    {
        $peginate = 10;
        $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $category_data = $this->subCategoryModel->getCategories();
        $subcategory_data = $this->subCategoryModel->getsubCategories($term, $lang, $peginate);
        return view('Admin.Property_Setting.property_subCategory', compact('category_data', 'subcategory_data'));
    }


    public function AddSubCategory(Request $req)
    {
        // return response()->json($req->all());
        $langs = array_keys($req->input('name', []));


        $rules = [
            'category_id' => 'required',

            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'slug' => 'required|unique:property_sub_category,slug'
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }
        $messages = [

            'status.required' => 'The Status field is required.',
            'id.required' => 'The ID field is required.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        $validated = $req->validate($rules, $messages);
        $validated['order'] = $req->input('order', null);
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

    public function PropertySubCategoryImage(Request $req)
    {
        // return response()->json($req->file('file'));
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('user_upload/subCategory_image/'), $fileName);

            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }


    public function deleteSubCategoryImage(Request $req)
    {
        $filePath = public_path('user_upload/subCategory_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function SubCategoryDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'SubCategory ID is required.'], 400);
        }

        $data = $this->subCategoryModel->getSubCategoriesDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'SubCategory not found.'], 404);
        }

        return response()->json($data);
    }

    public function EditSubCategory(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [

            'category_id' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'prop_subcategoryId' => 'required|integer|exists:property_sub_category,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [

            'status.required' => 'The Status field is required.',
            'prop_subcategoryId.required' => 'The Category ID field is required.',
            'category_id.required' => 'The Category field is required.',
            'prop_subcategoryId.exists' => 'The specified Category ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);
        $validated['order'] = $req->input('order', null);
        // Prepare the data for the update (same as add category)
        $data = [
            'subcategory_id' => $req->prop_subcategoryId,
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'order' => $validated['order'],
            'status' => $validated['status'],
            'image' => $validated['image'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->subCategoryModel->updateSubCategory($data);
            set_flash_message('update');
            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function SubCategoryStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->subCategoryModel->SubCategoryStatusUpdate($data);
        return response()->json($response);
    }

    public function SubCategoryDelete(Request $req)
    {
        $response = $this->subCategoryModel->DeleteSubCategory($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }
}
