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
    protected $appends = ['customer_details'];

    public function customerDetails(): Attribute
    {
        return Attribute::get(function () {
            $customer = DB::table('customer')
                ->select('Name', 'Email', 'Phone')
                ->where('cid', $this->customer_id)
                ->first();

            return $customer ? (array) $customer : null;
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
}
