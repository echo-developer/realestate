<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlanType extends Model
{
    protected $table = 'membership_plan_type';
    protected $fillable = [
        'id',
        'no_of_owners_contactable',
        'unlock_owner_properties',
        'assistance_relationship_manager',
        'early_access_days', 
        'prime_tag',
        'home_guarantee_refund',
        'validity_days',
        'status'
    ];

    public function names()
    {
        return $this->hasMany(MembershipPlanTypeNames::class, 'id');
    }
    public function getEnglishNameAttribute()
    {
        return optional($this->names->first())->plan_name ?? 'N/A';
    }
    
    use HasFactory;
}
