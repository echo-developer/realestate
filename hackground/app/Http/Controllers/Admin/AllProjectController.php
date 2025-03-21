<?php

namespace App\Http\Controllers\Admin;

use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AllProjectController extends Controller
{
    public function AllProjectView(Request $request)
    {
       
        $paginate = 10;
        $statusMapping = config('property_status.status');
        $term = $request->input('term');
        $user_id = $request->route('uid');

        $query = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
            ->with([
            'settings:project_id,project_budget,parking_availability',
            'additional:project_id,expected_price',
            'location:project_id,address',
            'gallery:id,project_id,image_type',
            'gallery.images:gallary_id,filename,caption'
            ]);

        if ($term) {
            $query->where(function ($q) use ($term) {
            $q->where('project_name', 'like', "%{$term}%")
                ->orWhereHas('location', function ($q) use ($term) {
                $q->where('address', 'like', "%{$term}%");
                });
            });
        }

        if ($user_id) {
            $query->where('uid', $user_id);
        }
        $project = $query->paginate($paginate);
        return view('Admin.All_project.all-project', compact('project', 'statusMapping','user_id'));
    }

    public function FeaturedStatus(Request $req)
    {

        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_featured = $req->status;
        $project->save();

        return [
            'message' => 'Featured status updated.',
        ];
    }
    public function TopStatus(Request $req) {
        $project = PrefProject::find($req->id);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_top = $req->status;
        $project->save();

        return [
            'message' => 'Featured status updated.',
        ];
    }
    public function Propertydelete(Request $req)
    {
        $project = PrefProject::find($req->propertyId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->is_deleted =  config('constants.STATUS_ACTIVE');
        $project->save();

        set_flash_message('delete');
        return [
            'message' => 'Property deleted successfully.',
        ];
    }

    public function PropStatusupdate(Request $req)
    {
        $status = $req->status;

        $statusMapping = config('property_status.status');
        $statusKey = array_search($status, $statusMapping);

        $project = PrefProject::find($req->propertyId);

        if (!$project) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'error'
            ]);
        }
        $project->status = $statusKey;
        $project->save();
        set_flash_message('update');
        return [
            'message' => 'Property Status changed.',
        ];
    }
}
