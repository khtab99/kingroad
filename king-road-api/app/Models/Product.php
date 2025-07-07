<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
        'slug',
        'description_en',
        'description_ar',
        'sku',
        'barcode',
        'price',
        'sale_price',
        'cost_price',
        'inventory',
        'low_stock_threshold',
        'track_inventory',
        'category_id',
        'subcategory_id',
        'images',
        'featured_image',
        'weight',
        'dimensions',
        'is_active',
        'is_featured',
        'tags',
        'meta_title',
        'meta_description',
        'views',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'track_inventory' => 'boolean',
        'images' => 'array',
        'featured_image' => 'string',
        'dimensions' => 'array',
        'tags' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('inventory', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('inventory', '<=', 'low_stock_threshold');
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('inventory', 0);
    }

    public function getNameAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function getDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }

    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getIsOnSaleAttribute()
    {
        return !is_null($this->sale_price) && $this->sale_price < $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if (!$this->is_on_sale) {
            return 0;
        }

        return round((($this->price - $this->sale_price) / $this->price) * 100);
    }

    public function getIsInStockAttribute()
    {
        return $this->inventory > 0;
    }

    public function getIsLowStockAttribute()
    {
        return $this->inventory <= $this->low_stock_threshold && $this->inventory > 0;
    }

    public function incrementViews()
    {
        $this->increment('views');
    }

    public function updateRating()
    {
        $avgRating = $this->approvedReviews()->avg('rating');
        $reviewsCount = $this->approvedReviews()->count();

        $this->update([
            'rating' => $avgRating ? round($avgRating, 2) : 0,
            'reviews_count' => $reviewsCount,
        ]);
    }

    public function getFeaturedImageAttribute($value)
{
    return $value
        ? url($value) // adds domain like http://yourdomain.com/storage/...
        : null;
}
}