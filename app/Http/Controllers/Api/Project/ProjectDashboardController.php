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
    $perPage = 1; // Number of items per page
    $type = $req->type; // Status type: pending, published, draft, expired
    $page = $req->page; // Page number for pagination

    // Define a mapping of type to status
    $statusMapping = [
        'pending' => 0,
        'published' => 1,
        'draft' => 2,
        'expired' => 3,
    ];

    // Check if the requested type is valid
    if (!isset($statusMapping[$type])) {
        return response()->json([
            'status' => 0,
            'message' => 'Invalid type provided',
        ], 400);
    }

    // Fetch projects based on the status
    $projects = PrefProject::where('uid', $req->uid)
        ->where('status', $statusMapping[$type])
        ->with([
            'settings:project_id,project_budget,parking_availability,floor,carpet_area,super_area,total_units,project_furnish,project_type',
            'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
            'location:project_id,locality,city,address',
            'gallery:id,project_id,image_type',
            'gallery.images:gallary_id,filename,caption'
        ])
        ->paginate($perPage, ['*'], 'page', $page); // Paginate with custom page number

    // Format each project in the collection
    $formattedProjects = $projects->map(function($project) {
        // Format the 'uid' field into the username
        $project->uid = get_user_name($project->uid);

        // Format project amenities
        if (isset($project->additional->project_amenity) && $project->additional->project_amenity) {
            $projectAmenities = explode(',', $project->additional->project_amenity);
            $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
        }

        // Format the city name
        if (isset($project->location->city)) {
            $project->location->city = get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en');
        }

        // Format the 'main_road_facing' field
        if (isset($project->additional->main_road_facing)) {
            $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
        }

        // Format the 'possession_status' field
        if (isset($project->additional->possession_status)) {
            $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en');
        }

        // Format the 'project_type' field
        if (isset($project->settings->project_type)) {
            $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en');
        }

        // Flatten the project data
        $projectData = $project->toArray();
        $flattenedData = array_merge(
            $projectData,
            $projectData['settings'] ?? [],
            $projectData['additional'] ?? [],
            $projectData['location'] ?? []
        );

        unset($flattenedData['settings'], $flattenedData['additional'], $flattenedData['location']);

        // Rename 'uid' to 'uname'
        if (isset($flattenedData['uid'])) {
            $flattenedData['uname'] = $flattenedData['uid'];
            unset($flattenedData['uid']);
        }

        // Handle gallery images and add full URL
        if (isset($flattenedData['gallery'])) {
            foreach ($flattenedData['gallery'] as &$gallery) {
                if (isset($gallery['images'])) {
                    foreach ($gallery['images'] as &$image) {
                        // Replace the filename with the full URL
                        $image['file'] = asset('project_images/' . $image['filename']);
                        unset($image['filename']);
                    }
                }
            }
        }

        // Return the formatted data
        return $flattenedData;
    });

    // Format the response
    return response()->json([
        'status' => 1,
        'message' => ucfirst($type) . ' projects successfully fetched',
        'data' => $formattedProjects, // Return the formatted data only
        'pagination' => [
            'current_page' => $projects->currentPage(),
            'last_page' => $projects->lastPage(),
            'total' => $projects->total(),
            'per_page' => $projects->perPage(),
        ],
    ]);
}

    
    private function formatResponse($projects)
    {
        return [
            'current_page' => $projects->currentPage(),
            'total' => $projects->total(),
            'per_page' => $projects->perPage(),
            'data' => $projects->items(), 
        ];
    }
    
}
