<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;


class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register','forgot-password']]);
    }

    // Login method
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        // Use JWTAuth to attempt login
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = auth()->user(); // Get the authenticated user

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'authorisation' => [
                'token' => $token,  // Return the token
                'type' => 'bearer',
            ]
        ]);
    }

    // Register method
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

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'user_type' => $request->user_type,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        // Check if the token generation failed
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate token',
            ], 500);
        }

        // Authenticate the user with the generated token
        JWTAuth::setToken($token)->authenticate();

        // Return a response with the token
        return $this->respondWithToken($token);
    }

    // Logout method
    public function logout()
    {
        // Invalidate the token for logout
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

    // Helper function to format token response
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


    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            $token = Str::random(60);
            Cache::put('password_reset_' . $user->id, $token, 60 * 60); 
            $resetLink = url("/reset-password/{$user->email}/{$token}");
            SendPasswordResetEmail::dispatch($user->email, $resetLink);
            return response()->json(['message' => 'Reset link sent.'], 200);
        }
    
        return response()->json(['error' => 'Email not found.'], 400);
    }
    
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);
    
        $cachedToken = Cache::get('password_reset_' . $request->email);
    
        if ($cachedToken !== $request->token) {
            return response()->json(['error' => 'Invalid or expired token.'], 400);
        }
    
        $user = User::where('email', $request->email)->first();
    
        if ($user) {
            $user->password = bcrypt($request->password);
            $user->save();
    
            Cache::forget('password_reset_' . $request->email);
    
            return response()->json(['message' => 'Password has been reset successfully.'], 200);
        }
    
        return response()->json(['error' => 'User not found.'], 400);
    }
    

}
