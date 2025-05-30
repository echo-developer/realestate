<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SiteVisit extends Model
{
    use HasFactory;

    protected $table = 'site_visit';
    protected $fillable = ['property_id', 'customer_id', 'property_posted_by', 'visit_date', 'visit_time', 'created_at', 'updated_at'];
    protected $appends = ['property_details'];

    // public function customerDetails(): Attribute
    // {
    //     return Attribute::get(function () {
    //         $customer = DB::table('customer')
    //             ->select('Name', 'Email', 'Phone')
    //             ->where('cid', $this->customer_id)
    //             ->first();

    //         return $customer ? (array) $customer : null;
    //     });
    // }

    public function getCustomerDetails( $blur = 0): ?array
    {
        $customer = DB::table('customer')
            ->select('Name', 'Email', 'Phone')
            ->where('cid', $this->customer_id)
            ->first();

        if (!$customer) {
            return null;
        }

        $details = [
            'Name'  => $customer->Name,
            'Email' => $customer->Email,
            'Phone' => $customer->Phone,
        ];

        if ($blur == 1) {
            $details = [
                'Name'  => blur_text($details['Name'], 1),
                'Email' => blur_text($details['Email'], 1),
                'Phone' => blur_text($details['Phone'], 1),
            ];
        }

        return $details;
    }

    public function propertyDetails(): Attribute
    {
        return Attribute::get(function () {
            $property = PrefProperty::select('name', 'slug')
                ->find($this->property_id);

            return $property ? [
                'name' => $property->name,
                'slug' => $property->slug,
            ] : null;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'property_posted_by');
    }
    public function userMembership()
    {
        return $this->belongsTo(UserMembership::class, 'property_posted_by', 'user_id');
    }

    public function assignedLead()
    {
        return $this->hasOne(LeadAssigned::class, 'enquery_id', 'id')
            ->where('lead_type', 'SV');
    }
}
