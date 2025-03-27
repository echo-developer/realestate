<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdvertisementPackages;
use Illuminate\Support\Facades\DB;

class AdvertisementPackagesController extends Controller
{
    protected $package;
    public function __construct(AdvertisementPackages $package)
    {
        $this->package = $package;
        $this->middleware('view_permit:ads-packages');
    }

    public function list(Request $request)
    {
        $add_command = 'add';
		$edit_command = 'edit';
		$add_btn = 'Add Advertisement Package';
        $srch = $request->query();
        $paginate = 10;
        $main_title = 'Ads Packages Management';
		$second_title = 'All Packages';
		$title = 'Packages List';
        $pages = $this->package->get_pages();
        $list = $this->package->get_list($srch, $paginate);
       
        return view('Admin.Advertisement_package.package_list', 
        compact(
            'main_title',
            'second_title',
            'title',
            'list',
            'add_command',
            'edit_command',
            'add_btn',
            'pages'
        ));
    }

    public function add(Request $request)
    {
        // $validatedData = $request->validate([
        //     'package_name.*' => 'required|string|max:155',
        //     'page' => 'required',
        //     'position' => 'required',
        //     'ad_size' => 'required',
        //     'duration' => 'required|numeric',
        //     'price' => 'required|numeric',
        //     'creative' => 'required',
        //     'status' => 'required'
        // ]);
        
        $postData = $request->all();
        $adsData = $this->package->addRecord($postData);
        
        return response()->json([
            'status' => 'OK',
            'message' => 'Ad Package saved successfully!',
        ]);

    }

    public function edit(Request $request)
    {
        // $validatedData = $request->validate([
        //     'package_name.*' => 'required|string|max:155',
        //     'page' => 'required',
        //     'position' => 'required',
        //     'ad_size' => 'required',
        //     'duration' => 'required|numeric',
        //     'price' => 'required|numeric',
        //     'creative' => 'required',
        //     'status' => 'required'
        // ]);
        
        $postData = $request->all();
        $id = $postData['ID'];
        unset($postData['ID']);
        $adsData = $this->package->editRecord($postData, $id);
        
        return response()->json([
            'status' => 'OK',
            'message' => 'Ad Package saved successfully!',
        ]);

    }

    public function load_ajax_page(Request $request)
    {
        $srch = $request->query();
        $page = $srch['page'];
        $pages = '';
        $positions = array();
		$sizes = array();
        $ID = "";
        if($page == 'add'){
			$pages = $this->package->get_pages();
			$title = 'Add Advertisement Package';
			$form_action = url('ads-packages/add');
		}elseif($page == 'edit')
        {
            $id = $srch['id'];
			$ID = $id;
			$form_action = url('ads-packages/edit');
			$detail = $this->package->getDetail($id);
            // echo "<pre>";
            // print_r($detail);
			$title = 'Edit Advertisement';
			$pages = $this->package->get_pages();
			if(!empty($detail['page'])){
				$positions = $this->package->get_position($detail['page']);
				if(!empty($detail['position'])){
					$sizes = $this->package->get_size($detail['page'], $detail['position']);
				}
			}
            // echo "<pre>";
            // print_r($pages);exit;
        }

        return view('Admin.Advertisement_package.ajax_page', compact('page', 'title', 'form_action','pages','positions', 'sizes', 'ID', 'detail'));
    }

    public function get_option_value(Request $request){
        $get = $request->query();
		$option = $get['option'];
		if($option == 'page_position'){
			$page = $get['page'];
			$positions = $this->package->get_position($page);
			if($positions){
				echo '<option value="">-Select-</option>';
				print_select_option($positions, 'name', 'name');
			}
		}else if($option == 'ad_size'){
			$page = $get['page'];
			$position = $get['position'];
			$sizes = $this->package->get_size($page, $position);
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
            'id' => $req->id,
            'status' => $req->status
        ];

        $response = $this->package->changeStatus($data);
        return response()->json($response);
    }

}
