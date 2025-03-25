<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\MembershipPlanTypeService;

class MembershipFeaturesController extends Controller
{
    protected $membershipPlanService;
    public function __construct(MembershipPlanTypeService $membershipPlanService)
    {

        $this->middleware('view_permit:membership-plan-type');
        $this->membershipPlanService = $membershipPlanService;
    }
    public function  index() {

        $MembershipPlanTypes = $this->membershipPlanService->getAllMembershipPlansType();

        return view('Admin.Membership.membership_plan_type', compact('MembershipPlanTypes'));
    }
    public function edit(Request $request)
    {
        $id = $request->route('id');
        $MembershipPlans = $this->membershipPlanService->editMembershipPlansType($id);
        return response()->json([
            'success' => true,
            'data' =>   $id,
        ]);
    }
}
