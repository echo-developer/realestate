<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
            $description = "Membership";

            // Charge the user
            $charge = $stripe->charges->create([
                'source' => $request->token,
                'amount' => $payamount * 100,
                'currency' => $currency_code,
                'description' => $description,
            ]);

            // Log response
            Log::info($charge);

            if ($charge->paid) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Payment successful',
                    'amount' => $payamount,
                ]);
                $this->payment_success($charge->id, $plan_id);
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

    public function payment_success($charge_id, $plan_id)
    {
        try {
        } catch (\Exception $e) {
            Log::error('Error in payment_success: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

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
