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
        $project_id = extractProjectIdFromSlug($slug);
        $project = \App\Models\PrefProject::where([
            ['id', '=', $project_id],
            ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
        ])
            ->with([
                'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                'location:project_id,locality,city,address',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ])
            ->first();
        if ($project) {
            $project->increment('views');
            if ($project->views >= 10) {
                $project->is_popular = 1;
                $project->save();
            }
        }
        $project->uid = get_user_name($project->uid);
        if (isset($project->additional->project_amenity)) {
            if ($project->additional->project_amenity) {
                $projectAmenities = explode(',', $project->additional->project_amenity);
                $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
            }
        }
        if ($project->location->city) {

            $project->location->city = get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en');
        }
        if (isset($project->additional->main_road_facing)) {
            if ($project->additional->main_road_facing) {

                $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
            }
        }
        if (isset($project->additional->possession_status)) {
            if ($project->additional->possession_status) {

                $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status, 'en');
            }
        }
        if (isset($project->settings->project_type)) {
            if ($project->settings->project_type) {

                $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en');
            }
        }
        if (isset($project->settings->project_furnish)) {
            if ($project->settings->project_furnish) {

                $project->settings->project_furnish = get_name_by_id('pref_property_furnish_names', 'furnish_id', $project->settings->project_furnish, 'en');
            }
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

        if (isset($flattenedData['uid'])) {
            $flattenedData['uname'] = $flattenedData['uid'];
            unset($flattenedData['uid']);
        }

        if (!empty($flattenedData['project_budget'])) {
            $budgetRange = explode('-', $flattenedData['project_budget']);
            $flattenedData['minBudget'] =  isset($budgetRange[0]) ? (int)$budgetRange[0] : null;
            $flattenedData['maxBudget'] =  isset($budgetRange[1]) ? (int)$budgetRange[1] : null;
        }

        foreach ($flattenedData['gallery'] as &$gallery) {
            foreach ($gallery['images'] as &$image) {
                // Replace the filename with the full URL
                $image['file'] = asset('user_upload/project_images/' . $image['filename']);
                unset($image['filename']);
            }
        }
        // $flattenedData = array_merge(
        //     ["id" => $flattenedData['id'], "uname" => $flattenedData['uname']],
        //     array_diff_key($flattenedData, ["id" => '', "uname" => ''])
        // );
        // $project->settings->makeVisible('project_id');

        $properties = \App\Models\PrefProperty::whereHas('projectMapping', function ($query) use ($project_id) {
            $query->where('project_id', $project_id);
        })
            ->with([
                'gallery',
                'gallery.images'
            ])
            ->get();
        
        // **Prepare Properties by Extracting Data and Categorizing by BHK Type**
        $propertyData = [];
        foreach ($properties as $property) {
            // Extract data from the associated 'additional', 'settings', and 'location' relationships
            $additional = $property->additional;
            $settings = $property->settings;
            $location = $property->location;
        
            // Extracted data from relationships
            $propertyData['project_properties'][] = [
                'id' => $property->id,
                'uid' => $property->uid,
                'slug' => $property->slug,
                'name' => $property->name,
                'status' => $property->status,
                'is_featured' => $property->is_featured,
                'is_populer' => $property->is_populer,
                'is_top' => $property->is_top,
                'is_favorite' => $property->is_favorite?true:false,
                'post_for'=>$settings->post_for,
                'is_under_project' => $property->is_under_project,
                'created_at' => $property->created_at,
                'bhk_type' => $additional->bhk_type ?? 'other',
                'facing_direction' => $additional->facing_direction,
                'carpet_area' => $settings->carpet_area,
                'super_area' => $settings->super_area,
                'expected_price' => $settings->expected_price,
                'property_address' => $location->property_address,
                'gallery' => $property->gallery
            ];
        }
        
        // **Categorize Properties by BHK Type**
        $categorizedProperties = [];
        foreach ($propertyData['project_properties'] as $property) {
            $post_for = $property['post_for'] ?? 'buy'; 
            $bhkType = $property['bhk_type'] ?? 'other'; 
            $categorizedProperties[$post_for][$bhkType][] = $property;
        }
        
        // Add categorized properties to response
        $flattenedData['project_properties'] = $categorizedProperties;
        

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
