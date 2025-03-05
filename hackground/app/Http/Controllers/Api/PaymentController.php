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
            ], 500);
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
            $plandetails = MembershipPlans::with(['features'])->where('id', $plan_id)->get();
            log::info($plandetails);

            $planDetails = MembershipPlans::with('features')->find($plan_id);

            if (!$planDetails) {
                return response()->json(['status' => 'fail', 'message' => 'Plan not found'], 404);
            }

            // Calculate subscription start and expiry dates
            $subscriptionDate = now();
            $expireDate = now()->addDays($planDetails->validity_days);

            // Map features to relevant columns
            $features = collect($planDetails->features)->keyBy('feature_id');

            $insertData = [
                'user_id' => $user_id,
                'transaction_id' => $transactionId,
                'plan_id' => $plan_id,
                'subcription_date' => $subscriptionDate,
                'expire_date' => $expireDate,
                'owners_contact_limit' => $features->get(1)['value'] ?? null,
                'unlock_prime_properties' => $features->get(2)['value'] ?? 'N',
                'relationship_manager' => $features->get(3)['value'] ?? 'N',
                'early_access' => $features->get(4)['value'] ?? 'N',
                'prime_tag' => $features->get(5)['value'] ?? 'N',
                'home_guarantee' => $features->get(6)['value'] ?? 'N',
                'owner_contacted' => 0, // Default value
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Insert into user_membership table
            DB::table('user_membership')->insert($insertData);
        } catch (\Exception $e) {
            logError($e);
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while processing payment success.',
            ], 500);
        }
    }

    // {
    //     if ($charge->paid) {
    //         $status = 'Y';
    //         $date = now();

    //         // Insert transaction into database
    //         $transaction_id = DB::table('transactions')->insertGetId([
    //             'txn_id' => $charge->id,
    //             'payment_date' => $date,
    //             'payment_gross' => $payamount,
    //             'paidby' => $user->name,
    //             'receiver_email' => $charge->receipt_email ?? '',
    //             'payment_fee' => 0,
    //             'membership_id' => $membership_id,
    //             'user_id' => $user->id,
    //             'mc_currency' => $charge->amount_captured,
    //             'payment_status' => $status,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         // Deactivate old subscriptions
    //         DB::table('user_subscriptions')
    //             ->where('user_id', $user->id)
    //             ->update(['status' => 'N']);

    //         // Insert new subscription
    //         DB::table('user_subscriptions')->insert([
    //             'membership_id' => $membership_id,
    //             'user_id' => $user->id,
    //             'transaction_id' => $charge->id,
    //             'subscribe_date' => $date,
    //             'status' => $status,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         return response()->json([
    //             'status' => 'ok',
    //             'message' => 'Payment successful',
    //             'transaction_id' => $charge->id
    //         ]);
    //     }
    // }
}
