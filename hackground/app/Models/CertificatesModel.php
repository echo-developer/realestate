<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificatesModel extends Model
{
    use HasFactory;

    // Define the table name
    protected $table = 'certificates';


    // Define fillable fields
    protected $fillable = [
        'property_id',
        'project_id',
        'certificate_name',
        'certificate_number',
        'fileName',
        'status',
        'is_approved',
        'created_at',
        'updated_at'
    ];

    protected $appends = ['filename_url']; //used as accessor

    public function property()
    {
        return $this->belongsTo(PrefProperty::class, 'property_id');
    }

    public function project()
    {
        return $this->belongsTo(PrefProject::class, 'project_id');
    }

    public function getFileNameUrlAttribute()
    {
        if (!empty($this->attributes['fileName'])) {
            if ($this->property_id) {
                return asset('user_upload/Certificates/property_certificate/' . $this->attributes['fileName']);
            } elseif ($this->project_id) {
                return asset('user_upload/Certificates/project_certificate/' . $this->attributes['fileName']);
            }
        }

        return null;
    }
}
