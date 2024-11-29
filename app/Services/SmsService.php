<?php
namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $sid;
    protected $token;
    protected $from;

    public function __construct()
    {
        // Directly get values from .env file
        $this->sid = env('TWILIO_SID');
        $this->token = env('TWILIO_TOKEN');
        $this->from = env('TWILIO_FROM');

        Log::debug('Twilio SID: ' . $this->sid);
        Log::debug('Twilio Token: ' . $this->token);
        Log::debug('Twilio From: ' . $this->from);
        
        // Check if credentials are loaded properly
        if (!$this->sid || !$this->token || !$this->from) {
            throw new \Exception('Twilio credentials are missing!');
        }
    }

    public function sendSms($to, $message)
    {
        $to = '+91' . $to;
        try {
            $client = new Client($this->sid, $this->token);
            
            // Send the SMS message
            $response = $client->messages->create(
                $to,
                [
                    'from' => $this->from,
                    'body' => $message,
                ]
            );
    
            // Log the response to see the message SID or any other returned data
            Log::debug('Twilio response: ', (array) $response);
            
            return $response;
        } catch (\Exception $e) {
            // Log the full error message to the logs
            Log::error('Twilio SMS Error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
    
}

