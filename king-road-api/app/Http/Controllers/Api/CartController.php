<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only([
            'addToCart',
            'updateQuantity',
            'removeFromCart',
            'getCartTotal',
            'transferGuestCart'
        ]);
    }

    /**
     * Get cart items (authenticated users from DB, guests from session)
     */
    public function index(Request $request)
    {
        try {
            Log::info('Cart index called', [
                'authenticated' => auth()->check(),
                'session_id' => session()->getId(),
                'session_cart' => session('cart', [])
            ]);

            $cartItems = auth()->check() 
                ? $this->getAuthenticatedUserCartItems()
                : $this->getGuestUserCartItems();

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                $cartItems
            );
        } catch (\Exception $e) {
            Log::error('Cart index error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Add item to cart (DB for authenticated, session for guests)
     */
    public function addToCart(AddToCartRequest $request)
    {
        try {
            Log::info('Add to cart called', [
                'authenticated' => auth()->check(),
                'product_id' => $request->product_id,
                'session_id' => session()->getId()
            ]);

            // Ensure session is properly started
            if (!session()->isStarted()) {
                Log::warning('Session not started, starting now');
                session_start();
            }

            // Get the current session cart
            $sessionCart = session()->get('cart', []);
            
            // Add the item to cart
            $product = Product::findOrFail($request->product_id);
            $cartItem = Auth::check()
                ? $this->addToCartDatabase($request, $product)
                : $this->addToCartSession($request, $product);

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
            Log::error('Add to cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Update cart item quantity
     */
    public function updateQuantity($cartItemId, UpdateCartRequest $request)
    {
        Log::info('Update quantity called', [
            'authenticated' => auth()->check(), 
            'cart_item_id' => $cartItemId
        ]);

        try {
            return auth()->check()
                ? $this->updateQuantityDatabase($cartItemId, $request)
                : $this->updateQuantitySession($cartItemId, $request);
        } catch (\Exception $e) {
            Log::error('Update quantity error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Remove item from cart
     */
    public function removeFromCart($cartItemId)
    {
        Log::info('Remove from cart called', [
            'authenticated' => auth()->check(), 
            'cart_item_id' => $cartItemId
        ]);
        
        try {
            return auth()->check()
                ? $this->removeFromCartDatabase($cartItemId)
                : $this->removeFromCartSession($cartItemId);
        } catch (\Exception $e) {
            Log::error('Remove from cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Clear entire cart
     */
    public function clearCart()
    {
        try {
            if (Auth::check()) {
                Auth::user()->cartItems()->delete();
            } else {
                session()->forget('cart');
            }

            return handleSuccessReponse(
                1,
                __('message.deleted'),
                null
            );
        } catch (\Exception $e) {
            Log::error('Clear cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get authenticated user cart items
     */
    private function getAuthenticatedUserCartItems()
    {
        $cartItems = auth()->user()
            ->cartItems()
            ->with(['product.category', 'product.subcategory'])
            ->get();

        return CartResource::collection($cartItems);
    }

    /**
     * Get guest user cart items
     */
    public function getGuestUserCartItems()
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
     * Get cart count
     */
    public function getCartCount()
    {
        try {
            Log::info('Get cart count called', [
                'authenticated' => Auth::check(),
                'session_id' => session()->getId(),
                'session_cart' => session('cart', []) // Log current session cart
            ]);

            if (Auth::check()) {
                $count = Auth::user()->cartItems()->sum('quantity');
            } else {
                $sessionCart = session('cart', []);
                Log::debug('Session cart content', ['cart' => $sessionCart]);
                $count = array_sum(array_column($sessionCart, 'quantity'));
            }

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                ['count' => $count]
            );
        } catch (\Exception $e) {
            Log::error('Get cart count error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get cart total
     */
    public function getCartTotal()
    {
        Log::info('Get cart total called', [
            'authenticated' => Auth::check(),
            'session_id' => session()->getId()
        ]);
        
        try {
            if (Auth::check()) {
                $cartItems = Auth::user()->cartItems()->with('product')->get();
                $subtotal = $this->calculateSubtotal($cartItems);
                $itemCount = $cartItems->sum('quantity');
                return $this->buildCartTotalResponse($subtotal, $itemCount);
            } else {
                $result = $this->calculateGuestCartTotal();
                $subtotal = $result['subtotal'];
                $itemCount = $result['itemCount'];
                return $this->buildCartTotalResponse($subtotal, $itemCount);
            }
        } catch (\Exception $e) {
            Log::error('Get cart total error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Transfer guest cart to authenticated user cart
     */
    public function transferGuestCart()
    {
        Log::info('Transfer guest cart called', ['authenticated' => Auth::check()]);
        
        try {
            if (!Auth::check()) {
                return handleErrorResponse(0, 'User must be authenticated to transfer cart');
            }

            $sessionCart = Session::get('cart', []);
            
            if (empty($sessionCart)) {
                return handleSuccessReponse(
                    1,
                    'No guest cart items to transfer',
                    null
                );
            }

            return DB::transaction(function () use ($sessionCart) {
                $transferredCount = $this->transferCartItems($sessionCart);
                Session::forget('cart');

                return handleSuccessReponse(
                    1,
                    "Successfully transferred {$transferredCount} items to your cart",
                    ['transferred_count' => $transferredCount]
                );
            });
        } catch (\Exception $e) {
            Log::error('Transfer guest cart error', ['error' => $e->getMessage()]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Add item to cart for authenticated user
     */
    private function addToCartDatabase($request, $product)
    {
        $user = Auth::user();
        $existingCartItem = $user->cartItems()->where('product_id', $product->id)->first();

        if ($existingCartItem) {
            $newQuantity = $existingCartItem->quantity + $request->quantity;
            $this->validateProductAvailability($product, $newQuantity);

            $existingCartItem->update([
                'quantity' => $newQuantity,
                'price' => $product->current_price,
            ]);

            $cartItem = $existingCartItem->fresh(['product.category', 'product.subcategory']);
        } else {
            $cartItem = $user->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->current_price,
            ]);

            $cartItem->load(['product.category', 'product.subcategory']);
        }

        return handleSuccessReponse(
            1,
            __('message.created'),
            new CartResource($cartItem)
        );
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
     * Update cart item quantity for authenticated user
     */
    private function updateQuantityDatabase($cartItemId, $request)
    {
        $cartItem = Cart::findOrFail($cartItemId);
        
        // Ensure user owns this cart item
        if ($cartItem->user_id !== auth()->id()) {
            return handleErrorResponse(0, 'Unauthorized access to cart item');
        }

        $product = $cartItem->product;
        $this->validateProductAvailability($product, $request->quantity);

        $cartItem->update([
            'quantity' => $request->quantity,
            'price' => $product->current_price,
        ]);

        $cartItem->load(['product.category', 'product.subcategory']);

        return handleSuccessReponse(
            1,
            __('message.updated'),
            new CartResource($cartItem)
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
     * Remove item from cart for authenticated user
     */
    private function removeFromCartDatabase($cartItemId)
    {
        $cartItem = Cart::findOrFail($cartItemId);
        
        // Ensure user owns this cart item
        if ($cartItem->user_id !== auth()->id()) {
            return handleErrorResponse(0, 'Unauthorized access to cart item');
        }

        $cartItem->delete();

        return handleSuccessReponse(
            1,
            __('message.deleted'),
            null
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
     * Calculate subtotal for authenticated user cart
     */
    private function calculateSubtotal($cartItems)
    {
        return $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->current_price;
        });
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
     * Transfer cart items from guest to authenticated user
     */
    private function transferCartItems(array $sessionCart): int
    {
        $user = Auth::user();
        $transferredCount = 0;

        foreach ($sessionCart as $item) {
            $product = Product::findOrFail($item['product_id']);
            $existingCartItem = $user->cartItems()->where('product_id', $product->id)->first();

            if ($existingCartItem) {
                $newQuantity = $existingCartItem->quantity + $item['quantity'];
                $this->validateProductAvailability($product, $newQuantity);
                $existingCartItem->update([
                    'quantity' => $newQuantity,
                    'price' => $product->current_price,
                ]);
            } else {
                $user->cartItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->current_price,
                ]);
            }

            $transferredCount++;
        }

        return $transferredCount;
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