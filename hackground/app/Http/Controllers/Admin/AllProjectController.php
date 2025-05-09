<?php

namespace App\Http\Controllers\Admin;

use App\Models\FloorPlan;
use App\Models\PrefProject;
use App\Models\PrefProperty;
use App\Models\ProjectFloor;
use Illuminate\Http\Request;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use App\Models\SubCategoryModel;
use App\Models\PrefFloorPlanType;
use App\Models\ProjectAdditional;
use App\Models\ProjectProperties;
use App\Models\PrefFloorPlanValue;
use Illuminate\Support\Facades\DB;
use App\Models\PrefPropertySetting;
use App\Models\ProjectAmenityModel;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectPropertyMapping;
use App\Http\Controllers\Api\PostController;

class AllProjectController extends Controller
{
    public function AllProjectView(Request $request)
    {

        $paginate = 10;
        $statusMapping = config('property_status.status');
        $term = $request->input('term');
        $user_id = $request->route('uid');
        $SubCategoryModel = new SubCategoryModel;
        $project_type = $SubCategoryModel->getCategories();
        $postController = new PostController();
        $projectStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        $filters = $request->only([
            'term',
            'project_type',
            'address',
            'occupied_area',
            'total_area',
            'possession_status',
            'price',
            'user_id'
        ]);
        
        $project = PrefProject::filter($filters)->paginate($paginate);

        $amenities = new ProjectAmenityModel();
        $projectAmenities = $amenities->getProjectAmenities();
        return view('Admin.All_project.all-project', compact('project', 'statusMapping', 'user_id', 'projectAmenities', 'project_type', 'projectStatus'));
    }

