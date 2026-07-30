<?php

namespace App\Services;

use Illuminate\Support\Str;
use App\Models\MembershipPlans;
use App\Models\MembershipPlanType;
use Illuminate\Support\Facades\DB;
use App\Models\MembershipPlansNames;
use App\Models\MembershipPlanTypeNames;

class MembershipPlanService
{
    /**
     * Fetch all membership plans with names in English.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllMembershipPlans()
    {
        return MembershipPlans::select('id', 'price', 'validity_days', 'plan_type_id', 'status')->with('plan_type_names:id,plan_name')->where('status', '!=', config('constants.STATUS_DELETE'))->paginate(10);
    }
    public function getPlainType()
    {
        return MembershipPlanTypeNames::where('lang', 'en')
            ->get(['id', 'plan_name']);
    }

    public function saveMembershipPlans($data)
    {
        return DB::transaction(function () use ($data) {
            $price = floatval($data['price']);
            $discountedPrice = isset($data['discounted_price']) && $data['discounted_price'] !== '' ? floatval($data['discounted_price']) : null;
            $discount = ($price > 0 && $discountedPrice !== null) ? (($price - $discountedPrice) / $price) * 100 : 0;

            $membershipPlan = MembershipPlans::create([
                'price' => $price,
                'plan_type_id' => $data['plan_type'],
                'discounted_price' => $discountedPrice,
                'validity_days' => $data['validity_days'],
                'discount' => $discount,
                'status' => $data['status'],
            ]);


            foreach ($data['about_plan'] as $lang => $about_plan) {
                MembershipPlansNames::create([
                    'plan_id' => $membershipPlan->id,
                    'lang' => $lang,
                    'about_plan' => $about_plan,
                ]);
            }

            return $membershipPlan;
        });
    }

    public function editMembershipPlans($id)
    {
        return MembershipPlans::select('id', 'price', 'validity_days', 'discounted_price', 'status', 'plan_type_id')
            ->with(['names:id,plan_id,about_plan,lang'])
            ->where('id', $id)
            ->first();
    }

    public function updateMembershipPlans($data, $id)
    {
        return DB::transaction(function () use ($data, $id) {
            $plan = MembershipPlans::findOrFail($id);

            $price = floatval($data['price']);
            $discountedPrice = isset($data['discounted_price']) && $data['discounted_price'] !== '' ? floatval($data['discounted_price']) : null;
            $discount = ($price > 0 && $discountedPrice !== null) ? (($price - $discountedPrice) / $price) * 100 : 0;

            $plan->update([
                'price' => $price,
                'plan_type_id' => $data['plan_type'],
                'validity_days' => $data['validity_days'],
                'discounted_price' => $discountedPrice,
                'discount' => $discount,
                'status' => $data['status'],
            ]);

            foreach ($data['about_plan'] as $lang => $about_plan) {
                MembershipPlansNames::updateOrCreate(
                    ['plan_id' => $id, 'lang' => $lang],
                    ['about_plan' => $about_plan]
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
