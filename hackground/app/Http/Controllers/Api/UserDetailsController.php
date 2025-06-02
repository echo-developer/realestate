<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\PrefProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;

class UserDetailsController extends Controller
{
    public function details(Request $req)
    {
        $user = User::select('id', 'name', 'email', 'phone', 'image', 'user_type', 'whatsapp_no')->with('userAdditional:user_id,address')
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

        $userData = new UserResource($user);




        return response()->json([
            'status'  => 1,
            'message' => 'success',
            'data'    => [
                'user_details'    => $userData,
            ]
        ]);
    }
    public function userPropertyDetails(Request $req)
    {
        $filters = [
            'post_for'      => $req->input('post_for'),
            'property_type' => $req->input('property_type'),
            'property_for'  => $req->input('property_for'),
            'locality'      => $req->input('locality'),
            'min_budget'    => $req->input('min_budget'),
            'max_budget'    => $req->input('max_budget'),
            'bedrooms'      => is_string($req->input('bedrooms')) ? json_decode($req->input('bedrooms'), true) : ($req->input('bedrooms') ?? []),
        ];
        $query = PrefProperty::with([
            'settings:pid,bedrooms,bathrooms,area_in_sqft,expected_price',
            'additional:pid,possession_status',
            'location:pid,property_address',
        ])->where('uid', $req->uid)
            ->where('status', 1);

        // Apply filters conditionally
        if (!empty($filters['post_for'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->where('post_for', $filters['post_for']);
            });
        }

        if (!empty($filters['property_type'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->where('property_type', $filters['property_type']);
            });
        }

        if (!empty($filters['property_for'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->where('property_type_for', $filters['property_for']);
            });
        }

        if (!empty($filters['locality'])) {
            $query->whereHas('location', function ($q) use ($filters) {
                $q->where('locality', $filters['locality']);
            });
        }

        if (!empty($filters['min_budget'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->where('expected_price', '<=', $filters['max_budget']);
            });
        }

        if (!empty($filters['max_budget'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->where('expected_price', '<=', $filters['max_budget']);
            });
        }

        if (!empty($filters['bedrooms']) && is_array($filters['bedrooms'])) {
            $query->whereHas('settings', function ($q) use ($filters) {
                $q->whereIn('bedrooms', $filters['bedrooms']);
            });
        }

        $data = $query->paginate(10);

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
                'possession_status' => get_name_by_id('property_status_names', 'status_id', $property->additional->possession_status, 'en'),
                'property_price' => optional($property->settings)->expected_price,
                'galleries'       => array_values($galleries),
            ];
        });
        $paginated = $data->setCollection($properties);
        return response()->json([
            'status'  => 1,
            'message' => 'success',
            'data'    => [
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
