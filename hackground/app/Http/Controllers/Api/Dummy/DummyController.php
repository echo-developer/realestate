<?php

namespace App\Http\Controllers\Api\Dummy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class DummyController extends Controller
{
    public function insertSlug()
    {

        $cities = DB::table('city_names')->select('city_id', 'name')->where('lang', 'en')->get()->toArray();

        foreach ($cities as $city) {
            $slug =  Str::slug($city->name, '_');

            DB::table('city')->where('city_id', $city->city_id)->update(['slug' => $slug]);
        }
        return 'Done';
    }
}
