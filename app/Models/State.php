<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class State extends Model
{
    use HasFactory;

    public function createState(array $data)
    {

        $stateId = DB::table('pref_state')->insertGetId([
            'country'=>$data['country_id'],
            'order' => $data['order'],
            'status' => $data['status'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $stateNames = array_map(function ($lang, $name) use ($stateId) {
            return [
                'state_id' => $stateId,
                'lang' => $lang,
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, array_keys($data['name']), $data['name']);

        DB::table('pref_state_names')->insert($stateNames);

        return [
            'message' => 'state added successfully.',
            'state_id' => $stateId
        ];
    }
    public function getCountry($lang = 'en')
    {
        $query = DB::table('pref_country_names')
            ->join('pref_country', 'pref_country_names.country_id', '=', 'pref_country.id')
            ->where([
                ['pref_country_names.lang', '=', $lang],
                ['pref_country.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_country.id',
                'pref_country_names.name',
            )
         ->get();
        return $query;
    }
    public function getState($term = null, $lang = 'en')
    {
        $query = DB::table('pref_state_names')
            ->join('pref_state', 'pref_state_names.state_id', '=', 'pref_state.id')
            ->where([
                ['pref_state_names.lang', '=', $lang],
                ['pref_state.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'pref_state.id',
                'pref_state_names.name',
                'pref_state.order',
                'pref_state.status',
            );
        if ($term) {
            $query->where('pref_state_names.name', 'like', "%{$term}%");
        }
        return $query->paginate(2);
    }
    public function getStateDetails($id)
    {
        $State = DB::table('pref_state_names')
            ->join('pref_state', 'pref_state_names.state_id', '=', 'pref_state.id')
            ->where('pref_state_names.state_id', '=', $id) 
            ->select(
                'pref_state.country',
                'pref_state_names.name',
                'pref_state.id as state_id',
                'pref_state.order',
                'pref_state.status',
                'pref_state_names.lang'  
            )
            ->get();



        return $State;
    }
    public function updateState(array $data)
    {
       
        DB::beginTransaction();

        try {
        
            $StateData = [
                'country'=>$data['country_id'],
                'order' => $data['order'],
                'status' => $data['status'],
                'updated_at' => now(),
            ];

            DB::table('pref_state')
                ->where('id', $data['state_id'])
                ->update($StateData);

           
            $stateNames = array_map(function ($lang, $name) use ($data) {
                return [
                    'state_id' => $data['state_id'],
                    'lang' => $lang,
                    'name' => $name,
                    'updated_at' => now(),
                ];
            }, array_keys($data['name']), $data['name']);

           
            foreach ($stateNames as $stateName) {
                DB::table('pref_state_names')
                    ->where('state_id', $stateName['state_id'])
                    ->where('lang', $stateName['lang'])
                    ->update([
                        'name' => $stateName['name'],
                        'updated_at' => $stateName['updated_at'],
                    ]);
            }

            DB::commit();

            return [
                'message' => 'state updated successfully.',
                'state_id' => $data['state_id'],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'error' => 'Something went wrong! Please try again later.',
                'details' => $e->getMessage(),
            ];
        }
    }
    public function stateStatus($data)
    {
        DB::table('pref_state')
            ->where('id', $data['id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);
        return [
            'message' => 'state status updated.',
        ];
    }
    public function DeleteState($id = '')
    {
        DB::table('pref_state')
            ->where('id', $id)
            ->update([
                'status' => config('constants.STATUS_DELETE'),
                'updated_at' => now(),
            ]);
        return [
            'message' => 'state deleted successfully.',
        ];
    }

}
