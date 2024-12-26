<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PropertyDetailsController;
use App\Http\Controllers\Api\PropertyEditController;
use App\Http\Controllers\Api\SeachController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



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
    Route::get('get_user_data', 'user');
    Route::post('forgot-password','sendOtp');
    Route::post('otp_check','verifyOtp');
    Route::get('google', 'redirectToGoogle');
    Route::get('google/callback', 'handleGoogleCallback');
});

Route::controller(HomeController::class)->group(function () {
    Route::get('get_property_type', 'getPropertyType');
    Route::get('get_property_for/{id?}', 'getPropertyTypeFor');
    Route::get('get_property_cities', 'city');
    Route::get('/get_properties', 'get_properties');

});

Route::controller(PostController::class)->group(function () {
    Route::post('/property-post', 'PostProperty')->name('postproperty');
    Route::get('/get_property_amnity', 'get_property_amnity')->name('getAmnity');
    Route::get('/get_property_budget', 'get_budget')->name('getBudget');
    Route::post('/image-upload', 'ImageUpload')->name('imageupload');
    Route::get('/get_locality/{id?}', 'FetchLocality')->name('Fetch.Locality');
    Route::get('/get_property_furnish', 'furnish');
    Route::get('/get_property_status', 'status');
});
Route::controller(DashboardController::class)->group(function () {

    Route::get('/get_user_profile/{id}', 'get_user_profile')->name('userProfile');
    Route::post('/update_profile_image', 'update_profile_image')->name('userProfileUpdate');
    Route::get('/my_property_list', 'Dashboard_prop_list')->name('dashboard.prop.list');
    Route::post('/add_property_favorite', 'Propertyfavorite')->name('property.fav');
    Route::post('/change_user_password', 'ChangeUserPassword')->name('change.user.password');
    Route::post('/propety_delete', 'PropertyDelete')->name('property.delete');
    Route::get('/get_property_amenity', 'PropertyAmenities')->name('get.property.amenities');
    Route::post('/update_property_amenity', 'UpdateAmenities')->name('update.property.amenities');
    Route::post('/add_my_fav_property', 'Add_fav_Property')->name('add.fav.property');
    Route::get('/my_fav_property_list', 'My_fav_Property_List')->name('my.fav.property');
});

Route::controller(SeachController::class)->group(function(){
    
    Route::get('/get_search_result', 'SearchResult')->name('search.result');
    
    
});

Route::controller(PropertyDetailsController::class)->group(function(){

    Route::get('/get_property_details/{slug}', 'get_property_details')->name('property.details');
    
});

Route::controller(PropertyEditController::class)->group(function(){

    Route::get('/edit_property', 'EditProperty')->name('property.edit');
    
});

