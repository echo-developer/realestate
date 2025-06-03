<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmail;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Cache\RateLimiting\Unlimited;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

use random;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'sendPasswordResetLink', 'forgot-password', 'resetPassword', 'user', 'handleProviderCallback']]);
    }

    public function login(Request $request)
    {

        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Invalid credentials.',
                ]);
            }

            $user = auth()->user();
            // Log::info('Token stored in session: ' . session('jwt_token'));

            return response()->json([
                'status' => 1,
                'message' => 'Successfully logged in.',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                ],
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 0,
                'error' => $e->getMessage(),
            ]);
        }
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
            ]);
        }

        JWTAuth::setToken($token)->authenticate();

        return $this->respondWithToken($token);
    }

    public function logout()
    {
        $token = session('jwt_token');

        if (!$token) {
            return response()->json([
                'status' => 0,
                'message' => 'No token found.',
            ]);
        }

        // Invalidate the token
        JWTAuth::invalidate($token);

        // Remove the token from the session
        session()->forget('jwt_token');

        return response()->json([
            'status' => 1,
            'message' => 'Successfully logged out.',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 1,
            'user' => auth()->user(),
            'authorisation' => [
                'token' => JWTAuth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

    protected function respondWithToken($token)
    {
        assign_free_plan(auth()->user()->id);
        notify_admins_with_template('new_user_registered', [
            'FULL_NAME' => auth()->user()->name,
        ]);
        return response()->json([
            'status' => 1,
            'message' => 'Successfully registered',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function user(Request $request)
    {
        $user = User::find($request->member_id);

        if ($user) {
            $user->image = !empty($user->image)
                ? asset('user_upload/profile_image/' . $user->image)
                : '';
            $post_remaining_value = get_remaining_values('remaining_listings_allowed', $request->member_id) == null ? 'Unlimited' : get_remaining_values('remaining_listings_allowed', $request->member_id);
            return response()->json([
                'success' => 1,
                'message' => 'User retrieved successfully.',
                'data' => [
                    'user' => $user,
                    'remaining_listings_allowed' => $post_remaining_value,
                ]
            ]);
        } else {
            return response()->json([
                'success' => 0,
                'message' => 'User not found.'
            ]);
        }
    }

    public function sendPasswordResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 0,
                'message' => 'Email not found.',
            ]);
        }

        // Generate a unique token
        $token = bin2hex(random_bytes(32));

        // Store the token in cache with an expiration time of 30 minutes
        $cacheKey = "password_reset_token:{$user->email}";
        Cache::put($cacheKey, $token, now()->addMinutes(30));

        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . urlencode($token) . '&email=' . urlencode($user->email);

        $mail_unique_title = 'reset-password';
        SendPasswordResetEmail::dispatch($user->email, $mail_unique_title, ['RESET_A_LINK' =>  $resetUrl]);

        return response()->json([
            'status' => 1,
            'message' => 'Password reset link sent successfully.',
        ], 200);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
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


    // public function sendOtp(Request $request)
    // {
    //     $request->validate(['email' => 'required|email']);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user) {
    //         return response()->json([
    //             'status' => 0,
    //             'message' => 'Email not found.',
    //         ]);
    //     }


    //     DB::table('user_password_resets')->where('user_id', $user->id)->delete();


    //     $otp = random_int(100000, 999999);


    //     DB::table('user_password_resets')->insert([
    //         'user_id' => $user->id,
    //         'otp' => $otp,
    //         'expires_at' => now()->addMinutes(10),
    //         'created_at' => now(),
    //     ]);


    //     $message = "Your OTP for password reset is: $otp. It is valid for 10 minutes.";
    //     SendPasswordResetEmail::dispatch($user->email, $message);

    //     return response()->json([
    //         'status' => 0,
    //         'message' => 'OTP sent successfully.',
    //     ], 200);
    // }

    // public function verifyOtp(Request $request)
    // {
    //     $request->validate([
    //         'otp' => 'required|digits:6',
    //     ]);


    //     $otpRecord = DB::table('user_password_resets')
    //         ->where('otp', $request->otp)
    //         ->where('expires_at', '>', now())
    //         ->first();

    //     if (!$otpRecord) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Invalid or expired OTP.',
    //         ]);
    //     }


    //     DB::table('user_password_resets')->where('id', $otpRecord->id)->delete();

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'OTP verified successfully.',
    //     ], 200);
    // }
    // public function redirectToGoogle()
    // {
    //     return Socialite::driver('google')->redirect();
    // }

    // public function handleGoogleCallback()
    // {
    //     $googleUser = Socialite::driver('google')->user();


    //     $user = User::where('google_id', $googleUser->getId())->first();


    //     if (!$user) {
    //         $user = User::create([
    //             'name' => $googleUser->getName(),
    //             'email' => $googleUser->getEmail(),
    //             'google_id' => $googleUser->getId(),
    //             'password' => bcrypt(Str::random(16)),
    //         ]);
    //     }


    //     $token = JWTAuth::fromUser($user);

    //     return response()->json([
    //         'status' => 'success',
    //         'user' => $user,
    //         'authorisation' => [
    //             'token' => $token,
    //             'type' => 'bearer',
    //         ]
    //     ], 200);
    // }
    public function handleProviderCallback(Request $request, $provider)
    {
        $accessToken = $request->input('access_token');

        if (!$accessToken) {
            return response()->json(['error' => 'Access token is required'], 400);
        }

        try {
            // Get user info from social provider using access token
            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->userFromToken($accessToken);

            // Find or create user in your DB
            $user = User::updateOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail()
                ]
            );

            // Create JWT token for your user
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => 1,
                'token' => $token,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'error' => 'Failed to authenticate',
                'message' => $e->getMessage()
            ]);
        }
    }
}
