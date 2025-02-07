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
        $validator = Validator::make($request->all(), [
            'phone' => 'required|digits:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
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

        if (isset($smsResponse['error'])) {
            return response()->json(['error' => $smsResponse['error']], 500);
        }

        return response()->json(['message' => 'OTP sent successfully.']);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|digits:10',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $otpRecord = Otp::where('phone', $request->phone)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord) {
            return response()->json(['error' => 'Invalid OTP.'], 400);
        }

        if (Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json(['error' => 'OTP has expired.'], 400);
        }

        return response()->json(['message' => 'OTP verified successfully.']);
    }
}
