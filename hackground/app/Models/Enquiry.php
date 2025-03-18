<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    public function get_list($srch=array(),$paginate)
    {
        $query = DB::table('property_enquiry as e')
                    ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
                    ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
                    ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
                    ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
                    ->select('e.*','u.name as owner','c.name as customer','p.name as property_name','pj.project_name');
        // if ($term) {
        //     $query->where('e.name', 'like', "%{$term}%");
        // }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function enquiry_details($enquiry_id)
    {
        $query = DB::table('property_enquiry as e')->select('e.*')->where('e.enquery_id', $enquiry_id)->first();
        // if ($term) {
        //     $query->where('e.name', 'like', "%{$term}%");
        // }
        return $query;
    }

    public function get_assign_member_list($srch=array(),$paginate)
    {
        $query = DB::table('properties as p')
                    ->leftJoin('properties_settings as p_s', 'p.id', '=', 'p_s.pid')
                    ->leftJoin('properties_location as p_l', 'p.id', '=', 'p_l.pid')
                    ->leftJoin('users as u', 'p.uid', '=', 'u.id')
                    ->select('u.id as user_id','u.name as member_name',);
        if(array_key_exists('city',$srch) && $srch['city'])
        {
            $query->where('p_l.city',$srch['city']);
        }
        if(array_key_exists('property_type_for',$srch) && $srch['property_type_for'])
        {
            $query->where('p_s.property_type_for',$srch['property_type_for']);
        }
        if(array_key_exists('property_type',$srch) && $srch['property_type'])
        {
            $query->where('p_s.property_type',$srch['property_type']);
        }
        if(array_key_exists('post_for',$srch) && $srch['post_for'])
        {
            $query->where('p_s.post_for',$srch['post_for']);
        }
       
        $query->groupBy('p.uid');
        return $query->paginate($paginate);
    }

}
