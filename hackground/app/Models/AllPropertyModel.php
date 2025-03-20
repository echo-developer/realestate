<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AllPropertyModel extends Model
{
    public function getallProperties($srch = array(), $paginate)
    {
        $query = DB::table('properties as pt')
            ->leftJoin('property_gallary as pg', 'pt.id', '=', 'pg.pid')
            ->leftJoin('property_gallary_images as pgi', 'pg.id', '=', 'pgi.gallary_id')
            ->leftJoin('properties_settings as ps', 'pt.id', '=', 'ps.pid')
            ->leftJoin('properties_location as ploc', 'pt.id', '=', 'ploc.pid')
            ->where([
                ['pt.is_deleted', '!=', config('constants.STATUS_ACTIVE')],
            ])
            ->groupBy('pt.id')
            ->select(
                'pt.id',
                DB::raw('MAX(pref_pt.name) as name'),
                DB::raw('MAX(pref_pt.slug) as slug'),
                DB::raw('MAX(pref_pt.is_featured) as is_featured'),
                DB::raw('MAX(pref_pt.is_top) as is_top'),
                DB::raw('MAX(pref_pt.status) as status'),
                DB::raw('MAX(pref_pt.created_at) as created_at'),
                DB::raw('MAX(pref_pgi.filename) as filename'),
                DB::raw('MAX(pref_ps.expected_price) as expected_price'),
                DB::raw('MAX(pref_ps.post_for) as post_for'),
                DB::raw('MAX(pref_ps.price_currency) as price_currency'),
                DB::raw('MAX(pref_ploc.property_address) as property_address')
            );

        if (array_key_exists('term',$srch) && $srch['term']) {
            $query->where('pt.name', 'like', "%{$srch['term']}%");
        }
        if (array_key_exists('user_id',$srch) && $srch['user_id']) {
            $query->where('pt.uid', $srch['user_id']);
        }
        $query->orderBy('pt.id','desc');
        if ($paginate) {
            return $query->paginate($paginate);
        }
        return $query->get();
    }

    public function PropertyFeatureStatus($data)
    {
        DB::table('properties')
            ->where('id', $data['id'])
            ->update([
                'is_featured' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'status updated.',
        ];
    }
    public function PropertyTopStatus($data)
    {
        DB::table('properties')
            ->where('id', $data['id'])
            ->update([
                'is_top' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'status updated.',
        ];
    }
    public function PropertyDelete($id = '')
    {
        DB::table('properties')
            ->where('id', $id)
            ->update([
                'is_deleted' => config('constants.STATUS_ACTIVE'),
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
        DB::table('properties')
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
