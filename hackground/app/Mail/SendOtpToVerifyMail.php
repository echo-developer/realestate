<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendOtpToVerifyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;
    public $subject;
    public $content;

    public function __construct($otp, $subject, $content)
    {
        $this->otp = $otp;
        $this->subject = $subject;
        $this->content = $content;
    }

    public function build()
    {
        return $this->subject($this->subject)
                    ->html($this->content);
    }
}
