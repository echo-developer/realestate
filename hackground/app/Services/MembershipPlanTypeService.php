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
    public function getAllMembershipPlansType()
    {
        return MembershipPlanType::select('id', 'no_of_owners_contactable', 'unlock_owner_properties', 'assistance_relationship_manager','early_access_days','validity_days', 'prime_tag','home_guarantee_refund','status')->where('status', '!=', config('constants.STATUS_DELETE'))->paginate(10);
    }

    public function editMembershipPlansType($id)
    {
        return MembershipPlanType::select('id', 'no_of_owners_contactable', 'unlock_owner_properties','assistance_relationship_manager','early_access_days','validity_days', 'prime_tag','home_guarantee_refund','status')
            ->with(['names:id,plan_name,lang'])
            ->where('id', $id)
            ->first();
    }

    public function updateMembershipPlansType($data, $id)
    {

        return DB::transaction(function () use ($data, $id) {
            $plan = MembershipPlanType::findOrFail($id);

            $plan->update([
                'no_of_owners_contactable' => $data['no_of_owners_contactable'],
                'unlock_owner_properties' => $data['unlock_owner_properties'],
                'assistance_relationship_manager' => $data['assistance_relationship_manager'],
                'early_access_days' => $data['early_access_days'],
                'validity_days' => $data['validity_days'],
                'prime_tag' => $data['prime_tag'],
                'home_guarantee_refund' => $data['home_guarantee_refund'],
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
