<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_en',
        'description_en',
        'title_ar',
        'description_ar',
        'image',
        'status',
    ];

    protected $casts = [
    'status' => 'string', // or 'boolean' if 1/0
];

}
