<?php

namespace App\Http\Controllers\Api;

use random;
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
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'sendPasswordResetLink','forgot-password', 'resetPassword', 'user']]);
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
                'message' => 'Invalid credentials.',
            ]);
        }

        $user = auth()->user();

        return response()->json([
            'status' => 1,
            'message' => 'Successfully logged in',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 200);
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
            return response()->json([
                'status' => 0,
                'message' => $validator->errors()->first(),
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'user_type' => $request->user_type,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'phone_code' => $request->phone_code
        ]);

        $token = JWTAuth::fromUser($user);

        if (!$token) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to generate token.',
            ]); // Server error
        }

        JWTAuth::setToken($token)->authenticate();

        return $this->respondWithToken($token);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out.',
        ], 200);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => JWTAuth::refresh(),
                'type' => 'bearer',
            ]
        ], 200);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'status' => 1,
            'message' => 'Successfully registered',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 200);
    }

    public function user(Request $request)
    {
        $user = User::find($request->member_id);

        if ($user) {
            return response()->json([
                'success' => 1,
                'message' => 'User retrieved successfully.',
                'data' => $user
            ], 200); // HTTP 200: OK
        } else {
            return response()->json([
                'success' => 0,
                'message' => 'User not found.'
            ]); // HTTP 404: Not Found
        }
    }

    public function sendPasswordResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 1,
                'message' => 'Email not found.',
            ]);
        }

        // Generate a unique token
        $token = bin2hex(random_bytes(32));

        // Store the token in cache with an expiration time of 30 minutes
        $cacheKey = "password_reset_token:{$user->email}";
        Cache::put($cacheKey, $token, now()->addMinutes(30));

        // Generate the reset URL for the React app
        $resetUrl = "http://localhost:3002/reset-password?token=$token&email={$user->email}";

        // Send the email with the reset URL
        $message = "Click the link below to reset your password. This link is valid for 30 minutes: $resetUrl";
        SendPasswordResetEmail::dispatch($user->email, $message);

        return response()->json([
            'status' => 0,
            'message' => 'Password reset link sent successfully.',
        ], 200);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);
    
        $email = $request->email;
        $token = $request->token;
    
        
        $cacheKey = "password_reset_token:$email";
        $cachedToken = Cache::get($cacheKey);
    
        if (!$cachedToken) {
            return response()->json([
                'status' => 0,
                'code' => 'token_expired',
                'message' => 'The reset token has expired. Please request a new one.',
            ]); 
        }
    
        if ($cachedToken !== $token) {
            return response()->json([
                'status' => 0,
                'code' => 'invalid_token',
                'message' => 'The provided token is invalid.',
            ]); 
        }
    
  
        $user = User::where('email', $email)->first();
    
        if (!$user) {
            return response()->json([
                'status' => 0,
                'code' => 'user_not_found',
                'message' => 'No user found with the provided email address.',
            ]); 
        }
    
        $user->password = Hash::make($request->password);
        $user->save();
    
        
        Cache::forget($cacheKey);
    
        return response()->json([
            'status' => 1,
            'message' => 'Password has been reset successfully.',
        ], 200);
    }
    

    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 1,
                'message' => 'Email not found.',
            ]);
        }


        DB::table('pref_user_password_resets')->where('user_id', $user->id)->delete();


        $otp = random_int(100000, 999999);


        DB::table('pref_user_password_resets')->insert([
            'user_id' => $user->id,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
        ]);


        $message = "Your OTP for password reset is: $otp. It is valid for 10 minutes.";
        SendPasswordResetEmail::dispatch($user->email, $message);

        return response()->json([
            'status' => 0,
            'message' => 'OTP sent successfully.',
        ], 200);
    }

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
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP.',
            ]);
        }


        DB::table('pref_user_password_resets')->where('id', $otpRecord->id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'OTP verified successfully.',
        ], 200);
    }
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();


        $user = User::where('google_id', $googleUser->getId())->first();


        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => bcrypt(Str::random(16)),
            ]);
        }


        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 200);
    }
}
