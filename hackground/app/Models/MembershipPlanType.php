<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlanType extends Model
{
    protected $table = 'membership_plan_type';
    protected $fillable = [
        'id',
        'relationship_manager',
        'owner_contacted',
        'listings_allowed',
        'verified_badge', 
        'listing_visibility',
        'social_media_promotion',
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
