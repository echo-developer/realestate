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
        } catch (\Throwable $e) {
            throw $e;
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
            $planDetails = MembershipPlans::with('plan_features')->find($plan_id);
            log::info($planDetails);

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
                    'owner_contacted' => $features->owner_contacted ?? null,
                    'listings_allowed' => $features->listings_allowed ?? null,
                    'relationship_manager' => $features->relationship_manager ?? 'N',
                    'verified_badge' => $features->verified_badge ?? 'N',
                    'listing_visibility' => $features->listing_visibility ?? 'null',
                    'social_media_promotion' => $features->social_media_promotion ?? 'N',
                    'remaining_owner_contacted' => $features->owner_contacted?? 'null',
                    'remaining_listings_allowed' => $features->listings_allowed ?? null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            });
        } catch (\Throwable $e) {
            throw $e;
        }
    }

  
}
