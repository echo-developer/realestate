<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyUpdateControler extends Controller
{
    public function UpdateProperty(Request $request)
    {
        Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($request->all(), JSON_PRETTY_PRINT));
        try {

            // $this->Updateaddress($request);
            $this->UpdateAdditionalData($request);


            return response()->json([
                'status' => 1,
                'message' => 'property Updated successfully',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function Updateaddress($req)
    {
        Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        DB::beginTransaction();

        try {

            $datatoupdate = [
                'property_address' => $req->address,
                'locality' => $req->locality,
            ];

            DB::table('pref_properties_location')->where('pid', $req->property_id)->update($datatoupdate);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function UpdateAdditionalData($req)
    {
        DB::beginTransaction();
        $possession_status_details = json_decode($req->possession_status, true);

        $possession_status = $possession_status_details['possession_status'] ?? '';
        $construct_year = $possession_status_details['construct_year'] ?? '';
        $possesion_month = $possession_status_details['possesion_month'] ?? '';
        $possesion_year = $possession_status_details['possesion_year'] ?? '';

        $expected_possesion_month_year = trim(
            $possesion_month . (!empty($possesion_month) && !empty($possesion_year) ? '-' : '') . $possesion_year
        );



        try {

            $datatoupdate = [
                'car_parking' => is_string($req->car_parking) ? $req->car_parking : null,
                'facing_direction' => $req->facing_direction,
                'flat_each_floor' => $req->flat_each_floor,
                'lifts_in_tower' => $req->lifts_in_tower,
                'water_available' => $req->water_available,
                'electric_available' => $req->electric_available,
                'property_furnish' => $req->property_furnish,
                'total_floor' => $req->total_floor,
                'floor' => $req->floor_nnumber,
                'expected_possesion_month_year' => $expected_possesion_month_year,
                'possession_status' => $possession_status,
                'construct_year' => $construct_year,
                'buyer_message' => $req->buyer_message,
                'kitchen' => $req->kitchen_count,
            ];
            DB::table('pref_property_additional')->where('pid', $req->property_id)->update($datatoupdate);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to get property',
                'error' => $e->getMessage()
            ]);
        }
    }
}
