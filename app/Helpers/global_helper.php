<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

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
        if ($operation == 'add') {
            session()->flash('success_msg', 'Added Successfully');
            session()->flash('message_type', 'success');
        } elseif ($operation == 'update') {
            session()->flash('success_msg', 'Updated Successfully');
            session()->flash('message_type', 'success');
        } elseif ($operation == 'delete') {
            session()->flash('success_msg', 'Deleted Successfully');
            session()->flash('message_type', 'danger');
        } else {
            session()->flash('success_msg', 'Something went wrong');
            session()->flash('message_type', 'warning');
        }
    }
}

if (!function_exists('getTableData')) {
    function getTableData(
        string $table,
        array $fields = ['*'],
        array $joins = [],
        array $conditions = [],
        ?int $paginate = null
    ) {
        // Start building the query
        $query = DB::table($table)->select($fields);

        // Dynamically apply joins if provided
        foreach ($joins as $join) {
            $query->join(
                $join['table'],
                $join['base_field'],
                $join['operator'] ?? '=', // Default to '=' operator
                $join['foreign_field']
            );
        }

        // Dynamically apply conditions if provided
        foreach ($conditions as $field => $value) {
            if (is_array($value)) {
                $query->where($field, $value[0], $value[1]); // Supports ['operator', 'value']
            } else {
                $query->where($field, '=', $value); // Default to '=' operator
            }
        }

        // Return paginated results if requested, otherwise fetch all results
        return $paginate ? $query->paginate($paginate) : $query->get();
    }
}

function get_setting($key = '')
{
    $defaults = [
        'smtp-host' => 'localhost',
        'smtp-port' => 587,
        'smtp-encryption' => 'tls',
        'smtp-user' => null,
        'smtp-pass' => null,
        'admin-default-lang' => 'en',
    ];

    if (!Schema::hasTable('pref_all_setting')) {
        return $defaults[$key] ?? null;
    }

    $setting = DB::table('pref_all_setting')
        ->where('setting_key', $key)
        ->value('setting_value');

    return $setting ?? ($defaults[$key] ?? null);
}


if (!function_exists('admin_default_lang')) {
    function admin_default_lang()
    {
        $lang = get_setting('admin-default-lang'); // Fetch the language setting
        return $lang ? $lang : 'en';
    }
}


if (!function_exists('getFieldLang')) {


    function getFieldLang($column = '', $table = '', $where = '', $id = '', $lang = '')
    {
        if (empty($column) || empty($table) || empty($where) || empty($id) || empty($lang)) {
            return '';
        }

        $data = DB::table($table)
            ->select($column)
            ->where($where, $id)
            ->where('lang', $lang)
            ->first();

        if ($data && property_exists($data, $column)) {
            return $data->$column;
        }

        return '';
    }
}

if (!function_exists('AllmenusForSideBar')) {

    function AllmenusForSideBar()
    {
        $allmenus = DB::table('pref_menu_management')
            ->where('status', '!=', config('constants.STATUS_DELETE'))
            ->get()
            ->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return $allmenus = null ;
    }
}
