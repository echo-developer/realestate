<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use PhpParser\Node\Stmt\TryCatch;
use App\Http\Controllers\Controller;

class ProjectHomeController extends Controller
{
   function  GetProjects()
   {

      try {

         $featuredProject = PrefProject::where('is_featured', true)
            ->with(
               'settings',
               'additional',
               'location',
               'gallery',
               'gallery.images'
            )
            ->get();
            $featuredProject->each(function ($project) {
               // Extract the settings and additional data
               $settings = $project->settings;
               $additional = $project->additional;
           
               // Remove the settings and additional keys from the project
               unset($project->settings);
               unset($project->additional);
           
               // Add settings and additional data outside the main project object
             $settings;
             $additional;
           });
         $newProject = PrefProject::where([
            ['created_at', '>=', '2025-01-24 14:36:27'],
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
         
         if ($featuredProject->count() == true) {
            return response()->json([
               'status' => 1,
               'message' => 'success',
               'data' => ['featured_project' => $featuredProject, 'new_project' => $newProject]
            ]);
         }
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
}
