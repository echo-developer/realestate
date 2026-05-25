<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentSecviceLocationModel extends Model
{
    use HasFactory;

    protected $table = 'agent_service_location';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'agent_id',
        'loc_key',
        'city',
        'locality',
        'latitude',
        'longitude'
    ];

    protected $hidden = [
        'id',
        'agent_id',
    ];
    
    protected $appends = ['city_name', 'locality_name'];

    public function getCityNameAttribute()
    {
        return get_name_by_id('city_names', 'city_id', $this->attributes['city'] ?? null, 'en') ?? null;
    }

    public function getLocalityNameAttribute()
    {
        return get_name_by_id('locality_names', 'locality_id', $this->attributes['locality'] ?? null, 'en') ?? null;
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id', 'id')->where('user_type', 'A');
    }
}
