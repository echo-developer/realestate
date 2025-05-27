<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PropertyReports;
use Illuminate\Http\Request;

class PropertyReportsController extends Controller
{
    public function __construct()
    {
        $this->middleware('view_permit:property-reports');
    }

    public function index(Request $req)
    {
        $paginate = $req->input('paginate', 15);
        $propertyReports = PropertyReports::whereNot('status', config('constants.STATUS_DELETE'))
            ->orderByDesc('created_at')
            ->paginate($paginate);

        return view('Admin.Reports.Property.index', compact('propertyReports'));
    }

    public function changeStatus(Request $req)
    {
        if (!empty($req->id)) {
            PropertyReports::where('id', $req->id)->update(['status' => $req->status]);
            return response()->json(['status' => true]);
        }
    }

    public function deleteReport(Request $req)
    {
        if (!empty($req->id)) {
            PropertyReports::where('id', $req->id)->update(['status' => config('constants.STATUS_DELETE')]);
            set_flash_message('delete');
            return response()->json(['status' => true]);
        }
    }
}
