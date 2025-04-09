<?php

namespace App\Http\Controllers\Admin;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:notification');
    }
    public function Admin_notifiaction_Page()
    {
        $peginate = 10;
        $notifications = Notification::where('read_status', '!=', config('constants.STATUS_DELETE'))->paginate($peginate);
        return view('Admin.Notification.index')->with(compact('notifications'));
    }

    public function notification_stausUpdate(Request $req)
    {

        $status_chng = Notification::where('id', $req->notification_Id)->update(['read_status' => $req->status]);
        return response()->json($status_chng);
    }

    public function deleteNotification(Request $req, $id)
    {

        $noti_delete = Notification::where('id', $id)->update(['read_status' => $req->status]);
        return response()->json($noti_delete);
    }
}
