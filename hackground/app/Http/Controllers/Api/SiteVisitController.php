<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadAssigned;
use App\Models\PrefProperty;
use App\Models\SiteVisit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SiteVisitController extends Controller
{
    public function saveSiteVisit(Request $request)
    {
        try {
            DB::beginTransaction();
            log_anything($request->all());
            if (empty($request->phone)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Phone no required',
                ]);
            }

            $existingCustomer = DB::table('customer')->where('Phone', $request->phone)->first();

            if ($existingCustomer) {
                $customerId = $existingCustomer->cid;
            } else {
                $customerId = DB::table('customer')->insertGetId([
                    'Name' => $request->name,
                    'Email' => $request->email,
                    'Phone' => $request->phone,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $property_posted_by = PrefProperty::where('id', $request->property_id)->value('uid');

            $siteVisitData = [
                'property_id' => $request->property_id,
                'property_posted_by' => $property_posted_by,
                'customer_id' => $customerId,
                'visit_date' => $request->date,
                'visit_time' => $request->time,
            ];


            log_anything($siteVisitData, 'siteVisitData');


            $siteVisitEnquery = SiteVisit::create($siteVisitData);
            $siteVisitLeadData = [
                'lead_type' => 'SV',
                'user_id' => $property_posted_by,
                'enquery_id' =>  $siteVisitEnquery->id,
            ];


            log_anything($siteVisitLeadData, 'siteVisitLeadData');


            LeadAssigned::create($siteVisitLeadData);
            DB::commit();
            // return;
            return response()->json([
                'status' => 1,
                'message' => 'visit request sent',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }


    public function getSiteVisitreq(Request $request)
    {

        $userId = $request->user_id ?? auth_user_id();

        $getVisitList  = LeadAssigned::select('assign_id', 'lead_type', 'enquery_id', 'lead_status', 'is_seen')
            ->with(['siteVisit'])
            ->where('user_id', $userId)
            ->where('lead_type', 'SV')
            ->get()->map(function ($items) {
                $items->is_blur = $items->is_seen == 0 ? 1 : 0;
                if ($items->is_blur == 1) {
                    $items->siteVisit->property_posted_by = blur_text($items->siteVisit->property_posted_by, 1);
                    $items->siteVisit->visit_date = blur_text($items->siteVisit->visit_date, 1);
                    $items->siteVisit->visit_time = blur_text($items->siteVisit->visit_time, 1);
                }
                $items->siteVisit->customer_details = $items->siteVisit->getCustomerDetails($items->is_blur);
                return $items;
            });


        return response()->json([
            'status' => 1,
            'message' => 'Visit request retrived',
            'data' => $getVisitList,
        ]);
    }
}
