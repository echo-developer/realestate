<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankLoan extends Model
{
    use HasFactory;
    protected $table = 'bank_loan';
    protected $fillable = [
        'id',
        'bank_name',
        'interest_rate',
        'processing_fees',
        'logo',
        'status',
    ];
    protected $appends = ['logo_url'];
    public function getLogoUrlAttribute()
    {
        return asset('user_upload/bank/' . $this->logo);
    }
}
