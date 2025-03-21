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
                $ProeprtyInfo = $this->ProeprtyInfo($request);

                $data['properties'] = $ProeprtyInfo ?? [];

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
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }


    public function BasicInfo($rq = null, $lang)
    {
        try {

            $data =  User::where(['user_type' => 'A', 'id' => $rq->agent_id])
                ->with(['userAdditional', 'agentAdditional', 'serviceArea', 'social'])
                ->first();

            // Log::info("Formatted dataArray:\n" . json_encode($data, JSON_PRETTY_PRINT));

            if (empty($data)) {
                return  [];
            }
            $data->image = $data->image ? asset('user_upload/profile_image/' . $data->image) : '';
            $data->forSell = UsersPropertyCount($data->id)['forSell'];
            $data->forRent = UsersPropertyCount($data->id)['forRent'];
            $data->agentAdditional->agent_doc = !empty($data->agentAdditional->agent_doc) ? asset('user_upload/agent_docs/' . $data->agentAdditional->agent_doc) : null;

            $data->userAdditional->city = !empty($data->userAdditional->city) ? get_name_by_id('city_names', 'city_id', $data->userAdditional->city, $lang)  : null;

            $data->service_area = !empty($data->serviceArea) ? collect($data->serviceArea)->map(function ($area) use ($lang) {
                $area->city = !empty($area->city) ? get_name_by_id('city_names', 'city_id', $area->city, $lang) : null;
            }) : [];
            $dataArray = $data->toArray();

            $mergedData = array_merge($dataArray, $dataArray['user_additional'] ?? [], $dataArray['agent_additional'] ?? []);

            unset($mergedData['user_additional'], $mergedData['agent_additional']);

            return  $mergedData;
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
                    'price_currency' => $property->price_currency,
                    'created_at' => $property->created_at,
                    'property_address' => $property->property_address,
                    'galleries' => $transformedData,
                ];
            });

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
            $locality = $request->input('locality');
            $lang = $request->input('lang', 'en');
            $city_id = $request->input('city_id');
            $name = $request->input('name');
            $perPage = $request->input('per_page', 10);
            $currentPage = $request->input('page', 1);
            $is_verified_agent = $request->input('is_verified_agent');

            $agentIdsQuery = User::with(['serviceArea:agent_id,loc_key,city,locality', 'agentAdditional:agent_id,company_name'])->where('user_type', 'A')->where('id', '!=', $this->user_id);


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
            $isVerified = filter_var($is_verified_agent, FILTER_VALIDATE_BOOLEAN);
            if ($request->has("is_verified_agent") && $isVerified == true) {
                $agentIdsQuery->where("is_verified_agent", $isVerified ? 1 : 0);
            }

            $agents = $agentIdsQuery->paginate($perPage, ['*'], 'page', $currentPage);

            $formattedAgents = collect($agents->items())->map(function ($item) use ($lang) {
                $item->user_id = $item->id;
                if (!empty($item->image)) {
                    $item->image = asset('user_upload/profile_image/' . $item->image);
                }
                $item->forSell = UsersPropertyCount($item->id)['forSell'];
                $item->forRent = UsersPropertyCount($item->id)['forRent'];
                $item->is_verified_agent = (bool) $item->is_verified_agent;
                $item->company_name = !empty($item->agentAdditional) ? $item->agentAdditional->company_name : null;

                //$item->serviceArea ====> is $item->service_area in responce, [dont change!!]
                $item->service_area = !empty($item->serviceArea) ? collect($item->serviceArea)->map(function ($area) use ($lang) {
                    $area->city = !empty($area->city) ? get_name_by_id('city_names', 'city_id', $area->city, $lang) : null;
                    return $area;
                })->all() : [];

                unset($item->id, $item->agentAdditional);
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
