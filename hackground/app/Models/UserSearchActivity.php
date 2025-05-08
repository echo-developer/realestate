<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class UserSearchActivity extends Model
{
    use HasFactory;
    protected $table = 'user_activity';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'property_type',
        'property_for',
        'post_for',
        'city_id',
        'min_budget',
        'max_budget',
        'json_filters',
    ];

    public $timestamps = true;
    protected $appends = ['user_name', 'user_phone', 'user_email'];

    protected function userName(): Attribute
    {
        return Attribute::make(
            get: fn() => get_user_name($this->user_id)
        );
    }
    protected function userPhone(): Attribute
    {
        return Attribute::make(
            get: fn() => User::find($this->user_id)?->phone
        );
    }

    protected function userEmail(): Attribute
    {
        return Attribute::make(
            get: fn() => User::find($this->user_id)?->email
        );
    }
    protected function propertyType(): Attribute
    {
        return Attribute::make(
            get: fn($value) => get_name_by_id('property_category_names', 'category_id', $value, 'en')
        );
    }
    protected function cityId(): Attribute
    {
        return Attribute::make(
            get: fn($value) => get_name_by_id('city_names', 'city_id', $value, 'en')
        );
    }

    // Accessor for property_for
    protected function propertyFor(): Attribute
    {
        return Attribute::make(
            get: fn($value) => get_name_by_id('property_sub_category_names', 'sub_category_id', $value, 'en')
        );
    }

    // Accessor for post_for
    protected function jsonFilters(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $filters = json_decode($value, true);
                unset($filters['hasLatlang']);
                if (!$filters || !is_array($filters)) {
                    return [];
                }

                $postedByMap = [
                    'O' => 'Owner',
                    'A' => 'Agent',
                    'B' => 'Builder',
                ];

                foreach ($filters as $key => &$val) {
                    if (in_array($key, ['bathroom', 'bedrooms', 'kitchens'])) {
                        $val = implode(',', $val);
                    }

                    if (in_array($key, ['facing', 'floor', 'ownership'])) {
                        $val = array_map(fn($v) => ucfirst($v), $val);
                    }

                    if ($key === 'posted_by') {
                        $val = array_map(fn($v) => $postedByMap[$v] ?? $v, $val);
                    }

                    if ($key === 'posted_since') {
                        $val = array_map(function ($v) {
                            $num = preg_replace('/\D/', '', $v);
                            if (!$num) return 'Invalid date';
                            return $num . ' day' . ($num > 1 ? 's' : '') . ' ago';
                        }, $val);
                    }

                    if ($key === 'amenities') {
                        $val = array_map(fn($v) => get_name_by_id('project_amenity_names', 'amenity_id', $v, 'en') ?? "Unknown ($v)", $val);
                    }

                    if ($key === 'furnishing') {
                        $val = array_map(fn($v) => get_name_by_id('property_furnish_names', 'furnish_id', $v, 'en') ?? "Unknown ($v)", $val);
                    }

                    if ($key === 'locality') {
                        $val = get_name_by_id('locality_names', 'locality_id', $val, 'en') ?? "Unknown ($val) locality Id";
                    }
                }

                return $filters;
            }
        );
    }

    protected function postFor(): Attribute
    {
        return Attribute::make(
            get: fn($value) =>  ucfirst($value)
        );
    }

    public function getActivityList($paginate)
    {
        try {
            $data = self::orderBy('created_at', 'desc')->paginate($paginate);
            return $data;
        } catch (\Throwable $e) {
            throw $e;
        }
    }
}
