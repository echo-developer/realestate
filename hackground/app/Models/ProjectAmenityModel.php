<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProjectAmenityModel extends Model
{
    protected $table = 'project_amenity';
    protected $fillable = ['image', 'order', 'status'];

    /**
     * Create a new amenity and store it in the database.
     */
    public function createAmenity(array $data)
    {

        $amenityId = DB::table('project_amenity')->insertGetId([
            'image' => $data['image'] ?? null,
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $amenityNames = array_map(function ($lang, $name) use ($amenityId) {
            return [
                'amenity_id' => $amenityId,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        $addAmenity = DB::table('project_amenity_names')->insert($amenityNames);

        set_flash_message('add');

        return [
            'message' => 'Amenity added successfully.',
            'amenity_id' => $amenityId
        ];
    }

    public function getAmenities($term = null, $lang = 'en', $peginate)
    {
        $query = DB::table('project_amenity_names')
            ->join('project_amenity', 'project_amenity_names.amenity_id', '=', 'project_amenity.id')
            ->where([
                ['project_amenity_names.lang', '=', $lang],
                ['project_amenity.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'project_amenity.id',
                'project_amenity_names.name',
                'project_amenity.order',
                'project_amenity.status',
                'project_amenity.image'
            );

        if ($term) {
            $query->where('project_amenity_names.name', 'like', "%{$term}%");
        }

        return $query->paginate($peginate);
    }

    public function getAmenitiesDetails($id)
    {
        $Amenities = DB::table('project_amenity_names')
            ->join('project_amenity', 'project_amenity_names.amenity_id', '=', 'project_amenity.id')
            ->where('project_amenity_names.amenity_id', '=', $id) // Filter by amenity_id, not id
            ->select(
                'project_amenity_names.id',
                'project_amenity_names.name',
                'project_amenity.id as amenity_id',
                'project_amenity.order',
                'project_amenity.status',
                'project_amenity.image',
                'project_amenity_names.lang'  // Include language column to identify language
            )
            ->get();



        return $Amenities;
    }
    public function updateAmenity($data)
    {
        DB::beginTransaction();

        try {
            $amenityData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'image' => $data['image'],
                'updated_at' => now(),
            ];

            DB::table('project_amenity')
                ->where('id', $data['amenity_id'])
                ->update($amenityData);

            $amenityNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'amenity_id' => $data['amenity_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            foreach ($amenityNames as $amenityName) {
                DB::table('project_amenity_names')
                    ->where('amenity_id', $amenityName['amenity_id'])
                    ->where('lang', $amenityName['lang'])
                    ->update([
                        'name' => $amenityName['name'],
                        'updated_at' => $amenityName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Amenity updated successfully.',
                'amenity_id' => $data['amenity_id'],
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


    public function AmenityStatusUpdate($data)
    {
        DB::table('project_amenity')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'amenity status updated.',
        ];
    }
    public function DeleteAmenity($id = '')
    {
        $deleteAmenity =  DB::table('project_amenity')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'amenity deleted successfully.',
        ];
    }
}
