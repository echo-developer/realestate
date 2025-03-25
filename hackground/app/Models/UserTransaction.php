<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTransaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'platform_txn_id',
        'paid_amount',
        'currency',
        'user_id',
        'plan_id',
        'payment_status',
        'created_at',
        'updated_at'
    ];

    public function names()
    {
        return $this->hasOne(UserMembership::class, 'transaction_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id','id');
    }
}
