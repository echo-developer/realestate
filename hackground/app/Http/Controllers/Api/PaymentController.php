<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function stripeCheckout(Request $request)
    {

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $request->input('product_name'),
                        ],
                        'unit_amount' => $request->input('amount') * 100,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.fail'),
            ]);

            log::info('session_details' . json_encode($session, JSON_PRETTY_PRINT));

            return response()->json(['id' => $session->id]);
        } catch (\Exception $e) {
            Log::error('Error in stripeCheckout: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while removing the file',
            ], 500);
        }
    }

    public function payment_success(Request $request)
    {
        try {
            $session_id = $request->query('session_id');
            Log::info('Payment Success! Session ID: ' . $session_id);

            return response()->json([
                'status' => 1,
                'message' => 'Payment successful!',
                'session_id' => $session_id
            ]);
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



    public function  payment_fail(Request $request)
    {
        try {
            log::info('FAILED');
        } catch (\Exception $e) {
            Log::error('Error in stripeCheckout: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred while removing the file',
            ], 500);
        }
    }
}
