<?php

namespace App\Http\Controllers\Api;

use App\Models\FloorPlan;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Models\FloorPlanName;
use App\Models\PrefFloorPlanType;
use App\Models\PrefFloorPlanValue;
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

        // Retrieve all floor plans with associated names
        $floorPlans = FloorPlan::where('status', true)->with(['names' => function ($query) use ($lang) {
            $query->where('lang', $lang);
        }])->get();

        // Retrieve all floor plan types with associated names
        $allFloorPlanTypes = PrefFloorPlanType::where('status', true)->with(['names' => function ($query) use ($lang) {
            $query->where('lang', $lang);
        }])->get();

        // Transform floor plan types for response
        $transformedFloorPlanTypes = $allFloorPlanTypes->map(function ($type) {
            $name = $type->names->first()->type ?? null;
            return [
                'id' => $type->id,
                'slug' => $type->slug,
                'name' => $name,
            ];
        });

        // Initialize an array to hold all the floor plan items
        $allFloorPlanItems = [];

        // Loop through each floor plan and collect data
        foreach ($floorPlans as $plan) {
            foreach ($plan->names as $name) {

                // Retrieve additional values from floor_plan_values table based on item_id (fp_id)
                $additionalValues = PrefFloorPlanValue::where('fp_id', $name->fp_id)
                    ->where('project_id', $projectId)  // Optional: Filter by project if needed
                    ->first();

                // Add item data along with any additional values found
                $allFloorPlanItems[] = [
                    'item_id' => $name->fp_id,
                    'item' => $name->item,
                    'type_id' => $plan->fp_type,
                    'description' => $additionalValues ? $additionalValues->desc : null,  
                ];
            }
        }

        // Return the response with floor plan types and floor plans with additional values
        return response()->json([
            'status' => 1,
            'message' => 'Data retrieved successfully.',
            'data' => [
                'floor_plan_types' => $transformedFloorPlanTypes,
                'floor_plans' => $allFloorPlanItems
            ]
        ]);
    } catch (\Throwable $e) {
        throw $e;
    }
}
 

public function addFloorPlan(Request $req)
{
    try {
        // Retrieve the floor_data and project_id from the request
        $floorData = json_decode($req->input('floor_data'), true); // Decode the JSON string into an array
        $projectId = $req->input('project_id'); // Get the project_id

        // Loop through each floor plan and save or update it
        foreach ($floorData as $floorPlan) {
            // If 'id' is not provided, create a new floor plan
            if (!isset($floorPlan['id'])) {
           
                $floorPlanCreated = FloorPlan::create([   
                    'fp_type' => $floorPlan['type_id'],    
                ]);
             
                    FloorPlanName::create([
                        'fp_id' => $floorPlanCreated->id,  
                        'item' => $floorPlan['item'],                  
                        'lang' => 'en',                  
                    ]);
                

                // Use the new floor plan ID
                $fp_id = $floorPlanCreated->id;
            } else {
                // Use the provided floor plan ID if it exists
                $fp_id = $floorPlan['id'];
            }

            // Extract other fields
            $fpt_id = $floorPlan['type_id'];
            $description = $floorPlan['description'];

            // Insert or update the floor plan value in the 'floor_plan_values' table
            PrefFloorPlanValue::updateOrCreate(
                [
                    'project_id' => $projectId,  
                    'fpt_id' => $fpt_id,         
                    'fp_id' => $fp_id,            
                ],
                [
                    'desc' => $description,  // Insert or update the description
                ]
            );
        }

        // Return a success response
        return response()->json([
            'status' => 1,
            'message' => 'Floor plans added/updated successfully!',
        ]);
    } catch (\Throwable $e) {
        throw $e;
    }
}

    
    
}
