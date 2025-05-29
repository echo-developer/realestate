<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AllPropertyModel;
use Illuminate\Http\Request;
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
        return view('Admin.All_Property.all-properties', compact('data', 'statusMapping', 'srch', 'user_id'));
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
