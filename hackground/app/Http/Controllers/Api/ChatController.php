<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        // Join messages with users table to get sender and receiver details
        $messages = DB::table('messages')
            ->join('users as sender', 'sender.id', '=', 'messages.sender_id') // Get sender details
            ->join('users as receiver', 'receiver.id', '=', 'messages.receiver_id') // Get receiver details
            ->where(function($query) use ($userId) {
                $query->where('messages.sender_id', $userId)
                      ->orWhere('messages.receiver_id', $userId);
            })
            ->select(
                'messages.id',
                'messages.sender_id',
                'messages.receiver_id',
                'messages.message',
                'messages.created_at',
                'messages.updated_at',
                'sender.name as sender_name',
                'sender.user_type as sender_user_type',
                'sender.email as sender_email',
                'sender.password as sender_password',
                'sender.image as sender_image',
                'sender.phone as sender_phone',
                'sender.status as sender_status',
                'receiver.name as receiver_name',
                'receiver.user_type as receiver_user_type',
                'receiver.email as receiver_email',
                'receiver.password as receiver_password',
                'receiver.image as receiver_image',
                'receiver.phone_code as receiver_phone_code',
                'receiver.whatsapp_no as receiver_whatsapp_no',
                'receiver.status as receiver_status'
            )
            ->get();
    
        return response()->json($messages);
    }
    
    
    

}
