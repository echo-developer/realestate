<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\_Menu_Controller;
use App\Http\Controllers\Admin\PropertyCategory;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\EmailTempController;
use App\Http\Controllers\Admin\AllSettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\GroupSettingController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PropertyCityController;
use App\Http\Controllers\Admin\ResetPasswordController;
use App\Http\Controllers\Admin\ProjectAmenityController;
use App\Http\Controllers\Admin\PropertyBudgetController;
use App\Http\Controllers\Admin\PropertyLengthController;
use App\Http\Controllers\Admin\PropertyStatusController;
use App\Http\Controllers\Admin\PropertyFurnishController;
use App\Http\Controllers\Admin\PropertyRecommendController;
use App\Http\Controllers\Admin\PropertyTransactionController;
use App\Http\Controllers\Admin\NotificationTemplateController;
use App\Http\Controllers\Admin\Property_SubCategoryController;
use App\Exports\EmailTempleteExport;
use Maatwebsite\Excel\Facades\Excel;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group that
| contains the "web" middleware group. Now create something great!
|
*/

// Routes for guests only (e.g., login page)
Route::middleware('guest')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/', 'showLoginForm')->name('login.form');
        Route::post('login', 'login')->name('login');
    });

    Route::controller(ResetPasswordController::class)->group(function () {
        Route::get('password_recover_form', 'password_recover_form')->name('password_recover_form');
        Route::post('sendResetLink', 'sendResetLink')->name('sendResetLink');
        Route::get('/set/NewPassword/{token}', 'setNewPasswordForm')->name('setNewPasswordForm');
        Route::post('/saveNewPass', 'saveNewPass')->name('saveNewPass');
    });
});

