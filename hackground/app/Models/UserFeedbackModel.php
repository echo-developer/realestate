<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFeedbackModel extends Model
{
    use HasFactory;

    protected $table = 'users_feedback';
    const UPDATED_AT = null;

    public $timestamps = true;
    protected $fillable = ['name', 'email', 'phone', 'phone_code', 'feedback'];
}
