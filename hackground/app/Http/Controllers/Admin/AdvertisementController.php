<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advertisement;

class AdvertisementController extends Controller
{
    protected $advertisement;

    public function __construct(Advertisement $advertisement)
    {
        $this->advertisement = $advertisement;
        $this->middleware('view_permit:ads-list');
    }

    public function ads_list(Request $request)
    {
        $add_command = 'add';
		$edit_command = 'edit';
		$add_btn = 'Add Advertisement';
        $srch = $request->query();
        $paginate = 10;
        $main_title = 'Advertisement Management';
		$second_title = 'All Advertisements';
		$title = 'Advertisements List';
        $list = '';
        $pages = $this->advertisement->get_pages();
        $list = $this->advertisement->get_list($srch, $paginate);
        // echo "<pre>";
        // print_r($list);exit;
        return view('Admin.Advertisement.ads_list', 
        compact(
            'main_title',
            'second_title',
            'title',
            'list',
            'add_command',
            'edit_command',
            'add_btn',
            'pages',
        ));
    }

    public function load_ajax_page(Request $request)
    {
        $srch = $request->query();
        $page = $srch['page'];
        $pages = '';
        $positions = array();
		$sizes = array();
        $ID = "";
        $detail = "";
        $city = get_all_city();
        $property_category = get_all_property_category();
        if($page == 'add'){
			$pages = $this->advertisement->get_pages();
			$title = 'Add Advertisement';
			$form_action = url('advertisement/add');
		}elseif($page == 'edit')
        {
            $id = $srch['id'];
			$ID = $id;
			$form_action = url('advertisement/edit');
			$detail = $this->advertisement->getDetail($id);
            if($detail)
            {
                $detail['ad_locations'] = $this->advertisement->getAdLocations($detail['advertisement_id']);
                $detail['ad_cats'] = $this->advertisement->getAdCategory($detail['advertisement_id']);
            }
			$title = 'Edit Advertisement';
			$pages = $this->advertisement->get_pages();
			if(!empty($detail['page'])){
				$positions = $this->advertisement->get_position($detail['page']);
				if(!empty($detail['position'])){
					$sizes = $this->advertisement->get_size($detail['page'], $detail['position']);
				}
			}
        }

        return view('Admin.Advertisement.ajax_page', compact('page', 'title', 'form_action','pages','positions', 'sizes', 'ID', 'detail', 'city','property_category'));
    }

    public function add(Request $request)
    {
        $msg = array();
        $postData = $request->all();
        $ins_id = $this->advertisement->addRecord($postData);
        if($ins_id)
        {
            $msg['status'] = 'OK';
            $msg['message'] = 'Advertisement added successfully !';
        }else{
            $msg['status'] = 'FAIL';
            $msg['message'] = 'Failed to add Advertisement !';
        }
        echo json_encode($msg);
    }

    public function edit(Request $request)
    {
        $msg = array();
        $postData = $request->all();
        $id = $postData['ID'];
        $ins_id = $this->advertisement->editRecord($postData,$id);
        if($ins_id)
        {
            $msg['status'] = 'OK';
            $msg['message'] = 'Advertisement updated successfully !';
        }else{
            $msg['status'] = 'FAIL';
            $msg['message'] = 'Failed to update Advertisement !';
        }
        echo json_encode($msg);
    }

    public function get_option_value(Request $request){
        $get = $request->query();
		$option = $get['option'];
		if($option == 'page_position'){
			$page = $get['page'];
			$positions = $this->advertisement->get_position($page);
			if($positions){
				echo '<option value="">-Select-</option>';
				print_select_option($positions, 'name', 'name');
			}
		}else if($option == 'ad_size'){
			$page = $get['page'];
			$position = $get['position'];
			$sizes = $this->advertisement->get_size($page, $position);
			if($sizes){
				echo '<option value="">-Select-</option>';
				foreach($sizes as $size){
					echo "<option value=\"$size\">$size</option>";
				}
			}
		}
	}

    public function upload_file(Request $req)
    {
        $req->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($req->hasFile('file')) {
            $file = $req->file('file');
            $fileName = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('user_upload/advertisement'), $fileName);

            $file_path = asset('user_upload/advertisement/'.$fileName);
            return response()->json(['status'=>'OK', 'file_name' => $fileName,'file_path'=>$file_path]);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function change_status(Request $req)
    {
        $data = [
            'advertisement_id' => $req->id,
            'status' => $req->status
        ];
        $response = $this->advertisement->changeStatus($data);
        return response()->json($response);
    }

    public function delete(Request $req)
    {
        $response = $this->advertisement->delete($req->id);
        set_flash_message('delete');
        return response()->json($response);
    }

}
