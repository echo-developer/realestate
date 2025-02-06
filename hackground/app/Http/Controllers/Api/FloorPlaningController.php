<?php

namespace App\Http\Controllers\Api;

use App\Models\FloorPlan;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Models\PrefFloorPlanType;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class FloorPlaningController extends Controller
{
    protected $apiModel;
    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }

    public function floorPlan(Request $req)
    {
        try {
            $lang = $req->input('lang', 'en');
            $projectId = $req->input('project_id'); // Get project ID from request

            if (!$projectId) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Project ID is required.'
                ]);
            }

            // Fetch Floor Plans for the given project
            $floorPlans = FloorPlan::where('project_id', $projectId)
                ->with(['names' => function ($query) use ($lang) {
                    $query->where('lang', $lang);
                }])
                ->get();

            if ($floorPlans->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No floor plans found for this project.',
                    'data' => []
                ]);
            }

            // Get distinct floor plan types used in this project
            $floorPlanTypes = PrefFloorPlanType::whereIn('id', $floorPlans->pluck('fp_type'))
                ->with(['names' => function ($query) use ($lang) {
                    $query->where('lang', $lang);
                }])
                ->get();

            $transformedfloorPlanTypes = $floorPlanTypes->map(function ($type) {
                $name = $type->names->first()->type ?? null; // Set 'name' from 'type'
                return [
                    'id' => $type->id,
                    'slug' => $type->slug,
                    'status' => $type->status,
                    'name' => $name, // Set name based on the first language (e.g., 'en')
                ];
            })->values();
            $structuredData = [];

            foreach ($floorPlans as $plan) {
                // Find the floor plan type name
                $type = $floorPlanTypes->firstWhere('id', $plan->fp_type);
                $category = $type ? ($type->slug ?? 'Other') : 'Other';

                if (!isset($structuredData[$category])) {
                    $structuredData[$category] = [];
                }

                foreach ($plan->names as $name) {
                    $structuredData[$category][] = [
                        'item' => $name->item,
                        'description' => $name->desc
                    ];
                }
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => [
                    'floor_plan_types' => $transformedfloorPlanTypes,
                    'floor_plans' => $structuredData
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in floorPlanType: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong. Please try again later.'
            ]);
        }
    }

    public function addFloorPlan(){




        
    }
}
