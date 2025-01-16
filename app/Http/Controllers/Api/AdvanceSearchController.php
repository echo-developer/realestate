<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdvanceSearchController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function MainQuery()
    {
        $query = $this->apiModel->basePropertyQuery();

        $query->addSelect(
            'pref_properties_settings.super_area',
            'pref_properties_settings.property_budget as budget_id',

            'pref_property_additional.possession_status',
            'pref_property_additional.property_amenity',
            'pref_properties_settings.super_area',
            'pref_properties_settings.property_budget',
            'pref_property_additional.is_personal_washroom',
            'pref_property_additional.pantry_cafeteria_status',
            'pref_property_additional.is_corner_shop',
            'pref_property_additional.faces_main_road',
            'pref_property_additional.washroom',
            'pref_property_additional.flooring_style',
            'pref_property_additional.expected_possesion_month_year',
            'pref_property_additional.property_furnish',
            'pref_property_additional.electric_available',
            'pref_property_additional.water_available',
            'pref_property_additional.lifts_in_tower',
            'pref_property_additional.flat_each_floor',
            'pref_property_additional.facing_direction',
            'pref_property_additional.car_parking',
            'pref_property_additional.overlooking',
            'pref_property_additional.ownership_type',
            'pref_property_additional.property_desc',
        )
            ->leftJoin('pref_property_additional', 'pref_properties.id', '=', 'pref_property_additional.pid')
            ->groupBy(
                'pref_properties_settings.super_area',
                'pref_properties_settings.property_budget',

                'pref_property_additional.property_amenity',
                'pref_property_additional.possession_status',
                'pref_properties_settings.super_area',
                'pref_properties_settings.property_budget',
                'pref_property_additional.is_personal_washroom',
                'pref_property_additional.pantry_cafeteria_status',
                'pref_property_additional.is_corner_shop',
                'pref_property_additional.faces_main_road',
                'pref_property_additional.washroom',
                'pref_property_additional.flooring_style',
                'pref_property_additional.expected_possesion_month_year',
                'pref_property_additional.property_furnish',
                'pref_property_additional.electric_available',
                'pref_property_additional.water_available',
                'pref_property_additional.lifts_in_tower',
                'pref_property_additional.flat_each_floor',
                'pref_property_additional.facing_direction',
                'pref_property_additional.car_parking',
                'pref_property_additional.overlooking',
                'pref_property_additional.ownership_type',
                'pref_property_additional.property_desc',
            );

        return $query;
    }

    public function AdvanceSearch(Request $rq)
    {
        $data = json_decode($rq->SearchData, JSON_PRETTY_PRINT);
        Log::info("Request for advanced search:\n", $data);

        $qry = $this->MainQuery();

        $filterConditions = [
            'possession_status' => 'pref_property_additional.possession_status',
            'ownership' => 'pref_property_additional.ownership_type',
            'furnishing' => 'pref_property_additional.property_furnish',
            // 'parking' => 'pref_properties_settings.parking_ability',
            // 'property_type' => 'pref_properties_settings.property_type',
            // 'property_for' => 'pref_properties_settings.property_type_for',
            // 'budget_id' => 'pref_properties_settings.property_budget',
        ];

        foreach ($filterConditions as $key => $column) {
            if (!empty($data[$key])) {

                if (is_array($data[$key])) {

                    $qry->whereIn($column, $data[$key]);
                } else {

                    $qry->where($column, '=', $data[$key]);
                }
            }
        }


        return response()->json([
            'status' => 1,
            'message' => 'Property enquiry saved successfully.',
            'data' => $data,
        ]);
    }
}
