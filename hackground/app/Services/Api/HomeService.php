<?php

namespace App\Services\Api;

use App\Models\User;
use App\Models\PrefProject;
use App\Models\Api\ApiModel;
use App\Models\PrefProperty;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HomeService
{
    protected $apiModel;

    public function __construct()
    {
        $this->apiModel = new ApiModel;
    }

    public function get_properties()
    {
        $limit = 10;
        $user_id = auth_user_id() ?? null;

        $properties = PrefProperty::select('id', 'slug', 'uid', 'name', 'created_at', 'is_featured', 'is_populer', 'is_top')
            ->with([
                'settings:pid,bedrooms,bathrooms,area_in_sqft,unit_type,super_area,property_type_for,post_for,expected_price,parking_ability',
                'location:pid,property_address',
                'user:id,image'
            ])
            ->where('is_deleted', 0)
            ->where('status', 1)
            ->latest()
            ->take($limit)
            ->get();

        $propertyIds = $properties->pluck('id')->toArray();

        // Fetch favorites in one query
        $favoritePropertyIds = [];
        if ($user_id) {
            $favoritePropertyIds = DB::table('my_favorite_property')
                ->where('uid', $user_id)
                ->whereIn('propID', $propertyIds)
                ->where('status', config('constants.STATUS_ACTIVE'))
                ->pluck('propID')
                ->toArray();
        }

        $formattedProperties = $properties->map(function ($property) use ($user_id, $favoritePropertyIds) {
            $is_favorite = in_array($property->id, $favoritePropertyIds);

            // Get gallery images for property
            $galleryImages = GetProperties_GalleryImages([$property->id]);
            $galleries = [];

            if ($galleryImages->isNotEmpty()) {
                $grouped = $galleryImages->groupBy('image_type');

                // Prefer 'exterior' type image
                if ($grouped->has('exterior') && $grouped['exterior']->isNotEmpty()) {
                    $image = $grouped['exterior']->first();
                    $galleries[] = [
                        'gallery' => 'exterior',
                        'images' => [[
                            'image_id'   => $image->image_id,
                            'image_name' => $image->filename,
                            'image_url'  => asset('user_upload/property_images/' . $image->filename),
                            'caption'    => $image->caption,
                        ]]
                    ];
                } else {
                    // Fallback: use the first image from any type
                    $firstImage = $galleryImages->first();
                    $galleries[] = [
                        'gallery' => $firstImage->image_type ?? 'default',
                        'images' => [[
                            'image_id'   => $firstImage->image_id,
                            'image_name' => $firstImage->filename,
                            'image_url'  => asset('user_upload/property_images/' . $firstImage->filename),
                            'caption'    => $firstImage->caption,
                        ]]
                    ];
                }
            }


            return [
                'property_id'       => $property->id,
                'is_favourite'      => $is_favorite,
                'user'              => get_user_name($property->uid ?? null),
                'logo'              => (!empty($property->user?->image) && file_exists(public_path('user_upload/profile_image/' . $property->user->image)))
                    ? asset('user_upload/profile_image/' . $property->user->image) : '',
                'property_size'     => $property->settings->super_area ?? '',
                'unit_type'         => $property->settings->unit_type ?? '',
                'area_in_sqft'      => $property->settings->area_in_sqft ?? '',
                'property_name'     => $property->name ?? '',
                'slug'              => $property->slug ?? '',
                'post_for'          => $property->settings->post_for ?? '',
                'parking_ability'   => $property->settings->parking_ability ?? '',
                'property_type_for' => get_name_by_id('property_sub_category_names', 'sub_category_id', $property->settings->property_type_for ?? null, 'en'),
                'bedrooms'          => $property->settings->bedrooms ?? '',
                'bathroom'          => $property->settings->bathrooms ?? '',
                'price'             => $property->settings->expected_price ?? '',
                'created_at'        => $property->created_at ?? '',
                'address'           => $property->location->property_address ?? '',
                'image_count'       => getGalleriesCount($property->id, 'property'),
                'galleries'         => array_values($galleries),
                'is_featured'       => $property->is_featured,
                'is_populer'        => $property->is_populer,
                'is_top'            => $property->is_top,
            ];
        });

        return [
            'recent_properties'   => $formattedProperties->sortByDesc('created_at')->take($limit)->values(),
            'featured_properties' => $formattedProperties->where('is_featured', true)->take($limit)->values(),
            'popular_properties'  => $formattedProperties->where('is_populer', true)->take($limit)->values(),
            'top_properties'      => $formattedProperties->where('is_top', true)->take($limit)->values(),
        ];
    }


    public function getProjectsByType(): array
    {
        DB::enableQueryLog();
        $user_id = auth_user_id() ?? null;

        $projectTypes = [
            'featured_project' => ['is_featured', true],
            'new_project'      => ['created_at', '>=', now()->subDays(7)],
            'populer_project'  => ['is_popular', true],
            'top_project'      => ['is_top', true]
        ];

        $projectsData = [];

        foreach ($projectTypes as $key => $condition) {
            $query = PrefProject::where([
                [$condition[0], $condition[1]],
                ['status', '=', config('constants.STATUS_ACTIVE')],
                ['is_deleted', '=', false]
            ])
                ->with(['settings', 'additional', 'location', 'galleries.images'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            $projectsData[$key] = $query->map(function ($project) use ($user_id) {
                return $this->flattenProject($project, $user_id);
            });
        }
        return $projectsData;
    }

    private function flattenProject($project, $user_id)
    {
        $flattened = [];

        $is_favourite = !empty($user_id) && DB::table('my_favorite_project')
            ->where('uid', $user_id)
            ->where('project_id', $project->id)
            ->value('status') == config('constants.STATUS_ACTIVE');

        $project->uid = get_user_name($project->uid ?? '');
        $project->is_favourite = $is_favourite;
        $project->image_count = getGalleriesCount($project->id ?? 0, 'project');

        // Location
        if (!empty($project->location)) {
            $project->location->city = get_name_by_id('city_names', 'city_id', $project->location->city ?? null, 'en');
        }

        // Additional Info
        if (!empty($project->additional)) {
            $project->additional->possession_status = get_name_by_id(
                'property_status_names',
                'status_id',
                $project->additional->possession_status ?? null,
                'en'
            );

            $projectAmenities = $this->sanitizeAmenityIds($project->additional->project_amenity ?? '[]');
            $project->additional->project_amenity = $this->apiModel->getPropertyAmnitybyID($projectAmenities);
        }

        // Settings Info
        if (!empty($project->settings)) {
            $project->settings->project_type = get_name_by_id(
                'property_category_names',
                'category_id',
                $project->settings->project_type ?? null,
                'en'
            );
            $project->settings->project_furnish = get_name_by_id(
                'property_furnish_names',
                'furnish_id',
                $project->settings->project_furnish ?? null,
                'en'
            );
        }

        // Galleries
        if (!empty($project->galleries) && $project->galleries->isNotEmpty()) {
            $firstGallery = $project->galleries->first();
            $firstImage = $firstGallery->images->first() ?? null;

            if (!empty($firstImage)) {
                $project->gallery = [[
                    'id' => $firstGallery->id,
                    'image_type' => $firstGallery->image_type,
                    'description' => $firstGallery->description,
                    'images' => [[
                        'id' => $firstImage->id,
                        'file' => !empty($firstImage->filename) ? asset('user_upload/project_images/' . $firstImage->filename) : '',
                        'caption' => $firstImage->caption ?? '',
                    ]]
                ]];
            }

            unset($project->galleries);
        }

        // Merge nested objects into root
        if (!empty($project->settings)) {
            $flattened = array_merge($flattened, $project->settings->toArray());
            unset($project->settings);
        }

        if (!empty($project->additional)) {
            $flattened = array_merge($flattened, $project->additional->toArray());
            unset($project->additional);
        }

        if (!empty($project->location)) {
            $flattened = array_merge($flattened, $project->location->toArray());
            unset($project->location);
        }

        // Final merge
        $flattened = array_merge($flattened, $project->toArray());

        return $flattened;
    }

    function sanitizeAmenityIds($idsString)
    {
        // Handles empty, null, or non-array strings like '[]'
        if (is_array($idsString)) return $idsString;

        return array_filter(array_map('trim', explode(',', trim($idsString, '[]"'))));
    }

    public function getTestimonialList()
    {
        $result = DB::table('testimonial')
            ->leftJoin('testimonial_names', 'testimonial.id', '=', 'testimonial_names.testimonial_id')
            ->select('testimonial.id', 'testimonial.image', 'testimonial_names.name', 'testimonial_names.subname as designation', 'testimonial_names.description')
            ->where(
                [
                    'testimonial_names.lang' => 'en',
                    'testimonial.status' => config('constants.STATUS_ACTIVE')
                ]
            )
            ->get();

        $result->map(fn($items) => !empty($items->image) ? $items->image = asset('user_upload/testimonial_image') . '/' . $items->image : null);
        return $result;
    }

    public function getVerifiedAgents($city_id)
    {
        $data = User::with(['userAdditional', 'agentAdditional', 'serviceArea:agent_id,city'])
            ->where([
                ['status', config('constants.STATUS_ACTIVE')],
                ['user_type', 'A'],
                ['is_verified_agent', config('constants.STATUS_ACTIVE')],
                ['id', '!=', auth_user_id()]
            ]);

        if (!empty($city_id)) {
            $data->whereHas('serviceArea', function ($query) use ($city_id) {
                $query->where('city', $city_id);
            });
        }

        $verifiedAgents = $data->get();

        $verifiedAgentsMerged = $verifiedAgents->map(function ($agent) {
            return [
                'id' => $agent->id,
                'name' => $agent->name,
                'user_type' => $agent->user_type,
                'image' => $agent->image ? asset('user_upload/profile_image/' . $agent->image) : null,
                'status' => $agent->status,
                'is_verified_agent' => $agent->is_verified_agent,
                'created_at' => $agent->created_at,
                'updated_at' => $agent->updated_at,
                'address' => optional($agent->userAdditional)->address ?? null,
                'city' => optional($agent->userAdditional)->city ?? null,
                'experience_yr' => optional($agent->agentAdditional)->experience_yr ?? null,
                'operating_since' => optional($agent->agentAdditional)->experience_yr
                    ? now()->subYears($agent->agentAdditional->experience_yr)->format('Y')
                    : null,
                'bussiness_email' => optional($agent->agentAdditional)->bussiness_email ?? null,
                'company_name' => optional($agent->agentAdditional)->company_name ?? null,
                'property_for_sell' => UsersPropertyCount($agent->id)['forSell'],
                'property_for_rent' => UsersPropertyCount($agent->id)['forRent'],
                'project_for_sell' => UsersProjectCount($agent->id)['forSell'],
                'project_for_rent' => UsersProjectCount($agent->id)['forRent'],
            ];
        })->toArray();

        // log::info('MERGED', $verifiedAgentsMerged);
        return $verifiedAgentsMerged;
    }
    public function getAdminData()
    {

        $data = [
            'currancy' => get_setting('site-currency'),
            'currancy_code' => get_setting('site-currency-code'),
            'admin_email' => get_setting('admin-email'),
            'admin_address' => get_setting('admin-address'),
            'admin_whatsapp_number' => get_setting('admin-whatsapp-number')
        ];

        return  $data;
    }
}
