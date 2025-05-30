<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadAssigned extends Model
{
    use HasFactory;

    protected $table = 'leads_assigned';
    protected $primaryKey = 'assign_id';
    protected $fillable = ['lead_type', 'user_id', 'enquery_id', 'lead_status', 'is_seen'];

    public function siteVisit()
    {
        return $this->belongsTo(SiteVisit::class, 'enquery_id', 'id');
    }
}
