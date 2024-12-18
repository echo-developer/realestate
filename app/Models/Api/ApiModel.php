<?php

namespace App\Models\Api;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApiModel extends Model
{
    use HasFactory;
    public function getPropertyType(string $lang)
    {
        return getTableData(
            'pref_property_category_names',
            ['pref_property_category_names.category_id', 'pref_property_category_names.name as category_name','pref_property_category.slug as category_key'],
            [ [
                'table' => 'pref_property_category',
                'base_field' => 'pref_property_category_names.category_id',
                'foreign_field' => 'pref_property_category.id',
                'operator' => '='
            ]
        ],
            ['lang' => $lang,
           'pref_property_category.status'=>config('constants.STATUS_ACTIVE')
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
                'pref_property_sub_category.slug',
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
            ['max_budget', 'min_budget'],
            [],
            [],
            null
        );
    }
    public function getPropertyAmnity(string $lang)
    {
        return getTableData(
            'pref_project_amenity_names',
            ['amenity_id', 'name'],
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
                'pref_locality_names.name',
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
                'pref_property_furnish_names.name',
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
                'pref_property_status_names.name',
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
            ],
            null
        );
    }
    public function GetProperties()
    {
        $properties = DB::table('pref_properties')
            ->select(
                'pref_properties.id as property_id',
                'pref_properties.name as property_name',
                'pref_properties.slug',
                'pref_properties.uid',
                'pref_properties_settings.bathrooms',
                'pref_properties_settings.carpet_area',
                'pref_properties_settings.plot_area',
                'pref_properties.views',
                'pref_properties.is_featured',
                'pref_properties.is_populer',
                'pref_properties_settings.parking_ability',
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
            )
            ->orderBy('pref_properties.created_at', 'desc')
            ->get();

        return  $properties;
    }
}
