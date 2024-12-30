<?php

namespace App\Http\Controllers\Api;

use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\Api\ApiModelTest;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class PropertyDetailsController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function get_property_details($property_id)
    {
        // Log::info("Request in get_property_details slug:\n" . json_encode($slug, JSON_PRETTY_PRINT));

        // $id = decode_id_from_slug($slug);


        $property = PrefProperty::find($property_id);

        if ($property) {
            $property->increment('views');
            if ($property->views >= 10) {
                $property->is_populer = 1;
                $property->save();
            }
        }
        try {

            if (!empty($property_id)) {

                $properties = $this->apiModel->getUserPropertyDetails($property_id);

                Log::info("galleryEntries:\n" . json_encode($properties, JSON_PRETTY_PRINT));

                $formattedProperties = $properties->map(function ($property) {
                    $galleries = [];
                    if (!empty($property->galleries)) {
                        $galleryEntries = explode(';;', $property->galleries);
                        $galleries = [];

                        Log::info("galleryEntries:\n" . json_encode($galleryEntries, JSON_PRETTY_PRINT));

                        foreach ($galleryEntries as $entry => $value) {
                            $parts = explode('||', $value);

                            Log::info("parts:\n" . json_encode($parts, JSON_PRETTY_PRINT));

                            $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                            $imagesWithUrl = array_map(function ($image) {
                                return url('property_images/' . $image);
                            }, $images);

                            $galleries[] = [
                                'gallery_name' => $parts[0] ?? null,
                                'gallery_caption' => $parts[1] ?? null,
                                'images' => $imagesWithUrl,
                            ];
                        }
                    }
                    if (!empty($property->property_amenity)) {

                        $amenity_ids = json_decode($property->property_amenity, true);

                        if (is_array($amenity_ids)) {

                            $amenities =  $this->apiModel->getPropertyAmnitybyID($amenity_ids);

                            // foreach ($amenities as $amenity) {
                            //     $amenity_list[] = [
                            //         'amenity_id' => $amenity->amenity_id,
                            //         'amenity_name' => $amenity->amenity_name,
                            //         'amenity_image' => url('amenity_image/' . $amenity->amenity_image)
                            //     ];
                            // }
                        }
                    }





                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'post_for' => $property->post_for,
                        // 'user' => get_user_name($property->uid),
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'galleries' => $galleries,
                        'address' => $property->property_address,
                        'created_at' => $property->created_at,
                        'property_features' => [
                            'property_size' => $property->carpet_area * $property->super_area,
                            'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                            'bedrooms' => $property->bedrooms,
                            'bathroom' => $property->bathrooms,
                        ],
                        'property_amenities' => $amenities,
                    ];
                });

                return response()->json([
                    'status' => 1,
                    'message' => 'retrieving all data success.',
                    'data' => $formattedProperties
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in retrieved Data: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }

    public function getPropertyAllImages($property_id){

        try {
            if (empty($property_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Property ID not found',
                ]);
            }

            $allImeges = $this->apiModel->getPropertyallImeges($property_id);

            
        } catch (\Exception $e) {
            Log::error('Error in retrieved Data: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }
}
