<?php

namespace App\Services;

use Twilio\Rest\Client;

class TwilioService
{
    protected $client;
    protected $from;

    public function __construct()
    {
        // Initialize Twilio client with SID and Auth Token from .env
        $sid ='AC0fc59f9ed684b551c6aa4ad61109dfe9';
        $token = '197bea7ed37eb83e3f5c2c89301eeb9e';
        $this->client = new Client($sid, $token);

        // Set the WhatsApp 'from' number
        $this->from = 'whatsapp:+14155238886';
    }

    /**
     * Send a WhatsApp message
     *
     * @param string $to Phone number (including country code) in WhatsApp format
     * @param string $message Message body
     * @return \Twilio\Rest\Api\V2010\Account\MessageInstance
     */
    public function sendWhatsAppMessage($to, $message)
    {
        // Send the message
        return $this->client->messages->create(
            "whatsapp:$to", // To phone number with country code
            [
                'from' => $this->from, // From Twilio WhatsApp number
                'body' => $message, // Message content
            ]
        );
    }
}
