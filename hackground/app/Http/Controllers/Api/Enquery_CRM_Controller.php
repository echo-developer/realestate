<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Api\ApiModel;
use App\Models\PrefProject;
use App\Models\ProjectEnquery;
use App\Models\ProjectProperties;
use App\Models\ProjectPropertyMapping;
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

            $ProjectId_ofProperty = ProjectPropertyMapping::where('property_id', $request->propertyId)
                ->value('project_id');

            $dataToInsertEnqueryTable = [
                'cid' => $customer_id ?? null,
                'property_id' => $request->propertyId ?? null,
                'project_id' => !empty($ProjectId_ofProperty)  ? $ProjectId_ofProperty : null,
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

    public function ProjectEnquiry(Request $request)
    {
        // Log::info($request);
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

            $getUserId_oftheProjectId = PrefProject::where('id', $request->projectID)
                ->value('uid');

            $dataToInsertEnqueryTable = [
                'cid' => $customer_id ?? null,
                'project_id' => $request->projectID ?? null,
                'message' => $request->message ?? null,
                'assign_to' => $getUserId_oftheProjectId ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if ($customer_id != null || $customer_id != '') {

                $saveEnquery = ProjectEnquery::create($dataToInsertEnqueryTable);
            }

            return response()->json([
                'status' => 1,
                'message' => 'Project enquiry saved successfully.',
            ]);
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
            $filters = $request->only(['search_term', 'property_id', 'start_date', 'end_date', 'locality']);
            $recentPage = $request->input('current_page', 1);
            $limit = $request->input('limit', 10);
            $recentOffset = ($recentPage - 1) * $limit;
            $sort_by = $request->input('sort_type');

            $user_id = $request->input('user_id');

            if (!empty($user_id)) {

                $propertyList = $this->apiModel->GetEnquiredPropertyList($user_id)->get();
                $totalEnquery = count($propertyList);
                if ($propertyList->isEmpty()) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No result found.',
                        'data' => [],
                    ]);
                }

                $formattedProperties = $propertyList->map(function ($property) use ($user_id) {
                    // Log::info("message" . json_encode($property, JSON_PRETTY_PRINT));
                    if (!empty($property->project_id)) {
                        $projectDtls = PrefProject::where('id', $property->project_id)->select('id', 'project_name', 'slug')->first();
                        $property->projectName =  $projectDtls->project_name;
                        $property->projectSlug =  $projectDtls->slug;
                    }

                    $getGalleries = GetProperties_GalleryImages($property->property_id);


                    $filterGallery = $getGalleries->filter(fn($item) => $item->image_type == 'exterior')
                        ->map(function ($item) {
                            $item->filename = asset('user_upload/property_images/' . $item->filename);
                            return $item;
                        });


                    $property->galleries = $filterGallery->isNotEmpty() ? $filterGallery->values() : [];

                    return $property;
                });

                $dateFrom = match ($sort_by ?? 'all') {
                    'weekly'  => Carbon::now()->subWeek(),
                    'monthly' => Carbon::now()->subMonth(),
                    'yearly'  => Carbon::now()->subYear(),
                    'all'     => null,
                    default   => null,
                };

                $formattedProperties = $formattedProperties->filter(function ($property) use ($filters, $dateFrom) {
                    if (!empty($filters['search_term'])) {
                        $searchTerm = strtolower($filters['search_term']);
                        if (
                            stripos(strtolower($property->Name ?? ''), $searchTerm) === false &&
                            stripos(strtolower($property->Email ?? ''), $searchTerm) === false
                        ) {
                            return false;
                        }
                    }

                    if (!empty($filters['property_id']) && $property->property_id != $filters['property_id']) {
                        return false;
                    }

                    if ($dateFrom && Carbon::parse($property->created_at)->lessThan($dateFrom)) {
                        return false;
                    }

                    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                        $createdAt = strtotime($property->created_at);
                        $startDate = strtotime($filters['start_date']);
                        $endDate = strtotime($filters['end_date']);
                        if ($createdAt < $startDate || $createdAt > $endDate) {
                            return false;
                        }
                    }

                    if (!empty($filters['locality']) && stripos($property->locality ?? '', $filters['locality']) === false) {
                        return false;
                    }


                    return true;
                });


                $enquiredProperties = $formattedProperties
                    ->sortByDesc('created_at')
                    ->skip($recentOffset)
                    ->take($limit)
                    ->values();

                $property_list = user_property_name_slug($user_id) ?? [];

                return response()->json([
                    'status' => 1,
                    'message' => 'Data retrived successfully',
                    'data' => [
                        'enquiredProperties' => $enquiredProperties,
                        'pagination' => [
                            'current_page' => $recentPage,
                            'per_page' => $limit,
                            'total_pages' => ceil($totalEnquery / $limit),
                        ]
                    ],
                    'options' => ['property_list' => $property_list],
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

    public function ProjectEnqueryList(Request $request)
    {
        try {

            $recentPage = $request->input('current_page', 1);
            $limit = $request->input('limit', 10);
            $recentOffset = ($recentPage - 1) * $limit;

            $user_id = $request->input('user_id');
            $filters = $request->only(['search_term', 'project_id', 'start_date', 'end_date', 'locality', 'sort_type']);

            $dateFrom = match ($filters['sort_type'] ?? 'all') {
                'weekly'  => Carbon::now()->subWeek(),
                'monthly' => Carbon::now()->subMonth(),
                'yearly'  => Carbon::now()->subYear(),
                'all'     => null,
                default   => null,
            };

            if (!empty($user_id)) {


                $projects = ProjectEnquery::where('status', '!=', config('constants.STATUS_INACTIVE'))
                    ->with([
                        'project:id,project_name,slug,status',
                        'project.settings:project_id,total_towers,total_area,occupied_area,total_units',
                        'project.location:project_id,locality,city,address',
                        'project.gallery:id,project_id,image_type',
                        'project.gallery.images:id,gallary_id,filename,caption',
                        'customer:cid,Phone,Name,Email'
                    ])
                    ->wherehas('project', function ($query) {
                        $query->where(
                            'is_deleted',
                            '!= ',
                            config('constants.STATUS_INACTIVE')
                        );
                    })
                    ->get();

                $totalEnqueries = count($projects);

                // Log::info('$projects' . json_encode($projects, JSON_PRETTY_PRINT));
                if ($projects->isEmpty()) {
                    return response()->json([
                        'status' => 0,
                        'message' => 'No result found.',
                        'data' => [],
                    ]);
                }

                $customArray = $projects->map(function ($project) {
                    $projectDetails = [
                        "id" => $project->project->id ?? null,
                        "project_name" => $project->project->project_name ?? null,
                        "slug" => $project->project->slug ?? null,
                        "status" => $project->project->status ?? null,
                        "total_towers" => $project->project->settings->total_towers ?? null,
                        "total_area" => $project->project->settings->total_area ?? null,
                        "occupied_area" => $project->project->settings->occupied_area ?? null,
                        "total_units" => $project->project->settings->total_units ?? null,
                        "locality" => $project->project->location->locality ?? null,
                        "city" => $project->project->location->city ?? null,
                        "address" => $project->project->location->address ?? null,
                        'gallery' => $project->project->gallery->map(function ($gallery) {
                            return [
                                'id' => $gallery->id,
                                'image_type' => $gallery->image_type,
                                'images' => $gallery->images->map(function ($image) {
                                    return [
                                        'image_id' => $image->id,
                                        'caption' => $image->caption,
                                        'filename' => asset('user_upload/project_images/' . $image->filename),
                                    ];
                                }),
                            ];
                        })
                    ];
                    return [
                        "enquery_id" => $project->enquery_id,
                        "cid" => $project->cid,
                        "project_id" => $project->project_id,
                        "message" => $project->message,
                        "assign_to" => $project->assign_to,
                        "status" => $project->status,
                        "created_at" => $project->created_at,
                        "updated_at" => $project->updated_at,
                        "customer_phone" => $project->customer->Phone,
                        "customer_name" => $project->customer->Name,
                        "customer_email" => $project->customer->Email,
                        "project_details" => $projectDetails,
                    ];
                });

                $customArray = $customArray->filter(function ($project) use ($filters, $dateFrom) {

                    if (!empty($filters['search_term'])) {
                        $searchTerm = strtolower($filters['search_term']);
                        if (
                            stripos(strtolower($project['customer_name'] ?? ''), $searchTerm) === false &&
                            stripos(strtolower($project['customer_email'] ?? ''), $searchTerm) === false &&
                            stripos(strtolower($project['project_details']['project_name'] ?? ''), $searchTerm) === false
                        ) {
                            return false;
                        }
                    }

                    if (!empty($filters['project_id']) && $project['project_id'] != $filters['project_id']) {
                        return false;
                    }

                    if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                        $createdAt = strtotime($project['created_at']);
                        $startDate = strtotime($filters['start_date']);
                        $endDate = strtotime($filters['end_date']);
                        if ($createdAt < $startDate || $createdAt > $endDate) {
                            return false;
                        }
                    }

                    if ($dateFrom && Carbon::parse($project['created_at'])->lessThan($dateFrom)) {
                        return false;
                    }

                    if (!empty($filters['locality'])) {
                        if (stripos($project['project_details']['locality'] ?? '', $filters['locality']) === false) {
                            return false;
                        }
                    }

                    return true;
                });

                $enquiredProjects = $customArray
                    ->sortByDesc('created_at')
                    ->skip($recentOffset)
                    ->take($limit)
                    ->values();

                $project_list = user_project_name_slug($user_id) ?? [];

                return response()->json([
                    'status' => 1,
                    'message' => 'data retrived successfully',
                    'data' => [
                        'enquiredProjects' => $enquiredProjects,
                        'pagination' => [
                            'current_page' => $recentPage,
                            'per_page' => $limit,
                            'total_pages' => ceil($totalEnqueries / $limit),
                        ]
                    ],
                    'options' => [
                        'project_list' => $project_list
                    ]
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
            $user_id = $request->input('user_id');

            if (!empty($user_id)) {

                $crmData = $this->apiModel->GetCRMList($user_id);


                $totalRecords = count($crmData);


                $crmData = collect($crmData)->slice(($recentPage - 1) * $limit, $limit)->values();


                $customArray = [];
                foreach ($crmData as $row) {
                    $row = (object) $row;
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
                        'log_data' => $logData ?? [],
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

                if (empty($customArray)) {
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
                        'status' => 1,
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

                $requiredData = $data->groupBy(fn($item) => Carbon::parse($item->schedule_date)->format('Y-m-d'))
                    ->map(fn($items, $date) => [
                        'date' => $date,
                        'list' => $items->map(fn($item) => [
                            'enquery_status' => $item->enquery_status ?? null,
                            'schedule_time' => Carbon::parse($item->schedule_date)->format('H:i:s'),
                            'remarks' => $item->remarks ?? null,
                        ])->values()
                    ])->values();

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
