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
                $image->move(public_path('property_images'), $fileName);


                DB::table('pref_property_gallary_images')->insert([
                    'gallary_id' => $galleryId,
                    'filename' => $fileName,
                ]);
            }


            $images = DB::table('pref_property_gallary_images')
                ->where('gallary_id', $galleryId)
                ->select('id', 'filename')
                ->get();


            $images->transform(function ($image) {
                $image->image_url = url('property_images/' . $image->filename);
                return $image;
            });


            $gallery = DB::table('pref_property_gallary')
                ->where('id', $galleryId)
                ->select('pid as property_id', 'image_type as image_key', 'id as gallary_id')
                ->first();


            if ($gallery) {
                $gallery->images = $images;
            }


            return response()->json([
                'status' => 1,
                'data' => $gallery,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(), // Optional: Include error details for debugging
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

 
            $filePath = public_path('property_images/' . $image->filename);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

  
            DB::table('pref_property_gallary_images')
                ->where('id', $req->image_id)
                ->delete();

     
            $remainingImages = DB::table('pref_property_gallary_images')
                ->where('gallary_id', $galleryId)
                ->select('id', 'filename')
                ->get();

   
            $remainingImages->transform(function ($image) {
                $image->image_url = url('property_images/' . $image->filename);
                return $image;
            });

     
            $gallery = DB::table('pref_property_gallary')
                ->where('id', $galleryId)
                ->select('pid as property_id', 'image_type as image_key', 'id as gallary_id')
                ->first();

   
            if ($gallery) {
                $gallery->images = $remainingImages;
            }

          
            return response()->json([
                'status' => 1,
                'data' => $gallery,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error occurred. Please try again later.',
                'error' => $e->getMessage(), // Optional: Include error details for debugging
            ]);
        }
    }
}
