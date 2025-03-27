<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $to, $mail_unique_title, $data_parse;

    public function __construct($to, $mail_unique_title, $data_parse)
    {
        $this->to = $to;
        $this->mail_unique_title = $mail_unique_title;
        $this->data_parse = $data_parse;
    }

    public function handle()
    {
        SendMail($this->to, $this->mail_unique_title, $this->data_parse);
    }
}
