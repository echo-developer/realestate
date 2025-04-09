<?php

use Carbon\Carbon;
use App\Models\User;
use App\Models\Admin;
use App\Models\PrefProject;
use App\Models\ProjectView;
use App\Models\PrefProperty;
use App\Models\PropertyView;
use App\Models\ProjectSetting;
use App\Models\MembershipPlans;
use function PHPSTORM_META\type;
use Illuminate\Http\JsonResponse;

use App\Models\MembershipPlanType;
use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\PHPMailer;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\NotificationTempModel;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;
use App\Notifications\NewUserRegistered;


if (!function_exists('auth_user_id')) {
    function auth_user_id(): ?int
    {
        try {
            $token = request()->header('OSPL');

            if (!$token) {
                return null;
            }

            $token = str_replace('Bearer ', '', $token);

            $user = JWTAuth::setToken($token)->authenticate();

            return optional($user)->id;
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return null;
            logError($e);
        }
    }
}

if (!function_exists('SendMail')) {
    function SendMail($to,  $mail_unique_title, $data_parse = [])
    {
        $mail = new PHPMailer(true);
        $send = '';
        try {
            $mail->isSMTP();
            $mail->Host = get_setting('smtp-host');
            $mail->SMTPAuth = true;
            $mail->Username = get_setting('smtp-user');
            $mail->Password = get_setting('smtp-pass');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = get_setting('smtp-port');
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];


            $mail->setFrom(get_setting('smtp-user'), 'Realestate');
            $mail->addAddress($to);
            $mail->addReplyTo(get_setting('smtp-user'));
            $mailContent = DB::table('email_templates AS et')
                ->select('etn.subject', 'etn.content')
                ->join('email_templates_names AS etn', 'et.id', '=', 'etn.email_template_id')
                ->where([
                    ['et.key', '=', $mail_unique_title],
                    ['etn.lang', '=', 'en']
                ])
                ->first();

            $subject = $mailContent->subject;
            $contents = html_entity_decode($mailContent->content);

            foreach ($data_parse as $key => $val) {
                $contents = str_replace('{' . $key . '}', $val, $contents);
            }
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
            $mail->ContentType = 'text/html';
            $mail->Subject = $subject;
            $mail->Body = nl2br($contents);
            $mail->AltBody = strip_tags($contents);
            $send = $mail->send();
        } catch (Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Email failed to send',
                'error' => $mail->ErrorInfo
            ]);
        }
        return $send;
    }
}


if (!function_exists('UniquePropertyCode')) {
    function UniquePropertyCode($propertyId)
    {
        return 'RE-' . str_pad($propertyId, 6, '0', STR_PAD_LEFT);
    }
}


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

    if (!Schema::hasTable('all_setting')) {
        return $defaults[$key] ?? null;
    }

    $setting = DB::table('all_setting')
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

        $allmenus = DB::table('menu_management as mmt')
            ->leftJoin('permissions as pt', 'mmt.slug', '=', 'pt.menu_code');

        if ($role != 1) {
            $allmenus->where('pt.role_id', '=', $role);
        }

        $allmenus = $allmenus->orderBy('id', 'asc')->get()->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return null;
    }
}

