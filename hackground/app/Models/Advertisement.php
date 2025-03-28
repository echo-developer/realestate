<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Advertisement extends Model
{
    use HasFactory;

	protected $primary_key = 'advertisement_id';
    protected $table = 'advertisements';
	// protected $lang_table = 'advertisement_packages_names';

    protected $fillable = [
        'advertisement_id',
        'request_id',
        'package_id',
        'member_id',
        'page',
        'position',
        'ad_code',
        'ad_url',
        'ad_size',
        'ad_type',
        'ad_image',
        'ad_image_mobile',
        'start_date',
        'expire_date',
        'status'
    ];

    public function get_list($srch=array(),$paginate)
    {
        $query = DB::table('advertisements as a')->select('a.*');
        $query->orderBy('a.advertisement_id', 'desc');
        return $query->paginate($paginate);
    }

    public function addRecord($data)
    {
        $ins_data = array(
			'page' => $data['page'] ? $data['page'] : '',
			'position' => $data['position'] ? $data['position'] : '',
			'ad_size' => $data['ad_size'] ? $data['ad_size'] : '',
            'ad_type' => $data['ad_type'] ? $data['ad_type'] : '',
			'ad_image' => $data['ad_image'] ? $data['ad_image'] : '',
			'ad_image_mobile' => $data['ad_image_mobile'] ? $data['ad_image_mobile'] : '',
			'ad_code' => $data['ad_code'] ? $data['ad_code'] : '',
			'ad_url' => $data['ad_url'] ? $data['ad_url'] : '',
			'status' => $data['status'] ? $data['status'] : ''
		);
        // echo "<pre>";
        // print_r($ins_data);exit;
        $cities = !empty($data['city']) ? $data['city'] : array();
        $categories = !empty($data['category']) ? $data['category'] : array();
        $insert_id = DB::table($this->table)->insert($ins_data);
        if($insert_id)
        {
            if($cities)
            {
                $loc_table = "advertisement_locations";
                DB::table($loc_table)->where($this->primary_key, $insert_id)->delete();
                $city_arr = array();
                foreach($cities as $city)
                {
					$city_arr[] = array(
						'advertisement_id' => $insert_id,
						'city_id' => $city
					);
                }
                DB::table($loc_table)->insert($city_arr);
            }else{
                $loc_table = "advertisement_locations";
                DB::table($loc_table)->where($this->primary_key, $insert_id)->delete();
            }

            if($categories)
            {
                $cat_table = "advertisement_category";
                DB::table($cat_table)->where($this->primary_key, $insert_id)->delete();
                $cat_arr = array();
                foreach($categories as $cat)
                {
					$cat_arr[] = array(
						'advertisement_id' => $insert_id,
						'property_category' => $cat
					);
                }
                DB::table($cat_table)->insert($cat_arr);
            }else{
                $cat_table = "advertisement_category";
                DB::table($cat_table)->where($this->primary_key, $insert_id)->delete();
            }
        }
        
        return $insert_id;

    }

    public function editRecord($data,$id)
    {
        $ins_data = array(
			'page' => $data['page'] ? $data['page'] : '',
			'position' => $data['position'] ? $data['position'] : '',
			'ad_size' => $data['ad_size'] ? $data['ad_size'] : '',
            'ad_type' => $data['ad_type'] ? $data['ad_type'] : '',
			'ad_image' => $data['ad_image'] ? $data['ad_image'] : '',
			'ad_image_mobile' => $data['ad_image_mobile'] ? $data['ad_image_mobile'] : '',
			'ad_code' => $data['ad_code'] ? $data['ad_code'] : '',
			'ad_url' => $data['ad_url'] ? $data['ad_url'] : '',
			'status' => $data['status'] ? $data['status'] : ''
		);

        $cities = !empty($data['city']) ? $data['city'] : array();
        $categories = !empty($data['category']) ? $data['category'] : array();
        $up = DB::table($this->table)->where($this->primary_key, $id)->update($ins_data);

        if($cities)
        {
            $loc_table = "advertisement_locations";
            DB::table($loc_table)->where($this->primary_key, $id)->delete();
            $city_arr = array();
            foreach($cities as $city)
            {
                $city_arr[] = array(
					'advertisement_id' => $id,
					'city_id' => $city
				);
            }
            DB::table($loc_table)->insert($city_arr);
        }else{
            $loc_table = "advertisement_locations";
            DB::table($loc_table)->where($this->primary_key, $id)->delete();
        }

        if($categories)
        {
            $cat_table = "advertisement_category";
            DB::table($cat_table)->where($this->primary_key, $id)->delete();
            $cat_arr = array();
            foreach($categories as $cat)
            {
                $cat_arr[] = array(
					'advertisement_id' => $id,
					'property_category' => $cat
				);
            }
            DB::table($cat_table)->insert($cat_arr);
        }else{
            $cat_table = "advertisement_category";
            DB::table($cat_table)->where($this->primary_key, $id)->delete();
        }

        return true;

    }


    public function getDetail($id=''){
		$result_obj = DB::table($this->table)->where('advertisement_id',$id)->first();
		$result = json_decode(json_encode($result_obj), true);
		return $result;
	}

    public function getAdLocations($id){
		$result_obj = DB::table('advertisement_locations')->select('city_id')->where('advertisement_id',$id)->get();
		$result = json_decode(json_encode($result_obj), true);
		$city = [];
        if($result)
        {
            foreach($result as $k=>$c)
            {
                $city[$k] = $c['city_id'];
            }
        }
		return $city;
	}

    public function getAdCategory($id){
		$result_obj = DB::table('advertisement_category')->select('property_category')->where('advertisement_id',$id)->get();
		$result = json_decode(json_encode($result_obj), true);
        $cats = [];
        if($result)
        {
            foreach($result as $k=>$r)
            {
                $cats[$k] = $r['property_category'];
            }
        }
		return $cats;
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

	public function changeStatus($data)
    {
        DB::table($this->table)
            ->where('advertisement_id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Status updated successfully.',
        ];
    }

}
