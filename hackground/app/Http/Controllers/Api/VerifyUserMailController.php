<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SendOtpToVerifyMail;
use App\Models\EmailVerifyOtpModel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;


class VerifyUserMailController extends Controller
{
    public function SendOtpToVerifyEmail(Request $request)
    {
        try {
            $messages = [
                'email.required' => 'Email is required.',
                'email.unique' => 'Email already exists.',
            ];

            $validator = Validator::make($request->all(), [
                'email' => 'required|unique:users,email',
            ], $messages);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 0,
                    'message' => $validator->errors()->first(),
                ]);
            }

            $otp = rand(100000, 999999);
            $expiresAt = Carbon::now()->addMinutes(10);

            EmailVerifyOtpModel::where('email', $request->email)->delete();

            EmailVerifyOtpModel::create([
                'email' => $request->email,
                'otp' => $otp,
                'expires_at' => $expiresAt,
            ]);

            $template = DB::table('pref_email_templates_names')
                ->where('email_template_id', 1) //getting template id 1
                ->where('lang', $request->input('lang', 'en'))
                ->first();
                
            if ($template) {
                $emailContent = str_replace('{{ otp }}', $otp, $template->content);
                $subject = $template->subject;
            } else {
                $subject = 'Email Verification';
                $emailContent = "
                    <h1>Email Verification</h1>
                    <p>Your OTP Code is: <strong>{$otp}</strong></p>
                    <p>This OTP is valid for 10 minutessss.</p>
                ";
            }

            Mail::to($request->email)->send(new SendOtpToVerifyMail($otp, $subject, $emailContent));

            return response()->json(['message' => 'OTP sent successfully.'], 200);
        } catch (\Exception $e) {
            logError($e);
        }
    }

    public function verifyOtpforEmail(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => $validator->errors()->first(),
            ]);
        }

        $otpRecord = EmailVerifyOtpModel::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otpRecord) {
            return response()->json(['status' => 0, 'message' => 'Invalid or expired OTP.']);
        }

        $otpRecord->delete();

        return response()->json(['status' => 1, 'message' => 'Email verified successfully.']);
    }
}
