<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserSearchActivity;
use Illuminate\Http\Request;

class UserSearchActivityController extends Controller
{
    protected $searchActivityModel;

    public function __construct(UserSearchActivity $searchActivityModel)
    {
        $this->searchActivityModel = $searchActivityModel;
        $this->middleware('view_permit:activity');
    }

    public function ActivityListView($user_id = '')
    {
        $paginate = 10;
        $data = $this->searchActivityModel->getActivityList($paginate);
        return view("Admin.Activity.userSearchActivity", compact('data'));
    }

    public function deleteActivity(Request $request)
    {
        $id = $request->id;
        UserSearchActivity::where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Activity record deleted successfully.']);
    }
}
