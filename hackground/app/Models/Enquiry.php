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
        $query = DB::table('pref_property_enquiry as e')
                    ->leftJoin('pref_properties as p', 'p.id', '=', 'e.property_id')
                    ->leftJoin('pref_project as pj', 'pj.id', '=', 'e.project_id')
                    ->leftJoin('users as u', 'u.id', '=', 'e.assign_to')
                    ->leftJoin('pref_customer as c', 'c.cid', '=', 'e.cid')
                    ->select('e.*','u.name as owner','c.name as customer','p.name as property_name','pj.project_name');
        // if ($term) {
        //     $query->where('e.name', 'like', "%{$term}%");
        // }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }
}
