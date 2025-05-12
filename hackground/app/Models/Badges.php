<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badges extends Model
{
    use HasFactory;
    protected $table = 'badges';
    protected $primaryKey = 'badge_id';
    protected $fillable = ['slug','icon', 'status'];
    public function names()
    {
        return $this->hasMany(BadgesNames::class, 'badge_id', 'badge_id');
    }
}
