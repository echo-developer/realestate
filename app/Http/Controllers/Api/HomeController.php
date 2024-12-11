<?php

namespace App\Http\Controllers\Api;


use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        //  $this->middleware('auth:api');
        $this->apiModel = $apiModel;
    }

    public function getPropertyType(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getPropertyType($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No categories found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'success' => 1,
                'message' => 'Categories retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while retrieving categories.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }

    public function getPropertyTypeFor(Request $request)
    {
        try {

            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getPropertyTypeFor($lang);;

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No result found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'success' => 1,
                'message' => 'data retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]); 
        }
    }
    public function city(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getCity($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No cities found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'success' => 1,
                'message' => 'cities retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in cities: ' . $e->getMessage());

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while retrieving cities.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }
}
