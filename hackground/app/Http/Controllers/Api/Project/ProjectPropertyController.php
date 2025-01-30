<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\ProjectProperty;
use App\Models\ProjectProperties;
use App\Models\PrefPropertySetting;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectSetting;

class ProjectPropertyController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function SaveProjectProperty(Request $request)
    {
        try {
            $tower_data = json_decode($request->input('tower_data'), true);
            $project_id = $request->input('project_id');
            $project_property_id = $request->input('project_id');
            $user_id = $request->input('user_id');
            log::info($tower_data);
            if (!empty($tower_data)) {


                // Step 1: Fetch existing property IDs from the database for the given project
                $existingPropertyIDs = ProjectProperties::where('project_id', $project_id)
                    ->pluck('property_id')
                    ->toArray();

                // Step 2: Extract property IDs from the incoming request
                $incomingPropertyIDs = [];
                foreach ($tower_data as $items) {
                    foreach ($items['bhk_type_data'] as $bhkdata) {
                        if (!empty($bhkdata['property_id'])) {
                            $incomingPropertyIDs[] = $bhkdata['property_id'];
                        }
                    }
                }

                // Step 3: Find property IDs to mark as deleted (present in DB but missing in input)
                $idsToDelete = array_diff($existingPropertyIDs, $incomingPropertyIDs);
                log::info($idsToDelete);
                if (!empty($idsToDelete)) {
                    // Step 4: Mark the properties as deleted (update their status)
                    PrefProperty::whereIn('id', $idsToDelete)->update(['is_deleted' => 1]); // -1 or any status you define for deleted properties

                    // Step 5: Remove the relationship from ProjectProperties (delete only from ProjectProperties)
                    ProjectProperties::whereIn('property_id', $idsToDelete)
                        ->where('project_id', $project_id)  // Ensure you are targeting the correct project
                        ->delete();
                }

                // Step 6: Process incoming data (Insert/Update)
                foreach ($tower_data as $items) {
                    foreach ($items['bhk_type_data'] as $bhkdata) {
                        if (!empty($bhkdata['property_id']) && in_array($bhkdata['property_id'], $existingPropertyIDs)) {
                            // Update existing property
                            $prop_ID = $bhkdata['property_id'];

                            PrefPropertySetting::updateOrCreate(
                                ['pid' => $prop_ID],
                                [
                                    'carpet_area' => $bhkdata['carpet_area'],
                                    'super_area' => $bhkdata['super_area'],
                                    'expected_price' => $bhkdata['property_price'],
                                ]
                            );

                            PrefPropertyAdditional::updateOrCreate(
                                ['pid' => $prop_ID],
                                [
                                    'bhk_type' => $bhkdata['bhk_type'],
                                    'facing_direction' => $bhkdata['property_facing']
                                ]
                            );

                            ProjectProperties::updateOrCreate(
                                ['id' => $project_property_id],
                                [
                                    'project_id' => $project_id,
                                    'tower_name' => $items['tower_name'],
                                    'lift_no' => $items['lift_no'],
                                    'floor_no' => $items['floor_no'],
                                    'flats_per_floor' => $items['flats_per_floor'],
                                ]
                            );
                        } else {
                            // Insert new property
                            $insertMain = PrefProperty::create(['uid' => $user_id]); // Default status to 'active'
                            $prop_ID = $insertMain->id;

                            PrefPropertySetting::create([
                                'pid' => $prop_ID,
                                'carpet_area' => $bhkdata['carpet_area'],
                                'super_area' => $bhkdata['super_area'],
                                'expected_price' => $bhkdata['property_price'],
                            ]);

                            PrefPropertyAdditional::create([
                                'pid' => $prop_ID,
                                'bhk_type' => $bhkdata['bhk_type'],
                                'facing_direction' => $bhkdata['property_facing']
                            ]);

                            PrefPropertyLocation::create([
                                'pid' => $prop_ID,
                            ]);

                            ProjectProperties::create([
                                'project_id' => $project_id,
                                'tower_name' => $items['tower_name'],
                                'lift_no' => $items['lift_no'],
                                'floor_no' => $items['floor_no'],
                                'flats_per_floor' => $items['flats_per_floor'],
                                'property_id' => $prop_ID,
                            ]);
                        }
                    }
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties added successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in SaveProjectProperty: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'status' => 0,
                'message' => 'Error processing the request',
            ], 500);
        }
    }

    public function GetProjectProperties(Request $request)
    {
        try {
            $project_id = $request->input('project_id');
            $user_id = $request->input('user_id');

            $projectProperties = ProjectProperties::with([
                'property.settings',
                'property.additional',
                'property.location'
            ])->where('project_id', $project_id)
                ->whereHas('property', function ($query) use ($user_id) {
                    $query->where('uid', $user_id);
                })
                ->get();

            $totalTowers = ProjectSetting::where(['project_id' => $project_id])->value('total_towers');
            // Log::info('projectProperties' . json_encode($projectProperties, JSON_PRETTY_PRINT));
            $result = [];
            $result['totalTowers'] = $totalTowers;
            $result['towerdata'] = [];
            foreach ($projectProperties->groupBy('tower_name') as $tower_name => $properties) {

                // Log::info('projectProperties' . json_encode($projectProperties, JSON_PRETTY_PRINT));
                $bhkTypeData = [];
                foreach ($properties as $property) {
                    $bhkTypeData[] = [
                        'property_id' => $property->property->id ?? null,
                        'bhk_type' => $property->property->additional->bhk_type ?? null,
                        'carpet_area' => $property->property->settings->carpet_area ?? null,
                        'super_area' => $property->property->settings->super_area ?? null,
                        'property_price' => $property->property->settings->expected_price ?? null,
                        'property_facing' => $property->property->additional->facing_direction ?? null,
                    ];
                }

                $result['towerdata'][] = [
                    'project_property_id'=>$properties->first()->id,
                    'tower_name' => $tower_name,
                    'lift_no' => $properties->first()->lift_no,
                    'floor_no' => $properties->first()->floor_no,
                    'flats_per_floor' => $properties->first()->flats_per_floor,
                    'bhk_type_data' => $bhkTypeData,
                ];
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in GetProjectProperty: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Error fetching properties',
            ]);
        }
    }
}
