<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            'post_for' => $request->input('post_for' , 'rent')
        ];
        Log::info("Request in controller:\n" . json_encode($dataFilter, JSON_PRETTY_PRINT));
        try {

            $properties = $this->apiModel->GetSearchedProperties($dataFilter);
            $formattedProperties = $properties->map(function ($property) {

                $galleries = [];
                if (!empty($property->galleries)) {
                    $galleryEntries = explode(';;', $property->galleries);
                    $galleries = [];

                    foreach ($galleryEntries as $entry) {
                        $parts = explode('||', $entry);


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
                    'user' => get_user_name($property->uid),
                    'property_size' => $property->carpet_area * $property->plot_area,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'price' => $property->price_currency . " " . $property->expected_price,
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'galleries' => $galleries,
                ];
            });


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
