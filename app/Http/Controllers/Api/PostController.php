<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function ImageUpload(Request $req)
    {
        $req->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048', // Validate each file in the array
        ]);

        if ($req->hasFile('images')) {
            $uploadedFiles = [];

            foreach ($req->file('images') as $file) {
                $fileName = time() . '-' . $file->getClientOriginalName();
                $file->move(public_path('property_images'), $fileName);
                $uploadedFiles[] = $fileName;
            }

            return response()->json([
                'status' => 1,
                'message' => 'Files successfully uploaded',
                'files' => $uploadedFiles
            ]);
        }

        return response()->json(['error' => 'No files uploaded'], 400);
    }
}
