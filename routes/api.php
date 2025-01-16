<?php

use App\Http\Controllers\Api\AdvanceSearchController;
use App\Http\Controllers\Api\AgentDetailsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Enquery_CRM_Controller;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyDetailsController;
use App\Http\Controllers\Api\PropertyEditController;
use App\Http\Controllers\Api\PropertyUpdateControler;
use App\Http\Controllers\Api\SeachController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\OtpController;
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
    Route::post('forgot-password', 'sendOtp');
    Route::post('otp_check', 'verifyOtp');
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
    Route::post('/property_favorite_delete', 'PropertyFavoriteDelete')->name('delete.favoriteProperty');

    Route::get('/my_profile', 'get_my_profile')->name('get.my.profile');
    Route::post('/update_my_profile', 'update_my_profile')->name('update.my.profile');
});

Route::get('/get_search_result', [SeachController::class, 'SearchResult'])->name('search.result');
Route::get('/advance_serach_result', [AdvanceSearchController::class, 'AdvanceSearch'])->name('advance.search');

Route::get('/edit_property', [PropertyEditController::class, 'EditProperty'])->name('property.edit');

Route::post('/update_property', [PropertyUpdateControler::class, 'UpdateProperty'])->name('property.update');

Route::controller(PropertyDetailsController::class)->group(function () {

    Route::get('/get_property_details/{property_id}', 'get_property_details')->name('property.details');
    Route::get('/get_property_allImages/{property_id}', 'getPropertyAllImages')->name('property.allImages');
    Route::post('/post_property_review', 'post_property_review')->name('property.reviews');
    Route::get('/get_users_property_review', 'get_users_property_review')->name('get.property.reviews');
});

Route::post('/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);

Route::post('/send-message', [ChatController::class, 'sendMessage']);
Route::get('/messages/{userId}', [ChatController::class, 'getMessages']);

Route::post('/property_image_upload', [PropertyController::class, 'propertyImage'])->name('propertyImage');
Route::post('/property_image_delete', [PropertyController::class, 'deleteImage']);
Route::post('/property_image_caption', [PropertyController::class, 'captionImage']);



Route::get('/agent_details_page', [AgentDetailsController::class, 'AgentDetailsPage']);
Route::get('/agent_list', [AgentDetailsController::class, 'AgentList']);

Route::controller(Enquery_CRM_Controller::class)->group(function () {

    Route::post('/add_property_enquery', 'PropertyEnquiry');
    Route::get('/my_property_enquery_list', 'PropertyEnqueryList')->name('get.enquery.list');
    Route::get('/my_property_CRMS', 'PropertyCRM')->name('get.crm.list');
    Route::post('/property_CRM_logs', 'LogCRM')->name('log.crm');
    Route::post('/delete_enquery', 'EnqueryDelete')->name('delete.enquery');
    Route::get('/enquery_timeline', 'EnqueryTimelineList')->name('enq.timeline');


});
