<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

use Tymon\JWTAuth\Facades\JWTAuth;

if (!function_exists('respondWithToken')) {
    function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }
}

if (!function_exists('set_flash_message')) {
    /**
     * Set a flash message for the session.
     *
     * @param string $message The message to display.
     * @param string $type The type of the message ('success', 'danger', 'warning', etc.).
     * @return void
     */
    function set_flash_message($operation)
    {
        if($operation == 'add'){
            session()->flash('success_msg', 'Added Successfully');
            session()->flash('message_type', 'success');
        }
        elseif($operation == 'update'){
            session()->flash('success_msg', 'Updated Successfully');
            session()->flash('message_type', 'success');
        }
        elseif($operation == 'delete'){
            session()->flash('success_msg', 'Deleted Successfully');
            session()->flash('message_type', 'danger');
        }
        else{
            session()->flash('success_msg', 'Something went wrong');
            session()->flash('message_type', 'warning');
        }
        
    }
}


