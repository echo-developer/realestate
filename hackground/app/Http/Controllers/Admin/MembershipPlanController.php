<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Services\MembershipPlanService;
use App\Http\Controllers\Controller;

class MembershipPlanController extends Controller
{
    protected $membershipPlanService;
    public function __construct(MembershipPlanService $membershipPlanService)
    {

        $this->middleware('view_permit:membership-plan');
        $this->membershipPlanService = $membershipPlanService;
    }

    public function index()
    {
        $MembershipPlans = $this->membershipPlanService->getAllMembershipPlans();

        return view('Admin.Membership.membership_plan', compact('MembershipPlans'));
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:0',
            'validity_days' => 'required',
            'discounted_price' => 'nullable|numeric|min:0',
            'status' => 'required|boolean',
            'plan_name' => 'required|array',
            'plan_name.*' => 'required|string|max:255',
        ]);

        $membershipPlan = $this->membershipPlanService->saveMembershipPlans($validatedData);
        set_flash_message('add');
        return response()->json([
            'success' => true,
            'message' => 'Membership plan saved successfully!',
            'data' => $membershipPlan
        ]);
    }
    
    public function edit(Request $request)
    {
        $id = $request->route('id');
        $MembershipPlans = $this->membershipPlanService->editMembershipPlans($id);
        return response()->json([
            'success' => true,
            'data' =>  $MembershipPlans,
        ]);
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'price' => 'required|numeric|min:0',
            'validity_days' => 'required',
            'discounted_price' => 'nullable|numeric|min:0',
            'status' => 'required|boolean',
            'plan_name' => 'required|array',
            'plan_name.*' => 'required|string|max:255',
        ]);


        $updatedPlan = $this->membershipPlanService->updateMembershipPlans($validatedData, $request->id);
        set_flash_message('update');
        return response()->json([
            'success' => true,
            'message' => 'Plan updated successfully!',
            'data' => $updatedPlan
        ]);
    }

    public function destroy(Request $request)
    {
        $id = $request->id;

        $this->membershipPlanService->destroyMembershipPlans($id);
        set_flash_message('delete');
        return response()->json([
            'success' => true,
            'message' => 'Plan deleted successfully',
        ]);
    }

    public function status(Request $request)
    {
        $data = [
            'id' => $request->id,
            'status' => $request->status
        ];

        $this->membershipPlanService->statusMembershipPlans($data);
        return response()->json([
            'success' => true,
            'message' => 'Plan Status Updated',
        ]);
    }
}
