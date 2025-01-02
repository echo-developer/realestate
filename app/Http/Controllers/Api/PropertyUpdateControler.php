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
        // Log::info("Request in UpdateProperty:\n" . json_encode($request->all(), JSON_PRETTY_PRINT));
        try {

            $this->Updateaddress($request);
            $this->UpdateAdditionalData($request);
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
        // Log::info("Request in inside Updateaddress:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));
        DB::beginTransaction();

        try {

            $datatoupdate = [];

            if ($req->has('address')) {
                $datatoupdate['property_address'] = $req->address;
            }

            if ($req->has('locality')) {
                $datatoupdate['locality'] = $req->locality;
            }

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
        // Log::info($req->all());
        DB::beginTransaction();

        try {
            $possession_status_details = json_decode($req->possession_status, true);
            $floor_details = json_decode($req->floor_details, true);



            $expected_possesion_month_year = trim(
                ($possession_status_details['possesion_month'] ?? '') .
                    ((!empty($possession_status_details['possesion_month']) && !empty($possession_status_details['possesion_year'])) ? '-' : '') .
                    ($possession_status_details['possesion_year'] ?? '')
            );

            $fields = [
                'car_parking' => $req->car_parking,
                'flooring_style' => $req->flooring,
                'overlooking' => $req->overlooking,
                'facing_direction' => $req->facing_direction,
                'water_available' => $req->water_available,
                'electric_available' => $req->electric_available,
                'property_furnish' => $req->property_furnish,
                'buyer_message' => $req->buyer_message,
                'kitchen_count' => $req->kitchen,
                'possession_status' => $possession_status_details['possession_status'] ?? null,
                'construct_year' => $possession_status_details['construct_year'] ?? null,
                'expected_possesion_month_year' => $expected_possesion_month_year,
                'total_floor' => $floor_details['total_floor'] ?? null,
                'floor' => $floor_details['floor_number'] ?? null,
                'flat_each_floor' => $floor_details['flat_each_floor'] ?? null,
                'lifts_in_tower' => $floor_details['lifts_in_tower'] ?? null,
            ];

            $datatoupdate = array_filter(
                $fields,
                fn($value) => $value !== null && $value !== ''
            );

            if (!empty($datatoupdate)) {
                DB::table('pref_property_additional')
                    ->where('pid', $req->property_id)
                    ->update($datatoupdate);
            }

            DB::commit();
            return response()->json(['status' => 1, 'message' => 'Property updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to update property',
                'error' => $e->getMessage()
            ]);
        }
    }



    public function UpdateSettingData($req)
    {
        try {
            // Log::info("Request received in UpdateSettingData:", $req->all());

            DB::beginTransaction();

            $prop_id = $req->property_id;
            $rooms = json_decode($req->configuration, true);
            if (isset($rooms)) {

                $existing_room_types = DB::table('pref_properties_dimensions')
                    ->where('pid', $prop_id)
                    ->pluck('room_type')
                    ->toArray();


                $removed_room_types = array_diff($existing_room_types, array_keys($rooms));


                if (count($removed_room_types) > 0) {
                    DB::table('pref_properties_dimensions')
                        ->where('pid', $prop_id)
                        ->whereIn('room_type', $removed_room_types)
                        ->delete();
                    // Log::info("Deleted room types for property ID: $prop_id", ['room_types' => $removed_room_types]);
                }


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

                            $update = $existingRoom->update(['size' => json_encode($size_data)]);
                            // Log::info("Updated room dimensions for property ID: $prop_id, room type: {$item['key']}", $size_data);
                        } else {

                            $data = [
                                'pid' => $prop_id,
                                'room_type' => $item['key'],
                                'size' => json_encode($size_data),
                            ];
                            $insert = DB::table('pref_properties_dimensions')->insert($data);
                            // Log::info("Inserted new room dimensions for property ID: $prop_id, room type: {$item['key']}", $data);
                        }
                    }
                }
            }
            $data_for_settings_table = [];


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

                // Log::info("Updated property settings for property ID: $prop_id", $data_for_settings_table);
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
