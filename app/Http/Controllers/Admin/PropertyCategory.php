<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\CategoryModel;
use GuzzleHttp\Psr7\Response;
use App\Http\Controllers\Controller;

class PropertyCategory extends Controller
{
    protected $categoryModel;

    /**
     * Inject CategoryModel via Dependency Injection.
     */
    public function __construct(CategoryModel $categoryModel)
    {
        $this->categoryModel = $categoryModel;
    }
    public function PropertyCategoryView(Request $request)
    {
        $term = $request->input('term');
        $data = $this->categoryModel->getCategories($term);
        return view('Admin.Property_Setting.property_category', compact('data'));
    }

    public function PropertyCategoryImage(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {

            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('category_image'), $fileName);


            return response()->json(['fileName' => $fileName]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function deleteCategoryImage(Request $req)
    {
        $filePath = public_path('category_image/' . $req->file);

        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json(['success' => 'File deleted successfully']);
        }

        return response()->json(['error' => 'File not found', $filePath], 404);
    }

    public function addCategory(Request $req)
    {
        $langs = array_keys($req->input('name', []));


        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'id' => 'nullable|integer',
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
            $response = $this->categoryModel->createCategory($validated);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function CategoryDetails($id = null)
    {
        if ($id === null) {
            return response()->json(['error' => 'Category ID is required.'], 400);
        }

        $data = $this->categoryModel->getCategoriesDetails($id);

        if ($data->isEmpty()) {
            return response()->json(['error' => 'Category not found.'], 404);
        }

        return response()->json($data);
    }
    public function EditCategory(Request $req)
    {

        // Get the languages from the input data
        $langs = array_keys($req->input('name', []));

        // Validation rules (same as add category)
        $rules = [
            'order' => 'required|integer',
            'status' => 'required|boolean',
            'image' => 'nullable|string',
            'prop_categoryId' => 'required|integer|exists:pref_property_category,id',  // Ensure category exists
        ];

        foreach ($langs as $lang) {
            $rules["name.$lang"] = 'required|string|max:255';
        }

        // Custom validation messages (same as add category)
        $messages = [
            'order.required' => 'The Order field is required.',
            'status.required' => 'The Status field is required.',
            'prop_categoryId.required' => 'The Category ID field is required.',
            'prop_categoryId.exists' => 'The specified Category ID does not exist.',
        ];

        foreach ($langs as $lang) {
            $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        }

        // Validate the request (same as add category)
        $validated = $req->validate($rules, $messages);

        // Prepare the data for the update (same as add category)
        $data = [
            'category_id' => $req->prop_categoryId,
            'name' => $validated['name'],
            'order' => $validated['order'],
            'status' => $validated['status'],
            'image' => $validated['image'],
        ];
        try {
            // Call the method to update the category in the model
            $response = $this->categoryModel->updateCategory($data);

            return response()->json($response);
        } catch (\Exception $e) {
            // Catch and return the error response
            return response()->json([
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function CategoryStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->categoryModel->CategoryStatusUpdate($data);
        return response()->json($response);
    }

    public function CategoryDelete(Request $req)
    {
        $response = $this->categoryModel->DeleteCategory($req->id);
        return response()->json($response);
    }
}
