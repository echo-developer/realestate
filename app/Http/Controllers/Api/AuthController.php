<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Support\Str;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register','forgot-password']]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = auth()->user();

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $token, 
                'type' => 'bearer',
            ]
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'user_type' => 'required|string',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'user_type' => $request->user_type,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        $token = JWTAuth::fromUser($user);

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate token',
            ], 500);
        }

        
        JWTAuth::setToken($token)->authenticate();

        return $this->respondWithToken($token);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    // Refresh method
    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => JWTAuth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }
    public function user()
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
        ]);
    }


//     public function sendOtp(Request $request)
// {
//     $request->validate(['email' => 'required|email']);

//     $user = User::where('email', $request->email)->first();

//     if ($user) {
//         $otp = random_int(100000, 999999); // Generate a 6-digit OTP

//         // Clear old OTPs for the user
//         DB::table('pref_user_password_resets')->where('user_id', $user->id)->delete();

//         // Save the new OTP in the database
//         DB::table('pref_user_password_resets')->insert([
//             'user_id' => $user->id,
//             'otp' => $otp,
//             'expires_at' => now()->addMinutes(10),
//             'created_at' => now(),
//         ]);

//         // Send OTP to the user
//         $message = "Your OTP for password reset is: $otp. It is valid for 10 minutes.";
//         SendPasswordResetEmail::dispatch($user->email, $message);

//         return response()->json(['message' => 'OTP sent.'], 200);
//     }

//     return response()->json(['error' => 'Email not found.'], 400);
// }

    
public function verifyOtp(Request $request)
{
    $request->validate([
        'otp' => 'required|digits:6', 
    ]);

   
    $otpRecord = DB::table('pref_user_password_resets')
        ->where('otp', $request->otp)
        ->where('expires_at', '>', now())
        ->first();

    if (!$otpRecord) {
        return response()->json(['error' => 'Invalid or expired OTP.'], 400);
    }

    
    DB::table('pref_user_password_resets')->where('id', $otpRecord->id)->delete();

    return response()->json(['message' => 'OTP verified successfully.'], 200);
}
public function sendOtp(Request $request, SmsService $smsService)
{
    $request->validate(['phone' => 'required|digits:10']); // Validate phone number

    $user = User::where('phone', $request->phone)->first(); // Search by phone number

    if ($user) {
        // Check if user has an OTP that is not expired
        $existingOtp = DB::table('pref_user_password_resets')
            ->where('user_id', $user->id)
            ->where('expires_at', '>', now()) // OTP must be valid
            ->first();

        if ($existingOtp) {
            // Optionally, add a check to prevent resending too quickly (e.g., 1 minute cooldown)
            $timeSinceLastRequest = now()->diffInMinutes($existingOtp->created_at);
            if ($timeSinceLastRequest < 1) {
                return response()->json(['error' => 'You must wait before requesting a new OTP.'], 400);
            }

            // Invalidate old OTP before sending a new one
            DB::table('pref_user_password_resets')->where('id', $existingOtp->id)->delete();
        }

        // Generate new OTP
        $otp = random_int(100000, 999999); // Generate a 6-digit OTP

        // Save the new OTP in the database
        DB::table('pref_user_password_resets')->insert([
            'user_id' => $user->id,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10), // OTP validity duration
            'created_at' => now(),
        ]);

        // Send OTP to the user via SMS
        $message = "Your OTP for password reset is: $otp. It is valid for 10 minutes.";

        // Example of passing a dynamic "from" number (can be user-specific or chosen based on logic)
        $dynamicFrom = $user->preferred_phone_number ?? env('TWILIO_FROM'); // Default or user-specific
        $smsService->sendSms($user->phone, $message, $dynamicFrom);

        return response()->json(['message' => 'OTP sent.'], 200);
    }

    return response()->json(['error' => 'Phone number not found.'], 400);
}
    
}
