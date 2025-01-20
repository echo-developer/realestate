<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProjectDetailsController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }
    public function ProjectDetails($slug)
    {
        $project = \App\Models\PrefProject::where('slug', $slug)
            ->with([
                'settings:project_id,project_budget,parking_availability,floor,carpet_area,super_area,total_units,project_furnish,project_type',
                'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                'location:project_id,locality,city,address',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ])
            ->first();
        $project->uid = get_user_name($project->uid);

        if ($project->additional->project_amenity) {
            $projectAmenities = explode(',', $project->additional->project_amenity);
            $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
        }
        if ($project->location->city) {

            $project->location->city = get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en');
        }
        if ($project->additional->main_road_facing) {

            $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
        }
        if ($project->additional->possession_status) {

            $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en');
        }
    
        if ($project->settings->project_type) {

            $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en');
        }
        $projectData = $project->toArray();


        $flattenedData = array_merge(
            $projectData,
            $projectData['settings'] ?? [],
            $projectData['additional'] ?? [],
            $projectData['location'] ?? []
        );
        unset($flattenedData['settings']);
        unset($flattenedData['additional']);
        unset($flattenedData['location']);

        foreach ($flattenedData['gallery'] as &$gallery) {
            foreach ($gallery['images'] as &$image) {
                // Replace the filename with the full URL
                $image['file'] = asset('project_images/' . $image['filename']); 
                unset($image['filename']);
            }
        }
        // $project->settings->makeVisible('project_id');
        if (!$flattenedData) {
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'Project not found'
                ],
            );
        }

        return response()->json(
            [
                'status' => 1,
                'data' => $flattenedData,
                'message' => 'Project Seccessfully Fetched'
            ]
        );
    }
}
