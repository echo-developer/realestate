<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProjectDashboardController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }


    public function GetProject(Request $req)
{
    $perPage = 10; 
    $type = $req->type; 
    $page = $req->page; 


    $statusMapping = [
        'pending' => 0,
        'published' => 1,
        'draft' => 2,
        'expired' => 3,
    ];


    if (!isset($statusMapping[$type])) {
        return response()->json([
            'status' => 0,
            'message' => 'Invalid type provided',
        ], 400);
    }

    $projects = PrefProject::where('uid', $req->uid)
        ->where('status', $statusMapping[$type])
        ->with([
            'settings:project_id,project_budget,parking_availability,floor,carpet_area,super_area,total_units,project_furnish,project_type',
            'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
            'location:project_id,locality,city,address',
            'gallery:id,project_id,image_type',
            'gallery.images:gallary_id,filename,caption'
        ])
        ->paginate($perPage, ['*'], 'page', $page); 


    $formattedProjects = $projects->map(function($project) {
        $project->uid = get_user_name($project->uid);

        if (isset($project->additional->project_amenity) && $project->additional->project_amenity) {
            $projectAmenities = explode(',', $project->additional->project_amenity);
            $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
        }

        if (isset($project->location->city)) {
            $project->location->city = get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en');
        }

        if (isset($project->additional->main_road_facing)) {
            $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
        }

        if (isset($project->additional->possession_status)) {
            $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en');
        }

        if (isset($project->settings->project_type)) {
            $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en');
        }

        $projectData = $project->toArray();
        $flattenedData = array_merge(
            $projectData,
            $projectData['settings'] ?? [],
            $projectData['additional'] ?? [],
            $projectData['location'] ?? []
        );

        unset($flattenedData['settings'], $flattenedData['additional'], $flattenedData['location']);

        if (isset($flattenedData['uid'])) {
            $flattenedData['uname'] = $flattenedData['uid'];
            unset($flattenedData['uid']);
        }

        if (isset($flattenedData['gallery'])) {
            foreach ($flattenedData['gallery'] as &$gallery) {
                if (isset($gallery['images'])) {
                    foreach ($gallery['images'] as &$image) {
                        $image['file'] = asset('project_images/' . $image['filename']);
                        unset($image['filename']);
                    }
                }
            }
        }

   
        return $flattenedData;
    });

    return response()->json([
        'status' => 1,
        'message' => ucfirst($type) . ' projects successfully fetched',
        'data' => $formattedProjects, 
        'pagination' => [
            'current_page' => $projects->currentPage(),
            'last_page' => $projects->lastPage(),
            'total' => $projects->total(),
            'per_page' => $projects->perPage(),
        ],
    ]);
}
}
