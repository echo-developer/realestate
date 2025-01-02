<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyEditController extends Controller
{
    protected $apimodel;

    public function __construct(ApiModel $ApiModel)
    {
        $this->apimodel = $ApiModel;
    }

    public function EditProperty(Request $request)
    {

        try {

            $lang = $request->input('lang', 'en');

            $address = $this->EditPropertyAddress($request->property_id);
            $setting = $this->EditPropertyConfiguration($request->property_id);
            $additional = $this->EditPropertyAdditional($request->property_id);
            $gallary = $this->EditPropertyGallary($request->property_id);
            $data = array_merge($address, $setting, $additional,$gallary);
            // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($data, JSON_PRETTY_PRINT));


            $options = [
                'all_budget' => $this->apimodel->getPropertyBudget(),
                'all_furnish' => $this->apimodel->getFurnish($lang),
            ];

            return response()->json([
                'status' => 1,
                'message' => 'data retrived successfully',
                'data' => $data,
                'options' => $options,
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

    public function EditPropertyAddress($propertyID)
    {
        $property_address = getTableData(
            'pref_properties_location',
            ['property_address', 'locality as property_locality'],
            [],
            ['pid' => $propertyID],
            null
        );

        foreach ($property_address as $key) {
            return [
                'address' => $key->property_address,
                'locality' => $key->property_locality,
            ];
        }
    }

    public function EditPropertyConfiguration($propertyID)
    {
        $property_configuration = getTableData(
            'pref_properties_settings',
            [
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.bathrooms',
                'pref_properties_dimensions.size as sizes',
                'pref_properties_dimensions.room_type as room_types',
                'pref_property_additional.kitchen as kitchen_count',
                'pref_properties_settings.property_budget as budget_id',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
            ],
            [
                [
                    'table' => 'pref_properties_dimensions',
                    'base_field' => 'pref_properties_settings.pid',
                    'operator' => '=',
                    'foreign_field' => 'pref_properties_dimensions.pid'
                ],
                [
                    'table' => 'pref_property_additional',
                    'base_field' => 'pref_properties_settings.pid',
                    'operator' => '=',
                    'foreign_field' => 'pref_property_additional.pid'
                ]
            ],
            ['pref_properties_settings.pid' => $propertyID],
            null
        );

        // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($property_configuration, JSON_PRETTY_PRINT));

        $formattedData = [
            'kitchen_count' => 0,
            'budget_id' => 0,
            'carpet_area' => 0,
            'super_area' => 0,
        ];

        foreach ($property_configuration as $property) {
            $sizes = json_decode($property->sizes, true);


            if (str_contains($property->room_types, 'bedroom')) {
                $formattedData['rooms']['bedroom'][] = [
                    "key" => $property->room_types,
                    "height" => $sizes['height'] ?? '',
                    "width" => $sizes['width'] ?? '',
                ];
            } elseif (str_contains($property->room_types, 'bathroom')) {
                $formattedData['rooms']['bathroom'][] = [
                    "key" => $property->room_types,
                    "height" => $sizes['height'] ?? '',
                    "width" => $sizes['width'] ?? '',
                ];
            }


            $formattedData['kitchen_count'] = $property->kitchen_count;
            $formattedData['bedroom_count'] = $property->bedrooms;
            $formattedData['bathroom_count'] = $property->bathrooms;
            $formattedData['budget_id'] = $property->budget_id;
            $formattedData['carpet_area'] = $property->carpet_area;
            $formattedData['super_area'] = $property->super_area;
        }

        // Log::info("Formatted Data:\n" . json_encode($formattedData, JSON_PRETTY_PRINT));

        return $formattedData;
    }



    public function EditPropertyAdditional($propertyID)
    {
        $additionaldata = getTableData(
            'pref_property_additional',
            [
                'car_parking',
                'facing_direction',
                'flat_each_floor',
                'lifts_in_tower',
                'water_available',
                'electric_available',
                'property_furnish',
                'total_floor',
                'floor as floor_nnumber',
                'expected_possesion_month_year',
                'possession_status',
                'construct_year',
                'buyer_message',
            ],
            [],
            ['pref_property_additional.pid' => $propertyID],
            null
        );

        foreach ($additionaldata as $key) {

            $possesionTime = explode('-', $key->expected_possesion_month_year);
            $possesionMonth = $possesionTime[0] ?? '';
            $possesionYear = $possesionTime[1] ?? '';


            return [
                'possesion_month' => $possesionMonth,
                'possesion_year' => $possesionYear,
                'possession_status' => $key->possession_status,
                'construct_year' => $key->construct_year,
                'car_parking' => $key->car_parking,
                'facing_direction' => $key->facing_direction,
                'flat_each_floor' => $key->flat_each_floor,
                'lifts_in_tower' => $key->lifts_in_tower,
                'water_available' => $key->water_available,
                'electric_available' => $key->electric_available,
                'property_furnish' => $key->property_furnish,
                'total_floor' => $key->total_floor,
                'floor_nnumber' => $key->floor_nnumber,
                'buyer_message' => $key->buyer_message,
            ];
        }
    }

    public function EditPropertyGallary($propertyID){
        if (!isset($propertyID)) {
            return response()->json([
                'status' => 0,
                'message' => 'Property ID not found',
            ]);
        }

        $data = $this->apimodel->getPropertyallImeges($propertyID);
        $allImeges = json_decode($data, true);

        // Log::info('Decoded All Images:', ['data' => $allImeges]);

        $transformedData = collect($allImeges)->map(function ($item) {
            $item['image_url'] = url('property_images/' . $item['filename']);
            unset($item['filename']);
            return $item;
        });
        return  ['gallary'=>json_decode($transformedData)];
    }
}
