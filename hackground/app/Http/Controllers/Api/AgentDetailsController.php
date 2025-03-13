<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AgentDetailsController extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }


    public function AgentDetailsPage(Request $request)
    {
        // Log::info("Formatted Data:\n" . json_encode($request->all(), JSON_PRETTY_PRINT));
        try {
            if (!empty($request->agent_id)) {

                $data = $this->BasicInfo($request);
                $ProeprtyInfo = $this->ProeprtyInfo($request);

                $data =  array_merge(is_array($data) ? $data : [], is_array($ProeprtyInfo) ? $ProeprtyInfo : []);

                return response()->json([
                    'status' => 1,
                    'message' => 'Properties fetched successfully',
                    'data' => $data
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'Agent Id not found',
                ]);
            }
            // Log::info("Formatted Data:\n" . json_encode($data, JSON_PRETTY_PRINT));

        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }


    public function BasicInfo($rq = null)
    {
        try {
            $data =  DB::table('users')
                ->select(
                    'name',
                    'user_type',
                    'email',
                    'image',
                    'phone',
                    'phone_code',
                    'whatsapp_no',
                )
                ->where(['user_type' => 'A', 'id' => $rq->agent_id])->first();

            // $dataArray =  (array) $data;
            // Log::info("Formatted dataArray:\n" . json_encode($data, JSON_PRETTY_PRINT));

            if ($data) {
                $data->image = asset('user_upload/profile_image/' . $data->image);
            }

            return (array) $data;
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function ProeprtyInfo($rq)
    {
        try {
            $property_details = $this->apiModel->PropertyListforAgentPage($rq->agent_id);


            $formattedPropertiesDetails = $property_details->map(function ($property) {

                $galleries = GetProperties_GalleryImages($property->property_id)->map(function ($image) {
                    return [
                        'gallery_type' => $image->image_type,
                        'image_url' => asset('user_upload/property_images/' . $image->filename),
                    ];
                });


                return [
                    'property_id' => $property->property_id,
                    'property_name' => $property->property_name,
                    'slug' => $property->slug,
                    'property_type' => $property->property_type,
                    'uid' => $property->uid,
                    'status' => $property->status,
                    'bathrooms' => $property->bathrooms,
                    'carpet_area' => $property->carpet_area,
                    'plot_area' => $property->plot_area,
                    'views' => $property->views,
                    'is_featured' => $property->is_featured,
                    'is_populer' => $property->is_populer,
                    'parking_ability' => $property->parking_ability,
                    'post_for' => $property->post_for ?? 'unknown',
                    'property_type_for' => $property->property_type_for,
                    'bedrooms' => $property->bedrooms,
                    'expected_price' => $property->expected_price,
                    'price_currency' => $property->price_currency,
                    'created_at' => $property->created_at,
                    'property_address' => $property->property_address,
                    'galleries' => $galleries->toArray(),
                ];
            })
                ->groupBy('post_for');

            return $formattedPropertiesDetails->toArray();
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['error' => 'An error occurred while processing the request.'], 500);
        }
    }

    public function AgentList(Request $request)
    {

        try {
            $user_id = auth_user_id();

            $locality = $request->input('locality');
            $city_id = $request->input('city_id');
            $user_id = $request->input('user_id');
            $name = $request->input('name');
            $perPage = $request->input('per_page', 10);
            $currentPage = $request->input('page', 1);
            $is_verified_agent = $request->input('is_verified_agent');

            // Start building the users query
            $query = DB::table('users')
                ->select(
                    'id as user_id',
                    'name',
                    'user_type',
                    'email',
                    'image',
                    'phone',
                    'phone_code',
                    'whatsapp_no',
                    'is_verified_agent'
                )
                ->where('user_type', 'A');

            $agentIdsQuery = User::with(['serviceArea'])->where('user_type', 'A')->where('id', '!=', $user_id);

            
            if (!empty($locality)) {
                $agentIdsQuery->whereHas('serviceArea', function ($agents) use ($locality) {
                    $agents->where('locality', 'like', "%{$locality}%");
                });
            }
            if (!empty($city_id)) {
                $agentIdsQuery->whereHas('serviceArea', function ($agents) use ($city_id) {
                    $agents->where('city', $city_id);
                });
            }
            if (!empty($name)) {
                $agentIdsQuery->where('name', 'like', "%{$name}%");
            }

            $agentIds = $agentIdsQuery->distinct()->pluck('id');
            Log::info($agentIds);
            if ($agentIds->isEmpty()) {
                return response()->json([
                    'status' => 1,
                    'message' => 'No Agent Found',
                    'data' => [],
                ]);
            }
            $query->whereIn('id', $agentIds);

            if ($request->has("is_verified_agent")) {
                $isVerified = filter_var($is_verified_agent, FILTER_VALIDATE_BOOLEAN);
                $query->where("is_verified_agent", $isVerified ? 1 : 0);
            }

            $agents = $query->paginate($perPage, ['*'], 'page', $currentPage);

            $formattedAgents = collect($agents->items())->map(function ($item) {
                if (!empty($item->image)) {
                    $item->image = asset('user_upload/profile_image/' . $item->image);
                }
                // $item->is_verified = true;
                $item->is_verified_agent = (bool) $item->is_verified_agent;
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
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
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
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
