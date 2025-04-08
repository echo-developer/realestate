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
               'galleries',
               'galleries.images'
            ])->orderBy('created_at', 'desc')->limit(12)->get();

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
      } catch (\Throwable $e) {
         throw $e;
     }
   }

   /**
    * Flatten and transform the project data safely
    */
   private function flattenProject($project, $user_id)
   {
      $flattened = [];

      $is_favourite = !empty($user_id) && DB::table('my_favorite_project')
         ->where('uid', $user_id)
         ->where('project_id', $project->id)
         ->value('status') == config('constants.STATUS_ACTIVE');



      // Safely retrieve values
      $project['uid'] = get_user_name($project['uid'] ?? '');
      $project['is_favourite'] = $is_favourite;
      $project['image_count'] = getGalleriesCount($project->id , 'project');

      if (!empty($project->location)) {
         $project->location->city = get_name_by_id('city_names', 'city_id', $project->location->city ?? null, 'en');
      }

      if (!empty($project->additional)) {
         $project->additional->possession_status = get_name_by_id('property_status_names', 'status_id', $project->additional->possession_status ?? null, 'en');
         $projectAmenities = $this->sanitizeAmenityIds($project->additional->project_amenity ?? []);
         $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
      }

      if (!empty($project->settings)) {
         $project->settings->project_type = get_name_by_id('property_category_names', 'category_id', $project->settings->project_type ?? null, 'en');
         $project->settings->project_furnish = get_name_by_id('property_furnish_names', 'furnish_id', $project->settings->project_furnish ?? null, 'en');
      }

      if (!empty($project->galleries)) {
         $firstGallery = collect($project->galleries)->first();

         if (!empty($firstGallery) && !empty($firstGallery['images'])) {
            $firstImage = collect($firstGallery['images'])->first();

            $project->gallery = [[
               'id' => $firstGallery['id'],
               'image_type' => $firstGallery['image_type'],
               'description' => $firstGallery['description'],
               'images' => [[
                  'id' => $firstImage['id'],
                  'file' => asset('user_upload/project_images/' . $firstImage['filename']),
                  'caption' => $firstImage['caption'] ?? '',
               ]]
            ]];

            unset($project->galleries);
         }
      }

      if (!empty($project->settings)) {
         $flattened = array_merge($flattened, $project->settings->toArray());
         unset($project->settings);
      }
      if (!empty($project->additional)) {
         $flattened = array_merge($flattened, $project->additional->toArray());
         unset($project->additional);
      }
      if (!empty($project->location)) {
         $flattened = array_merge($flattened, $project->location->toArray());
         unset($project->location);
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
