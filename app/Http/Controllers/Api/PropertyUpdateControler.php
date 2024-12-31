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
        // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($request->all(), JSON_PRETTY_PRINT));
        try {

            // $this->Updateaddress($request);
            // $this->UpdateAdditionalData($request);
            $this->UpdateSettingData($request);


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

    public function UpdateSettingData($req)
    {
        try {
            Log::info("Request received in UpdateSettingData:", $req->all());

            DB::beginTransaction();

            $prop_id = $req->property_id;
            $rooms = json_decode($req->configuration, true);
            if (isset($rooms)) {
                // Get all current room types for the property
                $existing_room_types = DB::table('pref_properties_dimensions')
                    ->where('pid', $prop_id)
                    ->pluck('room_type')
                    ->toArray();

                // Track the room types that are being removed (that were in the old configuration but not in the new one)
                $removed_room_types = array_diff($existing_room_types, array_keys($rooms));

                // Remove the room types that are no longer part of the configuration
                if (count($removed_room_types) > 0) {
                    DB::table('pref_properties_dimensions')
                        ->where('pid', $prop_id)
                        ->whereIn('room_type', $removed_room_types)
                        ->delete();
                    Log::info("Deleted room types for property ID: $prop_id", ['room_types' => $removed_room_types]);
                }

                // Process and update existing or new room types
                foreach ($rooms as $roomtype => $roomdetails) {
                    foreach ($roomdetails as $item) {
                        $size_data = [
                            'height' => $item['height'] ?? null,
                            'height_unit' => $item['height_unit'] ?? 'ft',
                            'width' => $item['width'] ?? null,
                            'width_unit' => $item['width_unit'] ?? 'ft',
                        ];

                        $existingRoom = DB::table('pref_properties_dimensions')
                            ->where('pid', $prop_id)
                            ->where('room_type', $item['key']);

                        if ($existingRoom->exists()) {
                            // Update existing room dimensions
                            $update = $existingRoom->update(['size' => json_encode($size_data)]);
                            Log::info("Updated room dimensions for property ID: $prop_id, room type: {$item['key']}", $size_data);
                        } else {
                            // Insert new room dimensions
                            $data = [
                                'pid' => $prop_id,
                                'room_type' => $item['key'],
                                'size' => json_encode($size_data),
                            ];
                            $insert = DB::table('pref_properties_dimensions')->insert($data);
                            Log::info("Inserted new room dimensions for property ID: $prop_id, room type: {$item['key']}", $data);
                        }
                    }
                }
            }
            $data_for_settings_table = [];

            // Use switch case for property settings fields
            foreach ($req->all() as $key => $value) {
                switch ($key) {
                    case 'property_budget':
                        if (isset($value)) {
                            $data_for_settings_table['property_budget'] = $value;
                        }
                        break;
                    case 'bedroom_count':
                        if (isset($value)) {
                            $data_for_settings_table['bedrooms'] = $value;
                        }
                        break;
                    case 'bathroom_count':
                        if (isset($value)) {
                            $data_for_settings_table['bathrooms'] = $value;
                        }
                        break;
                    case 'carpet_area':
                        if (isset($value)) {
                            $data_for_settings_table['carpet_area'] = $value;
                        }
                        break;
                    case 'super_area':
                        if (isset($value)) {
                            $data_for_settings_table['super_area'] = $value;
                        }
                        break;
                }
            }
    
            // Only update the settings table if there is any data to update
            if (count($data_for_settings_table) > 0) {
                $update_setting_table = DB::table('pref_properties_settings')
                    ->where('pid', $prop_id)
                    ->update($data_for_settings_table);
    
                Log::info("Updated property settings for property ID: $prop_id", $data_for_settings_table);
            }

            DB::commit();
            return response()->json([
                'status' => 1,
                'message' => 'Property updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error in UpdateSettingData: {$e->getMessage()}", [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Failed to update property',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
