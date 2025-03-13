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
        $data = $this->enquiry->get_list($srch, $paginate);
        echo "<pre>";
        print_r($data);exit;
        return view('Admin.Enquiry.list', compact('data'));
    }

}
