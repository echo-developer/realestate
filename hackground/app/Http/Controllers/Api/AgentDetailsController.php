<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use App\Models\AgentAdditional;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class AgentDetailsController extends Controller
{
    protected $apiModel;
    protected $user_id;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
        $this->user_id = auth_user_id();
    }


    public function AgentDetailsPage(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');
            if (!empty($request->agent_id)) {

                $data = $this->BasicInfo($request, $lang);

                return response()->json([
                    'status' => 1,
                    'message' => 'Details retrived successfully',
                    'data' => $data
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'Agent Id not found',
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function BasicInfo($rq = null, $lang)
    {
        try {

            $data = User::where([
                'user_type' => 'A',
                'id' => $rq->agent_id
            ])
                ->with([
                    'userAdditional',
                    'agentAdditional',
                    'serviceArea',
                    'social',
                    'userbadges' => function ($q) {
                        $q->with(['names' => function ($q2) {
                            $q2->where('lang', app()->getLocale()); // or use a fixed string like 'en'
                        }]);
                    }
                ])
                ->first();

            if (empty($data)) {
                return [];
            }

            // Handle image path
            $data->image = $data->image ? asset('user_upload/profile_image/' . $data->image) : '';

            // Get property counts
            $data->forSell = UsersPropertyCount($data->id)['forSell'];
            $data->forRent = UsersPropertyCount($data->id)['forRent'];

            // Handle agentAdditional safely
            if ($data->agentAdditional) {
                $data->agentAdditional->agent_doc = !empty($data->agentAdditional->agent_doc)
                    ? asset('user_upload/agent_docs/' . $data->agentAdditional->agent_doc)
                    : null;
            }

            if ($data->agentAdditional) {
                $data->agentAdditional->company_logo = !empty($data->agentAdditional->company_logo)
                    ? asset('user_upload/company_logo/' . $data->agentAdditional->company_logo)
                    : null;
            }
            if ($data->agentAdditional) {
                $data->agentAdditional->agent_cover_photo = !empty($data->agentAdditional->agent_cover_photo)
                    ? asset('user_upload/agent_cover_photo/' . $data->agentAdditional->agent_cover_photo)
                    : null;
            }
            if ($data->agentAdditional) {
                $data->agentAdditional->languages = !empty($data->agentAdditional->language_speak) ? $data->agentAdditional->language_speak : null;
                unset($data->agentAdditional->language_speak);
            }
            // Handle userAdditional safely
            if ($data->userAdditional) {
                $data->userAdditional->city = !empty($data->userAdditional->city)
                    ? get_name_by_id('city_names', 'city_id', $data->userAdditional->city, $lang)
                    : null;
            }

            // Handle service area with city name mapping
            $data->service_area = !empty($data->serviceArea)
                ? collect($data->serviceArea)->map(function ($area) use ($lang) {
                    $area->city = !empty($area->city)
                        ? get_name_by_id('city_names', 'city_id', $area->city, $lang)
                        : null;
                    return $area;
                })
                : [];


            if ($data->userbadges) {
                $data->userbadges = $data->userbadges->map(function ($badge) {

                    $badge->name = $badge->names->first()->name ?? null;
                    $badge->description = $badge->names->first()->description ?? null;
                    unset($badge->slug, $badge->created_at, $badge->updated_at, $badge->status, $badge->lang);
                    $badge->icon = asset('user_upload/badges/' . $badge->icon);  // Adjust path if needed
                    unset($badge->names);
                    unset($badge->pivot);
                    return $badge;
                });
            }

            // Convert to array
            $dataArray = $data->toArray();

            // Merge main, user_additional, and agent_additional into one array
            $mergedData = array_merge(
                $dataArray,
                $dataArray['user_additional'] ?? [],
                $dataArray['agent_additional'] ?? []
            );

            // Remove nested user_additional and agent_additional arrays
            unset($mergedData['user_additional'], $mergedData['agent_additional']);

            return $mergedData;
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function ProeprtyInfo(Request $rq)
    {
        try {
            $currentPage = (int) $rq->input('currentPage', 1);
            $perPage = $rq->input('perPage', 10);
            $offSet = ($currentPage - 1) * $perPage;
            $filters = [
                'post_for' => $rq->input('post_for'),
                'property_type' => $rq->input('property_type'),
                'property_for' => $rq->input('property_for'),
                'locality' => $rq->input('locality'),
                'min_budget' => $rq->input('min_budget'),
                'max_budget' => $rq->input('max_budget'),
                'bedrooms' => is_string($rq->input('bedrooms')) ? json_decode($rq->input('bedrooms'), true) : ($rq->input('bedrooms') ?? []),
            ];
            $property_details = $this->apiModel->PropertyListforAgentPage($rq->agent_id, $filters);


            $formattedPropertiesDetails = $property_details->map(function ($property) {

                $is_favorite = !empty($this->user_id) && DB::table('my_favorite_property')
                    ->where('uid', $this->user_id)
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
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'property_type' => $property->property_type ? get_name_by_id('property_category_names', 'category_id', $property->property_type, 'en') : null,
                    'uid' => $property->uid,
                    'status' => $property->status,
                    'bathrooms' => $property->bathrooms,
                    'carpet_area' => $property->carpet_area,
                    'plot_area' => $property->plot_area,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'post_for' => $property->post_for,
                    'property_type_for' => $property->property_type_for ? get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en') : null,
                    'bedrooms' => $property->bedrooms,
                    'expected_price' => $property->expected_price,
                    'area_in_sqft' => $property->area_in_sqft,
                    'price_per_sqft' => ($property->area_in_sqft > 0) ? round($property->expected_price / $property->area_in_sqft, 2) : 0,
                    'price_currency' => $property->price_currency,
                    'created_at' => $property->created_at,
                    'property_address' => $property->property_address,
                    'galleries' => $transformedData,
                ];
            });
            $totalRecords = $formattedPropertiesDetails->count();
            $paginatedResults = $formattedPropertiesDetails->slice($offSet, $perPage)->values();

            return [
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'pagination' => [
                    'current_page' => $currentPage,
                    'per_page' => $perPage,
                    'total' => $totalRecords,
                    'total_pages' => (int) ceil($totalRecords / $perPage),
                ],
                'data' => $paginatedResults->toArray(),
            ];
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function AgentList(Request $request)
    {
        try {
            // log_anything($request->all());
            $locality = $request->input('locality');
            $lang = $request->input('lang', 'en');
            $city_id = $request->input('city_id');
            $name = $request->input('name');

            $broker_type = $request->input('broker_type');
            // $post_for = $request->input('post_for');
            // $property_type = $request->input('property_type');

            $perPage = $request->input('per_page', 10);
            $currentPage = $request->input('page', 1);
            $is_verified_agent = $request->input('is_verified_agent');

            $filters = [
                'serviceArea' => ['locality' => $locality, 'city' => $city_id],
                'agentAdditional' => ['broker_type' => $broker_type],
                // 'properties.settings' => ['post_for' => $post_for, 'property_type' => $property_type]
            ];

            $agentIdsQuery = User::with(['serviceArea:agent_id,loc_key,city,locality', 'agentAdditional:agent_id,company_name,company_logo,language_speak', 'userbadges' => function ($q) {
                $q->with(['names' => function ($q2) {
                    $q2->where('lang', app()->getLocale()); // or use a fixed string like 'en'
                }]);
            }])->where('user_type', 'A')->where('id', '!=', $this->user_id);

            foreach ($filters as $relation => $conditions) {
                foreach ($conditions as $column => $value) {
                    if (isset($value) && $value !== '') {
                        $agentIdsQuery->whereHas($relation, function ($query) use ($column, $value) {
                            if ($column === 'locality') {
                                $query->where($column, $value);
                            } else {
                                $query->where($column, $value);
                            }
                        });
                    }
                }
            }
            if (!empty($name)) {
                $agentIdsQuery->where('name', 'like', "%{$name}%");
            }
            $isVerified = filter_var($is_verified_agent, FILTER_VALIDATE_BOOLEAN);
            if ($request->has("is_verified_agent") && $isVerified == true) {
                $agentIdsQuery->where("is_verified_agent", $isVerified ? 1 : 0);
            }

            $agents = $agentIdsQuery->paginate($perPage, ['*'], 'page', $currentPage);

            // Log::info("SQL Query: " . $agentIdsQuery->toSql());
            // Log::info("Bindings: " . json_encode($agentIdsQuery->getBindings(), JSON_PRETTY_PRINT));

            $formattedAgents = collect($agents->items())->map(function ($item) use ($lang) {
                $item->user_id = $item->id;
                $path = public_path('user_upload/profile_image/' . $item->image);
                if (!empty($item->image) && file_exists($path)) {
                    $item->image = asset('user_upload/profile_image/' . $item->image);
                } else {
                    $item->image = null;
                }
                if (!empty($item->agentAdditional) && !empty($item->agentAdditional->company_logo)) {
                    $company_logo_path = public_path('user_upload/company_logo/' . $item->agentAdditional->company_logo);

                    if (file_exists($company_logo_path)) {
                        $item->company_logo = asset('user_upload/company_logo/' . $item->agentAdditional->company_logo);
                    } else {
                        $item->company_logo = null;
                    }
                } else {
                    $item->company_logo = null;
                }


                $item->forSell = UsersPropertyCount($item->id)['forSell'];
                $item->forRent = UsersPropertyCount($item->id)['forRent'];
                $item->is_verified_agent = (bool) $item->is_verified_agent;
                $item->company_name = !empty($item->agentAdditional) ? $item->agentAdditional->company_name : null;
                $item->languages = !empty($item->agentAdditional) ? $item->agentAdditional->language_speak : null;


                //$item->serviceArea ====> is $item->service_area in responce, [dont change!!]
                $item->service_area = !empty($item->serviceArea) ? collect($item->serviceArea)->map(function ($area) use ($lang) {
                    $area->city = !empty($area->city) ? get_name_by_id('city_names', 'city_id', $area->city, $lang) : null;
                    return $area;
                })->all() : [];

                unset($item->id, $item->agentAdditional);

                if ($item->userbadges) {
                    $item->userbadges = $item->userbadges->map(function ($badge) {

                        $badge->name = $badge->names->first()->name ?? null;
                        $badge->description = $badge->names->first()->description ?? null;
                        unset($badge->slug, $badge->created_at, $badge->updated_at, $badge->status, $badge->lang);
                        $badge->icon = asset('user_upload/badges/' . $badge->icon);  // Adjust path if needed
                        unset($badge->names);
                        unset($badge->pivot);
                        return $badge;
                    });
                }
                return $item;
            });

            return response()->json([
                'status' => 1,
                'message' => 'Agents fetched successfully',
                'data' => $formattedAgents,
                'pagination' => [
                    'total_pages' => ceil($agents->total() / $agents->perPage()),
                    'per_page' => $agents->perPage(),
                    'current_page' => $agents->currentPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in AgentList: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while fetching agents',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function agentsRating(Request $request)
    {
        $agent_id =  $request->input('agent_id');

        try {

            $datatoInsert = [
                'user_id' => $request->input('user_id'),
                'agent_id' => $agent_id,
                'rating' => $request->input('rating'),
                'comment' => $request->input('comment'),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $insert = DB::table('agents_rating')->insert($datatoInsert);

            return response()->json([
                'status' => 1,
                'message' => 'Agents Rated successfully',
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function agentsContact(Request $request)
    {
        $agent_id =  $request->input('agent_id');

        try {

            if ($agent_id) {

                $datatoInsert = [
                    'agent_id' => $agent_id,
                    'customer_name' => $request->input('name'),
                    'customer_phone' => $request->input('contact'),
                    'customer_email' => $request->input('email'),
                    'customer_message' => $request->input('message'),
                    'country_code' => $request->input('country_code'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $insert = DB::table('buyer_agent_enquiry')->insert($datatoInsert);

                return response()->json([
                    'status' => 1,
                    'message' => 'enquery successfully',
                ]);
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'Agents ID not found',
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function companyImage(Request $request)
    {
        try {
            $request->validate([
                'company_logo' => 'required|image|mimes:jpg,jpeg,png,gif|max:5120',
            ]);

            $agentid = $request->agent_id;

            if ($request->hasFile('company_logo')) {

                $agent = AgentAdditional::where('agent_id', $agentid)->first();

                if (!$agent) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Agent not found.',
                    ], 404);
                }

                $oldImage = $agent->company_logo;

                $file = $request->file('company_logo');
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $sanitizedName = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $originalName)));
                $extension = $file->getClientOriginalExtension();
                $fileName = time() . '-' . $sanitizedName . '.' . $extension;
                $file->move(public_path('user_upload/company_logo'), $fileName);

                if ($oldImage && file_exists(public_path('user_upload/company_logo/' . $oldImage))) {
                    unlink(public_path('user_upload/company_logo/' . $oldImage));
                }

                $update = $agent->update(['company_logo' => $fileName]);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Compnay logo updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => asset('user_upload/company_logo/' . ltrim($fileName, '/')),
                        ],
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }

            return response()->json([
                'status' => 0,
                'message' => 'No image file found in the request.',
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 0,
                'message' => 'File size limit exceeded. Max size 5 MB',
            ], 200);
        } catch (\Throwable $e) {
            // You may want to log the actual error here.
            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function companyImageDelete(Request $request)
    {
        try {

            if ($request->company_logo) {

                $agent = AgentAdditional::where('agent_id', $request->agent_id)->first();

                if (!$agent) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Agent not found.',
                    ], 404);
                }



                if ($request->company_logo && file_exists(public_path('user_upload/company_logo/' . $request->company_logo))) {
                    unlink(public_path('user_upload/company_logo/' . $request->company_logo));
                }

                $update = $agent->update(['company_logo' => '']);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Compnay logo deleted successfully.',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }

            return response()->json([
                'status' => 0,
                'message' => 'No image file found in the request.',
            ], 400);
        } catch (\Throwable $e) {
            // You may want to log the actual error here.
            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveCoverPhoto(Request $request)
    {
        try {
            $request->validate([
                'agent_cover_photo' => 'required|image|mimes:jpg,jpeg,png,gif',
            ]);

            $agentid = $request->agent_id;

            if ($request->hasFile('agent_cover_photo')) {

                $agent = AgentAdditional::where('agent_id', $agentid)->first();

                if (!$agent) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Agent not found.',
                    ], 404);
                }

                $oldImage = $agent->agent_cover_photo;

                $file = $request->file('agent_cover_photo');
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $sanitizedName = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $originalName)));
                $extension = $file->getClientOriginalExtension();
                $fileName = time() . '-' . $sanitizedName . '.' . $extension;
                $file->move(public_path('user_upload/agent_cover_photo'), $fileName);

                if ($oldImage && file_exists(public_path('user_upload/agent_cover_photo/' . $oldImage))) {
                    unlink(public_path('user_upload/agent_cover_photo/' . $oldImage));
                }

                $update = $agent->update(['agent_cover_photo' => $fileName]);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'cover photo updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => asset('user_upload/agent_cover_photo/' . ltrim($fileName, '/')),
                        ],
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }

            return response()->json([
                'status' => 0,
                'message' => 'No image file found in the request.',
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 0,
                'message' => 'File size limit exceeded. Max size 5 MB',
            ], 200);
        } catch (\Throwable $e) {
            // You may want to log the actual error here.
            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

      public function agentCoverImageDelete(Request $request)
    {
        try {

            if ($request->agent_cover_photo) {

                $agent = AgentAdditional::where('agent_id', $request->agent_id)->first();

                if (!$agent) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Agent not found.',
                    ], 404);
                }



                if ($request->agent_cover_photo && file_exists(public_path('user_upload/agent_cover_photo/' . $request->agent_cover_photo))) {
                    unlink(public_path('user_upload/agent_cover_photo/' . $request->agent_cover_photo));
                }

                $update = $agent->update(['agent_cover_photo' => '']);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Cover Photo deleted successfully.',
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }

            return response()->json([
                'status' => 0,
                'message' => 'No image file found in the request.',
            ], 400);
        } catch (\Throwable $e) {
            // You may want to log the actual error here.
            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
