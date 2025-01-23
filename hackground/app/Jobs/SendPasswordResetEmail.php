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

    protected $email;
    protected $message;

    /**
     * Create a new job instance.
     */
    public function __construct($email, $message)
    {
        $this->email = $email;
        $this->message = $message; // Add message to constructor
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        Log::info("SendPasswordResetEmail job started for email: {$this->email}");

        // Use Mail::raw to send the message content
        Mail::raw($this->message, function ($message) {
            $message->to($this->email)
                ->subject('Reset Password'); // Add the subject
        });

        Log::info("SendPasswordResetEmail job completed.");
    }
}
