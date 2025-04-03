<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Log;
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
            'data' =>    $MembershipPlans,
        ]);
    }
    public function update(Request $request){
  
        $validatedData = $request->validate([
            'listing_visibility' => 'required',
            'owner_contacted' => 'required',
            'listings_allowed' => 'required',
            'status' => 'required|boolean',
            'type_name' => 'required|array',
            'type_name.*' => 'required|string|max:255',
        ]);
        $validatedData['social_media_promotion'] =$request->social_media_promotion;
        $validatedData['verified_badge'] =$request->verified_badge;
        $validatedData['relationship_manager'] =$request->relationship_manager;

        $updatedPlan = $this->membershipPlanService->updateMembershipPlansType($validatedData, $request->id);
        set_flash_message('update');
        return response()->json([
            'success' => true,
            'message' => 'Updated successfully!',
            'data' => $updatedPlan
        ]);
    }

    public function destroy(Request $request)
    {
        $id = $request->id;

        $this->membershipPlanService->destroyMembershipPlansType($id);
        set_flash_message('delete');
        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully',
        ]);
    }

    public function status(Request $request)
    {
        $data = [
            'id' => $request->id,
            'status' => $request->status
        ];

        $this->membershipPlanService->statusMembershipPlansType($data);
        return response()->json([
            'success' => true,
            'message' => 'Status Updated',
        ]);
    }
}
