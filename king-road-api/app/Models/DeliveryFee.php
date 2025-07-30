<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryFee extends Model
{
        use HasFactory;

    protected $fillable = [
        'base_fee',
        'additional_per_km',
        'free_delivery_min_total',
        'region',
        'is_active',

    ];

    protected $casts = [
        'base_fee' => 'float',
        'additional_per_km' => 'float',
        'free_delivery_min_total' => 'float',
        'is_active' => 'boolean',
    ];


}
