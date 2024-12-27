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

            $data = [
                $this->EditPropertyAddress($request->property_id),
                $this->EditPropertyConfiguration($request->property_id),
                $this->EditPropertyCarParking($request->property_id),
                $this->EditPropertyFacing($request->property_id),
                $this->EditPropertyFloorDetails($request->property_id),
                $this->EditPropertyWaterAvailability($request->property_id),
                $this->EditPropertyElecticAvailability($request->property_id),
            ];


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
            ['property_address' ,'locality as property_locality'],
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
                'pref_properties_settings.bedrooms as bedroom_count',
                'pref_properties_settings.bathrooms as bathroom_count',
                'pref_properties_dimensions.size as sizes',
                'pref_properties_dimensions.room_type as room_types',
                'pref_property_additional.kitchen as kitchen_count',
                'pref_property_additional.property_furnish',
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
        Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($property_configuration, JSON_PRETTY_PRINT));

        
        $formattedData = [];
        foreach ($property_configuration as $room) {
            $sizes = json_decode($room->sizes, true);

            if (str_contains($room->room_types, 'bedroom')) {
                $key = 'bedroom';
            } elseif (str_contains($room->room_types, 'bathroom')) {
                $key = 'bathroom';
            } else {
                continue;
            }
            
            $formattedData[$key][] = [
                "key" => $room->room_types,
                "height" => $sizes['height'] ?? '',
                "width" => $sizes['width'] ?? '',
            ];
        }

        

        
        if (!empty($property_configuration)) {
            $room = $property_configuration[0]; 
            $formattedData['settings'][] = [
                'budget_id' => $room->budget_id,
                'carpet_area' => $room->carpet_area,
                'super_area' => $room->super_area,
                'property_furnish' => $room->property_furnish,
            ];
        }

        Log::info("Request in formattedData:\n" . json_encode($formattedData, JSON_PRETTY_PRINT));

        return $formattedData;
    }

    public function EditPropertyStatus($propertyID)
    {
        $property_areas = getTableData(
            'pref_property_additional',
            [
                'possession_status',
                'construct_year',
                'expected_possesion_month_year',
            ],
            [],
            ['pref_property_additional.pid' => $propertyID],
            null
        );
        Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($property_areas, JSON_PRETTY_PRINT));

        $status = [];
        foreach ($property_areas as $key) {
            $possesionTime = explode('-', $key->expected_possesion_month_year);
            $month = $possesionTime[0];
            $year = $possesionTime[1];

            if (str_contains($key->possession_status, 'Under Construction')) {

                return  $status[] = [
                    'status' => [
                        'property_status' => $key->possession_status,
                        'expected_month' => $month,
                        'expected_year' => $year
                    ]
                ];
            } elseif (str_contains($key->possession_status, 'Ready to move')) {

                return $status[] = [
                    'status' => [
                        'property_status' => $key->possession_status,
                        'age_of_construction' => $key->construct_year,
                    ]
                ];
            }
        }
    }

    //----------------------------------------------------------------------------------------------------------

    public function EditPropertyCarParking($propertyID)
    {
        // $car_parking = getTableData(
        //     'pref_property_additional',
        //     [
        //         'car_parking',           TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
        //     ],
        //     [],
        //     ['pref_property_additional.pid' => $propertyID],
        //     null
        // );



        return ['car_parking' => 'None']; //TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
    }

    public function EditPropertyFacing($propertyID)
    {
        // $facing = getTableData(
        //     'pref_property_additional',
        //     [
        //         'facing',           TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
        //     ],
        //     [],
        //     ['pref_property_additional.pid' => $propertyID],
        //     null
        // );



        return ['facing' => 'North West']; //TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
    }


    public function EditPropertyFloorDetails($propertyID)
    {
        $floor_details = getTableData(
            'pref_property_additional',
            [
                'floor',
                'total_floor',
                //'floor',          TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
                //'floor',          TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
            ],
            [],
            ['pref_property_additional.pid' => $propertyID],
            null
        );

        $floor_details = json_decode(json_encode($floor_details), true);

        // Add static keys and values
        $floor_details[0]['flat_each_floor'] = '4'; // TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
        $floor_details[0]['lifts_in_tower'] = '2'; // TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE

        return ['floor_details' => $floor_details];
    }

    public function EditPropertyWaterAvailability($propertyID)
    {
        // $facing = getTableData(
        //     'pref_property_additional',
        //     [
        //         'facing',           TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
        //     ],
        //     [],
        //     ['pref_property_additional.pid' => $propertyID],
        //     null
        // );



        return ['water_available' => '24 hours available']; //TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
    }

    public function EditPropertyElecticAvailability($propertyID)
    {
        // $facing = getTableData(
        //     'pref_property_additional',
        //     [
        //         'facing',           TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
        //     ],
        //     [],
        //     ['pref_property_additional.pid' => $propertyID],
        //     null
        // );



        return ['electric_available' => 'Partial Power Backup']; //TABLE FIELD NOT PRESENT______RETURNED STATIC VALUE
    }
}
