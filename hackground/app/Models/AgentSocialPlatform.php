<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentSocialPlatform extends Model
{
    use HasFactory;

    protected $table = 'agent_social_platforms';

    public $timestamps = false;
    protected $primaryKey = 'id';

    protected $fillable = [
        'agent_id',
        'platform_key',
        'platform_name',
        'platform_url',
    ];

    
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id', 'id')->where('user_type', 'A');
    }
}
