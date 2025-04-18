<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\UserFeedbackModel;
use App\Http\Controllers\Controller;

class FeedbackController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:user-feedback');
    }
    public function getFeedbackList()
    {


        $data = UserFeedbackModel::select('id', 'name', 'email', 'phone', 'feedback')->get();

        return view('Admin.user_feedback', compact('data'));
    }
}
