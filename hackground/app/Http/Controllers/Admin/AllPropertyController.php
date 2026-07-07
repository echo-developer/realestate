<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AllPropertyModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AllPropertyController extends Controller
{
    protected $allpropertymodel;

    public function __construct(AllPropertyModel $allpropertymodel)
    {
        $this->allpropertymodel = $allpropertymodel;
        $this->middleware('view_permit:all-properties');
    }

    public function AllPropertyView(Request $request)
    {

        $user_id = $request->route('id');
        $srch = $request->query();
        $srch['user_id'] = $user_id;

        if (!empty($request->input('slug')) && !empty($request->input('id'))) {
            $property_slug = $request->input('slug') . '&id=' . $request->input('id');
            $srch['prop_slug'] = $property_slug;
        }
        $paginate = 10;
        $statusMapping = config('property_status.status');
        //$srch['term'] = $request->input('term');
        $data = $this->allpropertymodel->getallProperties($srch, $paginate);

        $base = DB::table('properties')->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'));

        $counts = (clone $base)->selectRaw("
            COUNT(*) as total,
            SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive
        ")->first();

        $lastMonth = (clone $base)->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->selectRaw("
                COUNT(*) as total,
                SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as inactive
            ")->first();

        $calcChange = function($current, $previous) {
            if ($previous == 0) return $current > 0 ? 100 : 0;
            return round((($current - $previous) / $previous) * 100, 1);
        };

        $changes = [
            'total'    => $calcChange($counts->total,   $lastMonth->total),
            'active'   => $calcChange($counts->active,  $lastMonth->active),
            'pending'  => $calcChange($counts->pending, $lastMonth->pending),
            'inactive' => $calcChange($counts->inactive,$lastMonth->inactive),
        ];

        return view('Admin.All_Property.all-properties', compact('data', 'statusMapping', 'srch', 'user_id', 'counts', 'changes'));
    }

    public function FeaturedStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->allpropertymodel->PropertyFeatureStatus($data);
        return response()->json($response);
    }

    public function Propertydelete(Request $req)
    {
        $response = $this->allpropertymodel->PropertyDelete($req->propertyId);
        return response()->json($response);
    }

    public function PropStatusupdate(Request $req)
    {

        $status = $req->status;

        $statusMapping = config('property_status.status');
        $statusKey = array_search($status, $statusMapping);

        $data = [
            'id' => $req->propertyId,
            'status' => $statusKey,
        ];

        $response = $this->allpropertymodel->PropertyStatus($data);
        return response()->json($response);
    }

    public function TopStatus(Request $req)
    {
        $data = [
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->allpropertymodel->PropertyTopStatus($data);
        return response()->json($response);
    }
}
