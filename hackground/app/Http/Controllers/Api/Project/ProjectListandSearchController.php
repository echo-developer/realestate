<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectListandSearchController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }
    public function projectListing()
    {
        try {
            $allProjects = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])->get();

            if (empty($allProjects)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }



            // if (isset($project->additional->project_amenity)) {
            //     if ($project->additional->project_amenity) {
            //         $projectAmenities = explode(',', $project->additional->project_amenity);
            //         $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
            //     }
            // }

            // if (isset($project->additional->possession_status)) {
            //     if ($project->additional->possession_status) {

            //         $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en');
            //     }
            // }

            // if (isset($project->settings->project_type)) {
            //     if ($project->settings->project_type) {

            //         $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en');
            //     }
            // }

            $allProjects = $allProjects->toArray();

            $customArray = array_map(function ($project) {
                $flattened = array_merge(
                    $project,
                    $project['settings'] ?? [],
                    $project['additional'] ?? [],
                    $project['location'] ?? []
                );

                $flattened['uname'] = get_user_name($flattened['uid']) ?? null;
                $flattened['main_road_facing'] = $flattened['main_road_facing'] === 'Y' ? 'Yes' : 'No' ?? null;
                $flattened['city'] = get_name_by_id('pref_city_names', 'city_id', $flattened['city'], 'en') ?? null;

                foreach ($flattened['gallery'] as &$gallery) {
                    foreach ($gallery['images'] as &$image) {
                        // Replace the filename with the full URL
                        $image['file'] = asset('user_upload/project_images/' . $image['filename']);
                        unset($image['filename']);
                    }
                }

                unset($flattened['settings'], $flattened['additional'], $flattened['location'], $flattened['uid']);


                return $flattened;
            }, $allProjects);

            return response()->json([
                'status' => 1,
                'message' => 'data retrived successfully.',
                'data' => $customArray,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ProjectEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function getSearchedprojects(Request $req)
    {
        try {
            $filters = [
                "city_id" => $req->city_id,
                "address" => $req->address,
                "project_name" => $req->project_name,
                "project_type" => $req->project_type,
                "project_for" => $req->project_for,
                "project_status" => $req->project_status,
                "min_budget" => $req->min_budget,
                "max_budget" => $req->max_budget,
            ];

            $searchresult = ($this->apiModel->searchProject($filters))->values();

            // Log::info('abxdd'.json_encode($searchresult,JSON_PRETTY_PRINT));

            if (empty($searchresult)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }
            $customArray = $searchresult->map(function ($project) {
                $flattened = [
                    'id' => $project->id,
                    'project_name' => $project->project_name,
                    'slug' => $project->slug,
                    'project_desc' => $project->project_desc,
                    'status' => $project->status,
                    'is_deleted' => $project->is_deleted,
                    'is_featured' => $project->is_featured,
                    'views' => $project->views,
                    'is_popular' => $project->is_popular,
                    'created_at' => $project->created_at->toISOString(),
                    'gallery' => $project->gallery->map(function ($gallery) {
                        return [
                            'id' => $gallery->id,
                            'image_type' => $gallery->image_type,
                            'images' => $gallery->images->map(function ($image) {
                                return [
                                    'caption' => $image->caption,
                                    'file' => asset('user_upload/project_images/' . $image->filename),
                                ];
                            }),
                        ];
                    }),
                    'project_budget' => $project->settings->project_budget ?? null,
                    'parking_availability' => $project->settings->parking_availability ?? null,
                    'floor' => $project->settings->floor ?? null,
                    'carpet_area' => $project->settings->carpet_area ?? null,
                    'super_area' => $project->settings->super_area ?? null,
                    'total_units' => $project->settings->total_units ?? null,
                    'project_furnish' => $project->settings->project_furnish ?? null,
                    'project_type' => $project->settings->project_type ?? null,
                    'main_road_facing' => $project->additional->main_road_facing ?? null,
                    'project_amenity' => json_decode($project->additional->project_amenity ?? '[]'),
                    'possession_status' => $project->additional->possession_status ?? null,
                    'currency' => $project->additional->currency ?? null,
                    'token_amount' => $project->additional->token_amount ?? null,
                    'expected_price' => $project->additional->expected_price ?? null,
                    'developer_details' => $project->additional->developer_details ?? null,
                    'developer_name' => $project->additional->developer_name ?? null,
                    'locality' => $project->location->locality ?? null,
                    'city' => $project->location->city ?? null,
                    'address' => $project->location->address ?? null,
                    'uname' => get_user_name($project->uid) ?? null,
                ];
    
                return $flattened;
            });
            // Log::info('result' . json_encode($customArray, JSON_PRETTY_PRINT));


            return response()->json([
                'status' => 1,
                'message' => 'data retrived successfully.',
                'data' => $customArray,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ProjectEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
