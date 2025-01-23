<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class ProjectDeleteController extends Controller
{
    public function ProjectDelete(Request $request)
    {
        try {
            $project = PrefProject::find($request->project_id);

            $project->is_deleted =  config('constants.STATUS_ACTIVE');
            $project->save();
            return response()->json([
                'status' => 1,
                'message' => 'Project Deleted',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ChangeUserPassword: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }
}
