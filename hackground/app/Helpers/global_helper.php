<?php

use App\Models\PrefProject;
use App\Models\PrefProperty;

use App\Models\ProjectSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

if (!function_exists('respondWithToken')) {
    function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }
}

if (!function_exists('set_flash_message')) {
    /**
     * Set a flash message for the session.
     *
     * @param string $message The message to display.
     * @param string $type The type of the message ('success', 'danger', 'warning', etc.).
     * @return void
     */
    function set_flash_message($operation)
    {
        if ($operation == 'add') {
            session()->flash('success_msg', 'Added Successfully');
            session()->flash('message_type', 'success');
        } elseif ($operation == 'update') {
            session()->flash('success_msg', 'Updated Successfully');
            session()->flash('message_type', 'success');
        } elseif ($operation == 'delete') {
            session()->flash('success_msg', 'Deleted Successfully');
            session()->flash('message_type', 'danger');
        } else {
            session()->flash('success_msg', 'Something went wrong');
            session()->flash('message_type', 'warning');
        }
    }
}

if (!function_exists('getTableData')) {
    function getTableData(
        string $table,
        array $fields = ['*'],
        array $joins = [],
        array $conditions = [],
        ?int $paginate = null
    ) {

        $query = DB::table($table)->select($fields);


        foreach ($joins as $join) {
            $query->leftJoin(
                $join['table'],
                $join['base_field'],
                $join['operator'] ?? '=',
                $join['foreign_field']
            );
        }


        foreach ($conditions as $field => $value) {
            if (is_array($value)) {
                $query->where($field, $value[0], $value[1]);
            } else {
                $query->where($field, '=', $value);
            }
        }


        return $paginate ? $query->paginate($paginate) : $query->get();
    }
}

function get_setting($key = '')
{
    $defaults = [
        'smtp-host' => 'localhost',
        'smtp-port' => 587,
        'smtp-encryption' => 'tls',
        'smtp-user' => null,
        'smtp-pass' => null,
        'admin-default-lang' => 'en',
    ];

    if (!Schema::hasTable('pref_all_setting')) {
        return $defaults[$key] ?? null;
    }

    $setting = DB::table('pref_all_setting')
        ->where('setting_key', $key)
        ->value('setting_value');

    return $setting ?? ($defaults[$key] ?? null);
}


if (!function_exists('admin_default_lang')) {
    function admin_default_lang()
    {
        $lang = get_setting('admin-default-lang'); // Fetch the language setting
        return $lang ? $lang : 'en';
    }
}


if (!function_exists('getFieldLang')) {


    function getFieldLang($column = '', $table = '', $where = '', $id = '', $lang = '')
    {
        if (empty($column) || empty($table) || empty($where) || empty($id) || empty($lang)) {
            return '';
        }

        $data = DB::table($table)
            ->select($column)
            ->where($where, $id)
            ->where('lang', $lang)
            ->first();

        if ($data && property_exists($data, $column)) {
            return $data->$column;
        }

        return '';
    }
}

if (!function_exists('AllmenusForSideBar')) {

    function AllmenusForSideBar()
    {

        $role = Auth::guard('admin')->user()->role;

        $allmenus = DB::table('pref_menu_management as mmt')
            ->join('pref_permissions as pt', 'mmt.slug', '=', 'pt.menu_code')
            ->where([
                ['pt.role_id', '=', $role],
            ])
            ->get()->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return $allmenus = null;
    }
}

