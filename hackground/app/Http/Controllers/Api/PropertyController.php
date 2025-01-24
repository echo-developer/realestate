<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class PropertyController extends Controller
{
    public function propertyImage(Request $req)
    {
        try {
            $data = [
                'pid' => $req->property_id,
                'image_type' => $req->image_key,
            ];

            $existingEntry = DB::table('pref_property_gallary')
                ->where('pid', $req->property_id)
                ->where('image_type', $req->image_key)
                ->first();

            $galleryId = $existingEntry ? $existingEntry->id : DB::table('pref_property_gallary')->insertGetId($data);

            if ($req->hasFile('image')) {
                $image = $req->file('image');
                $fileName = time() . '-' . $image->getClientOriginalName();
                $image->move(public_path('user_upload/property_images'), $fileName);

                DB::table('pref_property_gallary_images')->insert([
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
                'image_id' => 'required|integer|exists:pref_property_gallary_images,id',
            ]);

            $image = DB::table('pref_property_gallary_images')
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

            DB::table('pref_property_gallary_images')
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
                'image_id' => 'required|integer|exists:pref_property_gallary_images,id',
                'caption' => 'required|string|max:255', // Validate the caption field
            ]);

            // Fetch the image record
            $image = DB::table('pref_property_gallary_images')
                ->where('id', $req->image_id)
                ->first();

            if (!$image) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Image not found.',
                ]);
            }

            // Update the caption for the image
            DB::table('pref_property_gallary_images')
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
