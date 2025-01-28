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

    // this function has beeen created to fix the malformed "[3","5","6]" amenity ids coming from database
    //  which has been used to fetch amenity details
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
    }

    public function EditProject(Request $request)
    {

        try {
            $project = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])
                ->where('id', $request->project_id)
                ->first();

            if (isset($project->additional->project_amenity) && $project->additional->project_amenity) {
                $project->additional->project_amenity = $this->apimodel->getPropertyAmnitybyID(
                    $this->sanitizeAmenityIds($project->additional->project_amenity)
                );
            }

            if ($project) {
                $project = $project->toArray();

                // Flatten the project data
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

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrieved successfully.',
                    'data' => $flattened,
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
            // $this->UpdateAdditionalData($request);
            // $this->UpdateSettingData($request);
            // $this->UpdatePropertyLandmarks($request);


            return response()->json([
                'status' => 1,
                'message' => 'property Updated successfully',
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
                $datatoupdate['property_address'] = $req->address;
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
}
