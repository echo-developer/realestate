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
            ['property_category_names.category_id', 'property_category_names.name as category_name', 'property_category.slug as category_key'],
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
    // public function getPropertyTypeFor(string $lang)
    // {

    //     return getTableData(
    //         'property_sub_category_names',
    //         [
    //             'property_sub_category_names.sub_category_id', 
    //             'property_sub_category_names.name as sub_category_name', 
    //             'property_category_names.name as category_name' ,
    //               'property_category_names.name as category_name'
    //         ],
    //         [
    //             [
    //                 'table' => 'property_sub_category', 
    //                 'base_field' => 'property_sub_category_names.sub_category_id', 
    //                 'foreign_field' => 'property_sub_category.id',
    //                 'operator' => '=' 
    //             ],
    //             [
    //                 'table' => 'property_category_names', 
    //                 'base_field' => 'property_sub_category.category_id', 
    //                 'foreign_field' => 'property_category_names.category_id',
    //                 'operator' => '='  
    //             ]
    //         ],
    //         [
    //             'property_sub_category_names.lang' => $lang, 
    //             'property_category_names.lang' => $lang 
    //         ],
    //         null
    //     );


    // }
    public function getPropertyTypeFor(string $lang, $id)
    {

        return getTableData(
            'property_sub_category_names',
            [
                'property_sub_category_names.sub_category_id',
                'property_sub_category.slug as subcategory_key',
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
        return getTableData(
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
    }


    public function getLocality(String $lang, $id)
    {

        return getTableData(
            'locality_names',
            [
                'locality_names.locality_id',
                'locality_names.name as locality_name',
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
                'properties_settings.area_in_sqft'
            )
            ->groupBy(
                'properties_settings.unit_type',
                'properties_settings.super_area',
                'properties_settings.area_in_sqft'
            )
            ->where('properties.uid', '=', $user_id)
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

    public function getPropertyAmnitybyID($amenity_ids)
    {
        // Log::info("amenity_ids:\n" . json_encode($amenity_ids, JSON_PRETTY_PRINT));
        $Amenities = DB::table('project_amenity_names')
            ->join('project_amenity', 'project_amenity_names.amenity_id', '=', 'project_amenity.id')
            ->select(
                'project_amenity_names.amenity_id',
                'project_amenity.image as amenity_image',
                'project_amenity_names.name as amenity_name',
            )
            ->where([
                'project_amenity.status' => config('constants.STATUS_ACTIVE'),
                'project_amenity_names.lang' => 'en'
            ])
            ->whereIn('project_amenity_names.amenity_id', $amenity_ids)
            ->get();

        $amenityArray = $Amenities->map(function ($amenity) {
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

        if (!$user || !Hash::check($data['oldpassword'], $user->password)) {
            return false;
        }

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
        return DB::table('property_enquiry')
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
                'properties_settings.plot_area'
            )
            ->orderBy('property_enquiry.created_at', 'desc')
            ->get(); // Fetch all results without pagination
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

        DB::table('users')
            ->where('id', $user_id)
            ->update([
                'name' => $data['name'],
                'email' => $data['email'],
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

    public function searchProject($data, $user_id)
    {
        // log::info($data);
        $query = PrefProject::where([
            ['uid', '!=', $this->auth_user_id],
            ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
            ['status', '=', config('constants.STATUS_ACTIVE')],
        ])
            ->with([
                'settings:project_id,project_budget,post_for,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type,area_in_sqft',
                'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name,developer_experience',
                'location:project_id,locality,city,address',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ])
            ->get();

        // log::info('$filteredData' . json_encode($query, JSON_PRETTY_PRINT));


        $filteredData = $query->filter(function ($project) use ($data) {

            $settings = $project->settings;
            $location = $project->location;
            $additional = $project->additional;

            if (!empty($data['city_id'])) {
                $cityIds = array_map('intval', explode(',', $data['city_id']));
                if (!$location || !in_array((int)$location->city, $cityIds)) {
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

                log::info($data['project_amenity']);
                log::info($project->project_amenity);
                $selectedAmenities = array_map('intval', $data['project_amenity']);

                $projectAmenities = is_array($project->project_amenity) ? $project->project_amenity : [];

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

    // public function searchProject($filters, $user_id)
    // {
    //     // Start query with essential conditions
    //     $query = PrefProject::where('uid', '!=', $user_id)
    //         ->where('is_deleted', '!=', config('constants.STATUS_ACTIVE'))
    //         ->where('status', config('constants.STATUS_ACTIVE'))
    //         ->with([
    //             'settings:project_id,project_budget,post_for,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type,area_in_sqft',
    //             'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
    //             'location:project_id,locality,city,address',
    //             'gallery:id,project_id,image_type',
    //             'gallery.images:gallary_id,filename,caption'
    //         ]);

    //     // Apply filters to query
    //     if (isset($filters['city_id'])) {
    //         $query->whereHas('location', function ($q) use ($filters) {
    //             $cityIds = explode(',', $filters['city_id']);
    //             $q->whereIn('city', $cityIds);
    //         });
    //     }

    //     if (isset($filters['locality'])) {
    //         $query->whereHas('location', function ($q) use ($filters) {
    //             $q->where('locality', $filters['locality']);
    //         });
    //     }

    //     if (isset($filters['project_name'])) {
    //         $query->where('project_name', 'LIKE', '%' . $filters['project_name'] . '%');
    //     }

    //     if (!empty($filters['project_amenity'])) {
    //         $query->whereHas('additional', function ($q) use ($filters) {
    //             $q->whereJsonContains('project_amenity', array_map('intval', (array) $filters['project_amenity']));
    //         });
    //     }

    //     if (isset($filters['project_furnish'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->whereIn('project_furnish', (array) $filters['project_furnish']);
    //         });
    //     }

    //     if (isset($filters['parking_availability'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->whereIn('parking_availability', array_map('strtolower', (array) $filters['parking_availability']));
    //         });
    //     }

    //     if (isset($filters['project_facing'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->whereIn('project_facing', array_map('strtolower', (array) $filters['project_facing']));
    //         });
    //     }

    //     if (isset($filters['total_towers'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->whereIn('total_towers', (array) $filters['total_towers']);
    //         });
    //     }

    //     if (isset($filters['project_type'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->where('project_type', $filters['project_type']);
    //         });
    //     }

    //     if (isset($filters['project_for'])) {
    //         $query->whereHas('settings', function ($q) use ($filters) {
    //             $q->where('post_for', $filters['project_for']);
    //         });
    //     }

    //     if (isset($filters['possession_status'])) {
    //         $query->whereHas('additional', function ($q) use ($filters) {
    //             $q->where('possession_status', $filters['possession_status']);
    //         });
    //     }

    //     if (isset($filters['min_price']) || isset($filters['max_price'])) {
    //         $query->whereHas('additional', function ($q) use ($filters) {
    //             $minPrice = $filters['min_price'] ?? 0;
    //             $maxPrice = $filters['max_price'] ?? PHP_INT_MAX;
    //             $q->whereBetween('expected_price', [$minPrice, $maxPrice]);
    //         });
    //     }

    //     return $query->get();
    // }



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
}
