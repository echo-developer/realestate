<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PropertyLengthModel extends Model
{

    public function getlengths()
    {

        $data = DB::table('property_length')
            ->get();

        return $data;
    }

    public function insert($data)
    {
        DB::table('property_length')->truncate();

        foreach ($data as $name => $value) {
            DB::table('property_length')->insert([
                'name' => $name,
                'value' => $value
            ]);
        }
    }
    use HasFactory;
}
