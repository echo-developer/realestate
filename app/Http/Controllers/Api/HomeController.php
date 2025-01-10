<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
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
            Log::info("Request in controller:\n" . json_encode($data, JSON_PRETTY_PRINT));

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

        $limit = $request->input('limit', 5); // Default limit

        // Calculate the offset for each category (pagination)
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
                    $galleryEntries = explode(';;', $property->galleries);
                    $galleries = []; // Initialize the galleries array

                    foreach ($galleryEntries as $entry) {
                        $parts = explode('||', $entry);

                        // Process the images
                        $images = isset($parts[2]) ? explode(',', $parts[2]) : [];
                        $imagesWithUrl = array_map(function ($image) {
                            return asset('property_images/' . $image); // Append the base URL
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

            if ($properties->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'No properties found',
                    'data' => [],
                ]);
            }

            // Return the paginated properties for each category
            return response()->json([
                'status' => 'success',
                'message' => 'Properties fetched successfully',
                'data' => [
                    'recent_properties' => $recentProperties,
                    'featured_properties' => $featuredProperties,
                    'popular_properties' => $popularProperties,
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

    public function PropertyEnquiry(Request $request)
    {
        try {
            // $unique_phone = $request->validate(
            //     [
            //         'phone' => 'unique:pref_customer,Phone'
            //     ],
            //     [
            //         'phone.unique' => 'Phone no must be unique'
            //     ]
            // );

            $dataToInsert = [
                'Phone' => $request->phone,
                'Name' => $request->name,
                'Email' => $request->email,
                'created_at' => now(),
                'updated_at' => now(),
            ];


            $existCustomer = DB::table('pref_customer')
                ->where('Phone', $dataToInsert['Phone'])
                ->first();

            $customer_id = $existCustomer
                ? $existCustomer->cid
                : DB::table('pref_customer')->insertGetId($dataToInsert);

            $getUserId_ofthePropertyId = DB::table('pref_properties')
                ->where('id', $request->propertyId)
                ->value('uid');

            $dataToInsertEnqueryTable = [
                'cid' => $customer_id ?? null,
                'property_id' => $request->propertyId ?? null,
                'message' => $request->message ?? null,
                'assign_to' => $getUserId_ofthePropertyId ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if ($customer_id != null || $customer_id != '') {

                $saveEnquery = DB::table('pref_property_enquiry')
                    ->insert($dataToInsertEnqueryTable);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Property enquiry saved successfully.',
            ]);

            // Log::info($customer_id);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
