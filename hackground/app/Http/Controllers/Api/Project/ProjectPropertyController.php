<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;

use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use App\Models\ProjectFloor;
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
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

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

            $properties = PrefProperty::whereHas('projectMapping', function ($query) use ($project_id) {
                $query->where('project_id', $project_id);
            })
                ->with(['settings'])
                ->get();

            if ($properties->isNotEmpty()) {
                $expectedPrices = $properties->pluck('settings.expected_price')->filter();

                if ($expectedPrices->isNotEmpty()) {
                    $expectedPricesArray = $expectedPrices->toArray();
                    $countPrices = count($expectedPricesArray);

                    $minBudget = ($countPrices > 1) ? min($expectedPricesArray) : 0;
                    $maxBudget = max($expectedPricesArray);
                    ProjectSetting::where('project_id', $project_id)->update([
                        'project_budget' => $minBudget . '-' . $maxBudget
                    ]);
                }
            }
            if (!empty($tower_data)) {
                foreach ($tower_data as $items) {

                    $tower = ProjectProperties::updateOrCreate(
                        [
                            'project_id' => $project_id,
                        ],
                        [
                            'tower_name' => $items['tower_name'],
                            'lift_no' => $items['lift_no'],
                            'stair_no' => $items['stair_no'],
                            'fire_safety' => $items['fire_safety']
                        ]
                    );


                    $existingPropertyIDs = ProjectPropertyMapping::where('tower_id', $tower->id)
                        ->pluck('property_id')->toArray();

                    $existingFloorIDs = ProjectFloor::where('tower_id', $tower->id)
                        ->pluck('id')->toArray();


                    foreach ($items['floor_data'] as $floor) {

                        $floorModel = ProjectFloor::updateOrCreate(
                            [
                                'tower_id' => $tower->id,
                                'id' => $floor['floor_id'] ?? NULL
                            ],
                            [
                                'flat_no' => is_string($floor['flat_no']) ? (int)$floor['flat_no'] : $floor['flat_no'],
                                'floor_no' => is_string($floor['floor_no']) ? (int)$floor['floor_no'] : $floor['floor_no']
                            ]
                        );


                        $existingFloorIDs = array_diff($existingFloorIDs, [$floorModel->id]);

                        foreach ($floor['bhk_configurations'] as $bhkdata) {

                            $prop_ID = !empty($bhkdata['property_id'])
                                ? $bhkdata['property_id']
                                : PrefProperty::create([
                                    'uid' => $user_id,
                                    'name' => get_project_property_name($bhkdata['bhk_type'], $items['projectName']),
                                    'is_under_project' => true
                                ])->id;
                            $newProperty = PrefProperty::find($prop_ID);
                            $newProperty->update([
                                'slug' => get_project_property_slug($prop_ID, $bhkdata['bhk_type'], $bhkdata['super_area'])
                            ]);

                            PrefPropertySetting::updateOrCreate(
                                ['pid' => $prop_ID],
                                [
                                    'carpet_area' => $bhkdata['carpet_area'],
                                    'super_area' => $bhkdata['super_area'],
                                    'expected_price' => $bhkdata['property_price']
                                ]
                            );


                            PrefPropertyAdditional::updateOrCreate(
                                ['pid' => $prop_ID],
                                [
                                    'bhk_type' => $bhkdata['bhk_type'],
                                    'facing_direction' => $bhkdata['property_facing']
                                ]
                            );


                            PrefPropertyLocation::updateOrCreate(
                                ['pid' => $prop_ID],
                                ['property_address' => $items['projectLocation']]
                            );


                            ProjectPropertyMapping::updateOrCreate(
                                [
                                    'project_id' => $project_id,
                                    'tower_id' => $tower->id,
                                    'floor_id' => $floorModel->id,
                                    'property_id' => $prop_ID
                                ]
                            );


                            $existingPropertyIDs = array_diff($existingPropertyIDs, [$prop_ID]);
                        }
                        updateProjectBudget($project_id);
                    }


                    if (!empty($existingPropertyIDs)) {
                        PrefProperty::whereIn('id', $existingPropertyIDs)->update(['is_deleted' => 1]);
                        ProjectPropertyMapping::whereIn('property_id', $existingPropertyIDs)
                            ->where('tower_id', $tower->id)
                            ->delete();
                        updateProjectBudget($project_id);
                    }


                    if (!empty($existingFloorIDs)) {
                        ProjectFloor::whereIn('id', $existingFloorIDs)
                            ->where('tower_id', $tower->id)
                            ->delete();
                        updateProjectBudget($project_id);
                    }
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties and floors added/updated successfully'
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


            $projectProperties = ProjectProperties::with([
                'floors.properties.property.settings',
                'floors.properties.property.additional',
                'floors.properties.property.location'
            ])
                ->where('project_id', $project_id)
                ->whereHas('floors.properties.property', function ($query) {
                    $query->where('is_deleted', false);
                })
                ->get();


            $project_name = PrefProject::where('id', $project_id)->value('project_name');
            $project_location = ProjectLocation::where('project_id', $project_id)->value('locality');

            $result = [];

            foreach ($projectProperties as $tower) {
                $floorData = [];

                foreach ($tower->floors as $floor) {
                    $bhkConfigurations = [];

                    foreach ($floor->properties as $propertyMapping) {
                        $property = $propertyMapping->property;
                        if ($property) {
                            $bhkConfigurations[] = [
                                'bhk_type' => $property->additional->bhk_type ?? null,
                                'carpet_area' => $property->settings->carpet_area ?? null,
                                'super_area' => $property->settings->super_area ?? null,
                                'property_price' => $property->settings->expected_price ?? null,
                                'property_facing' => $property->additional->facing_direction ?? null,
                            ];
                        }
                    }

                    $floorData[] = [
                        'floor_id' => $floor->id,
                        'flat_no' => $floor->flat_no, // Assuming `flat_no` is stored as `id` or another field
                        'floor_no' => $floor->floor_no,
                        'bhk_configurations' => $bhkConfigurations
                    ];
                }

                $result[] = [
                    'tower_name' => $tower->tower_name,
                    'lift_no' => $tower->lift_no,
                    'stair_no' => $tower->stair_no,
                    'fire_safety' => $tower->fire_safety,
                    'floor_data' => $floorData,
                    'projectName' => $project_name,
                    'projectLocation' => $project_location
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
