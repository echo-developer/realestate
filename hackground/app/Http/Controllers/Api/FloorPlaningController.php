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

       
        $floorPlans = FloorPlan::where('status',true)->with(['names' => function ($query) use ($lang) {
                $query->where('lang', $lang);
            }])
            ->get();

       
        $allFloorPlanTypes = PrefFloorPlanType::where('status',true)->with(['names' => function ($query) use ($lang) {
            $query->where('lang', $lang);
        }])->get();

        
        $transformedFloorPlanTypes = $allFloorPlanTypes->map(function ($type) {
            $name = $type->names->first()->type ?? null; 
            return [
                'id' => $type->id,
                'slug' => $type->slug,
                'name' => $name,
            ];
        });

        $allFloorPlanItems = [];

       
        foreach ($floorPlans as $plan) {
      
            foreach ($plan->names as $name) {
               
                $allFloorPlanItems[] = [
                    'item_id' => $name->fp_id,  
                    'item' => $name->item,   
                    'type_id'=> $plan->fp_type
                ];
            
        }
        }

      
        return response()->json([
            'status' => 1,
            'message' => 'Data retrieved successfully.',
            'data' => [
                'floor_plan_types' => $transformedFloorPlanTypes,
                'floor_plans' => $allFloorPlanItems
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
