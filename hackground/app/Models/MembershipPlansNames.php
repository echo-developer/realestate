<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlansNames extends Model
{
    use HasFactory;

    protected $table = 'membership_plan_names';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'plan_id',
        'lang',
        'name',
        'created_at',
        'updated_at'
    ];

    /**
     * Relationship: A plan name belongs to a membership plan.
     */
    public function plan()
    {
        return $this->belongsTo(MembershipPlans::class, 'plan_id');
    }
}
