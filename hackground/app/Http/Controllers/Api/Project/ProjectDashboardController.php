<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectAdditional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type',
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
                'total_pages' => $projects->lastPage(),
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


            $uploadPath = public_path('user_upload/project_brochure');


            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }


            $existingRecord = ProjectAdditional::where('project_id', $project_id)->first();
            if ($existingRecord) {
                $oldFile = $existingRecord->brochure_file;
                $oldFilePath = public_path("user_upload/project_brochure/{$oldFile}");
                if ($oldFile && file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }

            $project_brochure->move($uploadPath, $fileName);

            ProjectAdditional::updateOrCreate(
                ['project_id' => $project_id],
                ['brochure_file' => $fileName]
            );

            return response()->json([
                'success' => 1,
                'message' => 'Brochure Uploaded',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function AddExtraProjectDetails(Request $request)
    {

        try {
            // log::info($request->all());
            if (empty($request->project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Project Id not found',
                ]);
            }
            $this->UpdateAdditionalData($request);
            $this->UpdateProjectLandmarks($request);

            return response()->json([
                'status' => 1,
                'message' => 'Project Updated successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function UpdateAdditionalData($req)
    {
        try {
            $datatoupdate = [];

            $fieldsMap = [
                'overlooking'        => 'overlooking',
                'flooring_style'     => 'flooring_style',
                'water_available'    => 'water_availability',
                'electric_availability' => 'electric_availability',
                'type_of_ownership'     => 'type_of_ownership',
                'instruction'        => 'instruction',
                'approved_by' => 'approved_by',
            ];

            foreach ($fieldsMap as $requestKey => $dbColumn) {
                if ($req->has($requestKey)) {
                    $datatoupdate[$dbColumn] = $req->$requestKey;
                }
            }

            if (!empty($req->project_id) && !empty($datatoupdate)) {
                ProjectAdditional::where('project_id', $req->project_id)->update($datatoupdate);
            }
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function UpdateProjectLandmarks($req)
    {
        try {
            $project_id = $req->project_id;
            $landmarks = json_decode($req->landmarks, true);

            if (isset($landmarks)) {

                $existing_landmarks_types = DB::table('pref_project_landmarks')
                    ->where('project_id', $project_id)
                    ->pluck('landmark_type')
                    ->toArray();


                $removed_landmarks_types = array_diff($existing_landmarks_types, array_keys($landmarks));


                if (count($removed_landmarks_types) > 0) {
                    DB::table('pref_project_landmarks')
                        ->where('project_id', $project_id)
                        ->whereIn('landmark_type', $removed_landmarks_types)
                        ->delete();
                }


                foreach ($landmarks as $landmark_type => $landmark_details) {

                    $landmark_count = count($landmark_details);


                    foreach ($landmark_details as $item) {
                        $landmark_details_string = [
                            'name' => $item['name'] ?? null,
                            'distance' => $item['distance'] ?? null,
                        ];

                        $existingLandmark = DB::table('pref_project_landmarks')
                            ->where('project_id', $project_id)
                            ->where('landmark_type', $item['key']);

                        if ($existingLandmark->exists()) {

                            $update = $existingLandmark->update([
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ]);
                        } else {

                            $data = [
                                'project_id' => $project_id,
                                'landmark_type' => $item['key'],
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ];
                            $insert = DB::table('pref_project_landmarks')->insert($data);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function ExtraFileddetails(Request $request)
    {
        try {

            if (empty($request->project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Project Id not found',
                ]);
            }
            $project = PrefProject::where('id', $request->project_id)
                ->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'additional',
                    'landmarks',
                ])
                ->first();

            if (!$project) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }


            $formattedLandmarks = [];
            foreach ($project->landmarks as $landmark) {
                $baseKey = preg_replace('/\d+$/', '', $landmark->landmark_type);
                $details = json_decode($landmark->landmark_details, true) ?? [];
                $details[$baseKey . '_count'] = $landmark->landmark_type_count;
                $formattedLandmarks[$baseKey][] = array_merge(['key' => $landmark->landmark_type], $details);
            }


            $projectData = $project->toArray();

            $flattened = array_merge(
                $projectData,
                $projectData['additional'] ?? [],
            );

            foreach (['overlooking', 'flooring_style'] as $key) {
                if (isset($flattened[$key]) && is_string($flattened[$key])) {
                    $flattened[$key] = json_decode($flattened[$key], true);
                }
            }
            $flattened['landmarks'] = $formattedLandmarks;

            $allowedKeys = ['id', 'landmarks', 'overlooking', 'flooring_style', 'water_availability', 'electric_availability', 'type_of_ownership', 'instruction', 'approved_by'];
            $filteredArray = array_intersect_key($flattened, array_flip($allowedKeys));

            // log::info($flattened);
            return response()->json([
                'status' => 1,
                'message' => 'Data retrived successfully',
                'data' => $filteredArray,
            ]);
        } catch (\Exception $e) {
            LOG::info($e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to update property',
                'error' => $e->getMessage()
            ]);
        }
    }
}
