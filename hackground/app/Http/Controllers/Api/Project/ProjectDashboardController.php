<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectAdditional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ProjectDashboardController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }

    // this function has beeen created to fix the malformed "[3","5","6]" amenity ids coming from database
    //  which has been used to fetch amenity details
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
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

        $projects = PrefProject::where([
            ['uid', $req->uid],
            ['status', $statusMapping[$type]],
            ['is_deleted', false]
        ])->with([
            'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
            'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
            'location:project_id,locality,city,address',
            'gallery:id,project_id,image_type',
            'gallery.images:gallary_id,filename,caption'
        ])->paginate($perPage, ['*'], 'page', $page);


        $formattedProjects = $projects->map(function ($project) {
            $project->uid = get_user_name($project->uid);

            if (isset($project->additional->project_amenity) && $project->additional->project_amenity) {
                // $projectAmenities = explode(',', $project->additional->project_amenity);
                $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($this->sanitizeAmenityIds($project->additional->project_amenity));
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
                            $image['file'] = asset('user_upload/project_images/' . $image['filename']);
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



    public function uploaodPrjBrochure(Request $request)
    {

        try {
            $project_brochure = $request->file('brochure_data');
            $project_id = $request->input('project_id');

            $fileName = "project_{$project_id}_" . $project_brochure->getClientOriginalName();

            $existingRecord = ProjectAdditional::where('project_id', $project_id)->first();

            if ($existingRecord) {

                $oldFile = $existingRecord->brochure_file;
                if ($oldFile && Storage::exists('public/project_brochure/' . $oldFile)) {
                    Storage::delete('public/project_brochure/' . $oldFile);
                }
            }

            $project_brochure->move(storage_path('app/public/project_brochure'), $fileName);
            $upload_file = ProjectAdditional::updateOrCreate(
                ['project_id' => $project_id],
                ['brochure_file' => $fileName]
            );
            return response()->json([
                'success' => 1,
                'message' => 'Brochure Uploaded'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function downloadprjBrochure(Request $request)
    {
        try {
            $project_id = $request->input('project_id');
            $brochure_file = ProjectAdditional::where('project_id', $project_id)->value('brochure_file');

            if ($brochure_file) {
               
                $filePath = storage_path('app/public/project_brochure/' . $brochure_file);

                
                if (file_exists($filePath)) {
                    return Response::download($filePath);
                }

                return response()->json([
                    'success' => 1,
                    'message' => 'File not found'
                ]);
            }

            return response()->json([
                'success' => 0,
                'message' => 'No brochure found for this project'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in downloadprjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
