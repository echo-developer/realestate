<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;


class SendPasswordResetEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $email;
    protected $resetLink;

    public function __construct($email, $resetLink)
    {
        $this->email = $email;
        $this->resetLink = $resetLink;
    }
    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info("SendPasswordResetEmail job started for email: {$this->email}");
        Mail::raw("Click here to reset your password: {$this->resetLink}", function ($message) {
            $message->to($this->email)->subject('Reset Password');
        });

    Log::info("SendPasswordResetEmail job completed.");
    }
}
