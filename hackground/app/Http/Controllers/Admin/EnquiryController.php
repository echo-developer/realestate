<?php

namespace App\Http\Controllers\Admin;

use App\Models\Enquiry;
use App\Models\PrefProperty;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    protected $enquiry;
    public function __construct(Enquiry $enquiry)
    {
        $this->enquiry = $enquiry;
        $this->middleware('view_permit:all-leads');
    }

    public function list()
    {
        $srch = array();
        $paginate = 10;
        $main_title = 'Leads Management';
		$second_title = 'All Leads';
		$title = 'Leads List';
        $list = $this->enquiry->get_list($srch, $paginate);
        // echo "<pre>";
        // print_r($list);exit;
        return view('Admin.Enquiry.enquiry_list', compact('main_title','second_title','title','list'));
    }

    public function assign_list($enquiry_id)
    {
        $srch = array();
        $paginate = 10;
        $main_title = 'Assign Project/Property to Member(s)';
		$second_title = 'Assign Member(s)';
		$title = 'Assign Member List';
        $enquiry = $this->enquiry->enquiry_details($enquiry_id);
        $property_id = $enquiry->property_id;
        $propertyTable = PrefProperty::where('id',$property_id)->with(['settings','location'])->first();
        $srch['city'] = $propertyTable['location']->city;
        $srch['property_type_for'] = $propertyTable['settings']->property_type_for;
        $srch['property_type'] = $propertyTable['settings']->property_type;
        $srch['post_for'] = $propertyTable['settings']->post_for;
        
        $list = $this->enquiry->get_assign_member_list($srch, $paginate);
        // echo "<pre>";
        // print_r($list);exit;
        return view('Admin.Enquiry.assign_member_list', compact('main_title','second_title','title','list','enquiry'));
    }

}
