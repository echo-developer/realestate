<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\PrefProperty;

class UserDetailsController extends Controller
{
    public function details(Request $req)
    {

        $user =  User::select('name', 'email', 'phone', 'image', 'whatsapp_no')->where('id', $req->uid)->first();

        if ($user->image) {
            $user->image = asset('user_upload/profile_image/' . $user->image);
        }

        $data = PrefProperty::with([
            'settings:pid,bedrooms,bathrooms,area_in_sqft',
            'additional:pid',
            'location:pid,property_address',
        ])->get();

        $properties = $data->map(function ($property) {
            $galleries = [];
            $getGalleries = GetProperties_GalleryImages($property->id);

            foreach ($getGalleries as $image) {
                $galleryType = $image->image_type;
                if (!isset($galleries[$galleryType])) {
                    $galleries[$galleryType] = [
                        'gallery' => $galleryType,
                        'images' => []
                    ];
                }

                $imageUrl = asset('user_upload/property_images/' . $image->filename);

                $galleries[$galleryType]['images'][] = [
                    'image_id' => $image->image_id,
                    'image_name' => $image->filename,
                    'image_url' => $imageUrl,
                ];
            }
            $transformedGallaryData = array_values($galleries);
            return [
                'id' => $property->id,
                'slug' => $property->slug,
                'name' => $property->name,
                'bedrooms' => optional($property->settings)->bedrooms,
                'bathrooms' => optional($property->settings)->bathrooms,
                'area_in_sqft' => optional($property->settings)->area_in_sqft,
                'property_address' => optional($property->location)->property_address,
                'galleries' => $transformedGallaryData,
            ];
        });



        return response()->json(['status' => 1, compact('user', 'properties')]);
    }
}
