<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipFeatures extends Model
{
    use HasFactory;

    protected $table = 'membership_features';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'slug',
        'status',
        'created_at',
        'updated_at'
    ];

    /**
     * Relationship: A feature has many names in different languages.
     */
    public function names()
    {
        return $this->hasMany(MembershipFeaturesNames::class, 'feature_id');
    }

    /**
     * Relationship: A feature is associated with multiple plans.
     */
    public function plans()
    {
        return $this->belongsToMany(MembershipPlans::class, 'membership_plan_features', 'feature_id', 'plan_id')
            ->withPivot('value')
            ->withTimestamps();
    }
}
