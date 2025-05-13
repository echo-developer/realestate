<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LocalityAreaPrice extends Model
{
    use HasFactory;
    protected $table = 'area_locality_price';
    public $timestamps = false;
    protected $fillable = [
        'new_price'
    ];

    public function getProprtyLocationPrice()
    {
        $propertyData = DB::select("
        SELECT
            loc.locality,
            YEAR(p.created_at) AS year,
            AVG(s.expected_price / NULLIF(s.area_in_sqft, 0)) AS avg_price_per_sqft
        FROM
            pref_properties p
        INNER JOIN
            pref_properties_settings s ON p.id = s.pid
        INNER JOIN
            pref_properties_location loc ON p.id = loc.pid
        WHERE
            s.expected_price > 0 AND s.area_in_sqft > 0
        GROUP BY
            loc.locality, year
        ORDER BY
            loc.locality, year
    ");

        return $propertyData;
    }


    public function getProjectLocationPrice()
    {
        $projectData = DB::select("
        SELECT
            pl.locality,
            YEAR(proj.created_at) AS year,
            AVG(CAST(ps.project_budget AS DECIMAL(12,2)) / NULLIF(ps.area_in_sqft, 0)) AS avg_price_per_sqft
        FROM
            pref_project proj
        INNER JOIN
            pref_project_settings ps ON proj.id = ps.project_id
        INNER JOIN
            pref_project_location pl ON proj.id = pl.project_id
        WHERE
            ps.project_budget REGEXP '^[0-9]+(\\.[0-9]+)?$'
            AND CAST(ps.project_budget AS DECIMAL(12,2)) > 0
            AND ps.area_in_sqft > 0
        GROUP BY
            pl.locality, year
        ORDER BY
            pl.locality, year
    ");

        return $projectData;
    }


    public function getYearlyTrendData($loc_id)
    {
        return DB::table('area_locality_price')
            ->select('locality', 'year', 'price_for', 'price_per_sqft', 'new_price')
            ->where('locality', $loc_id)
            ->orderBy('locality')
            ->orderBy('year')
            ->get();
    }
}
