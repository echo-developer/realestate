<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

use Tymon\JWTAuth\Facades\JWTAuth;

if (!function_exists('respondWithToken')) {
    function respondWithToken($token)
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
}

