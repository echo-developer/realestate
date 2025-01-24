<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
                $data->image = asset('profile_image/' . $data->image);
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
                    'post_for' => $property->post_for,
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

    public function AgentList()
    {

        try {
            $data =  DB::table('users')
                ->select(
                    'id as user_id',
                    'name',
                    'user_type',
                    'email',
                    'image',
                    'phone',
                    'phone_code',
                    'whatsapp_no',
                )
                ->where(['user_type' => 'A'])->get()->toArray();

            $data = array_map(function ($items) {
                $items->image = asset('profile_image/' . $items->image);
                return $items;
            }, $data);
            Log::info("Formatted Data:\n" . json_encode($data, JSON_PRETTY_PRINT));
            return response()->json([
                'status' => 1,
                'message' => 'Properties fetched successfully',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
