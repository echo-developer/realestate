<?php

use App\Http\Controllers\Api\AdvanceSearchController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\AgentDetailsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Enquery_CRM_Controller;
use App\Http\Controllers\Api\FloorPlaningController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\OtpController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PostController;

use App\Http\Controllers\Api\Project\ImageEditController;
use App\Http\Controllers\Api\Project\PostProjectController;
use App\Http\Controllers\Api\Project\ProjectDashboardController;
use App\Http\Controllers\Api\Project\ProjectDeleteController;
use App\Http\Controllers\Api\Project\ProjectDetailsController;
use App\Http\Controllers\Api\Project\ProjectEditController;
use App\Http\Controllers\Api\Project\ProjectHomeController;
use App\Http\Controllers\Api\Project\ProjectImageUploade;
use App\Http\Controllers\Api\Project\ProjectListandSearchController;
use App\Http\Controllers\Api\Project\ProjectPropertyController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyDetailsController;
use App\Http\Controllers\Api\PropertyEditController;
use App\Http\Controllers\Api\PropertyUpdateControler;
use App\Http\Controllers\Api\SeachController;
use App\Http\Controllers\Api\UserMembershipController;
use App\Http\Controllers\Api\VerifyUserMailController;
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

// Routes that allow both guests and logged-in users
// Route::middleware(['jwt.check'])->group(function () {
// });

// // Routes that strictly require authentication
// Route::middleware(['jwt.check:true'])->group(function () {
// });


// Auth Routes
Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('get_user_data', 'user');
    Route::post('forgot-password', 'sendPasswordResetLink');
    Route::post('reset-password', 'resetPassword');
    Route::get('google', 'redirectToGoogle');
    Route::get('google/callback', 'handleGoogleCallback');
});

// Home Routes
Route::controller(HomeController::class)->group(function () {
    Route::get('get_property_type', 'getPropertyType');
    Route::get('get_property_for/{id?}', 'getPropertyTypeFor');
    Route::get('get_property_cities', 'city');
    Route::get('get_properties', 'get_properties');
    Route::get('project_list_by_city', 'getProjectListbyCity');
    Route::get('get_testimonial_list', 'getTestimonialList');
    Route::post('buyer_property_enquery', 'buyerEnquerytoAdmin');
    Route::get('verified_agents', 'VerifiedAgentList');
    Route::get('property_trending_rates', 'propertyInTrendsandRates');
});

// Post Routes
Route::controller(PostController::class)->group(function () {
    Route::post('property-post', 'PostProperty')->name('postproperty');
    Route::get('get_property_amnity', 'get_property_amnity')->name('getAmnity');
    Route::get('get_property_budget', 'get_budget')->name('getBudget');
    Route::post('image-upload', 'ImageUpload')->name('imageupload');
    Route::get('get_locality/{id?}', 'FetchLocality')->name('Fetch.Locality');
    Route::get('get_property_furnish', 'furnish');
    Route::get('get_property_status', 'status');
});

// Dashboard Routes
Route::controller(DashboardController::class)->group(function () {

    Route::get('dashboard_data', 'DashboardData')->name('dashboard.data');
    Route::get('get_user_profile/{id}', 'get_user_profile')->name('userProfile');
    Route::post('update_profile_image', 'update_profile_image')->name('userProfileUpdate');
    Route::get('my_property_list', 'Dashboard_prop_list')->name('dashboard.prop.list');
    Route::post('add_property_favorite', 'Propertyfavorite')->name('property.fav');
    Route::post('change_user_password', 'ChangeUserPassword')->name('change.user.password');
    Route::post('propety_delete', 'PropertyDelete')->name('property.delete');
    Route::get('get_property_amenity', 'PropertyAmenities')->name('get.property.amenities');
    Route::post('update_amenity', 'UpdateAmenities')->name('update.property.amenities');

    Route::get('additional_property_details', 'GetPropertyAdditionalDetails')->name('get.property.additional.details');
    Route::post('add_extra_property_details', 'UpdatepropertyAdditonalDetails')->name('update.property.additional.details');

    Route::post('add_my_fav_property', 'Add_fav_Property')->name('add.fav.property');
    Route::post('add_my_fav_project', 'Add_fav_Project')->name('add.fav.project');

    Route::get('my_fav_property_list', 'My_fav_Property_List')->name('my.fav.property');
    Route::get('my_fav_project_list', 'My_fav_Project_List')->name('my.fav.project');

    Route::post('property_favorite_delete', 'PropertyFavoriteDelete')->name('delete.favoriteProperty');
    Route::post('project_favorite_delete', 'ProjectFavoriteDelete')->name('delete.favoriteProject');

    Route::get('my_profile', 'get_my_profile')->name('get.my.profile');
    Route::post('update_my_profile', 'update_my_profile')->name('update.my.profile');

    Route::post('upload_prt_brochure', 'uploaodPrtBrochure')->name('upload.prt.brochure');
    Route::get('download_prt_brochure', 'downloadprtBrochure')->name('download.prt.brochure');
    Route::post('uploadDocument', 'agentDocUplaod')->name('agent.doc.upload');
    Route::post('remove_document', 'removeUploadedDoc')->name('agent.doc.remove');

    Route::get('property-statistic',  'PropertyStatistic');

    Route::post('upload_certificates_img',  'uploadPropProjcertificatesImages')->name('upload.certificates.images');
    Route::post('upload_certificates_details',  'uploadPropProjcertificatesDetails')->name('upload.certificates.details');
    Route::get('certificates_details',  'getPropPropertycertificateDetails')->name('certificates.details');
    Route::POST('delete_certificate',  'getPropPropertycertificatedelete')->name('certificates.delete');
});

