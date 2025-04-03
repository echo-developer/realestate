<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlans;
use App\Models\UserTransaction;
use GuzzleHttp\Promise\Create;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use PhpParser\Node\Stmt\Return_;
use Stripe\Charge;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    public function stripeCheckout(Request $request)
    {
        try {
            // Initialize Stripe Client with API key
            $stripe = new StripeClient(config('services.stripe.secret'));

            $currency_code = 'USD';
            $payamount = $request->amount;
            $plan_id = $request->plan_id;
            $user_id = $request->user_id;
            $description = "Membership";

            // Charge the user
            $charge = $stripe->charges->create([
                'source' => $request->token,
                'amount' => $payamount * 100,
                'currency' => $currency_code,
                'description' => $description,
            ]);

            if ($charge->paid) {
                $this->payment_success($charge, $plan_id, $user_id);

                return response()->json([
                    'status' => 1,
                    'message' => 'Payment successful',
                    'amount' => $payamount,
                ]);
            } else {
                return response()->json([
                    'status' => 1,
                    'message' => 'Payment Failed',
                    'amount' => $payamount,
                ]);
            }
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while removing the file',
            ]);
        }
    }

    public function payment_success($charge, $plan_id, $user_id)
    {
        try {
            $transaction = UserTransaction::create([
                'platform_txn_id' => $charge->id,
                'paid_amount' => $charge->amount / 100,
                'currency' => $charge->currency,
                'user_id' => $user_id ?? null,
                'plan_id' => $plan_id ?? null,
                'payment_status' => $charge->status,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $transactionId = $transaction->id;
            $plandetails = MembershipPlans::with(['plan_features'])->where('id', $plan_id)->get();
            log::info($plandetails);

            $planDetails = MembershipPlans::with('plan_features')->find($plan_id);

            if (!$planDetails) {
                return response()->json(['status' => 'fail', 'message' => 'Plan not found'], 404);
            }

            // Calculate subscription start and expiry dates
            $subscriptionDate = now();
            $expireDate = now()->addDays($planDetails->validity_days);

            DB::transaction(function () use ($user_id, $transactionId, $plan_id, $subscriptionDate, $expireDate, $planDetails) {
                $features = $planDetails->plan_features;

                DB::table('user_membership')->where('user_id', $user_id)->delete();

                DB::table('user_membership')->insert([
                    'user_id' => $user_id,
                    'transaction_id' => $transactionId,
                    'plan_id' => $plan_id,
                    'subcription_date' => $subscriptionDate,
                    'expire_date' => $expireDate,
                    'owners_contact_limit' => $features->no_of_owners_contactable ?? null,
                    'unlock_prime_properties' => $features->unlock_owner_properties ?? 'N',
                    'relationship_manager' => $features->assistance_relationship_manager ?? 'N',
                    'early_access' => $features->early_access_days ?? 'N',
                    'prime_tag' => $features->prime_tag ?? 'N',
                    'home_guarantee' => $features->home_guarantee_refund ?? 'N',
                    'owner_contacted' => 0,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            });
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while processing payment success.',
            ], 500);
        }
    }

    public function membership_pakage_lists(Request $request)
    {
        try {
            $lang = $request->input('lang', 'en');

            $membershipList = MembershipPlans::select('price', 'discounted_price', 'validity_days', 'discount', 'plan_type_id')
                ->where('status', config('constants.STATUS_ACTIVE'))
                ->with([
                    'plan_type_names' => function ($query) use ($lang) {
                        $query->select('id', 'plan_name')->where('lang', $lang);
                    },
                    'plan_features:id,no_of_owners_contactable,unlock_owner_properties,assistance_relationship_manager,early_access_days,validity_days,prime_tag,home_guarantee_refund',
                ])
                ->get();

            $membershipData = $membershipList->map(function ($membership) {
                return [
                    'price' => $membership->price,
                    'discounted_price' => $membership->discounted_price,
                    'validity_days' => $membership->validity_days,
                    'discount' => $membership->discount,
                    'plan_name' => $membership->plan_type_names->plan_name ?? null,
                    'features' => $membership->plan_features,
                ];
            });


            return response()->json([
                'status' => 1,
                'message' => 'Data Retrived Successfully',
                'data' => $membershipData
            ]);
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while removing the file',
            ]);
        }
    }
}
