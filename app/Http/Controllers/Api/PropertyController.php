<?php

namespace App\Http\Controllers\Api;

use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class PropertyController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function get_properties(Request $request)
    {
        $recentPage = $request->input('recent_page', 1);
        $featuredPage = $request->input('featured_page', 1);
        $popularPage = $request->input('popular_page', 1);

        $limit = $request->input('limit', 5); // Default limit (you can also use different limits for each category if needed)

        // Calculate the offset for each category (skip logic for pagination)
        $recentOffset = ($recentPage - 1) * $limit;
        $featuredOffset = ($featuredPage - 1) * $limit;
        $popularOffset = ($popularPage - 1) * $limit;
        try {
            // Fetch properties from the ApiModel
            $properties = $this->apiModel->GetProperties();
            $formattedProperties = $properties->map(function ($property) {
                // Parse galleries from the concatenated string
                $galleries = [];
                if (!empty($property->galleries)) {
                    $galleryEntries = explode(';;', $property->galleries); // Split galleries
                    foreach ($galleryEntries as $entry) {
                        $parts = explode('||', $entry); // Split gallery_name, caption, and images
                        $galleries[] = [
                            'gallery_name' => $parts[0] ?? null,
                            'gallery_caption' => $parts[1] ?? null,
                            'images' => isset($parts[2]) ? explode(',', $parts[2]) : [], // Split images into an array
                        ];
                    }
                }

                return [
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

            $recentProperties = $formattedProperties
                ->sortByDesc('created_at') // Sort by 'created_at' descending for recent
                ->skip($recentOffset) // Skip previous results for pagination
                ->take($limit) // Take the next set of results
                ->values(); // Reindex the collection

            $featuredProperties = $formattedProperties
                ->filter(fn($property) => $property['is_featured']) // Filter by 'is_featured'
                ->skip($featuredOffset) // Skip previous results for pagination
                ->take($limit) // Take the next set of results
                ->values(); // Reindex the collection

            $popularProperties = $formattedProperties
                ->filter(fn($property) => $property['is_populer']) // Filter by 'is_populer'
                ->skip($popularOffset) // Skip previous results for pagination
                ->take($limit) // Take the next set of results
                ->values(); // Reindex the collection

                
            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }

            // Return successful response
            return response()->json([
                'status' => 'success',
                'message' => 'Properties fetched successfully',
                'data' => [
                    'recent_properties' => $recentProperties,
                    'featured_properties' => $featuredProperties,
                    'popular_properties' => $popularProperties,
                ]
            ]);
        } catch (\Exception $e) {
            // Handle exceptions and return error response
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching properties',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
