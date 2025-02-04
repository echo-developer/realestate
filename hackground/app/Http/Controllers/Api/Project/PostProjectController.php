<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\User;
use App\Models\PrefProject;

use Illuminate\Support\Str;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Models\ProjectGallery;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use App\Models\ProjectAdditional;
use App\Http\Controllers\Controller;
use App\Models\ProjectGalleryImages;
use Illuminate\Support\Facades\Hash;


class PostProjectController extends Controller
{
    protected $apiModel;
    protected  $UserId;
    protected  $bedroom_count;
    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function PostProject(Request $request)
    {

        try {


            $this->UserId = $this->handleUser($request);
            $project = $this->createProject($this->UserId, $request);
            $this->saveProjectLocation($project->id, $request);
            $this->saveProjectSettings($project->id, $request);
            $this->saveProjectAdditional($project->id, $request);
            $this->saveProjectGalleries($project->id, $request);


            return response()->json([
                'status' => 1,
                'message' => 'Project successfully posted',
                'data' => [
                    'user_id' => $this->UserId,
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

    public function handleUser($request)
    {
        $userId = null;

        if (!empty($request->uid)) {
            $user = User::findOrFail($request->uid);

            $user->update([
                'user_type' => is_string($request->user_type) ? $request->user_type : $user->user_type,
                'name' => is_string($request->user_name) ? $request->user_name : $user->name,
                'whatsapp_no' => is_string($request->w_no) ? $request->w_no : $user->whatsapp_no,
                'phone_code' => is_string($request->country_code) ? $request->country_code : $user->phone_code,
                'email' => filter_var($request->user_email, FILTER_VALIDATE_EMAIL) ? $request->user_email : $user->email,
            ]);

            $userId = $user->id;
        } else {
            $user = User::create([
                'user_type' => is_string($request->user_type) ? $request->user_type : null,
                'name' => is_string($request->user_name) ? $request->user_name : null,
                'whatsapp_no' => is_string($request->w_no) ? $request->w_no : null,
                'phone_code' => is_string($request->country_code) ? $request->country_code : null,
                'email' => filter_var($request->user_email, FILTER_VALIDATE_EMAIL) ? $request->user_email : null,
                'password' => is_string($request->user_password) ? Hash::make($request->user_password) : null,
            ]);

            $userId = $user->id;
        }

        return $userId;
    }

    public function createProject($userId, $request)
    {

        $project = PrefProject::create([
            'uid' => $userId,
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


    public function saveProjectLocation($projectId, $request)
    {
        ProjectLocation::create([
            'project_id' => $projectId,
            'locality' => is_string($request->locality) ? $request->locality : null,
            'city' => is_numeric($request->city) ? $request->city : null,
            'address' => is_string($request->address) ? $request->address : null,
            'latitude'=>$request->latitude??null,
            'longitude'=>$request->longitude??null
        ]);
    }
   
    public function saveProjectSettings($projectId, $request)
    {
        ProjectSetting::create([
            'project_id' => $projectId,
      
            'project_budget' => is_numeric($request->min_budget) && is_numeric($request->max_budget) ? trim($request->min_budget . '-' . $request->max_budget) : null,
            'parking_availability' => is_string($request->parking_availability) ? $request->parking_availability : null,
            'project_facing' => is_string($request->project_facing) ? $request->project_facing : null,
            'total_towers' => is_numeric($request->total_towers) ? $request->total_towers : null,
            'total_area' => is_numeric($request->total_area) ? $request->total_area : null,
            'occupied_area' => is_numeric($request->occupied_area) ? $request->occupied_area : null,
            'total_units' => is_numeric($request->total_units) ? $request->total_units : null,
            'project_furnish' => is_numeric($request->project_furnish) ? $request->project_furnish : null,
            'project_type' => is_numeric($request->project_type) ? $request->project_type : null,
        ]);
    }

    public function saveProjectAdditional($projectId, $request)
    {
        ProjectAdditional::create([
            'project_id' => $projectId,
            'main_road_facing' => is_string($request->main_road_facing) && $request->main_road_facing === 'yes' ? 'Y' : 'N',
            'project_amenity' => is_string($request->project_amenity) ?  $request->project_amenity : null,
            'possession_status' => is_string($request->possession_status) ? $request->possession_status : null,
            'currency' => is_string($request->currency) ? $request->currency : null,
            'token_amount' => is_numeric($request->token_amount) ? $request->token_amount : null,
            'expected_price' => is_numeric($request->expected_price) ? $request->expected_price : null,
            'developer_details' => is_string($request->developer_details) ? $request->developer_details : null,
            'developer_name' => is_string($request->developer_name) ? $request->developer_name : null,
        ]);
    }

    private function saveProjectGalleries($projectId, $request)
    {
        $galleries = $request->galleries;

        if ($galleries) {
            if (is_string($galleries)) {
                $galleries = json_decode($galleries, true);
            }

            if (is_array($galleries)) {
                foreach ($galleries as $galleryData) {
                    $gallery = ProjectGallery::create([
                        'project_id' => $projectId,
                        'image_type' => is_string($galleryData['gallery']) ? $galleryData['gallery'] : null,
                    ]);

                    if (isset($galleryData['images']) && is_array($galleryData['images'])) {
                        foreach ($galleryData['images'] as $image) {
                            ProjectGalleryImages::create([
                                'gallary_id' => $gallery->id,
                                'filename' => is_string($image['image_name']) ? $image['image_name'] : null,
                                'caption' => is_string($image['caption']) ? $image['caption'] : null,
                            ]);
                        }
                    }
                }
            }
        }
    }
}
