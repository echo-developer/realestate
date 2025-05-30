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
        $user = User::select('name', 'email', 'phone', 'image', 'whatsapp_no')
            ->where('id', $req->uid)
            ->first();
        if ($user) {
            if (!empty($user->image)) {
                $imagePath = public_path('user_upload/profile_image/' . $user->image);
                if (file_exists($imagePath)) {
                    $user->image = asset('user_upload/profile_image/' . $user->image);
                } else {
                    $user->image = '';
                }
            } else {
                $user->image = '';
            }
        }

        $data = PrefProperty::with([
            'settings:pid,bedrooms,bathrooms,area_in_sqft',
            'additional:pid',
            'location:pid,property_address',
        ])->paginate(10);

        $properties = $data->getCollection()->map(function ($property) {
            $galleries = [];
            $galleryImages = GetProperties_GalleryImages($property->id);
            foreach ($galleryImages as $image) {
                $galleryType = $image->image_type;
                if (!isset($galleries[$galleryType])) {
                    $galleries[$galleryType] = [
                        'gallery' => $galleryType,
                        'images' => []
                    ];
                }

                $galleries[$galleryType]['images'][] = [
                    'image_id'   => $image->image_id,
                    'image_name' => $image->filename,
                    'image_url'  => asset('user_upload/property_images/' . $image->filename),
                ];
            }
            return [
                'id'              => $property->id,
                'slug'            => $property->slug,
                'name'            => $property->name,
                'bedrooms'        => optional($property->settings)->bedrooms,
                'bathrooms'       => optional($property->settings)->bathrooms,
                'area_in_sqft'    => optional($property->settings)->area_in_sqft,
                'property_address' => optional($property->location)->property_address,
                'galleries'       => array_values($galleries),
            ];
        });
        $paginated = $data->setCollection($properties);
        return response()->json([
            'status'  => 1,
            'message' => 'success',
            'data'    => [
                'user_details'    => $user,
                'user_properties' => $paginated->items(),
            ],
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ]
        ]);
    }
}
