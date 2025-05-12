<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\UserSearchActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdvanceSearchController extends Controller
{
    protected $apiModel;
    protected $auth_user_id;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
        $this->auth_user_id = auth_user_id() ?? null;
    }

    public function MainQuery()
    {
        $query = $this->apiModel->basePropertyQuery();

        if (!empty($this->auth_user_id)) {
            $query->where('properties.uid', '!=', $this->auth_user_id,);
        }
        $query->where(
            'properties.status',
            '=',
            config('constants.STATUS_ACTIVE')
        )
            ->addSelect(
                'properties_settings.super_area',
                'properties_settings.unit_type',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget as budget_id',

                'properties_location.locality',
                'properties_location.city',
                'users.user_type',
                'property_additional.possession_status',
                'property_additional.kitchen',
                'property_additional.construct_year',
                'property_additional.property_amenity',
                'property_additional.is_personal_washroom',
                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.washroom',
                'property_additional.flooring_style',
                'property_additional.expected_possesion_month_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'locality.latitude',
                'locality.longitude',
            )
            ->leftJoin('property_additional', 'properties.id', '=', 'property_additional.pid')
            ->leftJoin('users', 'properties.uid', '=', 'users.id')
            ->leftJoin('locality', 'properties_location.locality', '=', 'locality.locality_id')
            ->groupBy(
                'properties_settings.super_area',
                'property_additional.kitchen',
                'properties_settings.unit_type',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget',
                'users.user_type',
                'property_additional.property_amenity',
                'property_additional.possession_status',
                'property_additional.is_personal_washroom',
                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.washroom',
                'property_additional.flooring_style',
                'property_additional.expected_possesion_month_year',
                'property_additional.construct_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'properties_location.locality',
                'properties_location.city',
                'locality.latitude',
                'locality.longitude',

            );

        return $query;
    }

    public function AdvanceSearch($rq)
    {

        $data = json_decode($rq->SearchData, JSON_PRETTY_PRINT) ?? [];
        $data2 = json_decode($rq->searchPayload, JSON_PRETTY_PRINT) ?? [];
        $user_id = $rq->user_id;

        $data = array_merge($data, $data2);
        // Log::info("data:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $qry = $this->MainQuery();
        $qry->where('properties.uid', '!=', $user_id);

        $filterConditions = [
            'possession_status' => 'property_additional.possession_status',
            'city_id' => 'properties_location.city',
            'locality' => 'properties_location.locality',
            'ownership' => 'property_additional.ownership_type',
            'furnishing' => 'property_additional.property_furnish',
            'amenities' => 'property_additional.property_amenity',
            'floor' => 'property_additional.flooring_style',

            'facing' => 'property_additional.facing_direction',
            'property_type' => 'properties_settings.property_type',
            'property_for' => 'properties_settings.property_type_for',
            'post_for' => 'properties_settings.post_for',
            'bathroom' => 'properties_settings.bathrooms',
            'bedrooms' => 'properties_settings.bedrooms',
            'kitchens' => 'property_additional.kitchen',
            'posted_by' => 'users.user_type',

            // Range-based filters
            'min_budget' => 'properties_settings.expected_price',
            'max_budget' => 'properties_settings.expected_price',
            'min_carpet' => 'properties_settings.carpet_area',
            'max_carpet' => 'properties_settings.carpet_area',
        ];

        $rangeKeys = ['min_budget', 'max_budget', 'min_carpet', 'max_carpet'];

        foreach ($filterConditions as $key => $column) {
            if (!empty($data[$key])) {

                if (in_array($key, $rangeKeys)) {
                    $operator = str_contains($key, 'min') ? '>=' : '<=';
                    $qry->where($column, $operator, (int) $data[$key]);
                    continue;
                }

                if (is_array($data[$key])) {
                    if ($key === 'amenities' || $key === 'floor') {
                        $qry->where(function ($query) use ($data, $column, $key) {
                            foreach ($data[$key] as $value) {
                                $query->orWhereJsonContains($column, $value);
                            }
                        });
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
                    $query->orWhere('properties.created_at', '>=', $date);
                }
            });
        }

        if (isset($data['hasLatlang']) && $data['hasLatlang'] == '1') {
            $qry->where(function ($query) {
                $query->whereNotNull('properties_location.locality')
                    ->where('properties_location.locality', '!=', '');
            });
        }

        // Log::info('SQL Query: ' . json_encode($qry->toSql(), JSON_PRETTY_PRINT));
        // Log::info('Query Bindings: ', $qry->getBindings());
        return $qry->get();
    }

    public function propertiesBasedonSearch(Request $rq)
    {
        $user_id = $rq->user_id;

        if (!is_null($user_id) && is_numeric($user_id)) {
            $this->saveUserActivity($rq, $user_id);
        }


        $currentpage = $rq->input('recent_page', 1);
        $lang = $rq->input('lang', 'en');
        $limit = $rq->input('limit', 10);
        $recentOffset = ($currentpage - 1) * $limit;

        try {

            $properties = $this->AdvanceSearch($rq);
            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }

            // Format properties
            $formattedProperties = $properties->map(function ($property) use ($user_id, $lang) {
                $is_fav = !empty($user_id) && DB::table('my_favorite_property')
                    ->where('uid', $user_id)
                    ->where('propID', $property->property_id)
                    ->value('status') == config('constants.STATUS_ACTIVE');

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

                    $imageUrl = asset('user_upload/property_images/' . $image->filename);

                    $galleries[$galleryType]['images'][] = [
                        'image_id' => $image->image_id,
                        'image_name' => $image->filename,
                        'image_url' => $imageUrl,
                        'caption' => $image->caption
                    ];
                }
                $transformedData = array_values($galleries);
                $get_User = getUserDetails($property->uid);

                $expected_possesion_month_year = !empty($property->expected_possesion_month_year) ? explode('-', $property->expected_possesion_month_year) : [];
                return [
                    'post_for' => $property->post_for,
                    'property_id' => $property->property_id,
                    'image_count' => getGalleriesCount($property->property_id, 'property'),
                    'is_favorite' => $is_fav,
                    'user_name' => $get_User->name ?? null,
                    'user_type' => $get_User->user_type ?? null,
                    'user_image' => $get_User->image ?? '',
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, $lang),
                    'property_type' => get_name_by_id('property_category_names', 'category_id', $property->property_type, $lang),
                    'possession_status' => get_name_by_id('property_status_names', 'status_id', $property->possession_status, $lang) ?? null,
                    'construct_year' => $property->construct_year,
                    'possession_month' => isset($expected_possesion_month_year[0]) ? $expected_possesion_month_year[0] : null,
                    'possession_year' => isset($expected_possesion_month_year[1]) ? $expected_possesion_month_year[1] : null,
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'unit_type' => $property->unit_type,
                    'price_currency' => $property->price_currency,
                    'exp_price' => $property->expected_price,
                    'price_per_sqft' => ($property->area_in_sqft > 0) ? round($property->expected_price / $property->area_in_sqft, 2) : 0,
                    'property_size' => $property->super_area ?? 0,
                    'area_in_sqft' => $property->area_in_sqft ?? 0,
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'address_lan' => $property->longitude,
                    'address_lat' => $property->latitude,
                    'galleries' => $transformedData,
                ];
            });


            $sortKey = $rq->input('sort_key', 'created_at');
            $sortKey = $sortKey === 'property_size' ? 'area_in_sqft' : $sortKey;
            $sortOrder = strtolower($rq->input('sort_order', 'desc'));

            $sortedProperties = collect($formattedProperties);

            if ($sortedProperties->isNotEmpty() && array_key_exists($sortKey, $sortedProperties->first())) {
                $sortedProperties = $sortOrder === 'desc'
                    ? $sortedProperties->sortByDesc($sortKey)
                    : $sortedProperties->sortBy($sortKey);
            }


            // Pagination details
            $totalProperties = $sortedProperties->count();
            $totalPages = ceil($totalProperties / $limit);

            // Apply offset and limit
            $searched_properties = $sortedProperties
                ->skip($recentOffset)
                ->take($limit)
                ->values();

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => [
                    'searched_properties' => $searched_properties,
                    'pagination' => [
                        'total_properties' => $totalProperties,
                        'total_pages' => $totalPages,
                        'current_page' => (int)$currentpage,
                    ],
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

    private function saveUserActivity($r, $uid)
    {

        try {
            // $uid = !empty($uid) ? $uid : auth_user_id();
            $data = is_array(json_decode($r->SearchData, true)) ? json_decode($r->SearchData, true) : [];
            $data2 = is_array(json_decode($r->searchPayload, true)) ? json_decode($r->searchPayload, true) : [];
            $mergedData = array_merge($data, $data2);

            $excludedKeys = ['property_type', 'property_for', 'post_for', 'city_id', 'min_budget', 'max_budget'];

            $filteredData = array_filter($mergedData, function ($value) {
                return !(is_array($value) && empty($value)) && $value !== "" && $value !== null;
            });

            $searchFilters = array_diff_key($filteredData, array_flip($excludedKeys));

            $dataToInsert = [
                'user_id' => $uid,
                'json_filters' => !empty($searchFilters) ? json_encode($searchFilters) : null,
            ];
            foreach ($excludedKeys as $key) {
                $dataToInsert[$key] = $filteredData[$key] ?? null;
            }

            UserSearchActivity::create($dataToInsert);
            // Log::info("filteredArrayKeys:\n" . json_encode($dataToInsert, JSON_PRETTY_PRINT));  
        } catch (\Throwable $e) {
            throw $e;
        }
    }
}
