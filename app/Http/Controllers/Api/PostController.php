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
use App\Models\PrefPropertyDimension;
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
                'user_type' => is_string($request->user_type) ? $request->user_type : null,
                'user_name' => is_string($request->user_name) && !empty($request->user_name) ? $request->user_name : null,
                'whatsapp_no' => is_string($request->w_no) ? $request->w_no : null,
                'phone_code' => is_string($request->country_code) && !empty($request->country_code) ? $request->country_code : null,
                'email' => filter_var($request->user_email, FILTER_VALIDATE_EMAIL) ? $request->user_email : null,
            ]);

            $insertedUserId = $user->id;

            $property = PrefProperty::create([
                'uid' => $insertedUserId,
                'status' => config('constants.STATUS_INACTIVE'),
            ]);
            $insertedPropertyId = $property->id;  // Assume this is your inserted property ID

            // Combine the property ID with other relevant details to make it unique and longer
            $combinedString = (string)$insertedPropertyId . '-' .
                (string)$request->bedrooms_count . '-' .
                (string)$request->carpet_area . '-' .
                (string)$request->plot_area;

            // Convert the combined string into hexadecimal
            $hexEncodedId = strtoupper(bin2hex($combinedString));

            // Generate slug using property_id and other details
            $slug = sprintf(
                "%s-BHK-%s-Sq-ft-FOR-%s-%s-in-%s&id=%s",
                is_numeric($request->bedrooms_count) ? $request->bedrooms_count : "2",
                is_numeric($request->carpet_area) && is_numeric($request->plot_area)
                    ? ($request->carpet_area * $request->plot_area)
                    : "NA",
                ucfirst($request->post_for ?? "Sale"),
                ucfirst(get_name_by_id('pref_locality_names', 'locality_id', $request->locality, 'en') ?? "Unknown"),
                ucfirst(get_name_by_id('pref_city_names', 'city_id', $request->city, 'en') ?? "Unknown"),
                $hexEncodedId
            );

            // Update the property with the generated slug
            PrefProperty::where('id', $insertedPropertyId)->update(['slug' => $slug]);



            // Insert property location data
            PrefPropertyLocation::create([
                'pid' => $insertedPropertyId,
                'city' => is_numeric($request->city) ? $request->city : null,
                'locality' => is_numeric($request->locality) ? $request->locality : null,
                'property_address' => is_string($request->address) && !empty($request->address) ? $request->address : null,
            ]);

            // Insert property settings data
            PrefPropertySetting::create([
                'pid' => $insertedPropertyId,
                'parking_ability' => is_string($request->parking_ability) && !empty($request->parking_ability) ? $request->parking_ability : null,
                'property_type_for' => is_numeric($request->property_type_for) ? $request->property_type_for : null,
                'bedrooms' => is_numeric($request->bedrooms_count) ? $request->bedrooms_count : null,
                'bathrooms' => is_numeric($request->bathrooms_count) ? $request->bathrooms_count : null,
                'property_type' => is_numeric($request->property_type) ? $request->property_type : null,
                'carpet_area' => is_numeric($request->carpet_area) ? $request->carpet_area : null,
                'plot_area' => is_numeric($request->plot_area) ? $request->plot_area : null,
                'rooms' => is_numeric($request->rooms) ? $request->rooms : null,
                'expected_price' => is_numeric($request->expected_price) ? $request->expected_price : null,
                'post_for' => is_string($request->post_for) && !empty($request->post_for) ? $request->post_for : null,
                'price_currency' => is_string($request->currency) && !empty($request->currency) ? $request->currency : null,
                'property_budget' => is_numeric($request->property_budget) ? $request->property_budget : null, // Assuming this is a fixed value
            ]);

            // Insert property additional data
            PrefPropertyAdditional::create([
                'pid' => $insertedPropertyId,
                'floor' => is_string($request->floor) && !empty($request->floor) ? $request->floor : null,
                'kitchen' => is_numeric($request->kitchen) ? $request->kitchen : null,
                'corner_plot' => is_string($request->corner_plot) && !empty($request->corner_plot) ? $request->corner_plot : null,
                'construct_year' => is_string($request->construct_age) && !empty($request->construct_age) ? $request->construct_age : null,
                'possession_status' => is_numeric($request->possession_status) && !empty($request->possession_status) ? $request->possession_status : null,
                'property_furnish' => is_numeric($request->property_furnish) && !empty($request->property_furnish) ? $request->property_furnish : null,
                'property_amenity' => is_numeric($request->property_aminety) && !empty($request->property_aminety) ? $request->property_aminety : null,
                'total_flats' => is_numeric($request->total_flats) ? $request->total_flats : null,
                'token_amount' => is_numeric($request->token_amount) ? $request->token_amount : null,
            ]);


            $galleries = $request->galleries;


            if (is_string($galleries)) {
                $galleries = json_decode($galleries, true);
            }


            if (is_array($galleries)) {
                // Insert property galleries data 
                foreach ($galleries as $galleryData) {
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
                            'type' => strtolower(str_replace(' ', '_', $galleryData['gallery']))
                        ]);
                    }
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
            Log::error('Error in Localities: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving Localities.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }

    public function furnish(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getFurnish($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No Furnish found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Furnish retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in furnish: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving furnish.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }

    public function status(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getPropertyStatus($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No status found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Status retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in status: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving status.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }
}
