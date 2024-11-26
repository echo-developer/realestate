<?php
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

if (!function_exists('respondWithToken')) {
    function respondWithToken($token)
    {
        return response()->json([
            'status' => 'success',
            'user' => auth()->user(),
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }
}

if (!function_exists('set_flash_message')) {
    /**
     * Set a flash message for the session.
     *
     * @param string $message The message to display.
     * @param string $type The type of the message ('success', 'danger', 'warning', etc.).
     * @return void
     */
    function set_flash_message($operation)
    {
        if($operation == 'add'){
            session()->flash('success_msg', 'Added Successfully');
            session()->flash('message_type', 'success');
        }
        elseif($operation == 'update'){
            session()->flash('success_msg', 'Updated Successfully');
            session()->flash('message_type', 'success');
        }
        elseif($operation == 'delete'){
            session()->flash('success_msg', 'Deleted Successfully');
            session()->flash('message_type', 'danger');
        }
        else{
            session()->flash('success_msg', 'Something went wrong');
            session()->flash('message_type', 'warning');
        }
        
    }
    if (!function_exists('fetchDynamicData')) {
        /**
         * Fetch dynamic data with optional joins and pagination.
         *
         * @param string $table       The base table name.
         * @param array $fields       The fields to select.
         * @param array $joins        The join configurations (['table', 'base_field', 'operator', 'foreign_field']).
         * @param array $conditions   The conditions for the query (['field' => 'value']).
         * @param string|null $lang   The language field for localization, if applicable.
         * @param int|null $paginate  Number of items per page for pagination (null for no pagination).
         *
         * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection
         */
        function fetchTableData(
            string $table,
            array $fields = ['*'],
            array $joins = [],
            array $conditions = [],
            ?string $lang = null,
            ?int $paginate = null
        ) {
            $query = DB::table($table)->select($fields);
    
            foreach ($joins as $join) {
                $query->join($join['table'], $join['base_field'], $join['operator'], $join['foreign_field']);
            }
            foreach ($conditions as $field => $value) {
                $query->where($field, $value);
            }
            if ($lang) {
                $query->where('lang', $lang);
            }
            return $paginate ? $query->paginate($paginate) : $query->get();
        }
    }
}


