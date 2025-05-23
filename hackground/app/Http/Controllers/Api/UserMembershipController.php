<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\UserMembership;
use App\Models\MembershipPlans;
use App\Http\Controllers\Controller;
use App\Models\MembershipPlanTypeNames;
use App\Services\Api\MembershipService;

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
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getUserMembership(Request $request)
    {
        try {
            $userId = auth_user_id();
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
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function getRemainingValue(Request $request)
    {
        try {
            $userId = auth_user_id();
            $can_post = get_remaining_values('remaining_listings_allowed', $userId);

            if ($can_post === null || $can_post > 0) {
                return response()->json([
                    'status' => 1,
                    'message' => 'You can post properties.',
                    'remaining_listings_allowed' => $can_post === null ? 'Unlimited' : $can_post
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'You have reached your limit of posting properties.',
                    'remaining_listings_allowed' =>  $can_post
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getMembershipDetails(Request $request)
    {
        $lang = $request->input('lang', 'en');
        $user_id =   auth_user_id();

        // Fetch user membership data
        $membershipData = UserMembership::select('plan_id', 'user_id', 'subcription_date', 'subcription_date', 'expire_date', 'relationship_manager', 'leads', 'listings_allowed', 'remaining_listings_allowed', 'leads_used', 'verified_badge', 'listing_visibility', 'social_media_promotion')->with('plan:id,plan_type_id')->where('user_id', $user_id)->first();

        $planName = MembershipPlanTypeNames::where([
            ['id', $membershipData->plan->plan_type_id],
            ['lang', $lang]
        ])->pluck('plan_name')->first();

        $membershipData->plan_name = $planName;
        $membershipData->listings_allowed =  $membershipData->listings_allowed == null ? 'Unlimited' : $membershipData->listings_allowed;
        if ($membershipData->leads === null) {
            $membershipData->makeHidden(['leads_used']);
        }
        $membershipData->leads =  $membershipData->leads == null ? 'Unlimited' : $membershipData->leads;
        if ($membershipData->remaining_listings_allowed === null) {
            $membershipData->makeHidden(['remaining_listings_allowed']);
        }

        $membershipData->makeHidden(['plan']);
        return response()->json([
            'status' => 1,
            'data' => $membershipData
        ]);
    }
}