// Search Routes
Route::get('get_search_result', [SeachController::class, 'SearchResult'])->name('search.result');
Route::post('advance_search_result', [AdvanceSearchController::class, 'propertiesBasedonSearch'])->name('advance.search');

// Property Routes
Route::get('edit_property', [PropertyEditController::class, 'EditProperty'])->name('property.edit');
Route::post('update_property', [PropertyUpdateControler::class, 'UpdateProperty'])->name('property.update');


Route::controller(PropertyDetailsController::class)->group(function () {
    Route::get('get_property_details/{property_id}&user_id={user_id}', 'get_property_details')->name('property.details');
    Route::get('get_property_allImages/{property_id}', 'getPropertyAllImages')->name('property.allImages');

    Route::post('post_property_review', 'post_property_review')->name('property.reviews');
    Route::post('report_property', 'propertyReport')->name('property.report');
    Route::get('get_reported_properties', 'getReportListofProperty')->name('property.report.list');

    Route::get('get_users_property_review', 'get_users_property_review')->name('get.property.reviews');
});

// OTP Routes
Route::post('send-otp', [OtpController::class, 'sendOtp']);
Route::post('verify-otp', [OtpController::class, 'verifyOtp']);

// Chat Routes
Route::post('send-message', [ChatController::class, 'sendMessage']);
Route::get('messages/{userId}', [ChatController::class, 'getMessages']);

// Property Image Routes
Route::post('property_image_upload', [PropertyController::class, 'propertyImage'])->name('propertyImage');
Route::post('property_image_delete', [PropertyController::class, 'deleteImage']);
Route::post('property_image_caption', [PropertyController::class, 'captionImage']);

// Agent Routes
Route::get('agent_details_page', [AgentDetailsController::class, 'AgentDetailsPage']);
Route::get('agent_property_list', [AgentDetailsController::class, 'ProeprtyInfo']);
Route::get('agent_list', [AgentDetailsController::class, 'AgentList']);
Route::post('save_agent_review', [AgentDetailsController::class, 'agentsRating']);
Route::post('save_contact_agent', [AgentDetailsController::class, 'agentsContact']);

// Enquiry and CRM Routes
Route::controller(Enquery_CRM_Controller::class)->group(function () {
    Route::post('add_property_enquery', 'PropertyEnquiry');
    Route::post('add_project_enquery', 'ProjectEnquiry');

    Route::get('my_property_enquery_list', 'PropertyEnqueryList')->name('get.enquery.list');
    Route::get('my_project_enquery_list', 'ProjectEnqueryList')->name('get.projectEnquery.list');

    // pratibimba
    Route::get('user-project-leads', 'projectLeads');
    Route::get('my_property_CRMS', 'PropertyCRM')->name('get.crm.list');
    Route::get('user-general-leads', 'generalLeads');
    Route::post('property_CRM_logs', 'LogCRM')->name('log.crm');
    Route::post('save-lead-contact-status', 'saveLeadContactStatus');

    Route::get('lead-details', 'leadDetails');
    Route::post('update-lead-status', 'updateLeadStatus');
    Route::get('lead-contact-history', 'leadContactHistory');
    Route::get('lead-schedule-calendar', 'scheduleCalendar')->name('lead.calendar');
    Route::get('schedule-meeting-list', 'scheduleMeetingList');
    Route::post('update-meeting-status', 'updateMeetingStatus');
    // End pratibimba

    Route::post('delete_enquery', 'EnqueryDelete')->name('delete.enquery');
    Route::get('enquery_timeline', 'EnqueryTimelineList')->name('enq.timeline');
    Route::get('crm_schedule_details', 'CRM_ScheduleDetails')->name('crm_schedule.details');
});

