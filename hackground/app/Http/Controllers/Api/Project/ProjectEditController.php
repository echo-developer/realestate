<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProjectEditController extends Controller
{
    protected $apimodel;

    public function __construct(ApiModel $ApiModel)
    {
        $this->apimodel = $ApiModel;
    }

    public function EditProject(Request $request)
    {

        try {
            $project = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'settings:project_id,project_budget,parking_availability,floor,carpet_area,super_area,total_units,project_furnish,project_type',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])
                ->where('id', $request->project_id)
                ->get();

            if (empty($project)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            $project = $project->toArray();

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
            }, $project);

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
