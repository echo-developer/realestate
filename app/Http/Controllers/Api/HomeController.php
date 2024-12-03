<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use App\Models\CategoryModel;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    protected $categoryModel;
    public function __construct(CategoryModel $categoryModel)
    {
        $this->middleware('auth:api');
        $this->categoryModel = $categoryModel;
    }

    public function getPropertyType(Request $request)
    {
        try {
          
            $lang = strtolower($request->input('lang', 'en'));
            $term = $request->input('term');
            $data = $this->categoryModel->getCategories($term, $lang , '');
    
            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No categories found.',
                    'data' => [],
                ], 404);
            }
          
            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getPropertyType: ' . $e->getMessage());
    
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving categories.',
                'error' => 'Unexpected error occurred.',
            ], 500); 
        }
    }
    

}
