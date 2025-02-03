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

    public function EditProject(Request $request)
    {

        try {
            $lang = $request->input('lang', 'en');
            $project = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,construct_year,possesion_month_possesion_year,currency,token_amount,expected_price,developer_details,developer_name,overlooking,flooring_style,water_availability,electric_availability,type_of_ownership',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:id,gallary_id,filename,caption'
                ])
                ->where('id', $request->project_id)
                ->first();

            if (isset($project->additional->project_amenity) && $project->additional->project_amenity) {
                $project->additional->project_amenity = $this->apimodel->getPropertyAmnitybyID(
                    $this->sanitizeAmenityIds($project->additional->project_amenity)
                );
            }

            $options = [
                'all_furnish' => $this->apimodel->getFurnish($lang),
            ];

            if ($project) {
                $project = $project->toArray();

                // Flatten the project data
                $flattened = array_merge(
                    $project,
                    $project['settings'] ?? [],
                    $project['additional'] ?? [],
                    $project['location'] ?? []
                );

                //static array to return parking availibility in small case
                $parkingMapping = [
                    'AV' => 'av',
                    'NA' => 'na',
                    'UC' => 'uc'
                ];
                
                $parking_availability = $parkingMapping[$flattened['parking_availability']] ?? $flattened['parking_availability'];
                


                

                $flattened['parking_availability'] = $parking_availability ?? null;
                $flattened['overlooking'] = json_decode($flattened['overlooking'], true) ?? null;
                $flattened['flooring_style'] = json_decode($flattened['flooring_style'], true) ?? null;
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

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrieved successfully.',
                    'data' => $flattened,
                    'options' => $options,
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in ProjectEnquiry: ' . $e->getMessage(), [
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
            // $this->UpdatePropertyLandmarks($request);
            $this->UpdateProjectMaintable($request);


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
        // Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        try {

            $datatoupdate = [];

            if ($req->has('address')) {
                $datatoupdate['address'] = $req->address;
            }

            if ($req->has('locality')) {
                $datatoupdate['locality'] = $req->locality;
            }

            DB::table('pref_project_location')->where('project_id', $req->project_id)->update($datatoupdate);
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

            $datatoupdate = [];
            if ($req->has('occupied_area')) {
                $datatoupdate['occupied_area'] = $req->occupied_area;
            }
            if ($req->has('total_area')) {
                $datatoupdate['total_area'] = $req->total_area;
            }
            if ($req->has('project_furnish')) {
                $datatoupdate['project_furnish'] = $req->project_furnish;
            }
            if ($req->has('car_parking')) {
                $datatoupdate['parking_availability'] = $req->car_parking;
            }
            if ($req->has('facing_direction')) {
                $datatoupdate['project_facing'] = $req->facing_direction;
            }
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
        Log::info("Request in inside UpdateAdditionalData:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        try {

            $datatoupdate = [];

            if ($req->has('possession_status')) {
                $possession_status_details = json_decode($req->possession_status, true);

                // Ensure required fields exist before processing
                if (!empty($possession_status_details)) {
                    $month = $possession_status_details['possesion_month'] ?? '';
                    $year = $possession_status_details['possesion_year'] ?? '';

                    if ($month || $year) {
                        $datatoupdate['possesion_month_possesion_year'] = trim("{$month}" . ($month && $year ? '-' : '') . "{$year}");
                    }

                    if (!empty($possession_status_details['possession_status'])) {
                        $datatoupdate['possession_status'] = $possession_status_details['possession_status'];
                    }

                    if (!empty($possession_status_details['construct_year'])) {
                        $datatoupdate['construct_year'] = $possession_status_details['construct_year'];
                    }
                }
            }
            if ($req->has('overlooking')) {
                $datatoupdate['overlooking'] = $req->overlooking;
            }
            if ($req->has('flooring')) {
                $datatoupdate['flooring_style'] = $req->flooring;
            }

            if ($req->has('water_available')) {
                $datatoupdate['water_availability'] = $req->water_available;
            }
            if ($req->has('electric_available')) {
                $datatoupdate['electric_availability'] = $req->electric_available;
            }

            if ($req->has('ownership_type')) {
                $datatoupdate['type_of_ownership'] = $req->ownership_type;
            }

            // Ensure project_id is valid before updating
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
}
