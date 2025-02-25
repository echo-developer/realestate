<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Controller;
use App\Models\PrefProperty;
use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyDimension;
use App\Models\PrefPropertyGallery;
use App\Models\PrefPropertyGalleryImage;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertySetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class PostPropertyController extends Controller
{
    public function postPropertyView(Request $request)
    {
        $lang = $request->input('lang', 'en');

        //load CSS
        $cssFiles = File::files(public_path('assets/property_css'));
        $userData = Auth::guard('admin')->user();
        $cssPaths = [];
        foreach ($cssFiles as $file) {
            $cssPaths[] = 'assets/property_css/' . $file->getFilename();
        }


        $homeontroller = new HomeController();

        //load Property type
        $propertyTypes = json_decode($homeontroller->getPropertyType($request)->getContent(), true)['data'] ?? [];

        //load cities
        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();

        //load proepertyAmenities
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];

        //load Furnishes
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];


        //load Property Status
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        // dd($propertyStatus);

        return view('Admin.Post_property_view.post_property', compact('cssPaths', 'userData', 'propertyTypes', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus'));
    }



    public function PropertyImageStore(Request $request)
    {
        // Log::info($request->all());

        // Validate the request
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        $uploadedImages = [];
        $type = $request->input('type', 'other'); // Default to 'other' if no type is provided

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $filePath = 'user_upload/property_images/';
                $file->move(public_path($filePath), $filename);

                // Store uploaded image under the respective type
                $uploadedImages[] = [
                    'imageUrl' => asset($filePath . $filename),
                    'filename' => $filename
                ];
            }
        }
        if (empty($uploadedImages)) {
            return response()->json([
                'success' => false,
                'type' => $type,
                'images' => []
            ]);
        }

        return response()->json([
            'success' => true,
            'type' => $type, // Return the active tab key
            'images' => $uploadedImages
        ]);
    }



    public function PropertyPost(Request $request)
    {
        log::info(json_encode($request->all()));
        try {

            $property = $this->createProperty();

            $this->updatePropertyDetails($property, $request);
            $this->savePropertyLocation($property->id, $request);
            $this->savePropertySettings($property->id, $request);
            // $this->savePropertyDimensions($property->id, $request);
            $this->savePropertyAdditional($property->id, $request);
            // $this->savePropertyGalleries($property->id, $request);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Property successfully posted',
                'data' => [
                    'property_id' => $property->id,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    private function createProperty()
    {
        return PrefProperty::create([
            'status' => config('constants.STATUS_INACTIVE'),
        ]);
    }


    private function updatePropertyDetails($property, $request)
    {
        $slug = get_slug_name(
            $property->id,
            '',
            $request->carpet_area,
            $request->super_area,
            $request->postFor,
            $request->landmark,
            $request->city,
            $request->property_for
        );

        $name = get_property_name(
            '',
            $request->carpet_area,
            $request->super_area,
            $request->postFor,
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
            'locality' => $request->landmark,
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
            'property_type_for' => $request->property_for,
            'carpet_area' => $request->carpet_area,
            'super_area' => $request->super_area,
            'rooms' => 4,
            'expected_price' => $request->expected_price,
            'post_for' => $request->postFor,
            'price_currency' => $request->currency,
            'property_budget' => $request->property_budget,
        ]);
    }

    private function savePropertyDimensions($propertyId, $request)
    {
        $bedroom = $request->bedroom;
        $bathroom = $request->bathroom;
        $washroom = $request->washroom;


        // Decode JSON if valid; otherwise, default to an empty array
        $bedroomDecoded = is_string($bedroom) && is_array(json_decode($bedroom, true))
            ? json_decode($bedroom, true)
            : (is_array($bedroom) ? $bedroom : []);

        $bathroomDecoded = is_string($bathroom) && is_array(json_decode($bathroom, true))
            ? json_decode($bathroom, true)
            : (is_array($bathroom) ? $bathroom : []);

        $washroomDecoded = is_string($washroom) && is_array(json_decode($washroom, true))
            ? json_decode($washroom, true)
            : (is_array($washroom) ? $washroom : []);

        // Merge decoded bedroom and bathroom arrays
        $rooms = array_merge($bedroomDecoded, $bathroomDecoded, $washroomDecoded);

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
            'floor' => $request->floors,
            'total_floor' => $request->total_floors,
            'corner_plot' => $request->corner_plot,
            'construct_year' => $request->age,
            'possession_status' => $request->possession_status,
            'property_furnish' => $request->property_furnish,
            'property_amenity' => is_array($request->amenities) ? implode(',', $request->amenities) : $request->property_amenity,
            'total_floor' => $request->total_floors,
            'is_personal_washroom' => $request->personal_washroom,
            'pantry_cafeteria_status' => $request->cafeteria,
            'is_corner_shop' => $request->corner_shop,
            'faces_main_road' => $request->main_road_facing,
            'property_desc' => $request->description,
            'expected_possesion_month_year' => $expected_possesion_month_year
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
}
