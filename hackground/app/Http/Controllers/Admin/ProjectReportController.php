<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectReports;
use App\Models\Prefproject;
use Illuminate\Http\Request;

class ProjectReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:project-reports');
    }

    public function index(Request $req)
    {
        $paginate = $req->input('paginate', 15);
        $projectReports = ProjectReports::whereNot('status', config('constants.STATUS_DELETE'))
            ->orderByDesc('created_at')
            ->paginate($paginate);

        return view('Admin.Reports.Project.index', compact('projectReports'));
    }

    public function changeStatus(Request $req)
    {
        if (!empty($req->id)) {
            ProjectReports::where('id', $req->id)->update(['status' => $req->status]);
            return response()->json(['status' => true]);
        }
    }

    public function deleteReport(Request $req)
    {
        if (!empty($req->id)) {
            ProjectReports::where('id', $req->id)->update(['status' => config('constants.STATUS_DELETE')]);
            set_flash_message('delete');
            return response()->json(['status' => true]);
        }
    }
}
