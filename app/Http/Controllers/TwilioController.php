<?php

namespace App\Http\Controllers;

use App\Services\TwilioService;
use Illuminate\Http\Request;

class TwilioController extends Controller
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    public function sendWhatsAppMessage(Request $request)
    {
       

        // Send WhatsApp message
        $response = $this->twilioService->sendWhatsAppMessage($request->to, $request->message);

        return response()->json([
            'status' => 'success',
            'message' => 'WhatsApp message sent!',
            'sid' => $response->sid, // SID of the sent message
        ]);
    }
}
