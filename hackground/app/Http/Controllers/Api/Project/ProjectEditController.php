<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\ProjectAdditional;
use App\Models\ProjectLocation;
use App\Models\ProjectSetting;
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

    // this function has beeen created to fix the malformed "[3","5","6]" amenity ids coming from database
    //  which has been used to fetch amenity details
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
    }

    public function editProject(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');


            $project = PrefProject::where('id', $request->project_id)
                ->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'settings',
                    'additional',
                    'location',
                    'gallery.images',
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


            if (!empty($project->additional->project_amenity)) {
                $project->additional->project_amenity = $this->apimodel->getPropertyAmnitybyID(
                    $this->sanitizeAmenityIds($project->additional->project_amenity)
                );
            }


            $options = [
                'all_furnish' => $this->apimodel->getFurnish($lang),
            ];


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
                $projectData['settings'] ?? [],
                $projectData['additional'] ?? [],
                $projectData['location'] ?? []
            );


            if (!empty($flattened['possesion_month_possesion_year'])) {
                $parts = explode('-', $flattened['possesion_month_possesion_year']);
                $flattened['possesion_month'] = (count($parts) === 2 || strlen($parts[0]) !== 4) ? $parts[0] : null;
                $flattened['possesion_year'] = (count($parts) === 2 || strlen($parts[0]) === 4) ? end($parts) : null;
            }


            $parkingMapping = ['AV' => 'av', 'NA' => 'na', 'UC' => 'uc'];
            $flattened['parking_availability'] = $parkingMapping[$flattened['parking_availability']] ?? null;


            foreach (['overlooking', 'flooring_style'] as $key) {
                if (isset($flattened[$key]) && is_string($flattened[$key])) {
                    $flattened[$key] = json_decode($flattened[$key], true);
                }
            }

            $flattened['uname'] = get_user_name($flattened['uid'] ?? null);
            $flattened['main_road_facing'] = isset($flattened['main_road_facing']) && $flattened['main_road_facing'] === 'Y' ? 'Yes' : 'No';
            $flattened['city'] = get_name_by_id('city_names', 'city_id', $flattened['city'], 'en');
            $flattened['landmarks'] = $formattedLandmarks;

            if (!empty($flattened['gallery'])) {
                foreach ($flattened['gallery'] as &$gallery) {
                    foreach ($gallery['images'] as &$image) {
                        $image['file'] = asset('user_upload/project_images/' . $image['filename']);
                        unset($image['filename']);
                    }
                }
            }
            unset($flattened['settings'], $flattened['additional'], $flattened['location'], $flattened['uid'], $flattened['possesion_month_possesion_year']);

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $flattened,
                'options' => $options,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function Updateproject(Request $request)
    {

        try {

            $this->Updateaddress($request);
            $this->UpdateAdditionalData($request);
            $this->UpdateSettingData($request);
            $this->UpdateProjectMaintable($request);
            $this->UpdateProjectLandmarks($request);


            return response()->json([
                'status' => 1,
                'message' => 'Project Updated successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function Updateaddress($req)
    {
        try {

            $datatoupdate = [];

            if ($req->has('address')) {
                $datatoupdate['address'] = $req->address;
            }

            if ($req->has('locality')) {
                $datatoupdate['locality'] = $req->locality;
            }

            DB::table('project_location')->where('project_id', $req->project_id)->update($datatoupdate);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function UpdateProjectMaintable($req)
    {
        // Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        try {

            $datatoupdate = [];
            if ($req->has('project_name')) {
                $datatoupdate['project_name'] = $req->project_name;
            }
            PrefProject::where(['id' => $req->project_id])->update($datatoupdate);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function UpdateSettingData($req)
    {
        // Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        try {

            $fieldsMap = [
                'occupied_area'     => 'occupied_area',
                'total_area'        => 'total_area',
                'project_furnish'   => 'project_furnish',
                'parking_availability'       => 'parking_availability',
                'facing_direction'  => 'project_facing',
                'total_towers'      => 'total_towers',
                'total_units'       => 'total_units',
            ];

            $datatoupdate = array_filter(
                array_map(
                    fn($key, $value) => $req->has($key) ? [$value => $req->$key] : null,
                    array_keys($fieldsMap),
                    $fieldsMap
                )
            );

            $datatoupdate = array_merge(...array_filter($datatoupdate));

            ProjectSetting::where(['project_id' => $req->project_id])->update($datatoupdate);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function UpdateAdditionalData($req)
    {
        // Log::info("Request in inside UpdateAdditionalData:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        try {

            $datatoupdate = [];


            if ($req->has('possession_status')) {
                $possession_status_details = json_decode($req->possession_status, true) ?? [];

                $month         = $possession_status_details['possesion_month'] ?? '';
                $year          = $possession_status_details['possesion_year'] ?? '';
                $constructYear = $possession_status_details['construct_year'] ?? '';
                $status        = $possession_status_details['possession_status'] ?? '';

                $datatoupdate['possession_status'] = $status;

                // Determine which field to store and ensure the other is blank
                $datatoupdate['construct_year'] = !empty($constructYear) ? $constructYear : '';
                $datatoupdate['possesion_month_possesion_year'] = (!empty($constructYear))
                    ? ''
                    : trim("{$month}" . ($month && $year ? '-' : '') . "{$year}");
            }


            $fieldsMap = [
                'overlooking'        => 'overlooking',
                'expected_price'     => 'expected_price',
                'flooring_style'     => 'flooring_style',
                'water_available'    => 'water_availability',
                'electric_availability' => 'electric_availability',
                'type_of_ownership'     => 'type_of_ownership',
                'instruction'        => 'instruction',
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
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function UpdateProjectLandmarks($req)
    {
        try {

            // Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));

            $project_id = $req->project_id;
            $landmarks = json_decode($req->landmarks, true);

            if (isset($landmarks)) {

                $existing_landmarks_types = DB::table('project_landmarks')
                    ->where('project_id', $project_id)
                    ->pluck('landmark_type')
                    ->toArray();


                $removed_landmarks_types = array_diff($existing_landmarks_types, array_keys($landmarks));


                if (count($removed_landmarks_types) > 0) {
                    DB::table('project_landmarks')
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

                        $existingLandmark = DB::table('project_landmarks')
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
                            $insert = DB::table('project_landmarks')->insert($data);
                        }
                    }
                }
            }
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
