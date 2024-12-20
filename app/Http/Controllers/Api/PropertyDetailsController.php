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

        $id = decode_id_from_slug($slug);


        $property = PrefProperty::find($id);

        if ($property) {
            $property->increment('views');
            if ($property->views >= 10) {
                $property->is_populer = 1;
                $property->save();
            }
        }
        try {

            if (!empty($id)) {

                $properties = $this->apiModel->getUserPropertyDetails($id);
                $formattedProperties = $properties->map(function ($property) {
                    $galleries = [];
                    if (!empty($property->galleries)) {
                        $galleryEntries = explode(';;', $property->galleries);
                        $galleries = []; // Initialize the galleries array

                        foreach ($galleryEntries as $entry) {
                            $parts = explode('||', $entry);

                            // Process the images
                            $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                            $imagesWithUrl = array_map(function ($image) {
                                return url('property_images/' . $image); // Append the base URL
                            }, $images);

                            $galleries[] = [
                                'gallery_name' => $parts[0] ?? null,
                                'gallery_caption' => $parts[1] ?? null,
                                'images' => $imagesWithUrl,
                            ];
                        }
                    }

                    $amenity_list = []; // Initialize an empty array for storing the amenities

                    if (!empty($property->property_amenity)) {
                        // Decode the property_amenity field (assuming it is stored as a JSON string)
                        $amenity_ids = json_decode($property->property_amenity, true);

                        // Ensure we have an array of IDs
                        if (is_array($amenity_ids)) {
                            // Fetch amenities by their IDs using the getPropertyAmnitybyID method
                            $amenities =  $this->apiModel->getPropertyAmnitybyID($amenity_ids);

                            // Store the fetched amenities in a variable
                            foreach ($amenities as $amenity) {
                                $amenity_list[] = [
                                    'amenity_id' => $amenity->amenity_id,
                                    'amenity_name' => $amenity->amenity_name,
                                    'amenity_image' => url('amenity_image/' . $amenity->amenity_image)
                                ];
                            }
                        }
                    }

                   



                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'user' => get_user_name($property->uid),
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
                        'property_amenities' => $amenity_list,
                    ];
                });

                return response()->json([
                    'status' => 0,
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
}
