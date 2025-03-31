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
                $file->move(public_path('user_upload/project_images'), $fileName);
                $uploadedFiles[] = $fileName;
                $fileUrls[] = asset('user_upload/project_images/' . $fileName);
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

    public function uploadFloorPlan(Request $req)
    {

        $req->validate([
            'floor_plan_image' => 'required',
        ]);

        $uploadedFiles = [];


        if ($req->hasFile('floor_plan_image')) {
            $file = $req->file('floor_plan_image');

                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('user_upload/project_floor_plan/'), $fileName);
                $uploadedFiles = $fileName;
                $fileUrls = asset('user_upload/project_floor_plan/' . $fileName);
            
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles,
                'image_url' => $fileUrls
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }
    public function destroyFloorPlanImage(Request $req)
    {

        $filePath = public_path('user_upload/project_floor_plan/' . $req->floor_plan_image);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
            
            return response()->json([
                'status' => 1,
                'message' => 'Files successfully deleted',
            ]);
        

        return response()->json(['error' => 'No files uploaded'], 400);
    }
    
    public function getAllProjectImages($id)
    {

        $gallery = ProjectGallery::where('project_id',$id)->with('images')->get();
        $gallery->makeVisible('project_id');
        $transformedGallery = [];

        foreach ($gallery as $gallaryItem) {
            foreach ($gallaryItem->images as $key => $image) {
                $transformedGallery[] = [
                    'property_id' => $gallaryItem->project_id,
                    'gallery_type' => $gallaryItem->image_type,
                    'gallary_id' => $gallaryItem->id,
                    'caption' => $image->caption,
                    'image_url' => asset('user_upload/project_images/' . $image->filename),
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
