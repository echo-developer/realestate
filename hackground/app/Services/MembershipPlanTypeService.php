<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\MembershipPlans;
use Illuminate\Support\Facades\DB;
use App\Models\MembershipPlanType;

class MembershipPlanTypeService
{
    /**
     * Fetch all membership plans with names in English.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMembershipPlansType(){
    $lang = 'en'; // Assuming this comes from request or settings

    return MembershipPlanType::where('status', '!=', config('constants.STATUS_DELETE'))
        ->select(['id', 'relationship_manager', 'owner_contacted', 
                  'listings_allowed', 'verified_badge', 
                  'listing_visibility', 'social_media_promotion', 'status'])
        ->with(['names' => function ($query) use ($lang) {
            $query->select(['id', 'plan_name'])->where('lang', $lang);
        }])
        ->paginate(10);
}


    public function editMembershipPlansType($id)
    {
        return MembershipPlanType::select('id', 'relationship_manager', 'owner_contacted','listings_allowed','verified_badge','listing_visibility', 'social_media_promotion','status')
            ->with(['names:id,plan_name,lang'])
            ->where('id', $id)
            ->first();
    }

    public function updateMembershipPlansType($data, $id)
    {

        return DB::transaction(function () use ($data, $id) {
            $plan = MembershipPlanType::findOrFail($id);

            $plan->update([
                'relationship_manager' => $data['relationship_manager'],
                'owner_contacted' => $data['owner_contacted'],
                'listings_allowed' => $data['listings_allowed'],
                'verified_badge' => $data['verified_badge'],
                'listing_visibility' => $data['listing_visibility'],
                'social_media_promotion' => $data['social_media_promotion'],
                'status' => $data['status'],
            ]);

            foreach ($data['type_name'] as $lang => $type_name) {
                $plan->names()->updateOrCreate(
                    ['id' => $id, 'lang' => $lang],
                    ['plan_name' => $type_name]
                );
            }

            return $plan;
        });
    }

    public function destroyMembershipPlansType($id)
    {
        return DB::transaction(function () use ($id) {
            $plan = MembershipPlanType::findOrFail($id);
            $plan->status = config('constants.STATUS_DELETE');
            $plan->save();
            return $plan;
        });
    }

    public function statusMembershipPlansType($data)
    {
        return DB::transaction(function () use ($data) {
            $plan = MembershipPlanType::findOrFail($data['id']);
            $plan->update(['status' => $data['status']]);
            return $plan;
        });
    }
}
