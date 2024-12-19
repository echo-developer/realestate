<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

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
            $data = $this->apiModel->getUser($id);

            if ($data->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No result found.',
                    'data' => [],
                ]);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Data retrieved successfully.',
                'data' => $data,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error in retrieved Data: ' . $e->getMessage());

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
                        'status' => true,
                        'message' => 'Profile image updated successfully.',
                        'data' => [
                            'file_name' => $fileName,
                            'image_url' => asset('profile_image/' . $fileName),
                        ],
                    ], 200);
                } else {
                    return response()->json([
                        'status' => false,
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
                'status' => false,
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
                        foreach ($galleryEntries as $entry) {
                            $parts = explode('||', $entry);
                            $galleries[] = [
                                'gallery_name' => $parts[0] ?? null,
                                'gallery_caption' => $parts[1] ?? null,
                                'images' => isset($parts[2]) ? explode(',', $parts[2]) : [],
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

                    $page = $request->input($value . '_page', 1);
                    $perPage = 1;
                    $paginatedProperties = $Properties->slice(($page - 1) * $perPage, $perPage);

                    $data[$value . '_properties'] = [
                        'current_page' => $page,
                        'total' => $Properties->count(),
                        'per_page' => $perPage,
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


    public function Propertyfavorite(Request $request){
        $data = [
            'userID' => $request->userID,
            'is_fav' => $request->status,
            'propID' => $request->propID,
        ];

        $data = $this->apiModel->PropertyfavoriteStaus($data);
    }
}
