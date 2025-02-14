<?php

namespace App\Http\Controllers\Api;

use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\Api\ApiModelTest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\ProjectPropertyMapping;
use App\Http\Controllers\Api\PropertyEditController;
use App\Models\PrefProject;
use App\Models\User;

class PropertyDetailsController extends Controller
{
    protected $apiModel;
    protected $propertyEditController;

    // public function __construct()
    // {
    //     $apiModel = new ApiModel;
    //     $this->apiModel = $apiModel;
    // }
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
    }

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




                    $amenityArray = [];
                    if (!empty($property->property_amenity)) {

                        $amenity_ids = $this->sanitizeAmenityIds($property->property_amenity);

                        if (is_array($amenity_ids)) {

                            $getamenities =  $this->apiModel->getPropertyAmnitybyID($amenity_ids);
                            $amenityArray = $getamenities->pluck('amenity_name')->toArray();
                        }
                    }

                    //calling the landmarks data from property edit controller
                    $landmarks = $this->propertyEditController->EditPropertyLandmarks($property->property_id);

                    $flooring = json_decode($property->flooring_style, true);
                    $floor_array  = $flooring != null ?  array_values($flooring) : [];
                    $overlooking = json_decode($property->overlooking, true);
                    $overlooking_array  = $overlooking != null ?  array_values($overlooking) : [];


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

                    /* ------------------------------------------------------ Get properties Project Start ---------------------------------------------------------*/

                    $projectId = ProjectPropertyMapping::where('property_id', $property->property_id)
                        ->value('project_id');
                    $project = PrefProject::where('id', $projectId)
                        ->with('settings')
                        ->first();


                    if ($project && $project->settings) {

                        $projectData = $project->toArray();
                        $projectData = array_merge($projectData, $project->settings->toArray());


                        unset($projectData['settings']);
                        $property_project = $projectData;
                    } else {

                        $property_project = null;
                    }

                    /* ------------------------------------------------------ Get properties Project End ---------------------------------------------------------*/

                    /* ------------------------------------------------------ Get Nearby properties Start ---------------------------------------------------------*/

                    $nearbyProperties = \App\Models\PrefProperty::with('settings', 'additional', 'gallery', 'gallery.images')
                        ->join('pref_properties_location', 'pref_properties_location.pid', '=', 'pref_properties.id')
                        ->whereNotNull('pref_properties_location.latitude')
                        ->whereNotNull('pref_properties_location.longitude')
                        ->where('pref_properties.id', '!=', $property->property_id)
                        ->whereRaw("(
                        6371 * acos(
                            cos(radians(?)) * cos(radians(pref_properties_location.latitude)) * cos(radians(pref_properties_location.longitude) - radians(?)) + 
                            sin(radians(?)) * sin(radians(pref_properties_location.latitude))
                        )
                    ) < 5", [
                            $property->latitude,
                            $property->longitude,
                            $property->latitude
                        ])->get();

                    // Flatten nearby properties
                    $flattenedNearbyProperties = $nearbyProperties->map(function ($nearbyProperty) {
                        $is_fav = !empty($user_id) && DB::table('pref_my_favorite_property')
                            ->where('uid', $nearbyProperty->uid)
                            ->where('propID', $nearbyProperty->id)
                            ->value('status') == config('constants.STATUS_ACTIVE');

                        return [
                            'id' => $nearbyProperty->id,
                            'property_name' => $nearbyProperty->name,
                            'slug' => $nearbyProperty->slug,
                            'address' => $nearbyProperty->location->address,
                            'possession_status' => isset($nearbyProperty->additional->possession_status) ? get_name_by_id('pref_property_status_names', 'status_id', $nearbyProperty->additional->possession_status, 'en') : null,
                            'property_is_featured' => $nearbyProperty->is_featured,
                            'property_views' => $nearbyProperty->views,
                            'property_is_popular' => $nearbyProperty->is_popular,
                            'created_at' => $nearbyProperty->created_at,
                            'is_fav' => $is_fav,
                            'gallery' => processPropertyGallery($nearbyProperty->gallery)
                        ];
                    });
                    /* ------------------------------------------------------ Get Nearby properties End ---------------------------------------------------------*/


                    /* ------------------------------------------------------ Get similar properties Start---------------------------------------------------------*/
                    $similarProperties = \App\Models\PrefProperty::where('pref_properties.id', '!=', $property->property_id)
                        ->with('location', 'settings', 'additional', 'gallery', 'gallery.images')
                        ->whereHas('settings', function ($query) use ($property) {
                            $query->where('property_type',  $property->property_type);
                        })
                        ->limit(10);
                    $similarProperties = $similarProperties->get();

                    $flattenedSimilarProperties = $similarProperties->map(function ($similarProperty) {
                        $is_fav = !empty($user_id) && DB::table('pref_my_favorite_property')
                            ->where('uid', $user_id)
                            ->where('propID', $similarProperty->id)
                            ->value('status') == config('constants.STATUS_ACTIVE');

                        return [
                            'id' => $similarProperty->id,
                            'property_name' => $similarProperty->name,
                            'slug' => $similarProperty->slug,
                            'address' => $similarProperty->location->address,
                            'possession_status' => isset($similarProperty->additional->possession_status)
                                ? get_name_by_id('pref_property_status_names', 'status_id', $similarProperty->additional->possession_status, 'en')
                                : null,
                            'property_is_featured' => $similarProperty->is_featured,
                            'property_views' => $similarProperty->views,
                            'property_is_popular' => $similarProperty->is_popular,
                            'created_at' => $similarProperty->created_at,
                            'is_fav' => $is_fav,
                            'gallery' => processPropertyGallery($similarProperty->gallery)
                        ];
                    });
                    /* ------------------------------------------------------ Get similar properties End---------------------------------------------------------*/

                    $property_review = DB::table('pref_property_reviews')
                        ->leftJoin('property_review_additional', 'pref_property_reviews.id', '=', 'property_review_additional.review-id')
                        ->select(
                            'user_id',
                            'property_id',
                            'overall_rating',
                            'created_at',
                            'updated_at',
                            'review-id',
                            'review_title',
                            'review_description',
                            'user_relation'
                        )->where('pref_property_reviews.property_id', '=', $property->property_id)
                        ->get()
                        ->sortByDesc('overall_rating');

                    $total_count = $property_review->count();
                    $average_rating = round($property_review->avg('overall_rating'), 1);


                    $property_review->map(function ($items) {

                        $items->name = get_user_name($items->user_id ?? null);
                        unset($items->user_id);
                        return $items;
                    });

                    $userDetails = User::with('userAdditional')->find($property->uid);

                    $userPropertyCounts = PrefProperty::with('settings')
                        ->where('uid', $property->uid)
                        ->whereHas('settings', function ($qry) {
                            $qry->whereIn('post_for', ['sell', 'rent']);
                        })
                        ->get()
                        ->groupBy('settings.post_for')
                        ->map(fn($group) => $group->count());

                    //rating calculation if user is a AGENT

                    // log::info($average_rating);
                    
                    if ($userDetails) {

                        if ($userDetails->user_type === 'A') {
                            $agentAllRatings = DB::table('agents_rating')
                                ->where('agent_id', $property->uid)
                                ->pluck('rating');

                            $totalRating = $agentAllRatings->count();
                            $ratingSum = $agentAllRatings->sum();

                            $average_rating = $totalRating > 0
                                ? round($ratingSum / $totalRating, 1)
                                : 0;
                        }

                        $customUserDetails = [
                            'id'          => $userDetails->id,
                            'name'        => $userDetails->name,
                            'user_type'   => $userDetails->user_type,
                            'email'       => $userDetails->email,
                            'image'       => $userDetails->image
                                ? asset('user_upload/profile_image/' . $userDetails->image)
                                : null,
                            'phone'       => $userDetails->phone,
                            'phone_code'  => $userDetails->phone_code,
                            'status'      => $userDetails->status,
                            'created_at'  => $userDetails->created_at,
                            'city'        => isset($userDetails->userAdditional->city) ? get_name_by_id('pref_city_names', 'city_id', $userDetails->userAdditional->city, 'en') : null,
                            'address'        => $userDetails->userAdditional->address ?? null,
                            'PropertyInSell'   => $userPropertyCounts->get('sell', 0),
                            'PropertyInRent'   => $userPropertyCounts->get('rent', 0),
                            'rating' => $average_rating,
                        ];
                    }


                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'property_description' => $property->property_desc,
                        'property_key' => format_name(get_name_by_id('pref_property_category_names', 'category_id', $property->property_type, 'en')),
                        'post_for' => $property->post_for,
                        'user_details' => $customUserDetails ?? null,
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'budget' => $property->price_currency . " " . $max_price . '-' . $min_price,
                        'corner_shop' => $property->is_corner_shop,
                        'personal_washroom' => $property->is_personal_washroom,
                        'cafeteria' => $property->pantry_cafeteria_status,
                        'main_road_facing' => $property->faces_main_road,
                        'galleries' => $transformedData,
                        'address' => $property->property_address,
                        'latitude' => $property->latitude,
                        'longitude' => $property->longitude,
                        'created_at' => $property->created_at,
                        'property_features' => [
                            'property_size' => $property->super_area,
                            'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                            'bedrooms' => $property->bedrooms,
                            'bathroom' => $property->bathrooms,
                            'washroom' => $property->washroom,
                        ],
                        'property_amenities' => $amenityArray,
                        'property_status' => $property->status,
                        'views' => $property->views,
                        'is_featured' => $property->is_featured,
                        'is_populer' => $property->is_populer,
                        'carpet_area' => $property->carpet_area,
                        'flooring_style' => $floor_array,
                        'expected_possession_month_year' => $property->expected_possesion_month_year,
                        // 'furnish_status' => $property->property_furnish, 
                        'furnish_status' => get_name_by_id('pref_property_furnish_names', 'furnish_id', $property->property_furnish, 'en'),
                        'electricity' => $property->electric_available,
                        'water_availability' => $property->water_available,
                        'lifts_in_tower' => $property->lifts_in_tower,
                        'flats_per_floor' => $property->flat_each_floor,
                        'facing_direction' => $property->facing_direction,
                        'car_parking' => $property->car_parking,
                        'overlooking' => $overlooking_array,
                        'ownership_type' => $property->ownership_type,
                        'property_project' => $property_project,
                        'nearby_properties' => $flattenedNearbyProperties ?? null,
                        'similar_properties' => $flattenedSimilarProperties,
                        'landmarks' => reset($landmarks),
                        'property_reviews' => [
                            'rating' => $average_rating ?? null,
                            'total_reviews' => $total_count ?? null,
                            'reviews' => $property_review ?? [],
                        ]
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
            Log::error('In file: ' . $e->getFile());
            Log::error('On line: ' . $e->getLine());

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
                    ['user_id', 'property_id', 'overall_rating', 'created_at', 'updated_at', 'review-id', 'review_title', 'review_description', 'user_relation'],
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


                $prop_reviews->map(function ($items) {

                    $items->name = get_user_name($items->user_id ?? null);
                    unset($items->user_id);
                    return $items;
                });

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
