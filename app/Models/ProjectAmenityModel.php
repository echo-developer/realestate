<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProjectAmenityModel extends Model
{
    protected $table = 'pref_project_amenity';
    protected $fillable = ['image', 'order', 'status'];

    /**
     * Create a new amenity and store it in the database.
     */
    public function createAmenity(array $data)
    {

        $amenityId = DB::table('pref_project_amenity')->insertGetId([
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

        $addAmenity = DB::table('pref_project_amenity_names')->insert($amenityNames);

        if ($addAmenity) {
            session()->flash('success_msg', 'Amenity added successfully');
            session()->flash('message_type', 'success');
        } else {
            session()->flash('success_msg', 'Failed to add');
            session()->flash('message_type', 'danger');
        }

        return [
            'message' => 'Amenity added successfully.',
            'amenity_id' => $amenityId
        ];
    }

    public function getAmenities($term = null)
    {
        $query = DB::table('pref_project_amenity_names')
            ->join('pref_project_amenity', 'pref_project_amenity_names.amenity_id', '=', 'pref_project_amenity.id')
            ->where([
                ['pref_project_amenity_names.lang', '=', 'en'],
                ['pref_project_amenity.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_project_amenity.id',
                'pref_project_amenity_names.name',
                'pref_project_amenity.order',
                'pref_project_amenity.status',
                'pref_project_amenity.image'
            );
        if ($term) {
            $query->where('pref_project_amenity_names.name', 'like', "%{$term}%");
        }
        return $query->paginate(2);
    }
    public function getAmenitiesDetails($id)
    {
        $Amenities = DB::table('pref_project_amenity_names')
            ->join('pref_project_amenity', 'pref_project_amenity_names.amenity_id', '=', 'pref_project_amenity.id')
            ->where('pref_project_amenity_names.amenity_id', '=', $id) // Filter by amenity_id, not id
            ->select(
                'pref_project_amenity_names.id',
                'pref_project_amenity_names.name',
                'pref_project_amenity.id as amenity_id',
                'pref_project_amenity.order',
                'pref_project_amenity.status',
                'pref_project_amenity.image',
                'pref_project_amenity_names.lang'  // Include language column to identify language
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

            DB::table('pref_project_amenity')
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
                DB::table('pref_project_amenity_names')
                    ->where('amenity_id', $amenityName['amenity_id'])
                    ->where('lang', $amenityName['lang'])
                    ->update([
                        'name' => $amenityName['name'],
                        'updated_at' => $amenityName['updated_at'],
                    ]);
            }

            // Commit the transaction
            DB::commit();

            session()->flash('success_msg', 'Amenity Updated successfully');
            session()->flash('message_type', 'success');

            return [
                'message' => 'Amenity updated successfully.',
                'amenity_id' => $data['amenity_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            session()->flash('success_msg', 'Failed to Update');
            session()->flash('message_type', 'danger');

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }


    public function AmenityStatusUpdate($data)
    {
        DB::table('pref_project_amenity')
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
        $deleteAmenity =  DB::table('pref_project_amenity')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);

        if ($deleteAmenity) {
            session()->flash('success_msg', 'Amenity Deleted');
            session()->flash('message_type', 'danger');
        } else {
            session()->flash('success_msg', 'Failed to Delete');
            session()->flash('message_type', 'danger');
        }
        return [
            'message' => 'amenity deleted successfully.',
        ];
    }
}
