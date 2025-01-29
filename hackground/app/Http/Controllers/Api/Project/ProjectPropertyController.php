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
            $user_id = $request->input('user_id');

            if (!empty($tower_data)) {
                foreach ($tower_data as $items) {
                    foreach ($items['bhk_type_data'] as $bhkdata) {

                        $insertMain = PrefProperty::create(['uid' => $user_id]);
                        $prop_ID = $insertMain->id;

                        $insertSetting = PrefPropertySetting::create([
                            'pid' => $prop_ID,
                            'carpet_area' => $bhkdata['carpet_area'],
                            'super_area' => $bhkdata['super_area'],
                            'expected_price' => $bhkdata['property_price'],
                        ]);

                        $insertAdditional = PrefPropertyAdditional::create([
                            'pid' => $prop_ID,
                            'bhk_type' => $bhkdata['bhk_type'],
                        ]);

                        $insertLocation = PrefPropertyLocation::create([
                            'pid' => $prop_ID,
                        ]);

                        $insertProjectProperty = ProjectProperties::create([
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

            return response()->json([
                'status' => 1,
                'message' => 'Properties added successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }



    // public function SaveProjectProperty(Request $request)
    // {
    //     try {
    //         $tower_data = json_decode($request->input('tower_data'), true);
    //         $project_id = $request->input('project_id');
    //         $user_id = $request->input('user_id');

    //         // Check if the project exists for the given user
    //         $existingProperties = ProjectProperties::where('project_id', $project_id)->pluck('property_id')->toArray();

    //         $newPropertyIDs = []; // To track the properties in the new request

    //         if (!empty($tower_data)) {
    //             foreach ($tower_data as $items) {
    //                 foreach ($items['bhk_type_data'] as $bhkdata) {

    //                     // Check if this property already exists in the database
    //                     $existingProperty = PrefProperty::where('uid', $user_id)
    //                         ->whereHas('projectProperty', function ($query) use ($project_id, $items) {
    //                             $query->where('project_id', $project_id)
    //                                 ->where('tower_name', $items['tower_name']);
    //                         })
    //                         ->first();

    //                     if ($existingProperty) {
    //                         // Update existing property
    //                         Log::info('ABC');
    //                         $prop_ID = $existingProperty->id;
    //                         PrefPropertySetting::where('pid', $prop_ID)->update([
    //                             'carpet_area' => $bhkdata['carpet_area'],
    //                             'super_area' => $bhkdata['super_area'],
    //                             'expected_price' => $bhkdata['property_price'],
    //                         ]);

    //                         PrefPropertyAdditional::where('pid', $prop_ID)->update([
    //                             'bhk_type' => $bhkdata['bhk_type'],
    //                         ]);
    //                     } else {
    //                         // Insert new property
    //                         Log::info('XYZ');
    //                         $insertMain = PrefProperty::create(['uid' => $user_id]);
    //                         $prop_ID = $insertMain->id;

    //                         PrefPropertySetting::create([
    //                             'pid' => $prop_ID,
    //                             'carpet_area' => $bhkdata['carpet_area'],
    //                             'super_area' => $bhkdata['super_area'],
    //                             'expected_price' => $bhkdata['property_price'],
    //                         ]);

    //                         PrefPropertyAdditional::create([
    //                             'pid' => $prop_ID,
    //                             'bhk_type' => $bhkdata['bhk_type'],
    //                         ]);

    //                         PrefPropertyLocation::create([
    //                             'pid' => $prop_ID,
    //                         ]);

    //                         ProjectProperties::create([
    //                             'project_id' => $project_id,
    //                             'tower_name' => $items['tower_name'],
    //                             'lift_no' => $items['lift_no'],
    //                             'floor_no' => $items['floor_no'],
    //                             'flats_per_floor' => $items['flats_per_floor'],
    //                             'property_id' => $prop_ID,
    //                         ]);
    //                     }

    //                     $newPropertyIDs[] = $prop_ID; // Track properties that should remain
    //                 }
    //             }
    //         }

    //         // Delete removed properties
    //         $propertiesToDelete = array_diff($existingProperties, $newPropertyIDs);
    //         if (!empty($propertiesToDelete)) {
    //             PrefProperty::whereIn('id', $propertiesToDelete)->delete();
    //             PrefPropertySetting::whereIn('pid', $propertiesToDelete)->delete();
    //             PrefPropertyAdditional::whereIn('pid', $propertiesToDelete)->delete();
    //             PrefPropertyLocation::whereIn('pid', $propertiesToDelete)->delete();
    //             ProjectProperties::whereIn('property_id', $propertiesToDelete)->delete();
    //         }

    //         return response()->json([
    //             'status' => 1,
    //             'message' => 'Properties updated successfully',
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('Error in SaveProjectProperty: ' . $e->getMessage(), [
    //             'file' => $e->getFile(),
    //             'line' => $e->getLine(),
    //         ]);

    //         return response()->json([
    //             'status' => 0,
    //             'message' => 'An error occurred while saving properties',
    //         ]);
    //     }
    // }



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
                        'bhk_type' => $property->property->additional->bhk_type ?? null,
                        'carpet_area' => $property->property->settings->carpet_area ?? null,
                        'super_area' => $property->property->settings->super_area ?? null,
                        'property_price' => $property->property->settings->expected_price ?? null,
                    ];
                }

                $result['towerdata'][] = [
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
