<?php
namespace App\Services;

use App\Models\MembershipPlans;

class MembershipPlanService
{
    /**
     * Fetch all membership plans with names in English.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMembershipPlans()
    {
        return MembershipPlans::select('id', 'price', 'validity_days','status')->get();
    }
}
