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
            ->select(
                'pt.id',
                'pt.name',
                'pt.status',
                'ploc.property_address',
                'pt.created_at',
                'pgi.filename',
                'ps.expected_price',
                'ps.post_for',
                'ps.price_currency',
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
