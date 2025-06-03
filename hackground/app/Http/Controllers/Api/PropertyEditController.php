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
            if (!is_my_propertyOrProject($request->property_id, null)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Unauthorized. Failed to get property',
                ]);
            }

            $lang = $request->input('lang', 'en');

            $propertyId = $request->property_id;

            $address = $this->EditPropertyAddress($propertyId) ?? [];
            $setting = $this->EditPropertyConfiguration($propertyId) ?? [];
            $additional = $this->EditPropertyAdditional($propertyId) ?? [];
            $gallary = $this->EditPropertyGallary($propertyId) ?? [];
            $landmarks = $this->EditPropertyLandmarks($propertyId) ?? [];

            $data = array_merge($address, $setting, $additional, $gallary, $landmarks);
            $data['is_my_property'] = is_my_propertyOrProject($request->property_id, null);
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
            'properties_location',
            ['property_address', 'locality as property_locality'],
            [],
            ['pid' => $propertyID],
            null
        );

        foreach ($property_address as $key) {
            return [
                'address' => $key->property_address,
                'locality' => [
                    'locality_id' => $key->property_locality,
                    'locality_name' => !empty($key->property_locality) ? get_name_by_id('locality_names', 'locality_id', $key->property_locality, 'en') : null
                ],
            ];
        }
    }

    public function EditPropertyConfiguration($propertyID)
    {
        $property_configuration = getTableData(
            'properties_settings',
            [
                'properties_settings.bedrooms',
                'properties_settings.bathrooms',
                'properties_dimensions.size as sizes',
                'properties_dimensions.room_type as room_types',
                'property_additional.kitchen as kitchen_count',
                'properties_settings.property_budget as budget_id',
                'properties_settings.carpet_area',
                'properties_settings.super_area',
                'properties_settings.property_type',
                'properties_settings.expected_price',
                'properties_settings.project_name',
                'properties_settings.parking_ability',
            ],
            [
                [
                    'table' => 'properties_dimensions',
                    'base_field' => 'properties_settings.pid',
                    'operator' => '=',
                    'foreign_field' => 'properties_dimensions.pid'
                ],
                [
                    'table' => 'property_additional',
                    'base_field' => 'properties_settings.pid',
                    'operator' => '=',
                    'foreign_field' => 'property_additional.pid'
                ]
            ],
            ['properties_settings.pid' => $propertyID],
            null
        );

        // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($property_configuration, JSON_PRETTY_PRINT));

        $formattedData = [
            'kitchen_count' => 0,
            'bedroom_count' => 0,
            'bathroom_count' => 0,
            'budget_id' => 0,
            'carpet_area' => 0,
            'super_area' => 0,
            'rooms' => [
                'bedroom' => [],
                'bathroom' => [],
                'kitchen' => [],
                'balcony' => [],
            ],
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
            } elseif (str_contains($property->room_types, 'kitchen')) {
                $formattedData['rooms']['kitchen'][] = [
                    "key" => $property->room_types,
                    "height" => $sizes['height'] ?? '',
                    "width" => $sizes['width'] ?? '',
                ];
            } elseif (str_contains($property->room_types, 'balcony')) {
                $formattedData['rooms']['balcony'][] = [
                    "key" => $property->room_types,
                    "height" => $sizes['height'] ?? '',
                    "width" => $sizes['width'] ?? '',
                ];
            }


            $formattedData['parking_availability'] = $property->parking_ability;
            $formattedData['project_name'] = $property->project_name;
            $formattedData['kitchen_count'] = $property->kitchen_count;
            $formattedData['expected_price'] = $property->expected_price;
            $formattedData['bedroom_count'] = $property->bedrooms;
            $formattedData['bathroom_count'] = $property->bathrooms;
            $formattedData['budget_id'] = $property->budget_id;
            $formattedData['carpet_area'] = $property->carpet_area;
            $formattedData['super_area'] = $property->super_area;
            $formattedData['property_type'] = get_name_by_id('property_category_names', 'category_id', $property->property_type, 'en');
        }

        // Log::info("Formatted Data:\n" . json_encode($formattedData, JSON_PRETTY_PRINT));

        return $formattedData;
    }

    public function EditPropertyAdditional($propertyID)
    {
        $additionaldata = getTableData(
            'property_additional',
            [
                'car_parking',
                'facing_direction',
                'overlooking',
                'flooring_style',
                'ownership_type',
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
                'property_video'
            ],
            [],
            ['property_additional.pid' => $propertyID],
            null
        );

        foreach ($additionaldata as $key) {
            $possesionTime = explode('-', $key->expected_possesion_month_year ?? '');
            $possesionMonth = !empty($possesionTime[0]) ? $possesionTime[0] : null;
            $possesionYear = !empty($possesionTime[1]) ? $possesionTime[1] : null;

            return [
                'possesion_month' => $possesionMonth,
                'ownership_type' => $key->ownership_type ?? null,
                'possesion_year' => $possesionYear,
                'possession_status' => (int)($key->possession_status) ?? null,
                'construct_year' => !empty($key->construct_year) ? $key->construct_year :  null,
                'car_parking' => $key->car_parking ?? null,
                'facing_direction' => $key->facing_direction ?? null,
                'overlooking' => !empty($key->overlooking) ? json_decode($key->overlooking, true) : null,
                'flooring' => !empty($key->flooring_style) ? json_decode($key->flooring_style, true) : null,
                'flat_each_floor' => $key->flat_each_floor ?? null,
                'lifts_in_tower' => $key->lifts_in_tower ?? null,
                'water_available' => $key->water_available ?? null,
                'electric_available' => $key->electric_available ?? null,
                'property_furnish' => $key->property_furnish ?? null,
                'total_floor' => $key->total_floor ?? null,
                'floor_number' => $key->floor_nnumber ?? null,
                'buyer_message' => $key->buyer_message ?? null,
                'property_video' => !empty($key->property_video) ? asset('user_upload/property_videos/'.$key->property_video) : '',
            ];
        }
    }


    public function EditPropertyGallary($propertyID)
    {
        if (!isset($propertyID)) {
            return response()->json([
                'status' => 0,
                'message' => 'Property ID not found',
            ]);
        }

        $data = $this->apimodel->getPropertyallImeges($propertyID);
        $allImeges = json_decode($data, true);

        // Group images by gallery_type
        $groupedImages = [];
        foreach ($allImeges as $image) {
            $galleryType = $image['gallery_type'];
            if (!isset($groupedImages[$galleryType])) {
                $groupedImages[$galleryType] = [
                    'gallery' => $galleryType,
                    'images' => []
                ];
            }

            // Transform the image URL
            $imageUrl = asset('user_upload/property_images/' . $image['filename']);

            $groupedImages[$galleryType]['images'][] = [
                'image_id' => $image['image_id'],
                'image_name' => $image['filename'],
                'image_url' => $imageUrl,
                'caption' => $image['caption']
            ];
        }

        // Convert the associative array to an indexed array
        $transformedData = array_values($groupedImages);

        return ['galleries' => $transformedData];
    }
    public function EditPropertyLandmarks($propertyID)
    {

        if (!isset($propertyID)) {
            return response()->json([
                'status' => 0,
                'message' => 'Property ID not found',
            ]);
        }

        $property_landmarks = getTableData(
            'property_landmarks',
            [
                'landmark_type',
                'landmark_type_count',
                'landmark_details',
            ],
            [],
            ['property_landmarks.property_id' => $propertyID],
            null
        );
        $formattedLandmarks = [];


        foreach ($property_landmarks as $landmark) {

            $baseKey = preg_replace('/\d+$/', '', $landmark->landmark_type);


            $details = json_decode($landmark->landmark_details, true);


            $details[$baseKey . '_count'] = $landmark->landmark_type_count;


            $formattedLandmarks[$baseKey][] = array_merge(
                [
                    'key' => $landmark->landmark_type,
                ],
                $details
            );
        }
        return ['landmarks' => $formattedLandmarks];
    }
}
