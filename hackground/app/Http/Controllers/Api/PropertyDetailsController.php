<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\PropertyEditController;
use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\Api\ApiModelTest;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyDetailsController extends Controller
{
    protected $apiModel;
    protected $propertyEditController;

    // public function __construct()
    // {
    //     $apiModel = new ApiModel;
    //     $this->apiModel = $apiModel;
    // }

    public function __construct(ApiModel $apiModel, PropertyEditController $propertyEditController)
    {
        $this->apiModel = $apiModel;
        $this->propertyEditController = $propertyEditController;
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

                        $imageUrl = asset('user_upload/property_images/' . $image->filename);

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

                    //calling the landmarks data from property edit controller
                    $landmarks = $this->propertyEditController->EditPropertyLandmarks($property->property_id);

                    $flooring = json_decode($property->flooring_style, true);
                    $floor_array  = $flooring != null ?  array_keys($flooring) : [];
                    $overlooking = json_decode($property->overlooking, true);
                    $overlooking_array  = $overlooking != null ?  array_keys($overlooking) : [];


                    $price_range = getTableData(
                        'pref_property_budget',
                        ['max_budget', 'min_budget'],
                        [],
                        ['id' => $property->property_budget],
                        null
                    );
                    $price_range = json_decode($price_range, true);

                    $priceData = collect($price_range)->first();

                    $max_price = isset($priceData['max_budget']) ? $priceData['max_budget'] : null;
                    $min_price = isset($priceData['min_budget']) ? $priceData['min_budget'] : null;



                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'property_description' => $property->property_desc,
                        'property_key' => format_name(get_name_by_id('pref_property_category_names', 'category_id', $property->property_type, 'en')),
                        'post_for' => $property->post_for,
                        'user' => get_user_name($property->uid),
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'budget' => $property->price_currency . " " . $max_price . '-' . $min_price,
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
                        'property_status' => $property->status, // NEW
                        'views' => $property->views, // NEW
                        'is_featured' => $property->is_featured, // NEW
                        'is_populer' => $property->is_populer, // NEW
                        'carpet_area' => $property->carpet_area, // NEW
                        'flooring_style' => $floor_array, // NEW
                        'expected_possession_month_year' => $property->expected_possesion_month_year, // NEW
                        'furnish_status' => $property->property_furnish, // NEW
                        'electricity' => $property->electric_available, // NEW
                        'water_availability' => $property->water_available, // NEW
                        'lifts_in_tower' => $property->lifts_in_tower, // NEW
                        'flats_per_floor' => $property->flat_each_floor, // NEW
                        'facing_direction' => $property->facing_direction, // NEW
                        'car_parking' => $property->car_parking, // NEW
                        'overlooking' => $overlooking_array, // NEW
                        'ownership_type' => $property->ownership_type, // NEW
                        'landmarks' => reset($landmarks), // NEW
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
                $item['image_url'] = asset('user_upload/property_images/' . $item['filename']);
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


    public function post_property_review(Request $request)
    {

        try {
            // Log::info("post_property_review:\n" . json_encode($request->all(), JSON_PRETTY_PRINT));

            $rateKeys = [];
            $otherKeys = [];

            foreach ($request->all() as $key => $value) {
                if (str_contains($key, '_rate')) {
                    $rateKeys[$key] = $value !== null ? (int) $value : 0;
                } else {
                    $otherKeys[$key] = $value;
                }
            }

            $rateValues = array_values($rateKeys);
            $totalRates = count($rateValues);
            $sumRates = array_sum($rateValues);

            $averageRate = $totalRates > 0 ? round($sumRates / $totalRates, 1) : 0;
            $rateKeys['overall_rating'] = $averageRate;


            $rateKeys['user_id'] = $otherKeys['user_id'] ?? null;
            $rateKeys['property_id'] = $otherKeys['property_id'] ?? null;

            unset($otherKeys['user_id'], $otherKeys['property_id']);

            $insertOrUpdate = $this->apiModel->UpdateInsertReviews($rateKeys, $otherKeys);


            return response()->json([
                'status' => 1,
                'message' => 'Review Added',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }


    public function get_users_property_review(Request $request)
    {

        try {
            $user_id = $request->input('user_id');
            if (!empty($user_id)) {

                $prop_reviews = getTableData(
                    'pref_property_reviews',
                    ['*'],
                    [
                        [
                            'table' => 'property_review_additional',
                            'base_field' => 'pref_property_reviews.id',
                            'operator' => '=',
                            'foreign_field' => 'property_review_additional.review-id',
                        ]
                    ],
                    ['pref_property_reviews.user_id' => $user_id],
                    null
                );

                return response()->json([
                    'status' => 1,
                    'message' => 'Review retrived successfully',
                    'data' => $prop_reviews
                ]);
                
                
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No user found',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
