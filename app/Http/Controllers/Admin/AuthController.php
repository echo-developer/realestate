<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Login;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('Admin.Auth.Login');
    }
    public function login(Request $request)
    {
       
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
    
        
        if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
            return response()->json(['success' => true, 'redirect_url' => route('dashboard')]);
        }
        else{

            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.'
            ], 422);
        }
    
      
        
    }
    
    public function logout()
    {
        Auth::guard('admin')->logout();
        return redirect()->route('login.form');
    }

    


    
}
