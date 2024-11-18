<?php

use App\Http\Controllers\Admin\_Menu_Controller;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\ResetPasswordController;
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
        // Route::post('/addnewUser', 'add_newUser')->name('add_newUser');
        // Route::get('/showSingleUser/{id}', 'showSingleUser')->name('showSingleUser');
        // Route::post('/userupdate', 'userupdate')->name('userupdate');
        Route::post('/noti_stausUp', 'notification_stausUpdate')->name('notification.stausUpdate');
        Route::post('/deleteNotification/{id}', 'deleteNotification')->name('deleteNotification');
    });
});
