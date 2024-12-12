<?php

namespace App\Http\Controllers\Api;

use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class PostController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function ImageUpload(Request $req)
    {

        $req->validate([
            'images' => 'required',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $uploadedFiles = [];


        if ($req->hasFile('images')) {
            $images = $req->file('images');


            $images = is_array($images) ? $images : [$images];

            foreach ($images as $file) {
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('property_images'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = url('property_images/' . $fileName);
            }
            $url = asset('property_images');
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles,
                'image_url' => $fileUrls
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }

    public function PostProperty(Request $req)
    {

        return response()->json([
            'status' => 1,
            'data' => $req->all()
        ]);
    }
    public function get_budget(Request $request) {

        try {
          
            $data = $this->apiModel->getPropertyBudget(); 
            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Budget found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Budget retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
           
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving Budget.',
                'error' => $e->getMessage(), 
            ]);
        }
    }
}
