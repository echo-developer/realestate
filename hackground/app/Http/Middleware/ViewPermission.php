<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ViewPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $slug): Response
    {
        $userRole = Auth::guard('admin')->user()->role;

        if($userRole == 1){
            return $next($request);
        }
        // Log::info('User Role: ' . $userRole);
        // Log::info('Slug Parameter: ' . $slug);

        $hasPermission = DB::table('permissions')
        
            ->where('role_id', '=', $userRole)
            ->where('menu_code', '=', $slug)
            ->exists();


        if (!$hasPermission) {
            return abort(403, 'Unauthorized request');
        }
        return $next($request);
    }
}
