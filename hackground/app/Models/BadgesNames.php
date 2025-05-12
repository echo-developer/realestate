<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BadgesNames extends Model
{
    use HasFactory;
    protected $table = 'badges_names';
    protected $primaryKey = 'badge_id';
    protected $fillable = ['badge_id', 'name', 'description', 'lang'];
    public $timestamps = false;

    public function badge()
    {
        return $this->belongsTo(Badges::class, 'badge_id', 'badge_id');
    }
}
