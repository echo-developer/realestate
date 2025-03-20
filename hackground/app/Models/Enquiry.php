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
        if(!empty($srch['lead_for']) && $srch['lead_for'] == 'project') {
            $query->where('e.project_id', '!=' ,'');
        }
        if(!empty($srch['lead_for']) && $srch['lead_for'] == 'property') {
            $query->where('e.property_id', '!=' ,'');
        }
        if(!empty($srch['enquery_date'])) {
            $query->whereDate('e.created_at',date('Y-m-d',strtotime($srch['enquery_date'])));
        }
        if(!empty($srch['member_name'])) {
            $query->where('u.name', 'LIKE', '%'.$srch['member_name'].'%');
        }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function enquiry_details($enquiry_id)
    {
        $query = DB::table('property_enquiry as e')
                    ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
                    ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
                    ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
                    ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
                    ->select('e.*','u.name as owner','c.name as customer','p.name as property_name','pj.project_name')
                    ->where('e.enquery_id', $enquiry_id)->first();
        // if ($term) {
        //     $query->where('e.name', 'like', "%{$term}%");
        // }
        return $query;
    }

    public function get_unassign_member_list($srch=array(),$paginate)
    {
        $assigned_users = array();
        if($srch['enquery_id'])
        {
            $assigned = DB::table('leads_assigned as l_a')->where('enquery_id',$srch['enquery_id'])->get();
            if($assigned)
            {
                foreach($assigned as $k=>$u)
                {
                    $assigned_users[] = $u->user_id;
                }
            }
        }
        
        $query = DB::table('properties as p')
                    ->leftJoin('properties_settings as p_s', 'p.id', '=', 'p_s.pid')
                    ->leftJoin('properties_location as p_l', 'p.id', '=', 'p_l.pid')
                    ->leftJoin('users as u', 'p.uid', '=', 'u.id')
                    ->select('u.id as user_id','u.name as member_name');
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

        if($assigned_users)
        {
            $query->whereNotIn('u.id',$assigned_users);
        }
       
        $query->groupBy('p.uid');
        return $query->paginate($paginate);
    }

    public function get_assigned_member_list($srch=array(), $paginate)
    {
        $query = DB::table('leads_assigned as l_a')
                    ->leftJoin('users as u', 'l_a.user_id', '=', 'u.id')
                    ->select('l_a.assign_id','l_a.created_at','u.id as user_id','u.name as member_name')
                    ->where('l_a.enquery_id',$srch['enquery_id']);
        return $query->paginate($paginate);
    }

    public function save_assign_member($data)
    {
        DB::table('leads_assigned')->insert($data);
        return true;
    }

}
