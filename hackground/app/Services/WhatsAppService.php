<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://messages-sandbox.nexmo.com/v1/',
            'auth' => ['2f781352', 'EUwPAl5UnP48oTjQ'],
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ]);
    }

    public function sendWhatsAppMessage($to, $text)
    {
        try {
            $payload = [
                'from' => 14157386102,
                'to' => $to,
                'message_type' => 'text',
                'text' => $text,
                'channel' => 'whatsapp',
            ];

            Log::info('Payload sent to Vonage:', $payload);

            $response = $this->client->post('messages', [
                'json' => $payload,
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            Log::error('WhatsApp message failed: ' . $e->getMessage());
            throw new \Exception('Failed to send WhatsApp message: ' . $e->getMessage());
        }
    }
}
