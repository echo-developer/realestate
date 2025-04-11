<?php

use App\Http\Controllers\Admin\_Menu_Controller;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\AdvertisementPackagesController;
use App\Http\Controllers\Admin\AllProjectController;
use App\Http\Controllers\Admin\AllPropertyController;
use App\Http\Controllers\Admin\AllSettingController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BankLoanController;
use App\Http\Controllers\Admin\CityController;
use App\Http\Controllers\Admin\CmsController;
use App\Http\Controllers\Admin\CountryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmailTempController;
use App\Http\Controllers\Admin\EnquiryController;
use App\Http\Controllers\Admin\FloorPlanController;
use App\Http\Controllers\Admin\GroupSettingController;
use App\Http\Controllers\Admin\LocalityController;
use App\Http\Controllers\Admin\MembershipFeaturesController;
use App\Http\Controllers\Admin\MembershipPlanController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\NotificationTemplateController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PostPropertyController;
use App\Http\Controllers\Admin\ProjectAmenityController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectEditController;
use App\Http\Controllers\Admin\Property_SubCategoryController;
use App\Http\Controllers\Admin\PropertyBudgetController;
use App\Http\Controllers\Admin\PropertyCategory;
use App\Http\Controllers\Admin\PropertyFurnishController;
use App\Http\Controllers\Admin\PropertyLengthController;
use App\Http\Controllers\Admin\PropertyRecommendController;
use App\Http\Controllers\Admin\PropertyStatusController;
use App\Http\Controllers\Admin\PropertyTransactionController;
use App\Http\Controllers\Admin\ResetPasswordController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StateController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserSearchActivityController;
use App\Http\Controllers\Api\FloorPlaningController;
use App\Http\Controllers\Api\Project\ProjectImageUploade;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;



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


