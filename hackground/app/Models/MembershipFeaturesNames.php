<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipFeaturesNames extends Model
{
    use HasFactory;

    protected $table = 'membership_features_names'; // Table name

    protected $fillable = [
        'feature_id',
        'lang',
        'name',
        'created_at',
        'updated_at'
    ];

    public $timestamps = true; // Enables created_at and updated_at

    /**
     * Define relationship with MembershipFeatures
     */
    public function feature()
    {
        return $this->belongsTo(MembershipFeatures::class, 'feature_id');
    }
}
