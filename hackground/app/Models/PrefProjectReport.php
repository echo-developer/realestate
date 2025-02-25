<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrefProjectReport extends Model
{
    use HasFactory;
    protected $table = 'pref_project_report';

    protected $fillable = [
        'project_id',
        'project_posted_by',
        'user_id',
        'reason',
        'feedback',
        'status',
        'created_at',
        'updated_at',
    ];
    public $timestamps = false;

    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }
}
