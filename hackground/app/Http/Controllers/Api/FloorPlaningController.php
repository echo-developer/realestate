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
            $projectId = $req->input('project_id'); 

          
            $floorPlans = FloorPlan::where('project_id', $projectId)
                ->with(['names' => function ($query) use ($lang) {
                    $query->where('lang', $lang);
                }])
                ->get();

          



            $allFloorPlanTypes = PrefFloorPlanType::with(['names' => function ($query) use ($lang) {
                $query->where('lang', $lang);
            }])->get();

            // Transform floor plan types to include the 'name' field and remove the 'names' field
            $transformedfloorPlanTypes = $allFloorPlanTypes->map(function ($type) {
                $name = $type->names->first()->type ?? null; // Set 'name' from 'type'
                return [
                    'id' => $type->id,
                    'slug' => $type->slug,
                    'status' => $type->status,
                    'name' => $name, // Set name based on the first language (e.g., 'en')
                ];
            });

            // Format the data for floor plans
            $structuredData = [];

            // Iterate over all floor plan types
            foreach ($transformedfloorPlanTypes as $type) {
                $category = $type['slug']; // Get category based on the slug (e.g., 'kitchen', 'floor', etc.)

                // Initialize an empty array for each category (type)
                if (!isset($structuredData[$category])) {
                    $structuredData[$category] = [];
                }

                // Find floor plans for the current category (type)
                foreach ($floorPlans as $plan) {
                    if ($plan->fp_type == $type['id']) {
                        foreach ($plan->names as $name) {
                            $structuredData[$category][] = [
                                'item' => $name->item,
                                'description' => $name->desc
                            ];
                        }
                    }
                }

                if (!isset($structuredData[$category])) {
                    $structuredData[$category] = [];
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


    public function addFloorPlan() {}
}
