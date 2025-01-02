<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyUpdateControler extends Controller
{
    private function countRooms($rooms)
    {
        if (is_array($rooms)) {
            return count($rooms);
        }

        $decodedRooms = json_decode($rooms, true);

        return is_array($decodedRooms) ? count($decodedRooms) : 0;
    }

    public function UpdateProperty(Request $request)
    {

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
            $rooms = json_decode($req->configuration, true);

            if (isset($rooms)) {

                $kitchens = null;
                $balcony = null;

                foreach ($rooms as $roomtype => $roomdetails) {

                    if (str_contains($roomtype, 'kitchen')) {
                        $kitchens = $this->countRooms($roomdetails);
                    } elseif (str_contains($roomtype, 'balcony')) {
                        $balcony = $this->countRooms($roomdetails);
                    }
                }

            }



            $expected_possesion_month_year = trim(
                ($possession_status_details['possesion_month'] ?? '') .
                    ((!empty($possession_status_details['possesion_month']) && !empty($possession_status_details['possesion_year'])) ? '-' : '') .
                    ($possession_status_details['possesion_year'] ?? '')
            );

            $fields = [
                'car_parking' => $req->car_parking,
                'flooring_style' => $req->flooring,
                'kitchen' => $kitchens,
                'balcony' => $balcony, //field not present in database yet
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
            // Log::info("Formatted Data:\n" . json_encode($req->all(), JSON_PRETTY_PRINT));

            DB::beginTransaction();

            $prop_id = $req->property_id;
            $rooms = json_decode($req->configuration, true);
            if (isset($rooms)) {

                $bedrooms = null;
                $bathrooms = null;

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
                }


                foreach ($rooms as $roomtype => $roomdetails) {

                    if (str_contains($roomtype, 'bedroom')) {
                        $bedrooms = $this->countRooms($roomdetails);
                    } elseif (str_contains($roomtype, 'bathroom')) {
                        $bathrooms = $this->countRooms($roomdetails);
                    }


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
                        } else {

                            $data = [
                                'pid' => $prop_id,
                                'room_type' => $item['key'],
                                'size' => json_encode($size_data),
                            ];
                            $insert = DB::table('pref_properties_dimensions')->insert($data);
                        }
                    }
                }
            }
            $data_for_settings_table = [];

            if (!empty($bedrooms)) {
                $data_for_settings_table['bedrooms'] = $bedrooms;
            }
            if (!empty($bathrooms)) {
                $data_for_settings_table['bathrooms'] = $bathrooms;
            }


            foreach ($req->all() as $key => $value) {
                switch ($key) {
                    case 'property_budget':
                        if (isset($value)) {
                            $data_for_settings_table['property_budget'] = $value;
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

            if (count($data_for_settings_table) > 0) {
                Log::info("data_for_settings_table Data:\n" . json_encode($data_for_settings_table, JSON_PRETTY_PRINT));

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
