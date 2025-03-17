<?php

namespace App\Http\Controllers\Api\Project;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ImageEditController extends Controller
{
    public function projectImage(Request $req)
    {
        try {
            $data = [
                'project_id' => $req->project_id,
                'image_type' => $req->image_key,
            ];

            $existingEntry = DB::table('project_gallery')
                ->where('project_id', $req->project_id)
                ->where('image_type', $req->image_key)
                ->first();

            $galleryId = $existingEntry ? $existingEntry->id : DB::table('project_gallery')->insertGetId($data);

            if ($req->hasFile('image')) {
                $image = $req->file('image');
                $fileName = time() . '-' . $image->getClientOriginalName();
                $image->move(public_path('user_upload/project_images'), $fileName);

                DB::table('project_gallery_images')->insert([
                    'gallary_id' => $galleryId,
                    'filename' => $fileName,
                ]);
            }

            $gallery = getGalleryWithImagesProject($galleryId);

            return response()->json([
                'status' => 1,
                'data' => $gallery,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function deleteImage(Request $req)
    {
        try {
            $req->validate([
                'image_id' => 'required|integer|exists:project_gallery_images,id',
            ]);

            $image = DB::table('project_gallery_images')
                ->where('id', $req->image_id)
                ->first();

            if (!$image) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Image not found.',
                ]);
            }

            $galleryId = $image->gallary_id;

            $filePath = public_path('user_upload/project_images/' . $image->filename);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            DB::table('project_gallery_images')
                ->where('id', $req->image_id)
                ->delete();

            $gallery = getGalleryWithImagesProject($galleryId);

            return response()->json([
                'status' => 1,
                'data' => $gallery,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function captionImage(Request $req)
    {
        try {
            $req->validate([
                'image_id' => 'required|integer|exists:project_gallery_images,id',
                'caption' => 'required|string|max:255', 
            ]);

            
            $image = DB::table('project_gallery_images')
                ->where('id', $req->image_id)
                ->first();

            if (!$image) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Image not found.',
                ]);
            }

            
            DB::table('project_gallery_images')
                ->where('id', $req->image_id)
                ->update(['caption' => $req->caption]);


            return response()->json([
                'status' => 1,
                'message' => 'Caption updated successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
