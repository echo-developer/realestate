<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectEnquery extends Model
{
    protected $table = 'pref_project_enquery';
    protected $fillable = [
        'enquery_id',
        'cid',
        'project_id',
        'message',
        'assign_to',
        'status',
        'created_at',
        'updated_at',
    ];
    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }

    public function customer()
    {
        return $this->belongsTo(PrefCustomer::class, 'cid', 'cid');
    }
    use HasFactory;
}
