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
use Illuminate\Support\Facades\Hash;
use App\Models\PrefPropertyDimension;
use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyGalleryImage;

class PostController extends Controller
{
    protected $apiModel;
    protected  $UserId;
    protected  $bedroom_count;
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
                $file->move(public_path('user_upload/property_images'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = asset('user_upload/property_images/' . $fileName);
            }
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles,
                'image_url' => $fileUrls
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }

    public function postProperty(Request $request)
    {
        DB::beginTransaction();

        try {
            $this->UserId = $this->handleUser($request);
            $property = $this->createProperty($this->UserId);

            $this->updatePropertyDetails($property, $request);
            $this->savePropertyLocation($property->id, $request);
            $this->savePropertySettings($property->id, $request);
            $this->savePropertyDimensions($property->id, $request);
            $this->savePropertyAdditional($property->id, $request);
            $this->savePropertyGalleries($property->id, $request);

            DB::commit();

            return response()->json([
                'status' => 1,
                'message' => 'Property successfully posted',
                'data' => [
                    'user_id' => $this->UserId,
                    'property_id' => $property->id,
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

    private function handleUser($request)
    {
        if (!empty($request->uid)) {
            $user = User::findOrFail($request->uid);

            $user->update([
                'user_type' => $request->user_type ?? $user->user_type,
                'name' => $request->user_name ?? $user->name,
                'whatsapp_no' => $request->w_no ?? $user->whatsapp_no,
                'phone_code' => $request->country_code ?? $request->country_code,
                'email' => filter_var($request->user_email, FILTER_VALIDATE_EMAIL) ? $request->user_email : $user->email,
            ]);

            return $user->id;
        } else {
            $user = User::create([
                'user_type' => $request->user_type,
                'name' => $request->user_name,
                'whatsapp_no' => $request->w_no,
                'phone_code' => $request->country_code,
                'email' => filter_var($request->user_email, FILTER_VALIDATE_EMAIL) ? $request->user_email : null,
                'password' => Hash::make($request->user_password)
            ]);

            return $user->id;
        }
    }

    private function createProperty($userId)
    {
        return PrefProperty::create([
            'uid' => $userId,
            'status' => config('constants.STATUS_INACTIVE'),
        ]);
    }

    private function updatePropertyDetails($property, $request)
    {
        $slug = get_slug_name(
            $property->id,
            $this->countRooms($request->bedrooms),
            $request->carpet_area,
            $request->super_area,
            $request->post_for,
            $request->locality,
            $request->city,
            $request->property_for
        );

        $name = get_property_name(
            $this->countRooms($request->bedrooms),
            $request->carpet_area,
            $request->super_area,
            $request->post_for,
            $request->property_for
        );

        $property->update([
            'slug' => sanitize_slug_part($slug),
            'name' => $name,
        ]);
    }

    private function savePropertyLocation($propertyId, $request)
    {
        PrefPropertyLocation::create([
            'pid' => $propertyId,
            'city' => $request->city,
            'locality' => $request->locality,
            'property_address' => $request->address,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);
    }

    private function savePropertySettings($propertyId, $request)
    {
        PrefPropertySetting::create([
            'pid' => $propertyId,
            'parking_ability' => $request->parking_ability,
            'property_type' => $request->property_type, //arsad changed this , key was wrong ,'property_for'=> 'property_type' 
            'bedrooms' => !empty($this->countRooms($request->bedroom)) ? $this->countRooms($request->bedroom) : null,
            'bathrooms' => !empty($this->countRooms($request->bathroom)) ? $this->countRooms($request->bathroom) : null,
            'property_type_for' => $request->property_for,
            'carpet_area' => $request->carpet_area,
            'super_area' => $request->super_area,
            'rooms' => 3,
            'expected_price' => $request->expected_price,
            'post_for' => $request->post_for,
            'price_currency' => $request->currency,
            'property_budget' => $request->property_budget,
        ]);
    }

    private function savePropertyDimensions($propertyId, $request)
    {
        $bedroom = $request->bedroom;
        $bathroom = $request->bathroom;
        $balcony = $request->balcony;
       
        
        // Decode JSON if valid; otherwise, default to an empty array
        $bedroomDecoded = is_string($bedroom) && is_array(json_decode($bedroom, true))
            ? json_decode($bedroom, true)
            : (is_array($bedroom) ? $bedroom : []);

        $bathroomDecoded = is_string($bathroom) && is_array(json_decode($bathroom, true))
            ? json_decode($bathroom, true)
            : (is_array($bathroom) ? $bathroom : []);
        
       $balconyDecoded = is_string($balcony) && is_array(json_decode($balcony, true))
            ? json_decode($balcony, true)
            : (is_array($balcony) ? $balcony : []);

        // Merge decoded bedroom and bathroom arrays
        $rooms = array_merge($bedroomDecoded, $bathroomDecoded ,$balconyDecoded);

        // Check if $rooms has any data to process
        if (!empty($rooms)) {
            // Map and prepare records for insertion
            $records = array_map(function ($room) use ($propertyId) {
                return [
                    'pid' => $propertyId,
                    'room_type' => $room['key'] ?? null, // Use null if key is missing
                    'size' => json_encode([
                        'height' => $room['height'] ?? null,
                        'height_unit' => $room['height_unit'] ?? null,
                        'width' => $room['width'] ?? null,
                        'width_unit' => $room['width_unit'] ?? null,
                    ]),
                ];
            }, $rooms);

            // Insert records into the database
            PrefPropertyDimension::insert($records);
        }
    }

    private function savePropertyAdditional($propertyId, $request)
    {
        $expected_possesion_month_year = trim(
            ($request->construction_month ?? '') . 
            ((!empty($request->construction_month) && !empty($request->construction_year)) ? '-' : '') . 
            ($request->construction_year ?? '') 
        );


        
        PrefPropertyAdditional::create([
            'pid' => $propertyId,
            'floor' => $request->floor,
            'total_floor' => $request->total_floor,
            'kitchen' => $this->countRooms($request->kitchen),
            'washroom' => $this->countRooms($request->washroom),
            'corner_plot' => $request->corner_plot,
            'construct_year' => $request->construct_age,
            'possession_status' => $request->possession_status,
            'property_furnish' => $request->property_furnish,
            'property_amenity' => is_array($request->property_amenity) ? implode(',', $request->property_amenity) : $request->property_amenity,
            'total_floor' => $request->total_floor,
            'is_personal_washroom' => $request->personal_washroom,
            'pantry_cafeteria_status' => $request->cafeteria,
            'is_corner_shop' => $request->corner_shop,
            'faces_main_road' => $request->main_road_facing,
            'property_desc' => $request->description,
            'expected_possesion_month_year' =>$expected_possesion_month_year
        ]);
    }

    private function savePropertyGalleries($propertyId, $request)
    {
        $galleries = $request->galleries;

        if ($galleries) {
            if (is_string($galleries)) {
                $galleries = json_decode($galleries, true);
            }

            if (is_array($galleries)) {
                foreach ($galleries as $galleryData) {
                    $gallery = PrefPropertyGallery::create([
                        'pid' => $propertyId,
                        'image_type' => $galleryData['gallery'],
                    ]);

                    foreach ($galleryData['images'] as $image) {
                        PrefPropertyGalleryImage::create([
                            'gallary_id' => $gallery->id,
                            'filename' => $image['image_name'],
                        ]);
                    }
                }
            }
        }
    }

    private function countRooms($rooms)
    {
        // Check if the input is already an array
        if (is_array($rooms)) {
            return count($rooms);
        }

        // If not, attempt to decode the JSON string
        $decodedRooms = json_decode($rooms, true);

        // If decoding is successful and the result is an array, count the rooms
        return is_array($decodedRooms) ? count($decodedRooms) : 0;
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