    public function getTowers(Request $req)
    {
        $project_id = $req->projId;

        $total_tower = ProjectSetting::where('project_id', $project_id)->value('total_towers');

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
                            'floor_plan_image' => $property->additional->floor_plan_image ?? null,
                            'image_url' => asset('user_upload/project_floor_plan/' . $property->additional->floor_plan_image)
                        ];
                    }
                }

                $floorData[] = [
                    'floor_id' => $floor->id,
                    'flat_no' => $floor->flat_no,
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
        return response()->json(['towers_data' => $result, 'total_towers' => $total_tower]);
    }
    public function FeaturedStatus(Request $req)
    {

        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_featured = $req->status;
        $project->save();

        return [
            'message' => 'Featured status updated.',
        ];
    }
    public function TopStatus(Request $req)
    {
        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_top = $req->status;
        $project->save();

        return [
            'message' => 'Featured status updated.',
        ];
    }
    public function Propertydelete(Request $req)
    {
        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_deleted =  config('constants.STATUS_ACTIVE');
        $project->save();

        set_flash_message('delete');
        return [
            'message' => 'Property deleted successfully.',
        ];
    }

    public function PropStatusupdate(Request $req)
    {
        $status = $req->status;

        $statusMapping = config('property_status.status');
        $statusKey = array_search($status, $statusMapping);

        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->status = $statusKey;
        $project->save();
        set_flash_message('update');
        return [
            'message' => 'Property Status changed.',
        ];
    }

    public function addAmenities(Request $req)
    {
        log_anything($req->all());

        // Convert selectedAmenities array to comma-separated string
        $project_amenity = implode(",", $req->selectedAmenities);

        // Update the existing record in `project_additionals` table
        ProjectAdditional::where('project_id', $req->projId)
            ->update(['project_amenity' => $project_amenity]);

        return response()->json(['message' => 'Amenities updated successfully!']);
    }

    public function  getAmenities(Request $req)
    {

        $project_amenity = ProjectAdditional::select('project_amenity')->where('project_id', $req->projId)
            ->first();
        return response()->json(['message' => 'Amenities updated successfully!', 'project_amenity' => $project_amenity]);
    }

    public function addTowers(Request $req)
    {

        try {
            // Directly retrieve the 'towers' array from the request
            $tower_data = $req->input('towers');
            log_anything($tower_data);
            if (!is_array($tower_data)) {
                return response()->json(['status' => 0, 'message' => 'Invalid data format']);
            }

            $project_id = $req->project_id;
            $user_id = PrefProject::where('id', $project_id)->value('uid');


            $properties = PrefProperty::whereHas('projectMapping', function ($query) use ($project_id) {
                $query->where('project_id', $project_id);
            })->with(['settings'])->get();

            if ($properties->isNotEmpty()) {
                $expectedPrices = $properties->pluck('settings.expected_price')->filter();

                if ($expectedPrices->isNotEmpty()) {
                    $expectedPricesArray = $expectedPrices->toArray();
                    $minBudget = min($expectedPricesArray);
                    $maxBudget = max($expectedPricesArray);
                    ProjectSetting::where('project_id', $project_id)->update([
                        'project_budget' => $minBudget . '-' . $maxBudget
                    ]);
                }
            }

            foreach ($tower_data as $items) {
                if (empty($items['tower_name']) || empty($items['slug'])) {
                    continue; // Skip invalid data
                }

                $tower = ProjectProperties::updateOrCreate(
                    [
                        'project_id' => $project_id,
                        'slug' => $items['slug'],
                    ],
                    [
                        'tower_name' => $items['tower_name'],
                        'slug' => $items['slug'],
                        'lift_no' => isset($items['lift_no']) ? (int) $items['lift_no'] : 0,
                        'stair_no' => isset($items['stair_no']) ? (int) $items['stair_no'] : 0,
                        'fire_safety' => isset($items['fire_safety']) ? (int) $items['fire_safety'] : 0,
                    ]
                );

                $existingPropertyIDs = ProjectPropertyMapping::where('tower_id', $tower->id)
                    ->pluck('property_id')->toArray();
                $existingFloorIDs = ProjectFloor::where('tower_id', $tower->id)
                    ->pluck('id')->toArray();

                foreach ($items['floor_data'] as $floor) {
                    if (empty($floor['floor_no']) || empty($floor['flat_no'])) {
                        continue;
                    }

                    $floorModel = ProjectFloor::updateOrCreate(
                        [
                            'tower_id' => $tower->id,
                        ],
                        [
                            'flat_no' => (int) $floor['flat_no'],
                            'floor_no' => (int) $floor['floor_no'],
                        ]
                    );

                    $existingFloorIDs = array_diff($existingFloorIDs, [$floorModel->id]);

                    foreach ($floor['bhk_configurations'] as $bhkdata) {
                        if (empty($bhkdata['bhk_type']) || empty($bhkdata['super_area'])) {
                            continue;
                        }

                        $prop_ID = !empty($bhkdata['property_id'])
                            ? $bhkdata['property_id']
                            : PrefProperty::create([
                                'uid' => $user_id,
                                'name' => get_project_property_name($bhkdata['bhk_type'], $items['tower_name']),
                                'is_under_project' => true,
                            ])->id;

                        PrefProperty::where('id', $prop_ID)->update([
                            'slug' => get_project_property_slug($prop_ID, $bhkdata['bhk_type'], $bhkdata['super_area']),
                        ]);

                        PrefPropertySetting::updateOrCreate(
                            ['pid' => $prop_ID],
                            [
                                'carpet_area' => (float) $bhkdata['carpet_area'],
                                'super_area' => (float) $bhkdata['super_area'],
                                'expected_price' => (float) $bhkdata['property_price'],
                            ]
                        );
                          log_anything($bhkdata['floor_plan_image']);
                          log_anything($prop_ID);
                        PrefPropertyAdditional::updateOrCreate(
                            ['pid' => $prop_ID],
                            [
                                'bhk_type' => $bhkdata['bhk_type'],
                                'facing_direction' => $bhkdata['property_facing'],
                                'floor_plan_image' => $bhkdata['floor_plan_image'] ?? null,
                            ]
                        );

                        PrefPropertyLocation::updateOrCreate(
                            ['pid' => $prop_ID],
                            ['property_address' => $items['tower_name']]
                        );

                        ProjectPropertyMapping::updateOrCreate(
                            [
                                'project_id' => $project_id,
                                'tower_id' => $tower->id,
                                'floor_id' => $floorModel->id,
                                'property_id' => $prop_ID,
                            ]
                        );

                        $existingPropertyIDs = array_diff($existingPropertyIDs, [$prop_ID]);
                    }
                }

                // Remove old properties and floors if they no longer exist in the request
                if (!empty($existingPropertyIDs)) {
                    PrefProperty::whereIn('id', $existingPropertyIDs)->update(['is_deleted' => 1]);
                    ProjectPropertyMapping::whereIn('property_id', $existingPropertyIDs)
                        ->where('tower_id', $tower->id)
                        ->delete();
                }

                if (!empty($existingFloorIDs)) {
                    ProjectFloor::whereIn('id', $existingFloorIDs)
                        ->where('tower_id', $tower->id)
                        ->delete();
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Properties and floors added/updated successfully',
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
}
