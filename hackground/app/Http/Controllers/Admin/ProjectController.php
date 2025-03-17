<?php

namespace App\Http\Controllers\Admin;

use App\Models\PrefProject;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProjectGallery;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use App\Models\SubCategoryModel;
use App\Models\ProjectAdditional;
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

        $homeontroller = new HomeController();

        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        //load proepertyAmenities
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];

        //load Furnishes
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
        return view('Admin.All_project.add_project', compact('project_type', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus'));
    }

    public function ProjectImageStore(Request $request)
    {
        Log::info($request->all());

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
        

        $step = $request->input('step'); 
        
        $rules = [];

        switch ($step) {
            case 2: 
                $rules = [
                    'project_type' => 'required',
                    'developer_name' => 'required',
                    'developer_details' => 'required',
                ];
                break;

            case 3: 
                $rules = [
                    'city' => 'required',
                    'project_name' => 'required',
                    'project_address' => 'required',
                    'description' => 'required',
                ];
                break;

            case 4: 
                $rules = [
                    'occupied_area' => 'required',
                    'total_area' => 'required',
                    'total_unit' => 'required',
                    'parking' => 'required',
                    'total_tower'=>'required',
                    'total_unit'=>'required',
                    'project_facing'=>'required',  
                    'main_road_facing' => 'required',
                ];
                break;

            case 5: 
                $rules = [
                    'expected_price' => 'required',
                ];
                break;
               
        }

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If the last step (Step 6) passes, save the project
        if ($step == 6) {
            try {
                $project = $this->createProject($request);
                $this->saveProjectLocation($project->id, $request);
                $this->saveProjectSettings($project->id, $request);
                $this->saveProjectAdditional($project->id, $request);
                $this->saveProjectGalleries($project->id, $request);

                return response()->json([
                    'success' => true,
                    'message' => 'Project successfully posted',
                    'data' => [
                        'project_id' => $project->id,
                    ]
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


    private function createProject($request)
    {
        $project = PrefProject::create([
            'project_name' => is_string($request->project_name) ? $request->project_name : null,
            'project_desc' => is_string($request->description) ? $request->description : null,
            'status' => config('constants.STATUS_INACTIVE'),
        ]);

        $encodedId = base64_encode($project->id);
        $project->slug = is_string($request->project_name)
            ? Str::slug($request->project_name) . '-prjDtId-' . $encodedId
            : null;

        $project->save();
        return $project;
    }

    private function saveProjectLocation($projectId, $request)
    {
        ProjectLocation::create([
            'project_id' => $projectId,
            'locality' => is_string($request->locality) ? $request->locality : null,
            'city' => is_numeric($request->city) ? $request->city : null,
            'address' => is_string($request->project_address) ? $request->project_address : null,
            'latitude' => $request->latitude ?? null,
            'longitude' => $request->longitude ?? null
        ]);
    }

    private function saveProjectSettings($projectId, $request)
    {
        ProjectSetting::create([
            'project_id' => $projectId,
            'project_budget' => (is_numeric($request->min_budget) && is_numeric($request->max_budget))
                ? trim($request->min_budget . '-' . $request->max_budget)
                : null,
            'parking_availability' => is_string($request->parking) ? $request->parking : null,
            'project_facing' => is_string($request->project_facing) ? $request->project_facing : null,
            'total_towers' => is_numeric($request->total_tower) ? $request->total_tower : null,
            'total_area' => is_numeric($request->total_area) ? $request->total_area : null,
            'occupied_area' => is_numeric($request->occupied_area) ? $request->occupied_area : null,
            'total_units' => is_numeric($request->total_unit) ? $request->total_unit : null,
            'project_furnish' => isset($request->project_furnish) ? implode(',', (array) $request->project_furnish) : null, // Checkbox fix
            'project_type' => is_numeric($request->project_type) ? $request->project_type : null,
        ]);
    }

    private function saveProjectAdditional($projectId, $request)
    {
        ProjectAdditional::create([
            'project_id' => $projectId,
            'main_road_facing' => isset($request->main_road_facing) && strtolower($request->main_road_facing) === 'yes' ? 'Y' : 'N',
            'project_amenity' => isset($request->amenities) ? implode(',', (array) $request->amenities) : null,
            'possession_status' => isset($request->pstatus) ? 1 : 0, // Checkbox fix
            'currency' => is_string($request->currency) ? $request->currency : null,
            'token_amount' => is_numeric($request->token_amount) ? $request->token_amount : null,
            'expected_price' => is_numeric($request->expected_price) ? $request->expected_price : null,
            'developer_details' => is_string($request->developer_details) ? $request->developer_details : null,
            'developer_name' => is_string($request->developer_name) ? $request->developer_name : null,
        ]);
    }

    private function saveProjectGalleries($projectId, $request)
    {
        $galleries = $request->uploaded_images; // Fetch the uploaded images JSON

        if ($galleries) {
            if (is_string($galleries)) {
                $galleries = json_decode($galleries, true);
            }

            if (is_array($galleries)) {
                foreach ($galleries as $imageType => $images) {
                    // Create a ProjectGallery entry for each tab (interior, exterior, etc.)
                    $gallery = ProjectGallery::create([
                        'project_id' => $projectId,
                        'image_type' => $imageType, // Store tab name as image_type
                    ]);

                    if (is_array($images)) {
                        foreach ($images as $imageName) {
                            // Store each image in ProjectGalleryImages
                            ProjectGalleryImages::create([
                                'gallary_id' => $gallery->id,
                                'filename' => $imageName, // Store image filename
                                'caption' => null, // If you have captions, handle them here
                            ]);
                        }
                    }
                }
            }
        }
    }

    public function ProjectEdit(Request $request){
        $SubCategoryModel = new SubCategoryModel;
        $project_type = $SubCategoryModel->getCategories();
        $lang = $request->input('lang', 'en');

        $homeontroller = new HomeController();

        $cities = json_decode($homeontroller->city($request)->getContent(), true)['data'] ?? [];

        $postController = new PostController();
        $propertyStatus = json_decode($postController->status($request)->getContent(), true)['data'] ?? [];
        $proepertyAmenities = json_decode($postController->get_property_amnity($request)->getContent(), true)['data'] ?? [];
        $propertyFurnishes = json_decode($postController->furnish($request)->getContent(), true)['data'] ?? [];
       
        $projectData = PrefProject::where('id', $request->id)->with([
            'settings',
            'additional',
            'location',
            'gallery',
            'gallery.images'
        ])->first();



        return view('Admin.All_project.edit_project', compact('project_type', 'cities', 'proepertyAmenities', 'propertyFurnishes', 'propertyStatus', 'projectData'));
    }
}
