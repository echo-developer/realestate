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
                    'settings:project_id,project_budget,parking_availability,floor,carpet_area,super_area,total_units,project_furnish,project_type',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])->get();

            // $allProjects->uid = get_user_name($allProjects->uid);

            // if (isset($project->additional->project_amenity)) {
            //     if ($project->additional->project_amenity) {
            //         $projectAmenities = explode(',', $project->additional->project_amenity);
            //         $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
            //     }
            // }

            // if ($allProjects->location->city) {

            //     $allProjects->location->city = get_name_by_id('pref_city_names', 'city_id', $allProjects->location->city, 'en');
            // }

            // if (isset($project->additional->project_amenity)) {
            //     if ($project->additional->main_road_facing) {

            //         $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
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
                unset($flattened['settings'], $flattened['additional'], $flattened['location']);

                $flattened['uid'] = get_user_name($flattened['uid']) ?? null;

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
}
