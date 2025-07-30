<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'address_type',
        'street',
        'house_number',
        'building_number',
        'floor',
        'apartment_number',
        'office_number',
        'additional_description',
        'city',
        'emirate',
        'country',
        'subtotal',
        'delivery_fee',
        'discount',
       'coupon_code',
        'total',
        'status',
        'payment_method',
        'payment_status',
       'inventory_reduced',
        'payment_reference',
        'shipping_method',
        'tracking_number',
        'estimated_delivery',
        'customer_notes',
        'internal_notes',
        'created_at',
        'updated_at',
        'deleted_at',
        'checkout_session_id',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'estimated_delivery' => 'datetime',
       'inventory_reduced' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePaymentStatus($query, $status)
    {
        return $query->where('payment_status', $status);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopeGuest($query)
    {
        return $query->whereNull('user_id');
    }

    public function scopeRegistered($query)
    {
        return $query->whereNotNull('user_id');
    }

    public function getFormattedAddressAttribute()
    {
        $parts = [$this->street];

        switch ($this->address_type) {
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
        $parts[] = $this->emirate;

        $parts[] = $this->city;
        $parts[] = $this->country;

        return implode(', ', array_filter($parts));
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'blue',
            'processing' => 'purple',
            'shipped' => 'indigo',
            'delivered' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    public function getPaymentStatusColorAttribute()
    {
        return match($this->payment_status) {
            'pending' => 'yellow',
            'paid' => 'green',
            'failed' => 'red',
            'refunded' => 'orange',
            default => 'gray',
        };
    }

    public static function generateOrderNumber()
    {
        $prefix = 'KR';
        $timestamp = now()->format('ymd');
        $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        
        return $prefix . $timestamp . $random;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (!$order->order_number) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }
}