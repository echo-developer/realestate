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
        $list = $this->package->get_list($srch, $paginate);
        // echo "<pre>";
        // print_r($list);exit;
        return view('Admin.Advertisement.package_list', 
        compact(
            'main_title',
            'second_title',
            'title',
            'list',
            'add_command',
            'edit_command',
            'add_btn'
        ));
    }

    public function add(Request $request)
    {
        // $langs = array_keys($req->input('name', []));

        // $rules = [
        //     'order' => 'required|integer',
        //     'status' => 'required|boolean',
        //     'image' => 'nullable|string',
        //     'id' => 'nullable|integer',
        // ];

        // foreach ($langs as $lang) {
        //     $rules["name.$lang"] = 'required|string|max:255';
        //     $rules["subname.$lang"] = 'required|string|max:255';
        //     $rules["description.$lang"] = 'required|string|max:255';
        // }
        // $messages = [
        //     'order.required' => 'The Order field is required.',
        //     'status.required' => 'The Status field is required.',
        //     'id.required' => 'The ID field is required.',
        // ];

        // foreach ($langs as $lang) {
        //     $messages["name.$lang.required"] = "The Name ($lang) field is required.";
        //     $messages["subname.$lang.required"] = "The Sub Name ($lang) field is required.";
        //     $messages["description.$lang.required"] = "The Description ($lang) field is required.";
        // }

        // $validated = $req->validate($rules, $messages);
        echo 'ok';exit;
        $this->package->addRecord();

    }

    public function load_ajax_page(Request $request)
    {
        $srch = $request->query();
        $page = $srch['page'];
        if($page == 'add'){
			$pages = $this->package->get_pages();
			$title = 'Add Advertisement Package';
			$form_action = url('ads-packages/add');
		}

        return view('Admin.Advertisement.ajax_page', compact('page', 'pages', 'title', 'form_action'));
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

    public function upload_file(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        $uploadedImages = [];
        $type = $request->input('type', 'other'); // Default to 'other' if no type is provided
        
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $filePath = 'user_upload/advertisement/';
                $file->move(public_path($filePath), $filename);

                // Store uploaded image under the respective type
                $uploadedImages[] = [
                    'imageUrl' => asset($filePath . $filename),
                    'filename' => $filename
                ];
            }
        }
        if (empty($uploadedImages)) {
            return response()->json([
                'success' => false,
                'type' => $type,
                'images' => []
            ]);
        }

        return response()->json([
            'success' => true,
            'type' => $type, // Return the active tab key
            'images' => $uploadedImages
        ]);
    }

}
