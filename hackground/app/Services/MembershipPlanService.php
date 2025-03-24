<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\MembershipPlans;
use Illuminate\Support\Facades\DB;
use App\Models\MembershipPlansNames;

class MembershipPlanService
{
    /**
     * Fetch all membership plans with names in English.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMembershipPlans()
    {
        return MembershipPlans::select('id', 'price', 'validity_days', 'status')->where('status', '!=', config('constants.STATUS_DELETE'))->paginate(10);
    }

    public function saveMembershipPlans($data)
    {
        return DB::transaction(function () use ($data) {
            $englishName = $data['plan_name']['en'] ?? 'default-slug';
            $slug = Str::slug($englishName);
            $membershipPlan = MembershipPlans::create([
                'price' => $data['price'],
                'slug' =>  $slug,
                'discounted_price' => $data['discounted_price'],
                'validity_days' => $data['validity_days'],
                'status' => $data['status'],
            ]);


            foreach ($data['plan_name'] as $lang => $name) {
                MembershipPlansNames::create([
                    'plan_id' => $membershipPlan->id,
                    'lang' => $lang,
                    'name' => $name,
                ]);
            }

            return $membershipPlan;
        });
    }

    public function editMembershipPlans($id)
    {
        return MembershipPlans::select('id', 'price', 'validity_days', 'discounted_price', 'status', 'slug')
            ->with(['names:id,plan_id,name,lang'])
            ->where('id', $id)
            ->first();;
    }
    
    public function updateMembershipPlans($data, $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $plan = MembershipPlans::findOrFail($id);

            $plan->update([
                'price' => $data['price'],
                'validity_days' => $data['validity_days'],
                'discounted_price' => $data['discounted_price'],
                'status' => $data['status'],
            ]);

            foreach ($data['plan_name'] as $lang => $name) {
                $plan->names()->updateOrCreate(
                    ['plan_id' => $id, 'lang' => $lang],
                    ['name' => $name]
                );
            }

            return $plan;
        });
    }

    public function destroyMembershipPlans($id)
    {
        return DB::transaction(function () use ($id) {
            $plan = MembershipPlans::findOrFail($id);
            $plan->status = config('constants.STATUS_DELETE');
            $plan->save();
            return $plan;
        });
    }

    public function statusMembershipPlans($data)
    {
        return DB::transaction(function () use ($data) {
            $plan = MembershipPlans::findOrFail($data['id']);
            $plan->update(['status' => $data['status']]); 
            return $plan;
        });
    }
}
