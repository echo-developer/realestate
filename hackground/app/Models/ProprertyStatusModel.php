<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ProprertyStatusModel extends Model
{
    public function createStatus(array $data)
    {

        $transacID = DB::table('pref_property_status')->insertGetId([

            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $StatusName = array_map(function ($lang, $name) use ($transacID) {
            return [
                'status_id' => $transacID,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_property_status_names')->insert($StatusName);
        set_flash_message('add');
        return [
            'message' => 'Category added successfully.',
            'status_id' => $transacID
        ];
    }

    public function getstatus($term = null,$lang = 'en',$peginate)
    {
        $query = DB::table('pref_property_status_names')
            ->join('pref_property_status', 'pref_property_status_names.status_id', '=', 'pref_property_status.id')
            ->where([
                ['pref_property_status_names.lang', '=', $lang],
                ['pref_property_status.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_property_status.id',
                'pref_property_status_names.name',
                'pref_property_status.order',
                'pref_property_status.status',
            );
        if ($term) {
            $query->where('pref_property_status_names.name', 'like', "%{$term}%");
        }
        return $query->paginate($peginate);
    }

    public function getStatusDetails($id)
    {
        $Status = DB::table('pref_property_status_names')
            ->join('pref_property_status', 'pref_property_status_names.status_id', '=', 'pref_property_status.id')
            ->where('pref_property_status_names.status_id', '=', $id) // Filter by status_id, not id
            ->select(
                'pref_property_status_names.id',
                'pref_property_status_names.name',
                'pref_property_status.id as status_id',
                'pref_property_status.order',
                'pref_property_status.status',
                'pref_property_status_names.lang'  // Include language column to identify language
            )
            ->get();

        return $Status;
    }

    public function updatestatus($data)
    {
        // Start a status to ensure atomicity
        DB::beginTransaction();

        try {
            // Update the category data in the pref_property_status table
            $statusData = [
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_property_status')
                ->where('id', $data['status_id'])
                ->update($statusData);

            // Prepare the data for updating the category names in the pref_property_status_names table
            $StatusNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'status_id' => $data['status_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

            // Update the category names table (same as createCategory)
            foreach ($StatusNames as $StatusName) {
                DB::table('pref_property_status_names')
                    ->where('status_id', $StatusName['status_id'])
                    ->where('lang', $StatusName['lang'])
                    ->update([
                        'name' => $StatusName['name'],
                        'updated_at' => $StatusName['updated_at'],
                    ]);
            }

            // Commit the status
            DB::commit();
            set_flash_message('update');

            return [
                'message' => 'Status updated successfully.',
                'status_id' => $data['status_id'],
            ];
        } catch (\Exception $e) {
            // Rollback the status in case of an error
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function StatusstatusUpdate($data)
    {
        DB::table('pref_property_status')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'status status updated.',
        ];
    }


    public function DeleteStatus($id = '')
    {
        DB::table('pref_property_status')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
            set_flash_message('delete');
        return [
            'message' => 'status deleted successfully.',
        ];
    }
    use HasFactory;
}
