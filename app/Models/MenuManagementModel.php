<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MenuManagementModel extends Model
{
    // protected $table = 'pref_menu_management';
    // protected $fillable = ['image', 'order', 'status'];

    /**
     * Create a new amenity and store it in the database.
     */
    public function createMenu(array $data)
    {

        $menuData = [
            'parent_id' => $data['menuID'] ?? 0,
            'name' => $data['menu_name'],
            'slug' => $data['menu_slug'],
            'description' => $data['menu_desc'],
            'icon_class' => $data['menu_icon'] ?? null,
            'url' => $data['menu_url'],
            'status' => $data['menu_status'],
            'order' => $data['menu_order'],
            'action' => $data['menu_action'],
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $addMenu = DB::table('pref_menu_management')->insert($menuData);

        set_flash_message('add');

        return [
            'message' => 'Menu added successfully.',
            'menu_id' => $addMenu
        ];
    }

    public function getMenus($term = null)
    {
        $query = DB::table('pref_menu_management')
            ->where([
                ['pref_menu_management.status', '!=', config('constants.STATUS_DELETE')],
            ]);

        if ($term) {
            $query->where('pref_menu_management.name', 'like', "%{$term}%");
        }

        return $query->get();
    }

    public function getAmenitiesDetails($id)
    {
        $Amenities = DB::table('pref_menu_management')
            ->join('pref_menu_management', 'pref_menu_management.amenity_id', '=', 'pref_menu_management.id')
            ->where('pref_menu_management.amenity_id', '=', $id) // Filter by amenity_id, not id
            ->select(
                'pref_menu_management.id',
                'pref_menu_management.name',
                'pref_menu_management.id as amenity_id',
                'pref_menu_management.order',
                'pref_menu_management.status',
                'pref_menu_management.image',
                'pref_menu_management.lang'  // Include language column to identify language
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

            DB::table('pref_menu_management')
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
                DB::table('pref_menu_management')
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
        DB::table('pref_menu_management')
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
        $deleteAmenity =  DB::table('pref_menu_management')
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
