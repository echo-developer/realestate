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
    if (!function_exists('getTableData')) {
        /**
         * Fetch data with optional joins, conditions, and pagination support.
         *
         * @param string $table       The base table name.
         * @param array $fields       The fields to select.
         * @param array $joins        The join configurations (['table', 'base_field', 'operator', 'foreign_field']).
         * @param array $conditions   Conditions for the query (key-value pairs for simple conditions or arrays for complex ones).
         * @param int|null $paginate  Number of items per page (if pagination is required, pass a number).
         *
         * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Support\Collection
         */
        function getTableData(
            string $table,
            array $fields = ['*'],
            array $joins = [],
            array $conditions = [],
            ?int $paginate = null
        ) {
            $query = DB::table($table)->select($fields);
    
            // Add joins dynamically
            foreach ($joins as $join) {
                $query->join(
                    $join['table'],
                    $join['base_field'],
                    $join['operator'] ?? '=', // Default to '=' operator
                    $join['foreign_field']
                );
            }
    
            // Add conditions dynamically
            foreach ($conditions as $field => $value) {
                if (is_array($value)) {
                    $query->where($field, $value[0], $value[1]); // Supports ['operator', 'value']
                } else {
                    $query->where($field, '=', $value); // Default condition
                }
            }
    
            // If pagination is required, paginate, else get all results
            if ($paginate) {
                return $query->paginate($paginate);
            }
    
            return $query->get(); // Default to fetching all results
        }
    }
    if (!function_exists('get_setting')) {
        function get_setting($key = '') {
            // Fetch the setting from the database
            $setting = DB::table('pref_all_setting')
                        ->where('setting_key', $key)
                        ->value('setting_value'); // 'value' returns the first column of the first result
    
            return $setting;

        }
    }
    
    if (!function_exists('admin_default_lang')) {
        function admin_default_lang() {
            $lang = get_setting('admin-default-lang'); // Fetch the language setting
            return $lang;

        }
    }
    
    
}


