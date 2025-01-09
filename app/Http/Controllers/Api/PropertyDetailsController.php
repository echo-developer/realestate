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
    public function get_property_details($slug)
    {
        // Log::info("Request in get_property_details slug:\n" . json_encode($slug, JSON_PRETTY_PRINT));

        $property_id = decode_id_from_slug($slug);


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
                // Log::info("galleryEntries:\n" . json_encode($properties, JSON_PRETTY_PRINT));

                $formattedProperties = $properties->map(function ($property) {
                    $galleries = [];

                    $getGalleries = GetProperties_GalleryImages($property->property_id);

                    foreach ($getGalleries as $image) {

                        $galleryType = $image->image_type;
                        if (!isset($galleries[$galleryType])) {
                            $galleries[$galleryType] = [
                                'gallery' => $galleryType,
                                'images' => []
                            ];
                        }

                        $imageUrl = url('property_images/' . $image->filename);

                        $galleries[$galleryType]['images'][] = [
                            'image_id' => $image->image_id,
                            'image_name' => $image->filename,
                            'image_url' => $imageUrl,
                            'caption' => $image->caption
                        ];
                    }
                    $transformedData = array_values($galleries);
                    
                    $amenities = null;
                    if (!empty($property->property_amenity)) {

                        $amenity_ids = json_decode($property->property_amenity, true);

                        if (is_array($amenity_ids)) {

                            $amenities =  $this->apiModel->getPropertyAmnitybyID($amenity_ids);
                        }
                    }





                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'property_key' => format_name(get_name_by_id('pref_property_category_names', 'category_id', $property->property_type, 'en')),
                        'post_for' => $property->post_for,
                        'user' => get_user_name($property->uid),
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'corner_shop' => $property->is_corner_shop,
                        'personal_washroom' => $property->is_personal_washroom,
                        'cafeteria' => $property->pantry_cafeteria_status,
                        'main_road_facing' => $property->faces_main_road,
                        'galleries' => $transformedData,
                        'address' => $property->property_address,
                        'created_at' => $property->created_at,
                        'property_features' => [
                            'property_size' => $property->super_area,
                            'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                            'bedrooms' => $property->bedrooms,
                            'bathroom' => $property->bathrooms,
                            'washroom' => $property->washroom,
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

    public function getPropertyAllImages($slug)
    {
        $property_id = decode_id_from_slug($slug);
        try {
            if (!isset($property_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Property ID not found',
                ]);
            }

            $data = $this->apiModel->getPropertyallImeges($property_id);
            $allImeges = json_decode($data, true);

            // Log::info('Decoded All Images:', ['data' => $allImeges]);

            $transformedData = collect($allImeges)->map(function ($item) {
                $item['image_url'] = url('property_images/' . $item['filename']);
                unset($item['filename']);
                return $item;
            });
            return response()->json([
                'status' => 1,
                'data' => $transformedData,
            ]);
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
