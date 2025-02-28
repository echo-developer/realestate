<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\TestimonialModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use function Laravel\Prompts\select;

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
        $user_id = $request->user_id ?? null;

        $limit = $request->input('limit', 10);


        $recentOffset = ($recentPage - 1) * $limit;
        $featuredOffset = ($featuredPage - 1) * $limit;
        $popularOffset = ($popularPage - 1) * $limit;
        $topOffset = ($topPage - 1) * $limit;

        try {

            $properties = $this->apiModel->GetProperties();
            $formattedProperties = $properties->map(function ($property) use ($user_id) {

                $is_favorite = !empty($user_id) && DB::table('pref_my_favorite_property')
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

                return [
                    'property_id' => $property->property_id,
                    'is_favourite' => $is_favorite,
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
                ->with(
                    'settings',
                    'additional',
                    'location',
                    'gallery',
                    'gallery.images'
                )
                ->wherehas('location',  function ($query) use ($city_id) {
                    $query->where('city', $city_id);
                })
                ->get();
            // log::info(json_encode($searchResults,JSON_PRETTY_PRINT));

            if ($searchResults->isEmpty()) {
                return response()->json([
                    'status' => 1,
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
                    'currency' => $project->additional->currency ?? null,
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

    public function getTestimonialList()
    {
        try {
            $result = DB::table('pref_testimonial')
                ->leftJoin('pref_testimonial_names', 'pref_testimonial.id', '=', 'pref_testimonial_names.testimonial_id')
                ->select('pref_testimonial.id', 'pref_testimonial.image', 'pref_testimonial_names.name', 'pref_testimonial_names.subname as designation', 'pref_testimonial_names.description')
                ->where(
                    [
                        'pref_testimonial_names.lang' => 'en',
                        'pref_testimonial.status' => config('constants.STATUS_ACTIVE')
                    ]
                )
                ->get();

            $UpdatedResult = $result->map(fn($items) => !empty($items->image) ? $items->image = asset('user_upload/testimonial_image') . '/' . $items->image : null);

            if ($result->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }
            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $result,
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

    public function buyerEnquerytoAdmin(Request $req)
    {
        try {
            $datatoInsert = [
                'name' => $req->input('name'),
                'phone' => $req->input('phone'),
                'email' => $req->input('email'),
                'location' => $req->input('location'),
                'purchase_timeline' => $req->input('purchase_timeline'),
                'isPolicyAgreed' => $req->input('terms'),
                'property_type' => $req->input('property_type'),
                'flat_type' => $req->input('flat_type'),
                'property_size' => $req->input('property_size_type'),
                'max_budget' => $req->input('max_budget'),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            DB::table('buyer_property_enquery')->insert($datatoInsert);

            return response()->json([
                'status' => 1,
                'message' => 'Enquery Send',
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

    public function VerifiedAgentList(Request $request)
    {
        try {
            $city_id = $request->input('city_id');

            $data = User::with(['userAdditional', 'agentAdditional'])
                ->where([
                    ['status', config('constants.STATUS_ACTIVE')],
                    ['user_type', 'A'],
                    ['is_verified_agent', config('constants.STATUS_ACTIVE')]
                ]);

            if (!empty($city_id)) {
                $data->whereHas('userAdditional', function ($query) use ($city_id) {
                    $query->where('city', $city_id);
                });
            }

            $verifiedAgents = $data->get();

            $verifiedAgentsMerged = $verifiedAgents->map(function ($agent) {
                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'user_type' => $agent->user_type,
                    'image' => $agent->image ? asset('user_upload/profile_image/' . $agent->image) : null,
                    'status' => $agent->status,
                    'is_verified_agent' => $agent->is_verified_agent,
                    'created_at' => $agent->created_at,
                    'updated_at' => $agent->updated_at,
                    'address' => optional($agent->userAdditional)->address ?? null,
                    'city' => optional($agent->userAdditional)->city ?? null,
                    'experience_yr' => optional($agent->agentAdditional)->experience_yr ?? null,
                    'operating_since' => optional($agent->agentAdditional)->experience_yr
                        ? now()->subYears($agent->agentAdditional->experience_yr)->format('Y')
                        : null,
                    'bussiness_email' => optional($agent->agentAdditional)->bussiness_email ?? null,
                    'company_name' => optional($agent->agentAdditional)->company_name ?? null,
                    'property_for_sell' => UsersPropertyCount($agent->id)['forSell'],
                    'property_for_rent' => UsersPropertyCount($agent->id)['forRent'],
                    'project_for_sell' => UsersProjectCount($agent->id)['forSell'],
                    'project_for_rent' => UsersProjectCount($agent->id)['forRent'],
                ];
            })->toArray();

            // log::info('MERGED', $verifiedAgentsMerged);
            return response()->json([
                'status' => 1,
                'message' => 'Data retrived successfully',
                'data' => $verifiedAgentsMerged,
            ]);
        } catch (\Exception $e) {
            log::error('Error fetching verified agents: ' . $e->getMessage());
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
