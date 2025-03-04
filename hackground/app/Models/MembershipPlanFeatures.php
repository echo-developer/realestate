<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlanFeatures extends Model
{
    use HasFactory;

    protected $table = 'membership_plan_features';
    protected $fillable = [
        'plan_id',
        'feature_id',
        'value',
        'created_at',
        'updated_at'
    ];

    public $timestamps = true;

    /**
     * Relationship with MembershipPlans (Each record belongs to one Plan)
     */
    public function plan()
    {
        return $this->belongsTo(MembershipPlans::class, 'plan_id');
    }

    /**
     * Relationship with MembershipFeatures (Each record belongs to one Feature)
     */
    public function feature()
    {
        return $this->belongsTo(MembershipFeatures::class, 'feature_id');
    }
}
