<?php

namespace App\Services\Api;

use App\Models\MembershipPlans;

class MembershipService
{
    public function getMembershipPlans($lang = 'en')
    {
        return MembershipPlans::select('id', 'price', 'discounted_price', 'validity_days', 'discount', 'plan_type_id')
            ->where([
                ['status', config('constants.STATUS_ACTIVE')],
                ['plan_type_id', '!=', 1],
            ])
            ->with([
                'plan_type_names' => function ($query) use ($lang) {
                    $query->select('id', 'plan_name')->where('lang', $lang);
                },
                'plan_features' => function ($query) {
                    $query->select(
                        'id',
                        'relationship_manager',
                        'leads',
                        'listings_allowed',
                        'verified_badge',
                        'listing_visibility',
                        'social_media_promotion'
                    )->where('id', '!=', 1);
                }
            ])
            ->get()
            ->map(function ($membership) {
                return [
                    'id' => $membership->id,
                    'price' => $membership->price,
                    'discounted_price' => $membership->discounted_price,
                    'validity_days' => $membership->validity_days,
                    'discount' => $membership->discount,
                    'plan_name' => $membership->plan_type_names->plan_name ?? null,
                    'features' => $membership->plan_features,
                ];
            });
    }

    
}
