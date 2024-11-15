<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendPasswordResetEmail;
use Illuminate\Support\Facades\Validator;





class ResetPasswordController extends Controller
{
    public function password_recover_form()
    {
        return view('Admin.Auth.password_recover.password_reset');
    }


    public function sendResetLink(Request $request)
    {
        $request->validate(
            ['email' => 'required|email|exists:pref_admin,email'],
            [
                'email.exists' => 'The email does not exist in our records.'
            ]
        );

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
        SendPasswordResetEmail::dispatch($request->email, $resetLink);



        return response()->json([
            'status' => 'Password reset link sent to your email.',
            'redirect_url' => url('/')
        ]);
    }

    public function setNewPasswordForm($token)
    {
        return view('Admin.Auth.password_recover.set_new_password', ['token' => $token]);
    }

    public function saveNewPass(Request $request)
    {
        // dd($request->all());
        $rules = [
            'token' => 'required',
            'email' => 'required|email|exists:pref_admin,email',
            'password' => 'required|confirmed|min:6',
        ];

        // $messages = [
        //     'email.required' => 'The email field is required.',
        //     'email.email' => 'Please provide a valid email address.',
        //     'email.exists' => 'The email does not exist in our records.',
        // ];

        // Using the validate method
        $validator = $request->validate($rules);
        // dd($validator);

        // if ($validator) {
        //     return back()->withErrors($validator)->withInput();
        // }

        // // Find token in password_resets table
        $reset = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$reset || Carbon::parse($reset->created_at)->addMinutes(1)->isPast()) {
            return back()->withErrors(['token' => 'This password reset token is invalid or expired.']);
        }

        // // Update user's password
        DB::table('pref_admin')->where('email', $request->email)->update(['password' => Hash::make($request->password)]);

        // // Delete token from password_resets table
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return redirect('/')->with('status', 'Your password has been reset!');
    }
}
