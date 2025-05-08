<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    // {
    //     if (Auth::guard('admin')->check()) {
    //         return $next($request);
    //     } else {
    //         return redirect()->route('login.form');
    //     }
    // }
    {
        if (Auth::guard('admin')->check()) {
            $admin = Auth::guard('admin')->user();

            if ($admin->status == 1) {
                return $next($request);
            }

            Auth::guard('admin')->logout();

            return redirect()->route('login.form')->withErrors(['account' => 'Your account is inactive.']);
        }

        return redirect()->route('login.form');
    }
}
