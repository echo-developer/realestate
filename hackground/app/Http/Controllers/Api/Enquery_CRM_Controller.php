<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Enquery_CRM_Controller extends Controller
{
    protected $apiModel;

    public function __construct()
    {
        $apiModel = new ApiModel;
        $this->apiModel = $apiModel;
    }
    public function PropertyEnquiry(Request $request)
    {
        try {

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

                $formattedProperties = $propertyList->map(function ($property) use ($user_id) {
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

                    $enquiry_count = DB::table('pref_property_enquiry')
                        ->where([
                            'assign_to' => $user_id,
                            'property_id' => $property->property_id,
                            'is_deleted' => 0,
                        ])
                        ->count();

                    return [
                        'property_id' => $property->property_id,
                        'property_name' => $property->property_name,
                        'property_post_for' => $property->post_for,
                        'slug' => $property->slug,
                        'enquiry_count' => $enquiry_count,
                        'price' => $property->price_currency . " " . $property->expected_price,
                        'created_at' => $property->created_at,
                        'address' => $property->property_address,
                        'galleries' => $transformedData,
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

    public function EnqueryDelete(Request $request)
    {

        $enquery_id = $request->input('enquiry_id');
        try {
            DB::table('pref_property_enquiry')
                ->where('enquery_id', $enquery_id)
                ->update(['is_deleted' => config('constants.STATUS_ACTIVE')]);
            return response()->json([
                'status' => 1,
                'message' => 'enquiry deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function PropertyCRM(Request $request)
    {
        try {
            $recentPage = $request->input('recent_page', 1);
            $limit = $request->input('limit', 10);
            $recentOffset = ($recentPage - 1) * $limit;
            $user_id = $request->input('user_id');

            if (!empty($user_id)) {
                $crmData = $this->apiModel->GetCRMList($user_id, $recentOffset, $limit);
                $enqueryDetails = $crmData['data']->toArray();
                $totalRecords = $crmData['total_records'];

                $customArray = [];
                foreach ($enqueryDetails as $row) {
                    $galleries = [];

                    $getGalleries = GetProperties_GalleryImages($row->property_id);
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

                    $logData = DB::table('pref_crm_log')
                        ->select('schedule_date', 'remarks')
                        ->where('enquiry_id', $row->enquery_id)
                        ->orderBy('id', 'desc')
                        ->first();

                    if ($logData) {
                        $logData->enquery_status = $row->enquery_status;
                    }

                    $customArray[] = [
                        'log_data' => $logData != null ? $logData : [],
                        'customer_id' => $row->customer_id,
                        'enquery_id' => $row->enquery_id,
                        'property_id' => $row->property_id,
                        'message' => $row->message,
                        'assign_to' => $row->assign_to,
                        'enquery_status' => $row->enquery_status,
                        'created_at' => $row->created_at,
                        'Phone' => $row->Phone,
                        'customer_name' => $row->Name,
                        'Email' => $row->Email,
                        'property_name' => $row->name,
                        'property_address' => $row->property_address,
                        'locality' => $row->locality,
                        'bedrooms' => $row->bedrooms,
                        'bathrooms' => $row->bathrooms,
                        'carpet_area' => $row->carpet_area,
                        'super_area' => $row->super_area,
                        'plot_area' => $row->plot_area,
                        'size' => ($row->plot_area ?? 0) + ($row->super_area ?? 0) + ($row->carpet_area ?? 0),
                        'gallery' => $transformedData,
                    ];
                }

                if (empty($enqueryDetails)) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No result found.',
                        'data' => [],
                        'pagination' => [
                            'current_page' => $recentPage,
                            'total_records' => $totalRecords,
                            'total_pages' => ceil($totalRecords / $limit),

                        ]
                    ]);
                }

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrieved successfully',
                    'data' => $customArray,
                    'pagination' => [
                        'current_page' => $recentPage,
                        'total_records' => $totalRecords,
                        'total_pages' => ceil($totalRecords / $limit),

                    ]
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No user ID found.',
                    'data' => [],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyCRM: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'data' => [],
            ]);
        }
    }



    public function LogCRM(Request $request)
    {
        try {

            if (empty($request->enquiry_id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'NO ENQUERY ID FOUND',
                ]);
            }
            $formattedDateTime = Carbon::parse($request->date)->format('Y-m-d H:i:s');

            $enq_status = (int) $request->enq_status;
            $data = [
                'enquiry_id' => $request->enquiry_id,
                'status' => $enq_status,
                'schedule_date' => $formattedDateTime ?? null,
                'remarks' => $request->remarks ?? null,
                'created_at' => now(),

            ];

            DB::table('pref_property_enquiry')->where('enquery_id', $data['enquiry_id'])->update(['status' => $enq_status]);
            DB::table('pref_crm_log')->insert($data);
            return response()->json([
                'status' => 1,
                'message' => 'crm logged successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }

    public function EnqueryTimelineList(Request $request)
    {

        try {
            $enquery_id = $request->input('enquery_id');
            if (!empty($enquery_id)) {

                $eq_timeline = DB::table('pref_crm_log')
                    ->leftJoin('pref_property_enquiry', 'pref_crm_log.enquiry_id', '=', 'pref_property_enquiry.enquery_id')
                    ->where('pref_crm_log.enquiry_id', $enquery_id)
                    ->select(
                        'pref_crm_log.enquiry_id',
                        'pref_crm_log.status as enquery_status',
                        // 'pref_crm_log.id as action_id',
                        'pref_crm_log.created_at as action_taken_on',
                        'pref_crm_log.schedule_date',
                        'pref_crm_log.remarks',
                    )->get()->toArray();

                // $timelines = [];
                // $formatedData = array_map(function ($items) {

                // }, $eq_timeline);

                if (empty($eq_timeline)) {
                    return response()->json([
                        'status' => 1,
                        'message' => 'No result found.',
                        'data' => [],
                    ]);
                }

                return response()->json([
                    'status' => 1,
                    'message' => 'data retrived successfully',
                    'data' => $eq_timeline,
                ]);

                // Log::info('eq_timeline :\n' . json_encode($eq_timeline, JSON_PRETTY_PRINT));
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Enquery id found.',
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

    public function CRM_ScheduleDetails(Request $request)
    {

        $enquery_id = $request->input('enquery_id');

        try {
            if ($enquery_id) {

                $data = $this->apiModel->queryForScheduleDetails($enquery_id);
                if (empty($data)) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No data found.',
                        'data' => [],
                    ]);
                }

                $logData = DB::table('pref_crm_log')
                    ->select('schedule_date', 'remarks')
                    ->where('enquiry_id', $data->enquery_id)
                    ->orderBy('id', 'desc')
                    ->first();

                if ($logData) {
                    $logData->enquery_status = $data->enquery_status;
                }


                $data->property_size = ($data->carpet_area ?? 0) + ($data->super_area ?? 0) + ($data->plot_area ?? 0);
                $data->log_data = $logData;


                unset($data->carpet_area, $data->super_area, $data->plot_area);

                // Log::info("Formatted Data:\n" . json_encode($data, JSON_PRETTY_PRINT));


                return response()->json([
                    'status' => 1,
                    'message' => 'data retrived successfully.',
                    'data' => $data,
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No enquery id found.',
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


    public function CRM_Calender(Request $request)
    {
        $user_id = $request->input('user_id');

        try {
            if ($user_id) {
                $data = $this->apiModel->queryForCRMcalender($user_id);

                if ($data->isEmpty()) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No data found.',
                        'data' => [],
                    ]);
                }

                $requiredData = $data->map(function ($item) {
                    return [
                        "enquery_status" => $item->enquery_status ?? null,
                        "schedule_date" => $item->schedule_date ?? null,
                        "remarks" => $item->remarks ?? null,
                    ];
                });

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrieved successfully.',
                    'data' => $requiredData,
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No enquery id found.',
                    'data' => [],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in PropertyEnquiry: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while processing the request.',
                'data' => [],
            ]);
        }
    }
}
