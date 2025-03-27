<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AdvertisementPackages extends Model
{
    use HasFactory;
	protected $primary_key = 'package_id';
    protected $table = 'advertisement_packages';
	protected $lang_table = 'advertisement_packages_names';

    protected $fillable = [
        'package_id',
        'page',
        'position',
        'size',
        'demo_image',
        'demo_image_mobile',
        'creative',
        'duration',
        'inr_price',
        'usd_price',
        'inr_price_without_banner',
        'usd_price_without_banner',
        'status'
    ];

	public function addRecord($data)
    {
		$ins_data = array(
			'page' => $data['page'],
			'position' => $data['position'],
			'size' => $data['ad_size'],
			'creative' => $data['creative'],
			'duration' => $data['duration'],
			'price' => $data['price'],
			'price_without_banner' => !empty($data['price_without_banner']) ? $data['price_without_banner'] : '0',
			'demo_image' => $data['demo_image'],
			'demo_image_mobile' => $data['demo_image_mobile'],
			'creative' => $data['creative'],
			'status' => $data['status']
		);
		//print_r($ins_data);exit;
		$insert_id = DB::table($this->table)->insert($ins_data);

		$lang_fields = $data['lang'];

		$this->insert_lang_data($lang_fields, $insert_id); 
		
		return $insert_id;
        
    }

	public function editRecord($data, $id)
    {
		$ins_data = array(
			'page' => $data['page'],
			'position' => $data['position'],
			'size' => $data['ad_size'],
			'creative' => $data['creative'],
			'duration' => $data['duration'],
			'price' => $data['price'],
			'price_without_banner' => !empty($data['price_without_banner']) ? $data['price_without_banner'] : '0',
			'creative' => $data['creative'],
			'demo_image' => $data['demo_image'],
			'demo_image_mobile' => $data['demo_image_mobile'],
			'status' => $data['status']
		);
		//print_r($ins_data);exit;
		DB::table($this->table)->where('package_id', $id)->update($ins_data);

		$lang_fields = $data['lang'];

		$this->insert_lang_data($lang_fields, $id); 
		
		return true;
        
    }

	public function insert_lang_data($lang_fields=array(), $insert_id=''){
		$all_lang = get_lang();

		DB::table($this->lang_table)->where($this->primary_key, $insert_id)->delete();
		foreach($all_lang as $k => $v){
			
			$structure = array(
				$this->primary_key => $insert_id,
				'package_lang' => $v,
			);
			
			foreach($lang_fields as $field_name => $lang_val){
				$structure[$field_name] = $lang_fields[$field_name][$v];
			}
			
			$lang_record['data'] = $structure;
			DB::table($this->lang_table)->insert($structure);
		}
	}

    public function get_list($srch=array(),$paginate)
    {
        $query = DB::table('advertisement_packages as p')
                    ->leftJoin('advertisement_packages_names as p_n', 'p.package_id', '=', 'p_n.package_id')
                    ->select('p.*','p_n.package_name','p_n.package_lang');
        
        $query->groupBy('p_n.package_id');
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

	public function getDetail($id=''){
		$result_obj = DB::table($this->table)->where('package_id',$id)->first();
		$result = json_decode(json_encode($result_obj), true);
		$lang_result = DB::table($this->lang_table)->where('package_id', $id)->get()->toArray();
		$lang_name=$lang_info=array();
		
		foreach($lang_result as $k => $v){
			$lang_name[$v->package_lang] = $v->package_name;
		}
		$result['lang'] = array();
		foreach($result as $k => $v){
			$result['lang']['package_name'] = $lang_name;
		}
		return $result;
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
            ->where('package_id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Status updated successfully.',
        ];
    }

}
