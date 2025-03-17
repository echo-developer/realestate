<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PropertyFurnishModel extends Model
{

    public function createFurnish(array $data)
    {

        $furnishID = DB::table('property_furnish')->insertGetId([

            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $furnishName = array_map(function ($lang, $name) use ($furnishID) {
            return [
                'furnish_id' => $furnishID,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('property_furnish_names')->insert($furnishName);
        set_flash_message('add');

        return [
            'message' => 'Category added successfully.',
            'furnish_id' => $furnishID
        ];
    }

    public function getfurnish($term = null,$lang = 'en',$peginate)
    {
        $query = DB::table('property_furnish_names')
            ->join('property_furnish', 'property_furnish_names.furnish_id', '=', 'property_furnish.id')
            ->where([
                ['property_furnish_names.lang', '=', $lang],
                ['property_furnish.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'property_furnish.id',
                'property_furnish_names.name',
                'property_furnish.order',
                'property_furnish.status',
            );
        if ($term) {
            $query->where('property_furnish_names.name', 'like', "%{$term}%");
        }
        return $query->paginate($peginate);
    }

    public function getFurnishDetails($id)
    {
        $Furnish = DB::table('property_furnish_names')
            ->join('property_furnish', 'property_furnish_names.furnish_id', '=', 'property_furnish.id')
            ->where('property_furnish_names.furnish_id', '=', $id) // Filter by furnish_id, not id
            ->select(
                'property_furnish_names.id',
                'property_furnish_names.name',
                'property_furnish.id as fur_id',
                'property_furnish.order',
                'property_furnish.status',
                'property_furnish_names.lang'  // Include language column to identify language
            )
            ->get();

        return $Furnish;
    }

    public function updateFurnish($data)
    {
        // Start a transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the property_furnish table
            $furnishData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('property_furnish')
                ->where('id', $data['furnish_id'])
                ->update($furnishData);

            // Prepare the data for updating the category names in the property_furnish_names table
            $FurnishNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'furnish_id' => $data['furnish_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            // Update the category names table (same as createCategory)
            foreach ($FurnishNames as $FurnishName) {
                DB::table('property_furnish_names')
                    ->where('furnish_id', $FurnishName['furnish_id'])
                    ->where('lang', $FurnishName['lang'])
                    ->update([
                        'name' => $FurnishName['name'],
                        'updated_at' => $FurnishName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Category updated successfully.',
                'furnish_id' => $data['furnish_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }


    public function FurnishStatusUpdate($data)
    {
        DB::table('property_furnish')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'category status updated.',
        ];
    }


    public function DeleteFurnish($id = '')
    {
        DB::table('property_furnish')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
            set_flash_message('delete');
        return [
            'message' => 'category deleted successfully.',
        ];
    }
    use HasFactory;
}