// Routes for authenticated admins
Route::middleware('admin_auth')->group(function () {

    // Dashboard routes
    Route::controller(DashboardController::class)->group(function () {
        Route::get('dashboard', 'dashboard')->name('dashboard');
    });

    // Authentication (logout) routes
    Route::controller(AuthController::class)->group(function () {
        Route::get('logout', 'logout')->name('logout');
    });

    // Admin role management routes
    Route::controller(RoleController::class)->group(function () {
        Route::get('adminrole', 'rolePage')->name('rolePage');
        Route::post('addnewRole', 'addnewRole')->name('addnewRole');
        Route::get('showSingleRole/{id}', 'showSingleRole')->name('showSingleRole');
        Route::post('roleupdate', 'roleupdate')->name('roleupdate');
        Route::post('rolestausUp', 'rolestausUp')->name('rolestausUp');
        Route::post('deleteRole/{id}', 'deleteRole')->name('deleteRole');
    });

    // Admin user management routes
    Route::controller(AdminUserController::class)->group(function () {
        Route::get('admin_user', 'Admin_User_Page')->name('Admin_User_Page');
        Route::post('/addnewUser', 'add_newUser')->name('add_newUser');
        Route::get('/showSingleUser/{id}', 'showSingleUser')->name('showSingleUser');
        Route::post('/userupdate', 'userupdate')->name('userupdate');
        Route::post('/userstausUpdate', 'userstausUpdate')->name('userstausUpdate');
        Route::post('/usersdelete/{id}', 'usersdelete')->name('usersdelete');
    });

    Route::controller(_Menu_Controller::class)->group(function () {
        Route::get('/menu_management_', 'menu_management_page')->name('menu_management_page');
        // Route::post('/addnewUser', 'add_newUser')->name('add_newUser');
        // Route::get('/showSingleUser/{id}', 'showSingleUser')->name('showSingleUser');
        // Route::post('/userupdate', 'userupdate')->name('userupdate');
        // Route::post('/userstausUpdate', 'userstausUpdate')->name('userstausUpdate');
        // Route::post('/usersdelete/{id}', 'usersdelete')->name('usersdelete');

    });

    Route::controller(NotificationController::class)->group(function () {
        Route::get('admin_notifiaction', 'Admin_notifiaction_Page')->name('Admin_notifiaction_Page');
        Route::post('/noti_stausUp', 'notification_stausUpdate')->name('notification.stausUpdate');
        Route::post('/deleteNotification/{id}', 'deleteNotification')->name('deleteNotification');
    });

    Route::controller(AllSettingController::class)->group(function () {
        Route::get('/Settings/{group_key}', 'view_AllsettingList')->name('view.AllsettingList');
        Route::post('/addnewSetting', 'addnewSetting')->name('addnewSetting');
        Route::get('/showSettingforEdit/{sett_id}', 'show_Setting_forEdit')->name('show.Setting.forEdit');
        Route::post('/allSetting-update', 'allSetting_update')->name('all.Setting.update');
        Route::post('/delete-Setting/{id}', 'delete_Setting')->name('delete.Setting');
        Route::get('/settings/search', 'settings_search')->name('settings.search');
    });

    Route::controller(GroupSettingController::class)->group(function () {
        Route::get('/group-setting', 'group_setting_view')->name('group.setting.view');
        Route::post('/addnew-groupSetting', 'addnew_groupSetting')->name('addnew.groupSetting');
        Route::get('/showGrpSettingList/{id}', 'showsingleGrpSetting')->name('show.GrpSettingList');
        Route::post('/update-groupSetting', 'update_groupSetting')->name('update.groupSetting');
        Route::post('/setting-StatusUpdate', 'grp_settings_toggle_sts')->name('grp_settings_toggle_sts');
        Route::post('/delete-GroupSetting/{id}', 'delete_GroupSetting')->name('delete.GroupSetting');
    });

    /*
|--------------------------------------------------------------------------
| Property Category Routes
|--------------------------------------------------------------------------
| These routes handle the property category management.
| Created By: Soumyadip
| Date: 2024-11-08
|--------------------------------------------------------------------------
*/
    Route::prefix('property')->controller(PropertyCategory::class)->group(function () {
        Route::get('/category/{lang?}', 'PropertyCategoryView')->name('PropertyCategory.view');
        Route::post('/category-image', 'PropertyCategoryImage')->name('PropertyCategoryImage');
        Route::post('/delete-category-image', 'deleteCategoryImage')->name('PropertyCategory.deleteImage');
        Route::post('/add-property-category', 'AddCategory')->name('PropertyCategory.add');
        Route::post('/edit-property-category', 'EditCategory')->name('PropertyCategory.edit');
        Route::get('/category-details/{id?}', 'CategoryDetails')->name('PropertyCategory.CategoryDetails');
        Route::post('/category_status', 'CategoryStatus')->name('PropertyCategory.CategoryStatus');
        Route::post('/category-delete', 'CategoryDelete')->name('PropertyCategory.CategoryDelete');
    });

    Route::prefix('property')->controller(Property_SubCategoryController::class)->group(function () {
        Route::get('/subcategory/{lang?}', 'PropertysubcategoryView')->name('Propertysubcategory.view');
        Route::post('/subcategory-image', 'PropertySubCategoryImage')->name('PropertySubCategoryImage');
        Route::post('/delete-subcategory-image', 'deleteSubCategoryImage')->name('PropertySubCategory.deleteImage');
        Route::post('/add-property-subcategory', 'AddSubCategory')->name('PropertySubCategory.add');
        Route::post('/edit-property-subcategory', 'EditSubCategory')->name('PropertySubCategory.edit');
        Route::get('/subcategory-details/{id?}', 'SubCategoryDetails')->name('PropertySubCategory.Details');
        Route::post('/subcategory_status', 'SubCategoryStatus')->name('PropertySubCategory.SubCategoryStatus');
        Route::post('/subcategory-delete', 'SubCategoryDelete')->name('PropertySubCategory.SubCategoryDelete');
    });

    Route::prefix('property')->controller(PropertyFurnishController::class)->group(function () {
        Route::get('/furnishing/{lang?}', 'PropertyfurnishingView')->name('Propertyfurnishing.view');
        Route::post('/add-property-furnish', 'AddFurnish')->name('PropertyFurnish.add');
        Route::post('/edit-property-furnish', 'EditFurnish')->name('PropertyFurnish.edit');
        Route::get('/furnish-details/{id?}', 'Furnishdetails')->name('PropertyFurnish.Details');
        Route::post('/furnish_status', 'Furnishstatus')->name('PropertyFurnish.Furnishstatus');
        Route::post('/furnish-delete', 'Furnishdelete')->name('PropertyFurnish.Furnishdelete');
    });

    Route::prefix('property')->controller(PropertyTransactionController::class)->group(function () {
        Route::get('/transaction/{lang?}', 'PropertytransactionView')->name('Propertytransaction.view');
        Route::post('/add-property-transaction', 'AddTransaction')->name('PropertyTransaction.add');
        Route::post('/edit-property-transaction', 'EditTransaction')->name('PropertyTransaction.edit');
        Route::get('/transaction-details/{id?}', 'Transactiondetails')->name('PropertyTransaction.Details');
        Route::post('/transaction_status', 'Transactionstatus')->name('PropertyTransaction.Transactionstatus');
        Route::post('/transaction-delete', 'Transactiondelete')->name('PropertyTransaction.Transactiondelete');
    });

    Route::prefix('property')->controller(PropertyBudgetController::class)->group(function () {
        Route::get('/budget', 'PropertybudgetView')->name('Propertybudget.view');
        Route::post('/add-property-budget', 'AddBudget')->name('PropertyBudget.add');
        Route::post('/edit-property-budget', 'EditBudget')->name('PropertyBudget.edit');
        Route::get('/budget-details/{id?}', 'Budgetdetails')->name('PropertyBudget.Details');
        Route::post('/budget_status', 'Budgetstatus')->name('PropertyBudget.Budgetstatus');
        Route::post('/budget-delete', 'Budgetdelete')->name('PropertyBudget.Budgetdelete');
    });

    Route::prefix('property')->controller(PropertyRecommendController::class)->group(function () {
        Route::get('/recommended/{lang?}', 'PropertyrecommendedView')->name('Propertyrecommended.view');
        Route::post('/add-property-recommended', 'AddRecommended')->name('PropertyRecommended.add');
        Route::post('/edit-property-recommended', 'EditRecommended')->name('PropertyRecommended.edit');
        Route::get('/recommended-details/{id?}', 'Recommendeddetails')->name('PropertyRecommended.Details');
        Route::post('/recommended_status', 'Recommendedstatus')->name('PropertyRecommended.Recommendedstatus');
        Route::post('/recommended-delete', 'Recommendeddelete')->name('PropertyRecommended.Recommendeddelete');
    });

    Route::prefix('property')->controller(PropertyLengthController::class)->group(function () {
        Route::get('/length', 'PropertylengthView')->name('Propertylength.view');
        Route::post('/add-property-length', 'Addlength')->name('Propertylength.add');
    });

    Route::prefix('property')->controller(PropertyStatusController::class)->group(function () {
        Route::get('/status/{lang?}', 'PropertystatusView')->name('Propertystatus.view');
        Route::post('/add-property-status', 'AddStatus')->name('PropertyStatus.add');
        Route::post('/edit-property-status', 'EditStatus')->name('PropertyStatus.edit');
        Route::get('/status-details/{id?}', 'Statusdetails')->name('PropertyStatus.Details');
        Route::post('/status_status', 'Statusstatus')->name('PropertyStatus.Statusstatus');
        Route::post('/status-delete', 'Statusdelete')->name('PropertyStatus.Statusdelete');
    });

    Route::prefix('project')->controller(ProjectAmenityController::class)->group(function () {
        Route::get('/amenity/{lang?}', 'ProjectAmenityView')->name('ProjectAmenity.view');
        Route::post('/amenity-image', 'ProjectAmenityImage')->name('ProjectAmenityImage');
        Route::post('/delete-amenity-image', 'deleteAmenityImage')->name('ProjectAmenity.deleteImage');
        Route::post('/add-project-amenity', 'AddAmenity')->name('ProjectAmenity.add');
        Route::post('/edit-project-amenity', 'EditAmenity')->name('ProjectAmenity.edit');
        Route::get('/amenity-details/{id?}', 'AmenityDetails')->name('ProjectAmenity.AmenityDetails');
        Route::post('/amenity_status', 'AmenityStatus')->name('ProjectAmenity.AmenityStatus');
        Route::post('/amenity-delete', 'AmenityDelete')->name('ProjectAmenity.AmenityDelete');
    });
    /*
|--------------------------------------------------------------------------
| Country Routes
|--------------------------------------------------------------------------
| These routes handle the Country management.
| Created By: Soumyadip
| Date: 2024-11-22
|--------------------------------------------------------------------------
*/
    Route::controller(CountryController::class)->group(function () {
        Route::get('/country/{lang?}', 'CountryView')->name('country.view');
        Route::post('/add/country', 'AddCountry')->name('country.add');
        Route::get('/country/details/{id?}', 'CountryDetails')->name('country.details');
        Route::post('/edit/country', 'EditCountry')->name('country.edit');
        Route::post('/country/status', 'CountryStatus')->name('country.status');
        Route::post('/country/delete', 'CountryDelete')->name('country.delete');
    });

    Route::prefix('management')->controller(TestimonialController::class)->group(function () {
        Route::get('/testimonial/{lang?}', 'TestimonialView')->name('Testimonial.view');
        Route::post('/testimonial-image', 'TestimonialImage')->name('TestimonialImage');
        Route::post('/delete-testimonial-image', 'deleteTestimonialImage')->name('Testimonial.deleteImage');
        Route::post('/add-management-testimonial', 'AddTestimonial')->name('Testimonial.add');
        Route::post('/edit-management-testimonial', 'EditTestimonial')->name('Testimonial.edit');
        Route::get('/testimonial-details/{id?}', 'TestimonialDetails')->name('Testimonial.TestimonialDetails');
        Route::post('/testimonial_status', 'TestimonialStatus')->name('Testimonial.TestimonialStatus');
        Route::post('/testimonial-delete', 'TestimonialDelete')->name('Testimonial.TestimonialDelete');
    });

    Route::prefix('management')->controller(EmailTempController::class)->group(function () {
        Route::get('/emailTemplate/{lang?}', 'EmailTemplateView')->name('EmailTemplate.view');
        Route::post('/add-management-emailTemplate', 'AddEmailTemplate')->name('EmailTemplate.add');
        Route::post('/edit-management-emailTemplate', 'EditEmailTemplate')->name('EmailTemplate.edit');
        Route::get('/emailTemplate-details/{id?}', 'EmailTemplateDetails')->name('EmailTemplate.EmailTemplateDetails');
        Route::post('/emailTemplate_status', 'EmailTemplateStatus')->name('EmailTemplate.EmailTemplateStatus');
        Route::post('/emailTemplate-delete', 'EmailTemplateDelete')->name('EmailTemplate.EmailTemplateDelete');
    });

 /*
|--------------------------------------------------------------------------
| State Routes
|--------------------------------------------------------------------------
| These routes handle the State management.
| Created By: Soumyadip
| Date: 2024-11-25
|--------------------------------------------------------------------------
*/
Route::controller(StateController::class)->group(function () {
    Route::get('/state/{lang?}', 'StateView')->name('state.view');
    Route::post('/add/state', 'AddState')->name('state.add');
    Route::get('/state/details/{id?}', 'StateDetails')->name('state.details');
    Route::post('/edit/state', 'EditState')->name('state.edit');
    Route::post('/state/status', 'StateStatus')->name('state.status');
    Route::post('/state/delete', 'StateDelete')->name('state.delete');
});

 /*
|--------------------------------------------------------------------------
| City Routes
|--------------------------------------------------------------------------
| These routes handle the City management.
| Created By: Soumyadip
| Created Date: 2024-11-26
|--------------------------------------------------------------------------
*/
Route::controller(CityController::class)->group(function () {
    Route::get('/city/{lang?}', 'CityView')->name('city.view');
    Route::post('/add/city', 'AddCity')->name('city.add');
    Route::get('/city/details/{id?}', 'CityDetails')->name('city.details');
    Route::post('/edit/city', 'EditCity')->name('city.edit');
    Route::post('/city/status', 'CityStatus')->name('city.status');
    Route::post('/city/delete', 'CityDelete')->name('city.delete');
    Route::get('/getstate/{lang?}', 'getState')->name('state.getState');

});

 /*
|--------------------------------------------------------------------------
| Notification Template Routes
|--------------------------------------------------------------------------
| These routes handle the Notification Template management.
| Created By: Soumyadip
| Created Date: 2024-11-28
|--------------------------------------------------------------------------
*/
Route::prefix('management')->controller(NotificationTemplateController::class)->group(function () {
    Route::get('/notificationtemplate/{lang?}', 'NotificationTemplateView')->name('notificationtemplate.view');
    Route::post('/notificationtemplate/add', 'AddNotificationTemplate')->name('notificationtemplate.add');
    Route::get('/notificationtemplate/details/{id?}', 'NotificationTemplateDetails')->name('NotificationTemplate.details');
    Route::post('/notificationtemplate/edit', 'EditNotificationTemplate')->name('notificationtemplate.edit');
    Route::post('/notificationtemplate/status', 'NotificationStatus')->name('notificationtemplate.status');
    Route::post('/notificationtemplate/delete', 'DeleteNotificationTemplate')->name('notificationtemplate.delete');
});

// routes/web.php

Route::get('/export-EmailTemplete', function () {
    return Excel::download(new EmailTempleteExport, 'EmailTemplete.xlsx');
});

});
