<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use App\Models\ProjectProperty;
use App\Models\ProjectProperties;
use App\Models\PrefPropertySetting;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectPropertyMapping;

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
            $user_id = $request->input('user_id');

            Log::info($tower_data);

            if (!empty($tower_data)) {
                foreach ($tower_data as $items) {
                    $project_property_id = $items['project_property_id'] ?? null;
                    $project_name = $items['project_name'] ?? ''; // Ensure this is set

                    // Step 1: Store or update tower details **once**
                    $tower = ProjectProperties::updateOrCreate(
                        [
                            'project_id' => $project_id,
                            'id' => $project_property_id,
                        ],
                        [
                            'tower_name' => $items['tower_name'],
                            'lift_no' => $items['lift_no'],
                            'floor_no' => $items['floor_no'],
                            'flats_per_floor' => $items['flats_per_floor'],
                        ]
                    );

                    // Step 2: Fetch existing property IDs linked to this tower
                    $existingPropertyIDs = ProjectPropertyMapping::where('project_id', $project_id)
                        ->where('tower_id', $tower->id)
                        ->pluck('property_id')
                        ->toArray();

                    $incomingPropertyIDs = [];

                    // Step 3: Process properties for this tower
                    foreach ($items['bhk_type_data'] as $bhkdata) {
                        $bhk_type = $bhkdata['bhk_type'] ?? '';
                        $carpet_area = $bhkdata['carpet_area'] ?? null;
                        $super_area = $bhkdata['super_area'] ?? null;
                        $property_price = $bhkdata['property_price'] ?? null;
                        $property_facing = $bhkdata['property_facing'] ?? null;

                        if (!empty($bhkdata['property_id'])) {
                            // Update existing property
                            $prop_ID = $bhkdata['property_id'];

                            PrefProperty::where('id', $prop_ID)->update([
                                'name' => get_project_property_name( $bhk_type, $project_name),
                            ]);
                        } else {
                            // Insert new property
                            $newProperty = PrefProperty::create([
                                'uid' => $user_id,
                                'name' => get_project_property_name( $bhk_type, $project_name),
                            ]);
                            $prop_ID = $newProperty->id;

                            // Update slug with actual property ID
                            $newProperty->update([
                            ]);
                        }

                        $incomingPropertyIDs[] = $prop_ID;

                        // Update property details
                        PrefPropertySetting::updateOrCreate(
                            ['pid' => $prop_ID],
                            [
                                'carpet_area' => $carpet_area,
                                'super_area' => $super_area,
                                'expected_price' => $property_price,
                            ]
                        );

                        PrefPropertyAdditional::updateOrCreate(
                            ['pid' => $prop_ID],
                            [
                                'bhk_type' => $bhk_type,
                                'facing_direction' => $property_facing,
                            ]
                        );

                        PrefPropertyLocation::updateOrCreate(
                            ['pid' => $prop_ID],
                            []
                        );

                        // Ensure property is linked to the tower
                        ProjectPropertyMapping::updateOrCreate(
                            [
                                'project_id' => $project_id,
                                'tower_id' => $tower->id,
                                'property_id' => $prop_ID,
                            ],
                            []
                        );
                    }

                    // Step 4: Remove properties not in the new request
                    $propertiesToDelete = array_diff($existingPropertyIDs, $incomingPropertyIDs);
                    if (!empty($propertiesToDelete)) {
                        PrefProperty::whereIn('id', $propertiesToDelete)->update(['is_deleted' => 1]);
                        ProjectPropertyMapping::whereIn('property_id', $propertiesToDelete)
                            ->where('tower_id', $tower->id)
                            ->delete();
                    }
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties added/updated successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in SaveProjectProperty: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'status' => 0,
                'message' => 'Error processing the request',
            ]);
        }
    }


    public function GetProjectProperties(Request $request)
    {
        try {
            $project_id = $request->input('project_id');
            $user_id = $request->input('user_id');

            // Fetch project properties with related properties
            $projectProperties = ProjectProperties::with([
                'properties.property.settings',
                'properties.property.additional',
                'properties.property.location'
            ])->where('project_id', $project_id)
                ->get();

            $totalTowers = ProjectSetting::where(['project_id' => $project_id])->value('total_towers');
            $project_name = PrefProject::where(['id' => $project_id])->value('project_name');
            $project_loaction = ProjectLocation::where(['project_id' => $project_id])->value('locality');

            $result = [
                'totalTowers' => $totalTowers,
                'project_name' => $project_name,
                'project_location' => $project_loaction,
                'towerdata' => []
            ];

            foreach ($projectProperties as $tower) {
                $bhkTypeData = [];

                foreach ($tower->properties as $propertyMapping) {
                    $property = $propertyMapping->property;
                    if ($property) {
                        $bhkTypeData[] = [
                            'property_id' => $property->id ?? null,
                            'bhk_type' => $property->additional->bhk_type ?? null,
                            'carpet_area' => $property->settings->carpet_area ?? null,
                            'super_area' => $property->settings->super_area ?? null,
                            'property_price' => $property->settings->expected_price ?? null,
                            'property_facing' => $property->additional->facing_direction ?? null,
                        ];
                    }
                }

                $result['towerdata'][] = [
                    'project_property_id' => $tower->id,
                    'tower_name' => $tower->tower_name,
                    'lift_no' => $tower->lift_no,
                    'floor_no' => $tower->floor_no,
                    'flats_per_floor' => $tower->flats_per_floor,
                    'bhk_type_data' => $bhkTypeData,
                ];
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in GetProjectProperties: ' . $e->getMessage(), [
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
