<?php

namespace App\Http\Controllers\Api;

use App\Models\CmsModel;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\HtmlString;

class CmsController extends Controller
{
    public function get_content(Request $req,$key)
    {
        $lang = $req->input('lang','en');

        $cms = CmsModel::select('id', 'slug')
            ->with(['names' => function ($query)use ($lang) {
                $query->select('cms_id', 'content','title')  
                    ->where('lang',  $lang);         
            }])
            ->where('slug', $key)
            ->firstOrFail();


        return response()->json([
            'status' => 1,
            'data' => [
                'id' => $cms->id,
                'slug' => $cms->slug,
                'content' => (optional($cms->names)->content),
                'title' => optional($cms->names)->title,
            ]
        ]);
    }
}
