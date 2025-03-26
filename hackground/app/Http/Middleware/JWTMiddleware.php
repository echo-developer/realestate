<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, $requireAuth = 'false'): Response
    {
        try {
            $token = $request->header('OSPL'); // Fetch token from OSPL header

            if ($token) {
                $token = str_replace('Bearer ', '', $token);
                $user = JWTAuth::setToken($token)->authenticate();
                $request->merge(['auth_user' => $user]);
            } elseif ($requireAuth === 'true') {
                // If authentication is required and no token is provided, return error
                return response()->json([
                    'status' => 0,
                    'message' => 'Authentication required',
                    'logout' => true
                ], 401);
            }
        } catch (TokenExpiredException $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Token has expired',
                'logout' => true
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Invalid token',
                'logout' => true
            ], 401);
        } catch (JWTException $e) {
            if ($requireAuth === 'true') {
                return response()->json([
                    'status' => 0,
                    'message' => 'Token is missing',
                    'logout' => true
                ], 401);
            }
        }
        return $next($request);
    }
}
