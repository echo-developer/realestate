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

        $stateId = DB::table('state')->insertGetId([
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

        DB::table('state_names')->insert($stateNames);

        return [
            'message' => 'state added successfully.',
            'state_id' => $stateId
        ];
    }
    public function getCountry($lang = 'en')
    {
        $query = DB::table('country_names')
            ->join('country', 'country_names.country_id', '=', 'country.id')
            ->where([
                ['country_names.lang', '=', $lang],
                ['country.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'country.id',
                'country_names.name',
            )
         ->get();
        return $query;
    }
    public function getState($term = null, $lang = 'en',$peginate)
    {
        $query = DB::table('state_names')
            ->join('state', 'state_names.state_id', '=', 'state.id')
            ->where([
                ['state_names.lang', '=', $lang],
                ['state.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->select(
                'state.id',
                'state_names.name',
                'state.order',
                'state.status',
            );
        if ($term) {
            $query->where('state_names.name', 'like', "%{$term}%");
        }
       
        // dd($query->toSql(), $query->getBindings());

        return $query->paginate($peginate);
    }
    public function getStateDetails($id)
    {
        $State = DB::table('state_names')
            ->join('state', 'state_names.state_id', '=', 'state.id')
            ->where('state_names.state_id', '=', $id) 
            ->select(
                'state.country',
                'state_names.name',
                'state.id as state_id',
                'state.order',
                'state.status',
                'state_names.lang'  
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

            DB::table('state')
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
                DB::table('state_names')
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
        DB::table('state')
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
        DB::table('state')
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
