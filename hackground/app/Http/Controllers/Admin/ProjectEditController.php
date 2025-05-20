<?php

namespace App\Http\Controllers\Admin;

use App\Models\PrefProject;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProjectGallery;
use App\Models\ProjectSetting;
use App\Models\ProjectLocation;
use App\Models\ProjectAdditional;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\ProjectGalleryImages;

class ProjectEditController extends Controller
{
    public function editProjectData(Request $request)
    {
        log_anything($request->all());
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



        try {
            // Update project details
            $this->saveProject($project, $request);
            $this->saveProjectLocation($project->id, $request);
            $this->saveProjectSettings($project->id, $request);
            $this->saveProjectAdditional($project->id, $request);
            $this->savelandmarks($project->id, $request);
            $this->saveProjectGalleries($project->id, $request);

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
            'project_name' => $request->project_name ?? $project->project_name,
            'project_desc' => $request->description ?? $project->project_desc,
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
            'post_for' => 'post_for',
            'project_facing'  => 'facing_direction',
            'total_towers' => 'total_tower',
            'total_area' => 'total_area',
            'occupied_area' => 'occupied_area',
            'total_units' => 'total_units',
            'project_furnish' => 'project_furnish',
            'project_type' => 'project_type',
        ], $request);

        if (!empty($updateData)) {
            ProjectSetting::where('project_id', $projectId)->update($updateData);
        }
    }
    private function savelandmarks($projectId, Request $request)
    {
        // Define landmark types and their corresponding input names
        $landmarkTypes = [
            'education' => 'education_name',
            'healthcare' => 'healthcare_name',
            'shopping' => 'shopping-center_name',
            'commercial' => 'commercial-hub_name',
            'transport' => 'transportation_name'
        ];

        $existingLandmarks = DB::table('project_landmarks')
            ->where('project_id', $projectId)
            ->get()
            ->keyBy('landmark_type'); // Store existing landmarks by type for easy lookup

        $insertData = [];
        $updatedLandmarks = [];

        foreach ($landmarkTypes as $key => $nameField) {
            $distanceField = str_replace('_name', '_distance', $nameField); // Get corresponding distance field

            if ($request->has($nameField) && is_array($request->$nameField)) {
                $count = 1; // Start numbering (education1, education2, etc.)

                foreach ($request->$nameField as $index => $name) {
                    $distance = $request->$distanceField[$index] ?? null;

                    // Skip empty values
                    if (!empty($name) && !empty($distance)) {
                        $landmarkType = $key . $count;

                        $landmarkDetails = json_encode([
                            'name' => $name,
                            'distance' => $distance
                        ]);

                        if (isset($existingLandmarks[$landmarkType])) {
                            // Update existing landmark if values are different
                            if ($existingLandmarks[$landmarkType]->landmark_details !== $landmarkDetails) {
                                DB::table('project_landmarks')
                                    ->where('id', $existingLandmarks[$landmarkType]->id)
                                    ->update([
                                        'landmark_details' => $landmarkDetails,
                                    ]);
                            }
                            $updatedLandmarks[] = $landmarkType; // Mark as updated
                        } else {
                            // Insert new landmark
                            $insertData[] = [
                                'project_id' => $projectId,
                                'landmark_type' => $landmarkType,
                                'landmark_type_count' => count($request->$nameField), // Total landmarks in this type
                                'landmark_details' => $landmarkDetails,
                            ];
                        }

                        $count++; // Increment for next entry
                    }
                }
            }
        }

        // Insert new data if available
        if (!empty($insertData)) {
            DB::table('project_landmarks')->insert($insertData);
        }

        // Remove old landmarks that were not updated (i.e., removed from the request)
        $landmarksToDelete = array_diff($existingLandmarks->keys()->toArray(), $updatedLandmarks);
        if (!empty($landmarksToDelete)) {
            DB::table('project_landmarks')
                ->where('project_id', $projectId)
                ->whereIn('landmark_type', $landmarksToDelete)
                ->delete();
        }
    }

    private function saveProjectAdditional($projectId, Request $request)
    {
        $updateData = $this->filterUpdateData([
            'main_road_facing' => 'main_road_facing',
            'project_amenity' => 'amenities',
            'possession_status' => 'possession_status',
            'currency' => 'currency',
            'token_amount' => 'project_token',
            'expected_price' => 'project_price',
            'developer_details' => 'developer_details',
            'developer_name' => 'developer_name',
            'developer_experience' => 'developer_experience',
            'instruction' => 'instruction',
            'construct_year' => 'age_of_construction',
            'water_availability'    => 'water_availability',
            'electric_availability' => 'electricity_status',
            'type_of_ownership'     => 'ownership_type',

        ], $request);

        if ($request->filled('main_road_facing')) {
            $updateData['main_road_facing'] = strtolower($request->main_road_facing) === 'yes' ? 'Y' : 'N';
        }
        if ($request->filled('month') || $request->filled('year')) {
            $updateData['possesion_month_possesion_year'] = trim("{$request->filled('month')}" . ($request->filled('month') && $request->filled('year') ? '-' : '') . "{$request->filled('year')}");
        }
        if ($request->filled('overlooking')) {
            $updateData['overlooking'] = is_array($request->overlooking)
                ? json_encode($request->overlooking)
                : json_encode([$request->overlooking]);
        }
        if ($request->filled('flooring_style')) {
            $updateData['flooring_style'] = is_array($request->flooring_style)
                ? json_encode($request->flooring_style)
                : json_encode([$request->flooring_style]);
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
        $galleries = $request->uploadedFiles;

        if (!$galleries) {
            return;
        }

        if (is_string($galleries)) {
            $galleries = json_decode($galleries, true);
        }

        if (!is_array($galleries)) {
            return;
        }

        foreach ($galleries as $imageType => $imagesJson) {
            // Decode JSON-encoded image names
            $images = json_decode($imagesJson, true);
            if (!is_array($images)) {
                continue;
            }

            // Create or update gallery entry
            $gallery = ProjectGallery::updateOrCreate(
                ['project_id' => $projectId, 'image_type' => $imageType],
                ['project_id' => $projectId, 'image_type' => $imageType]
            );

            // Get existing images in the database
            $existingImages = ProjectGalleryImages::where('gallary_id', $gallery->id)
                ->pluck('filename')
                ->toArray();

            // Find images to delete
            $imagesToDelete = array_diff($existingImages, $images);
            if (!empty($imagesToDelete)) {
                ProjectGalleryImages::where('gallary_id', $gallery->id)
                    ->whereIn('filename', $imagesToDelete)
                    ->delete();
            }

            // Add or update new images
            foreach ($images as $imageName) {
                ProjectGalleryImages::updateOrCreate(
                    ['gallary_id' => $gallery->id, 'filename' => $imageName],
                    ['gallary_id' => $gallery->id, 'filename' => $imageName, 'caption' => null]
                );
            }
        }
    }
}
