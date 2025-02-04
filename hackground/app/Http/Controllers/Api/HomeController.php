<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        //  $this->middleware('auth:api');
        $this->apiModel = $apiModel;
    }

    public function getPropertyType(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getPropertyType($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No categories found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Categories retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving categories.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }

    public function getPropertyTypeFor(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getPropertyTypeFor($lang, $request->id);
            // Log::info("Request in controller:\n" . json_encode($data, JSON_PRETTY_PRINT));

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No result found.',
                    'data' => [],
                ]);
            }

            // Group the data by category_name
            // $groupedData = $data->groupBy('category_name')->map(function ($items) {
            //     return $items->map(function ($item) {
            //         return [
            //             'sub_category_id' => $item->sub_category_id,
            //             'sub_category_name' => $item->sub_category_name,
            //             'sub_category_key' => $item->slug,
            //         ];
            //     });
            // });

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in getPropertyType: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }

    public function city(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en')); // Default to 'en' if not provided
            $data = $this->apiModel->getCity($lang); // Pass $lang dynamically

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No cities found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'cities retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error in cities: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving cities.',
                'error' => $e->getMessage(), // Provide a detailed error message
            ]);
        }
    }
    public function get_properties(Request $request)
    {
        $recentPage = $request->input('recent_page', 1);
        $featuredPage = $request->input('featured_page', 1);
        $popularPage = $request->input('popular_page', 1);
        $topPage = $request->input('top_page', 1);

        $limit = $request->input('limit', 10); // Default limit

        // Calculate the offset for each category (pagination)
        $recentOffset = ($recentPage - 1) * $limit;
        $featuredOffset = ($featuredPage - 1) * $limit;
        $popularOffset = ($popularPage - 1) * $limit;
        $topOffset = ($topPage - 1) * $limit;

        try {
            // Fetch properties from the ApiModel
            $properties = $this->apiModel->GetProperties();
            $formattedProperties = $properties->map(function ($property) {
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
                    'property_id' => $property->property_id,
                    'user' => get_user_name($property->uid),
                    'property_size' => $property->carpet_area * $property->plot_area,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'is_top' => $property->is_top,
                    'post_for' => $property->post_for,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'price' => $property->price_currency . " " . $property->expected_price,
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'galleries' => $transformedData,
                ];
            });

            // Apply pagination logic for each category
            $recentProperties = $formattedProperties
                ->sortByDesc('created_at') // Sort by 'created_at' descending
                ->skip($recentOffset) // Skip previous results
                ->take($limit) // Take the next set of results
                ->values();

            $featuredProperties = $formattedProperties
                ->filter(fn($property) => $property['is_featured']) // Filter by 'is_featured'
                ->skip($featuredOffset) // Skip previous results
                ->take($limit) // Take the next set of results
                ->values();

            $popularProperties = $formattedProperties
                ->filter(fn($property) => $property['is_populer']) // Filter by 'is_populer'
                ->skip($popularOffset) // Skip previous results
                ->take($limit) // Take the next set of results
                ->values();

            $topProperties = $formattedProperties
                ->filter(fn($property) => $property['is_top']) // Filter by 'is_populer'
                ->skip($topOffset) // Skip previous results
                ->take($limit) // Take the next set of results
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
                    'recent_properties' => $recentProperties,
                    'featured_properties' => $featuredProperties,
                    'popular_properties' => $popularProperties,
                    'top_properties' => $topProperties
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


    public function getProjectListbyCity(Request $request)
    {

        try {
            $city_id = $request->input('city_id');

            $searchResults = PrefProject::where([
                ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
                ['status', '=', config('constants.STATUS_ACTIVE')]
            ])
                ->with([
                    'settings:project_id,project_budget',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])
                ->wherehas('location',  function ($query) use ($city_id) {
                    $query->where('city', $city_id);
                })
                ->get();

            if ($searchResults->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            $customArray = $searchResults->map(function ($project) {


                return [
                    'id' => $project->id,
                    'project_name' => $project->project_name,
                    'slug' => $project->slug,
                    'created_at' => $project->created_at->toISOString(),
                    'gallery' => $project->gallery->map(function ($gallery) {
                        return [
                            'id' => $gallery->id,
                            'image_type' => $gallery->image_type,
                            'images' => $gallery->images->map(function ($image) {
                                return [
                                    'caption' => $image->caption,
                                    'file' => asset('user_upload/project_images/' . $image->filename),
                                ];
                            }),
                        ];
                    }),
                    'project_budget' => $project->settings->project_budget ?? null,
                    'city' => $project->location->city ?? null,
                    'address' => $project->location->address ?? null,
                    'uname' => get_user_name($project->uid) ?? null,
                ];
            });

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $customArray,
            ]);
        } catch (\Exception $e) {

            Log::error('Error in getSearchedProjects: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong. Please try again later.',
            ]);
        }
    }
}
