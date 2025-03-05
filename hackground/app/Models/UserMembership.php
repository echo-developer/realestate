<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMembership extends Model
{
    use HasFactory;

    protected $table = 'user_membership'; // Define table name

    protected $fillable = [
        'user_id',
        'transaction_id',
        'plan_id',
        'subcription_date',
        'expire_date',
        'owners_contact_limit',
        'unlock_prime_properties',
        'relationship_manager',
        'early_access',
        'prime_tag',
        'home_guarantee',
        'owner_contacted',
        'created_at',
        'updated_at'
    ];

    public $timestamps = true; // Enables created_at and updated_at

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship with Transaction
    public function transaction()
    {
        return $this->belongsTo(UserTransaction::class, 'transaction_id');
    }

    // Relationship with Plan (if you have a Plan model)
    public function plan()
    {
        return $this->belongsTo(MembershipPlans::class, 'plan_id');
    }
}
