<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class SeachController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function SearchResult(Request $request)
    {

        $currentpage = $request->input('currentpage', 1);
        $limit = $request->input('limit', 10);
        $recentOffset = ($currentpage - 1) * $limit;
        $user_id = $request->user_id ?? null;

        $dataFilter = [
            'post_for' => $request->input('post_for'),
            'city_id' => $request->input('city_id'),
            'bedrooms' => $request->input('bedrooms'),
            'parking' => $request->input('parking'),
            'property_type' => $request->input('property_type'),
            'property_for' => $request->input('property_for'),
        ];
        if (!empty($dataFilter['city_id']) && is_string($dataFilter['city_id'])) {
            $dataFilter['city_id'] = explode(',', $dataFilter['city_id']);
        }
        try {

            $properties = $this->apiModel->GetSearchedProperties($dataFilter , $user_id);

            $formattedProperties = $properties->map(function ($property) use ($user_id) {

                $is_fav = !empty($user_id) && DB::table('pref_my_favorite_property')
                    ->where('uid', $user_id)
                    ->where('propID', $property->property_id)
                    ->value('status') == config('constants.STATUS_ACTIVE');

                // Log::info("Request in controller:\n" . json_encode($is_fav, JSON_PRETTY_PRINT));


                $price = getTableData(
                    'pref_property_budget',
                    ['max_budget', 'min_budget'],
                    [],
                    ['id' => $property->budget_id],
                    null
                );
                $price = json_decode($price, true);

                $priceData = collect($price)->first();

                $max_price = isset($priceData['max_budget']) ? $priceData['max_budget'] : null;
                $min_price = isset($priceData['min_budget']) ? $priceData['min_budget'] : null;



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
                    'price' => $max_price . '-' . $min_price,
                    'exp_price' => $property->exp_price,
                    'property_size' => ($property->carpet_area ?? 0) + ($property->super_area ?? 0) + ($property->plot_area ?? 0),
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'galleries' => $transformedData,
                ];
            });

            // Log::info("Request in controller:\n" . json_encode($formattedProperties, JSON_PRETTY_PRINT));

            // Example input values for dynamic sorting
            $sortKey = $request->input('sort_key'); // e.g., 'price' or 'size'
            $sortOrder = $request->input('sort_order'); // e.g., 'asc' or 'desc'

            // Default sorting key and order
            $sortKey = $sortKey ?? 'created_at'; // Default to 'created_at'
            $sortOrder = $sortOrder ?? 'desc'; // Default to 'desc'

            // Perform dynamic sorting
            $sortedProperties = collect($formattedProperties)->sortBy(function ($property) use ($sortKey) {
                return $property[$sortKey] ?? null;
            }, SORT_REGULAR, $sortOrder === 'desc');

            // Apply offset and limit
            $searched_properties = $sortedProperties
                ->skip($recentOffset)
                ->take($limit)
                ->values();


            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }


            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => [
                    'searched_properties' => $searched_properties,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while fetching properties',
                'error' => $e->getMessage(),
            ]);
        }
    }


    // public function AdvanceSearchController(Request $rq){


        
    // }
}
