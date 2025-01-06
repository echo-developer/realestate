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

        $dataFilter = [
            'post_for' => $request->input('post_for'),
            'city_id' => $request->input('city_id'),
            'bedrooms' => $request->input('bedrooms'),
            'parking' => $request->input('parking'),
            'property_type' => $request->input('property_type'),
            'property_type_for' => $request->input('property_type_for'),
        ];
        try {

            $properties = $this->apiModel->GetSearchedProperties($dataFilter);

            $formattedProperties = $properties->map(function ($property) {

                try {
                    $user = JWTAuth::parseToken()->authenticate();
                    $user_id = $user->id ?? null;
                } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
                    $user_id = null;
                }

                // Log::info("Request in controller:\n" . json_encode($user_id, JSON_PRETTY_PRINT));


                $is_fav = !empty($user_id) && DB::table('pref_my_favorite_property')
                    ->where('uid', $user_id)
                    ->where('propID', $property->property_id)
                    ->value('status') == config('constants.STATUS_ACTIVE');

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
                if (!empty($property->galleries)) {
                    $galleryEntries = explode(';;', $property->galleries);
                    $galleries = [];

                    foreach ($galleryEntries as $entry) {
                        $parts = explode('||', $entry);

                        if (count($parts) < 3) {
                            Log::warning("Invalid gallery entry: " . $entry);
                            continue; // Skip invalid entries
                        }

                        $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                        $imagesWithUrl = array_map(function ($image) {
                            return url('property_images/' . $image);
                        }, $images);

                        $galleries[] = [
                            'gallery_name' => $parts[0] ?? null,
                            'gallery_caption' => $parts[1] ?? null,
                            'images' => $imagesWithUrl,
                        ];
                    }
                }


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
                    'price' => $max_price .'-'.$min_price,
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'galleries' => $galleries,
                ];
            });

            // Log::info("Request in controller:\n" . json_encode($formattedProperties, JSON_PRETTY_PRINT));

            $searched_properties = $formattedProperties
                ->sortByDesc('created_at')
                ->skip($recentOffset)
                ->take($limit)
                ->values();

            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }


            return response()->json([
                'status' => 'success',
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
