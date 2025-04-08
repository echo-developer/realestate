<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanEnquery extends Model
{
    use HasFactory;

    protected $table = 'loan_enquery';

    protected $primaryKey = 'id';

    public $timestamps = true;


    // Allow mass assignment for the following fields
    protected $fillable = [
        'user_name',
        'phone',
        'email',
        'address',
        'loan_amount',
        'tenure',
        'is_property_identified',
    ];
}
