<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyReports extends Model
{
    use HasFactory;

    protected $table = 'property_report';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'property_id',
        'property_posted_by',
        'user_id',
        'reason',
        'feedback',
        'actions',
        'status',
        'created_at',
        'updated_at',
    ];

    protected $appends = ['property_name', 'property_slug', 'posted_by_name', 'reporter_name'];

    public function propertyName(): Attribute
    {
        return Attribute::get(fn() => PrefProperty::where('id', $this->property_id)->value('name'));
    }

    public function propertySlug(): Attribute
    {
        return Attribute::get(fn() => PrefProperty::where('id', $this->property_id)->value('slug'));
    }

    protected function postedByName(): Attribute
    {
        return Attribute::get(fn () => User::where('id', $this->property_posted_by)->value('name'));
    }

    protected function reporterName(): Attribute
    {
        return Attribute::get(fn () => User::where('id', $this->user_id)->value('name'));
    }
}
