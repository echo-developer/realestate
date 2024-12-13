<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PermissionModel extends Model
{
    protected $table = 'pref_permission';
    protected $fillable = ['image', 'order', 'status'];

    /**
     * Create a new permission and store it in the database.
     */

    public function getPermission($role_id = null)
    {
        $query = DB::table('pref_menu_management as mmt')
            ->join('pref_permissions as pt' , 'mmt.slug', '=','pt.menu_code' )
            ->where([
                ['pt.role_id', '=', $role_id],
            ])
            ->select(
                'mmt.id',
                'mmt.slug'
            );

        return $query->get();
    }

    // public function getAmenitiesDetails($id)
    // {
    //     $Amenities = DB::table('pref_permission_names')
    //         ->join('pref_permission', 'pref_permission_names.permission_id', '=', 'pref_permission.id')
    //         ->where('pref_permission_names.permission_id', '=', $id) // Filter by permission_id, not id
    //         ->select(
    //             'pref_permission_names.id',
    //             'pref_permission_names.name',
    //             'pref_permission.id as permission_id',
    //             'pref_permission.order',
    //             'pref_permission.status',
    //             'pref_permission.image',
    //             'pref_permission_names.lang'  // Include language column to identify language
    //         )
    //         ->get();



    //     return $Amenities;
    // }
    // public function updatePermission($data)
    // {
    //     DB::beginTransaction();

    //     try {
    //         $permissionData = [
    //             'order' => $data['order'],
    //             'status' => $data['status'],
    //             'image' => $data['image'],
    //             'updated_at' => now(),
    //         ];

    //         DB::table('pref_permission')
    //             ->where('id', $data['permission_id'])
    //             ->update($permissionData);

    //         $permissionNames = array_map(function ($lang, $name) use ($data) {
    //             return [
    //                 'permission_id' => $data['permission_id'],
    //                 'lang' => $lang,
    //                 'name' => $name,
    //                 'updated_at' => now(),
    //             ];
    //         }, array_keys($data['name']), $data['name']);

    //         foreach ($permissionNames as $permissionName) {
    //             DB::table('pref_permission_names')
    //                 ->where('permission_id', $permissionName['permission_id'])
    //                 ->where('lang', $permissionName['lang'])
    //                 ->update([
    //                     'name' => $permissionName['name'],
    //                     'updated_at' => $permissionName['updated_at'],
    //                 ]);
    //         }

    //         // Commit the transaction
    //         DB::commit();
    //         set_flash_message('update');

    //         return [
    //             'message' => 'Permission updated successfully.',
    //             'permission_id' => $data['permission_id'],
    //         ];
    //     } catch (\Exception $e) {
    //         // Rollback the transaction in case of an error
    //         DB::rollBack();

    //         return [
    //             'error' => 'Something went wrong! Please try again later.',
    //             'details' => $e->getMessage(),
    //         ];
    //     }
    // }


    // public function PermissionStatusUpdate($data)
    // {
    //     DB::table('pref_permission')
    //         ->where('id', $data['id'])
    //         ->update([
    //             'status' => $data['status'],
    //             'updated_at' => now(),
    //         ]);
    //     return [
    //         'message' => 'permission status updated.',
    //     ];
    // }
    // public function DeletePermission($id = '')
    // {
    //     $deletePermission =  DB::table('pref_permission')
    //         ->where('id', $id)
    //         ->update([
    //             'status' => config('constants.STATUS_DELETE'),
    //             'updated_at' => now(),
    //         ]);
    //     set_flash_message('delete');
    //     return [
    //         'message' => 'permission deleted successfully.',
    //     ];
    // }
}
