<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\MembershipPlans;
use App\Services\Api\MembershipService;
use App\Http\Controllers\Controller;

class UserMembershipController extends Controller
{
    protected $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    public function membership_pakage_lists(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');
            $membershipData = $this->membershipService->getMembershipPlans($lang);

            return response()->json([
                'status' => 1,
                'message' => 'Data Retrieved Successfully',
                'data' => $membershipData
            ]);
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving data',
            ]);
        }
    }
    
    public function getUserMembership(Request $request)
    {
        try {
            $userId = 38;
            $membership = get_user_membership($userId);

            if ($membership) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Membership Retrieved Successfully',
                    'data' => $membership
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Membership Found',
                ]);
            }
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving membership',
            ]);
        }
    }


    public function getRemainingValue(Request $request)
    {
        try {
            $userId = auth_user_id()?auth_user_id(): 38;
            $can_post = get_remaining_values('remaining_listings_allowed', $userId );
            if ($can_post <= 0 || $can_post == null) {
                return response()->json([
                    'status' => 0,
                    'message' => 'You have reached your limit of posting properties.',
                ]);
            }else {
                return response()->json([
                    'status' => 1,
                    'message' => 'You can post properties.',
                    'remaining_listings_allowed' => $can_post
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while retrieving membership',
            ]);
        }
    }
    
}
