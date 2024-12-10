<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::controller(AuthController::class)->group(function (): void {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('user', 'user');
    Route::post('forgot-password','sendOtp');
    Route::post('otp-check','verifyOtp');
    Route::get('google', 'redirectToGoogle');
    Route::get('google/callback', 'handleGoogleCallback');
});

Route::controller(HomeController::class)->group(function () {
    Route::get('get/property-type', 'getPropertyType');
    Route::get('get/property-for', 'getPropertyTypeFor');


});

Route::controller(PostController::class)->group(function () {
    Route::post('/image-upload', 'ImageUpload')->name('ImageUpload');

});