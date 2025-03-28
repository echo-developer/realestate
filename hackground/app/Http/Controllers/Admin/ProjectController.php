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
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];

        //load Furnishes
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
        return view('Admin.All_project.add_project', compact('project_type', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus', 'uid'));
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

        // If last step (Step 6) passes, save the project
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

        // If validation passes for steps 2-5, allow moving to the next step
        return response()->json([
            'success' => true,
            'message' => 'Validation passed, proceed to next step'
        ]);
    }
    public function editProjectData(Request $request)
    {
        // Ensure `proj_id` is provided
        if (!$request->has('project_id')) {
            return response()->json([
                'status' => 0,
                'message' => 'Project ID is required for updating.'
            ], 400);
        }

        // Find existing project
        $project = PrefProject::find($request->project_id);

        if (!$project) {
            return response()->json([
                'status' => 0,
                'message' => 'Project not found.'
            ], 404);
        }

        $step = $request->input('step');

        // Define validation rules based on step
        $rules = [];

        switch ($step) {
            case 1:
                $rules = [
                   
                ];
                break;

            case 2:
                $rules = [
                    'city' => 'required|integer',
                    'project_name' => 'required|string|max:255',
                    'project_address' => 'required|string',
                    'description' => 'required|string',
                ];
                break;

            case 3:
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

            case 4:
                $rules = [
                    'expected_price' => 'required|numeric',
                ];
                break;
        }

        // Validate request data
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

       
            try {
                // Update project details
                $this->saveProject($project, $request);
                $this->saveProjectLocation($project->id, $request);
                $this->saveProjectSettings($project->id, $request);
                $this->saveProjectAdditional($project->id, $request);
                // $this->saveProjectGalleries($project->id, $request);

                return response()->json([
                    'success' => true,
                    'message' => 'Project updated successfully',
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

    private function saveProject($project, $request)
    {
        $project->fill([
            'project_type' => $request->project_type ?? $project->project_type,
            'uid' => $request->uid,
            'project_name' => $request->project_name ?? $project->project_name,
            'project_desc' => $request->description ?? $project->project_desc,
            'status' => config('constants.STATUS_INACTIVE'),
        ])->save();

        $encodedId = base64_encode($project->id);
        $project->slug = Str::slug($request->project_name) . '-prjDtId-' . $encodedId;
        $project->save();
    }

    private function saveProjectLocation($projectId, Request $request)
    {
        $updateData = $this->filterUpdateData([
            'locality' => 'project_locality',
            'city' => 'city',
            'address' => 'project_address',
            'latitude' => 'latitude',
            'longitude' => 'longitude'
        ], $request);
    
        if (!empty($updateData)) {
            ProjectLocation::where('project_id', $projectId)->update($updateData);
        }
    }
    
    private function saveProjectSettings($projectId, Request $request)
    {
        $updateData = $this->filterUpdateData([
            'parking_availability' => 'parking',
            'post_for'=>'post_for',
            'project_facing' => 'project_facing',
            'total_towers' => 'total_tower',
            'total_area' => 'total_area',
            'occupied_area' => 'occupied_area',
            'total_units' => 'total_unit',
            'project_furnish' => 'project_furnish',
            'project_type' => 'project_type',
        ], $request);
    
        if (!empty($updateData)) {
            ProjectSetting::where('project_id', $projectId)->update($updateData);
        }
    }
    
    private function saveProjectAdditional($projectId, Request $request)
    {
        $updateData = $this->filterUpdateData([
            'main_road_facing' => 'main_road_facing',
            'project_amenity' => 'amenities',
            'possession_status' => 'pstatus',
            'currency' => 'currency',
            'token_amount' => 'token_amount',
            'expected_price' => 'project_price',
            'developer_details' => 'developer_details',
            'developer_name' => 'developer_name',
            'developer_experience' => 'developer_experience',
            'instruction' => 'instruction',
        ], $request);

        if ($request->filled('main_road_facing')) {
            $updateData['main_road_facing'] = strtolower($request->main_road_facing) === 'yes' ? 'Y' : 'N';
        }
    
        if ($request->filled('amenities')) {
            $updateData['project_amenity'] = implode(',', (array) $request->amenities);
        }
    
        if ($request->has('pstatus')) {
            $updateData['possession_status'] = 1;
        } else {
            $updateData['possession_status'] = 0;
        }
    
        if (!empty($updateData)) {
            ProjectAdditional::where('project_id', $projectId)->update($updateData);
        }
    }
    private function filterUpdateData(array $fields, Request $request)
    {
        $updateData = [];
        foreach ($fields as $column => $requestKey) {
            if ($request->filled($requestKey)) {
                $updateData[$column] = $request->input($requestKey);
            }
        }
        return $updateData;
    }
    private function saveProjectGalleries($projectId, $request)
    {
        $galleries = $request->uploaded_images;

        if (!$galleries) {
            return;
        }

        if (is_string($galleries)) {
            $galleries = json_decode($galleries, true);
        }

        if (!is_array($galleries)) {
            return;
        }

        foreach ($galleries as $imageType => $images) {
            $gallery = ProjectGallery::where('project_id', $projectId)
                ->where('image_type', $imageType)
                ->update([
                    'project_id' => $projectId,
                    'image_type' => $imageType
                ]);

            foreach ((array) $images as $imageName) {
                ProjectGalleryImages::where('gallary_id', $gallery->id)
                    ->where('filename', $imageName)
                    ->update([
                        'gallary_id' => $gallery->id,
                        'filename' => $imageName,
                        'caption' => null
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

        $SubCategoryModel = new SubCategoryModel;
        $projectTypes = $SubCategoryModel->getCategories();
        return view('Admin.All_project.project_modal', compact('step', 'projectData','projectTypes'));
    }
}
