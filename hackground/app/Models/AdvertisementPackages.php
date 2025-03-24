<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AdvertisementPackages extends Model
{
    use HasFactory;
    // protected $table = 'advertisement_packages';

    // protected $fillable = [
    //     'package_id',
    //     'page',
    //     'position',
    //     'size',
    //     'demo_image',
    //     'demo_image_mobile',
    //     'creative',
    //     'duration',
    //     'inr_price',
    //     'usd_price',
    //     'inr_price_without_banner',
    //     'usd_price_without_banner',
    //     'status'
    // ];

    public function get_list($srch=array(),$paginate)
    {
        $query = DB::table('advertisement_packages as p')
                    ->leftJoin('advertisement_packages_names as p_n', 'p.package_id', '=', 'p_n.package_id')
                    ->select('p.*','p_n.package_name','p_n.package_lang');
        
        $query->groupBy('p.package_id');
        // if(!empty($srch['lead_for']) && $srch['lead_for'] == 'project') {
        //     $query->where('e.project_id', '!=' ,'');
        // }
        // if(!empty($srch['lead_for']) && $srch['lead_for'] == 'property') {
        //     $query->where('e.property_id', '!=' ,'');
        // }
        // if(!empty($srch['enquery_date'])) {
        //     $query->whereDate('e.created_at',date('Y-m-d',strtotime($srch['enquery_date'])));
        // }
        // if(!empty($srch['member_name'])) {
        //     $query->where('u.name', 'LIKE', '%'.$srch['member_name'].'%');
        // }
        // if(!empty($srch['user_id'])) {
        //     $query->where('u.id', $srch['user_id']);
        // }
        // $query->orderBy('e.enquery_id', 'desc');
        
        return $query->paginate($paginate);
    }

    public function _adAttributes(){
		$attr = array(
			'pages' => array(
				array(
					'name' => 'Home Page',
					'slug' => 'home-page',
					'position' => array(
						array(
							'name' => 'header',
							'size' => array(
								'972x252',
								'720x35',
								'820x35',
								'920x35',
								'620x35',
							)
						),
						
						array(
							'name' => 'footer',
							'size' => array(
								'720x35',
								'820x35',
								'920x35',
								'620x35',
							)
						)
						
					)
				),
				
				array(
					'name' => 'Ad List Page',
					'slug' => 'listing-page',
					'position' => array(
						array(
							'name' => 'header',
							'size' => array(
								'720x35',
								'820x35',	
							)
						),
						
						array(
							'name' => 'footer',
							'size' => array(
								'720x35',
								'620x35',
							)
						),
						
						array(
							'name' => 'left',
							'size' => array(
								'300x252',
								'300x600',
								'250x250',
								'100x50',
							)
						),
						
						array(
							'name' => 'right',
							'size' => array(
								'300x252',
								'300x600',
								'250x250',
								'100x50',
							)
						)
						
					)
				),
				
				array(
					'name' => 'Ad Detail Page',
					'slug' => 'detail-page',
					'position' => array(
						array(
							'name' => 'header',
							'size' => array(
								'720x35',
								'820x35',
								'920x35',
								'620x35',
							)
						),
						
						array(
							'name' => 'footer',
							'size' => array(
								'720x35',
								'820x35',
								'920x35',
								'620x35',
							)
						),
						
						array(
							'name' => 'right',
							'size' => array(
								'250x250',
								'100x50',
							)
						)
						
					)
				),
				
			)
		);
		
		return $attr;
	}
	
	public function get_pages(){
		$attr = $this->_adAttributes();
		return $attr['pages'];
	}
	
	public function get_position($page=''){
		$pages = $this->get_pages();
		foreach($pages as $k => $v){
			if($v['slug'] == $page){
				return $v['position'];
			}
		}
		
		return FALSE;
	}
	
	public function get_size($page='', $position=''){
		$all_position = $this->get_position($page);
		foreach($all_position as $k => $v){
			if($v['name'] == $position){
				return $v['size'];
			}
		}
		
		return FALSE;
	}
	
	public function get_page_name($page_slug=''){
		$pages = $this->get_pages();
		foreach($pages as $k => $v){
			if($v['slug'] == $page_slug){
				return $v['name'];
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
                $filePath = 'user_upload/property_images/';
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
