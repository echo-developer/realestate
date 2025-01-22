<?php

namespace App\Http\Controllers\Api\Project;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectGallery;

class ProjectImageUploade extends Controller
{
    public function uploadImages(Request $req)
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
                $file->move(public_path('project_images'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = asset('project_images/' . $fileName);
            }
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles,
                'image_url' => $fileUrls
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }

    public function getAllProjectImages()
    {

        $gallery = ProjectGallery::with('images')->get();
        $gallery->makeVisible('project_id');
        $gallery = ProjectGallery::with('images')->get();
        $transformedGallery = [];

        foreach ($gallery as $gallaryItem) {
            foreach ($gallaryItem->images as $key => $image) {
                $transformedGallery[] = [
                    'property_id' => $gallaryItem->project_id,
                    'gallery_type' => $gallaryItem->image_type,
                    'gallary_id' => $gallaryItem->id,
                    'caption' => $image->caption,
                    'image_url' => asset('project_images/' . $image->filename),
                ];
            }
        }

        return response()->json([
            'status' => 1,
            'message' => 'Gallery Fetched Successfully',
            'data' =>   $transformedGallery,
        ]);
    }
}
