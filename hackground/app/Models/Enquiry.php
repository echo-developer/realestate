<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;
    protected $table = 'property_enquiry';
    public function get_list($srch = array(), $paginate)
    {
        $query = DB::table('property_enquiry as e')
            ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
            ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
            ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
            ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
            ->leftJoin('leads_assigned as l_a', 'l_a.enquery_id', '=', 'e.enquery_id')
            ->select('e.*', 'u.name as owner', 'c.name as customer', 'p.name as property_name', 'pj.project_name', DB::raw('COUNT(DISTINCT pref_l_a.assign_id) AS assigned_count'));

        $query->groupBy('e.enquery_id');
        if (!empty($srch['lead_for']) && $srch['lead_for'] == 'project') {
            $query->where('e.project_id', '!=', '');
        }
        if (!empty($srch['lead_for']) && $srch['lead_for'] == 'property') {
            $query->where('e.property_id', '!=', '');
        }
        if (!empty($srch['enquery_date'])) {
            $query->whereDate('e.created_at', date('Y-m-d', strtotime($srch['enquery_date'])));
        }
        if (!empty($srch['member_name'])) {
            $query->where('u.name', 'LIKE', '%' . $srch['member_name'] . '%');
        }
        if (!empty($srch['user_id'])) {
            $query->where('u.id', $srch['user_id']);
        }
        $query->orderBy('e.enquery_id', 'desc');

        return $query->paginate($paginate);
    }

    public function property_enquiry_list($srch = array(), $paginate)
    {
        $query = DB::table('property_enquiry as e')
            ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
            ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
            ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
            ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
            ->select('e.*', 'u.name as owner', 'c.name as customer', 'p.name as property_name', 'pj.project_name');

        if (!empty($srch['enquery_date'])) {
            $query->whereDate('e.created_at', date('Y-m-d', strtotime($srch['enquery_date'])));
        }
        if (!empty($srch['member_name'])) {
            $query->where('u.name', 'LIKE', '%' . $srch['member_name'] . '%');
        }
        if (!empty($srch['property_id'])) {
            $query->where('e.property_id', $srch['property_id']);
        }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function project_enquiry_list($srch = array(), $paginate)
    {
        $query = DB::table('property_enquiry as e')
            ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
            ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
            ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
            ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
            ->select('e.*', 'u.name as owner', 'c.name as customer', 'p.name as property_name', 'pj.project_name');

        $query->where('e.project_id', '!=', '');

        if (!empty($srch['enquery_date'])) {
            $query->whereDate('e.created_at', date('Y-m-d', strtotime($srch['enquery_date'])));
        }
        if (!empty($srch['member_name'])) {
            $query->where('u.name', 'LIKE', '%' . $srch['member_name'] . '%');
        }
        if (!empty($srch['project_id'])) {
            $query->where('e.project_id', $srch['project_id']);
        }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function member_enquiry_list($srch = array(), $paginate)
    {
        if ($srch['lead_type'] == 'P') {
            $query = DB::table('leads_assigned as l_a')
                ->leftJoin('property_enquiry as e', 'l_a.enquery_id', '=', 'e.enquery_id')
                ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
                ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
                ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
                ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
                ->select('e.*', 'u.name as owner', 'c.name as customer', 'p.name as property_name', 'pj.project_name', 'l_a.assign_id');
        } elseif ($srch['lead_type'] == 'G') {
            $query = DB::table('leads_assigned as l_a')
                ->leftJoin('buyer_property_enquery as e', 'l_a.enquery_id', '=', 'e.id')
                ->select('e.*', 'l_a.assign_id');
        }

        if (!empty($srch['lead_for']) && $srch['lead_for'] == 'project') {
            $query->where('e.project_id', '!=', '');
        }
        if (!empty($srch['lead_for']) && $srch['lead_for'] == 'property') {
            $query->where('e.property_id', '!=', '');
        }
        if (!empty($srch['enquery_date'])) {
            $query->whereDate('e.created_at', date('Y-m-d', strtotime($srch['enquery_date'])));
        }
        if (!empty($srch['user_id'])) {
            $query->where(['l_a.user_id' => $srch['user_id']]);
        }
        if (!empty($srch['lead_type'])) {
            $query->where(['l_a.lead_type' => $srch['lead_type']]);
        }

        $query->orderBy('l_a.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function enquiry_details($enquiry_id)
    {
        $query = DB::table('property_enquiry as e')
            ->leftJoin('properties as p', 'p.id', '=', 'e.property_id')
            ->leftJoin('project as pj', 'pj.id', '=', 'e.project_id')
            ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
            ->leftJoin('customer as c', 'c.cid', '=', 'e.cid')
            ->select('e.*', 'u.name as owner', 'c.name as customer', 'p.name as property_name', 'pj.project_name')
            ->where('e.enquery_id', $enquiry_id)->first();
        return $query;
    }

    public function general_enquiry_details($enquiry_id)
    {
        $query = DB::table('buyer_property_enquery as e')
            ->where('e.id', $enquiry_id)->first();
        return $query;
    }

    public function get_unassign_member_list($srch = array(), $paginate)
    {
        $assigned_users = array();
        if ($srch['enquery_id']) {
            $assigned = DB::table('leads_assigned as l_a')->where(['enquery_id' => $srch['enquery_id'], 'lead_type' => 'P'])->get();
            if ($assigned) {
                foreach ($assigned as $k => $u) {
                    $assigned_users[] = $u->user_id;
                }
            }
        }
        if ($srch['enquiry_type'] == 'property') {
            $query = DB::table('properties as p')
                ->leftJoin('properties_settings as p_s', 'p.id', '=', 'p_s.pid')
                ->leftJoin('properties_location as p_l', 'p.id', '=', 'p_l.pid')
                ->leftJoin('users as u', 'p.uid', '=', 'u.id')
                ->leftJoin('user_membership as u_m', 'p.uid', '=', 'u_m.user_id')
                ->select('u.id as user_id', 'u.name as member_name','u_m.leads','u_m.leads_used');
        } elseif ($srch['enquiry_type'] == 'project') {
            $query = DB::table('project as p')
                ->leftJoin('project_settings as p_s', 'p.id', '=', 'p_s.project_id')
                ->leftJoin('project_location as p_l', 'p.id', '=', 'p_l.project_id')
                ->leftJoin('users as u', 'p.uid', '=', 'u.id')
                ->leftJoin('user_membership as u_m', 'p.uid', '=', 'u_m.user_id')
                ->select('u.id as user_id', 'u.name as member_name','u_m.leads','u_m.leads_used');
        }

        if (array_key_exists('city', $srch) && $srch['city']) {
            $query->where('p_l.city', $srch['city']);
        }
        if (array_key_exists('property_type_for', $srch) && $srch['property_type_for']) {
            $query->where('p_s.property_type_for', $srch['property_type_for']);
        }
        if (array_key_exists('property_type', $srch) && $srch['property_type']) {
            $query->where('p_s.property_type', $srch['property_type']);
        }
        if (array_key_exists('post_for', $srch) && $srch['post_for']) {
            $query->where('p_s.post_for', $srch['post_for']);
        }
        if (array_key_exists('project_type', $srch) && $srch['project_type']) {
            $query->where('p_s.post_for', $srch['project_type']);
        }

        if ($assigned_users) {
            $query->whereNotIn('u.id', $assigned_users);
        }

        $query->groupBy('p.uid');
        return $query->paginate($paginate);
    }

    public function get_assigned_member_list($srch = array(), $paginate)
    {
        $query = DB::table('leads_assigned as l_a')
            ->leftJoin('users as u', 'l_a.user_id', '=', 'u.id')
            ->leftJoin('user_membership as u_m', 'u.id', '=', 'u_m.user_id')
            ->select('l_a.assign_id', 'l_a.created_at', 'u.id as user_id', 'u.name as member_name','u_m.leads','u_m.leads_used')
            ->where(['lead_type' => $srch['lead_type'], 'l_a.enquery_id' => $srch['enquery_id']]);
        return $query->paginate($paginate);
    }

    public function save_assign_member($data)
    {
        DB::table('leads_assigned')->insert($data);
        if($data)
        {
            foreach($data as $k=>$d)
            {
                $user_id = $d['user_id'];
                $check_membership = DB::table('user_membership as u_m')->where('u_m.user_id',$user_id)->select('u_m.leads','u_m.leads_used')->first();
                if($check_membership)
                {
                    $prev_leads_used = $check_membership->leads_used;
                    $curr_leads_used = $prev_leads_used+1;
                    DB::table('user_membership as u_m')->where('u_m.user_id',$user_id)->update(array('u_m.leads_used'=>$curr_leads_used));
                }
            }
        }
        return true;
    }

    public function general_enquiry_list($srch = array(), $paginate)
    {
        $query = DB::table('buyer_property_enquery as e')
            ->select('e.*');

        // $query->where('e.project_id', '!=' ,'');

        // if(!empty($srch['enquery_date'])) {
        //     $query->whereDate('e.created_at',date('Y-m-d',strtotime($srch['enquery_date'])));
        // }
        // if(!empty($srch['member_name'])) {
        //     $query->where('u.name', 'LIKE', '%'.$srch['member_name'].'%');
        // }
        // if(!empty($srch['project_id'])) {
        //     $query->where('e.project_id', $srch['project_id']);
        // }
        // $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }

    public function general_unassign_member_list($srch = array(), $paginate)
    {
        $assigned_users = array();
        if ($srch['id']) {
            $assigned = DB::table('leads_assigned as l_a')->where(['enquery_id' => $srch['id'], 'lead_type' => 'G'])->get();
            if ($assigned) {
                foreach ($assigned as $k => $u) {
                    $assigned_users[] = $u->user_id;
                }
            }
        }
        $query = DB::table('properties as p')
            ->leftJoin('properties_settings as p_s', 'p.id', '=', 'p_s.pid')
            ->leftJoin('properties_location as p_l', 'p.id', '=', 'p_l.pid')
            //->leftJoin('property_budget as p_b', 'p.id', '=', 'p_b.pid')
            ->leftJoin('users as u', 'p.uid', '=', 'u.id')
            ->leftJoin('user_membership as u_m', 'p.uid', '=', 'u_m.user_id')
            ->select('u.id as user_id', 'u.name as member_name','u_m.leads','u_m.leads_used');

        if (array_key_exists('property_type_for', $srch) && $srch['property_type_for']) {
            $query->where('p_s.property_type_for', $srch['property_type_for']);
        }
        if (array_key_exists('property_type', $srch) && $srch['property_type']) {
            $query->where('p_s.property_type', $srch['property_type']);
        }

        if ($assigned_users) {
            $query->whereNotIn('u.id', $assigned_users);
        }

        $query->groupBy('p.uid');
        return $query->paginate($paginate);
    }
}
