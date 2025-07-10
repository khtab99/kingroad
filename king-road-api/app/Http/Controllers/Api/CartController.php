<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Get guest cart items from session
     */
    public function index(Request $request)
    {
        try {
            Log::info('Guest cart index called', [
                'session_id' => session()->getId(),
                'session_cart' => session('cart', [])
            ]);

            $cartItems = $this->getGuestUserCartItems();

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                $cartItems
            );
        } catch (\Exception $e) {
            Log::error('Guest cart index error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Add item to guest cart (session only)
     */
    public function addToCart(AddToCartRequest $request)
    {
        try {
            Log::info('Add to guest cart called', [
                'product_id' => $request->product_id,
                'session_id' => session()->getId()
            ]);

            // Get the current session cart
            $sessionCart = session()->get('cart', []);
            
            // Add the item to cart
            $product = Product::findOrFail($request->product_id);
            $cartItem = $this->addToCartSession($request, $product);

            // Force session save after cart operation
            session()->save();
            
            // Verify the session was saved
            $savedCart = session()->get('cart', []);
            Log::debug('Session cart after save', [
                'cart' => $savedCart,
                'session_id' => session()->getId()
            ]);

            return $cartItem;
        } catch (\Exception $e) {
            Log::error('Add to guest cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Update guest cart item quantity
     */
    public function updateQuantity($cartItemId, UpdateCartRequest $request)
    {
        Log::info('Update guest cart quantity called', [
            'cart_item_id' => $cartItemId
        ]);

        try {
            return $this->updateQuantitySession($cartItemId, $request);
        } catch (\Exception $e) {
            Log::error('Update guest cart quantity error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Remove item from guest cart
     */
    public function removeFromCart($cartItemId)
    {
        Log::info('Remove from guest cart called', [
            'cart_item_id' => $cartItemId
        ]);
        
        try {
            return $this->removeFromCartSession($cartItemId);
        } catch (\Exception $e) {
            Log::error('Remove from guest cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Clear entire guest cart
     */
    public function clearCart()
    {
        try {
            session()->forget('cart');
            session()->save();

            return handleSuccessReponse(
                1,
                __('message.deleted'),
                null
            );
        } catch (\Exception $e) {
            Log::error('Clear guest cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get guest user cart items
     */
    private function getGuestUserCartItems()
    {
        try {
            $sessionCart = session('cart', []);
            
            Log::debug('Getting guest cart items', [
                'session_cart' => $sessionCart,
                'session_id' => session()->getId()
            ]);
            
            if (empty($sessionCart)) {
                return [];
            }

            $cartItems = collect($sessionCart)->map(function ($item) {
                $product = Product::findOrFail($item['product_id']);
                return $this->formatSessionCartItem($item, $product);
            });

            return $cartItems->toArray();
        } catch (\Exception $e) {
            Log::error('Get guest cart items error', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get guest cart count
     */
    public function getCartCount()
    {
        try {
            Log::info('Get guest cart count called', [
                'session_id' => session()->getId(),
                'session_cart' => session('cart', [])
            ]);

            $sessionCart = session('cart', []);
            Log::debug('Session cart content', ['cart' => $sessionCart]);
            $count = array_sum(array_column($sessionCart, 'quantity'));

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                ['count' => $count]
            );
        } catch (\Exception $e) {
            Log::error('Get guest cart count error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get guest cart total
     */
    public function getCartTotal()
    {
        Log::info('Get guest cart total called', [
            'session_id' => session()->getId()
        ]);
        
        try {
            $result = $this->calculateGuestCartTotal();
            $subtotal = $result['subtotal'];
            $itemCount = $result['itemCount'];
            return $this->buildCartTotalResponse($subtotal, $itemCount);
        } catch (\Exception $e) {
            Log::error('Get guest cart total error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Add item to cart for guest user
     */
    private function addToCartSession($request, $product)
    {
        // Get the session cart with proper initialization
        $sessionCart = session()->get('cart', []);
        
        // Ensure we have a proper array
        if (!is_array($sessionCart)) {
            $sessionCart = [];
        }

        $productId = $product->id;
        $existingIndex = $this->findCartItemIndex($sessionCart, $productId);

        if ($existingIndex !== null) {
            $newQuantity = $sessionCart[$existingIndex]['quantity'] + $request->quantity;
            $this->validateProductAvailability($product, $newQuantity);

            $sessionCart[$existingIndex]['quantity'] = $newQuantity;
            $sessionCart[$existingIndex]['price'] = $product->current_price;
        } else {
            $sessionCart[] = [
                'id' => uniqid('cart_'),
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->current_price,
                'created_at' => now()->toISOString(),
            ];
        }

        // Save the session data
        session()->put('cart', $sessionCart);
        
        // Force session save and regenerate session ID
        session()->save();
        session()->regenerate();

        // Verify the session was saved
        $savedCart = session()->get('cart', []);
        Log::debug('Session cart after save', [
            'cart' => $savedCart,
            'session_id' => session()->getId()
        ]);

        $cartItem = $this->formatSessionCartItem(end($sessionCart), $product);

        return handleSuccessReponse(
            1,
            __('message.created'),
            $cartItem
        );
    }

    /**
     * Update cart item quantity for guest user
     */
    private function updateQuantitySession($cartItemId, $request)
    {
        $sessionCart = session('cart', []);
        $itemIndex = $this->findCartItemIndex($sessionCart, $cartItemId, 'id');
        
        if ($itemIndex === null) {
            return handleErrorResponse(0, 'Cart item not found');
        }

        $product = Product::findOrFail($sessionCart[$itemIndex]['product_id']);
        $this->validateProductAvailability($product, $request->quantity);

        $sessionCart[$itemIndex]['quantity'] = $request->quantity;
        $sessionCart[$itemIndex]['price'] = $product->current_price;
        
        session(['cart' => $sessionCart]);
        session()->save();

        $cartItem = $this->formatSessionCartItem($sessionCart[$itemIndex], $product);

        return handleSuccessReponse(
            1,
            __('message.updated'),
            $cartItem
        );
    }

    /**
     * Remove item from cart for guest user
     */
    private function removeFromCartSession($cartItemId)
    {
        $sessionCart = session('cart', []);
        $itemIndex = $this->findCartItemIndex($sessionCart, $cartItemId, 'id');
        
        if ($itemIndex === null) {
            return handleErrorResponse(0, 'Cart item not found');
        }

        // Remove the item from the array
        array_splice($sessionCart, $itemIndex, 1);
        
        session(['cart' => $sessionCart]);
        session()->save();

        Log::debug('Removed item from session cart', [
            'cart_item_id' => $cartItemId,
            'remaining_items' => count($sessionCart)
        ]);

        return handleSuccessReponse(
            1,
            __('message.deleted'),
            null
        );
    }

    /**
     * Calculate guest cart total
     */
    private function calculateGuestCartTotal()
    {
        $sessionCart = session('cart', []);
        $subtotal = 0;
        $itemCount = 0;

        foreach ($sessionCart as $item) {
            $product = Product::find($item['product_id']);
            if ($product) {
                $subtotal += $item['quantity'] * $product->current_price;
                $itemCount += $item['quantity'];
            }
        }

        return [
            'subtotal' => $subtotal,
            'itemCount' => $itemCount
        ];
    }

    /**
     * Validate product availability
     */
    private function validateProductAvailability($product, $quantity)
    {
        if (!$product->is_active) {
            throw new \Exception('Product is not available');
        }

        if ($product->track_inventory && $product->inventory < $quantity) {
            throw new \Exception('Insufficient inventory. Available: ' . $product->inventory);
        }
    }

    /**
     * Build cart total response
     */
    private function buildCartTotalResponse(float $subtotal, int $itemCount)
    {
        return handleSuccessReponse(
            1,
            __('message.retrieved'),
            [
                'subtotal' => $subtotal,
                'item_count' => $itemCount,
                'total' => $subtotal,
            ]
        );
    }

    private function findCartItemIndex(array $cart, $value, string $key = 'product_id'): ?int
    {
        foreach ($cart as $index => $item) {
            if ($item[$key] == $value) {
                return $index;
            }
        }
        return null;
    }

    private function formatSessionCartItem(array $sessionItem, Product $product): array
    {
        return [
            'id' => $sessionItem['id'],
            'user_id' => null,
            'product_id' => $sessionItem['product_id'],
            'quantity' => $sessionItem['quantity'],
            'price' => $sessionItem['price'],
            'total' => $sessionItem['quantity'] * $sessionItem['price'],
            'product' => [
                'id' => $product->id,
                'name_en' => $product->name_en,
                'name_ar' => $product->name_ar,
                'name' => $product->name,
                'slug' => $product->slug,
                'sku' => $product->sku,
                'price' => $product->price,
                'current_price' => $product->current_price,
                'featured_image' => $product->featured_image,
                'is_active' => $product->is_active,
                'is_in_stock' => $product->is_in_stock,
                'inventory' => $product->inventory,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name_en' => $product->category->name_en,
                    'name_ar' => $product->category->name_ar,
                    'name' => $product->category->name,
                ] : null,
            ],
            'created_at' => $sessionItem['created_at'] ?? now()->toISOString(),
            'updated_at' => now()->toISOString(),
        ];
    }
}