if (!function_exists('AllmenusForPermissionPage')) {

    function AllmenusForPermissionPage()
    {

        $role = Auth::guard('admin')->user()->role;

        $allmenus = DB::table('menu_management as mmt')
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
                ucfirst(get_name_by_id('locality_names', 'locality_id', $locality, 'en') ?? "Unknown"),
                ucfirst(get_name_by_id('city_names', 'city_id', $city, 'en') ?? "Unknown"),
                $hexEncodedId
            );
        } else {

            $slug = sprintf(
                "%s-FOR-%s&id=%s",
                ucfirst(get_name_by_id('property_sub_category_names', 'sub_category_id', $property_type, 'en') ?? "Unknown"),
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
                ucfirst(get_name_by_id('property_sub_category_names', 'sub_category_id', $property_type, 'en') ?? "Unknown"),
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

        $images = DB::table('property_gallary_images')
            ->where('gallary_id', $galleryId)
            ->select('id', 'filename', 'caption')
            ->get();


        $images->transform(function ($image) {
            $image->image_url = asset('user_upload/property_images/' . $image->filename);
            return $image;
        });


        $gallery = DB::table('property_gallary')
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
        $images = DB::table('project_gallery_images')
            ->where('gallary_id', $galleryId)
            ->select('id', 'filename', 'caption')
            ->get();

        // Transform images to include URLs
        $images->transform(function ($image) {
            $image->file = asset('user_upload/project_images/' . $image->filename);
            return $image;
        });

        // Fetch gallery details
        $gallery = DB::table('project_gallery')
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

        $galleryImages = DB::table('property_gallary')
            ->join('property_gallary_images', 'property_gallary.id', '=', 'property_gallary_images.gallary_id')
            ->where('property_gallary.pid', $property_id)
            ->select(
                'property_gallary.image_type',
                'property_gallary.description',
                'property_gallary_images.id as image_id',
                'property_gallary_images.gallary_id',
                'property_gallary_images.filename',
                'property_gallary_images.caption',
            )
            ->get();


        return $galleryImages;
    }
}

