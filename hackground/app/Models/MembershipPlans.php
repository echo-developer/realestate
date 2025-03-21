<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlans extends Model
{
    use HasFactory;

    protected $table = 'membership_plans';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'slug',
        'price',
        'discount',
        'discounted_price',
        'validity_days',
        'status',
        'created_at',
        'updated_at'
    ];

    /**
     * Get the formatted discounted price.
     */
    // public function getFormattedDiscountedPriceAttribute()
    // {
    //     return number_format($this->discounted_price, 2);
    // }

    /**
     * Relationship: A plan has many features.
     */
    public function features()
    {
        return $this->hasMany(MembershipPlanFeatures::class, 'plan_id');
    }
    /**
     * Relationship: A plan has many names in different languages.
     */
    public function names()
    {
        return $this->hasMany(MembershipPlansNames::class, 'plan_id');
    }

    public function user_member()
    {
        return $this->hasMany(UserMembership::class, 'plan_id');
    }

    public function getEnglishNameAttribute()
    {
        return optional($this->names->first())->name ?? 'N/A';
    }
}
