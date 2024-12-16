<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PrefPropertyGallery;
use App\Models\PrefPropertySetting;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyGalleryImage;

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

    public function PostProperty(Request $request)
    {
        try {
            DB::beginTransaction();

            // Insert user data 
            $user = User::create([
                'user_type' => $request->user_type,
                'user_name' => $request->user_name,
                'whatsapp_no' => $request->w_no,
                'phone_code' => $request->country_code,
                'email' => $request->user_email
            ]);

            $insertedUserId = $user->id;

            // Insert property data 
            $property = PrefProperty::create([
                'uid' => $insertedUserId,
                'title' => $request->project_name,
                'status' => config('constants.STATUS_INACTIVE')
            ]);
            $insertedPropertyId = $property->id;

            // Insert property location data 
            PrefPropertyLocation::create([
                'pid' => $insertedPropertyId,
                'city' => $request->city,
                'locality' => $request->locality,
                'property_address' => $request->address,
            ]);

            // Insert property settings data 
            PrefPropertySetting::create([
                'pid' => $insertedPropertyId,
                'parking_ability' => $request->parking_ability,
                'property_type_for' => $request->property_type_for,
                'bedrooms' => $request->bedrooms ?? 5,
                'bathrooms' => $request->bathrooms ?? 2,
                'property_type' => $request->property_type,
                'carpet_area' => $request->carpet_area,
                'plot_area' => $request->plot_area,
                'rooms' => $request->rooms ?? 3,
                'expected_price' => $request->expected_price,
                'post_for' => $request->post_for,
                'price_currency' => $request->currency,
                'property_budget' => $request->budget ?? 2,
            ]);

            // Insert property additional data 
            PrefPropertyAdditional::create([
                'pid' => $insertedPropertyId,
                'floor' => $request->floor,
                'kitchen' => $request->kitchen ?? 3,
                'corner_plot' => $request->corner_plot,
                'construct_year' => $request->construct_age,
                'possession_status' => $request->possession_status,
                'property_status' => $request->property_status,
                'property_amenity' => $request->property_aminety,
                'total_flats' => $request->total_flats ?? 3,
                'token_amount' => $request->token_amount
            ]);

            // Insert property galleries data 
            foreach ($request->galleries as $galleryData) {
                $gallery = PrefPropertyGallery::create([
                    'pid' => $insertedPropertyId,
                    'gallery' => $galleryData['gallery'],
                    'caption' => $galleryData['caption'] ?? null
                ]);

                // Insert property galleries images data 
                foreach ($galleryData['images'] as $image) {
                    PrefPropertyGalleryImage::create([
                        'gallary_id' => $gallery->id,
                        'filename' => $image['image_name'],
                        'type' => $galleryData['gallery']
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => 1,
                'message' => 'Property successfully posted',
                'data' => [
                    'user_id' => $insertedUserId,
                    'property_id' => $insertedPropertyId,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack(); 
            return response()->json([
                'status' => 0,
                'message' => 'Failed to post property',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function get_budget(Request $request)
    {

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

    public function get_property_amnity(Request $request)
    {
        $lang = strtolower($request->input('lang', 'en'));
        try {

            $data = $this->apiModel->getPropertyAmnity($lang);
            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Budget found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Amnity retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {

            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving Amnity.',
                'error' => $e->getMessage(),
            ]);
        }
    }



    public function FetchLocality(Request $request, $id)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getLocality($lang, $id); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No locality found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Localities retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving localities.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }
}
