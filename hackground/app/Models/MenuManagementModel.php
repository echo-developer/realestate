<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MenuManagementModel extends Model
{
    // protected $table = 'menu_management';
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

        $addMenu = DB::table('menu_management')->insert($menuData);

        set_flash_message('add');

        return [
            'message' => 'Menu added successfully.',
            'menu_id' => $addMenu
        ];
    }

    public function getMenus($term = null)
    {
        $query = DB::table('menu_management')
            ->where([
                ['menu_management.status', '!=', config('constants.STATUS_DELETE')],
            ]);

        if ($term) {
            $query->where('menu_management.name', 'like', "%{$term}%");
        }

        return $query->get();
    }

    public function getMenusDetails($id)
    {
        $Menus = DB::table('menu_management')
            ->where('menu_management.id', '=', $id) // Filter by amenity_id, not id
            ->select(
                'menu_management.id',
                'menu_management.parent_id',
                'menu_management.name',
                'menu_management.slug',
                'menu_management.description',
                'menu_management.status',
                'menu_management.icon_class',
                'menu_management.url',
                'menu_management.action',
                'menu_management.order'
            )
            ->get();



        return $Menus;
    }
    public function updateMenu($data)
    {

        DB::beginTransaction();

        try {
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
                'updated_at' => now(),
            ];

            DB::table('menu_management')
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
        DB::table('menu_management')
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
        $isSubMenu = DB::table('menu_management')
            ->where('parent_id', '=', $id)
            ->exists();

        $deleteAmenity =  DB::table('menu_management')
            ->where('id', $id);

        if ($isSubMenu) {
            $deleteAmenity->orWhere('parent_id', $id);
        }
        $deleteAmenity->update([
            'status' => config('constants.STATUS_DELETE'),
            'updated_at' => now(),
        ]);
        set_flash_message('delete');
        return [
            'message' => 'Menu deleted successfully.',
        ];
    }
}
