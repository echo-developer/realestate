<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function AdvanceSearch($rq)
    {

        $data = json_decode($rq->SearchData, JSON_PRETTY_PRINT) ?? [];
        $data2 = json_decode($rq->searchPayload, JSON_PRETTY_PRINT) ?? [];

        $data = array_merge($data, $data2);
        Log::info("data2:\n", $data);
        Log::info("data2:\n", $data2);

        $qry = $this->MainQuery();

        $filterConditions = [
            'possession_status' => 'pref_property_additional.possession_status',
            'ownership' => 'pref_property_additional.ownership_type',
            'furnishing' => 'pref_property_additional.property_furnish',
            'amenities' => 'pref_property_additional.property_amenity',
            'floor' => 'pref_property_additional.flooring_style',
            'facing' => 'pref_property_additional.facing_direction',
            'property_type' => 'pref_properties_settings.property_type',
            'property_for' => 'pref_properties_settings.property_type_for',
            'post_for' => 'pref_properties_settings.post_for',
            'bathroom' => 'pref_properties_settings.bathrooms',
        ];

        $jsonArrayKeys = ['amenities', 'floor'];

        foreach ($filterConditions as $key => $column) {
            if (!empty($data[$key])) {

                if (is_array($data[$key])) {
                    if (in_array($key, $jsonArrayKeys)) {
                        $qry->whereJsonContains($column, $data[$key]);
                    } else {
                        $qry->whereIn($column, $data[$key]);
                    }
                } else {
                    $qry->where($column, '=', $data[$key]);
                }
            }
        }


        if (!empty($data["posted_since"])) {

            $postedSinceNumbers = array_map(function ($value) {
                return (int) preg_replace('/\D/', '', $value);
            }, $data['posted_since']);


            $qry->where(function ($query) use ($postedSinceNumbers) {
                foreach ($postedSinceNumbers as $daycount) {
                    $date = Carbon::now()->subDays($daycount);
                    $query->orWhere('pref_properties.created_at', '>=', $date);
                }
            });
        }

        if (!empty($data['carpet_area']) && is_array($data['carpet_area'])) {
            $qry->where(function ($query) use ($data) {
                foreach ($data['carpet_area'] as $minCarpetArea) {
                    $query->orWhere('pref_properties_settings.carpet_area', '>=', (int) $minCarpetArea);
                }
            });
        }
        // Log::info('SQL Query: ' . $qry->toSql());
        // Log::info('Query Bindings: ', $qry->getBindings());
        return $qry->get();
    }


    public function propertiesBasedonSearch(Request $rq)
    {
        $currentpage = $rq->input('currentpage', 1);
        $limit = $rq->input('limit', 10);
        $recentOffset = ($currentpage - 1) * $limit;
        $user_id = $rq->user_id ?? null;
        try {

            $properties = $this->AdvanceSearch($rq);
            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }

            $formattedProperties = $properties->map(function ($property) use ($user_id) {

                $is_fav = !empty($user_id) && DB::table('pref_my_favorite_property')
                    ->where('uid', $user_id)
                    ->where('propID', $property->property_id)
                    ->value('status') == config('constants.STATUS_ACTIVE');

                // Log::info("Request in controller:\n" . json_encode($is_fav, JSON_PRETTY_PRINT));


                // $price = getTableData(
                //     'pref_property_budget',
                //     ['max_budget', 'min_budget'],
                //     [],
                //     ['id' => $property->budget_id],
                //     null
                // );
                // $price = json_decode($price, true);

                // $priceData = collect($price)->first();

                // $max_price = isset($priceData['max_budget']) ? $priceData['max_budget'] : null;
                // $min_price = isset($priceData['min_budget']) ? $priceData['min_budget'] : null;



                $galleries = [];

                $getGalleries = GetProperties_GalleryImages($property->property_id);

                foreach ($getGalleries as $image) {

                    $galleryType = $image->image_type;
                    if (!isset($galleries[$galleryType])) {
                        $galleries[$galleryType] = [
                            'gallery' => $galleryType,
                            'images' => []
                        ];
                    }

                    $imageUrl = asset('property_images/' . $image->filename);

                    $galleries[$galleryType]['images'][] = [
                        'image_id' => $image->image_id,
                        'image_name' => $image->filename,
                        'image_url' => $imageUrl,
                        'caption' => $image->caption
                    ];
                }
                $transformedData = array_values($galleries);


                return [
                    'post_for' => $property->post_for,
                    'property_id' => $property->property_id,
                    'is_favorite' => $is_fav,
                    'user' => get_user_name($property->uid),
                    'property_size' => $property->carpet_area * $property->plot_area,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                    'property_type' => get_name_by_id('pref_property_category_names', 'category_id', $property->property_type, 'en'),
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'price_currency' => $property->price_currency,
                    // 'price' => $max_price . '-' . $min_price ,
                    'exp_price' => $property->expected_price,
                    'property_size' => ($property->carpet_area ?? 0) + ($property->super_area ?? 0) + ($property->plot_area ?? 0),
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'galleries' => $transformedData,
                ];
            });

            // Example input values for dynamic sorting
            // $sortKey = $rq->input('sort_key'); // e.g., 'price' or 'size'
            // $sortOrder = $rq->input('sort_order'); // e.g., 'asc' or 'desc'

            // // Default sorting key and order
            // $sortKey = $sortKey ?? 'created_at'; // Default to 'created_at'
            // $sortOrder = $sortOrder ?? 'desc'; // Default to 'desc'

            // // Perform dynamic sorting
            // $sortedProperties = collect($formattedProperties)->sortBy(function ($property) use ($sortKey) {
            //     return $property[$sortKey] ?? null;
            // }, SORT_REGULAR, $sortOrder === 'desc');

            // Apply offset and limit

            $searched_properties = $formattedProperties
                ->skip($recentOffset)
                ->take($limit)
                ->values();

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => [
                    'searched_properties' => $searched_properties,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching properties',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