// FOR SIDEBAR TESTING
/*
Route::get('/example', function () {
    return view('Admin.layouts_for_testing.test_blade');
});
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
        Route::get('dashboard', 'index')->name('admin.dashboard');
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
        Route::get('/menu_management-view', 'MenuView')->name('MenuView_page');
        Route::post('/add-menu', 'addMenu')->name('add.menu');
        Route::get('/menu-details/{id}', 'MenuDetails')->name('Menu.Details');
        Route::post('/edit-menu', 'EditMenu')->name('Edit.Menu');
        Route::post('/menu_status', 'MenuStatus')->name('Menu.Status');
        Route::post('/menu-delete', 'MenuDelete')->name('Menu.Delete');
    });

    Route::controller(NotificationController::class)->group(function () {
        Route::get('admin_notifiaction', 'Admin_notifiaction_Page')->name('Admin_notifiaction_Page');
        Route::get('/admin/fetch-notifications', 'fetchLatest')->name('admin.notifications.fetch');
        Route::post('/noti_stausUp', 'notification_stausUpdate')->name('notification.stausUpdate');
        Route::post('/deleteNotification/{id}', 'deleteNotification')->name('deleteNotification');
    });



    Route::controller(AllSettingController::class)->group(function () {
        Route::get('/Settings/{group_key?}', 'view_AllsettingList')->name('view.AllsettingList');
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
        Route::post('furnish/upload', 'upload')->name('furnish.upload');
        Route::post('furnish/image-delete', 'deleteImage');
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
        Route::post('status/upload', 'upload')->name('PropertyStatus.upload');
        Route::post('status/image-delete', 'deleteImage');
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

    Route::prefix('management')->controller(CmsController::class)->group(function () {
        Route::get('/cms/{lang?}', 'CmsView')->name('Cms.view');
        Route::post('/add-management-cms', 'AddCms')->name('Cms.add');
        Route::post('/edit-management-cms', 'EditCms')->name('Cms.edit');
        Route::get('/cms-details/{id?}', 'CmsDetails')->name('Cms.CmsDetails');
        Route::post('/cms_status', 'CmsStatus')->name('Cms.CmsStatus');
        Route::post('/cms-delete', 'CmsDelete')->name('Cms.CmsDelete');
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


    Route::controller(LocalityController::class)->group(function () {
        Route::get('/locality/{lang?}', 'LocalityView')->name('locality.view');
        Route::post('/add/locality', 'AddLocality')->name('locality.add');
        Route::get('/locality/details/{id?}', 'LocalityDetails')->name('locality.details');
        Route::post('/edit/locality', 'EditLocality')->name('locality.edit');
        Route::post('/locality/status', 'LocalityStatus')->name('locality.status');
        Route::post('/locality/delete', 'LocalityDelete')->name('locality.delete');
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

    Route::prefix('member')->controller(UserController::class)->group(function () {
        Route::get('/memberUser/{typeName?}', 'MemberUserView')->name('memberUser.view');
        Route::post('/memberUSer-image', 'MemberUserImage')->name('MemberUserImage');
        Route::post('/delete-memberUSer-image', 'DeleteMemberUserImage')->name('MemberUser.deleteImage');
        Route::post('/member-add', 'AddMemberUser')->name('memberUser.add');
        Route::get('/memberUser-details/{id?}', 'MemberUserDetails')->name('MemberUser.details');
        Route::post('/allUser-update', 'UpdateMemberUser')->name('memberUser.edit');
        Route::post('/memberUser-status', 'MemberUserStatus')->name('memberUser.status');
        Route::post('/memberUser/agent-status', 'MemberUserAgentStatus')->name('memberUser.agent.status');
        Route::post('/memberUser-delete/{id}', 'MemberUserDelete')->name('memberUser.delete');
    });

    Route::controller(PermissionController::class)->group(function () {
        Route::get('/permission-view', 'PermissionView')->name('permission.view');
        Route::post('/permission-save', 'PermissionSave')->name('Permission.Save');
        Route::get('/get-userBased-permission/{role_id?}', 'UserbasedPermission')->name('Userbased.Permission');
    });


    Route::prefix('allproperties')->controller(AllPropertyController::class)->group(function () {
        Route::get('/all-property-view', 'AllPropertyView')->name('allproperty.view');
        Route::get('/all-property-view/{id}', 'AllPropertyView');
        Route::post('/feature_status', 'FeaturedStatus')->name('featured.status');
        Route::post('/top_status', 'TopStatus')->name('top.status');
        Route::post('/delete', 'Propertydelete')->name('Property.delete');
        Route::post('/statusupdate', 'PropStatusupdate')->name('property.status.update');
    });

    Route::prefix('allproject')->controller(AllProjectController::class)->group(function () {
        Route::get('/all-project-view', 'AllProjectView');
        Route::get('/all-project-view/{uid}', 'AllProjectView');
        Route::post('/feature_status', 'FeaturedStatus')->name('projectfeatured.status');
        Route::post('/top_status', 'TopStatus')->name('TopStatus');
        Route::post('/delete', 'Propertydelete')->name('project.delete');
        Route::post('/statusupdate', 'PropStatusupdate')->name('project.status.update');
        Route::post('/save/amenities', 'addAmenities')->name('save.amenities');
        Route::get('/get/amenities', 'getAmenities')->name('get.amenities');
        Route::post('/save/towers', 'addTowers')->name('save.towers');
        Route::get('/get/towers', 'getTowers')->name('get.towers');
    });

    Route::prefix('activity')->controller(UserSearchActivityController::class)->group(function () {
        Route::get('/activity-list', 'ActivityListView');
    });

    Route::prefix('project')->controller(ProjectController::class)->group(function () {
        Route::get('/add_project', 'ProjectAdd')->name('project.add');
        Route::get('/edit/{project_id}', 'ProjectEdit')->name('project.edit');
        Route::post('store_project_image', 'ProjectImageStore')->name('project.image');
        Route::post('savedata', 'saveProjectData')->name('project.saveProjectData');
        Route::post('edit-project', 'editProjectData')->name('project.editproject');
        Route::get('load-modal', 'loadModalPage')->name('project.modal');
    });
    Route::prefix('project')->controller(ProjectEditController::class)->group(function () {
        Route::post('update-project', 'editProjectData')->name('project.updateProjectData');
    });
    Route::get('floor_plan', [FloorPlanController::class, 'view']);
    Route::post('add_floor_plan', [FloorPlanController::class, 'addFloorPlan']);
    Route::get('get_floor_plan/{id}', [FloorPlanController::class, 'getFloorPlan']);
    Route::post('update_floor_plan_status', [FloorPlanController::class, 'updateStatus'])->name('update.floor.plan.status');
    Route::post('/delete_floor_plan', [FloorPlanController::class, 'floorPlanDelete'])->name('floor.delete');

    /*
|--------------------------------------------------------------------------
| POST PROPERTY ROUTES
|--------------------------------------------------------------------------
| These routes handle the Notification Template management.
| Created By: Soumyadip
| Created Date: 2024-11-28
|--------------------------------------------------------------------------
*/

    Route::controller(PostPropertyController::class)->group(function () {
        Route::get('post-property', 'postPropertyView');
        Route::post('property/store_property_image', 'PropertyImageStore');
        Route::post('property/post-property', 'PropertyPost');
        Route::post('property/save-property', 'saveProperty');
        Route::get('property/edit/{propId}', 'EditProperty');
        Route::get('property/edit-photos/{propId}', 'EditPropertyPhotos');
        Route::get('property/load_ajax_page', 'load_ajax_page');
        Route::post('property/save-edit-property/{type}', 'saveEditProperty');
        Route::post('property/save-property-photos/{property_id}', 'saveEditPropertyPhotos');
    });

    Route::controller(EnquiryController::class)->group(function () {
        Route::get('/enquiry/list/{id?}', 'list')->name('enquiry.list');
        Route::get('/enquiry/assign-list/{id?}', 'unassign_list')->name('enquiry.unassignlist');
        Route::get('/enquiry/assign-list/assigned/{id?}', 'assigned_list')->name('enquiry.assignedlist');
        Route::post('/enquiry/save-assign-list', 'save_assign_list')->name('enquiry.saveassign');
        Route::post('/enquiry/remove-assign-list', 'remove_assign_list')->name('enquiry.removeassign');
        Route::get('/enquiry/details/{id}/{type}', 'enquery_details')->name('enquiry.enquerydetails');
        Route::get('/enquiry/property-leads/{property_id}', 'property_leads')->name('enquiry.propertyLeads');
        Route::get('/enquiry/project-leads/{project_id}', 'project_leads');
        Route::get('/enquiry/member-leads', 'member_leads');
        // General Leads
        Route::get('/enquiry/general-leads', 'general_leads');
        Route::get('/enquiry/general-assign-list/{id?}', 'general_unassign_list');
        Route::get('/enquiry/general-assign-list/assigned/{id?}', 'general_assigned_list');
        Route::post('/enquiry/general-save-assign-list', 'general_save_assign_list');
    });


    Route::controller(AdvertisementPackagesController::class)->group(function () {
        Route::get('ads-packages/list', 'list');
        Route::get('ads-packages/ajax_page', 'load_ajax_page');
        Route::get('ads-packages/options', 'get_option_value');
        Route::post('ads-packages/edit', 'edit');
        Route::post('ads-packages/uplaod_file', 'upload_file');
        Route::post('ads-packages/change-status', 'change_status');
    });

    Route::controller(AdvertisementController::class)->group(function () {
        Route::get('advertisement/ads_list', 'ads_list');
        Route::get('advertisement/ajax_page', 'load_ajax_page');
        Route::get('advertisement/options', 'get_option_value');
        Route::post('advertisement/add', 'add');
        Route::post('advertisement/edit', 'edit');
        Route::post('advertisement/delete', 'delete');
        Route::post('advertisement/change-status', 'change_status');
    });

    Route::prefix('membership')->controller(MembershipPlanController::class)->group(function () {
        Route::get('plan', 'index')->name('plan.index');
        Route::post('plan/add', 'store')->name('plan.store');
        Route::get('plan/edit/{id}', 'edit')->name('plan.edit');
        Route::post('plan/update', 'update')->name('plan.update');
        Route::delete('plan/delete', 'destroy')->name('plan.destroy');
        Route::post('plan/status', 'status')->name('plan.status');
    });

    Route::prefix('membership')->controller(MembershipFeaturesController::class)->group(function () {
        Route::get('type_plan', 'index')->name('plan_type.index');
        Route::get('plan_type/edit/{id}', 'edit')->name('plan_type.edit');
        Route::post('plan_type/update', 'update')->name('plan_type.update');
        Route::delete('plan_type/delete', 'destroy')->name('plan_type.destroy');
        Route::post('plan_type/status', 'status')->name('plan_type.status');
    });
    Route::prefix('transaction')->controller(TransactionController::class)->group(function () {
        Route::get('transaction_list', 'index')->name('transaction.index');
    });
    Route::post('upload/floor-plan', [ProjectImageUploade::class, 'uploadFloorPlan'])->name('upload.floor.plan');
    Route::post('delete/floor-plan-image', [ProjectImageUploade::class, 'destroyFloorPlanImage']);

    Route::controller(FloorPlaningController::class)->group(function () {

        Route::get('get_floor_plan_type', 'floorPlan')->name('floor.plan.type');
        Route::post('save_floor_data', 'addFloorPlan')->name('floor.addFloorPlan');
    });

    Route::prefix('bank/loan')
        ->controller(BankLoanController::class)
        ->name('bank.loan.')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('save', 'store')->name('store');
            Route::post('upload', 'upload')->name('upload');
            Route::get('edit/{id}', 'edit')->name('edit');
            Route::post('status', 'status')->name('status');
            Route::post('delete', 'destroy')->name('delete');
        });
});

Route::get('/artisan-run', function () {
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('cache:clear');
    Artisan::call('config:cache');

    return response()->json(['message' => 'Cache cleared and config cached successfully']);
});
