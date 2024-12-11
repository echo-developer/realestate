<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function ImageUpload(Request $req)
    {
        
        $req->validate([
            'images' => 'required',  
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048',  
        ]);
    
        $uploadedFiles = [];
    
      
        if ($req->hasFile('images')) {
            $images = $req->file('images');
            
            
            $images = is_array($images) ? $images : [$images];
    
            foreach ($images as $file) {
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('property_images'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = url('property_images/' . $fileName);
            }
            $url=asset('property_images');
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles,
                'image_url'=> $fileUrls
            ]);
        }
    
        return response()->json(['error' => 'No files uploaded'], 400);
    }
    
    public function PostProperty(Request $req){

        return response()->json([
          'status'=>1,
          'data'=>$req->all()
        ]);
    }

    
}
