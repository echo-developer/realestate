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
        $query = DB::table('property_enquiry as e')->select('e.*');
        // if ($term) {
        //     $query->where('e.name', 'like', "%{$term}%");
        // }
        $query->orderBy('e.enquery_id', 'desc');
        return $query->paginate($paginate);
    }
}
