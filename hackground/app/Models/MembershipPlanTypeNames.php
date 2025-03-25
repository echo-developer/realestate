<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlanTypeNames extends Model
{
    protected $table = 'membership_plan_type_names';
    protected $fillable = [
        'id',
        'plan_name',
        'lang'
    ];
    public function plan_type()
    {
        return $this->belongsTo(MembershipPlanType::class, 'id');
    }
    use HasFactory;
}
