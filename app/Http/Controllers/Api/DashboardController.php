<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
                $data->image = url('profile_image/' . $data->image); // Concatenate URL with image name
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
        // Validate the incoming request
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            $id = $request->id;

            if ($request->hasFile('image')) {
                // Retrieve the user's current image
                $user = User::find($id);
                $oldImage = $user->image;

                // Handle the uploaded file
                $file = $request->file('image');
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('profile_image'), $fileName);

                // Delete the old image from the server if it exists
                if ($oldImage && file_exists(public_path('profile_image/' . $oldImage))) {
                    unlink(public_path('profile_image/' . $oldImage));
                }

                // Update the database with the new image filename
                $update = $user->update(['image' => $fileName]);

                if ($update) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'Profile image updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => url('profile_image/' . ltrim($fileName, '/')),
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
                    if (!empty($property->galleries)) {
                        $galleryEntries = explode(';;', $property->galleries);
                        $galleries = []; // Initialize the galleries array

                        foreach ($galleryEntries as $entry) {
                            $parts = explode('||', $entry);

                            // Process the images
                            $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                            $imagesWithUrl = array_map(function ($image) {
                                return url('property_images/' . $image); // Append the base URL
                            }, $images);

                            $galleries[] = [
                                'gallery_name' => $parts[0] ?? null,
                                'gallery_caption' => $parts[1] ?? null,
                                'images' => $imagesWithUrl,
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
                        'status' => $property->status,
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
                        'total' => $Properties->count(),
                        'per_page' => $page,
                        'data' => $paginatedProperties,
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

            if (!empty($request->property_id)) {

                $property_id = $request->property_id;
                $result = $this->apiModel->GetPropertyAmenities($property_id);

                if ($result->isNotEmpty()) {
                    $amenityIds = $result
                        ->map(fn($item) => json_decode($item, true))
                        ->flatten() // Flatten the nested array
                        ->values() // Reindex array
                        ->toArray();
                }

                $lang = 'en';
                $allAmenity = $this->apiModel->getPropertyAmnity($lang);

                if (!empty($result)) {
                    return response()->json([
                        'status' => 1,
                        'amenity_id' => $amenityIds,
                        'amenity_options' => $allAmenity,
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Amenity found',
                ]);
            }
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
            if (!empty($request->id)) {
                $id_string = json_encode($request->amenity_id, true);
                $prop_id = $request->id;

                $data = [
                    'id_string' => $id_string,
                    'prop_id' => $prop_id,
                ];

                $result = $this->apiModel->UpdatePropertyAmenities($data);


                return response()->json([
                    'status' => 1,
                    'message' => 'Amenity updated successfully.',
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Property ID found.',
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
                'status' => $request->input('status'),
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
            Log::error('Error in UpdateAmenities: ' . $e->getMessage());

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
            $currentPage = $request->input('current_page', 1);
            $limit = $request->input('limit', 10);
            $recentOffset = ($currentPage - 1) * $limit;

            if (empty($user_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'NO USER ID FOUND',
                ]);
            }

            $properties = $this->apiModel->myFavoritePropertyList($user_id);

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

            $favoriteProperties = $formattedProperties
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
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => [
                    'favorite_properties' => $favoriteProperties,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in UpdateAmenities: ' . $e->getMessage());

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
            Log::error('Error in PropertyFavoriteDelete: ' . $e->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'An unexpected error occurred. Please try again later.',
            ]);
        }
    }

    public function PropertyEnqueryList(Request $request)
    {
        try {

            $recentPage = $request->input('recent_page', 1);
            $limit = $request->input('limit', 10);
            $recentOffset = ($recentPage - 1) * $limit;

            $user_id = $request->input('user_id');

            if (!empty($user_id)) {

                $propertyList = $this->apiModel->GetEnquiredPropertyList($user_id);
                if ($propertyList->isEmpty()) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No result found.',
                        'data' => [],
                    ]);
                }

                $formattedProperties = $propertyList->map(function ($property) {
                    $galleries = [];
                    if (!empty($property->galleries)) {
                        $galleryEntries = explode(';;', $property->galleries);
                        $galleries = []; // Initialize the galleries array

                        foreach ($galleryEntries as $entry) {
                            $parts = explode('||', $entry);

                            // Process the images
                            $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                            $imagesWithUrl = array_map(function ($image) {
                                return url('property_images/' . $image); // Append the base URL
                            }, $images);

                            $galleries[] = [
                                'gallery_name' => $parts[0] ?? null,
                                'gallery_caption' => $parts[1] ?? null,
                                'images' => $imagesWithUrl,
                            ];
                        }
                    }

                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'property_post_for' => $property->post_for,
                        'slug' => $property->slug,
                        'enquiry_count' => $property->enquiry_count,
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'created_at' => $property->created_at,
                        'address' => $property->property_address,
                        'galleries' => $galleries,
                    ];
                });


                $enquiredProperties = $formattedProperties
                    ->sortByDesc('created_at')
                    ->skip($recentOffset)
                    ->take($limit)
                    ->values();

                return response()->json([
                    'status' => 1,
                    'message' => 'data retrived successfully',
                    'data' => $enquiredProperties,
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No user id found.',
                    'data' => [],
                ]);
            }
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
            $get_user = User::find($request->user_id);
            $user = json_decode($get_user, true);

            if (!empty($user['image'])) {
                $user['image'] = url('profile_image/' . $user['image']);
            }

            $user_additional_data = $this->apiModel->my_profile_data($request->user_id);

            $my_profile_data = array_merge($user, (array) $user_additional_data);

            $cities = $this->apiModel->getCity($lang);

            if ($user) {
                return response()->json([
                    'success' => 1,
                    'message' => 'User retrieved successfully.',
                    'data' => [
                        'user' => $my_profile_data ?? [],
                        'cities' => $cities ?? [],
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => 0,
                    'message' => 'User not found.'
                ]);
            }
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

            return response()->json([
                'success' => 1,
                'message' => 'User profile updated.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
