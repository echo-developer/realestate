<?php

namespace App\Models\Api;

use App\Models\PrefProject;
use App\Models\PrefProperty;
use App\Models\ProjectFavorite;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class ApiModel extends Model
{
    use HasFactory;

    protected $auth_user_id;
    public function __construct()
    {
        $this->auth_user_id = auth_user_id() ?? null;
    }
    public function getPropertyType(string $lang)
    {
        return getTableData(
            'property_category_names',
            ['property_category_names.category_id', 'property_category_names.name as category_name', 'property_category.slug as category_key', 'property_category.image'],
            [
                [
                    'table' => 'property_category',
                    'base_field' => 'property_category_names.category_id',
                    'foreign_field' => 'property_category.id',
                    'operator' => '='
                ]
            ],
            [
                'lang' => $lang,
                'property_category.status' => config('constants.STATUS_ACTIVE')
            ],
            null
        );
    }

    public function getPropertyTypeFor(string $lang, $id)
    {

        return getTableData(
            'property_sub_category_names',
            [
                'property_sub_category_names.sub_category_id',
                'property_sub_category.slug as subcategory_key',
                'property_sub_category.image',
                'property_sub_category_names.name as sub_category_name',
            ],
            [
                [
                    'table' => 'property_sub_category',
                    'base_field' => 'property_sub_category_names.sub_category_id',
                    'foreign_field' => 'property_sub_category.id',
                    'operator' => '='
                ]

            ],
            [
                'property_sub_category_names.lang' => $lang,
                'property_sub_category.category_id' => $id
            ],
            null
        );
    }
    public function getPropertyCity(string $lang)
    {
        return getTableData(
            'property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyState(string $lang)
    {
        return getTableData(
            'property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyCountry(string $lang)
    {
        return getTableData(
            'property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getCity(string $lang)
    {
        return getTableData(
            'city_names',
            ['city_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyBudget()
    {
        return getTableData(
            'property_budget',
            ['id as budget_id', 'max_budget', 'min_budget'],
            [],
            ['status' => config('constants.STATUS_ACTIVE')],
            null
        );
    }
    public function getPropertyAmnity(string $lang)
    {
        $amenities =  getTableData(
            'project_amenity_names',
            ['project_amenity_names.amenity_id', 'project_amenity_names.name as amenity_name', 'project_amenity.image'],
            [
                [
                    'table' => 'project_amenity',
                    'base_field' => 'project_amenity_names.amenity_id',
                    'operator' => '=',
                    'foreign_field' => 'project_amenity.id',
                ]
            ],
            ['lang' => $lang],
            null
        );
        $amenitiesMapped = $amenities->map(function ($items) {
            $items->image = !empty($items->image) ? asset('user_upload/amenity_image/' . $items->image) : '';
            return $items;
        });

        return $amenitiesMapped;
    }


    public function getLocality(String $lang, $id)
    {

        return getTableData(
            'locality_names',
            [
                'locality_names.locality_id',
                'locality_names.name as locality_name',
                'locality.latitude',
                'locality.longitude',
            ],
            [
                [
                    'table' => 'locality',
                    'base_field' => 'locality_names.locality_id',
                    'operator' => '=',
                    'foreign_field' => 'locality.locality_id'
                ]
            ],
            [
                'locality_names.lang' => $lang,
                'locality.city' => $id,
                'locality.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }


    public function getFurnish(String $lang)
    {

        return getTableData(
            'property_furnish_names',
            [
                'property_furnish_names.furnish_id',
                'property_furnish_names.name as furnish_name',
            ],
            [
                [
                    'table' => 'property_furnish',
                    'base_field' => 'property_furnish_names.furnish_id',
                    'operator' => '=',
                    'foreign_field' => 'property_furnish.id'
                ]
            ],
            [
                'property_furnish_names.lang' => $lang,
                'property_furnish.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }

    public function getPropertyStatus(String $lang)
    {

        return getTableData(
            'property_status_names',
            [
                'property_status_names.status_id',
                'property_status_names.name as status_name',
            ],
            [
                [
                    'table' => 'property_status',
                    'base_field' => 'property_status_names.status_id',
                    'operator' => '=',
                    'foreign_field' => 'property_status.id'
                ]
            ],
            [
                'property_status_names.lang' => $lang,
                'property_status.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }

    public function basePropertyQuery()
    {
        return DB::table('properties')
            ->select(
                'properties.id as property_id',
                'properties.name as property_name',
                'properties.slug',
                'properties_settings.property_type',
                'properties.uid',
                'properties.status',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.plot_area',
                'properties.views',
                'properties.is_featured',
                'properties.is_populer',
                'properties.is_top',
                'properties_settings.parking_ability',
                'properties_settings.post_for',
                'properties_settings.property_type_for',
                'properties_settings.bedrooms',
                'properties_settings.expected_price',
                'properties_settings.price_currency',
                'properties.created_at',
                'properties_location.property_address',
                'properties_location.latitude',
                'properties_location.longitude',
            )
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->leftJoin('property_gallary', 'properties.id', '=', 'property_gallary.pid')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->where('properties.is_deleted', '=', 0)
            ->groupBy(
                'properties.id',
                'properties.uid',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.plot_area',
                'properties.name',
                'properties.slug',
                'properties_settings.property_type',
                'properties_settings.post_for',
                'properties.status',
                'properties.views',
                'properties.is_populer',
                'properties.is_featured',
                'properties.is_top',
                'properties_settings.parking_ability',
                'properties_settings.property_type_for',
                'properties_settings.bedrooms',
                'properties_settings.expected_price',
                'properties_settings.price_currency',
                'properties.created_at',
                'properties_location.property_address',
                'properties_location.latitude',
                'properties_location.longitude',
            );
    }
    public function GetProperties()
    {
        return $this->basePropertyQuery()
            ->leftJoin('property_additional', 'properties.id', '=', 'property_additional.pid')
            ->addSelect(
                'property_additional.property_amenity',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget',
                'properties_settings.unit_type',
                'property_additional.is_personal_washroom',
                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.washroom',

                'property_additional.construction_done',
                'property_additional.is_gated_colony',
                'property_additional.boundary_wall',
                'property_additional.road_width',
                'property_additional.total_open_sides',
                'property_additional.approved_by',

                'property_additional.flooring_style',
                'property_additional.possession_status',
                'property_additional.construct_year',
                'property_additional.expected_possesion_month_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'properties_location.locality',

            )
            ->groupBy(
                'property_additional.property_amenity',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget',
                'properties_settings.unit_type',
                'property_additional.is_personal_washroom',
                'property_additional.washroom',

                'property_additional.construction_done',
                'property_additional.is_gated_colony',
                'property_additional.boundary_wall',
                'property_additional.road_width',
                'property_additional.total_open_sides',
                'property_additional.approved_by',

                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.flooring_style',
                'property_additional.possession_status',
                'property_additional.construct_year',
                'property_additional.expected_possesion_month_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'properties_location.locality',
            )
            ->where('properties.status', '=', config('constants.STATUS_ACTIVE'))
            ->get();
    }

    public function getUser($id)
    {
        return getTableData(
            'users',
            [
                'users.name',
                'users.image',
            ],
            [],
            [
                'users.id' => $id,
            ],
            null
        )->first();
    }



    public function getUserPropertyList($user_id)
    {
        return $this->basePropertyQuery()
            ->addSelect(
                'properties_settings.unit_type',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'property_additional.brochure_file',
            )
            ->leftJoin('property_additional', 'properties.id', '=', 'property_additional.pid')
            ->groupBy(
                'properties_settings.unit_type',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'property_additional.brochure_file',
            )
            ->where('properties.uid', '=', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getUserPropertyDetails($p_id)
    {
        return $this->basePropertyQuery()
            ->addSelect(
                'property_additional.property_amenity',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget',
                'properties_settings.unit_type',
                'property_additional.is_personal_washroom',
                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.washroom',

                'property_additional.construction_done',
                'property_additional.is_gated_colony',
                'property_additional.boundary_wall',
                'property_additional.road_width',
                'property_additional.total_open_sides',
                'property_additional.approved_by',
                'property_additional.launch_date',
                'property_additional.ceiling_height',

                'property_additional.flooring_style',
                'property_additional.possession_status',
                'property_additional.construct_year',
                'property_additional.expected_possesion_month_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'properties_location.locality',

            )
            ->leftJoin('property_additional', 'properties.id', '=', 'property_additional.pid')
            ->where('properties.id', '=', $p_id)
            ->groupBy(
                'property_additional.property_amenity',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft',
                'properties_settings.property_budget',
                'properties_settings.unit_type',
                'property_additional.is_personal_washroom',
                'property_additional.washroom',

                'property_additional.construction_done',
                'property_additional.is_gated_colony',
                'property_additional.boundary_wall',
                'property_additional.road_width',
                'property_additional.total_open_sides',
                'property_additional.approved_by',
                'property_additional.launch_date',
                'property_additional.ceiling_height',

                'property_additional.pantry_cafeteria_status',
                'property_additional.is_corner_shop',
                'property_additional.faces_main_road',
                'property_additional.flooring_style',
                'property_additional.possession_status',
                'property_additional.construct_year',
                'property_additional.expected_possesion_month_year',
                'property_additional.property_furnish',
                'property_additional.electric_available',
                'property_additional.water_available',
                'property_additional.lifts_in_tower',
                'property_additional.flat_each_floor',
                'property_additional.facing_direction',
                'property_additional.car_parking',
                'property_additional.overlooking',
                'property_additional.ownership_type',
                'property_additional.property_desc',
                'properties_location.locality',

            )
            ->get();
    }

    public function getPropertyAmnitybyID($amenity_ids, $lang = 'en')
    {
        // Log::info("amenity_ids:\n" . json_encode($amenity_ids, JSON_PRETTY_PRINT));
        $amenities = DB::table('project_amenity_names')
            ->join('project_amenity', 'project_amenity_names.amenity_id', '=', 'project_amenity.id')
            ->select(
                'project_amenity_names.amenity_id',
                'project_amenity.image as amenity_image',
                'project_amenity_names.name as amenity_name',
            )
            ->where([
                'project_amenity.status' => config('constants.STATUS_ACTIVE'),
                'project_amenity_names.lang' => $lang
            ])
            ->whereIn('project_amenity_names.amenity_id', $amenity_ids)
            ->get();

        $amenityArray = $amenities->map(function ($amenity) {
            return [
                'amenity_name' => $amenity->amenity_name ?? null,
                'image' => $amenity->amenity_image ? asset('user_upload/amenity_image/' . $amenity->amenity_image) : '',
            ];
        });
        return $amenityArray;
    }


    public function PropertyfavoriteStaus($data)
    {
        $insertresponce = DB::table('properties')
            ->where([
                'uid' => $data['userID'],
                'id' => $data['propID'],
            ])
            ->update([
                'is_favorite' => $data['is_favorite']
            ]);

        return $insertresponce;
    }

    public function changePassword(array $data)
    {
        // Log::info("Password update request: " . json_encode($data, JSON_PRETTY_PRINT));

        $user = DB::table('users')->where('id', $data['user_id'])->first();

   

        $updated = DB::table('users')
            ->where('id', $data['user_id'])
            ->update(['password' => Hash::make($data['newpassword'])]);

        return $updated;
    }

    public function DeleteProperty($prop_id)
    {

        $is_deleted = DB::table('properties')
            ->where('id', $prop_id)
            ->update(['is_deleted' => config('constants.STATUS_ACTIVE')]);

        return $is_deleted;
    }

    public function GetPropertyAmenities($prop_id)
    {
        $amenities = DB::table('property_additional')
            ->where('pid', $prop_id)
            ->pluck('property_amenity');
        // Log::info("Request in controller:\n" . json_encode($amenities, JSON_PRETTY_PRINT));
        return  $amenities;
    }

    public function GetProjectAmenities($project_id)
    {
        $amenities = DB::table('project_additional')
            ->where('project_id', $project_id)
            ->pluck('project_amenity');
        // Log::info("Request in controller:\n" . json_encode($amenities, JSON_PRETTY_PRINT));
        return  $amenities;
    }

    public function UpdatePropertyAmenities($data)
    {
        // Log::info("Request in model:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $upd_amenity = DB::table('property_additional')
            ->where('pid', $data['prop_id'])
            ->update(['property_amenity' => $data['id_string']]);

        return $upd_amenity;
    }

    public function UpdateProjectAmenities($data)
    {
        $upd_amenity = DB::table('project_additional')
            ->where('project_id', $data['proj_id'])
            ->update(['project_amenity' => $data['id_string']]);

        return $upd_amenity;
    }


    public function GetSearchedProperties($data, $user_id, $locality)
    {
        // log::info($data);
        $query = $this->basePropertyQuery();
        $query->addSelect(
            'properties_settings.post_for',
            'properties_settings.carpet_area',
            'properties_settings.plot_area',
            'properties_settings.super_area',
            'properties_settings.property_type',
            'properties_settings.property_budget as budget_id',
            'properties_settings.expected_price as exp_price',
        )
            ->groupBy(
                'properties_settings.post_for',
                'properties_settings.property_type',
                'properties_settings.carpet_area',
                'properties_settings.plot_area',
                'properties_settings.super_area',
                'properties_settings.expected_price',
                'properties_settings.property_budget',
            );

        $filterConditions = [
            'post_for' => 'properties_settings.post_for',
            'city_id' => 'properties_location.city',
            'bedrooms' => 'properties_settings.bedrooms',
            'parking' => 'properties_settings.parking_ability',
            'property_type' => 'properties_settings.property_type',
            'property_for' => 'properties_settings.property_type_for',
            'budget_id' => 'properties_settings.property_budget',
        ];

        foreach ($filterConditions as $key => $column) {
            if (!empty($data[$key])) {

                if (is_array($data[$key])) {

                    $query->whereIn($column, $data[$key]);
                } else {

                    $query->where($column, '=', $data[$key]);
                }
            }
        }
        if (!empty($user_id)) {
            $query->where('properties.uid', '!=', $user_id);
        }
        if (!empty($locality)) {
            $query->where('properties_location.locality', 'like', "%{$locality}%");
        }



        return $query->get();
    }


    public function AddmyFavoriteProperty($data)
    {
        // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $addFavorite = DB::table('my_favorite_property')
            ->insert([
                'uid' => $data['user_id'],
                'propID' => $data['property_id'],
                'status' => config('constants.STATUS_ACTIVE'),
            ]);

        return  $addFavorite;
    }

    public function AddmyFavoriteProject($data)
    {
        // Log::info("Request in AddmyFavoriteProject:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $addFavorite = ProjectFavorite::create([
            'uid' => $data['user_id'],
            'project_id' => $data['project_id'],
            'status' => $data['status'],
        ]);

        return  $addFavorite;
    }


    public function myFavoritePropertyList($userID)
    {

        $properties = DB::table('properties')
            ->select(
                'properties.id as property_id',
                'properties.name as property_name',
                'properties.slug',
                'properties.uid',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.unit_type',
                'properties_settings.area_in_sqft',
                'properties_settings.super_area',
                'properties_settings.plot_area',
                'properties_settings.post_for',
                'properties.views',
                'properties.is_featured',
                'properties.is_populer',
                'properties_settings.parking_ability',
                'properties_settings.property_type_for',
                'properties_settings.property_type',
                'properties_settings.bedrooms',
                'properties_settings.expected_price',
                'properties_settings.price_currency',
                'properties.created_at',
                'properties_location.property_address',
            )
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->leftJoin('property_gallary', 'properties.id', '=', 'property_gallary.pid')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->rightJoin('my_favorite_property', 'properties.id', '=', 'my_favorite_property.propID')
            ->where('properties.is_deleted', '=', 0)
            ->where('my_favorite_property.uid', '=', $userID)
            ->where('my_favorite_property.status', '=', config('constants.STATUS_ACTIVE'))

            ->groupBy(
                'properties.id',
                'properties.uid',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.unit_type',
                'properties_settings.area_in_sqft',
                'properties_settings.super_area',
                'properties_settings.plot_area',
                'properties_settings.post_for',
                'properties.name',
                'properties.slug',
                'properties.views',
                'properties.is_populer',
                'properties.is_featured',
                'properties_settings.parking_ability',
                'properties_settings.property_type_for',
                'properties_settings.property_type',
                'properties_settings.bedrooms',
                'properties_settings.expected_price',
                'properties_settings.price_currency',
                'properties.created_at',
                'properties_location.property_address',
            )
            ->orderBy('properties.created_at', 'desc')->get();
        return $properties;
    }

    public function getPropertyallImeges($property_id)
    {

        $allimeges = Db::table('property_gallary')
            ->select(
                'pid as property_id',
                'image_type as gallery_type',
                'gallary_id',
                'property_gallary_images.id as image_id',
                'property_gallary_images.caption',
                'filename',
            )
            ->join('property_gallary_images', 'property_gallary.id', '=', 'property_gallary_images.gallary_id')
            ->where('property_gallary.pid', '=', $property_id)
            ->get();

        // Log::info("Request in allimeges:\n" . json_encode($allimeges, JSON_PRETTY_PRINT));

        return  $allimeges;
    }

    public function RemovePropertyFromfavList($data)
    {

        DB::table('my_favorite_property')
            ->where([
                'uid' => $data['user_id'],
                'propID' => $data['prop_id']
            ])
            ->update(['status' => config('constants.STATUS_INACTIVE')]);
    }

    public function GetEnquiredPropertyList($user_id)
    {
        $data = DB::table('property_enquiry')
            ->leftJoin('customer', 'property_enquiry.cid', '=', 'customer.cid')
            ->leftJoin('properties', 'property_enquiry.property_id', '=', 'properties.id')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->where([
                'property_enquiry.assign_to' => $user_id,
                'property_enquiry.is_deleted' => config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'property_enquiry.cid as customer_id',
                'property_enquiry.enquery_id',
                'property_enquiry.property_id',
                'property_enquiry.project_id',
                'property_enquiry.message',
                'property_enquiry.assign_to',
                'property_enquiry.status as enquery_status',
                'property_enquiry.created_at',
                'customer.Phone',
                'customer.Name',
                'customer.Email',
                'properties.name',
                'properties.slug',
                'properties_location.property_address',
                'properties_location.locality',
                'properties_settings.bedrooms',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.super_area',
                'properties_settings.plot_area'
            )
            ->orderBy('property_enquiry.created_at', 'desc');
        // Log::info("Request in allimeges:\n" . json_encode($data, JSON_PRETTY_PRINT));
        return $data;
    }

    public function GetCRMList($user_id)
    {
        return DB::table('leads_assigned')
            ->leftJoin('property_enquiry', 'property_enquiry.enquery_id', '=', 'leads_assigned.enquery_id')
            ->leftJoin('customer', 'property_enquiry.cid', '=', 'customer.cid')
            ->leftJoin('properties', 'property_enquiry.property_id', '=', 'properties.id')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->leftJoin('user_membership', 'user_membership.user_id', '=', 'leads_assigned.user_id')
            ->where([
                'leads_assigned.user_id' => $user_id,
                'leads_assigned.lead_type' => 'P',
                'property_enquiry.is_deleted' => config('constants.STATUS_INACTIVE'),
            ])
            ->where('property_enquiry.property_id', '!=', '')
            ->select(
                'leads_assigned.assign_id',
                'leads_assigned.lead_status',
                'property_enquiry.cid as customer_id',
                'property_enquiry.enquery_id',
                'property_enquiry.property_id',
                'property_enquiry.message',
                'property_enquiry.assign_to',
                'property_enquiry.status as enquery_status',
                'property_enquiry.created_at',
                'customer.Phone',
                'customer.Name',
                'customer.Email',
                'properties.name',
                'properties_location.property_address',
                'properties_location.locality',
                'properties_settings.bedrooms',
                'properties_settings.bathrooms',
                'properties_settings.carpet_area',
                'properties_settings.super_area',
                'properties_settings.plot_area',
                'user_membership.leads',
                'user_membership.leads_used'
            )
            ->orderBy('property_enquiry.created_at', 'desc')
            ->get();
    }

    public function getProjectLeads($user_id)
    {
        return DB::table('leads_assigned')
            ->leftJoin('property_enquiry', 'property_enquiry.enquery_id', '=', 'leads_assigned.enquery_id')
            ->leftJoin('customer', 'property_enquiry.cid', '=', 'customer.cid')
            ->leftJoin('project', 'property_enquiry.project_id', '=', 'project.id')
            ->leftJoin('project_location', 'project.id', '=', 'project_location.project_id')
            ->leftJoin('project_settings', 'project.id', '=', 'project_settings.project_id')
            ->leftJoin('user_membership', 'user_membership.user_id', '=', 'leads_assigned.user_id')
            ->where([
                'leads_assigned.user_id' => $user_id,
                'leads_assigned.lead_type' => 'P',
                'property_enquiry.is_deleted' => config('constants.STATUS_INACTIVE'),
            ])
            //->where('property_enquiry.project_id','!=','')
            ->select(
                'leads_assigned.assign_id',
                'leads_assigned.lead_status',
                'property_enquiry.cid as customer_id',
                'property_enquiry.enquery_id',
                'property_enquiry.project_id',
                'property_enquiry.message',
                'property_enquiry.assign_to',
                'property_enquiry.status as enquery_status',
                'property_enquiry.created_at',
                'customer.Phone as customer_phone',
                'customer.Name as customer_name',
                'customer.Email as customer_email',
                'project.project_name',
                'project_location.address',
                'project_location.locality',
                'project_settings.total_area',
                'project_settings.unit_type',
                'project_settings.occupied_area',
                'project_settings.area_in_sqft',
                'user_membership.leads',
                'user_membership.leads_used'
            )
            ->orderBy('property_enquiry.created_at', 'desc')
            ->get();
    }

    public function updateUserLeadStatus($data = array())
    {
        $assign_id = $data['assign_id'];
        $user_id = $data['user_id'];
        $status = $data['lead_status'];
        $query = DB::table('leads_assigned')->where(['assign_id' => $assign_id, 'user_id' => $user_id])->update(['lead_status' => $status]);

        return true;
    }

    public function my_profile_data($uid)
    {

        $data = DB::table('user_additional_data')
            ->select(
                'address',
                'city',
                'website_url',
                'website_title',
                'description',
            )
            ->where('user_id', $uid)->first();

        return $data;
    }

    public function UpdateMyProfileData($user_id, $data)
    {
        // log_anything($data);
        DB::table('users')
            ->where('id', $user_id)
            ->update([
                'name' => $data['name'],
                'email' => $data['email'],
                // 'image' => $data['image'],
                'phone_code' => $data['phone_code'],
                'phone' => $data['phone'],
                'whatsapp_no' => $data['whatsapp_no'],
                'updated_at' => $data['updated_at'],
            ]);


        DB::table('user_additional_data')
            ->updateOrInsert(
                ['user_id' => $user_id], // Condition to check if the user_id exists
                [
                    'address' => $data['address'],
                    'city' => $data['city'],
                    'website_title' => $data['website_title'],
                    'website_url' => $data['website_url'],
                    'description' => $data['description'],
                ]
            );

        return true;
    }


    public function UpdateInsertReviews($rK, $oK) //for property
    {
        // Log::info("post_property_review:\n" . json_encode($rK, JSON_PRETTY_PRINT));

        $rK['user_id'] = (int) $rK['user_id'];
        $rK['property_id'] = (int) $rK['property_id'];

        $rK['property_uid'] = PrefProperty::where('id', $rK['property_id'])->value('uid');



        $existingRecordInMainTable = DB::table('property_reviews')
            ->where([
                'user_id' => $rK['user_id'],
                'property_id' => $rK['property_id']
            ])
            ->first();

        if ($existingRecordInMainTable) {

            $rK['updated_at'] = now();
            DB::table('property_reviews')
                ->where('id', $existingRecordInMainTable->id)
                ->update($rK);

            $review_id = $existingRecordInMainTable->id;
        } else {
            $rK['created_at'] = now();
            $rK['updated_at'] = now();
            $review_id = DB::table('property_reviews')->insertGetId($rK);
        }

        $updateOrInsert_InAdditionalTable = DB::table('property_review_additional')->updateOrInsert(
            [
                'review-id' => $review_id,
            ],
            $oK
        );
    }

    public function UpdateInsertReviewsforProject($rK, $oK)
    {
        // Log::info("post_property_review:\n" . json_encode($rK, JSON_PRETTY_PRINT));

        $rK['user_id'] = (int) $rK['user_id'];
        $rK['project_id'] = (int) $rK['project_id'];

        $rK['project_uid'] = PrefProject::where('id', $rK['project_id'])->value('uid');


        $existingRecordInMainTable = DB::table('project_reviews')
            ->where([
                'user_id' => $rK['user_id'],
                'project_id' => $rK['project_id']
            ])
            ->first();

        if ($existingRecordInMainTable) {

            $rK['updated_at'] = now();
            DB::table('project_reviews')
                ->where('id', $existingRecordInMainTable->id)
                ->update($rK);

            $review_id = $existingRecordInMainTable->id;
        } else {
            $rK['created_at'] = now();
            $rK['updated_at'] = now();
            $review_id = DB::table('project_reviews')->insertGetId($rK);
        }

        $updateOrInsert_InAdditionalTable = DB::table('project_review_additional')->updateOrInsert(
            [
                'review_id' => $review_id,
            ],
            $oK
        );
    }


    public function PropertyListforAgentPage($user_id)
    {

        return $this->basePropertyQuery()
            ->where('properties.uid', '=', $user_id)
            ->addSelect('properties_settings.area_in_sqft')
            ->groupBy('properties_settings.area_in_sqft')
            ->get();
    }



    public function queryForScheduleDetails($enq_id)
    {
        $data = DB::table('property_enquiry')
            ->leftJoin('customer', 'property_enquiry.cid', '=', 'customer.cid')
            ->leftJoin('properties', 'property_enquiry.property_id', '=', 'properties.id')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->leftJoin('crm_log', 'property_enquiry.enquery_id', '=', 'crm_log.enquiry_id')
            ->where([
                'property_enquiry.assign_to' =>  $enq_id,
                'property_enquiry.is_deleted' =>  config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'property_enquiry.enquery_id',
                'property_enquiry.property_id',
                // 'property_enquiry.message',
                'property_enquiry.assign_to',
                'property_enquiry.status as enquery_status',
                'property_enquiry.created_at',
                'crm_log.schedule_date',
                'crm_log.remarks',
                'property_enquiry.cid as customer_id',
                'customer.Phone',
                'customer.Name as customer_name',
                'customer.Email',
                'properties.name as property_name',
                'properties_location.property_address',
                'properties_location.locality',
                'properties_settings.carpet_area',
                'properties_settings.super_area',
                'properties_settings.plot_area',
                'properties_settings.bedrooms as bedroom_count',
            )
            ->orderBy('property_enquiry.enquery_id', 'desc')
            ->first();

        return $data;
    }

    public function getLeadsScheduleList($user_id, $start_date, $end_date)
    {
        $data = DB::table('crm_log as log')
            ->where([
                'log.user_id' => $user_id,
            ])
            ->whereBetween('log.schedule_date', [$start_date . ' 00:00:00', $end_date . ' 23:59:59'])
            ->get();
        return $data;
    }

    public function queryForCRMcalender($user_id)
    {
        $data = DB::table('property_enquiry')
            ->leftJoin('customer', 'property_enquiry.cid', '=', 'customer.cid')
            ->leftJoin('properties', 'property_enquiry.property_id', '=', 'properties.id')
            ->leftJoin('properties_location', 'properties.id', '=', 'properties_location.pid')
            ->leftJoin('properties_settings', 'properties.id', '=', 'properties_settings.pid')
            ->leftJoin('crm_log', 'property_enquiry.enquery_id', '=', 'crm_log.enquiry_id')
            ->where([
                'property_enquiry.assign_to' =>  $user_id,
                'property_enquiry.is_deleted' =>  config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'property_enquiry.enquery_id',
                'property_enquiry.property_id',
                // 'property_enquiry.message',
                'property_enquiry.assign_to',
                'property_enquiry.status as enquery_status',
                'property_enquiry.created_at',
                'crm_log.schedule_date',
                'crm_log.remarks',
                'property_enquiry.cid as customer_id',
                'customer.Phone',
                'customer.Name as customer_name',
                'customer.Email',
                'properties.name as property_name',
                'properties_location.property_address',
                'properties_location.locality',
                'properties_settings.carpet_area',
                'properties_settings.super_area',
                'properties_settings.plot_area',
                'properties_settings.bedrooms as bedroom_count',
            )
            ->orderBy('property_enquiry.enquery_id', 'desc')
            ->get();

        return $data;
    }


    public function searchProject($data, $user_id, $hasLatLang)
    {
        // log::info($data);
        $query = PrefProject::where([
            ['uid', '!=', $this->auth_user_id],
            ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
            ['status', '=', config('constants.STATUS_ACTIVE')],
        ])
            ->with([
                'settings:project_id,project_budget,post_for,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type,area_in_sqft',
                'additional:project_id,main_road_facing,project_amenity,possession_status,construct_year,possesion_month_possesion_year,currency,token_amount,expected_price,developer_details,developer_name,developer_experience',
                'location:project_id,locality,city,address,latitude,longitude',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ]);

        // Now call get() and filter right after
        $filteredData = $query->cursor()->filter(function ($project) use ($data, $hasLatLang) {

            $settings = $project->settings;
            $location = $project->location;
            $additional = $project->additional;

            if (!empty($data['city_id'])) {
                $cityIds = array_map('intval', explode(',', $data['city_id']));
                if (!$location || !in_array((int)$location->city, $cityIds)) {
                    return false;
                }
            }

            if ($hasLatLang == 1) {
                if (
                    !$location ||
                    empty($location->latitude) ||
                    empty($location->longitude)
                ) {
                    return false;
                }
            }

            if (!empty($data['locality'])) {
                if (!$location || ($location->locality == $data['locality']) === false) {
                    return false;
                }
            }

            if (!empty($data['project_name'])) {
                if (stripos($project->project_name, $data['project_name']) === false) {
                    return false;
                }
            }

            if (!empty($data['project_amenity'])) {
                $selectedAmenities = array_map('intval', $data['project_amenity']);
                $projectAmenities = $additional->project_amenity ? json_decode($additional->project_amenity, true) : [];
                if (empty(array_intersect($selectedAmenities, $projectAmenities))) {
                    return false;
                }
            }

            if (!empty($data['project_furnish'])) {
                $data['project_furnish'] = array_map('intval', $data['project_furnish']);
                if (!$settings || !in_array($settings->project_furnish, $data['project_furnish'])) {
                    return false;
                }
            }

            if (!empty($data['parking_availability'])) {
                if (!$settings || !in_array(strtolower($settings->parking_availability), $data['parking_availability'])) {
                    return false;
                }
            }

            if (!empty($data['project_facing'])) {
                if (!$settings || !in_array(strtolower($settings->project_facing), $data['project_facing'])) {
                    return false;
                }
            }

            if (!empty($data['total_towers'])) {
                $data['total_towers'] = array_map('intval', $data['total_towers']);
                if (!$settings || !in_array($settings->total_towers, $data['total_towers'])) {
                    return false;
                }
            }

            if (!empty($data['project_type'])) {
                if (!$settings || $settings->project_type != $data['project_type']) {
                    return false;
                }
            }
            if (!empty($data['project_for'])) {
                if (!$settings || $settings->post_for != $data['project_for']) {
                    return false;
                }
            }

            if (!empty($data['possession_status'])) {
                if (!$additional || $additional->possession_status != $data['possession_status']) {
                    return false;
                }
            }

            if (!empty($data['min_price']) || !empty($data['max_price'])) {
                if (!$additional) {
                    return false;
                }
                $expectedPrice = $additional->expected_price ?? 0;
                $minBudget = $data['min_price'] ?? 0;
                $maxBudget = $data['max_price'] ?? PHP_INT_MAX;

                if ($expectedPrice < $minBudget || $expectedPrice > $maxBudget) {
                    return false;
                }
            }

            if (!empty($data['occupied_area[min]']) || !empty($data['occupied_area[max]'])) {
                if (!$settings) {
                    return false;
                }
                $occupiedArea = $settings->occupied_area ?? 0;
                $minOccupied = $data['occupied_area[min]'] ?? 0;
                $maxOccupied = $data['occupied_area[max]'] ?? PHP_INT_MAX;
                if ($occupiedArea < $minOccupied || $occupiedArea > $maxOccupied) {
                    return false;
                }
            }

            return true;
        });

        return $filteredData;
    }



    public function getBHKdata($project_id)
    {

        $bhkTypes = DB::table('project_property_mapping as pp')
            ->join('property_additional as pa', 'pp.property_id', '=', 'pa.pid')
            ->where('pp.project_id', $project_id)
            ->select('pa.bhk_type')
            ->distinct()
            ->pluck('pa.bhk_type')
            ->toArray();

        $bhkNumbers = array_map(function ($bhk) {
            return (int) filter_var($bhk, FILTER_SANITIZE_NUMBER_INT);
        }, $bhkTypes);

        sort($bhkNumbers);

        $availableBHKs = implode(', ', $bhkNumbers);

        return $availableBHKs;
    }

    public function getPageAdvertisements($data = array())
    {
        $curr_date = date('Y-m-d H:i:s');
        $query = DB::table('advertisements as a')
            ->select('a.advertisement_id', 'a.ad_image', 'a.ad_image_mobile', 'a.ad_url', 'a.ad_type', 'a.ad_code')
            ->leftJoin('advertisement_category as a_c', 'a.advertisement_id', '=', 'a_c.advertisement_id')
            ->leftJoin('advertisement_locations as a_l', 'a.advertisement_id', '=', 'a_l.advertisement_id');

        $query->where('status', '1');
        $query->where('a.start_date', '<=', $curr_date);
        $query->where('a.expire_date', '>=', $curr_date);

        if (array_key_exists('page', $data) && !empty($data['page'])) {
            $query->where('a.page', $data['page']);
        }
        if (array_key_exists('position', $data) && !empty($data['position'])) {
            $query->where('a.position', $data['position']);
        }
        if (array_key_exists('city', $data) && !empty($data['city'])) {
            $query->where('a_l.city_id', $data['city']);
        }
        if (array_key_exists('category', $data) && !empty($data['category'])) {
            $query->where('a_c.property_category', $data['category']);
        }
        $query->groupBy('a.advertisement_id');
        if (array_key_exists('limit', $data) && !empty($data['limit'])) {
            $query->inRandomOrder()->limit($data['limit']);
        } else {
            $query->inRandomOrder();
        }

        $result = $query->get()->toArray();
        return $result;
    }

    public function getGeneralLeadsList($user_id)
    {
        $query = DB::table('leads_assigned as l_a')
            ->select('e.*', 'l_a.assign_id', 'l_a.lead_status', 'u_m.leads', 'u_m.leads_used')
            ->leftJoin('buyer_property_enquery as e', 'e.id', '=', 'l_a.enquery_id')
            ->leftJoin('user_membership as u_m', 'u_m.user_id', '=', 'l_a.user_id')
            ->where([
                'l_a.user_id' => $user_id,
                'l_a.lead_type' => 'G'
            ])
            ->orderBy('e.id', 'desc')
            ->get();

        return $query;
    }

    public function addAdvertisementView($data = array())
    {
        $prev = DB::table('advertisements as a')->select('a.views')->where('a.advertisement_id', $data['advertisement_id'])->first();
        if ($prev) {
            $prev_views = $prev->views;
            $curr_views = $prev_views + 1;
            DB::table('advertisements as a')->where('a.advertisement_id', $data['advertisement_id'])->update(['a.views' => $curr_views]);
            return true;
        } else {
            return false;
        }
    }

    public function addAdImpressions($advertisement_id)
    {
        $prev = DB::table('advertisements as a')->select('a.impressions')->where('a.advertisement_id', $advertisement_id)->first();
        if ($prev) {
            $prev_imp = $prev->impressions;
            $curr_views = $prev_imp + 1;
            DB::table('advertisements as a')->where('a.advertisement_id', $advertisement_id)->update(['a.impressions' => $curr_views]);
            return true;
        } else {
            return false;
        }
    }

    public function getScheduleMeetingList($user_id, $schedule_date)
    {
        $schedule_date = Carbon::parse($schedule_date)->format('Y-m-d');
        $query = DB::table('crm_log as log')
            ->select('log.*', 'p_e.property_id', 'p_e.project_id', 'p.name as property_name', 'pj.project_name', 'c.Name as customer_name', 'c.Phone as customer_phone', 'c.Email as customer_email', 'g_e.name as g_customer_name', 'g_e.phone as g_customer_phone', 'g_e.email as g_customer_email')
            ->leftJoin('property_enquiry as p_e', 'log.enquiry_id', '=', 'p_e.enquery_id')
            ->leftJoin('properties as p', 'p.id', '=', 'p_e.property_id')
            ->leftJoin('project as pj', 'pj.id', '=', 'p_e.project_id')
            ->leftJoin('customer as c', 'p_e.cid', '=', 'c.cid')
            ->leftJoin('buyer_property_enquery as g_e', 'log.enquiry_id', '=', 'g_e.id')
            ->where([
                'log.user_id' => $user_id,
            ])
            ->whereDate('log.schedule_date', $schedule_date)
            ->orderBy('log.schedule_date', 'asc')
            ->get();

        return $query;
    }

    public function updateMeetingStatus($data = array())
    {
        DB::table('crm_log as log')
            ->where([
                'log.id' => $data['id'],
            ])
            ->update(['log.status' => $data['status']]);
        return true;
    }

    public function getLeadDetails($enquiry_id, $lead_type)
    {
        if ($lead_type == 'P') {
            $query = DB::table('property_enquiry as p_e')
                ->select('p_e.*', 'p.name as property_name', 'pj.project_name', 'c.Phone as phone', 'c.Name as name', 'c.Email as email')
                ->leftJoin('properties as p', 'p.id', '=', 'p_e.property_id')
                ->leftJoin('project as pj', 'pj.id', '=', 'p_e.project_id')
                ->leftJoin('customer as c', 'p_e.cid', '=', 'c.cid')
                ->where('p_e.enquery_id', $enquiry_id);
        } elseif ($lead_type == 'G') {
            $query = DB::table('buyer_property_enquery as p_e')
                ->select('p_e.*')
                ->where('p_e.id', $enquiry_id);
        }
        $result = $query->first();
        return $result;
    }

    public function addAdvertisementRequest($data = array())
    {
        $structure = array(
            'user_id' => $data['user_id'] ? $data['user_id'] : '',
            'name' => $data['name'] ? $data['name'] : '',
            'email' => $data['email'] ? $data['email'] : '',
            'phone_code' => $data['phone_code'] ? $data['phone_code'] : '',
            'phone' => $data['phone'] ? $data['phone'] : '',
            'city_id' => $data['city_id'] ? $data['city_id'] : '',
            'locality_id' => $data['locality_id'] ? $data['locality_id'] : '',
            'page' => $data['page'] ? $data['page'] : '',
            'position' => $data['position'] ? $data['position'] : '',
            'duration' => $data['duration'] ? $data['duration'] : '',
            'has_banner' => $data['has_banner'] ? $data['has_banner'] : '',
            'ad_image' => $data['ad_image'] ? $data['ad_image'] : '',
            'ad_image_mobile' => $data['ad_image_mobile'] ? $data['ad_image_mobile'] : '',
        );
        $prev = DB::table('advertisement_request')->insert($structure);
        return true;
    }

    public function getUserAdvertisementRequests($user_id, $limit = '', $offset = '', $for_list = TRUE)
    {
        $query = DB::table('advertisement_request as r')
            ->select('r.*')
            ->where(['r.user_id' => $user_id])
            ->where('r.status', '!=', '-1');
        if ($for_list) {
            $query->limit($limit);
            $query->offset($offset);
            $result = $query->orderBy('r.created_at', 'desc')->get();
        } else {
            $result = $query->count();
        }

        return $result;
    }

    public function getUserAdvertisementsList($user_id, $limit = '', $offset = '', $for_list = TRUE)
    {
        $query = DB::table('advertisements as a')
            ->select('a.*', 'a_l.location_id', 'a_l.city_id', 'a_l.country_id', 'a_c.property_category')
            ->leftJoin('advertisement_category as a_c', 'a.advertisement_id', '=', 'a_c.advertisement_id')
            ->leftJoin('advertisement_locations as a_l', 'a.advertisement_id', '=', 'a_l.advertisement_id')
            ->where(['a.member_id' => $user_id, 'status' => '1'])
            ->whereDate('a.start_date', '<=', now())
            ->whereDate('a.expire_date', '>=', now());
        if ($for_list) {
            $query->limit($limit);
            $query->offset($offset);
            $result = $query->groupBy('a.advertisement_id')->get();
        } else {
            $result = $query->count();
        }

        return $result;
    }

    public function deleteAdRequest($request_id)
    {
        $query = DB::table('advertisement_request as a')
            ->where('request_id', $request_id)
            ->update(['status' => '-1']);
        return true;
    }
}
