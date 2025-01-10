<?php

namespace App\Http\Controllers;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->sender_id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // Broadcast the event
        event(new MessageSent($message, $request->receiver_id));

        return response()->json(['status' => 'Message Sent!', 'message' => $message]);
    }

    public function getMessages($userId)
    {
        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->get();

        return response()->json($messages);
    }

}
