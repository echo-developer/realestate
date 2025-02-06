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

        $floorPlan = FloorPlan::with(['names' => function ($query) {
            $query->where('lang', 'en');
        }])->get();


        return view('Admin.Project_Setting.floor_plan', compact('floorPlanTypes', 'floorPlan'));
    }

    public function addFloorPlan(Request $req)
    {
        Log::info($req->all()); // This will log the entire request data.

        // Validate the request
        $validated = $req->validate([
            'type' => 'required|integer',
            'title' => 'required|array',
            'order' => 'required|integer',
            'status' => 'required|boolean',
        ]);

        // Log the validated data to ensure everything is correct
        Log::info($validated);

        DB::beginTransaction();
        try {
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
            ]);
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
}
