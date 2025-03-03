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
    public function getPropertyType(string $lang)
    {
        return getTableData(
            'pref_property_category_names',
            ['pref_property_category_names.category_id', 'pref_property_category_names.name as category_name', 'pref_property_category.slug as category_key'],
            [
                [
                    'table' => 'pref_property_category',
                    'base_field' => 'pref_property_category_names.category_id',
                    'foreign_field' => 'pref_property_category.id',
                    'operator' => '='
                ]
            ],
            [
                'lang' => $lang,
                'pref_property_category.status' => config('constants.STATUS_ACTIVE')
            ],
            null
        );
    }
    // public function getPropertyTypeFor(string $lang)
    // {

    //     return getTableData(
    //         'pref_property_sub_category_names',
    //         [
    //             'pref_property_sub_category_names.sub_category_id', 
    //             'pref_property_sub_category_names.name as sub_category_name', 
    //             'pref_property_category_names.name as category_name' ,
    //               'pref_property_category_names.name as category_name'
    //         ],
    //         [
    //             [
    //                 'table' => 'pref_property_sub_category', 
    //                 'base_field' => 'pref_property_sub_category_names.sub_category_id', 
    //                 'foreign_field' => 'pref_property_sub_category.id',
    //                 'operator' => '=' 
    //             ],
    //             [
    //                 'table' => 'pref_property_category_names', 
    //                 'base_field' => 'pref_property_sub_category.category_id', 
    //                 'foreign_field' => 'pref_property_category_names.category_id',
    //                 'operator' => '='  
    //             ]
    //         ],
    //         [
    //             'pref_property_sub_category_names.lang' => $lang, 
    //             'pref_property_category_names.lang' => $lang 
    //         ],
    //         null
    //     );


    // }
    public function getPropertyTypeFor(string $lang, $id)
    {

        return getTableData(
            'pref_property_sub_category_names',
            [
                'pref_property_sub_category_names.sub_category_id',
                'pref_property_sub_category.slug as subcategory_key',
                'pref_property_sub_category_names.name as sub_category_name',
            ],
            [
                [
                    'table' => 'pref_property_sub_category',
                    'base_field' => 'pref_property_sub_category_names.sub_category_id',
                    'foreign_field' => 'pref_property_sub_category.id',
                    'operator' => '='
                ]

            ],
            [
                'pref_property_sub_category_names.lang' => $lang,
                'pref_property_sub_category.category_id' => $id
            ],
            null
        );
    }
    public function getPropertyCity(string $lang)
    {
        return getTableData(
            'pref_property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyState(string $lang)
    {
        return getTableData(
            'pref_property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyCountry(string $lang)
    {
        return getTableData(
            'pref_property_category_names',
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getCity(string $lang)
    {
        return getTableData(
            'pref_city_names',
            ['city_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
    public function getPropertyBudget()
    {
        return getTableData(
            'pref_property_budget',
            ['id as budget_id', 'max_budget', 'min_budget'],
            [],
            ['status' => config('constants.STATUS_ACTIVE')],
            null
        );
    }
    public function getPropertyAmnity(string $lang)
    {
        return getTableData(
            'pref_project_amenity_names',
            ['amenity_id', 'name as amenity_name'],
            [],
            ['lang' => $lang],
            null
        );
    }


    public function getLocality(String $lang, $id)
    {

        return getTableData(
            'pref_locality_names',
            [
                'pref_locality_names.locality_id',
                'pref_locality_names.name as locality_name',
            ],
            [
                [
                    'table' => 'pref_locality',
                    'base_field' => 'pref_locality_names.locality_id',
                    'operator' => '=',
                    'foreign_field' => 'pref_locality.locality_id'
                ]
            ],
            [
                'pref_locality_names.lang' => $lang,
                'pref_locality.city' => $id,
                'pref_locality.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }


    public function getFurnish(String $lang)
    {

        return getTableData(
            'pref_property_furnish_names',
            [
                'pref_property_furnish_names.furnish_id',
                'pref_property_furnish_names.name as furnish_name',
            ],
            [
                [
                    'table' => 'pref_property_furnish',
                    'base_field' => 'pref_property_furnish_names.furnish_id',
                    'operator' => '=',
                    'foreign_field' => 'pref_property_furnish.id'
                ]
            ],
            [
                'pref_property_furnish_names.lang' => $lang,
                'pref_property_furnish.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }

    public function getPropertyStatus(String $lang)
    {

        return getTableData(
            'pref_property_status_names',
            [
                'pref_property_status_names.status_id',
                'pref_property_status_names.name as status_name',
            ],
            [
                [
                    'table' => 'pref_property_status',
                    'base_field' => 'pref_property_status_names.status_id',
                    'operator' => '=',
                    'foreign_field' => 'pref_property_status.id'
                ]
            ],
            [
                'pref_property_status_names.lang' => $lang,
                'pref_property_status.status' => config('constants.STATUS_ACTIVE'),
            ],
            null
        );
    }

    public function basePropertyQuery()
    {
        return DB::table('pref_properties')
            ->select(
                'pref_properties.id as property_id',
                'pref_properties.name as property_name',
                'pref_properties.slug',
                'pref_properties_settings.property_type',
                'pref_properties.uid',
                'pref_properties.status',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.plot_area',
                'pref_properties.views',
                'pref_properties.is_featured',
                'pref_properties.is_populer',
                'pref_properties.is_top',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.post_for',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
                'pref_properties_location.latitude',
                'pref_properties_location.longitude',
            )
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->leftJoin('pref_property_gallary', 'pref_properties.id', '=', 'pref_property_gallary.pid')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->where('pref_properties.is_deleted', '=', 0)
            ->groupBy(
                'pref_properties.id',
                'pref_properties.uid',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.plot_area',
                'pref_properties.name',
                'pref_properties.slug',
                'pref_properties_settings.property_type',
                'pref_properties_settings.post_for',
                'pref_properties.status',
                'pref_properties.views',
                'pref_properties.is_populer',
                'pref_properties.is_featured',
                'pref_properties.is_top',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
                'pref_properties_location.latitude',
                'pref_properties_location.longitude',
            );
    }
    public function GetProperties()
    {
        return $this->basePropertyQuery()
            ->leftJoin('pref_property_additional', 'pref_properties.id', '=', 'pref_property_additional.pid')
            ->addSelect(
                'pref_property_additional.property_amenity',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft',
                'pref_properties_settings.property_budget',
                'pref_properties_settings.unit_type',
                'pref_property_additional.is_personal_washroom',
                'pref_property_additional.pantry_cafeteria_status',
                'pref_property_additional.is_corner_shop',
                'pref_property_additional.faces_main_road',
                'pref_property_additional.washroom',

                'pref_property_additional.construction_done',
                'pref_property_additional.is_gated_colony',
                'pref_property_additional.boundary_wall',
                'pref_property_additional.road_width',
                'pref_property_additional.total_open_sides',
                'pref_property_additional.approved_by',

                'pref_property_additional.flooring_style',
                'pref_property_additional.possession_status',
                'pref_property_additional.construct_year',
                'pref_property_additional.expected_possesion_month_year',
                'pref_property_additional.property_furnish',
                'pref_property_additional.electric_available',
                'pref_property_additional.water_available',
                'pref_property_additional.lifts_in_tower',
                'pref_property_additional.flat_each_floor',
                'pref_property_additional.facing_direction',
                'pref_property_additional.car_parking',
                'pref_property_additional.overlooking',
                'pref_property_additional.ownership_type',
                'pref_property_additional.property_desc',
                'pref_properties_location.locality',

            )
            ->groupBy(
                'pref_property_additional.property_amenity',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft',
                'pref_properties_settings.property_budget',
                'pref_properties_settings.unit_type',
                'pref_property_additional.is_personal_washroom',
                'pref_property_additional.washroom',

                'pref_property_additional.construction_done',
                'pref_property_additional.is_gated_colony',
                'pref_property_additional.boundary_wall',
                'pref_property_additional.road_width',
                'pref_property_additional.total_open_sides',
                'pref_property_additional.approved_by',

                'pref_property_additional.pantry_cafeteria_status',
                'pref_property_additional.is_corner_shop',
                'pref_property_additional.faces_main_road',
                'pref_property_additional.flooring_style',
                'pref_property_additional.possession_status',
                'pref_property_additional.construct_year',
                'pref_property_additional.expected_possesion_month_year',
                'pref_property_additional.property_furnish',
                'pref_property_additional.electric_available',
                'pref_property_additional.water_available',
                'pref_property_additional.lifts_in_tower',
                'pref_property_additional.flat_each_floor',
                'pref_property_additional.facing_direction',
                'pref_property_additional.car_parking',
                'pref_property_additional.overlooking',
                'pref_property_additional.ownership_type',
                'pref_property_additional.property_desc',
                'pref_properties_location.locality',
            )
            ->where('pref_properties.status', '=', config('constants.STATUS_ACTIVE'))
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
                'pref_properties_settings.unit_type',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft'
            )
            ->groupBy(
                'pref_properties_settings.unit_type',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft'
            )
            ->where('pref_properties.uid', '=', $user_id)
            ->get();
    }

    public function getUserPropertyDetails($p_id)
    {
        return $this->basePropertyQuery()
            ->addSelect(
                'pref_property_additional.property_amenity',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft',
                'pref_properties_settings.property_budget',
                'pref_properties_settings.unit_type',
                'pref_property_additional.is_personal_washroom',
                'pref_property_additional.pantry_cafeteria_status',
                'pref_property_additional.is_corner_shop',
                'pref_property_additional.faces_main_road',
                'pref_property_additional.washroom',

                'pref_property_additional.construction_done',
                'pref_property_additional.is_gated_colony',
                'pref_property_additional.boundary_wall',
                'pref_property_additional.road_width',
                'pref_property_additional.total_open_sides',
                'pref_property_additional.approved_by',

                'pref_property_additional.flooring_style',
                'pref_property_additional.possession_status',
                'pref_property_additional.construct_year',
                'pref_property_additional.expected_possesion_month_year',
                'pref_property_additional.property_furnish',
                'pref_property_additional.electric_available',
                'pref_property_additional.water_available',
                'pref_property_additional.lifts_in_tower',
                'pref_property_additional.flat_each_floor',
                'pref_property_additional.facing_direction',
                'pref_property_additional.car_parking',
                'pref_property_additional.overlooking',
                'pref_property_additional.ownership_type',
                'pref_property_additional.property_desc',
                'pref_properties_location.locality',

            )
            ->leftJoin('pref_property_additional', 'pref_properties.id', '=', 'pref_property_additional.pid')
            ->where('pref_properties.id', '=', $p_id)
            ->groupBy(
                'pref_property_additional.property_amenity',
                'pref_properties_settings.super_area',
                'pref_properties_settings.area_in_sqft',
                'pref_properties_settings.property_budget',
                'pref_properties_settings.unit_type',
                'pref_property_additional.is_personal_washroom',
                'pref_property_additional.washroom',

                'pref_property_additional.construction_done',
                'pref_property_additional.is_gated_colony',
                'pref_property_additional.boundary_wall',
                'pref_property_additional.road_width',
                'pref_property_additional.total_open_sides',
                'pref_property_additional.approved_by',

                'pref_property_additional.pantry_cafeteria_status',
                'pref_property_additional.is_corner_shop',
                'pref_property_additional.faces_main_road',
                'pref_property_additional.flooring_style',
                'pref_property_additional.possession_status',
                'pref_property_additional.construct_year',
                'pref_property_additional.expected_possesion_month_year',
                'pref_property_additional.property_furnish',
                'pref_property_additional.electric_available',
                'pref_property_additional.water_available',
                'pref_property_additional.lifts_in_tower',
                'pref_property_additional.flat_each_floor',
                'pref_property_additional.facing_direction',
                'pref_property_additional.car_parking',
                'pref_property_additional.overlooking',
                'pref_property_additional.ownership_type',
                'pref_property_additional.property_desc',
                'pref_properties_location.locality',

            )
            ->get();
    }

    public function getPropertyAmnitybyID($amenity_ids)
    {
        // Log::info("amenity_ids:\n" . json_encode($amenity_ids, JSON_PRETTY_PRINT));
        $Amenities = DB::table('pref_project_amenity_names')
            ->join('pref_project_amenity', 'pref_project_amenity_names.amenity_id', '=', 'pref_project_amenity.id')
            ->select(
                'pref_project_amenity_names.amenity_id',
                'pref_project_amenity.image as amenity_image',
                'pref_project_amenity_names.name as amenity_name',
            )
            ->where([
                'pref_project_amenity.status' => config('constants.STATUS_ACTIVE'),
                'pref_project_amenity_names.lang' => 'en'
            ])
            ->whereIn('pref_project_amenity_names.amenity_id', $amenity_ids)
            ->get();

        // Log::info("Amenities:\n" . json_encode($Amenities, JSON_PRETTY_PRINT));
        return $Amenities;
    }


    public function PropertyfavoriteStaus($data)
    {
        $insertresponce = DB::table('pref_properties')
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

        $is_deleted = DB::table('pref_properties')
            ->where('id', $prop_id)
            ->update(['is_deleted' => config('constants.STATUS_ACTIVE')]);

        return $is_deleted;
    }

    public function GetPropertyAmenities($prop_id)
    {
        $amenities = DB::table('pref_property_additional')
            ->where('pid', $prop_id)
            ->pluck('property_amenity');
        // Log::info("Request in controller:\n" . json_encode($amenities, JSON_PRETTY_PRINT));
        return  $amenities;
    }

    public function GetProjectAmenities($project_id)
    {
        $amenities = DB::table('pref_project_additional')
            ->where('project_id', $project_id)
            ->pluck('project_amenity');
        // Log::info("Request in controller:\n" . json_encode($amenities, JSON_PRETTY_PRINT));
        return  $amenities;
    }

    public function UpdatePropertyAmenities($data)
    {
        // Log::info("Request in model:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $upd_amenity = DB::table('pref_property_additional')
            ->where('pid', $data['prop_id'])
            ->update(['property_amenity' => $data['id_string']]);

        return $upd_amenity;
    }

    public function UpdateProjectAmenities($data)
    {
        $upd_amenity = DB::table('pref_project_additional')
            ->where('project_id', $data['proj_id'])
            ->update(['project_amenity' => $data['id_string']]);

        return $upd_amenity;
    }


    public function GetSearchedProperties($data, $user_id, $locality)
    {
        // log::info($data);
        $query = $this->basePropertyQuery();
        $query->addSelect(
            'pref_properties_settings.post_for',
            'pref_properties_settings.carpet_area',
            'pref_properties_settings.plot_area',
            'pref_properties_settings.super_area',
            'pref_properties_settings.property_type',
            'pref_properties_settings.property_budget as budget_id',
            'pref_properties_settings.expected_price as exp_price',
        )
            ->groupBy(
                'pref_properties_settings.post_for',
                'pref_properties_settings.property_type',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.plot_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.property_budget',
            );

        $filterConditions = [
            'post_for' => 'pref_properties_settings.post_for',
            'city_id' => 'pref_properties_location.city',
            'bedrooms' => 'pref_properties_settings.bedrooms',
            'parking' => 'pref_properties_settings.parking_ability',
            'property_type' => 'pref_properties_settings.property_type',
            'property_for' => 'pref_properties_settings.property_type_for',
            'budget_id' => 'pref_properties_settings.property_budget',
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
            $query->where('pref_properties.uid', '!=', $user_id);
        }
        if (!empty($locality)) {
            $query->where('pref_properties_location.locality', 'like', "%{$locality}%");
        }



        return $query->get();
    }


    public function AddmyFavoriteProperty($data)
    {
        // Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $addFavorite = DB::table('pref_my_favorite_property')
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

        $properties = DB::table('pref_properties')
            ->select(
                'pref_properties.id as property_id',
                'pref_properties.name as property_name',
                'pref_properties.slug',
                'pref_properties.uid',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.unit_type',
                'pref_properties_settings.area_in_sqft',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area',
                'pref_properties_settings.post_for',
                'pref_properties.views',
                'pref_properties.is_featured',
                'pref_properties.is_populer',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.property_type',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
            )
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->leftJoin('pref_property_gallary', 'pref_properties.id', '=', 'pref_property_gallary.pid')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->rightJoin('pref_my_favorite_property', 'pref_properties.id', '=', 'pref_my_favorite_property.propID')
            ->where('pref_properties.is_deleted', '=', 0)
            ->where('pref_my_favorite_property.uid', '=', $userID)
            ->where('pref_my_favorite_property.status', '=', config('constants.STATUS_ACTIVE'))

            ->groupBy(
                'pref_properties.id',
                'pref_properties.uid',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area',
                'pref_properties_settings.post_for',
                'pref_properties.name',
                'pref_properties.slug',
                'pref_properties.views',
                'pref_properties.is_populer',
                'pref_properties.is_featured',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.property_type',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
            )
            ->orderBy('pref_properties.created_at', 'desc')->get();
        return $properties;
    }

    public function getPropertyallImeges($property_id)
    {

        $allimeges = Db::table('pref_property_gallary')
            ->select(
                'pid as property_id',
                'image_type as gallery_type',
                'gallary_id',
                'pref_property_gallary_images.id as image_id',
                'pref_property_gallary_images.caption',
                'filename',
            )
            ->join('pref_property_gallary_images', 'pref_property_gallary.id', '=', 'pref_property_gallary_images.gallary_id')
            ->where('pref_property_gallary.pid', '=', $property_id)
            ->get();

        // Log::info("Request in allimeges:\n" . json_encode($allimeges, JSON_PRETTY_PRINT));

        return  $allimeges;
    }

    public function RemovePropertyFromfavList($data)
    {

        DB::table('pref_my_favorite_property')
            ->where([
                'uid' => $data['user_id'],
                'propID' => $data['prop_id']
            ])
            ->update(['status' => config('constants.STATUS_INACTIVE')]);
    }

    public function GetEnquiredPropertyList($user_id)
    {
        $data = DB::table('pref_property_enquiry')
            ->leftJoin('pref_customer', 'pref_property_enquiry.cid', '=', 'pref_customer.cid')
            ->leftJoin('pref_properties', 'pref_property_enquiry.property_id', '=', 'pref_properties.id')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->where([
                'pref_property_enquiry.assign_to' => $user_id,
                'pref_property_enquiry.is_deleted' => config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'pref_property_enquiry.cid as customer_id',
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.property_id',
                'pref_property_enquiry.project_id',
                'pref_property_enquiry.message',
                'pref_property_enquiry.assign_to',
                'pref_property_enquiry.status as enquery_status',
                'pref_property_enquiry.created_at',
                'pref_customer.Phone',
                'pref_customer.Name',
                'pref_customer.Email',
                'pref_properties.name',
                'pref_properties.slug',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area'
            )
            ->orderBy('pref_property_enquiry.created_at', 'desc');
        // Log::info("Request in allimeges:\n" . json_encode($data, JSON_PRETTY_PRINT));
        return $data;
    }

    public function GetCRMList($user_id)
    {
        return DB::table('pref_property_enquiry')
            ->leftJoin('pref_customer', 'pref_property_enquiry.cid', '=', 'pref_customer.cid')
            ->leftJoin('pref_properties', 'pref_property_enquiry.property_id', '=', 'pref_properties.id')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->where([
                'pref_property_enquiry.assign_to' => $user_id,
                'pref_property_enquiry.is_deleted' => config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'pref_property_enquiry.cid as customer_id',
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.property_id',
                'pref_property_enquiry.message',
                'pref_property_enquiry.assign_to',
                'pref_property_enquiry.status as enquery_status',
                'pref_property_enquiry.created_at',
                'pref_customer.Phone',
                'pref_customer.Name',
                'pref_customer.Email',
                'pref_properties.name',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area'
            )
            ->orderBy('pref_property_enquiry.created_at', 'desc')
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



        $existingRecordInMainTable = DB::table('pref_property_reviews')
            ->where([
                'user_id' => $rK['user_id'],
                'property_id' => $rK['property_id']
            ])
            ->first();

        if ($existingRecordInMainTable) {

            $rK['updated_at'] = now();
            DB::table('pref_property_reviews')
                ->where('id', $existingRecordInMainTable->id)
                ->update($rK);

            $review_id = $existingRecordInMainTable->id;
        } else {
            $rK['created_at'] = now();
            $rK['updated_at'] = now();
            $review_id = DB::table('pref_property_reviews')->insertGetId($rK);
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


        $existingRecordInMainTable = DB::table('pref_project_reviews')
            ->where([
                'user_id' => $rK['user_id'],
                'project_id' => $rK['project_id']
            ])
            ->first();

        if ($existingRecordInMainTable) {

            $rK['updated_at'] = now();
            DB::table('pref_project_reviews')
                ->where('id', $existingRecordInMainTable->id)
                ->update($rK);

            $review_id = $existingRecordInMainTable->id;
        } else {
            $rK['created_at'] = now();
            $rK['updated_at'] = now();
            $review_id = DB::table('pref_project_reviews')->insertGetId($rK);
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
            ->where('pref_properties.uid', '=', $user_id)
            ->get();
    }



    public function queryForScheduleDetails($enq_id)
    {
        $data = DB::table('pref_property_enquiry')
            ->leftJoin('pref_customer', 'pref_property_enquiry.cid', '=', 'pref_customer.cid')
            ->leftJoin('pref_properties', 'pref_property_enquiry.property_id', '=', 'pref_properties.id')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->leftJoin('pref_crm_log', 'pref_property_enquiry.enquery_id', '=', 'pref_crm_log.enquiry_id')
            ->where([
                'pref_property_enquiry.assign_to' =>  $enq_id,
                'pref_property_enquiry.is_deleted' =>  config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.property_id',
                // 'pref_property_enquiry.message',
                'pref_property_enquiry.assign_to',
                'pref_property_enquiry.status as enquery_status',
                'pref_property_enquiry.created_at',
                'pref_crm_log.schedule_date',
                'pref_crm_log.remarks',
                'pref_property_enquiry.cid as customer_id',
                'pref_customer.Phone',
                'pref_customer.Name as customer_name',
                'pref_customer.Email',
                'pref_properties.name as property_name',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area',
                'pref_properties_settings.bedrooms as bedroom_count',
            )
            ->orderBy('pref_property_enquiry.enquery_id', 'desc')
            ->first();

        return $data;
    }

    public function queryForCRMcalender($user_id)
    {
        $data = DB::table('pref_property_enquiry')
            ->leftJoin('pref_customer', 'pref_property_enquiry.cid', '=', 'pref_customer.cid')
            ->leftJoin('pref_properties', 'pref_property_enquiry.property_id', '=', 'pref_properties.id')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->leftJoin('pref_crm_log', 'pref_property_enquiry.enquery_id', '=', 'pref_crm_log.enquiry_id')
            ->where([
                'pref_property_enquiry.assign_to' =>  $user_id,
                'pref_property_enquiry.is_deleted' =>  config('constants.STATUS_INACTIVE'),
            ])
            ->select(
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.property_id',
                // 'pref_property_enquiry.message',
                'pref_property_enquiry.assign_to',
                'pref_property_enquiry.status as enquery_status',
                'pref_property_enquiry.created_at',
                'pref_crm_log.schedule_date',
                'pref_crm_log.remarks',
                'pref_property_enquiry.cid as customer_id',
                'pref_customer.Phone',
                'pref_customer.Name as customer_name',
                'pref_customer.Email',
                'pref_properties.name as property_name',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.super_area',
                'pref_properties_settings.plot_area',
                'pref_properties_settings.bedrooms as bedroom_count',
            )
            ->orderBy('pref_property_enquiry.enquery_id', 'desc')
            ->get();

        return $data;
    }

    public function searchProject($data, $user_id)
    {

        $query = PrefProject::where([
            ['uid', '!=', $user_id],
            ['is_deleted', '!=', config('constants.STATUS_ACTIVE')],
            ['status', '=', config('constants.STATUS_ACTIVE')],
        ])
            ->with([
                'settings:project_id,project_budget,post_for,parking_availability,total_towers,total_area,occupied_area,total_units,project_furnish,project_type,project_facing,unit_type',
                'additional:project_id,main_road_facing,project_amenity,possession_status,currency,token_amount,expected_price,developer_details,developer_name',
                'location:project_id,locality,city,address',
                'gallery:id,project_id,image_type',
                'gallery.images:gallary_id,filename,caption'
            ])
            ->get();


        $filteredData = $query->filter(function ($project) use ($data) {
            // Filter by city_id
            if (!empty($data['city_id'])) {
                $cityIds = isset($data['city_id']) ? explode(',', $data['city_id']) : [];
                $location = $project->location;
                if (!$location || !in_array($location->city, $cityIds)) {
                    return false;
                }
            }

            // Filter by locality
            if (!empty($data['locality'])) {
                $location = $project->location;
                if (!$location || ($location->locality == $data['locality']) === false) {
                    return false;
                }
            }

            // Filter by project_name
            if (!empty($data['project_name'])) {
                if (stripos($project->project_name, $data['project_name']) === false) {
                    return false;
                }
            }

            // Filter by project_type
            if (!empty($data['project_type'])) {
                $settings = $project->settings;
                if (!$settings || $settings->project_type != $data['project_type']) {
                    return false;
                }
            }
            if (!empty($data['project_for'])) {
                $settings = $project->settings;
                if (!$settings || $settings->post_for != $data['project_for']) {
                    return false;
                }
            }

            // Filter by project_status
            if (!empty($data['possession_status'])) {
                $additional = $project->additional;
                if (!$additional || $additional->possession_status != $data['possession_status']) {
                    return false;
                }
            }

            // Filter by project_budget
            if (!empty($data['min_price']) || !empty($data['max_price'])) {
                $additional = $project->additional;

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


            return true;
        });

        return $filteredData;
    }


    public function getBHKdata($project_id)
    {

        $bhkTypes = DB::table('project_property_mapping as pp')
            ->join('pref_property_additional as pa', 'pp.property_id', '=', 'pa.pid')
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
