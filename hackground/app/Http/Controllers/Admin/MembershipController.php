<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Services\MembershipPlanService;
use App\Http\Controllers\Controller;

class MembershipController extends Controller
{
    protected $membershipPlanService;

    // Inject Middleware and Service into Constructor
    public function __construct(MembershipPlanService $membershipPlanService)
    {
        // Apply middleware
        $this->middleware('view_permit:membership-plan');

        // Inject service
        $this->membershipPlanService = $membershipPlanService;
    }

    /**
     * Display membership plans.
     */
    public function MembershipPlan()
    {
        $MembershipPlans = $this->membershipPlanService->getAllMembershipPlans();

        return view('Admin.Membership.membership_plan', compact('MembershipPlans'));
    }
}
