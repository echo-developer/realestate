<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PropertyRecommendModel extends Model
{

    public function createRecommended(array $data)
    {

        $recommendID = DB::table('pref_property_recommended')->insertGetId([

            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $RecommendedName = array_map(function ($lang, $name) use ($recommendID) {
            return [
                'recommended_id' => $recommendID,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_property_recommended_names')->insert($RecommendedName);

        return [
            'message' => 'Category added successfully.',
            'recommended_id' => $recommendID
        ];
    }

    public function getrecommendeds($term = null)
    {
        $query = DB::table('pref_property_recommended_names')
            ->join('pref_property_recommended', 'pref_property_recommended_names.recommended_id', '=', 'pref_property_recommended.id')
            ->where([
                ['pref_property_recommended_names.lang', '=', 'en'],
                ['pref_property_recommended.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_property_recommended.id',
                'pref_property_recommended_names.name',
                'pref_property_recommended.order',
                'pref_property_recommended.status',
            );
        if ($term) {
            $query->where('pref_property_recommended_names.name', 'like', "%{$term}%");
        }
        return $query->paginate(2);
    }

    public function getRecommendedDetails($id)
    {
        $Recommended = DB::table('pref_property_recommended_names')
            ->join('pref_property_recommended', 'pref_property_recommended_names.recommended_id', '=', 'pref_property_recommended.id')
            ->where('pref_property_recommended_names.recommended_id', '=', $id) // Filter by recommended_id, not id
            ->select(
                'pref_property_recommended_names.id',
                'pref_property_recommended_names.name',
                'pref_property_recommended.id as recommended_id',
                'pref_property_recommended.order',
                'pref_property_recommended.status',
                'pref_property_recommended_names.lang'  // Include language column to identify language
            )
            ->get();

        return $Recommended;
    }

    public function updaterecommended($data)
    {
        // Start a recommended to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the pref_property_recommended table
            $recommendedData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_property_recommended')
                ->where('id', $data['recommended_id'])
                ->update($recommendedData);

            // Prepare the data for updating the category names in the pref_property_recommended_names table
            $RecommendedNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'recommended_id' => $data['recommended_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            // Update the category names table (same as createCategory)
            foreach ($RecommendedNames as $RecommendedName) {
                DB::table('pref_property_recommended_names')
                    ->where('recommended_id', $RecommendedName['recommended_id'])
                    ->where('lang', $RecommendedName['lang'])
                    ->update([
                        'name' => $RecommendedName['name'],
                        'updated_at' => $RecommendedName['updated_at'],
                    ]);
            }

            // Commit the recommended
            DB::commit();

            return [
                'message' => 'Recommended updated successfully.',
                'recommended_id' => $data['recommended_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the recommended in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function RecommendedstatusUpdate($data)
    {
        DB::table('pref_property_recommended')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'recommended status updated.',
        ];
    }


    public function DeleteRecommended($id = '')
    {
        DB::table('pref_property_recommended')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'recommended deleted successfully.',
        ];
    }
    use HasFactory;
}
