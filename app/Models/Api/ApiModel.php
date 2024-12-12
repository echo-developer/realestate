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
            ['category_id', 'name'],
            [],
            ['lang' => $lang],
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
    public function getPropertyTypeFor(string $lang,$id)
    {

        return getTableData(
            'pref_property_sub_category_names',
            [
                'pref_property_sub_category_names.sub_category_id', 
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
    public function getPropertyBudget(){
        return getTableData(
            'pref_property_budget',
            ['max_budget','min_budget'],
            [],
            [],
            null
        );
    }
    public function getPropertyAmnity(string $lang){
        return getTableData(
            'pref_project_amenity_names',
            ['amenity_id', 'name'],
            [],
            ['lang' => $lang],
            null
        );
    }
}
