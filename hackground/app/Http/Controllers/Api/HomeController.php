<?php

namespace App\Http\Controllers\Api;


use App\Models\User;
use App\Models\MetaData;
use App\Models\LoanEnquery;
use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\TestimonialModel;
use App\Models\UserFeedbackModel;

use App\Services\Api\HomeService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyLocation;
use function Laravel\Prompts\select;
use Illuminate\Support\Facades\Auth;
use App\Models\ProjectPropertyMapping;

class HomeController extends Controller
{
    protected $apiModel;
    protected $homeService;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
        $this->homeService = new HomeService;
    }

    public function getPropertyType(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getPropertyType($lang);

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No categories found.',
                    'data' => [],
                ]);
            }
            foreach ($data as $item) {
                $item->image =  $item->image ? asset('user_upload/category_image/' . $item->image) : '';
            }
            return response()->json([
                'status' => 1,
                'message' => 'Categories retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getPropertyTypeFor(Request $request)
    {
        try {
            // log::info($request->all());
            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getPropertyTypeFor($lang, $request->id);
            foreach ($data as $item) {
                $item->image =  $item->image ? asset('user_upload/subCategory_image/' . $item->image) : '';
            }
            // log::info('data'.$data);
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function city(Request $request)
    {
        try {
            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getCity($lang);

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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getCityLocality(Request $request)
    {
        try {
            $city_id = $request->id;
            $lang = strtolower($request->input('lang', 'en'));
            $data = $this->apiModel->getLocality($lang, $city_id);

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No Locality found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Locality retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getHomeData(Request $request)
    {
        try {
            $city_id = $request->input('city_id');
            $data['properties'] = $this->homeService->get_properties();
            $data['projects'] = $this->homeService->getProjectsByType();
            $data['testimonial'] = $this->homeService->getTestimonialList();
            $data['verified_agents'] = $this->homeService->getVerifiedAgents($city_id);
            $data['admin_details'] = $this->homeService->getAdminData();

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => $data
            ]);
        } catch (\Throwable $e) {
            // Optional: log error
            return response()->json([
                'status' => 0,
                'message' => 'Failed to fetch properties',
                'error' => $e->getMessage(), // For debugging, remove in production
            ], 500);
        }
    }

    public function get_properties(Request $request)
    {
        cleanup_expired_featured_properties();
        $recentPage = 1;
        $featuredPage = 1;
        $popularPage = 1;
        $topPage = 1;
        $user_id = auth_user_id() ?? null;

        $limit = 10;


        $recentOffset = ($recentPage - 1) * $limit;
        $featuredOffset = ($featuredPage - 1) * $limit;
        $popularOffset = ($popularPage - 1) * $limit;
        $topOffset = ($topPage - 1) * $limit;

        try {

            $properties = $this->apiModel->GetProperties();
            $formattedProperties = $properties->map(function ($property) use ($user_id) {

                $is_favorite = !empty($user_id) && DB::table('my_favorite_property')
                    ->where('uid', $user_id)
                    ->where('propID', $property->property_id)
                    ->value('status') == config('constants.STATUS_ACTIVE');


                // $galleries = [];
                // $getGalleries = GetProperties_GalleryImages($property->property_id);
                // // log::info('$getGalleries', json_decode($getGalleries, JSON_PRETTY_PRINT));
                // foreach ($getGalleries as $image) {

                //     $galleryType = $image->image_type;
                //     if (!isset($galleries[$galleryType])) {
                //         $galleries[$galleryType] = [
                //             'gallery' => $galleryType,
                //             'images' => []
                //         ];
                //     }

                //     $imageUrl = asset('user_upload/property_images/' . $image->filename);

                //     $galleries[$galleryType]['images'][] = [
                //         'image_id' => $image->image_id,
                //         'image_name' => $image->filename,
                //         'image_url' => $imageUrl,
                //         'caption' => $image->caption
                //     ];
                // }
                // $transformedData = array_values($galleries);


                $galleries = [];
                $getGalleries = GetProperties_GalleryImages($property->property_id);

                foreach ($getGalleries as $image) {
                    $imageUrl = asset('user_upload/property_images/' . $image->filename);

                    $galleries[] = [
                        'gallery' => $image->image_type,
                        'images' => [
                            [
                                'image_id' => $image->image_id,
                                'image_name' => $image->filename,
                                'image_url' => $imageUrl,
                                'caption' => $image->caption
                            ]
                        ]
                    ];

                    break; // Stop after storing the first image
                }

                $transformedData = array_values($galleries);


                return [
                    'property_id' => $property->property_id,
                    'is_favourite' => $is_favorite,
                    'user' => get_user_name($property->uid),
                    'logo' => !empty($property->image) && file_exists(public_path('user_upload/profile_image/' . $property->image))
                        ? asset('user_upload/profile_image/' . $property->image)
                        : '',
                    'property_size' => $property->super_area,
                    'unit_type' => $property->unit_type,
                    'area_in_sqft' => $property->area_in_sqft,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'is_top' => $property->is_top,
                    'post_for' => $property->post_for,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'price' => $property->expected_price,
                    'created_at' => $property->created_at,
                    'address' => $property->property_address,
                    'image_count' => getGalleriesCount($property->property_id, 'property'),
                    'galleries' => $transformedData,
                ];
            });

            // Apply pagination logic for each category
            $recentProperties = $formattedProperties
                ->sortByDesc('created_at')
                ->skip($recentOffset)
                ->take($limit)
                ->values();

            $featuredProperties = $formattedProperties
                ->filter(fn($property) => $property['is_featured'])
                ->skip($featuredOffset)
                ->take($limit)
                ->values();

            $popularProperties = $formattedProperties
                ->filter(fn($property) => $property['is_populer'])
                ->skip($popularOffset)
                ->take($limit)
                ->values();

            $topProperties = $formattedProperties
                ->filter(fn($property) => $property['is_top'])
                ->skip($topOffset)
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
                    'recent_properties' => $recentProperties,
                    'featured_properties' => $featuredProperties,
                    'popular_properties' => $popularProperties,
                    'top_properties' => $topProperties
                ],
            ]);
        } catch (\Throwable $e) {
            throw $e;
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
                    'settings:id,project_id,project_budget',
                    'additional:id,project_id,currency',
                    'location:id,project_id,city,address',
                    'gallery.images'
                )
                ->get()
                ->map(function ($item) {
                    $item->location->city = isset($item->location->city) ? get_name_by_id('city_names', 'city_id', $item->location->city, 'en') : null;
                    return $item;
                })
                ->groupBy(function ($item) {
                    return $item->location->city;
                })
                ->sortByDesc(function ($group) {
                    return $group->count();
                })
                ->take(5);
            // log::info(json_encode($searchResults, JSON_PRETTY_PRINT));
            // return  $searchResults;
            if ($searchResults->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            $customArray = [];
            foreach ($searchResults as $city => $projects) {
                $customArray[$city] = $projects->map(function ($project) {

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
                })->values();
            }


            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $customArray,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getTestimonialList()
    {
        try {
            $result = DB::table('testimonial')
                ->leftJoin('testimonial_names', 'testimonial.id', '=', 'testimonial_names.testimonial_id')
                ->select('testimonial.id', 'testimonial.image', 'testimonial_names.name', 'testimonial_names.subname as designation', 'testimonial_names.description')
                ->where(
                    [
                        'testimonial_names.lang' => 'en',
                        'testimonial.status' => config('constants.STATUS_ACTIVE')
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function buyerEnquerytoAdmin(Request $req)
    {
        try {
            $datatoInsert = $req->only([
                'name',
                'phone',
                'agent_id',
                'messsage',
                'email',
                'locality',
                'purchase_timeline',
                'terms',
                'property_type',
                'property_for',
                'max_size',
                'min_size',
                'max_budget',
                'min_budget',
            ]);

            $datatoInsert['flat_type'] = $req->input('bhk_type');
            $datatoInsert['messsage'] = $req->input('message');
            $datatoInsert['created_at'] = now();
            $datatoInsert['updated_at'] = now();

            $enq_id =  DB::table('buyer_property_enquery')->insertGetId($datatoInsert);

            if (!empty($datatoInsert['agent_id']) && !empty($enq_id)) {
                DB::table('leads_assigned')->insert([
                    'lead_type' => 'G',
                    'user_id' => $datatoInsert['agent_id'],
                    'enquery_id' => $enq_id,
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Enquery Send',
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function VerifiedAgentList(Request $request)
    {
        try {
            $city_id = $request->input('city_id');

            $data = User::with(['userAdditional', 'agentAdditional', 'serviceArea:agent_id,city'])
                ->where([
                    ['status', config('constants.STATUS_ACTIVE')],
                    ['user_type', 'A'],
                    ['is_verified_agent', config('constants.STATUS_ACTIVE')],
                    ['id', '!=', auth_user_id()]
                ]);

            if (!empty($city_id)) {
                $data->whereHas('serviceArea', function ($query) use ($city_id) {
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function propertyInTrendsandRates(Request $request)
    {
        try {

            $cityId = $request->input('city_id');
            $locality = $request->input('locality');

            $topLocalities = PrefPropertyLocation::join('locality_names', 'properties_location.locality', '=', 'locality_names.locality_id')
                ->whereNotNull('properties_location.city')
                ->whereNotNull('properties_location.locality')
                ->whereNotNull('properties_location.pid')
                ->where('locality_names.lang', 'en')
                ->where('properties_location.city', $cityId)
                ->selectRaw('pref_properties_location.locality,pref_locality_names.name, COUNT(pref_properties_location.pid) as total_properties')
                ->groupBy('locality_names.name')
                ->orderByDesc('total_properties')
                ->limit(5)
                ->get();


            $startMonth = Carbon::now()->subMonths(8)->startOfMonth(); // 9 months including current
            $endMonth = Carbon::now()->endOfMonth();
            $allMonths = collect();
            $current = $startMonth->copy();

            while ($current <= $endMonth) {
                $allMonths->push($current->format("M'y"));
                $current->addMonth();
            }

            $priceDataforLocalities = [];
            $localitiesMeta = [];

            foreach ($topLocalities as &$locality) {
                $monthlyPrices = PrefProperty::with(['location', 'settings'])
                    ->whereHas('location', function ($query) use ($cityId, $locality) {
                        $query->where('city', $cityId)
                            ->where('locality', $locality['locality'])
                            ->orWhere('locality',  $locality);
                    })
                    ->whereHas('settings', function ($query) {
                        $query->whereNotNull('expected_price');
                    })
                    ->where('created_at', '>=', $startMonth)
                    ->where('created_at', '<=', $endMonth)
                    ->orderBy('created_at')
                    ->get()
                    ->groupBy(function ($item) {
                        return $item->created_at->format("M'y");
                    })
                    ->map(function ($group) {
                        return round($group->pluck('settings.expected_price')->avg(), 2);
                    });

                // Map to fixed month array, fill missing with 0 or null
                $localityPrices = $allMonths->map(function ($month) use ($monthlyPrices) {
                    return $monthlyPrices[$month] ?? 0;
                });

                $priceDataforLocalities[$locality['name']] = $localityPrices->values()->toArray();

                $localitiesMeta[] = [
                    'name' => $locality['name'],
                    'total_properties' => $locality['total_properties'] ?? 0,
                ];
            }




            $topProjects = PrefProject::with(['propertyMapping' => function ($q) {
                $q->select('project_id', 'property_id');
            }])
                ->whereHas('propertyMapping')
                ->select('id', 'project_name') // match primary key
                ->limit(5)
                ->get()->map(function ($topProject) {
                    return [
                        'project_id' => $topProject->id,
                        'projectName' => $topProject->project_name,
                        'total_properties' => count($topProject->propertyMapping) ?? 0,
                    ];
                });

            // log::info("propertyInTrends" . json_encode($topProjects, JSON_PRETTY_PRINT));
            $priceDataforProjects = [];

            foreach ($topProjects as &$projects) {
                $monthlyPrices = PrefProperty::with(['projectMapping', 'settings'])
                    ->whereHas('projectMapping', function ($query) use ($projects, $cityId, $locality) {
                        $query->where('project_id', $projects['project_id']);
                    })
                    ->where('created_at', '>=', $startMonth)
                    ->where('created_at', '<=', $endMonth)
                    ->orderBy('created_at')
                    ->get()
                    ->groupBy(function ($item) {
                        return $item->created_at->format("M'y");
                    })
                    ->map(function ($group) {
                        return round($group->pluck('settings.expected_price')->avg(), 2);
                    });

                $projectPrices = $allMonths->map(function ($month) use ($monthlyPrices) {
                    return $monthlyPrices[$month] ?? 0;
                });

                $priceDataforProjects[$projects['projectName']] = $projectPrices->values()->toArray();
            }

            $response = [
                'months' => $allMonths->toArray(),
                'priceDataforLocalities' => $priceDataforLocalities,
                'localities' => $localitiesMeta,
                'priceDataforProjects' => $priceDataforProjects,
                'projects' => $topProjects,
            ];
            return response()->json([
                'status' => 1,
                'data' => $response,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function saveLoanEnquery(Request $request)
    {
        try {
            $data = [
                'user_name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'loan_amount' => $request->loan_amount,
                'tenure' => $request->tenure,
                'is_property_identified' => $request->property_identified,
            ];
            LoanEnquery::create($data);

            return response()->json([
                'status' => 1,
                'message' => 'Loan enquery send',
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function fetchLocalities(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');
            $city_id = $request->input('city_id', 'en');
            $localities = $this->apiModel->getLocality($lang, $city_id);
            if (!empty($localities)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Localities fetched successfully.',
                    'data' => $localities,
                ]);
            }

            return response()->json([
                'status' => 0,
                'message' => 'No localities found for the selected city.',
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function saveFeedback(Request $request)
    {
        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'phone_code' => $request->phone_code,
                'feedback' => $request->feedback,
                'phone' => $request->phone,
            ];
            UserFeedbackModel::create($data);

            return response()->json([
                'status' => 1,
                'message' => 'Feedback submitted successfully.',
            ]);
        } catch (\Throwable $th) {
            log_anything($th);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while submitting feedback.',
            ]);
        }
    }
    public function getMeta(Request $request)
    {
        try {
            $meta = MetaData::where([['page', $request->key], ['status', config('constants.STATUS_ACTIVE')]])
                ->first();


            return response()->json([
                'status' => 1,
                'message' => 'Data Fetched successfully.',
                'data' => $meta
            ]);
        } catch (\Throwable $th) {
            log_anything($th);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred.',
            ]);
        }
    }
}
