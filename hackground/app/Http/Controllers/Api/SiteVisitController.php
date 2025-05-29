<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
            // log_anything($request->all());
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

            $customer = DB::table('customer')->where('Phone', $request->phone)->first();

            $siteVisitData = [
                'property_id' => $request->property_id,
                'property_posted_by' => PrefProperty::where('id', $request->property_id)->value('uid'),
                'customer_id' => $customerId,
                'visit_date' => $request->date,
                'visit_time' => $request->time,
            ];
            // log_anything($siteVisitData);
            // return;
            SiteVisit::create($siteVisitData);

            return response()->json([
                'status' => 1,
                'message' => 'visit request sent',
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    public function getSiteVisitreq(Request $request)
    {

        $userId = $request->user_id ?? auth_user_id();

        $getVisitList  = User::select('id','name')->with(['visitRequests'])->where('id', 17)->get();
        return response()->json([
                'status' => 1,
                'message' => 'visit request sent',
                'data' => $getVisitList,
            ]);
    }
}
