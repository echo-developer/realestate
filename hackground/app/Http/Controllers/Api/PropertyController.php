<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\PrefPropertyAdditional;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    public function propertyImage(Request $req)
    {
        try {
            $data = [
                'pid' => $req->property_id,
                'image_type' => $req->image_key,
            ];

            $existingEntry = DB::table('property_gallary')
                ->where('pid', $req->property_id)
                ->where('image_type', $req->image_key)
                ->first();

            $galleryId = $existingEntry ? $existingEntry->id : DB::table('property_gallary')->insertGetId($data);

            if ($req->hasFile('image')) {
                $image = $req->file('image');
                $fileName = time() . '-' . $image->getClientOriginalName();
                $image->move(public_path('user_upload/property_images'), $fileName);

                DB::table('property_gallary_images')->insert([
                    'gallary_id' => $galleryId,
                    'filename' => $fileName,
                ]);
            }

            $gallery = getGalleryWithImages($galleryId);

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
                'image_id' => 'required|integer|exists:property_gallary_images,id',
            ]);

            $image = DB::table('property_gallary_images')
                ->where('id', $req->image_id)
                ->first();

            if (!$image) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Image not found.',
                ]);
            }

            $galleryId = $image->gallary_id;

            $filePath = public_path('user_upload/property_images/' . $image->filename);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            DB::table('property_gallary_images')
                ->where('id', $req->image_id)
                ->delete();

            $gallery = getGalleryWithImages($galleryId);

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
                'image_id' => 'required|integer|exists:property_gallary_images,id',
                'caption' => 'required|string|max:255', // Validate the caption field
            ]);

            // Fetch the image record
            $image = DB::table('property_gallary_images')
                ->where('id', $req->image_id)
                ->first();

            if (!$image) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Image not found.',
                ]);
            }

            // Update the caption for the image
            DB::table('property_gallary_images')
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
    public function uploadVideo(Request $req)
    {
        try {
            // ✅ Step 1: Validate the video input
            $validator = Validator::make($req->all(), [
                'video' => 'required|file|mimes:mp4,mov,ogg,webm|max:511200',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ]);
            }

            // ✅ Step 2: Store the file
            $video = $req->file('video');
            $fileName = time() . '-' . $video->getClientOriginalName();
            $destination = public_path('user_upload/property_videos');

            if (!file_exists($destination)) {
                mkdir($destination, 0755, true);
            }

            $video->move($destination, $fileName);

            $videoUrl = asset('user_upload/property_videos/' . $fileName);

            return response()->json([
                'status' => 1,
                'message' => 'Video uploaded successfully',
                'data' => [
                    'file_name' => $fileName,
                    'file_url' => $videoUrl,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Upload failed: ' . $e->getMessage()
            ]);
        }
    }

    public function property_video_update(Request $req)
    {
        try {

            $validator = Validator::make($req->all(), [
                'video' => 'required|file|mimes:mp4,mov,ogg,webm|max:51200',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ]);
            }

            $property_id = $req->property_id;
            $newVideoFile = $req->file('video');
            $oldVideoFile = PrefPropertyAdditional::where('pid', $property_id)->value('property_video');


            $fileName = time() . '-' . $newVideoFile->getClientOriginalName();
            $destination = public_path('user_upload/property_videos');

            if (!file_exists($destination)) {
                mkdir($destination, 0755, true);
            }

            $newVideoFile->move($destination, $fileName);
            $videoUrl = asset('user_upload/property_videos/' . $fileName);

            DB::transaction(function () use ($property_id, $fileName) {
                PrefPropertyAdditional::updateOrCreate(
                    ['pid' => $property_id],
                    ['property_video' => $fileName]
                );
            });

            if (!empty($oldVideoFile)) {
                unlink(public_path('user_upload/property_videos/' . $oldVideoFile));
            }

            return response()->json([
                'status' => 1,
                'message' => 'Video Updated successfully',
                'data' => [
                    'file_name' => $fileName,
                    'file_url' => $videoUrl,
                ]
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
