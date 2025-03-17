<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;





class ResetPasswordController extends Controller
{
    public function password_recover_form()
    {
        return view('Admin.Auth.password_recover.password_reset');
    }


    public function sendResetLink(Request $request)
    {
        $request->validate(
            ['email' => 'required|email|exists:admin,email'],
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
            'email' => 'required|email|exists:admin,email',
            'password' => 'required|confirmed|min:6',
        ];

        $messages = [
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.exists' => 'The email does not exist in our records.',
        ];

        // Using the validate method
        $validator = $request->validate($rules,$messages);
        // dd($validator);

        // // Find token in password_resets table
        $reset = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('email', $request->email)
            ->first();

        if (!$reset || Carbon::parse($reset->created_at)->addSeconds(59)->isPast()) {
            // If no token found or token is expired, delete the token (if it exists)
            DB::table('password_reset_tokens')
                ->where('token', $request->token)
                ->delete();

            // Provide the appropriate error message
            $errorMessage = !$reset ? 'This password reset token is invalid.' : 'This password reset token has expired.';
            return redirect()->back()->with('error', $errorMessage);
        }




        // // Update user's password
        DB::table('admin')->where('email', $request->email)->update(['password' => Hash::make($request->password)]);

        return redirect('/')->with('status', 'Your password has been reset!');
    }
}
