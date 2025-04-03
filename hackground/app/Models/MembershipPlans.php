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
        'price',
        'discount',
        'discounted_price',
        'validity_days',
        'status',
        'plan_type_id',
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
        return optional($this->names->first())->about_plan ?? 'N/A';
    }

    public function plan_type_names()
    {
        return $this->belongsTo(MembershipPlanTypeNames::class, 'plan_type_id','id');
    }
    public function plan_features()
    {
        return $this->belongsTo(MembershipPlanType::class, 'plan_type_id','id');
    }
}
