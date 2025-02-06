<?php

namespace App\Http\Controllers\Admin;

use App\Models\FloorPlan;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use App\Models\FloorPlanName;
use App\Models\PrefFloorPlanType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class FloorPlanController extends Controller
{

    public function view()
    {
        $floorPlanTypes = PrefFloorPlanType::with(['names' => function ($query) {
            $query->where('lang', 'en');
        }])->get();

        $project = PrefProject::where([
            ['status', 1],
            ['is_deleted', false],
        ])->select(['id', 'project_name', 'slug'])
            ->get();

        return view('Admin.Project_Setting.floor_plan', compact('floorPlanTypes', 'project'));
    }

    public function addFloorPlan(Request $req)
    {
        // Validate the request
        $validated = $req->validate([
            'type' => 'required|integer',
            'project' => 'required|integer',
            'title' => 'required|array',
            'desc' => 'required|array',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
           
            $floorPlan = FloorPlan::create([
                'project_id' => $req->project,
                'status' => $req->status,
                'fp_type' => $req->type,
            ]);

          
            foreach ($req->title as $lang => $title) {
                FloorPlanName::create([
                    'fp_id' => $floorPlan->id,
                    'item' => $title,
                    'desc' => $req->desc[$lang],
                    'lang' => $lang
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Floor Plan added successfully!',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
