<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PropertyController;

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
    Route::get('get_property_type', 'getPropertyType');
    Route::get('get_property_for/{id?}', 'getPropertyTypeFor');
    Route::get('get_property_cities', 'city');
});

Route::controller(PostController::class)->group(function () {
    Route::post('/property-post', 'PostProperty')->name('postproperty');
    Route::get('/get_property_amnity', 'get_property_amnity')->name('getAmnity');
    Route::get('/get_property_budget', 'get_budget')->name('getBudget');
    Route::post('/image-upload', 'ImageUpload')->name('imageupload');
    Route::get('/get-locality/{id?}', 'FetchLocality')->name('Fetch.Locality');
    Route::get('/get_property_furnish', 'furnish');
    Route::get('/get_property_status', 'status');
});
Route::controller(PropertyController::class)->group(function () {
    Route::get('/get_properties', 'get_properties');
});