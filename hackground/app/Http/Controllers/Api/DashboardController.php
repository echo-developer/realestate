<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\PrefProject;
use App\Models\ProjectView;
use Illuminate\Support\Arr;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use App\Models\PropertyView;
use Illuminate\Http\Request;
use App\Models\AgentAdditional;
use App\Models\ProjectFavorite;
use App\Models\UserTransaction;
use App\Models\CertificatesModel;
use App\Models\ProjectAdditional;
use Illuminate\Support\Facades\DB;
use App\Models\AgentSocialPlatform;
use function Laravel\Prompts\table;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Pagination\Paginator;
use App\Models\PrefPropertyAdditional;
use App\Models\ProjectPropertyMapping;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Models\AgentSecviceLocationModel;
use Illuminate\Pagination\LengthAwarePaginator;

class DashboardController extends Controller
{
    protected $apiModel;
    protected $auth_user_id;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
        $this->auth_user_id = auth_user_id();
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }



    public function update_profile_image(Request $request)
    {

        try {
            $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:5120',
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
                'status' => 0,
                'message' => 'File size limit exceeded. Max size 5 MB',
                // 'errors' => $e->errors(),
            ], 200);
        } catch (\Throwable $e) {
            throw $e;
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

                        // Only process the first exterior image and break
                        if ($galleryType === 'exterior') {
                            $imageUrl = asset('user_upload/property_images/' . $image->filename);

                            $galleries[] = [
                                'gallery' => 'exterior',
                                'images' => [[
                                    'image_id' => $image->image_id,
                                    'image_name' => $image->filename,
                                    'image_url' => $imageUrl,
                                    'caption' => $image->caption
                                ]]
                            ];

                            break; // stop loop after first exterior image is added
                        }
                    }

                    $transformedData = $galleries;
                    $project_id = ProjectPropertyMapping::where('property_id', $property->property_id)
                        ->value('project_id');

                    $project = PrefProject::where('id', $project_id)
                        ->with(
                            'settings',
                            'galleries:id,project_id,image_type',
                            'galleries.images:id,gallary_id,filename,caption',
                        )
                        ->first();
                    $baseImageUrl = asset('user_upload/project_images');

                    $formattedProjectGalleries = [];

                    $exteriorGallery = collect(optional($project)->galleries)->firstWhere('image_type', 'exterior');

                    if ($exteriorGallery && !empty($exteriorGallery['images'])) {
                        $firstImage = $exteriorGallery['images'][0]; // Get only the first image

                        $formattedProjectGalleries[] = [
                            'gallery' => 'exterior',
                            'images' => [[
                                'image_id' => $firstImage['id'] ?? null,
                                'image_name' => $firstImage['filename'] ?? '',
                                'image_url' => isset($firstImage['filename']) ? $baseImageUrl . '/' . $firstImage['filename'] : null,
                                'caption' => $firstImage['caption'] ?? null,
                            ]]
                        ];
                    }


                    return [
                        'property_id' => $property->property_id,
                        'image_count' => getGalleriesCount($property->property_id, 'property') > 0 ? getGalleriesCount($property->property_id, 'property') : getGalleriesCount($project_id, 'project'),
                        'user' => get_user_name($property->uid),
                        'unit_type' => $property->unit_type,
                        'property_size' => $property->super_area,
                        'area_in_sqft' => $property->area_in_sqft,
                        'property_name' => $property->property_name,
                        'slug' => $property->slug,
                        'views' => $property->views,
                        'is_featured' => $property->is_featured,
                        'status' => $property->status,
                        'is_populer' => $property->is_populer,
                        'parking_ability' => $property->parking_ability,
                        'property_type' => get_name_by_id('property_category_names', 'category_id', $property->property_type, 'en'),
                        'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                        'bedrooms' => $property->bedrooms,
                        'bathroom' => $property->bathrooms,
                        'currency' => $property->price_currency,
                        'price' => $property->expected_price,
                        'created_at' => $property->created_at,
                        'address' => $property->property_address,
                        'brochure_file' => $property->brochure_file,
                        'brochure_url' => !empty($property->brochure_file) ? asset('user_upload/property_brochure/' . $property->brochure_file) : '',
                        'galleries' => $transformedData != null ? $transformedData : $formattedProjectGalleries,
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function UpdateAmenities(Request $request)
    {
        try {
            if (!empty($request->property_id)) {
                $amenityIds = $request->amenity_id;

                if (!is_array($amenityIds)) {
                    $amenityIds = json_decode($amenityIds, true); // Convert string to array if necessary
                }
                $prop_id = $request->property_id;

                $data = [
                    'id_string' => $amenityIds,
                    'prop_id' => $prop_id,
                ];

                $result = $this->apiModel->UpdatePropertyAmenities($data);


                return response()->json([
                    'status' => 1,
                    'message' => 'Amenity updated successfully.',
                ]);
            } elseif (!empty($request->project_id)) {
                $amenityIds = $request->amenity_id;
                if (!is_array($amenityIds)) {
                    $amenityIds = json_decode($amenityIds, true); // Convert string to array if necessary
                }
                $proj_id = $request->project_id;

                $data = [
                    'id_string' => $amenityIds,
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function GetPropertyAdditionalDetails(Request $request)
    {
        try {

            if (empty($request->property_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Property Id not found',
                ]);
            }

            $propertyDetails = PrefProperty::where('id', $request->property_id)
                ->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
                ->with(['additional', 'landmarks'])
                ->first();

            if (!$propertyDetails) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No data found.',
                    'data' => [],
                ]);
            }

            $formattedLandmarks = [];
            foreach ($propertyDetails->landmarks as $landmark) {
                $baseKey = preg_replace('/\d+$/', '', $landmark->landmark_type);
                $details = json_decode($landmark->landmark_details, true) ?? [];
                $details[$baseKey . '_count'] = $landmark->landmark_type_count;
                $formattedLandmarks[$baseKey][] = array_merge(['key' => $landmark->landmark_type], $details);
            }
            $propertyData = $propertyDetails->toArray();
            $flattened = array_merge(
                $propertyData,
                $propertyData['additional'] ?? [],
            );
            foreach (['overlooking', 'flooring_style'] as $key) {
                if (isset($flattened[$key]) && is_string($flattened[$key])) {
                    $flattened[$key] = json_decode($flattened[$key], true);
                }
            }
            $flattened['landmarks'] = $formattedLandmarks;

            $allowedKeys = ['id', 'landmarks', 'overlooking', 'flooring_style', 'water_available', 'electric_available', 'ownership_type', 'buyer_message', 'approved_by']; //required keys
            $filteredArray = array_intersect_key($flattened, array_flip($allowedKeys));

            // log::info($flattened);
            // log::info($filteredArray);

            return response()->json([
                'status' => 1,
                'message' => 'Data retrived successfully',
                'data' => $filteredArray,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function UpdatepropertyAdditonalDetails(Request $request)
    {
        try {
            if (empty($request->property_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Property Id not found',
                ]);
            }
            $this->UpdateExtraAdditionalData($request);
            $this->UpdateExtraPropertyLandmarks($request);

            return response()->json([
                'status' => 1,
                'message' => 'Property Updated successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in UpdatepropertyAdditonalDetails: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    private function UpdateExtraAdditionalData($req)
    {

        try {
            $fields = [
                'ownership_type' => $req->ownership_type,
                'flooring_style' => $req->flooring_style,
                'overlooking' => $req->overlooking,
                'water_available' => $req->water_available,
                'electric_available' => $req->electric_available,
                'buyer_message' => $req->buyer_message,
                'approved_by' => $req->approved_by,
            ];

            $datatoupdate = array_filter(
                $fields,
                fn($value, $key) => ($value !== null && $value !== ''),
                ARRAY_FILTER_USE_BOTH
            );

            if (!empty($datatoupdate)) {
                DB::table('property_additional')
                    ->where('pid', $req->property_id)
                    ->update($datatoupdate);
            }

            return response()->json(['status' => 1, 'message' => 'Property updated successfully']);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    private function UpdateExtraPropertyLandmarks($req)
    {
        try {

            $prop_id = $req->property_id;
            $landmarks = json_decode($req->landmarks, true);
            // Log::info($landmarks);

            if (isset($landmarks)) {

                $existing_landmarks_types = DB::table('property_landmarks')
                    ->where('property_id', $prop_id)
                    ->pluck('landmark_type')
                    ->toArray();


                $removed_landmarks_types = array_diff($existing_landmarks_types, array_keys($landmarks));


                if (count($removed_landmarks_types) > 0) {
                    DB::table('property_landmarks')
                        ->where('property_id', $prop_id)
                        ->whereIn('landmark_type', $removed_landmarks_types)
                        ->delete();
                }


                foreach ($landmarks as $landmark_type => $landmark_details) {

                    $landmark_count = count($landmark_details);


                    foreach ($landmark_details as $item) {
                        $landmark_details_string = [
                            'name' => $item['name'] ?? null,
                            'distance' => $item['distance'] ?? null,
                        ];

                        $existingLandmark = DB::table('property_landmarks')
                            ->where('property_id', $prop_id)
                            ->where('landmark_type', $item['key']);

                        if ($existingLandmark->exists()) {

                            $update = $existingLandmark->update([
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ]);
                        } else {

                            $data = [
                                'property_id' => $prop_id,
                                'landmark_type' => $item['key'],
                                'landmark_details' => json_encode($landmark_details_string),
                                'landmark_type_count' => $landmark_count
                            ];
                            $insert = DB::table('property_landmarks')->insert($data);
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            throw $e;
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

            $alreadyExists = DB::table('my_favorite_property')
                ->where('uid', $data['user_id'])
                ->where('propID', $data['property_id'])
                ->first(['status']);

            if ($alreadyExists) {

                $newStatus = $alreadyExists->status == config('constants.STATUS_ACTIVE') ? config('constants.STATUS_INACTIVE') : config('constants.STATUS_ACTIVE');
                DB::table('my_favorite_property')
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
        } catch (\Throwable $e) {
            throw $e;
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
                    'image_count' => getGalleriesCount($property->property_id, 'property'),
                    'user' => get_user_name($property->uid),
                    'property_size' => $property->super_area,
                    'unit_type' => $property->unit_type,
                    'area_in_sqft' => $property->area_in_sqft,
                    'super_area' => $property->super_area,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->property_type_for, 'en'),
                    'bedrooms' => $property->bedrooms,
                    'bathroom' => $property->bathrooms,
                    'currency' => $property->price_currency ?? null,
                    'price' => $property->expected_price,
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
                    'favorite_properties' => array_values($paginatedProperties->items()),
                    'pagination' => [
                        'current_page' => $paginatedProperties->currentPage(),
                        'per_page' => $paginatedProperties->perPage(),
                        'total_pages' => $paginatedProperties->lastPage(),
                        'total_properties' => $paginatedProperties->total(),
                    ]
                ],
            ]);
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
                    'settings:project_id,project_budget,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,post_for,unit_type,area_in_sqft',
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
                    'image_count' => getGalleriesCount($project->id, 'project'),
                    'post_for' => $project->settings->post_for ?? null,
                    'unit_type' => $project->settings->unit_type ?? null,
                    'area_in_sqft' => $project->settings->area_in_sqft ?? null,
                    'project_size' => $project->settings->total_area ?? null,
                    'occupied_area' => $project->settings->occupied_area ?? null,
                    'total_units' => $project->settings->total_units ?? null,
                    'project_furnish' => $project->settings->project_furnish ?? null,
                    'project_type' => get_name_by_id('property_category_names', 'category_id', $project->settings->project_type, 'en') ?? null,
                    'currency' => $project->additional->currency ?? null,
                    'token_amount' => $project->additional->token_amount ?? null,
                    'expected_price' => $project->additional->expected_price ?? null,
                    'locality' => $project->location->locality ?? null,
                    'city' => get_name_by_id('city_names', 'city_id', $project->location->city, 'en') ?? null,
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function update_my_profile(Request $req)
    {
        try {
            log::info($req->all());
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function add_agent_additional_data($req)
    {
        try {

            $dataNotFiltered = [
                'license_no' => $req->license_number,
                'experience_yr' => $req->experience_years,
                'specialization' => $req->specialization,
                'language_speak' => $req->language_speak,
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function agentDocUplaod(Request $request)
    {
        try {
            $agent_doc = $request->file('file');
            $agent_id = $request->input('user_id');

            if (empty($agent_id) || empty($agent_doc)) {
                return response()->json([
                    'success' => 1,
                    'message' => empty($agent_id) ? 'User Id not Found' : 'No File Found',
                ]);
            }
            $fileName = $agent_doc->getClientOriginalName();


            $uploadPath = public_path('user_upload/agent_docs');


            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $existingRecord = AgentAdditional::where('agent_id', $agent_id)->first();
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
                'doc_url' => asset('user_upload/agent_docs/' . $fileName),
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function removeUploadedDoc(Request $request)
    {
        try {
            $agent_id = $request->input('user_id');

            if (empty($agent_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'User ID is required',
                ]);
            }

            $existingRecord = AgentAdditional::where('agent_id', $agent_id)->first();

            if (!$existingRecord) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No record found for the given User ID',
                ]);
            }

            $oldFileName = $existingRecord->agent_doc ?? '';

            if (empty($oldFileName)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No file found to delete',
                ]);
            }

            $existingRecord->update(['agent_doc' => null]);

            $oldFile = public_path("user_upload/agent_docs/{$oldFileName}");

            if (file_exists($oldFile)) {
                unlink($oldFile);
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'File does not exist on the server',
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'File removed successfully',
            ], 200);
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function uploaodPrtBrochure(Request $request)
    {
        try {
            $property_brochure = $request->file('brochure_data');
            $property_id = $request->input('property_id');

            $fileName = $property_brochure->getClientOriginalName();


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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    // public function getAllBrochureData(Request $request)
    // {
    //     try {
    //         $property_id = $request->input('property_id');
    //         $project_id = $request->input('project_id');

    //         if (!empty($property_id) && !empty($project_id)) {
    //             return response()->json([
    //                 'status' => 1,
    //                 'message' => 'Both Property and Project IDs are present. Unable to proceed.',
    //             ]);
    //         }

    //         $filter = [];
    //         if (!empty($property_id)) {
    //             $brochureData = PrefPropertyAdditional::where('pid',$property_id)->value('brochure_file');
    //         } elseif (!empty($project_id)) {
    //             $brochureData = ProjectAdditional::where('project_id',$project_id)->value('brochure_file');
    //         } else {
    //             return response()->json([
    //                 'status' => 1,
    //                 'message' => 'Either Property ID or Project ID must be provided.',
    //             ]);
    //         }

    //         if ($brochureData->isEmpty()) {
    //             return response()->json([
    //                 'status' => 1,
    //                 'message' => 'No certificates found.',
    //                 'data' => []
    //             ]);
    //         }

    //         return response()->json([
    //             'status' => 1,
    //             'message' => 'Data retrieved successfully.',
    //             'data' => $brochureData,
    //         ]);
    //     } catch (\Throwable $e) {
    //         throw $e;
    //     }
    // }

    public function uploadPropProjcertificatesImages(Request $request)
    {
        try {
            $file = $request->file('file');
            $property_id = $request->input('property_id');
            $project_id = $request->input('project_id');

            if (empty($file)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No File Found',
                ]);
            }
            if (!empty($property_id) && !empty($project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Both Property and Project id present. Unable to Upload',
                ]);
            }
            $fileName = '';
            $uploadPath = '';
            $filename_url = '';
            if (!empty($property_id) && empty($project_id)) {
                $fileName = "prt_{$property_id}_" . $file->getClientOriginalName();
                $uploadPath = public_path("user_upload/Certificates/property_certificate");
                $filename_url = asset("user_upload/Certificates/property_certificate/" . $fileName);
            } elseif (!empty($project_id) && empty($property_id)) {
                $fileName = "prj_{$project_id}_" . $file->getClientOriginalName();
                $uploadPath = public_path("user_upload/Certificates/project_certificate");
                $filename_url = asset("user_upload/Certificates/project_certificate/" . $fileName);
            }

            if (!file_exists($uploadPath) && !empty($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }


            // $existingRecord = PrefPropertyAdditional::where('pid', $property_id)->first();
            // if ($existingRecord) {
            //     $oldFile = $existingRecord->brochure_file;
            //     $oldFilePath = public_path("user_upload/property_brochure/{$oldFile}");
            //     if ($oldFile && file_exists($oldFilePath)) {
            //         unlink($oldFilePath);
            //     }
            // }


            $file->move($uploadPath, $fileName);


            // PrefPropertyAdditional::updateOrCreate(
            //     ['pid' => $property_id],
            //     ['brochure_file' => $fileName]
            // );

            return response()->json([
                'status' => 1,
                'message' => 'File Uploaded',
                'fileName' => $fileName,
                'filename_url' => $filename_url,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function uploadPropProjcertificatesDetails(Request $request)
    {
        try {
            $property_id = $request->input('property_id');
            $project_id = $request->input('project_id');
            $fileName = $request->input('fileName');
            $doc_id = $request->input('doc_id');
            $certificate_name = $request->input('certificate_name');
            $certificate_number = $request->input('certificate_number');

            if (!empty($property_id) && !empty($project_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Both Property and Project id present. Unable to Proceed',
                ]);
            }

            $dataToInsert = [
                'property_id' => $property_id,
                'project_id' => $project_id,
                'certificate_name' => $certificate_name,
                'certificate_number' => $certificate_number,
                'fileName' => $fileName
            ];

            if (empty($doc_id)) {
                CertificatesModel::create($dataToInsert);
                return response()->json([
                    'status' => 1,
                    'message' => 'Certificates Details Uploaded',
                ]);
            } else {
                CertificatesModel::updateOrCreate(
                    ['id' => $doc_id],
                    $dataToInsert
                );
                return response()->json([
                    'status' => 1,
                    'message' => 'Certificates Details Uploaded',
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getPropPropertycertificateDetails(Request $request)
    {
        try {
            $property_id = $request->input('property_id');
            $project_id = $request->input('project_id');

            if (!empty($property_id) && !empty($project_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Both Property and Project IDs are present. Unable to proceed.',
                ]);
            }

            $filter = [];
            if (!empty($property_id)) {
                $filter = ['property_id' => $property_id, 'project_id' => null, 'status' => config('constants.STATUS_ACTIVE')];
            } elseif (!empty($project_id)) {
                $filter = ['project_id' => $project_id, 'property_id' => null, 'status' => config('constants.STATUS_ACTIVE')];
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'Either Property ID or Project ID must be provided.',
                ]);
            }

            $certificates = CertificatesModel::where($filter)->get();

            if ($certificates->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No certificates found.',
                    'data' => []
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $certificates,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getPropPropertycertificatedelete(Request $request)
    {
        try {
            $property_id = $request->input('property_id');
            $project_id = $request->input('project_id');
            $doc_id = $request->input('doc_id');

            if (!empty($property_id) && !empty($project_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Both Property and Project IDs are present. Unable to proceed.',
                ]);
            }

            $filter = [];
            if (!empty($property_id)) {
                $filter = ['property_id' => $property_id, 'id' => $doc_id, 'project_id' => null];
            } elseif (!empty($project_id)) {
                $filter = ['project_id' => $project_id, 'id' => $doc_id, 'property_id' => null];
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'Either Property ID or Project ID must be provided.',
                ]);
            }

            CertificatesModel::where($filter)->update(['status' => config('constants.STATUS_DELETE')]);

            return response()->json([
                'status' => 1,
                'message' => 'Certificate Details Deleted',
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }



    /*

            -------------------------------- DASHBOARD STATICTICS ------------------------------
    

     */



    public function DashboardData(Request $request)
    {
        try {
            $user_id = $request->input('user_id');

            if (empty($user_id)) {
                return response()->json([
                    'status' => 1,
                    'message' => 'User Id not found',
                ]);
            }
            $counter = $this->counters($user_id) ?? null;
            $propertyViewsBarGraph = $this->barGraphforViews($user_id, 'property') ?? [];
            $propertyEnqueryBarGraph = $this->barGraphforEnquery($user_id) ?? [];
            $topViewsPropList = $this->topViewsPropList($user_id) ?? [];
            $propPieChart = $this->propertyPieChart($user_id) ?? [];

            return response()->json([
                'status' => 1,
                'data' => [
                    'counters' => $counter,
                    'viewBargraph' => $propertyViewsBarGraph,
                    'enqueryBargraph' => $propertyEnqueryBarGraph,
                    'topViewsPropList' => $topViewsPropList,
                    'propPieChart' => $propPieChart,
                ],
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    private function counters($user_id)
    {
        $fav_property_count = DB::table('my_favorite_property')
            ->where([
                'uid' => $user_id,
                'status' => config('constants.STATUS_ACTIVE')
            ])
            ->count();

        $propertyCount = UsersPropertyCount($user_id);
        $projectCount = UsersProjectCount($user_id);

        $totalSpendingOnMembership = UserTransaction::where('user_id', $user_id)->sum('paid_amount');

        $propertyEnqueryCount = fetch_enquery_count($user_id, 'property');
        $projectEnqueryCount = fetch_enquery_count($user_id, 'project');

        $allPropertiesViewsCount = fetch_totalViews_count($user_id, 'property');
        $allProjectsViewsCount = fetch_totalViews_count($user_id, 'project');

        $allPropertiesReviewsCount = fetch_totalReview_count_of_property($user_id);
        $allProjectsReviewsCount = fetch_totalReview_count_of_project($user_id);

        $countofPublishedProperty = propertyCountbasedOnStatus($user_id, config('constants.STATUS_ACTIVE'));

        return [
            'totalSpending'   => $totalSpendingOnMembership,
            'favProperty'     => $fav_property_count,
            'forSell'         => $propertyCount['forSell'] ?? 0,
            'forRent'         => $propertyCount['forRent'] ?? 0,
            'allProperty'     => ($propertyCount['forSell'] ?? 0) +
                ($propertyCount['forRent'] ?? 0) +
                ($propertyCount['unknown'] ?? 0),
            'allProject'     => ($projectCount['forSell'] ?? 0) +
                ($projectCount['forRent'] ?? 0) +
                ($projectCount['unknown'] ?? 0),
            'propertyEnquery' => $propertyEnqueryCount ?? 0,
            'projectEnquery'  => $projectEnqueryCount ?? 0,
            'propertyTotalViews'  => $allPropertiesViewsCount,
            'projectTotalViews'  =>  $allProjectsViewsCount,
            'propertyTotalReviews'  =>  $allPropertiesReviewsCount,
            'projectTotalReviews'  =>  $allProjectsReviewsCount,
            'activeListing'  =>  $countofPublishedProperty,
        ];
    }

    private function barGraphforViews($user_id, $type)
    {
        $model = ($type === 'property') ? new PropertyView() : new ProjectView();

        return $model->selectRaw("DATE_FORMAT(view_date, '%Y-%m') AS month, SUM(view_count) AS total_views")
            ->where('user_id', $user_id)
            ->where('view_date', '>=', now()->subMonths(4)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'DESC')
            ->get();
    }

    private function barGraphforEnquery($user_id)
    {
        return DB::table('property_enquiry')
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as enquiry_count")
            ->where('assign_to', $user_id)
            ->where('created_at', '>=', now()->subMonths(4)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'DESC')
            ->get();
    }

    private function topViewsPropList($user_id)
    {
        $propLists = PrefProperty::where([
            'uid' => $user_id,
            'is_deleted' => config('constants.STATUS_INACTIVE'),
        ])
            ->with(['settings', 'views', 'location'])
            ->withCount(['views as total_views' => function ($query) {
                $query->select(DB::raw("COALESCE(SUM(view_count), 0)"));
            }])
            ->orderByDesc('total_views')
            ->limit(6)
            ->get();
        $mapLists = $propLists->map(function ($prt) {
            return [
                'id' => UniquePropertyCode($prt->id),
                'total_views' => $prt->total_views ?? null,
                'name' => $prt->name ?? null,
                'slug' => $prt->slug ?? null,
                'locality' => $prt->location->locality ?? null,
                'address' => $prt->location->property_address ?? null,
                'property_type' => isset($prt->settings) ? get_name_by_id('property_category_names', 'category_id', $prt->settings->property_type, 'en') : null,
                'post_for' => $prt->settings->post_for ?? null,
                'property_for' => isset($prt->settings) ? get_name_by_id('property_sub_category_names', 'sub_category_id', $prt->settings->property_type_for, 'en') : null,
                'created_at' => $prt->created_at ?? null,
            ];
        });

        return $mapLists;
    }

    private function propertyPieChart($user_id)
    {
        $propList = PrefProperty::where([
            'uid' => $user_id,
            'is_deleted' => config('constants.STATUS_INACTIVE'),
        ])
            ->with('settings')
            ->get()
            ->groupBy(fn($prop) => $prop->settings->property_type_for ?? 'Unknown')
            ->map(fn($group, $key) => [
                'group' => get_name_by_id('property_sub_category_names', 'sub_category_id', $key, 'en') ?? $key,
                'count' => $group->count()
            ])
            ->values();

        $totalCount = $propList->sum('count');

        $propList->push([
            'total_count' => $totalCount
        ]);
        return $propList;
    }
}
