<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class PostPropertyController extends Controller
{
    public function postPropertyView(Request $request)
    {
        $lang = $request->input('lang', 'en');

        //load CSS
        $cssFiles = File::files(public_path('assets/property_css'));
        $userData = Auth::guard('admin')->user();
        $cssPaths = [];
        foreach ($cssFiles as $file) {
            $cssPaths[] = 'assets/property_css/' . $file->getFilename();
        }

        //load Property type
        $homeontroller = new HomeController();
        $typeProperty =  $homeontroller->getPropertyType($request);
        $responseData = json_decode($typeProperty->getContent(), true);
        $propertyTypes =  $responseData['data'];

        // dd($responseData['data']);

        return view('Admin.Post_property_view.post_property', compact('cssPaths','userData','propertyTypes'));
    }
}
