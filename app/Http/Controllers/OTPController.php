<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\WhatsAppService;

class OTPController extends Controller
{
    protected $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService)
    {
        $this->whatsAppService = $whatsAppService;
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|regex:/^\+\d{1,15}$/', // Must be in E.164 format
            'message' => 'required|string|max:1000',
        ]);

        $to = $request->phone;
        $text = $request->message;

        try {
            $response = $this->whatsAppService->sendWhatsAppMessage($to, $text);
            return response()->json(['message' => 'Message sent successfully!', 'response' => $response]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    }
