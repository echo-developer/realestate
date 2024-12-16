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

        $query = DB::table($table)->select($fields);


        foreach ($joins as $join) {
            $query->join(
                $join['table'],
                $join['base_field'],
                $join['operator'] ?? '=',
                $join['foreign_field']
            );
        }


        foreach ($conditions as $field => $value) {
            if (is_array($value)) {
                $query->where($field, $value[0], $value[1]);
            } else {
                $query->where($field, '=', $value);
            }
        }


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

        $role = Auth::guard('admin')->user()->role;

        $allmenus = DB::table('pref_menu_management as mmt')
            ->join('pref_permissions as pt', 'mmt.slug', '=', 'pt.menu_code')
            ->where([
                ['pt.role_id', '=', $role],
            ])
            ->get()->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return $allmenus = null;
    }
}

if (!function_exists('AllmenusForPermissionPage')) {

    function AllmenusForPermissionPage()
    {

        $role = Auth::guard('admin')->user()->role;

        $allmenus = DB::table('pref_menu_management as mmt')
            ->where([
                ['mmt.status', '!=', config('constants.STATUS_DELETE')],
            ])
            ->get()->groupBy('parent_id');

        if ($allmenus->isNotEmpty()) {
            return $allmenus;
        }

        return $allmenus = null;
    }
}
if (!function_exists('get_name_by_id')) {

    function get_name_by_id($table, $selectname, $id, $lang)
    {
        $result = getTableData(
            $table,
            ['name'], 
            [],       
            [$selectname => $id, 'lang' => $lang], 
            null      
        );

        // Check if result is not empty and return the first 'name' value if it's an object
        return !empty($result) ? $result[0]->name : null;  // Accessing property using -> instead of array syntax
    }
}

if (!function_exists('decode_id_from_slug')) {

    function decode_id_from_slug($slug)
    {
        // Extract the hex encoded ID from the slug
        if (preg_match('/id=([a-zA-Z0-9\-]+)/', $slug, $matches)) {
            // Decode the hex string to get the ID
            $decodedId = hex2bin($matches[1]);

            // Get the numeric ID (before '--')
            return (int)explode('--', $decodedId)[0];  // return the numeric ID
        }
        
        return null;  // If no ID is found, return null
    }
}
