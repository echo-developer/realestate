<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerifyOtpModel extends Model
{
    use HasFactory;
    protected $table = 'email_verify_otp';

    protected $fillable = ['email', 'otp', 'expires_at'];

    public $timestamps = true;

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public static function isValidOtp($email, $otp)
    {
        return self::where('email', $email)
            ->where('otp', $otp)
            ->where('expires_at', '>', Carbon::now())
            ->exists();
    }
}
