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
        $paginate = 10;
        // $lang = strtolower($request->input('lang', 'en'));
        $term = $request->input('term');
        $data = $this->allpropertymodel->getallProperties($term,$paginate);
        Log::info("DB in controller:\n" . json_encode($data, JSON_PRETTY_PRINT));
        return view('Admin.All_Property.all-properties', compact('data'));
    }
}
