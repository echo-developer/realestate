<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FaqList extends Model
{
    use HasFactory;

    protected $table = 'faq_list';

    protected $fillable = [
        'id',
        'faq_category_id',
        'status',
        'order',
        'created_at',
        'updated_at',
    ];

}
