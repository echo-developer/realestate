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

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id' ,'id')->where('user_type', 'A');
    }
}
