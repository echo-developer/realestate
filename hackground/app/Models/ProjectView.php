<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectView extends Model
{
    use HasFactory;

    protected $table = 'project_views';
    public $timestamps = false;
    protected $fillable = ['project_id', 'view_date', 'view_count'];
}