if (!function_exists('AllmenusForPermissionPage')) {

    function AllmenusForPermissionPage()
    {

        $role = Auth::guard('admin')->user()->role;

        $allmenus = DB::table('pref_menu_management as mmt')
            ->where([
                ['mmt.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->get()->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return $allmenus = null;
    }
}
if (!function_exists('get_name_by_id')) {

    function get_name_by_id($table, $selectname, $id, $lang)
    {
        $result = getTableData(
            $table,
            ['name'],
            [],
            [$selectname => $id, 'lang' => $lang],
            null
        );


        return !empty($result) && isset($result[0]->name) ? $result[0]->name : null;
    }
}

if (!function_exists('decode_id_from_slug')) {

    function decode_id_from_slug($slug)
    {

        if (preg_match('/id=([a-fA-F0-9]+)/', $slug, $matches)) {

            $decodedString = hex2bin($matches[1]);


            $parts = explode('-', $decodedString);


            return isset($parts[0]) ? (int)$parts[0] : null;
        }

        return null;
    }
}

if (!function_exists('extractProjectIdFromSlug')) {
    function extractProjectIdFromSlug($slug)
    {
        // Capture the base64 encoded ID from the slug using regex
        // Remove the project name part (e.g., 'projectname-prjDtId-') to get the encoded ID part
        if (preg_match('/prjDtId-([a-zA-Z0-9+=\/]+)/', $slug, $matches)) {
            $encodedId = $matches[1];  // This should be the base64-encoded ID

            // Decode the base64-encoded project ID
            return base64_decode($encodedId);  // Return the decoded project ID
        }

        throw new \Exception("Invalid slug format");
    }
}
if (!function_exists('get_slug_name')) {

    function get_slug_name($insertedPropertyId, $bedrooms_count, $carpet_area, $super_area, $post_for, $locality, $city, $property_type)
    {

        if (!empty($bedrooms_count) && !empty($carpet_area) && !empty($super_area)) {

            $combinedString = (string)$insertedPropertyId . '-' .
                (string)$bedrooms_count . '-' .
                (string)$carpet_area . '-' .
                (string)$super_area;
        } else {

            $combinedString = (string)$insertedPropertyId . '-' .
                ucfirst($property_type) . '-' .
                ucfirst($post_for);
        }


        $hexEncodedId = strtoupper(bin2hex($combinedString));


        if (!empty($bedrooms_count) && !empty($carpet_area) && !empty($super_area) && !empty($locality) && !empty($city)) {

            $slug = sprintf(
                "%s-BHK-%s-Sq-ft-FOR-%s-%s-in-%s&id=%s",
                is_numeric($bedrooms_count) ? $bedrooms_count : "2",
                is_numeric($carpet_area) && is_numeric($super_area)
                    ? ($carpet_area * $super_area)
                    : "NA",
                ucfirst($post_for ?? "Sale"),
                ucfirst(get_name_by_id('pref_locality_names', 'locality_id', $locality, 'en') ?? "Unknown"),
                ucfirst(get_name_by_id('pref_city_names', 'city_id', $city, 'en') ?? "Unknown"),
                $hexEncodedId
            );
        } else {

            $slug = sprintf(
                "%s-FOR-%s&id=%s",
                ucfirst(get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property_type, 'en') ?? "Unknown"),
                ucfirst($post_for),
                $hexEncodedId
            );
        }

        return $slug;
    }
}
if (!function_exists('get_property_name')) {

    function get_property_name($bedrooms_count, $carpet_area, $super_area, $post_for, $property_type)
    {
        if (!empty($bedrooms_count)) {

            $name = sprintf(
                "%s BHK %s Sq-ft FOR %s",
                is_numeric($bedrooms_count) ? $bedrooms_count : "Unknown",
                is_numeric($carpet_area) && is_numeric($super_area)
                    ? ($carpet_area * $super_area)
                    : "NA",
                ucfirst($post_for)
            );
        } else {

            $name = sprintf(
                "%s FOR %s",
                ucfirst(get_name_by_id('pref_property_sub_category_names', 'sub_category_id', $property_type, 'en') ?? "Unknown"),
                ucfirst($post_for),
            );
        }
        return $name;
    }
}

if (!function_exists('get_project_property_name')) {

    function get_project_property_name($bhk_type, $property_name)
    {
        if (!empty($bhk_type)) {

            $name = sprintf(
                "%s Flat for Sale in %s",
                $bhk_type,
                $property_name
            );
        }
        return $name;
    }
}
if (!function_exists('get_project_property_slug')) {

    function get_project_property_slug($insertedPropertyId, $bhk_type, $super_area)
    {

        if (!empty($bhk_type)  && !empty($super_area)) {

            $combinedString = (string)$insertedPropertyId . '-' .
                (string)$bhk_type . '-' .
                (string)$super_area;
        }


        $hexEncodedId = strtoupper(bin2hex($combinedString));


        if (!empty($bhk_type)  && !empty($super_area)) {

            $slug = sprintf(
                "%s-%s-Sq-ft-FOR-%s&id=%s",
                $bhk_type,
                $super_area,
                ucfirst($post_for ?? "Sale"),
                $hexEncodedId
            );
        }
        return $slug;
    }
}
if (!function_exists('prefixed_table_name')) {
    function prefixed_table_name($tableName)
    {
        return config('database.connections.mysql.prefix') . $tableName;
    }
}

if (!function_exists('get_user_name')) {

    function get_user_name($id)
    {
        $data = getTableData(
            'users',
            ['name'],
            [],
            ['id' => $id],
            null
        );

        return !empty($data) && isset($data[0]->name) ? $data[0]->name : null;
    }
}

if (!function_exists('format_name')) {
    /**
     * Transform a name into a lowercase, URL-friendly format with underscores.
     *
     * @param string $name The name to transform.
     * @return string The transformed name.
     */
    function format_name($name)
    {

        $name = trim($name);


        $name = strtolower($name);


        $name = preg_replace('/\s+/', '_', $name);


        $name = preg_replace('/[^a-zA-Z0-9_]/', '', $name);

        return $name;
    }
}
if (!function_exists('getGalleryWithImages')) {
    function getGalleryWithImages($galleryId)
    {

        $images = DB::table('pref_property_gallary_images')
            ->where('gallary_id', $galleryId)
            ->select('id', 'filename', 'caption')
            ->get();


        $images->transform(function ($image) {
            $image->image_url = asset('user_upload/property_images/' . $image->filename);
            return $image;
        });


        $gallery = DB::table('pref_property_gallary')
            ->where('id', $galleryId)
            ->select('pid as property_id', 'image_type as image_key', 'id as gallary_id')
            ->first();


        if ($gallery) {
            $gallery->images = $images;
        }

        return $gallery;
    }
}
if (!function_exists('getGalleryWithImagesProject')) {
    function updateProjectBudget($project_id)
    {
        $properties = PrefProperty::whereHas('projectMapping', function ($query) use ($project_id) {
            $query->where('project_id', $project_id);
        })->with(['settings'])->get();

        $expectedPrices = $properties->pluck('settings.expected_price')->filter()->toArray();

        if (!empty($expectedPrices)) {
            $countPrices = count($expectedPrices);
            $minBudget = ($countPrices > 1) ? min($expectedPrices) : 0;
            $maxBudget = max($expectedPrices);


            ProjectSetting::where('project_id', $project_id)->update([
                'project_budget' => $minBudget . '-' . $maxBudget
            ]);
        }
    }
}
if (!function_exists('getGalleryWithImagesProject')) {
    function getGalleryWithImagesProject($galleryId)
    {
        // Fetch all images associated with the gallery
        $images = DB::table('pref_project_gallery_images')
            ->where('gallary_id', $galleryId)
            ->select('id', 'filename', 'caption')
            ->get();

        // Transform images to include URLs
        $images->transform(function ($image) {
            $image->file = asset('user_upload/project_images/' . $image->filename);
            return $image;
        });

        // Fetch gallery details
        $gallery = DB::table('pref_project_gallery')
            ->where('id', $galleryId)
            ->select('project_id', 'image_type as image_key', 'id as gallary_id')
            ->first();

        // Attach images to the gallery
        if ($gallery) {
            $gallery->images = $images;
        }

        return $gallery;
    }
}

if (!function_exists('GetProperties_GalleryImages')) {
    function GetProperties_GalleryImages($property_id)
    {

        $galleryImages = DB::table('pref_property_gallary')
            ->join('pref_property_gallary_images', 'pref_property_gallary.id', '=', 'pref_property_gallary_images.gallary_id')
            ->where('pref_property_gallary.pid', $property_id)
            ->select(
                'pref_property_gallary.image_type',
                'pref_property_gallary.description',
                'pref_property_gallary_images.id as image_id',
                'pref_property_gallary_images.gallary_id',
                'pref_property_gallary_images.filename',
                'pref_property_gallary_images.caption',
            )
            ->get();


        return $galleryImages;
    }
}
if (!function_exists('sanitize_slug_part')) {
    function sanitize_slug_part($string)
    {
        // Split the string into two parts at the first occurrence of '&'
        $parts = explode('&', $string, 2);

        // Replace spaces and slashes with a single dash in the first part
        $parts[0] = preg_replace('/[\/\s]+/', '-', $parts[0]); // Replace spaces and slashes with a dash
        $parts[0] = preg_replace('/-{2,}/', '-', $parts[0]); // Remove consecutive dashes

        // Rejoin the string with '&'
        return implode('&', $parts);
    }
    if (!function_exists('getDistance')) {
        function getDistance($lat1, $lon1, $lat2, $lon2)
        {
            $earthRadius = 6371; // Earth's radius in km
            $latDiff = deg2rad($lat2 - $lat1);
            $lonDiff = deg2rad($lon2 - $lon1);

            $a = sin($latDiff / 2) * sin($latDiff / 2) +
                cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
                sin($lonDiff / 2) * sin($lonDiff / 2);

            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

            return $earthRadius * $c; // Distance in km
        }
    }
    if (!function_exists('processProjectGallery')) {
        function processProjectGallery($galleryData)
        {
            return $galleryData->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'pid' => $gallery->pid,
                    'image_type' => $gallery->image_type,
                    'description' => $gallery->description,
                    'images' => $gallery->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'gallary_id' => $image->gallary_id,
                            'filename' => $image->filename,
                            'caption' => $image->caption,
                            'file' => asset('user_upload/project_images/' . $image->filename) // Full URL to the image file
                        ];
                    })->toArray()
                ];
            })->toArray();
        }
    }
    if (!function_exists('processPropertyGallery')) {
        function processPropertyGallery($galleryData)
        {
            return $galleryData->map(function ($gallery) {
                return [
                    'id' => $gallery->id,
                    'pid' => $gallery->pid,
                    'image_type' => $gallery->image_type,
                    'description' => $gallery->description,
                    'images' => $gallery->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'gallary_id' => $image->gallary_id,
                            'filename' => $image->filename,
                            'caption' => $image->caption,
                            'file' => asset('user_upload/property_images/' . $image->filename) // Full URL to the image file
                        ];
                    })->toArray()
                ];
            })->toArray();
        }
    }


    if (!function_exists('propertyTopAgentList')) {
        function propertyTopAgentList($locality)
        {
            // Fetch agent details with average rating in a single query
            $agentDetails = DB::table('users as u')
                ->join('pref_properties as p', 'u.id', '=', 'p.uid')
                ->join('pref_properties_location as pl', 'p.id', '=', 'pl.pid')
                ->leftJoin('agents_rating as ar', 'u.id', '=', 'ar.agent_id')
                ->select('u.id', 'u.name', 'u.image', 'u.email', DB::raw('COALESCE(AVG(ar.rating), 0) as average_rating'))
                ->where([
                    'u.user_type' => 'A',
                    'pl.locality' => $locality,
                ])
                ->groupBy('u.id', 'u.name', 'u.email', 'u.image')
                ->orderByDesc('average_rating')
                ->get()
                ->map(function ($details) {
                    $details->image = asset('user_upload/profile_image/' . $details->image);
                    $details->average_rating = round($details->average_rating, 1);
                    return $details;
                });

            return $agentDetails;
        }
    }
}
