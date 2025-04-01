<?php

namespace App\Http\Controllers\Admin;

use App\Models\PrefProject;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProjectGallery;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use PhpParser\Node\Expr\Empty_;
use App\Models\SubCategoryModel;
use App\Models\ProjectAdditional;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\ProjectGalleryImages;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;

class ProjectController extends Controller
{
    public function ProjectAdd(Request $request)
    {
        $SubCategoryModel = new SubCategoryModel;
        $project_type = $SubCategoryModel->getCategories();
        $lang = $request->input('lang', 'en');
        $uid = $request->input('uid', '');

        $homeontroller = new HomeController();

        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        //load proepertyAmenities
        $projectAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];

        //load Furnishes
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
        return view('Admin.All_project.add_project', compact('project_type', 'cities', 'projectAmenities', 'propertyFurnishes', 'propertyStatus', 'uid'));
    }

    public function ProjectImageStore(Request $request)
    {


        // Validate the request
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        $uploadedImages = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName(); // Unique file name
                $filePath = 'user_upload/project_images/'; // Storage path
                $file->move(public_path($filePath), $filename); // Move to public folder

                // Store each uploaded image URL and filename
                $uploadedImages[] = [
                    'imageUrl' => asset($filePath . $filename),
                    'filename' => $filename
                ];
            }
        }

        return response()->json([
            'success' => true,
            'images' => $uploadedImages
        ]);
    }
    public function saveProjectData(Request $request)
    {

        Log::info($request->all());

        $step = $request->input('step');

        $rules = [];

        switch ($step) {
            case 2:
                $rules = [
                    'project_type' => 'required',
                    'developer_name' => 'required|string',
                    'developer_details' => 'required|string',
                ];
                break;

            case 3:
                $rules = [
                    'city' => 'required|integer',
                    'project_name' => 'required|string|max:255',
                    'project_address' => 'required|string',
                    'description' => 'required|string',
                ];
                break;

            case 4:
                $rules = [
                    'occupied_area' => 'required|numeric',
                    'total_area' => 'required|numeric',
                    'total_unit' => 'required|integer',
                    'parking' => 'required|string',
                    'total_tower' => 'required|integer',
                    'project_facing' => 'required|string',
                    'main_road_facing' => 'required|string',
                ];
                break;

            case 5:
                $rules = [
                    'expected_price' => 'required|numeric',
                ];
                break;
        }

        // Validate request
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($step == 6) {
            try {
                $project = $request->proj_id
                    ? PrefProject::find($request->proj_id)
                    : new PrefProject();

                if (!$project) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Project not found for update'
                    ], 404);
                }

                $this->saveProject($project, $request);
                $this->saveProjectLocation($project->id, $request);
                $this->saveProjectSettings($project->id, $request);
                $this->saveProjectAdditional($project->id, $request);
                $this->saveProjectGalleries($project->id, $request);

                return response()->json([
                    'success' => true,
                    'message' => $request->proj_id ? 'Project updated successfully' : 'Project added successfully',
                    'data' => ['project_id' => $project->id]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Something went wrong, please try again later.',
                    'error' => $e->getMessage()
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Validation passed, proceed to next step'
        ]);
    }

    private function saveProject($project, $request)
    {
        $project->fill([
            'project_type' => $request->project_type ?? $project->project_type,
            'project_name' => $request->project_name ?? $project->project_name,
            'project_desc' => $request->description ?? $project->project_desc,
        ])->save();

        $encodedId = base64_encode($project->id);
        $project->slug = Str::slug($request->project_name) . '-prjDtId-' . $encodedId;
        $project->save();
    }

    public function saveProjectLocation($projectId, $request)
    {
        ProjectLocation::create([
            'project_id' => $projectId,
            'locality' => is_string($request->locality) ? $request->locality : null,
            'city' => is_numeric($request->city) ? $request->city : null,
            'address' => is_string($request->address) ? $request->address : null,
            'latitude' => $request->latitude ?? null,
            'longitude' => $request->longitude ?? null
        ]);
    }

    public function saveProjectSettings($projectId, $request)
    {
        ProjectSetting::create([
            'project_id' => $projectId,

            'project_budget' => is_numeric($request->min_budget) && is_numeric($request->max_budget) ? trim($request->min_budget . '-' . $request->max_budget) : null,
            'parking_availability' => is_string($request->parking_availability) ? $request->parking_availability : null,
            'post_for' => is_string($request->post_for) ? $request->post_for : null,
            'project_facing' => is_string($request->project_facing) ? $request->project_facing : null,
            'total_towers' => is_numeric($request->total_towers) ? $request->total_towers : null,
            'unit_type' => is_string($request->unit_type) ? $request->unit_type : null,
            'total_area' => is_numeric($request->total_area) ? $request->total_area : null,
            'occupied_area' => is_numeric($request->occupied_area) ? $request->occupied_area : null,
            'area_in_sqft' => convertToSqft($request->occupied_area, $request->unit_type),
            'total_units' => is_numeric($request->total_units) ? $request->total_units : null,
            'project_furnish' => is_numeric($request->project_furnish) ? $request->project_furnish : null,
            'project_type' => is_numeric($request->project_type) ? $request->project_type : null,
        ]);
    }

    public function saveProjectAdditional($projectId, $request)
    {
        $construct_age = $request->construct_age ?? null;
        $possession_month = $request->construction_month ?? '';
        $possession_year = $request->construction_year ?? '';
        $possesion_month_possesion_year = (!empty($construct_age))
            ? null
            : trim("{$possession_month}" . ($possession_month && $possession_year ? '-' : '') . "{$possession_year}");

        ProjectAdditional::create([
            'project_id' => $projectId,
            'main_road_facing' => is_string($request->main_road_facing) && $request->main_road_facing === 'Yes' ? 'Y' : 'N',
            'project_amenity' => is_string($request->project_amenity) ?  $request->project_amenity : null,
            'possession_status' => is_string($request->possession_status) ? $request->possession_status : null,
            'construct_year' => $construct_age,
            'possesion_month_possesion_year' => $possesion_month_possesion_year ?? null,
            'currency' => is_string($request->currency) ? $request->currency : null,
            'token_amount' => is_numeric($request->token_amount) ? $request->token_amount : null,
            'expected_price' => is_numeric($request->expected_price) ? $request->expected_price : null,
            'developer_details' => is_string($request->developer_details) ? $request->developer_details : null,
            'developer_name' => is_string($request->developer_name) ? $request->developer_name : null,
            'developer_experience' => $request->developer_experience ? $request->developer_experience : null,
        ]);
    }

    private function saveProjectGalleries($projectId, $request)
    {
        $uploadedImages = json_decode($request->uploaded_images, true);
        $imageDescriptions = $request->image_desc ?? [];
    
        if (!is_array($uploadedImages) || empty($uploadedImages)) {
            return;
        }
    
        foreach ($uploadedImages as $imageType => $images) {
            // Create gallery for each image type
            $gallery = ProjectGallery::create([
                'project_id' => $projectId,
                'image_type' => $imageType,
            ]);
    
            foreach ($images as $filename) {
                ProjectGalleryImages::create([
                    'gallary_id' => $gallery->id,
                    'filename' => $filename,
                    'caption' => $imageDescriptions[$imageType] ?? null, // Store description per type
                ]);
            }
        }
    }
    
    public function ProjectEdit(Request $request)
    {
        $SubCategoryModel = new SubCategoryModel;
        $project_type = $SubCategoryModel->getCategories();
        $lang = $request->input('lang', 'en');
        $project_id = $request->project_id;
        $homeontroller = new HomeController();

        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];

        $projectData = PrefProject::with([
            'settings',
            'additional',
            'location',
            'gallery',
            'landmarks',
            'gallery.images'
        ])->findOrFail($project_id);

        $groupedGallery = $projectData->gallery->groupBy('image_type');
        $landmark_categories = [
            'education' => [],
            'healthcare' => [],
            'shopping' => [],
            'commercial' => [],
            'transportation' => []
        ];

        foreach ($projectData->landmarks as $landmark) {
            $details = json_decode($landmark->landmark_details, true);


            if (strpos($landmark->landmark_type, 'education') !== false) {
                $landmark_categories['education'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'healthcare') !== false) {
                $landmark_categories['healthcare'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'shopping_center') !== false) {
                $landmark_categories['shopping'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'commercial') !== false) {
                $landmark_categories['commercial'][] = $details;
            } elseif (strpos($landmark->landmark_type, 'transportation') !== false) {
                $landmark_categories['transportation'][] = $details;
            }
        }


        return view('Admin.All_project.edit_project', compact('project_type', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus', 'projectData', 'project_id', 'landmark_categories', 'groupedGallery'));
    }

    public function getProjectDetails(Request $request)
    {

        $projectData = PrefProject::where('id', $request->id)->with([
            'settings',
            'additional',
            'location',
            'gallery',
            'gallery.images'
        ])->first();

        return view('Admin.All_project.project-details', compact('projectData'));
    }

    public function loadModalPage(Request $request)
    {
        $step = $request->query('step');
        $projectData = PrefProject::with([
            'settings',
            'additional',
            'location',
            'gallery',
            'landmarks',
            'gallery.images'
        ])->findOrFail($request->query('project_id'));
        $postController = new PostController();
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        $projectFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
        $SubCategoryModel = new SubCategoryModel;
        $projectTypes = $SubCategoryModel->getCategories();
        $groupedGallery = $projectData->gallery->groupBy('image_type');
        return view('Admin.All_project.project_modal', compact('step', 'projectData', 'projectTypes', 'groupedGallery','propertyStatus','projectFurnishes'));
    }
}
