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
        return MembershipPlanType::select('id', 'no_of_owners_contactable', 'unlock_owner_properties','validity_days','prime_tag', 'status')->where('status', '!=', config('constants.STATUS_DELETE'))->paginate(10);
    }

    public function editMembershipPlansType($id)
    {
        return MembershipPlanType::select('id', 'no_of_owners_contactable', 'unlock_owner_properties','validity_days','prime_tag', 'status')
            ->with(['names:id,name,lang'])
            ->where('id', $id)
            ->first();
    }
}
