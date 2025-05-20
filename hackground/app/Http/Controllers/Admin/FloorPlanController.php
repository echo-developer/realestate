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

        $floorPlan = FloorPlan::where('status', '!=', -1)->with(['names' => function ($query) {
            $query->where('lang', 'en');
        }])->get();


        return view('Admin.Project_Setting.floor_plan', compact('floorPlanTypes', 'floorPlan'));
    }

    public function addFloorPlan(Request $req)
    {
        try {
            Log::info($req->all());

            // Validate input
            $validated = $req->validate([
                'type' => 'required|integer',
                'title' => 'required|array',
                'status' => 'required|boolean',
            ]);

            Log::info($validated);

            DB::beginTransaction();
            $floorPlan = FloorPlan::create([
                'status' => $req->status,
                'fp_type' => $req->type,
            ]);

            foreach ($req->title as $lang => $title) {
                FloorPlanName::create([
                    'fp_id' => $floorPlan->id,
                    'item' => $title,
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
    public function updateFloorPlan(Request $req, $id)
    {
        try {
            Log::info($req->all());

            // Validate input
            $validated = $req->validate([
                'type' => 'required|integer',
                'title' => 'required|array',
                'status' => 'required|boolean',
            ]);

            DB::beginTransaction();

            // Find existing FloorPlan
            $floorPlan = FloorPlan::findOrFail($id);

            // Update fields
            $floorPlan->status = $req->status;
            $floorPlan->fp_type = $req->type;
            $floorPlan->save();

            // Option 1: Delete old titles and recreate (safe and simple)
            FloorPlanName::where('fp_id', $floorPlan->id)->delete();

            foreach ($req->title as $lang => $title) {
                FloorPlanName::create([
                    'fp_id' => $floorPlan->id,
                    'item' => $title,
                    'lang' => $lang,
                ]);
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Floor Plan updated successfully!',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }



    public function getFloorPlan($id)
    {
        $floorPlan = FloorPlan::with('names')->findOrFail($id);

        return response()->json([
            'success' => true,
            'floorPlan' => $floorPlan
        ]);
    }

    public function updateStatus(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'status' => 'required|boolean',
        ]);

        // Find the floor plan by ID
        $floorPlan = FloorPlan::find($request->id);

        if (!$floorPlan) {
            return response()->json([
                'success' => false,
                'message' => 'Floor Plan not found.',
            ]);
        }

        // Update the status
        $floorPlan->status = $request->status;
        $floorPlan->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully!',
        ]);
    }

    public function floorPlanDelete(Request $req)
    {
        $req->validate([
            'id' => 'required', // Ensure the floor plan ID exists
        ]);

        // Find the floor plan by ID
        $floorPlan = FloorPlan::find($req->id);

        if ($floorPlan) {

            $floorPlan->status = -1;
            $floorPlan->save();

            return response()->json([
                'success' => true,
                'message' => 'Floor plan deleted successfully!'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Floor plan not found.'
        ]);
    }
}
