<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostPropertyController extends Controller
{
    public function postPropertyView(Request $request)
    {
        return view('Admin.Post_property_view.post_property');
    }
}
