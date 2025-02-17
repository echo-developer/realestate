<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PhpParser\Node\Stmt\TryCatch;

class ProjectHomeController extends Controller
{
   protected $apiModel;


   public function __construct(ApiModel $apiModel)
   {
      $this->apiModel = $apiModel;
   }
   function GetProjects(Request $request)
   {
      try {
         // Fetch different types of projects
         $user_id = $request->input('user_id');
         $projectTypes = [
            'featured_project' => ['is_featured', true],
            'new_project' => ['created_at', '>=', now()->subDays(7)],
            'populer_project' => ['is_popular', true],
            'top_project' => ['is_top', true]
         ];

         $projectsData = [];

         foreach ($projectTypes as $key => $condition) {
            $query = PrefProject::where([
               [$condition[0], $condition[1]],
               ['status', '=', config('constants.STATUS_ACTIVE')],
               ['is_deleted', '=', FALSE]
            ])->with([
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            ])->orderBy('created_at', 'desc')->get();

            // Flatten and transform the data
            $projectsData[$key] = $query->map(function ($project) use ($user_id) {
               return $this->flattenProject($project, $user_id);
            });
         }

         return response()->json([
            'status' => 1,
            'message' => 'success',
            'data' => $projectsData
         ]);
      } catch (\Throwable $th) {
         return response()->json([
            'status' => 0,
            'message' => 'Something went wrong!',
            'error' => $th->getMessage()
         ]);
      }
   }

   /**
    * Flatten and transform the project data safely
    */
   private function flattenProject($project, $user_id)
   {
      $flattened = [];

      $is_favourite = !empty($user_id) && DB::table('pref_my_favorite_project')
         ->where('uid', $user_id)
         ->where('project_id', $project->id)
         ->value('status') == config('constants.STATUS_ACTIVE');



      // Safely retrieve values
      $project['uid'] = get_user_name($project['uid'] ?? '');
      $project['is_favourite'] = $is_favourite;

      if (!empty($project->location)) {
         $project->location->city = get_name_by_id('pref_city_names', 'city_id', $project->location->city ?? null, 'en');
      }

      if (!empty($project->additional)) {
         $project->additional->possession_status = get_name_by_id('pref_property_status_names', 'status_id', $project->additional->possession_status ?? null, 'en');
         $projectAmenities = $this->sanitizeAmenityIds($project->additional->project_amenity ?? []);
         $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
      }

      if (!empty($project->settings)) {
         $project->settings->project_type = get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type ?? null, 'en');
         $project->settings->project_furnish = get_name_by_id('pref_property_furnish_names', 'furnish_id', $project->settings->project_furnish ?? null, 'en');
      }

      // Safely process gallery images
      if (!empty($project->gallery)) {
         foreach ($project->gallery as &$gallery) {
            if (!empty($gallery->images)) {
               foreach ($gallery->images as &$image) {
                  $image['file'] = asset('user_upload/project_images/' . ($image->filename ?? ''));
                  unset($image->filename);
               }
            }
         }
      }

      // Merge data only if relationships exist
      if (!empty($project->settings)) {
         $flattened = array_merge($flattened, $project->settings->toArray());
      }
      if (!empty($project->additional)) {
         $flattened = array_merge($flattened, $project->additional->toArray());
      }
      if (!empty($project->location)) {
         $flattened = array_merge($flattened, $project->location->toArray());
      }

      $flattened = array_merge($flattened, $project->toArray());

      return $flattened;
   }



   function getProjectsData()
   {
      try {

         $project = PrefProject::where('status', config('constants.STATUS_ACTIVE'))->get()->makeHidden(['project_desc', 'status', 'is_deleted', 'is_featured', 'views', 'is_popular', 'created_at', 'uid']);
         if ($project->isNotEmpty()) {
            return response()->json([
               'status'  => 1,
               'message' => 'Projects successfully fetched.',
               'data'    => $project
            ]);
         }
         return response()->json([
            'status'  => 0,
            'message' => 'No projects found.'
         ]);
      } catch (\Throwable $th) {
         return response()->json([
            'status'  => 0,
            'message' => 'An error occurred while fetching projects.',
            'error'   => $th->getMessage()
         ]);
      }
   }

   function sanitizeAmenityIds($idsString)
   {
      return array_map('trim', explode(',', trim($idsString, '[]"')));
   }
}
