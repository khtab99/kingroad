<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'street',
        'house_number',
        'building_number',
        'floor',
        'apartment_number',
        'office_number',
        'additional_description',
        'city',
        'country',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedAddressAttribute()
    {
        $parts = [$this->street];

        switch ($this->type) {
            case 'house':
                if ($this->house_number) {
                    $parts[] = "House No. {$this->house_number}";
                }
                break;
            case 'apartment':
                if ($this->building_number) {
                    $parts[] = "Building No. {$this->building_number}";
                }
                if ($this->floor) {
                    $parts[] = "Floor {$this->floor}";
                }
                if ($this->apartment_number) {
                    $parts[] = "Apartment No. {$this->apartment_number}";
                }
                break;
            case 'office':
                if ($this->building_number) {
                    $parts[] = "Building No. {$this->building_number}";
                }
                if ($this->floor) {
                    $parts[] = "Floor {$this->floor}";
                }
                if ($this->office_number) {
                    $parts[] = "Office No. {$this->office_number}";
                }
                break;
        }

        if ($this->additional_description) {
            $parts[] = $this->additional_description;
        }

        $parts[] = $this->city;
        $parts[] = $this->country;

        return implode(', ', array_filter($parts));
    }
}