// Project Routes
Route::post('project-post', [PostProjectController::class, 'PostProject']);
Route::post('project-image', [ProjectImageUploade::class, 'uploadImages']);
Route::get('project-details/{slug?}&user_id={user_id}/', [ProjectDetailsController::class, 'ProjectDetails']);

Route::post('post_project_review', [ProjectDetailsController::class, 'post_project_review']);
Route::get('get_project_review', [ProjectDetailsController::class, 'get_project_review']);
Route::post('report_project', [ProjectDetailsController::class, 'projectReport']);
Route::get('get_reported_projects', [ProjectDetailsController::class, 'getReportListofProject']);

Route::get('get-myproject', [ProjectDashboardController::class, 'GetProject']);
Route::get('additional_project_details', [ProjectDashboardController::class, 'ExtraFileddetails']);
Route::post('add_extra_project_details', [ProjectDashboardController::class, 'AddExtraProjectDetails']);

Route::post('upload_prj_brochure', [ProjectDashboardController::class, 'uploaodPrjBrochure'])->name('uplaod.project.brochure');
Route::get('download_prj_brochure', [ProjectDashboardController::class, 'downloadprjBrochure']);

Route::get('get-searchedprojects', [ProjectListandSearchController::class, 'getSearchedProjects']);
Route::post('project_delete', [ProjectDeleteController::class, 'ProjectDelete']);
Route::get('get-all-project-gallery/{id?}', [ProjectImageUploade::class, 'getAllProjectImages']);
Route::get('all-projects-list', [ProjectHomeController::class, 'GetProjects']);
Route::get('projects-list', [ProjectHomeController::class, 'GetProjectsData']);


Route::get('edit-project', [ProjectEditController::class, 'editProject']);
Route::post('update_project', [ProjectEditController::class, 'Updateproject']);
Route::post('upload/floor-plan', [ProjectImageUploade::class, 'uploadFloorPlan']);
Route::post('delete/floor-plan-image', [ProjectImageUploade::class, 'destroyFloorPlanImage']);


Route::get('get-project-properties', [ProjectPropertyController::class, 'GetProjectProperties']);
Route::post('save-project-property', [ProjectPropertyController::class, 'SaveProjectProperty']);

Route::post('edit-project-image', [ImageEditController::class, 'projectImage']);
Route::post('delete-project-image', [ImageEditController::class, 'deleteImage']);
Route::post('edit-project-caption', [ImageEditController::class, 'captionImage']);

Route::post('get-advertisements', [AdvertisementController::class, 'getAdvertisements']);
Route::post('add-advertisement-view', [AdvertisementController::class, 'add_view']);

Route::controller(FloorPlaningController::class)->group(function () {

    Route::get('get_floor_plan_type', 'floorPlan')->name('floor.plan.type');
    Route::post('save_floor_data', 'addFloorPlan')->name('floor.addFloorPlan');
});



Route::controller(PaymentController::class)->group(function () {

    Route::post('make_payment_stripe', 'stripeCheckout')->name('stripe.checkout');
    // Route::get('payment_success', 'payment_success')->name('payment.success');
    Route::get('membership_pakages', 'membership_pakage_lists')->name('pakage.list');
});
Route::controller(UserMembershipController::class)->group(function () {

    Route::get('membership_pakages', 'membership_pakage_lists')->name('pakage.list');
    Route::get('user_membership', 'getUserMembership')->name('user.membership');
    Route::get('get_remaining_value', 'getRemainingValue')->name('user.remainingvalue');
});

Route::controller(VerifyUserMailController::class)->group(function () {

    Route::post('send_otp_to_verify_email', 'SendOtpToVerifyEmail')->name('send.email.verification.otp');
    Route::post('verify_email', 'verifyOtpforEmail')->name('verify.email');
});
