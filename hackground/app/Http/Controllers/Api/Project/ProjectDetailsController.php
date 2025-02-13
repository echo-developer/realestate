<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\FloorPlan;
use App\Models\PrefFloorPlanType;
use App\Models\PrefFloorPlanValue;
use App\Models\PrefProject;
use App\Models\PrefProperty;
use App\Models\ProjectFavorite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectDetailsController extends Controller
{

    protected $apiModel;
    protected $project_type;

    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
    }
    public function ProjectDetails($slug)
    {
        try {
            $project_id = extractProjectIdFromSlug($slug);

            $project = \App\Models\PrefProject::where([
                ['id', '=', $project_id],
                ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
            ])
                ->with([
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address,longitude,latitude',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])
                ->first();

            if (!$project) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Project not found'
                ]);
            }

            // Increment views and update popularity
            $project->increment('views');
            if ($project->views >= 10 && !$project->is_popular) {
                $project->is_popular = 1;
                $project->save();
            }
            $this->project_type = $project->settings->project_type;
            $project->location->city = isset($project->location->city) ? get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en') : null;
            $project->additional->main_road_facing = isset($project->additional->main_road_facing) && $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
            $project->additional->possession_status = isset($project->additional->possession_status) ? get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en') : null;
            $project->settings->project_type = isset($project->settings->project_type) ? get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en') : null;
            $project->settings->project_furnish = isset($project->settings->project_furnish) ? get_name_by_id('pref_property_furnish_names', 'furnish_id', $project->settings->project_furnish, 'en') : null;


            $amenityArray = [];

            if (!empty($project->additional->project_amenity)) {

                $projectAmenities = $this->sanitizeAmenityIds($project->additional->project_amenity);


                $getAmenities = $this->apiModel->getPropertyAmnitybyID($projectAmenities);


                $amenityArray = $getAmenities->pluck('amenity_name')->toArray();
            }


            $project->additional->project_amenity = $amenityArray;


            $projectData = $project->toArray();
            $flattenedData = array_merge(
                $projectData,
                $projectData['settings'] ?? [],
                $projectData['additional'] ?? [],
                $projectData['location'] ?? []
            );
            unset($flattenedData['settings'], $flattenedData['additional'], $flattenedData['location']);

            // Fetching user details from uid

            $userDetails = User::find($flattenedData['uid']);
            $userDetails->image = asset('profile_image/' .  $userDetails->image) ?? null;
            $flattenedData['user_details'] = $userDetails ?? null;
            unset($flattenedData['uid']);

            // Process budget
            if (!empty($flattenedData['project_budget'])) {
                $budgetRange = explode('-', $flattenedData['project_budget']);
                $flattenedData['minBudget'] = isset($budgetRange[0]) ? (int)$budgetRange[0] : null;
                $flattenedData['maxBudget'] = isset($budgetRange[1]) ? (int)$budgetRange[1] : null;
            }

            // Process gallery images safely
            if (!empty($flattenedData['gallery'])) {
                foreach ($flattenedData['gallery'] as &$gallery) {
                    if (!empty($gallery['images'])) {
                        foreach ($gallery['images'] as &$image) {
                            $image['file'] = asset('user_upload/project_images/' . ($image['filename'] ?? ''));
                            unset($image['filename']);
                        }
                    }
                }
            }

            // Fetch related properties safely
            $properties = \App\Models\PrefProperty::whereHas('projectMapping', function ($query) use ($project_id) {
                $query->where('project_id', $project_id);
            })
                ->where('pref_properties.status', '=', config('constants.STATUS_ACTIVE'))
                ->where('pref_properties.is_deleted', '=', false)
                ->with(['gallery', 'gallery.images'])
                ->get();

            $flattenedData['project_properties'] = [];

            if ($properties->isNotEmpty()) {
                $categorizedProperties = [];

                foreach ($properties as $property) {
                    // Default property data
                    $propertyData = [
                        'id' => $property->id,
                        'uid' => $property->uid,
                        'slug' => $property->slug,
                        'name' => $property->name,
                        'status' => $property->status,
                        'is_featured' => $property->is_featured,
                        'is_populer' => $property->is_populer,
                        'is_top' => $property->is_top,
                        'is_favorite' => (bool) $property->is_favorite,
                        'post_for' => $property->settings->post_for ?? 'buy',
                        'is_under_project' => $property->is_under_project,
                        'created_at' => $property->created_at,
                        'bhk_type' => $property->additional->bhk_type ?? 'other',
                        'facing_direction' => $property->additional->facing_direction ?? null,
                        'carpet_area' => $property->settings->carpet_area ?? null,
                        'super_area' => $property->settings->super_area ?? null,
                        'expected_price' => $property->settings->expected_price ?? null,
                        'property_address' => $property->location->property_address ?? null,
                    ];

                    // Add gallery with 'file' key for each image
                    $propertyData['gallery'] = processProjectGallery($property->gallery);


                    // Categorize by post type (buy/rent) and BHK type
                    $postFor = $propertyData['post_for'];
                    $bhkType = $propertyData['bhk_type'];

                    // Organize properties under post type and bhk type
                    $categorizedProperties[$postFor][$bhkType][] = $propertyData;
                }

                // Assign categorized properties
                $flattenedData['project_properties'] = $categorizedProperties;
            }

            // Fetch Nearby Projects (within 5 km)
            $nearbyProjects = \App\Models\PrefProject::with('settings', 'additional', 'gallery', 'gallery.images')
                ->join('pref_project_location', 'pref_project_location.project_id', '=', 'pref_project.id')
                ->whereNotNull('pref_project_location.latitude')
                ->whereNotNull('pref_project_location.longitude')
                ->where('pref_project.id', '!=', $project_id)
                ->where('pref_project.is_deleted', '=', false)
                ->where('pref_project.status', '=', config('constants.STATUS_ACTIVE'))
                ->whereRaw("(
                6371 * acos(
                    cos(radians(?)) * cos(radians(pref_project_location.latitude)) * cos(radians(pref_project_location.longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(pref_project_location.latitude))
                )
            ) < 5", [
                    $project->location->latitude,
                    $project->location->longitude,
                    $project->location->latitude
                ])->get();

            // Flatten nearby projects
            $flattenedNearbyProjects = $nearbyProjects->map(function ($nearbyProject) {
                $is_fav = !empty($user_id) && ProjectFavorite::where([
                    'uid' => $nearbyProject->uid,
                    'project_id' => $nearbyProject->id,
                ])->value('status') == config('constants.STATUS_ACTIVE');

                return [
                    'id' => $nearbyProject->id,
                    'project_name' => $nearbyProject->project_name,
                    'slug' => $nearbyProject->slug,
                    'address' => $nearbyProject->location->address,
                    'possession_status' => isset($nearbyProject->additional->possession_status) ?
                        get_name_by_id('pref_property_status_names', 'status_id', $nearbyProject->additional->possession_status, 'en') : null,
                    'project_is_featured' => $nearbyProject->is_featured,
                    'project_views' => $nearbyProject->views,
                    'project_is_popular' => $nearbyProject->is_popular,
                    'created_at' => $nearbyProject->created_at,
                    'is_fav' => $is_fav,
                    'gallery' => processProjectGallery($nearbyProject->gallery)
                ];
            });

            // Fetch Similar Projects (same category)
            $similarProjects = \App\Models\PrefProject::where('pref_project.id', '!=', $project_id)
                ->with('location', 'settings', 'additional', 'gallery', 'gallery.images')
                ->whereHas('settings', function ($query) use ($project) {
                    $query->where('project_type',  $this->project_type);
                })
                ->where('pref_project.is_deleted', '=', false)
                ->where('pref_project.status', '=', config('constants.STATUS_ACTIVE'))
                ->limit(10);


            $similarProjects = $similarProjects->get();

            // Flatten similar projects
            $flattenedSimilarProjects = $similarProjects->map(function ($similarProject) {
                $is_fav =  !empty($user_id) && ProjectFavorite::where([
                    'uid' => $similarProject->uid,
                    'project_id' => $similarProject->id,
                ])->value('status') == config('constants.STATUS_ACTIVE');
                return [
                    'id' => $similarProject->id,
                    'project_name' => $similarProject->project_name,
                    'slug' => $similarProject->slug,
                    'address' => $similarProject->location->address,
                    'possession_status' => isset($similarProject->additional->possession_status) ? get_name_by_id('pref_property_status_names', 'status_id', $similarProject->additional->possession_status, 'en') : null,
                    'project_is_featured' => $similarProject->is_featured,
                    'project_views' => $similarProject->views,
                    'project_is_popular' => $similarProject->is_popular,
                    'created_at' => $similarProject->created_at,
                    'is_fav' => $is_fav,
                    'gallery' => processProjectGallery($similarProject->gallery)
                ];
            });


            // Fetch Other Projects by the same Developer
            $otherProjects = \App\Models\PrefProject::where('id', '!=', $project_id)->with('location', 'settings', 'additional', 'gallery', 'gallery.images')
                ->whereHas('additional', function ($query) use ($project) {
                    $query->where('developer_name', $project->additional->developer_name);
                })
                ->where('pref_project.is_deleted', '=', false)
                ->where('pref_project.status', '=', config('constants.STATUS_ACTIVE'))
                ->limit(10)
                ->get();

            // Flatten other projects
            $flattenedOtherProjects = $otherProjects->map(function ($otherProject) {

                $is_fav =  !empty($user_id) && ProjectFavorite::where([
                    'uid' => $otherProject->uid,
                    'project_id' => $otherProject->id,
                ])->value('status') == config('constants.STATUS_ACTIVE');
                return [
                    'id' => $otherProject->id,
                    'project_name' => $otherProject->project_name,
                    'slug' => $otherProject->slug,
                    'address' => $otherProject->location->address,
                    'possession_status' => isset($otherProject->additional->possession_status) ? get_name_by_id('pref_property_status_names', 'status_id', $otherProject->additional->possession_status, 'en') : null,
                    'project_is_featured' => $otherProject->is_featured,
                    'project_views' => $otherProject->views,
                    'project_is_popular' => $otherProject->is_popular,
                    'created_at' => $otherProject->created_at,
                    'is_fav' => $is_fav,
                    'gallery' =>  processProjectGallery($otherProject->gallery)
                ];
            });
            $lang = 'en';

            // Retrieve all floor plan types with associated names
            $allFloorPlanTypes = PrefFloorPlanType::where('status', true)
                ->with(['names' => function ($query) use ($lang) {
                    $query->where('lang', $lang);
                }])
                ->get();

            // Retrieve all floor plans with associated names
            $floorPlans = FloorPlan::where('status', true)
                ->with(['names' => function ($query) use ($lang) {
                    $query->where('lang', $lang);
                }])
                ->get();

            // Initialize an array to store merged results
            $mergedFloorPlans = [];

            // Loop through each floor plan type and correctly group items under their type
            foreach ($allFloorPlanTypes as $type) {
                $typeName = $type->names->first()->type ?? null;

                // Filter only floor plans that belong to the current type
                $filteredPlans = $floorPlans->filter(function ($plan) use ($type, $project_id) {
                    return $plan->fp_type == $type->id; // Ensure correct grouping
                })->map(function ($plan) use ($project_id) {
                    // Fetch additional values if available
                    $additionalValues = PrefFloorPlanValue::where('fp_id', $plan->id)
                        ->where('project_id', $project_id)
                        ->first();

                    $description = $additionalValues ? $additionalValues->desc : $plan->description;

                    return !empty($description) ? [ // Ensure valid description
                        'item_id' => $plan->id,
                        'item' => $plan->names->first()->item ?? null,
                        'type_id' => $plan->fp_type,
                        'description' => $description,
                    ] : null; // Exclude null descriptions
                })->filter()->values(); // Remove null items and reset array keys

                // Store result (even if items are empty)
                $mergedFloorPlans[] = [
                    'id' => $type->id,
                    'slug' => $type->slug,
                    'name' => $typeName,
                    'items' => $filteredPlans,
                ];
            }

            $flattenedData['floor_plans'] = $mergedFloorPlans;

            // Add Nearby, Similar, and Other Projects to the main data
            $flattenedData['nearby_projects'] = $flattenedNearbyProjects;
            $flattenedData['similar_projects'] = $flattenedSimilarProjects;
            $flattenedData['other_projects'] = $flattenedOtherProjects;

            // all reviews  ---by arsad
            $property_review = DB::table('pref_project_reviews')
                ->leftJoin('project_review_additional', 'pref_project_reviews.id', '=', 'project_review_additional.review_id')
                ->select(
                    'user_id',
                    'project_id',
                    'overall_rating',
                    'created_at',
                    'updated_at',
                    'review_id',
                    'review_title',
                    'review_description',
                    'user_relation'
                )->where(['pref_project_reviews.project_id' => $project_id])
                ->get()
                ->sortByDesc('overall_rating');

            $total_count = $property_review->count();
            $average_rating = round($property_review->avg('overall_rating'), 1);


            $property_review->map(function ($items) {

                $items->name = get_user_name($items->user_id ?? null);
                unset($items->user_id);
                return $items;
            });

            $flattenedData['project_reviews'] = [
                'rating' => $average_rating,
                'total_reviews' => $total_count,
                'reviews' => $property_review,
            ];

            return response()->json([
                'status' => 1,
                'data' => $flattenedData,
                'message' => 'Project Successfully Fetched'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong!',
                'error' => $th->getMessage()
            ]);
        }
    }

    public function post_project_review(Request $request)
    {

        try {

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
            $rateKeys['project_id'] = $otherKeys['project_id'] ?? null;

            unset($otherKeys['user_id'], $otherKeys['project_id']);

            $insertOrUpdate = $this->apiModel->UpdateInsertReviewsforProject($rateKeys, $otherKeys);

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


    public function get_project_review(Request $request)
    {

        try {
            $user_id = $request->input('user_id');
            if (!empty($user_id)) {

                $prop_reviews = getTableData(
                    'pref_project_reviews',
                    ['user_id', 'project_id', 'overall_rating', 'created_at', 'updated_at', 'review_id', 'review_title', 'review_description', 'user_relation'],
                    [
                        [
                            'table' => 'project_review_additional',
                            'base_field' => 'pref_project_reviews.id',
                            'operator' => '=',
                            'foreign_field' => 'project_review_additional.review_id',
                        ]
                    ],
                    ['pref_project_reviews.user_id' => $user_id],
                    null
                );

                $prop_reviews->map(function ($items) {
                    $items->user_name = get_user_name($items->user_id ?? null);
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
