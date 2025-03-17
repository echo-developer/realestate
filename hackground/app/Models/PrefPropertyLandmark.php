<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefPropertyLandmark extends Model
{
    use HasFactory;
    protected $table = 'property_landmarks';

    protected $fillable = [
        'property_id',
        'landmark_type',
        'landmark_type_count',
        'landmark_details'
    ];

    public function prefProperty()
    {
        return $this->belongsTo(PrefProperty::class, 'property_id', 'id');
    }
}
