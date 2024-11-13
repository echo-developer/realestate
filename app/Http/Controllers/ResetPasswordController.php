<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;






class ResetPasswordController extends Controller
{
    public function password_recover_form()
    {
        return view('Admin.Auth.password_recover.password_reset');
    }


    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:pref_admin,email']);

        // Generate token
        $token = Str::random(60);

        // Insert token into password_resets table
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        // Send reset link email
        $resetLink = url('/set/NewPassword/' . $token);
        Mail::raw("Click here to reset your password: $resetLink", function ($message) use ($request) {
            $message->to($request->email)->subject('Reset Password');
        });

        return back()->with('status', 'Password reset link sent to your email.');
    }

    public function setNewPasswordForm($token)
    {
        return view('Admin.Auth.password_recover.set_new_password', ['token' => $token]);
    }

    public function saveNewPass(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:pref_admin,email',
            'password' => 'required|confirmed|min:6',
        ]);

        // Find token in password_resets table
        $reset = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$reset || Carbon::parse($reset->created_at)->addMinutes(60)->isPast()) {
            return back()->withErrors(['token' => 'This password reset token is invalid or expired.']);
        }

        // Update user's password
        DB::table('pref_admin')->where('email', $request->email)->update(['password' => Hash::make($request->password)]);

        // Delete token from password_resets table
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return redirect('/')->with('status', 'Your password has been reset!');
    }
}
