<?php

namespace App\Http\Controllers\Admin;

use App\Models\Enquiry;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
        return view('Admin.Enquiry.list', compact('main_title','second_title','title','list'));
    }

}
