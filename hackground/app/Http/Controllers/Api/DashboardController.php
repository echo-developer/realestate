<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgentAdditional;
use App\Models\AgentSecviceLocationModel;
use App\Models\AgentSocialPlatform;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectFavorite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }

    public function get_user_profile($id)
    {
        try {
            // Fetch user data as a single record
            $data = $this->apiModel->getUser($id);

            // Check if data is null (no user found)
            if (is_null($data)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No result found.',
                    'data' => null,
                ]);
            }

            // Append the full image URL to the image field
            if ($data->image) {
                $data->image = asset('user_upload/profile_image/' . $data->image); // Concatenate URL with image name
            } else {
                $data->image = null; // If no image exists, set it to null
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in retrieving data: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }



    public function update_profile_image(Request $request)
    {

        try {
            $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            $id = $request->id;

            if ($request->hasFile('image')) {

                $user = User::find($id);
                $oldImage = $user->image;


                $file = $request->file('image');
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('user_upload/profile_image'), $fileName);


                if ($oldImage && file_exists(public_path('user_upload/profile_image/' . $oldImage))) {
                    unlink(public_path('user_upload/profile_image/' . $oldImage));
                }


                $update = $user->update(['image' => $fileName]);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Profile image updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => asset('user_upload/profile_image/' . ltrim($fileName, '/')),
                        ],
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                        'message' => 'Failed to update the profile image in the database.',
                    ]);
                }
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle other exceptions
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while updating the profile image.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function Dashboard_prop_list(Request $request)
    {

        try {

            if (!empty($request->user_id)) {

                $properties = $this->apiModel->getUserPropertyList($request->user_id);

                if ($properties->isEmpty()) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No result found.',
                        'data' => [],
                    ]);
                }

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
                        'status' => $property->status,
                        'is_populer' => $property->is_populer,
                        'parking_ability' => $property->parking_ability,
                        'property_type' => get_name_by_id('pref_property_category_names', 'category_id', $property->property_type, 'en'),
                        'property_type_for' => get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                        'bedrooms' => $property->bedrooms,
                        'bathroom' => $property->bathrooms,
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'created_at' => $property->created_at,
                        'address' => $property->property_address,
                        'galleries' => $transformedData,
                    ];
                });

                $statusMapping = config('property_status.status');

                $data = [];
                foreach ($statusMapping as $key => $value) {

                    $Properties = $formattedProperties
                        ->filter(fn($property) => $property['status'] === $key)
                        ->values();

                    $currentpage = $request->input($value . '_page', 1);
                    $page = (int) ($request->page ?? 10);
                    $paginatedProperties = $Properties->slice(($currentpage - 1) * $page, $page);

                    $data[$value . '_properties'] = [
                        'current_page' => $currentpage,
                        'total_pages' => ceil($Properties->count() / $page),
                        'per_page' => $page,
                        'data' => $paginatedProperties->values(),
                    ];
                }

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrieved successfully.',
                    'data' => $data,
                ], 200);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No user id found.',
                    'data' => [],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in retrieved Data: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }


    public function Propertyfavorite(Request $request)
    {
        try {

            $data = [
                'userID' => $request->userID,
                'is_favorite' => $request->status,
                'propID' => $request->propID,
            ];

            $data = $this->apiModel->PropertyfavoriteStaus($data);

            if ($data > 0) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Favorite status updated successfully.',
                ], 200);
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'No changes made.',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Unexpected Exception in PropertyfavoriteStaus: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data.',
                'error' => 'Unexpected error occurred.',
            ]);
        }
    }

    public function ChangeUserPassword(Request $request)
    {
        try {
            $data = $request->only(['user_id', 'oldpassword', 'newpassword', 'confirm_password']);

            if ($data['newpassword'] !== $data['confirm_password']) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Confirm password does not match.',
                ]);
            }

            $result = $this->apiModel->changePassword($data);

            if ($result) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Password updated successfully.',
                ]);
            }

            return response()->json([
                'status' => 0,
                'message' => 'Incorrect old password.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ChangeUserPassword: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }

    public function PropertyDelete(Request $request)
    {
        try {
            $prop_id = $request->id;
            $result = $this->apiModel->DeleteProperty($prop_id);

            if ($result) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Property Deleted',
                ]);
            }

            return response()->json([
                'status' => 0,
                'message' => 'No property deleted',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ChangeUserPassword: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }

    public function PropertyAmenities(Request $request)
    {
        try {
            $amenityProperty = [];
            $amenityProject = [];

            if ($request->property_id) {

                $property_id = $request->property_id;
                $result = $this->apiModel->GetPropertyAmenities($property_id);

                if ($result->isNotEmpty()) {
                    $amenityProperty = $result
                        ->map(fn($item) => json_decode($item, true))
                        ->flatten() // Flatten the nested array
                        ->values() // Reindex array
                        ->toArray();
                }
            }

            if ($request->project_id) {

                $project_id = $request->project_id;
                $result = $this->apiModel->GetProjectAmenities($project_id);

                if ($result->isNotEmpty()) {
                    $amenityProject = $result
                        ->map(fn($item) => json_decode($item, true))
                        ->flatten() // Flatten the nested array
                        ->values() // Reindex array
                        ->toArray();
                }
            }

            $lang = 'en';
            $allAmenity = $this->apiModel->getPropertyAmnity($lang);


            return response()->json([
                'status' => 1,
                'property_amenity_ids' => $amenityProperty,
                'project_amenity_ids' => $amenityProject,
                'amenity_options' => $allAmenity,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in ChangeUserPassword: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }

    public function UpdateAmenities(Request $request)
    {
        try {
            if (!empty($request->property_id)) {
                $id_string = json_encode($request->amenity_id, true);
                $prop_id = $request->property_id;

                $data = [
                    'id_string' => $id_string,
                    'prop_id' => $prop_id,
                ];

                $result = $this->apiModel->UpdatePropertyAmenities($data);


                return response()->json([
                    'status' => 1,
                    'message' => 'Amenity updated successfully.',
                ]);
            } elseif (!empty($request->project_id)) {
                $id_string = json_encode($request->amenity_id, true);
                $proj_id = $request->project_id;

                $data = [
                    'id_string' => $id_string,
                    'proj_id' => $proj_id,
                ];

                $result = $this->apiModel->UpdateProjectAmenities($data);

                return response()->json([
                    'status' => 1,
                    'message' => 'Amenity updated successfully.',
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in UpdateAmenities: ' . $e->getMessage());

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred. Please try again later.',
            ]);
        }
    }

    public function Add_fav_Property(Request $request)
    {
        try {
            $data = [
                'user_id' => $request->input('user_id'),
                'property_id' => $request->input('property_id'),
                'status' => config('constants.STATUS_ACTIVE'),
            ];
            if (empty($data['user_id']) && empty($data['property_id'])) {
                return response()->json([
                    'status' => 0,
                    'message' => 'insufficient data',
                ]);
            }

            $alreadyExists = DB::table('pref_my_favorite_property')
                ->where('uid', $data['user_id'])
                ->where('propID', $data['property_id'])
                ->first(['status']);

            if ($alreadyExists) {

                $newStatus = $alreadyExists->status == config('constants.STATUS_ACTIVE') ? config('constants.STATUS_INACTIVE') : config('constants.STATUS_ACTIVE');
                DB::table('pref_my_favorite_property')
                    ->where([
                        'uid' => $data['user_id'],
                        'propID' => $data['property_id'],
                    ])
                    ->update(['status' => $newStatus]);

                $message = $newStatus == config('constants.STATUS_ACTIVE')
                    ? 'Property added to favorites'
                    : 'Property removed from favorites';

                return response()->json(
                    [
                        'status' => 1,
                        'message' => $message
                    ],
                    200
                );
            } else {
                $result = $this->apiModel->AddmyFavoriteProperty($data);

                if ($result > 0) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Property added to favorites',
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred. Please try again later.',
            ]);
        }
    }

    public function My_fav_Property_List(Request $request)
    {
        try {
            $user_id = $request->input('user_id');
            $perPage = $request->input('limit', 10); // Items per page
            $currentPage = Paginator::resolveCurrentPage('current_page'); // Get current page

            if (!$user_id) {
                return response()->json([
                    'status' => 0,
                    'message' => 'NO USER ID FOUND',
                ]);
            }

            // Fetch favorite properties
            $properties = $this->apiModel->myFavoritePropertyList($user_id);

            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }

            // Transform properties
            $formattedProperties = $properties->map(function ($property) {
                $galleries = GetProperties_GalleryImages($property->property_id)->groupBy('image_type')->map(function ($images, $type) {
                    return [
                        'gallery' => $type,
                        'images' => $images->map(function ($image) {
                            return [
                                'image_id' => $image->image_id,
                                'image_name' => $image->filename,
                                'image_url' => asset('user_upload/property_images/' . $image->filename),
                                'caption' => $image->caption
                            ];
                        })->values()
                    ];
                })->values();

                return [
                    'property_id' => $property->property_id,
                    'user' => get_user_name($property->uid),
                    'property_size' => $property->carpet_area * $property->plot_area,
                    'super_area' => $property->super_area,
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

            // Laravel pagination
            $paginatedProperties = new LengthAwarePaginator(
                $formattedProperties->forPage($currentPage, $perPage),
                $formattedProperties->count(),
                $perPage,
                $currentPage,
                ['path' => url()->current()]
            );

            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => [
                    'favorite_properties' => $paginatedProperties->items(),
                    'pagination' => [
                        'current_page' => $paginatedProperties->currentPage(),
                        'per_page' => $paginatedProperties->perPage(),
                        'total_pages' => $paginatedProperties->lastPage(),
                        'total_properties' => $paginatedProperties->total(),
                    ]
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in My_fav_Property_List: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred. Please try again later.',
            ]);
        }
    }

    public function PropertyFavoriteDelete(Request $request)
    {

        try {
            $data = [
                'user_id' => $request->input('user_id'),
                'prop_id' => $request->input('property_id')
            ];

            if (empty($data['user_id']) || empty($data['prop_id'])) {

                return response()->json(
                    [
                        'status' => 0,
                        'message' => 'Data Insufficient'
                    ]
                );
            }

            $removeFavorite = $this->apiModel->RemovePropertyFromfavList($data);
            return response()->json([
                'status' => 1,
                'message' => 'Property removed From Favorite List',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function Add_fav_Project(Request $request)
    {
        try {
            $data = [
                'user_id' => $request->input('user_id'),
                'project_id' => $request->input('project_id'),
                'status' => config('constants.STATUS_ACTIVE'),
            ];
            if (empty($data['user_id']) && empty($data['project_id'])) {
                return response()->json([
                    'status' => 0,
                    'message' => 'insufficient data',
                ]);
            }

            $alreadyExists = ProjectFavorite::where('uid', $data['user_id'])
                ->where('project_id', $data['project_id'])
                ->first(['status']);

            if ($alreadyExists) {

                $newStatus = $alreadyExists->status == config('constants.STATUS_ACTIVE') ? config('constants.STATUS_INACTIVE') : config('constants.STATUS_ACTIVE');

                ProjectFavorite::where([
                    'uid' => $data['user_id'],
                    'project_id' => $data['project_id'],
                ])->update(['status' => $newStatus]);

                $message = $newStatus == config('constants.STATUS_ACTIVE')
                    ? 'Project added to favorites'
                    : 'Project removed from favorites';

                return response()->json(
                    [
                        'status' => 1,
                        'message' => $message
                    ],
                    200
                );
            } else {
                $result = $this->apiModel->AddmyFavoriteProject($data);


                return response()->json([
                    'status' => 1,
                    'message' => 'Project added to favorites',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function My_fav_Project_List(Request $request)
    {
        try {
            $perPage = $request->input('limit', 10);
            $currentPage = $request->input('currentpage', 1);


            $offset = ($currentPage - 1) * $perPage;

            $searchResults = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->whereHas('favorite', function ($query) use ($request) {
                    $query->where([
                        'uid' => $request->user_id,
                        'status' => config('constants.STATUS_ACTIVE'),
                    ]);
                })
                ->with([
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing',
                    'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                    'location:project_id,locality,city,address',
                    'gallery:id,project_id,image_type',
                    'gallery.images:gallary_id,filename,caption'
                ])
                ->skip($offset)
                ->take($perPage)
                ->get();

            $totalProjects = PrefProject::where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->whereHas('favorite', function ($query) use ($request) {
                    $query->where([
                        'uid' => $request->user_id,
                        'status' => config('constants.STATUS_ACTIVE'),
                    ]);
                })
                ->count();

            // Log::info('My_fav_Project_List' . json_encode($searchResults, JSON_PRETTY_PRINT));

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
                    'project_desc' => $project->project_desc,
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
                    'project_size' => $project->settings->total_area ?? null,
                    'occupied_area' => $project->settings->occupied_area ?? null,
                    'total_units' => $project->settings->total_units ?? null,
                    'project_furnish' => $project->settings->project_furnish ?? null,
                    'project_type' => get_name_by_id('pref_property_category_names', 'category_id', $project->settings->project_type, 'en') ?? null,
                    'currency' => $project->additional->currency ?? null,
                    'token_amount' => $project->additional->token_amount ?? null,
                    'expected_price' => $project->additional->expected_price ?? null,
                    'locality' => $project->location->locality ?? null,
                    'city' => get_name_by_id('pref_city_names', 'city_id', $project->location->city, 'en') ?? null,
                    'address' => $project->location->address ?? null,
                    'uname' => get_user_name($project->uid) ?? null,
                ];
            });

            return response()->json([
                'status' => 1,
                'message' => 'Projects fetched successfully',
                'data' => [
                    'favorite_projects' => $customArray,
                    'pagination' => [
                        'current_page' => $currentPage,
                        'per_page' => $perPage,
                        'total_pages' => ceil($totalProjects / $perPage),
                        // 'total_projects' => $totalProjects,
                    ]
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in My_fav_Project_List: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'Something went wrong. Please try again later.',
            ]);
        }
    }


    public function ProjectFavoriteDelete(Request $request)
    {

        try {
            $data = [
                'user_id' => $request->input('user_id'),
                'project_id' => $request->input('project_id')
            ];

            if (empty($data['user_id']) || empty($data['project_id'])) {

                return response()->json(
                    [
                        'status' => 0,
                        'message' => 'Data Insufficient'
                    ]
                );
            }

            ProjectFavorite::where([
                'uid' => $data['user_id'],
                'project_id' => $data['project_id']
            ])
                ->update(['status' => config('constants.STATUS_INACTIVE')]);

            return response()->json([
                'status' => 1,
                'message' => 'Project removed From Favorite List',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }


    public function get_my_profile(Request $request)
    {

        try {
            $lang = $request->input('lang', 'en');
            $get_user = User::with(['userAdditional', 'agentAdditional', 'serviceArea', 'social'])
                ->where('id', $request->user_id)
                ->first();

            // log::info($get_user);

            if (empty($get_user)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'User not found.'
                ]);
            }
            // log::info('get_my_profile' . json_encode($get_user, JSON_PRETTY_PRINT));
            $agentAdditional = $get_user->agentAdditional ?? null;
            if ($agentAdditional) {
                $agentAdditional->agent_docucment = !empty($agentAdditional->agent_doc)
                    ? asset('user_upload/agent_docs/' . $agentAdditional->agent_doc)
                    : null;
                $agentAdditional->docName = !empty($agentAdditional->agent_doc) ? $agentAdditional->agent_doc : null;
                unset($agentAdditional->agent_doc);
            }

            if (!empty($get_user?->image)) {
                $get_user->image = asset('user_upload/profile_image/' . $get_user->image);
            }


            $user = $get_user ? $get_user->toArray() : [];

            $mergedUser = array_merge(
                Arr::except($user, ['user_additional', 'agent_additional', 'service_area', 'social']),
                $user['user_additional'] ?? [],
                $user['agent_additional'] ?? [],
                ['service_area' => $user['service_area'] ?? []],
                ['social' => $user['social'] ?? []]
            );

            $cities = $this->apiModel->getCity($lang);


            return response()->json([
                'status' => 1,
                'message' => 'User retrieved successfully.',
                'data' => [
                    'user' => $mergedUser ?? [],
                    'cities' => $cities ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function update_my_profile(Request $req)
    {
        try {
            // log::info($req->all());
            $user_id = $req->user_id;

            $requestData = [
                'name' => $req->name,
                'email' => $req->email,
                'phone_code' => $req->phone_code,
                'phone' => $req->phone,
                'whatsapp_no' => $req->whatsapp,
                'address' => $req->address,
                'city' => $req->city_id,
                'website_title' => $req->website_title,
                'website_url' => $req->website_url,
                'description' => $req->description,
                'updated_at' => now(),
            ];

            $update  = $this->apiModel->UpdateMyProfileData($user_id, $requestData);

            $usertoBeupdate = User::find($user_id);
            if ($usertoBeupdate->user_type === 'A') {
                $agent_additional  = $this->add_agent_additional_data($req);
                $agent_service_locations  = $this->add_agent_secvice_location_data($req, $user_id);
                $agent_social_links  = $this->add_agent_social_links($req, $user_id);
            }


            return response()->json([
                'status' => 1,
                'message' => 'User profile updated.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function add_agent_additional_data($req)
    {
        try {

            $dataNotFiltered = [
                'license_no' => $req->license_number,
                'experience_yr' => $req->experience_years,
                'specialization' => $req->specialization,
                'broker_type' => $req->broker_type,
                'bussiness_phone' => $req->business_phone,
                'bussiness_email' => $req->business_email,
                'opening_hours' => $req->opening_hours,
                'closing_hours' => $req->closing_hours,
                'company_name' => $req->company_name,
            ];

            $data = array_filter($dataNotFiltered, function ($value) {
                return !is_null($value) && $value !== '';
            });

            $insert = AgentAdditional::updateOrCreate(
                ['agent_id' => $req->user_id],
                $data
            );
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function agentDocUplaod(Request $request)
    {
        try {
            $agent_doc = $request->file('file');
            $agent_id = $request->input('user_id');

            if (empty($agent_id)) {
                return response()->json([
                    'success' => 1,
                    'message' => 'User Id not Found',
                ]);
            }

            $fileName = $agent_doc->getClientOriginalName();


            $uploadPath = public_path('user_upload/agent_docs');


            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $existingRecord = AgentAdditional::where('agent_doc', $agent_id)->first();
            if ($existingRecord) {
                $oldFile = $existingRecord->agent_doc;
                $oldFilePath = public_path("user_upload/agent_docs/{$oldFile}");
                if ($oldFile && file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }


            $agent_doc->move($uploadPath, $fileName);


            AgentAdditional::updateOrCreate(
                ['agent_id' => $agent_id],
                ['agent_doc' => $fileName]
            );

            return response()->json([
                'success' => 1,
                'message' => 'Document Uploaded',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrtBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function add_agent_social_links($req, $user_id)
    {
        try {
            $mediaPlatform = json_decode($req->input('social_media'), true);

            $inputKeys = array_column($mediaPlatform, 'key');

            $existingKeys = AgentSocialPlatform::where('agent_id', $user_id)->pluck('platform_key')->toArray();


            foreach ($mediaPlatform as $media) {
                if (!empty($media['name']) && !empty($media['url'])) {
                    AgentSocialPlatform::updateOrCreate(
                        [
                            'platform_key' => $media['key'],
                            'agent_id' => $user_id
                        ],
                        [
                            'platform_name' => $media['name'] ?? null,
                            'platform_url' => $media['url'] ?? null,
                        ]
                    );
                }
            }
            $keysToDelete = array_diff($existingKeys, $inputKeys);
            if (!empty($keysToDelete)) {
                AgentSocialPlatform::whereIn('platform_key', $keysToDelete)->delete();
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function add_agent_secvice_location_data($req, $user_id)
    {
        try {
            $locations = json_decode($req->input('service_area'), true);

            $inputKeys = array_column($locations, 'key');

            $existingKeys = AgentSecviceLocationModel::where('agent_id', $user_id)->pluck('loc_key')->toArray();

            // 1. Insert or Update Records
            foreach ($locations as $locationData) {
                if (!empty($locationData['city']) && !empty($locationData['locality'])) {
                    AgentSecviceLocationModel::updateOrCreate(
                        [
                            'loc_key' => $locationData['key'],
                            'agent_id' => $user_id
                        ],
                        [
                            'city' => $locationData['city'] ?? null,
                            'locality' => $locationData['locality'] ?? null,
                            'latitude' => $locationData['latitude'] ?? null,
                            'longitude' => $locationData['longitude'] ?? null,
                        ]
                    );
                }
            }
            $keysToDelete = array_diff($existingKeys, $inputKeys);
            if (!empty($keysToDelete)) {
                AgentSecviceLocationModel::whereIn('loc_key', $keysToDelete)->delete();
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }


    public function uploaodPrtBrochure(Request $request)
    {

        try {
            $property_brochure = $request->file('brochure_data');
            $property_id = $request->input('property_id');

            $fileName = "property_{$property_id}_" . $property_brochure->getClientOriginalName();


            $uploadPath = public_path('user_upload/property_brochure');


            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }


            $existingRecord = PrefPropertyAdditional::where('pid', $property_id)->first();
            if ($existingRecord) {
                $oldFile = $existingRecord->brochure_file;
                $oldFilePath = public_path("user_upload/property_brochure/{$oldFile}");
                if ($oldFile && file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }


            $property_brochure->move($uploadPath, $fileName);


            PrefPropertyAdditional::updateOrCreate(
                ['pid' => $property_id],
                ['brochure_file' => $fileName]
            );

            return response()->json([
                'status' => 1,
                'message' => 'Brochure Uploaded',
                // 'file_url' => url("user_upload/property_brochure/{$fileName}") // Publicly accessible URL
            ]);
        } catch (\Exception $e) {
            Log::error('Error in uploaodPrtBrochure: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
