<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use PhpParser\Node\Stmt\TryCatch;
use App\Http\Controllers\Controller;

class ProjectHomeController extends Controller
{
   protected $apiModel;


   public function __construct(ApiModel $apiModel)
   {
      $this->apiModel = $apiModel;
   }
   function  GetProjects()
   {
      try {

         $featuredProjects = PrefProject::where([
            ['is_featured',true ], 
            ['status', '=', config('constants.STATUS_ACTIVE')] 
         ])
            ->with(
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            )
            ->get();

         $flattenProject = function ($project) {
            $flattened = [];
            $project['uid'] = get_user_name($project['uid']);
            $project['location']['city'] = get_name_by_id('pref_city_names', 'city_id', $project['location']['city'], 'en');
            $project['additional']['possession_status'] = get_name_by_id('pref_property_status_names', 'status_id', $project['additional']['possession_status'], 'en');

            $projectAmenities = $this->sanitizeAmenityIds($project['additional']['project_amenity']);
            $project['additional']['project_amenity'] = $this->apiModel->getPropertyAmnitybyID($projectAmenities);

            $project['settings']['project_type'] = get_name_by_id('pref_property_category_names', 'category_id',  $project['settings']['project_type'], 'en');

            $project['settings']['project_furnish'] = get_name_by_id('pref_property_furnish_names', 'furnish_id', $project['settings']['project_furnish'], 'en');


            foreach ($project['gallery'] as &$gallery) {
               foreach ($gallery['images'] as &$image) {
                  // Replace the filename with the full URL
                  $image['file'] = asset('user_upload/project_images/' . $image['filename']);
                  unset($image['filename']);
               }
            }
            if (isset($project['settings'])) {
               $flattened = array_merge($flattened, $project['settings']->toArray());
               unset($project['settings']);
            }

            if (isset($project['additional'])) {
               $flattened = array_merge($flattened, $project['additional']->toArray());
               unset($project['additional']);
            }

            if (isset($project['location'])) {
               $flattened = array_merge($flattened, $project['location']->toArray());
               unset($project['location']);
            }

            $flattened = array_merge($flattened, $project->toArray());

            return $flattened;
         };


         $flattenedFeaturedProjects = $featuredProjects->map(function ($project) use ($flattenProject) {
            return $flattenProject->call($this, $project);
         });




         $newProject = PrefProject::where([
            ['created_at', '>=', now()->subDays(7)],  
            ['status', '=', config('constants.STATUS_ACTIVE')]  
         ])
            ->with([
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

         $flattenedNewProjects = $newProject->map(function ($project) use ($flattenProject) {
            return $flattenProject->call($this, $project);
         });

         $populerProject = PrefProject::where([
            ['is_popular', '=', true],  
            ['status', '=', config('constants.STATUS_ACTIVE')]  
         ])
            ->with([
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

         $flattenedPopulerProjects = $populerProject->map(function ($project) use ($flattenProject) {
            return $flattenProject->call($this, $project);
         });


         $topProject = PrefProject::where([
            ['is_top', '=', true],  
            ['status', '=', config('constants.STATUS_ACTIVE')]  
         ])
            ->with([
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

         $flattenedTopProjects = $topProject->map(function ($project) use ($flattenProject) {
            return $flattenProject->call($this, $project);
         });
         
         return response()->json([
            'status' => 1,
            'message' => 'success',
            'data' => ['featured_project' => $flattenedFeaturedProjects, 'new_project' => $flattenedNewProjects,'populer_project'=>$flattenedPopulerProjects,'top_project'=>$flattenedTopProjects]
         ]);


         return response()->json([
            'status' => 0,
            'message' => 'No project is featured',
         ]);
      } catch (\Throwable $th) {
         return response()->json([
            'status' => 0,
            'message' => 'something wrong!',
            'error' => $th->getMessage()
         ]);
      }
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
