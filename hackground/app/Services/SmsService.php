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
        $this->sid = 'AC0fc59f9ed684b551c6aa4ad61109dfe9';
        $this->token = '197bea7ed37eb83e3f5c2c89301eeb9e';
        $this->from = '+12317511561';

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
        $to = '+91' . $to; // Adjust the phone number format if needed
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
    
            // Log specific properties from the response
            Log::debug('Twilio Message SID: ' . $response->sid);
            Log::debug('Twilio Message Status: ' . $response->status);
    
            // Return relevant data
            return [
                'sid' => $response->sid,
                'status' => $response->status,
                'to' => $response->to,
                'body' => $response->body,
            ];
        } catch (\Exception $e) {
            // Log the full error message
            Log::error('Twilio SMS Error: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
        }
    }
    
    
}

