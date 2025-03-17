<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectFavorite extends Model
{
    protected  $table = 'my_favorite_project';
    protected  $fillable = [
        'uid',
        'project_id',
        'status',
    ];
    public $timestamps = false;

    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }
    use HasFactory;
}
