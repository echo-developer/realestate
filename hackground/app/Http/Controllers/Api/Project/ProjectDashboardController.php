<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectAdditional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ProjectDashboardController extends Controller
{

    protected $apiModel;


    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }

    // this function has beeen created to fix the malformed "[3","5","6]" amenity ids coming from database
    //  which has been used to fetch amenity details
    function sanitizeAmenityIds($idsString)
    {
        return array_map('trim', explode(',', trim($idsString, '[]"')));
    }


    public function GetProject(Request $req)
    {
        $perPage = $req->input('limit', 10);
        $type    = $req->type;
        $page    = $req->page;

        $statusMapping = [
            'pending'   => 0,
            'published' => 1,
            'draft'     => 2,
            'expired'   => -1,
        ];

        if (!isset($statusMapping[$type])) {
            return response()->json([
                'status'  => 0,
                'message' => 'Invalid type provided',
            ], 400);
        }

        // --- project counts
        $statusCounts = PrefProject::where('uid', $req->uid)
            ->where('is_deleted', false)
            ->get()
            ->groupBy('status')
            ->map->count();

        $publishCount = $statusCounts[1] ?? 0;
        $pendingCount = $statusCounts[0] ?? 0;
        $draftCount   = $statusCounts[2] ?? 0;
        $expiredCount = $statusCounts[-1] ?? 0;

        // --- main project query
        $projects = PrefProject::where([
            ['uid', $req->uid],
            ['status', $statusMapping[$type]],
            ['is_deleted', false]
        ])->with([
            'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type,post_for,area_in_sqft',
            'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name,brochure_file',
            'location:project_id,locality,city,address',
            'gallery:id,project_id,image_type',
            'gallery.images:gallary_id,filename,caption'
        ])->paginate($perPage, ['*'], 'page', $page);

        // --- formatting projects
        $formattedProjects = $projects->map(function ($project) {
            // change uid to uname
            $project->uid = get_user_name($project->uid);

            // amenities mapping
            if (!empty($project->additional->project_amenity)) {
                $project->additional->project_amenity = $this->apiModel
                    ->getPropertyAmnitybyID($this->sanitizeAmenityIds($project->additional->project_amenity));
            }

            // transform values
            if ($project->location?->city) {
                $project->location->city = get_name_by_id('city_names', 'city_id', $project->location->city, 'en');
            }
            if ($project->additional?->main_road_facing) {
                $project->additional->main_road_facing = $project->additional->main_road_facing === 'Y' ? 'Yes' : 'No';
            }
            if ($project->additional?->possession_status) {
                $project->additional->possession_status = get_name_by_id('property_status_names', 'status_id', $project->additional->possession_status, 'en');
            }
            if ($project->settings?->project_type) {
                $project->settings->project_type = get_name_by_id('property_category_names', 'category_id', $project->settings->project_type, 'en');
            }

            // flatten relations
            $data = $project->toArray();
            $flattened = array_merge(
                $data,
                $data['settings']   ?? [],
                $data['additional'] ?? [],
                $data['location']   ?? []
            );
            unset($flattened['settings'], $flattened['additional'], $flattened['location']);

            // rename uid to uname
            if (isset($flattened['uid'])) {
                $flattened['uname'] = $flattened['uid'];
                unset($flattened['uid']);
            }

            // brochure url
            $flattened['brochure_url'] = !empty($flattened['brochure_file'])
                ? asset('user_upload/project_brochure/' . $flattened['brochure_file'])
                : '';

            // gallery handling (exterior preferred, fallback to any first image)
            $flattened['image_count'] = getGalleriesCount($flattened['id'], 'project');
            $flattened['gallery'] = [];

            if (!empty($data['gallery'])) {
                // try exterior first
                $exteriorGallery = collect($data['gallery'])->firstWhere('image_type', 'exterior');
                $chosenGallery   = $exteriorGallery ?? $data['gallery'][0] ?? null;

                if ($chosenGallery && !empty($chosenGallery['images'])) {
                    $image = $chosenGallery['images'][0];
                    $flattened['gallery'][] = [
                        'id'        => $chosenGallery['id'] ?? null,
                        'image_type' => $chosenGallery['image_type'],
                        'images'    => [[
                            'file'    => asset('user_upload/project_images/' . $image['filename']),
                            'caption' => $image['caption'] ?? '',
                        ]]
                    ];
                }
            }

            return $flattened;
        });

        // --- response
        return response()->json([
            'status'   => 1,
            'message'  => ucfirst($type) . ' projects successfully fetched',
            'data'     => $formattedProjects,
            'projects_counts' => [
                'publish' => $publishCount,
                'pending' => $pendingCount,
                'draft'   => $draftCount,
                'expired' => $expiredCount,
            ],
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'total_pages'  => $projects->lastPage(),
                'total'        => $projects->total(),
                'per_page'     => $projects->perPage(),
            ],
        ]);
    }


    public function uploaodPrjBrochure(Request $request)
    {

        try {
            $project_brochure = $request->file('brochure_data');
            $project_id = $request->input('project_id');

            $fileName = $project_brochure->getClientOriginalName();


            $uploadPath = public_path('user_upload/project_brochure');


            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }


            $existingRecord = ProjectAdditional::where('project_id', $project_id)->first();
            if ($existingRecord) {
                $oldFile = $existingRecord->brochure_file;
                $oldFilePath = public_path("user_upload/project_brochure/{$oldFile}");
                if ($oldFile && file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }

            $project_brochure->move($uploadPath, $fileName);

            ProjectAdditional::updateOrCreate(
                ['project_id' => $project_id],
                ['brochure_file' => $fileName]
            );

            return response()->json([
                'success' => 1,
                'message' => 'Brochure Uploaded',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function AddExtraProjectDetails(Request $request)
    {

        try {
            // log::info($request->all());
            if (empty($request->project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Project Id not found',
                ]);
            }
            $this->UpdateAdditionalData($request);
            $this->UpdateProjectLandmarks($request);

            return response()->json([
                'status' => 1,
                'message' => 'Project Updated successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function UpdateAdditionalData($req)
    {
        try {
            $datatoupdate = [];

            $fieldsMap = [
                'overlooking'        => 'overlooking',
                'flooring_style'     => 'flooring_style',
                'water_available'    => 'water_availability',
                'electric_availability' => 'electric_availability',
                'type_of_ownership'     => 'type_of_ownership',
                'instruction'        => 'instruction',
                'approved_by' => 'approved_by',
            ];

            foreach ($fieldsMap as $requestKey => $dbColumn) {
                if ($req->has($requestKey)) {
                    $datatoupdate[$dbColumn] = $req->$requestKey;
                }
            }

            if (!empty($req->project_id) && !empty($datatoupdate)) {
                ProjectAdditional::where('project_id', $req->project_id)->update($datatoupdate);
            }
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function UpdateProjectLandmarks($req)
    {
        try {
            $project_id = $req->project_id;
            $landmarks = json_decode($req->landmarks, true);

            if (isset($landmarks)) {

                $existing_landmarks_types = DB::table('project_landmarks')
                    ->where('project_id', $project_id)
                    ->pluck('landmark_type')
                    ->toArray();


                $removed_landmarks_types = array_diff($existing_landmarks_types, array_keys($landmarks));


                if (count($removed_landmarks_types) > 0) {
                    DB::table('project_landmarks')
                        ->where('project_id', $project_id)
                        ->whereIn('landmark_type', $removed_landmarks_types)
                        ->delete();
                }


                foreach ($landmarks as $landmark_type => $landmark_details) {

                    $landmark_count = count($landmark_details);


                    foreach ($landmark_details as $item) {
                        $landmark_details_string = [
                            'name' => $item['name'] ?? null,
                            'distance' => $item['distance'] ?? null,
                        ];

                        $existingLandmark = DB::table('project_landmarks')
                            ->where('project_id', $project_id)
                            ->where('landmark_type', $item['key']);

                        if ($existingLandmark->exists()) {

                            $update = $existingLandmark->update([
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ]);
                        } else {

                            $data = [
                                'project_id' => $project_id,
                                'landmark_type' => $item['key'],
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ];
                            $insert = DB::table('project_landmarks')->insert($data);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrjBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => 0,
                'message' => 'An error occurred while uploading the project brochure.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function ExtraFileddetails(Request $request)
    {
        try {

            if (empty($request->project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Project Id not found',
                ]);
            }
            $project = PrefProject::where('id', $request->project_id)
                ->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with([
                    'additional',
                    'landmarks',
                ])
                ->first();

            if (!$project) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }


            $formattedLandmarks = [];
            foreach ($project->landmarks as $landmark) {
                $baseKey = preg_replace('/\d+$/', '', $landmark->landmark_type);
                $details = json_decode($landmark->landmark_details, true) ?? [];
                $details[$baseKey . '_count'] = $landmark->landmark_type_count;
                $formattedLandmarks[$baseKey][] = array_merge(['key' => $landmark->landmark_type], $details);
            }


            $projectData = $project->toArray();

            $flattened = array_merge(
                $projectData,
                $projectData['additional'] ?? [],
            );

            foreach (['overlooking', 'flooring_style'] as $key) {
                if (isset($flattened[$key]) && is_string($flattened[$key])) {
                    $flattened[$key] = json_decode($flattened[$key], true);
                }
            }
            $flattened['landmarks'] = $formattedLandmarks;

            $allowedKeys = ['id', 'landmarks', 'overlooking', 'flooring_style', 'water_availability', 'electric_availability', 'type_of_ownership', 'instruction', 'approved_by'];
            $filteredArray = array_intersect_key($flattened, array_flip($allowedKeys));

            // log::info($flattened);
            return response()->json([
                'status' => 1,
                'message' => 'Data retrived successfully',
                'data' => $filteredArray,
            ]);
        } catch (\Exception $e) {
            LOG::info($e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Failed to update property',
                'error' => $e->getMessage()
            ]);
        }
    }
}
