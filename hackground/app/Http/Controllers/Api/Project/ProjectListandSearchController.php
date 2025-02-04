<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\ProjectFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectListandSearchController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }

    public function getSearchedProjects(Request $req)
    {
        log::info($req);
        $currentpage = (int) $req->input('currentpage', 1);
        $limit = (int) $req->input('limit', 10);
        $offset = ($currentpage - 1) * $limit;

        $user_id = $req->user_id ?? null;

        try {

            $filters = array_filter([
                "city_id" => $req->input('city_id'),
                "address" => $req->input('address'),
                "project_name" => $req->input('project_name'),
                "project_type" => $req->input('project_type'),
                "project_for" => $req->input('project_for'),
                "project_status" => $req->input('project_status'),
                "min_budget" => $req->input('min_budget'),
                "max_budget" => $req->input('max_budget'),
            ]);


            $searchResults = $this->apiModel->searchProject($filters);


            if ($searchResults->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            $customArray = $searchResults->map(function ($project) use ($user_id) {

                $is_fav =  !empty($user_id) && ProjectFavorite::where([
                    'uid' => $user_id,
                    'project_id' => $project->id,
                ])->value('status') == config('constants.STATUS_ACTIVE');


                return [
                    'id' => $project->id,
                    'is_fav' => $is_fav,
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
                    'project_size' => $project->settings->total_area ?? null,
                    'occupied_area' => $project->settings->occupied_area ?? null,
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
            });


            $sortKey = $req->input('sort_key', 'created_at');
            $sortOrder = strtolower($req->input('sort_order', 'desc'));


            if ($customArray->isNotEmpty() && array_key_exists($sortKey, $customArray->first())) {
                $customArray = $sortOrder === 'desc'
                    ? $customArray->sortByDesc($sortKey)
                    : $customArray->sortBy($sortKey);
            }


            $totalProperties = $customArray->count();
            $totalPages = ceil($totalProperties / $limit);


            $searchedProperties = $customArray->slice($offset, $limit)->values();


            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => [
                    'searched_properties' => $searchedProperties,
                    'pagination' => [
                        'total_properties' => $totalProperties,
                        'total_pages' => $totalPages,
                        'current_page' => $currentpage,
                    ],
                ],
            ]);
        } catch (\Exception $e) {

            Log::error('Error in getSearchedProjects: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong. Please try again later.',
            ]);
        }
    }
}
