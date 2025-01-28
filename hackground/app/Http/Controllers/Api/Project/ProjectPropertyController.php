<?php

namespace App\Http\Controllers\Api\Project;

use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use App\Models\ProjectProperty;
use App\Models\ProjectProperties;
use App\Models\PrefPropertySetting;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use App\Models\PrefPropertyAdditional;

class ProjectPropertyController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function SaveProjectProperty(Request $request)
    {
        try {
            $tower_data = json_decode($request->input('tower_data'), true);
        $project_id = $request->input('project_id');
        $user_id = $request->input('user_id');

        if (!empty($tower_data)) {
            foreach ($tower_data as $items) {
                foreach ($items['bhk_type_data'] as $bhkdata) {

                    $insertMain = PrefProperty::create(['uid' => $user_id]);
                    $prop_ID = $insertMain->id;

                    $insertSetting = PrefPropertySetting::create([
                        'pid' => $prop_ID,
                        'carpet_area' => $bhkdata['carpet_area'],
                        'super_area' => $bhkdata['super_area'],
                        'expected_price' => $bhkdata['property_price'],
                    ]);

                    $insertAdditional = PrefPropertyAdditional::create([
                        'pid' => $prop_ID,
                        'bhk_type' => $bhkdata['bhk_type'],
                    ]);

                    $insertLocation = PrefPropertyLocation::create([
                        'pid' => $prop_ID,
                    ]);

                    $insertProjectProperty = ProjectProperties::create([
                        'project_id' => $project_id,
                        'tower_name' => $items['tower_name'],
                        'lift_no' => $items['lift_no'],
                        'floor_no' => $items['floor_no'],
                        'flats_per_floor' => $items['flats_per_floor'],
                        'property_id' => $prop_ID,
                    ]);
                }
            }
        }

        return response()->json([
            'status' => 1,
            'message' => 'Properties added successfully',
        ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
        
    }
}
