<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefFloorPlanType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FloorPlaningController extends Controller
{
    protected $apiModel;
    public function __construct(ApiModel $apiModel)
    {
        $this->apiModel = $apiModel;
    }

    public function floorPlanType(Request $req)
    {
        try {
            $lang = $req->input('lang', 'en');

            $floorPlan = PrefFloorPlanType::where('status', '=', config('constants.STATUS_ACTIVE'))
            ->with(['names' => function ($query) use ($lang) { 
                $query->where('lang', '=', $lang);
            }])
            ->get();

            if ($floorPlan->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $floorPlan,
            ]);

        } catch (\Exception $e) {

            Log::error('Error in getSearchedProjects: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong. Please try again later.',
            ]);
        }
    }
}
