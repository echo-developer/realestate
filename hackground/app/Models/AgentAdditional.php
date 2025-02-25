<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentAdditional extends Model
{
    use HasFactory;
    protected $table = 'agent_additional_details';

    protected $fillable = [
        'agent_id',
        'license_no',
        'experience_yr',
        'specialization',
        'broker_type',
        'agent_doc',
        'bussiness_phone',
        'bussiness_email',
        'company_name',
        'opening_hours',
        'closing_hours',
    ];

    protected $hidden = [
        'id',
        'agent_id',
    ];
    protected $primaryKey = 'id';

    public $timestamps = false;

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id', 'id')->where('user_type', 'A');
    }
}
