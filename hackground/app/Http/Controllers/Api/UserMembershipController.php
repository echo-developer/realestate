<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\UserMembership;
use App\Models\MembershipPlans;
use App\Http\Controllers\Controller;
use App\Models\MembershipPlanTypeNames;
use App\Models\UserTransaction;
use App\Services\Api\MembershipService;
use Illuminate\Support\Facades\DB;

class UserMembershipController extends Controller
{
    protected $membershipService;

    public function __construct(MembershipService $membershipService)
    {
        $this->membershipService = $membershipService;
    }

    public function membership_pakage_lists(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');
            $membershipData = $this->membershipService->getMembershipPlans($lang);

            return response()->json([
                'status' => 1,
                'message' => 'Data Retrieved Successfully',
                'data' => $membershipData
            ]);
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getUserMembership(Request $request)
    {
        try {
            $userId = auth_user_id();
            $membership = get_user_membership($userId);

            if ($membership) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Membership Retrieved Successfully',
                    'data' => $membership
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No Membership Found',
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }


    public function getRemainingValue(Request $request)
    {
        try {
            $userId = auth_user_id();
            $can_post = get_remaining_values('remaining_listings_allowed', $userId);

            // null means Unlimited (Platinum), numeric 0 means limit exhausted
            if ($can_post === null || $can_post > 0) {
                return response()->json([
                    'status' => 1,
                    'message' => 'You can post properties.',
                    'remaining_listings_allowed' => $can_post === null ? 'Unlimited' : (int)$can_post,
                ]);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'You have reached your listing limit. Please upgrade your plan.',
                    'remaining_listings_allowed' => 0,
                ]);
            }
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public function getMembershipDetails(Request $request)
    {
        $lang = $request->input('lang', app()->getLocale());
        $user_id =   auth_user_id();

        // Fetch user membership data
        $membershipData = UserMembership::select(
                'plan_id', 'user_id', 'subcription_date', 'expire_date',
                'leads', 'listings_allowed', 'remaining_listings_allowed',
                'featured_listings_limit', 'featured_listings_used',
                'leads_used', 'verified_badge'
            )
            ->with([
                'plan:id,plan_type_id',
                'plan.plan_type_names' => function ($q) use ($lang) {
                    $q->where('lang', $lang)
                        ->select('id', 'plan_name'); // ✅ here
                }
            ])->where('user_id', $user_id)->first();
        // $planName = MembershipPlanTypeNames::where([
        //     ['id', $membershipData->plan->plan_type_id],
        //     ['lang', $lang]
        // ])->pluck('plan_name')->first();

        // $membershipData->plan_name = $planName;
        // $membershipData->listings_allowed =  $membershipData->listings_allowed == null ? 'Unlimited' : $membershipData->listings_allowed;
        // if ($membershipData->leads === null) {
        //     $membershipData->makeHidden(['leads_used']);
        // }
        // $membershipData->leads =  $membershipData->leads == null ? 'Unlimited' : $membershipData->leads;
        // if ($membershipData->remaining_listings_allowed === null) {
        //     $membershipData->makeHidden(['remaining_listings_allowed']);
        // }

        // $membershipData->makeHidden(['plan']);
        return response()->json([
            'status' => 1,
            'data' => $membershipData
        ]);
    }

    public function registerPaypalTransac(Request $request)
    {

        $user_id = auth_user_id();
        if (!$user_id) {
            return response()->json(['status' => 0, 'message' => 'No User Found'], 500);
        };

        $transac = UserTransaction::create([
            'paid_amount' => $request?->plan_price ?? null,
            'currency' => !empty($request?->plan_currency) ? strtolower($request?->plan_currency) : null,
            'user_id' => $user_id,
            'plan_id' => $request?->plan_Id ?? null,
            'payment_status' => 'pending',
        ]);

        return response()->json([
            'status' => 1,
            'message' => 'Transaction Initaited',
            'data' => $transac,
        ]);
    }

    public function payPalInstantNotify(Request $request)
    {
        // [
        //    "mc_gross"=> "269.10",
        // "protection_eligibility": "Ineligible",
        // "address_status": "confirmed",
        // "payer_id": "QRU2W8VYGVCQS",
        // "address_street": "1 Main St",
        // "payment_date": "04:32:26 Apr 01, 2026 PDT",
        // "payment_status": "Pending",
        // "charset": "UTF-8",
        // "address_zip": "95131",
        // "first_name": "asharam",
        // "mc_fee": "12.73",
        // "address_country_code": "US",
        // "address_name": "asharam pakhira",
        // "notify_version": "3.9",
        // "custom": "{\"payment_id\":15,\"plan_id\":\"2\",\"plan_name\":\"Gold\"}",
        // "payer_status": "verified",
        // "business": "sb-ic0yc48565683@business.example.com",
        // "address_country": "United States",
        // "address_city": "San Jose",
        // "quantity": "1",
        // "verify_sign": "AStwKS3.L4rNUPfkl7TOO9eahVmAAjWh9HU9R6x9SaqRae9gChoWZVEq",
        // "payer_email": "asish9735_per@gmail.com",
        // "txn_id": "4XT21047PB0855831",
        // "payment_type": "instant",
        // "last_name": "pakhira",
        // "address_state": "CA",
        // "receiver_email": "sb-ic0yc48565683@business.example.com",
        // "payment_fee": "12.73",
        // "shipping_discount": "0.00",
        // "insurance_amount": "0.00",
        // "receiver_id": "VS3V9Z6FZLL64",
        // "pending_reason": "paymentreview",
        // "txn_type": "web_accept",
        // "item_name": "Gold",
        // "discount": "0.00",
        // "mc_currency": "USD",
        // "item_number": null,
        // "residence_country": "US",
        // "test_ipn": "1",
        // "shipping_method": "Default",
        // "transaction_subject": null,
        // "payment_gross": "269.10",
        // "ipn_track_id": "f725486d7e5c7"

        //  ];

        // logg($request->all(), 'payPalInstantNotify');

        $data = $request->all();
        $custom = json_decode($data['custom'], true);

        $paymentId = $custom['payment_id'] ?? null;
        $status = !empty($data['payment_status']) ? strtolower($data['payment_status']) : 'pending';

        if (empty($data['txn_id'])) {
            return response('Missing data', 400);
        }

        DB::transaction(function () use ($data, $paymentId, $status) {
            $payment = UserTransaction::lockForUpdate()->find($paymentId);

            if (!$payment) {
                return;
            }

            // 🔐 SECURITY CHECKS
            if ((float) $payment->paid_amount !== (float) $data['payment_gross']) return;
            if ($payment->currency !== strtolower($data['mc_currency'])) return;


            // 🔁 Idempotency
            if ($payment->payment_status === 'success') {
                return;
            }

            // 🟡 PENDING
            if ($status === 'pending') {
                $payment->update([
                    'platform_txn_id'  => $data['txn_id'],
                    'payment_status'  => 'pending',
                ]);
                return;
            }


            // ❌ FAILED STATES
            if (!in_array($status, ['completed', 'pending'])) {
                $payment->update([
                    'platform_txn_id'  => $data['txn_id'],
                    'payment_status'  => 'failed',
                ]);
                return;
            }

            // ✅ COMPLETED
            $payment->update([
                'platform_txn_id'  => $data['txn_id'],
                'payment_status'  => 'success',
            ]);

            $planDetails = MembershipPlans::with('plan_features')->find($payment->plan_id);
            // logg($planDetails, 'PLAN DETAILSssssssssss');

            if (!$planDetails) {
                return response()->json(['status' => 'fail', 'message' => 'Plan not found'], 404);
            }

            $subscriptionDate = now();
            $expireDate = now()->addDays($planDetails->validity_days);

            $features = $planDetails?->plan_features;

            DB::table('user_membership')->where('user_id', $payment->user_id)->delete();

            DB::table('user_membership')->insert([
                'user_id'                    => $payment->user_id,
                'transaction_id'             => $data['txn_id'],
                'plan_id'                    => $payment->plan_id,
                'subcription_date'           => $subscriptionDate,
                'expire_date'                => $expireDate,
                'listings_allowed'           => $features?->listings_allowed ?? null,
                'featured_listings_limit'    => $features?->featured_listings ?? '0',
                'featured_listings_used'     => 0,
                'leads'                      => $features?->leads ?? null,
                'leads_used'                 => 0,
                'verified_badge'             => $features?->verified_badge ?? 'N',
                'remaining_listings_allowed' => $features?->listings_allowed ?? null,
                'created_at'                 => now(),
                'updated_at'                 => now()
            ]);
        });
    }
}