if (!function_exists('getProjectImages')) {
    function getProjectImages($project_id)
    {

        $galleryImages = DB::table('project_gallery')
            ->join('project_gallery_images', 'project_gallery.id', '=', 'project_gallery_images.gallary_id')
            ->where('project_gallery.project_id', $project_id)
            ->select(
                'project_gallery.image_type',
                'project_gallery.description',
                'project_gallery_images.id as image_id',
                'project_gallery_images.gallary_id',
                'project_gallery_images.filename',
                'project_gallery_images.caption',
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
}


if (!function_exists('UsersPropertyCount')) {
    function UsersPropertyCount($user_id)
    {
        $userPropertyCounts = PrefProperty::with('settings')
            ->where(['uid' => $user_id, 'is_deleted' => config('constants.STATUS_INACTIVE')])
            ->whereHas('settings', function ($qry) {
                $qry->whereIn('post_for', ['sale', 'rent', '', null]);
            })
            ->get()
            ->groupBy('settings.post_for')
            ->map(fn($group) => $group->count());

        return [
            'forSell' => $userPropertyCounts->get('sale', 0),
            'forRent' => $userPropertyCounts->get('rent', 0),
            'unknown' => $userPropertyCounts->get('', 0) + $userPropertyCounts->get(null, 0),  //just checking if any property with blank or null post_for
        ];
    }
}

if (!function_exists('propertyCountbasedOnStatus')) {
    function propertyCountbasedOnStatus($user_id, $status)
    {
        $count = PrefProperty::with('settings')
            ->where([
                'uid' => $user_id,
                'is_deleted' => config('constants.STATUS_INACTIVE'),
                'status' => $status,
            ])
            ->count();

        return !empty($count) ? $count : 0;
    }
}
if (!function_exists('UsersProjectCount')) {
    function UsersProjectCount($user_id)
    {
        $userProjectCounts = PrefProject::with('settings')
            ->where(['uid' => $user_id, 'is_deleted' => config('constants.STATUS_INACTIVE')])
            ->whereHas('settings', function ($qry) {
                $qry->whereIn('post_for', ['sale', 'rent', '', null]);
            })
            ->get()
            ->groupBy('settings.post_for')
            ->map(fn($group) => $group->count());

        return [
            'forSell' => $userProjectCounts->get('sale', 0),
            'forRent' => $userProjectCounts->get('rent', 0),
            'unknown' => $userProjectCounts->get('', 0) + $userProjectCounts->get(null, 0), //just checking if any project with blank or null post_for
        ];
    }
}


if (!function_exists('propertyTopAgentList')) {
    function propertyTopAgentList($locality)
    {
        // Fetch agent details with average rating in a single query
        $agentDetails = DB::table('users as u')
            ->leftJoin('agent_service_location as sl', 'u.id', '=', 'sl.agent_id')
            ->leftJoin('agents_rating as ar', 'u.id', '=', 'ar.agent_id')
            ->select('u.id', 'u.name', 'u.image', 'u.email', DB::raw('COALESCE(AVG(pref_ar.rating), 0) as average_rating'))
            ->where([
                'u.user_type' => 'A',
                'sl.locality' => $locality,
            ])
            ->groupBy('u.id', 'u.name', 'u.email', 'u.image')
            ->orderByDesc('average_rating')
            ->get()
            ->map(function ($details) {
                $details->image = $details->image ? asset('user_upload/profile_image/' . $details->image) : null;
                $details->average_rating = round($details->average_rating, 1);
                return $details;
            });
        return $agentDetails;
    }
}

if (!function_exists('convertToSqft')) {

    function convertToSqft($value, $unitType)
    {
        if ($unitType === 'sqft') {
            return $value;
        } elseif ($unitType === 'sqm') {
            return $value * 10.7639;
        } elseif ($unitType === 'acre') {
            return $value * 43560;
        }

        return $value;
    }
}


if (!function_exists('logError')) {

    function logError($e)
    {
        Log::error('ERROR ======>>>>: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);
    }
}


if (!function_exists('user_property_name_slug')) {

    function user_property_name_slug($user_id)
    {
        $user_properties = DB::table('properties')
            ->select('id', 'name', 'slug')
            ->where('uid', $user_id)
            ->get()
            ->filter(fn($property) => $property->name != null && $property->slug != null)->values();
        return $user_properties;
    }
}

if (!function_exists('user_project_name_slug')) {

    function user_project_name_slug($user_id)
    {
        $user_projects = DB::table('project')
            ->select('id', 'project_name', 'slug')
            ->where('uid', $user_id)
            ->get()
            ->filter(fn($project) => $project->project_name != null && $project->slug != null)->values();;
        return $user_projects;
    }
}


if (!function_exists('fetch_enquery_count')) {

    function fetch_enquery_count($user_id, $enqueryFor)
    {
        $table = $enqueryFor === 'project' ? 'project_enquery' : 'property_enquiry';

        $enqueryCount = DB::table($table);

        if ($table == 'project_enquery') {
            $enqueryCount->where([
                'status' => config('constants.STATUS_ACTIVE'),
                'assign_to' => $user_id,
            ]);
        } else {
            $enqueryCount->where([
                'assign_to' => $user_id,
                'is_deleted' => config('constants.STATUS_INACTIVE'),
            ]);
        }

        return $enqueryCount->count();
    }
}

if (!function_exists('fetch_totalViews_count')) {

    function fetch_totalViews_count($user_id, $viewsFor)
    {
        $model = ($viewsFor === 'property') ? PropertyView::class : ProjectView::class;

        $viewsCount = $model::query();

        $totalCount = $viewsCount->where('user_id', $user_id)->sum('view_count');
        $lastWeekCount = $viewsCount
            ->where('user_id', $user_id)
            ->where('view_date', '>=', now()->subWeek()->startOfWeek())
            ->sum('view_count');


        return [
            'totalViews' => $totalCount ?? 0,
            'lastWeekViews' => $lastWeekCount ?? 0,
        ];
    }
}

if (!function_exists('fetch_totalReview_count_of_property')) {
    function fetch_totalReview_count_of_property($user_id)
    {
        $allReviews = DB::table('property_reviews')
            ->select('property_reviews.id', 'property_reviews.created_at')
            ->leftJoin("property_review_additional", "property_reviews.id", '=', 'property_review_additional.review-id')
            ->where([
                'property_reviews.property_uid' => $user_id,
                'property_review_additional.status' => config('constants.STATUS_ACTIVE'),
            ])
            ->get();

        $reviewLastWeek = $allReviews->filter(function ($review) {
            return $review->created_at >= now()->subWeek()->startOfWeek();
        });

        return [
            'totalCount' => $allReviews->count() ?? 0,
            'lastweekCount' => $reviewLastWeek->count() ?? 0,
        ];
    }
}

if (!function_exists('fetch_totalReview_count_of_project')) {

    function fetch_totalReview_count_of_project($user_id)
    {
        $allReviews = DB::table('project_reviews')
            ->select('project_reviews.id', 'project_reviews.created_at')
            ->leftJoin("project_review_additional", "project_reviews.id", '=', 'project_review_additional.review_id')
            ->where([
                'project_reviews.project_uid' => $user_id,
                'project_review_additional.status' => config('constants.STATUS_ACTIVE'),
            ])
            ->get();

        $reviewLastWeek = $allReviews->filter(function ($review) {
            return $review->created_at >= now()->subWeek()->startOfWeek();
        });

        return [
            'totalCount' => $allReviews->count(),
            'lastweekCount' => $reviewLastWeek->count(),
        ];
    }
}

if (!function_exists('recordView')) {
    function recordView(string $type, int $id, ?int $loggedUser = null): void
    {
        try {
            $viewModel = ($type === 'property') ? PropertyView::class : ProjectView::class;
            $itemModel = ($type === 'property') ? PrefProperty::class : PrefProject::class;

            $ownerId = $itemModel::query()->where('id', $id)->value('uid');
            if ($ownerId === $loggedUser) {
                return;
            }

            // $cookieName = "viewed_{$type}_{$id}";
            // if (request()->hasCookie($cookieName)) {
            //     return;
            // }

            $view = $viewModel::query()
                ->where("{$type}_id", $id)
                ->whereDate('view_date', now()->toDateString())
                ->first();

            if ($view) {
                $view->increment('view_count');
            } else {
                $viewModel::query()->create([
                    "{$type}_id" => $id,
                    'user_id'   => $ownerId ?? null,
                    'view_date' => now()->toDateString(),
                    'view_count' => 1,
                ]);
            }

            $totalViews = $viewModel::query()->where("{$type}_id", $id)->sum('view_count');

            if ($type === 'project' && $totalViews > 10) {
                PrefProject::where('id', $id)->update([
                    'is_popular' => config('constants.STATUS_ACTIVE'),
                ]);
            } elseif ($type === 'property' && $totalViews > 10) {
                PrefProperty::where('id', $id)->update([
                    'is_populer' => config('constants.STATUS_ACTIVE'),
                ]);
            }
        } catch (\Exception $e) {
            logError($e);
        }
    }
}

if (!function_exists('getGalleriesCount')) {
    function getGalleriesCount(?int $id = null, string $type = ''): ?int
    {
        if ($id === null || $type === '') {
            return null;
        }

        $modelClass = match ($type) {
            'project' => PrefProject::class,
            'property' => PrefProperty::class,
            default => null,
        };

        if (!$modelClass) {
            return null;
        }

        $model = $modelClass::with('gallery.images')->find($id);

        return $model?->gallery ? collect($model->gallery)->sum(fn($gallery) => $gallery->images->count()) : 0;
    }
}

if (!function_exists('getUserDetails')) {
    function getUserDetails($uid)
    {
        try {
            $user = User::where([
                'id' => $uid,
                'status' => config('constants.STATUS_ACTIVE')
            ])
                ->with(['userAdditional', 'agentAdditional'])
                ->first(); // Fetch only one record

            if ($user) {
                $user->image = !empty($user->image) ? asset('user_upload/profile_image/' . $user->image) : null;
            }

            return $user;
        } catch (\Exception $e) {
            logError($e);
        }
    }
}

if (!function_exists('propertyLeadsCount')) {
    function propertyLeadsCount($property_id)
    {
        $count = DB::table('property_enquiry as p_e')
            ->where(['p_e.property_id' => $property_id,])
            ->count();

        return !empty($count) ? $count : 0;
    }
}


if (!function_exists('projectLeadsCount')) {
    function projectLeadsCount($project_id)
    {
        $count = DB::table('property_enquiry as p_e')
            ->where(['p_e.project_id' => $project_id])
            ->count();

        return !empty($count) ? $count : 0;
    }
}

if (!function_exists('memberLeadsCount')) {
    function memberLeadsCount($user_id)
    {
        $count = DB::table('leads_assigned as l_a')
            ->where(['l_a.user_id' => $user_id])
            ->count();

        return !empty($count) ? $count : 0;
    }
}

if (!function_exists('print_select_option')) {

    function print_select_option($array = array(), $value = '', $name = '', $selected = '')
    {
        if (count($array) > 0) {

            if (!empty($value) && !empty($name)) {

                foreach ($array as $k => $v) {
                    $select = '';

                    if (!empty($selected)) {
                        if ($selected == $v[$value]) {
                            $select = 'selected';
                        }
                    }
                    if ($select) {
                        echo  '<option value="' . $v[$value] . '" ' . $select . '>' . $v[$name] . '</option>';
                    } else {
                        echo  '<option value="' . $v[$value] . '">' . $v[$name] . '</option>';
                    }
                }
            } else {

                foreach ($array as $k => $v) {
                    if (!is_array($v)) {

                        $select = '';
                        if (!empty($selected)) {
                            if ($selected == $v) {
                                $select = 'selected';
                            }
                        }
                        if ($select) {
                            echo  '<option value="' . $v . '" ' . $select . '>' . $v . '</option>';
                        } else {
                            echo  '<option value="' . $v . '">' . $v . '</option>';
                        }
                    }
                }
            }
        }
    }
    if (!function_exists('log_anything')) {
        function log_anything($data)
        {
            log::info($data);
        }
    }
}

if (!function_exists('get_lang')) {
    function get_lang()
    {
        $lang = get_setting('admin-default-lang'); // Fetch the language setting
        $lang_string = $lang ? $lang : 'en';
        $lang_arr = explode(',', $lang_string);
        return $lang_arr;
    }
}

if (!function_exists('get_property_category_name')) {
    function get_property_category_name($id)
    {
        $result = DB::table('property_category as p_c')
            ->join('property_category_names as p_c_n', 'p_c.id', '=', 'p_c_n.category_id')
            ->where('p_c.id', $id)
            ->first();

        return $result->name;
    }
}

if (!function_exists('get_property_sub_category_name')) {
    function get_property_sub_category_name($id)
    {
        $result = DB::table('property_sub_category as p_s')
            ->join('property_sub_category_names as p_s_n', 'p_s.id', '=', 'p_s_n.sub_category_id')
            ->where('p_s.id', $id)
            ->first();

        return $result->name;
    }
}

if (!function_exists('get_all_country')) {
    function get_all_city()
    {
        $result = DB::table('city as c')
            ->select('c.city_id', 'c_n.name')
            ->leftJoin('city_names as c_n', 'c.city_id', '=', 'c_n.city_id')
            ->where(['c.status' => '1', 'c_n.lang' => 'en'])
            ->get();

        return $result;
    }
}

if (!function_exists('get_all_property_category')) {
    function get_all_property_category()
    {
        $result = DB::table('property_category as p_c')
            ->select('p_c.*', 'p_c_n.name')
            ->join('property_category_names as p_c_n', 'p_c.id', '=', 'p_c_n.category_id')
            ->where(['p_c.status' => '1', 'p_c_n.lang' => 'en'])
            ->get();

        return $result;
    }
}

if (!function_exists('get_user_plan')) {
    function get_user_plan($user_id = '')
    {
        if (empty($user_id)) {
            return null;
        }

        $today = now()->toDateString();

        return DB::table('user_membership')
            ->where('user_id', $user_id)
            ->where('expire_date', '>=', $today)
            ->pluck('plan_id');
    }
}
if (!function_exists('get_user_membership')) {
    function get_user_membership($user_id = '')
    {

        $membership_id = get_user_plan($user_id);
        return DB::table('user_membership')->select(
            'id',
            'relationship_manager',
            'owner_contacted',
            'remaining_listings_allowed',
            'verified_badge',
            'listing_visibility',
            'social_media_promotion'
        )
            ->where([
                ['plan_id', $membership_id],
            ])
            ->get();
    }
}
if (!function_exists('get_remaining_values')) {
    function get_remaining_values($field, $login_user)
    {
        if (empty($field) || empty($login_user)) {
            return null; // Prevent empty queries
        }

        $today = now()->toDateString(); // Get the current date
        $membership_id = get_user_plan($login_user);

        if (!$membership_id) {
            return null;
        }
        $count_det = DB::table('user_membership')
            ->where('user_id', $login_user)
            ->where('expire_date', '>=', $today)
            ->value($field);

        return $count_det;
    }
}

if (!function_exists('debit_membership_feature_value')) {
    function debit_membership_feature_value($field, $remaining_field, $user_id)
    {
        if (empty($field) || empty($remaining_field)) {
            return false;
        }

        $login_user = auth_user_id() ?? $user_id;

        if (!$login_user) {
            return false;
        }

        $count_det = DB::table('user_membership')
            ->where('user_id', $login_user)
            ->select('plan_id', $field, $remaining_field)
            ->first();

        if (!$count_det || $count_det->$remaining_field <= 0) {
            return false;
        }

        DB::table('user_membership')
            ->where('plan_id', $count_det->plan_id)
            ->update([$remaining_field => DB::raw("$remaining_field - 1")]);

        return true;
    }
}

if (!function_exists('assign_free_plan')) {
    function assign_free_plan($user_id, $transactionId = null)
    {

        $planDetails = MembershipPlans::with('plan_features')->where('plan_type_id', 1)->first();


        $subscriptionDate = now();
        $expireDate = now()->addDays($planDetails->validity_days);

        DB::transaction(function () use ($user_id, $transactionId, $subscriptionDate, $expireDate, $planDetails) {
            $features = $planDetails->plan_features;

            DB::table('user_membership')->where('user_id', $user_id)->delete();

            DB::table('user_membership')->insert([
                'user_id'               => $user_id,
                'transaction_id'        => $transactionId ?? null,
                'plan_id'               => 1,
                'subcription_date'      => $subscriptionDate,
                'expire_date'           => $expireDate,
                'owner_contacted'       => $features->owner_contacted ?? null,
                'listings_allowed'      => $features->listings_allowed ?? null,
                'relationship_manager'  => $features->relationship_manager ?? 'N',
                'verified_badge'        => $features->verified_badge ?? 'N',
                'listing_visibility'    => $features->listing_visibility ?? null,
                'social_media_promotion' => $features->social_media_promotion ?? 'N',
                'remaining_owner_contacted' => $features->owner_contacted,
                'remaining_listings_allowed' => $features->listings_allowed,
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        });

        return true;
    }
}

if (!function_exists('get_floor_types')) {
    function get_floor_types($key='')
    {
        $types = [
            'mosaic' => 'Mosaic',
            'vitrified' => 'Vitrified',
            'wooden' => 'Wooden',
            'marbonite' => 'Marble',
            'granite' => 'Granite',
            'normal_tiles' => 'Normal Tiles/Kotah Stone',
            'ceramic_tiles' => 'Ceramic Tiles'
        ];

        if($key)
        {
            $selectedType = $types['key'] ?? '';
            return $selectedType;
        }else{
            return $types;
        }
        
    }
}

if (!function_exists('get_floor_numbers')) {
    function get_floor_numbers($key='')
    {
        $types = [
            '1' => 'Lower Basement',
            '2' => 'Upper Basement',
            '3' => 'Ground',
            '4' => '1',
            '5' => '2',
            '6' => '3',
            '7' => '4',
            '8' => '5',
            '9' => '6',
            '10' => '7',
        ];
        
        if($key)
        {
            $selectedType = $types['key'] ?? '';
            return $selectedType;
        }else{
            return $types;
            $planDetails = MembershipPlans::with('plan_features')->where('plan_type_id', 1)->first();

            $subscriptionDate = now();
            $expireDate = now()->addDays($planDetails->validity_days);

            DB::transaction(function () use ($user_id, $transactionId, $subscriptionDate, $expireDate, $planDetails) {
                $features = $planDetails->plan_features;

                DB::table('user_membership')->where('user_id', $user_id)->delete();

                DB::table('user_membership')->insert([
                    'user_id'               => $user_id,
                    'transaction_id'        => $transactionId ?? null,
                    'plan_id'               => 1,
                    'subcription_date'      => $subscriptionDate,
                    'expire_date'           => $expireDate,
                    'owner_contacted'       => $features->owner_contacted ?? null,
                    'listings_allowed'      => $features->listings_allowed ?? null,
                    'relationship_manager'  => $features->relationship_manager ?? 'N',
                    'verified_badge'        => $features->verified_badge ?? 'N',
                    'listing_visibility'    => $features->listing_visibility ?? null,
                    'social_media_promotion' => $features->social_media_promotion ?? 'N',
                    'remaining_owner_contacted' => $features->owner_contacted,
                    'remaining_listings_allowed' => $features->listings_allowed,
                    'created_at'            => now(),
                    'updated_at'            => now(),
                ]);
            });

            return true;

        }
    }
}

if (!function_exists('get_total_floors')) {
    function get_total_floors($key='')
    {
        $types = [
            'total_floor_1' => '1',
            'total_floor_2' => '2',
            'total_floor_3' => '3',
            'total_floor_4' => '4',
            'total_floor_5' => '5',
            'total_floor_6' => '6',
            'total_floor_7' => '7',
            'total_floor_8' => '8',
            'total_floor_9' => '9',
            'total_floor_10' => '10'
        ];
        
        if($key)
        {
            $selectedType = $types['key'] ?? '';
            return $selectedType;
        }else{
            return $types;
        }
    }
}

if (!function_exists('flats_in_floor')) {
    function flats_in_floor($key='')
    {
        $types = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10'
        ];
        
        return $types;
        
    }
}

if (!function_exists('lifts_in_tower')) {
    function lifts_in_tower($key='')
    {
        $types = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10'
        ];
        
        return $types;
        
    }
}



if (!function_exists('notify_admins_with_template')) {
    function notify_admins_with_template($templateKey, $replacements = [], $lang = 'en')
    {
        $template = DB::table('notification_templates')->join('notification_templates_names', 'notification_templates.id', '=', 'notification_templates_names.notification_template_id')
            ->where('template_key', $templateKey)
            ->where('notification_templates_names.lang', $lang)
            ->select('notification_templates.template_for', 'notification_templates_names.content')
            ->first();


        if (!$template) return;
        $body = $template->content;
        $title = $template->template_for;
        foreach ($replacements as $key => $value) {
            $body = str_replace("{" . $key . "}", $value, $body);
            $title = str_replace("{" . $key . "}", $value, $title);
        }

        DB::table('admin_notifications')->insert([
            'message'       => $body,
            'created_date'  => Carbon::now(),
            'read_status'   => 0,
            'link'          => $replacements['link'] ?? null,
            'template_key'  => $templateKey,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
    }
}
