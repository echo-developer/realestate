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
            'parent_id' => $data['parent_id'] ?? 0,
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

    public function getSubMenus($term = null)
    {
        $query = DB::table('pref_menu_management')
            ->where([
                ['pref_menu_management.status', '!=', config('constants.STATUS_DELETE')],
                ['pref_menu_management.parent_id', '!=', config('constants.STATUS_INACTIVE')],
            ]);

        if ($term) {
            $query->where('pref_menu_management.name', 'like', "%{$term}%");
        }

        return $query->get();
    }

    public function getMenusDetails($id)
    {
        $Menus = DB::table('pref_menu_management')
            ->where('pref_menu_management.id', '=', $id) // Filter by amenity_id, not id
            ->select(
                'pref_menu_management.id',
                'pref_menu_management.parent_id',
                'pref_menu_management.name',
                'pref_menu_management.slug',
                'pref_menu_management.description',
                'pref_menu_management.status',
                'pref_menu_management.icon_class',
                'pref_menu_management.url',
                'pref_menu_management.action',
                'pref_menu_management.order'
            )
            ->get();



        return $Menus;
    }
    public function updateMenu($data)
    {
        DB::beginTransaction();

        try {
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
                'updated_at' => now(),
            ];

            DB::table('pref_menu_management')
                ->where('id', $data['id'])
                ->update($menuData);

            // Commit the transaction
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Menu updated successfully.',
                'menu_id' => $data['id'],
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


    public function MenuStatusUpdate($data)
    {
        DB::table('pref_menu_management')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'Menu status changed.',
        ];
    }
    public function DeleteMenu($id = '')
    {
        $deleteAmenity =  DB::table('pref_menu_management')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        set_flash_message('delete');
        return [
            'message' => 'Menu deleted successfully.',
        ];
    }
}
