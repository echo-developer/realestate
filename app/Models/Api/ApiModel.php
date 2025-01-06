<?php

namespace App\Models\Api;

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
            [],
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
                'pref_properties.uid',
                'pref_properties.status',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.plot_area',
                'pref_properties.views',
                'pref_properties.is_featured',
                'pref_properties.is_populer',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.post_for',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
                DB::raw('GROUP_CONCAT(
                DISTINCT CONCAT_WS("||",
                    pref_property_gallary.gallery,
                    pref_property_gallary.caption,
                    (SELECT GROUP_CONCAT(pref_property_gallary_images.filename SEPARATOR ",")
                     FROM pref_property_gallary_images
                     WHERE pref_property_gallary_images.gallary_id = pref_property_gallary.id)
                )
                SEPARATOR ";;"
            ) as galleries')
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
                'pref_properties_settings.post_for',
                'pref_properties.status',
                'pref_properties.views',
                'pref_properties.is_populer',
                'pref_properties.is_featured',
                'pref_properties_settings.parking_ability',
                'pref_properties_settings.property_type_for',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
            );
    }
    public function GetProperties()
    {
        return $this->basePropertyQuery()->get();
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
            ->where('pref_properties.uid', '=', $user_id)
            ->get();
    }

    public function getUserPropertyDetails($p_id)
    {
        return $this->basePropertyQuery()
            ->addSelect('pref_property_additional.property_amenity', 'pref_properties_settings.super_area')
            ->leftJoin('pref_property_additional', 'pref_properties.id', '=', 'pref_property_additional.pid')
            ->where('pref_properties.id', '=', $p_id)
            ->groupBy(
                'pref_property_additional.property_amenity',
                'pref_properties_settings.super_area'
            )
            ->get();
    }

    public function getPropertyAmnitybyID($amenity_ids)
    {
        Log::info("amenity_ids:\n" . json_encode($amenity_ids, JSON_PRETTY_PRINT));
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

    public function UpdatePropertyAmenities($data)
    {
        Log::info("Request in model:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $upd_amenity = DB::table('pref_property_additional')
            ->where('pid', $data['prop_id'])
            ->update(['property_amenity' => $data['id_string']]);

        return $upd_amenity;
    }


    public function GetSearchedProperties($data)
    {
        $query = $this->basePropertyQuery();
        $query->addSelect(
            'pref_properties_settings.post_for',
            'pref_properties_settings.property_type',
        )
            ->groupBy(
                'pref_properties_settings.post_for',
                'pref_properties_settings.property_type',
            );

        $filterConditions = [
            'post_for' => 'pref_properties_settings.post_for',
            'city_id' => 'pref_properties_location.city',
            'bedrooms' => 'pref_properties_settings.bedrooms',
            'parking' => 'pref_properties_settings.parking_ability',
            'property_type' => 'pref_properties_settings.property_type',
            'property_type_for' => 'pref_properties_settings.property_type_for',
            'budget_id' => 'pref_properties_settings.property_budget',
        ];

        foreach ($filterConditions as $key => $column) {
            if (!empty($data[$key])) {
                $query->where($column, '=', $data[$key]);
            }
        }

        return $query->get();
    }


    public function AddmyFavoriteProperty($data)
    {
        Log::info("Request in AddmyFavoriteProperty:\n" . json_encode($data, JSON_PRETTY_PRINT));

        $addFavorite = DB::table('pref_my_favorite_property')
            ->insert([
                'uid' => $data['user_id'],
                'propID' => $data['property_id'],
                'status' => config('constants.STATUS_ACTIVE'),
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
                DB::raw('GROUP_CONCAT(
                DISTINCT CONCAT_WS("||",
                    pref_property_gallary.gallery,
                    pref_property_gallary.caption,
                    (SELECT GROUP_CONCAT(pref_property_gallary_images.filename SEPARATOR ",")
                     FROM pref_property_gallary_images
                     WHERE pref_property_gallary_images.gallary_id = pref_property_gallary.id)
                )
                SEPARATOR ";;"
            ) as galleries')
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
                'gallery as gallery_type',
                'gallary_id',
                'caption',
                'pref_property_gallary_images.id as image_id',
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
        $data = DB::table('pref_properties')
            ->select(
                'pref_properties.id as property_id',
                'pref_properties.name as property_name',
                'pref_properties.slug',
                'pref_properties_settings.post_for',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.cid as customer_id',
                'pref_property_enquiry.created_at as enqueried_at',
                DB::raw('GROUP_CONCAT(
            DISTINCT CONCAT_WS("||",
                pref_property_gallary.gallery,
                pref_property_gallary.caption,
                (SELECT GROUP_CONCAT(pref_property_gallary_images.filename SEPARATOR ",")
                 FROM pref_property_gallary_images
                 WHERE pref_property_gallary_images.gallary_id = pref_property_gallary.id)
            )
            SEPARATOR ";;"
        ) as galleries')
            )
            ->leftJoin('pref_properties_settings', 'pref_properties.id', '=', 'pref_properties_settings.pid')
            ->leftJoin('pref_properties_location', 'pref_properties.id', '=', 'pref_properties_location.pid')
            ->leftJoin('pref_property_gallary', 'pref_properties.id', '=', 'pref_property_gallary.pid')
            ->join('pref_property_enquiry', 'pref_properties.id', '=', 'pref_property_enquiry.property_id')
            ->where([
                'pref_properties.is_deleted' => 0,
                'pref_property_enquiry.assign_to' => $user_id,
            ])
            ->groupBy(
                'pref_properties.id',
                'pref_properties.name',
                'pref_properties.slug',
                'pref_properties_settings.bedrooms',
                'pref_properties_settings.post_for',
                'pref_properties_settings.expected_price',
                'pref_properties_settings.price_currency',
                'pref_properties.created_at',
                'pref_properties_location.property_address',
                'pref_properties_location.locality',
                'pref_property_enquiry.enquery_id',
                'pref_property_enquiry.cid',
                'pref_property_enquiry.created_at',
            )
            ->get();
            Log::info("Request in allimeges:\n" . json_encode($data, JSON_PRETTY_PRINT));
        return $data;
    }
}
