<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Education extends Model
{
    use HasFactory;
    protected $table = 'education';
    protected $fillable = ['name', 'long', 'lat', 'status'];



    public static function educationAddfromExcel($data, $perChunck = 100)
    {
        try {
            $langs = explode(',', admin_default_lang());

            foreach (array_chunk($data, $perChunck) as $chunk) {
                DB::beginTransaction();

                foreach ($chunk as $row) {

                    $exists = self::whereRaw('LOWER(name) = ?', [strtolower($row[0])])->exists();

                    if (!$exists) {
                        $newEdId = self::insertGetId([
                            'name' => $row[0],
                            'long'   => $row[2],
                            'lat'   => $row[1],
                            'status'  => config('constants.STATUS_ACTIVE'),
                        ]);
                    }
                }

                DB::commit();
            }
            return ['message' => 'Education added successfully.'];
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
