<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;

class ProjectHomeController extends Controller
{
   function  GetProjects() {

      



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
