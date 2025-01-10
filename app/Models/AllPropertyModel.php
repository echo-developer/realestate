<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AllPropertyModel extends Model
{
    public function getallProperties($term = null, $paginate)
    {
        $query = DB::table('pref_properties as pt')
            ->leftJoin('pref_property_gallary as pg', 'pt.id', '=', 'pg.pid')
            ->leftJoin('pref_property_gallary_images as pgi', 'pg.id', '=', 'pgi.gallary_id')
            ->leftJoin('pref_properties_settings as ps', 'pt.id', '=', 'ps.pid')
            ->leftJoin('pref_properties_location as ploc', 'pt.id', '=', 'ploc.pid')
            ->where([
                ['pt.is_deleted', '!=', config('constants.STATUS_DELETE')],
            ])
            ->groupBy('pt.id')
            ->select(
                'pt.id',
                DB::raw('MAX(pt.name) as name'),
                DB::raw('MAX(pt.is_featured) as is_featured'),
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

    public function PropertyFeatureStatus($data)
    {
        DB::table('pref_properties')
            ->where('id', $data['id'])
            ->update([
                'is_featured' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Featured status updated.',
        ];
    }

    public function PropertyDelete($id = '')
    {
        DB::table('pref_properties')
            ->where('id', $id)
            ->update([
                'is_deleted' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'Property deleted successfully.',
        ];
    }

    public function PropertyStatus($data)
    {
        Log::info("DB in PropStatusupdate:\n" . json_encode($data, JSON_PRETTY_PRINT));
        DB::table('pref_properties')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        set_flash_message('update');
        return [
            'message' => 'Property Status changed.',
        ];
    }
    use HasFactory;
}
