<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriceHistory extends Model
{
    protected $fillable = [
        'product_name',
        'price',
        'changed_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'changed_at' => 'datetime',
    ];
}
