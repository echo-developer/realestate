<?php

namespace App\Http\Controllers\Admin;

use App\Models\Enquiry;
use App\Models\PrefProperty;
use App\Models\PrefProject;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class EnquiryController extends Controller
{
    protected $enquiry;
    public function __construct(Enquiry $enquiry)
    {
        $this->enquiry = $enquiry;
        $this->middleware('view_permit:all-leads');
    }

    public function list(Request $request)
    {
        $srch = $request->query();
        $paginate = 10;
        $main_title = 'Leads Management';
		$second_title = 'All Leads';
		$title = 'Leads List';
        $list = $this->enquiry->get_list($srch, $paginate);
        return view('Admin.Enquiry.enquiry_list', compact('main_title','second_title','title','list'));
    }

    public function property_leads(Request $request)
    {
        $property_id = $request->segment(3);
        $srch = $request->query();
        $property = PrefProperty::where('id',$property_id)->first();
        if($property)
        {
            $paginate = 10;
            $main_title = 'Leads List';
            $second_title = 'All Property List';
            $title = 'Property List';
            $srch['property_id'] = $property_id;
            $list = $this->enquiry->property_enquiry_list($srch, $paginate);
            return view('Admin.Enquiry.property_enquiry_list', compact('main_title','second_title','title','list'));
        }
    }

    public function project_leads(Request $request)
    {
        $project_id = $request->segment(3);
        $srch = $request->query();
        $project = PrefProject::where('id',$project_id)->first();
        if($project)
        {
            $paginate = 10;
            $main_title = 'Leads List';
            $second_title = 'All Project List';
            $title = 'Project Leads List';
            $srch['project_id'] = $project_id;
            $list = $this->enquiry->project_enquiry_list($srch, $paginate);
            return view('Admin.Enquiry.property_enquiry_list', compact('main_title','second_title','title','list'));
        }
    }

    public function member_leads(Request $request)
    {
        $srch = $request->query();
        $user_id = $srch['user_id'];
        if($user_id)
        {
            $paginate = 10;
            $main_title = 'Leads List';
            $second_title = 'Member Leads List';
            $title = 'Member Leads List';
            $list = $this->enquiry->member_enquiry_list($srch, $paginate);
            return view('Admin.Enquiry.member_enquiry_list', compact('main_title','second_title','title','list'));
        }
    }

    public function enquery_details($enquiry_id)
    {
        $enquiry = $this->enquiry->enquiry_details($enquiry_id);
        return view('Admin.Enquiry.ajax-enquiry-details', compact('enquiry'));
    }

    public function unassign_list($enquiry_id)
    {
        $srch = array();
        $assign_type = "unassigned";
        $paginate = 10;
        $main_title = 'Assign Project/Property to Member(s)';
		$second_title = 'Assign Member(s)';
		$title = 'Assign Member List';

        $enquiry = $this->enquiry->enquiry_details($enquiry_id);
        $srch['enquery_id'] = $enquiry_id;
        if($enquiry->property_id)
        {
            $property_id = $enquiry->property_id;
            $propertyTable = PrefProperty::where('id',$property_id)->with(['settings','location'])->first();
            $srch['city'] = $propertyTable['location']->city;
            $srch['property_type_for'] = $propertyTable['settings']->property_type_for;
            $srch['property_type'] = $propertyTable['settings']->property_type;
            $srch['post_for'] = $propertyTable['settings']->post_for;
            $srch['enquiry_type'] = 'property';
        }elseif($enquiry->project_id)
        {
            $project_id = $enquiry->project_id;
            $projectTable = PrefProject::where('id',$project_id)->with(['settings','location'])->first();
            $srch['city'] = $projectTable['location']->city;
            $srch['post_for'] = $projectTable['settings']->post_for;
            $srch['project_type'] = $projectTable['settings']->project_type;
            $srch['enquiry_type'] = 'project';
        }
        
        $list = $this->enquiry->get_unassign_member_list($srch, $paginate);
        return view('Admin.Enquiry.assign_member_list', compact('main_title','second_title','title','list','enquiry','assign_type'));
    }

    public function assigned_list($enquiry_id)
    {
        $srch = array();
        $assign_type = "assigned";
        $paginate = 10;
        $main_title = 'Assigned Project/Property';
		$second_title = 'Assigned Member(s)';
		$title = 'Assign Member List';
        $enquiry = $this->enquiry->enquiry_details($enquiry_id);
        $srch['enquery_id'] = $enquiry_id;
        $list = $this->enquiry->get_assigned_member_list($srch, $paginate);
        return view('Admin.Enquiry.assign_member_list', compact('main_title','second_title','title','list','enquiry','assign_type'));
    }

    public function save_assign_list(Request $request)
    {
        $msg = array();
        $enquery_id = $request->enquery_id;
        $selected_users = $request->userid;
        $data = array();
        $users = array();
        if($selected_users)
        {
            foreach($selected_users as $uid)
            {
                $users['user_id'] = $uid;
                $users['enquery_id'] = $enquery_id;
                $data[] = $users;
            }
        }
        $ins = $this->enquiry->save_assign_member($data);
        $msg['status'] = 'OK';
        echo json_encode($msg); 
    }

    public function remove_assign_list(Request $request)
    {
        $msg = array();
        $assign_id = $request->assign_id;
        if($assign_id)
        {
            $query = DB::table('leads_assigned as l_a')->where('l_a.assign_id',$assign_id)->delete();;
        }
        $msg['status'] = 'OK';
        echo json_encode($msg); 
    }

}
