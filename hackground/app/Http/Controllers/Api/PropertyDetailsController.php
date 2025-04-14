<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\PropertyEditController;
use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\Api\ApiModelTest;
use App\Models\CertificatesModel;
use App\Models\FloorPlan;
use App\Models\PrefFloorPlanType;
use App\Models\PrefFloorPlanValue;
use App\Models\PrefProject;
use App\Models\PrefProperty;

use App\Models\PrefPropertyAdditional;
use App\Models\PrefPropertyReport;
use App\Models\ProjectPropertyMapping;
use App\Models\User;
use function Laravel\Prompts\table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyDetailsController extends Controller
{
    protected $apiModel;
    protected $project;
    protected $project_id;
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
    public function get_property_details($slug, $user_id, Request $req)
    {
        $lang = $req->input('lang', 'en');
        $property_id = decode_id_from_slug($slug);


        $property = PrefProperty::find($property_id);

        $this->project_id = ProjectPropertyMapping::where('property_id', $property_id)
            ->value('project_id');

        $this->project = PrefProject::where('id', $this->project_id)
            ->with(
                'settings',
                'galleries:id,project_id,image_type',
                'galleries.images:id,gallary_id,filename,caption',
            )
            ->first();
            
        if ($property) {
            $property->increment('views');
            if ($property->views >= 10) {
                $property->is_populer = 1;
                $property->save();
            }

            //helper fxn
            $cookieName = "property_{$property_id}_{$user_id}";
            $cookie = cookie($cookieName, true, 1440);

            // log::info("Setting cookie: " . $cookieName);


            if (request()->hasCookie($cookieName)) {
                // log::info("Cookie Found: " . $cookieName);
            } else {
                // log::info("Cookie Not Found: " . $cookieName);
            }
            recordView('property', $property_id, (int) $user_id);
        }
        try {



            if (!empty($property_id)) {

                $properties = $this->apiModel->getUserPropertyDetails($property_id);
                // Log::info("galleryEntries:\n" . json_encode($properties, JSON_PRETTY_PRINT));

                $formattedProperties = $properties->map(function ($property) use ($user_id, $lang) {

                    $is_favorite = !empty($user_id) && DB::table('my_favorite_property')
                        ->where('uid', $user_id)
                        ->where('propID', $property->property_id)
                        ->value('status') == config('constants.STATUS_ACTIVE');

                    $is_my_property = !empty($user_id) && $property->uid == $user_id ? true : false;

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

                    $certificates = CertificatesModel::where([
                        'property_id' => $property->property_id,
                        'status' => config('constants.STATUS_ACTIVE')
                    ])
                        ->get()
                        ->makeHidden(['id', 'project_id', 'property_id', 'updated_at'])->toArray();



                    $amenityArray = [];
                    if (!empty($property->property_amenity)) {
                        $amenity_ids = $this->sanitizeAmenityIds($property->property_amenity);

                        if (is_array($amenity_ids)) {
                            $amenityArray =  $this->apiModel->getPropertyAmnitybyID($amenity_ids);
                        }
                    }

                    //calling the landmarks data from property edit controller
                    $landmarks = $this->propertyEditController->EditPropertyLandmarks($property->property_id);

                    $flooring = json_decode($property->flooring_style, true);
                    $floor_array  = $flooring != null ?  array_values($flooring) : [];
                    $overlooking = json_decode($property->overlooking, true);
                    $overlooking_array  = $overlooking != null ?  array_values($overlooking) : [];


                    $price_range = getTableData(
                        'property_budget',
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

                    $bhkData = $this->apiModel->getBHKdata($projectId) ?? null;
                    if ($project && $project->settings) {

                        $projectData = $project->toArray();
                        $projectData = array_merge($projectData, $project->settings->toArray());
                        $projectData['available_bhk'] = $bhkData;

                        unset($projectData['settings']);
                        $property_project = $projectData;
                    } else {

                        $property_project = null;
                    }

                    /* ------------------------------------------------------ Get properties Project End ---------------------------------------------------------*/
                    /* ------------------------------------------------------ Propety Floor plan under project start ---------------------------------------------------------*/
                    $allFloorPlanTypes = PrefFloorPlanType::where('status', true)
                        ->with(['names' => function ($query) use ($lang) {
                            $query->where('lang', $lang);
                        }])
                        ->get();

                    $floorPlans = FloorPlan::where('status', true)
                        ->with(['names' => function ($query) use ($lang) {
                            $query->where('lang', $lang);
                        }])
                        ->get();

                    $mergedFloorPlans = [];

                    foreach ($allFloorPlanTypes as $type) {
                        $typeName = $type->names->first()->type ?? null;
                        $projectId = $this->project_id;
                        $filteredPlans = $floorPlans->filter(function ($plan) use ($type, $projectId) {
                            return $plan->fp_type == $type->id;
                        })->map(function ($plan) use ($projectId) {

                            $additionalValues = PrefFloorPlanValue::where('fp_id', $plan->id)
                                ->where('project_id', $projectId)
                                ->first();

                            $description = $additionalValues ? $additionalValues->desc : $plan->description;

                            return !empty($description) ? [
                                'item_id' => $plan->id,
                                'item' => $plan->names->first()->item ?? null,
                                'type_id' => $plan->fp_type,
                                'description' => $description,
                            ] : null;
                        })->filter()->values();

                        $mergedFloorPlans[] = [
                            'id' => $type->id,
                            'slug' => $type->slug,
                            'name' => $typeName,
                            'items' => $filteredPlans,
                        ];
                    }

                    // $flattenedData['floor_plans'] = $mergedFloorPlans;

                    /* ------------------------------------------------------ Propety Floor plan under project end ---------------------------------------------------------*/

                    /* ------------------------------------------------------ Get Nearby properties Start ---------------------------------------------------------*/

                    $nearbyProperties = PrefProperty::with('settings', 'additional', 'gallery', 'gallery.images')
                        ->join('properties_location', 'properties_location.pid', '=', 'properties.id')
                        ->whereNotNull('properties_location.latitude')
                        ->whereNotNull('properties_location.longitude')
                        ->where('properties.id', '!=', $property->property_id)
                        ->where('properties.uid', '!=', $user_id)
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
                    $flattenedNearbyProperties = $nearbyProperties->map(function ($nearbyProperty) use ($user_id) {
                        $is_fav = !empty($user_id) && DB::table('my_favorite_property')
                            ->where('uid', $user_id)
                            ->where('propID', $nearbyProperty->id)
                            ->value('status') == config('constants.STATUS_ACTIVE');

                        return [
                            'id' => UniquePropertyCode($nearbyProperty->id),
                            'property_name' => $nearbyProperty->name,
                            'slug' => $nearbyProperty->slug,
                            'address' => $nearbyProperty->location->address,
                            'possession_status' => isset($nearbyProperty->additional->possession_status) ? get_name_by_id('property_status_names', 'status_id', $nearbyProperty->additional->possession_status, 'en') : null,
                            'property_is_featured' => $nearbyProperty->is_featured,
                            'property_views' => $nearbyProperty->views,
                            'property_is_popular' => $nearbyProperty->is_popular,
                            'created_at' => $nearbyProperty->created_at,
                            'is_favourite' => $is_fav,
                            'gallery' => processPropertyGallery($nearbyProperty->gallery)
                        ];
                    });
                    /* ------------------------------------------------------ Get Nearby properties End ---------------------------------------------------------*/


                    /* ------------------------------------------------------ Get similar properties Start---------------------------------------------------------*/
                    $similarProperties = PrefProperty::where('properties.id', '!=', $property->property_id)
                        ->when(!empty($user_id), function ($query) use ($user_id) {
                            $query->where('properties.uid', '!=', $user_id);
                        })
                        ->with('location', 'settings', 'additional', 'gallery', 'gallery.images')
                        ->whereHas('settings', function ($query) use ($property) {
                            $query->where('property_type',  $property->property_type);
                        })
                        ->limit(10);
                    $similarProperties = $similarProperties->get();

                    $flattenedSimilarProperties = $similarProperties->map(function ($similarProperty) use ($user_id) {
                        $is_fav = !empty($user_id) && DB::table('my_favorite_property')
                            ->where('uid', $user_id)
                            ->where('propID', $similarProperty->id)
                            ->value('status') == config('constants.STATUS_ACTIVE');

                        return [
                            'id' => UniquePropertyCode($similarProperty->id),
                            'property_name' => $similarProperty->name,
                            'slug' => $similarProperty->slug,
                            'address' => isset($similarProperty->location->address) ? $similarProperty->location->address : null,
                            'possession_status' => isset($similarProperty->additional->possession_status)
                                ? get_name_by_id('property_status_names', 'status_id', $similarProperty->additional->possession_status, 'en')
                                : null,
                            'property_is_featured' => $similarProperty->is_featured,
                            'property_views' => $similarProperty->views,
                            'property_is_popular' => $similarProperty->is_popular,
                            'created_at' => $similarProperty->created_at,
                            'is_favourite' => $is_fav,
                            'gallery' => processPropertyGallery($similarProperty->gallery)
                        ];
                    });
                    /* ------------------------------------------------------ Get similar properties End---------------------------------------------------------*/

                    $property_review = DB::table('property_reviews')
                        ->leftJoin('property_review_additional', 'property_reviews.id', '=', 'property_review_additional.review-id')
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
                        )->where('property_reviews.property_id', '=', $property->property_id)
                        ->get()
                        ->sortByDesc('overall_rating')
                        ->values();

                    $total_count = $property_review->count();
                    $average_rating = round($property_review->avg('overall_rating'), 1);


                    $property_review->map(function ($items) {

                        $items->name = get_user_name($items->user_id ?? null);
                        unset($items->user_id);
                        return $items;
                    })->values();

                    //TOP AGENT LIST

                    $topAgentList = propertyTopAgentList($property->locality) ?? [];

                    //USER's DETAILS
                    $userDetails = User::with('userAdditional')->find($property->uid);

                    $userPropertyCounts = UsersPropertyCount($property->uid);

                    //rating calculation if user is a AGENT

                    if ($userDetails) {

                        $average_rating = 0;
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
                            'city'        => isset($userDetails->userAdditional->city) ? get_name_by_id('city_names', 'city_id', $userDetails->userAdditional->city, 'en') : null,
                            'address'        => $userDetails->userAdditional->address ?? null,
                            'PropertyInSell'   => $userPropertyCounts['forSell'],
                            'PropertyInRent'   => $userPropertyCounts['forRent'],
                            'totalProperty'   => ($userPropertyCounts['forSell'] ?? 0) + ($userPropertyCounts['forRent'] ?? 0) + ($userPropertyCounts['unknown'] ?? 0),
                            'rating' => $average_rating,
                        ];
                    }

                    //fetch brochure data

                    $brochure_file = PrefPropertyAdditional::where('pid', $property->property_id)->value('brochure_file');

                    if ($brochure_file) {
                        $filePath = public_path('user_upload/property_brochure/' . $brochure_file);

                        $fileUrl = file_exists($filePath)
                            ? asset('user_upload/property_brochure/' . $brochure_file)
                            : null;
                    } else {
                        $fileUrl = null;
                    }


                    $possesionTime = explode('-', $property->expected_possesion_month_year ?? '');
                    $possesionMonth = !empty($possesionTime[0]) ? $possesionTime[0] : null;
                    $possesionYear = !empty($possesionTime[1]) ? $possesionTime[1] : null;


                    $baseImageUrl = asset('user_upload/project_images');

                    $formattedPropertyGalleries = collect(optional($this->project)->galleries)->map(function ($gallery) use ($baseImageUrl) {
                        return [
                            'gallery' => $gallery['image_type'] ?? '', // Ensure 'image_type' exists
                            'images' => collect($gallery['images'] ?? [])->map(function ($image) use ($baseImageUrl) {
                                return [
                                    'image_id' => $image['id'] ?? null, // Avoid errors if 'id' is missing
                                    'image_name' => $image['filename'] ?? '', // Default empty if filename is missing
                                    'image_url' => isset($image['filename']) ? $baseImageUrl . '/' . $image['filename'] : null,
                                    'caption' => $image['caption'] ?? null,
                                ];
                            })->toArray(),
                        ];
                    })->toArray();

                    // Unset only if project exists
                    if (!empty($this->project)) {
                        unset($this->project->galleries);
                    }

                    return [
                        'property_id' => $property->property_id,
                        'property_code' => UniquePropertyCode($property->property_id),
                        'is_favourite' => $is_favorite,
                        'is_my_property' => $is_my_property,
                        'property_name' => $property->property_name,
                        'property_brochure_pdf' => $fileUrl ?? '',
                        'property_description' => $property->property_desc,
                        'property_key' => format_name(get_name_by_id('property_category_names', 'category_id', $property->property_type, 'en')),
                        'property_type_id' => $property->property_type,
                        'post_for' => $property->post_for,
                        'user_details' => $customUserDetails ?? null,
                        'top_agents' => $topAgentList,
                        'currency' => $property->price_currency,
                        'price' => $property->expected_price,
                        'budget' =>  trim($max_price . (!empty($max_price) && !empty($min_price) ? '-' : '') . $min_price),
                        'corner_shop' => $property->is_corner_shop,
                        'personal_washroom' => $property->is_personal_washroom,
                        'cafeteria' => $property->pantry_cafeteria_status,
                        'launch_date' => $property->launch_date,
                        'ceiling_height' => $property->ceiling_height,

                        'construction_done' => $property->construction_done,
                        'is_gated_colony' => $property->is_gated_colony,
                        'boundary_wall' => $property->boundary_wall,
                        'road_width' => $property->road_width,
                        'total_open_sides' => $property->total_open_sides,
                        'approved_by' => $property->approved_by,

                        'main_road_facing' => $property->faces_main_road,
                        'galleries' => $transformedData != null ? $transformedData : $formattedPropertyGalleries,
                        'address' => $property->property_address,
                        'locality' => $property->locality,
                        'latitude' => $property->latitude,
                        'longitude' => $property->longitude,
                        'created_at' => $property->created_at,
                        'property_features' => [
                            'property_size' => $property->super_area,
                            'area_in_sqft' => $property->area_in_sqft,
                            'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                            'bedrooms' => $property->bedrooms,
                            'bathroom' => $property->bathrooms,
                            'washroom' => $property->washroom,
                        ],
                        'certificates' => $certificates,
                        'property_amenities' => $amenityArray,
                        'property_status' => $property->status,
                        'views' => $property->views,
                        'is_featured' => $property->is_featured,
                        'is_populer' => $property->is_populer,
                        'unit_type' => $property->unit_type,
                        'carpet_area' => $property->carpet_area,
                        'plot_area' => $property->plot_area,
                        'parking_ability' => $property->parking_ability,
                        'flooring_style' => $floor_array,
                        'possession_status' => get_name_by_id('property_status_names', 'status_id', $property->possession_status, 'en'),
                        'possession_month' => $possesionMonth,
                        'possession_year' => $possesionYear,
                        'furnish_status' => get_name_by_id('property_furnish_names', 'furnish_id', $property->property_furnish, 'en'),
                        'electricity' => $property->electric_available,
                        'water_availability' => $property->water_available,
                        'lifts_in_tower' => $property->lifts_in_tower,
                        'flats_per_floor' => $property->flat_each_floor,
                        'facing_direction' => $property->facing_direction,
                        // 'car_parking' => $property->car_parking,
                        'overlooking' => $overlooking_array,
                        'ownership_type' => $property->ownership_type,
                        'property_project' => $property_project,
                        'floor_plans' => $mergedFloorPlans,
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
                'error_msg' => $e->getMessage()
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

            $currentpage = (int) $request->input('currentpage', 1);
            $limit = (int) $request->input('limit', 10);
            $offset = ($currentpage - 1) * $limit;

            if (!empty($user_id)) {

                $prop_reviews = getTableData(
                    'property_reviews',
                    ['user_id', 'property_id', 'overall_rating', 'created_at', 'updated_at', 'review-id', 'review_title', 'review_description', 'user_relation'],
                    [
                        [
                            'table' => 'property_review_additional',
                            'base_field' => 'property_reviews.id',
                            'operator' => '=',
                            'foreign_field' => 'property_review_additional.review-id',
                        ]
                    ],
                    ['property_reviews.property_uid' => $user_id],
                    null
                );

                $total_reviews = $prop_reviews->count() ?? 0;


                $mapppedReviews = $prop_reviews->map(function ($items) {

                    $items->name = get_user_name($items->user_id ?? null);
                    $items->image = get_user_image($items->user_id ?? null);
                    unset($items->user_id);
                    return $items;
                });

                $paginatedReviews = $mapppedReviews->slice($offset, $limit)->values();

                return response()->json([
                    'status' => 1,
                    'message' => 'Review retrived successfully',
                    'data' => [
                        'property_reviews' => $paginatedReviews,
                        'pagination' => [
                            'total_reviews' => $total_reviews,
                            'total_pages' => ceil($total_reviews / $limit),
                            'current_page' => $currentpage,
                        ],
                    ]
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


    public function propertyReport(Request $request)
    {
        try {
            $property_id = $request->input('property_id');
            $user_id_ofThisProperty = PrefProperty::where('id', $property_id)->value('uid');
            $data = [
                'property_id'     => $property_id,
                'property_posted_by'     => $user_id_ofThisProperty,
                'user_id'         => $request->input('user_id'),
                'reason'   => $request->input('reason'),
                'feedback'      => $request->input('additionalInfo'),
                'created_at'      => now(),
                'updated_at'      => now(),
            ];

            $insert = DB::table('property_report')->insert($data);

            return response()->json([
                'status' => 1,
                'message' => 'Report submitted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in propertyReport: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function getReportListofProperty(Request $request)
    {

        try {
            $user_id = $request->input('user_id');
            $current_page = $request->input('current_page');
            $limit = $request->input('limit', 10);
            $offset = ($current_page - 1) * $limit;

            if (empty($user_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No User Id Found',
                    'data' => [],
                ]);
            }

            $propertyReports = PrefPropertyReport::with(['property', 'property.gallery', 'property.gallery.images'])
                ->where('property_posted_by', $user_id)
                ->orderBy('created_at', 'desc')
                ->skip($offset)
                ->take($limit)
                ->get();

            if ($propertyReports->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No Report Found',
                    'data' => [],
                ]);
            }

            $imgURL = null;

            $customReportArray = [];
            foreach ($propertyReports as $report) {
                $reported_by = get_user_name($report->user_id);

                if (!empty($report->property->gallery)) {
                    foreach ($report->property->gallery as $gallery) {
                        if (!empty($gallery->images) && isset($gallery->images[0])) {
                            $imgURL = asset('user_upload/property_images/' . $gallery->images[0]->filename);
                            break;
                        }
                    }
                }

                $customReportArray[] =
                    [
                        'property_id' => $report->property_id ?? null,
                        'name' => $report->property->name ?? null,
                        'slug' => $report->property->slug  ?? null,
                        'image' => $imgURL,
                        'reported_by' => $reported_by ?? null,
                        'reason' => $report->reason ?? null,
                        'description' => $report->feedback ?? null,
                    ];
            }

            $totalReports = PrefPropertyReport::where('property_posted_by', $user_id)->count();
            $totalPages = ceil($totalReports / $limit);

            // log::info(json_encode($propertyReports, JSON_PRETTY_PRINT));
            return response()->json([
                'status' => 1,
                'message' => 'Reports retrived successfully',
                'data' => $customReportArray,
                'pagination' => [
                    'current_page' => (int) $current_page,
                    'total_reports' => (int) $totalReports,
                    'total_pages' => (int) $totalPages,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in propertyReport: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
