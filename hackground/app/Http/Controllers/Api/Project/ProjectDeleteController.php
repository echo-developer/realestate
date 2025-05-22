<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefProperty;
use App\Models\ProjectPropertyMapping;

class ProjectDeleteController extends Controller
{
    public function ProjectDelete(Request $request)
    {
        try {
            $project = PrefProject::find($request->project_id);
            $project_property_ids =  ProjectPropertyMapping::where('project_id', $request->project_id)->pluck('property_id');

            if (!empty($project_property_ids)) {
                foreach ($project_property_ids as $pid) {
                    PrefProperty::where('id', $pid)->update(['is_deleted' => config('constants.STATUS_ACTIVE')]);
                }
            }
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
