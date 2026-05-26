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
            ->leftJoin('users as u', 'pt.uid', '=', 'u.id')
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
                DB::raw('MAX(pref_ps.bedrooms) as bedrooms'),
                DB::raw('MAX(pref_ps.bathrooms) as bathrooms'),
                DB::raw('MAX(pref_ps.carpet_area) as carpet_area'),
                DB::raw('MAX(pref_ps.super_area) as super_area'),
                DB::raw('MAX(pref_ploc.property_address) as property_address')
            );

        if (array_key_exists('term',$srch) && $srch['term']) {
            $query->where('pt.name', 'like', "%{$srch['term']}%");
        }
        if (array_key_exists('username',$srch) && $srch['username']) {
            $query->where('u.name', 'like', "%{$srch['username']}%");
        }
        if (array_key_exists('user_id',$srch) && $srch['user_id']) {
            $query->where('pt.uid', $srch['user_id']);
        }
        if (array_key_exists('post_for',$srch) && $srch['post_for']) {
            $query->where('ps.post_for', $srch['post_for']);
        }
        if (array_key_exists('property_type',$srch) && $srch['property_type']) {
            $query->where('ps.property_type', $srch['property_type']);
        }
        if (array_key_exists('property_for',$srch) && $srch['property_for']) {
            $query->where('ps.property_type_for', $srch['property_for']);
        }
        if (array_key_exists('city',$srch) && $srch['city']) {
            $query->where('ploc.city', $srch['city']);
        }
        if (array_key_exists('post_date',$srch) && $srch['post_date']) {
            $query->whereDate('pt.created_at', $srch['post_date']);
        }
        if (!empty($srch['prop_slug'])) {
            $query->where('pt.slug', $srch['prop_slug']);
        }
        $query->orderBy('pt.id','desc');
        if ($paginate) {
            return $query->paginate($paginate)->appends($srch);
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
