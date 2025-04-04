<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Otp;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;

class OtpController extends Controller
{
    public function sendOtp(Request $request, SmsService $smsService)
    {
        try {
            $validator = Validator::make($request->all(), [
                'phone' => 'required|digits:10',
            ]);

            if ($validator->fails()) {
                return response()->json(['status'=>0,'message' => $validator->errors()]);
            }

            $phone = $request->phone;
            $otp = rand(100000, 999999);
            $expiresAt = Carbon::now()->addMinutes(10); // OTP expires in 10 minutes

            // Save OTP in the database
            Otp::updateOrCreate(
                ['phone' => $phone],
                ['otp' => $otp, 'expires_at' => $expiresAt]
            );

            // Send the OTP via SMS
            $smsResponse = $smsService->sendSms($phone, "Your OTP is: $otp");
            if (!$smsResponse) {
                return response()->json(['status' => 0, 'message' => 'Failed to send OTP.']);
            }
            return response()->json(['status' => 1, 'message' => 'OTP sent successfully.']);
        } catch (\Exception $e) {
            logError($e);
            return response()->json(['status' => 0, 'message' => 'An error occurred while sending OTP.']);
        }
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|digits:10',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['status'=> 0,'message' => $validator->errors()]);
        }

        $otpRecord = Otp::where('phone', $request->phone)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord) {
            return response()->json(['status'=> 0,'message' => 'Invalid OTP.']);
        }

        if (Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json(['status'=> 0,'message' => 'OTP has expired.']);
        }

        return response()->json(['status'=> 1,'message' => 'OTP verified successfully.']);
    }
}
