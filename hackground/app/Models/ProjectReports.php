<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PrefProject;

class ProjectReports extends Model
{
    use HasFactory;

    protected $table = 'project_report';

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

    public $timestamps = true;


    protected $appends = ['project_name', 'project_slug', 'posted_by_name', 'reporter_name'];

    public function projectName(): Attribute
    {
        return Attribute::get(fn() => PrefProject::where('id', $this->project_id)->value('project_name'));
    }

    public function projectSlug(): Attribute
    {
        return Attribute::get(fn() => PrefProject::where('id', $this->project_id)->value('slug'));
    }

    protected function postedByName(): Attribute
    {
        return Attribute::get(fn () => User::where('id', $this->project_posted_by)->value('name'));
    }

    protected function reporterName(): Attribute
    {
        return Attribute::get(fn () => User::where('id', $this->user_id)->value('name'));
    }

    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id', 'id');
    }
}
