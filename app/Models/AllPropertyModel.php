<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class AllPropertyModel extends Model
{
    public function getallProperties($term = null, $paginate)
    {
        $query = DB::table('pref_properties as pt')
            ->join('pref_property_gallary as pg', 'pt.id', '=', 'pg.pid')
            ->join('pref_property_gallary_images as pgi', 'pg.id', '=', 'pgi.gallary_id')
            ->join('pref_properties_settings as ps', 'pt.id', '=', 'ps.pid')
            ->join('pref_properties_location as ploc', 'pt.id', '=', 'ploc.pid')
            ->where([
                ['pt.status', '!=', config('constants.STATUS_DELETE')],
                ['pgi.type', '=', 'exterior_view'],
            ])
            ->groupBy('pt.id')
            ->select(
                'pt.id',
                DB::raw('MAX(pt.name) as name'),
                DB::raw('MAX(pt.status) as status'),
                DB::raw('MAX(pt.created_at) as created_at'),
                DB::raw('MAX(pgi.filename) as filename'),
                DB::raw('MAX(ps.expected_price) as expected_price'),
                DB::raw('MAX(ps.post_for) as post_for'),
                DB::raw('MAX(ps.price_currency) as price_currency'),
                DB::raw('MAX(ploc.property_address) as property_address')
            );

        if ($term) {
            $query->where('pt.name', 'like', "%{$term}%");
        }
        if ($paginate) {
            return $query->paginate($paginate);
        }
        return $query->get();
    }
    use HasFactory;
}
