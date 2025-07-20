<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Get cart items for the current user or session
     */
    public function index()
    {
        try {
            if (Auth::check()) {
                // Authenticated user - get from database
                $cartItems = Auth::user()->cartItems()->with('product')->get();
            } else {
                // Guest user - get from session
                $sessionCart = session()->get('cart', []);
                $cartItems = collect();
                
                foreach ($sessionCart as $item) {
                    $product = Product::find($item['product_id']);
                    if ($product && $product->is_active) {
                        $cartItems->push([
                            'id' => $item['id'],
                            'product_id' => $product->id,
                            'quantity' => $item['quantity'],
                            'price' => $product->current_price,
                            'total' => $product->current_price * $item['quantity'],
                            'product' => $product,
                        ]);
                    }
                }
            }

            return handleSuccessReponse(1, __('message.retrieved'), $cartItems);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Add item to cart
     */
    public function add(AddToCartRequest $request)
    {
        try {
            $product = Product::findOrFail($request->product_id);
            
            // Check if product is active
            if (!$product->is_active) {
                return handleErrorResponse(0, 'Product is not available');
            }
            
            // Check inventory
            if ($product->track_inventory && $product->inventory < $request->quantity) {
                return handleErrorResponse(0, "Insufficient inventory. Only {$product->inventory} available.");
            }
            
            if (Auth::check()) {
                // Authenticated user - store in database
                $user = Auth::user();
                
                // Check if product already in cart
                $existingItem = $user->cartItems()->where('product_id', $product->id)->first();
                
                if ($existingItem) {
                    // Check if new total quantity exceeds inventory
                    $newQuantity = $existingItem->quantity + $request->quantity;
                    
                    if ($product->track_inventory && $product->inventory < $newQuantity) {
                        return handleErrorResponse(0, "Cannot add more. Only {$product->inventory} available and you already have {$existingItem->quantity} in your cart.");
                    }
                    
                    // Update existing item
                    $existingItem->update([
                        'quantity' => $newQuantity,
                        'price' => $product->current_price,
                    ]);
                    
                    $cartItem = $existingItem->fresh();
                } else {
                    // Create new item
                    $cartItem = $user->cartItems()->create([
                        'product_id' => $product->id,
                        'quantity' => $request->quantity,
                        'price' => $product->current_price,
                    ]);
                }
                
                $cartItem->load('product');
                return handleSuccessReponse(1, __('message.created'), new CartResource($cartItem));
            } else {
                // Guest user - store in session
                $sessionCart = session()->get('cart', []);
                $cartItemId = 'cart_' . uniqid();
                
                // Check if product already in cart
                $existingItemKey = null;
                foreach ($sessionCart as $key => $item) {
                    if ($item['product_id'] == $product->id) {
                        $existingItemKey = $key;
                        break;
                    }
                }
                
                if ($existingItemKey !== null) {
                    // Check if new total quantity exceeds inventory
                    $newQuantity = $sessionCart[$existingItemKey]['quantity'] + $request->quantity;
                    
                    if ($product->track_inventory && $product->inventory < $newQuantity) {
                        return handleErrorResponse(0, "Cannot add more. Only {$product->inventory} available and you already have {$sessionCart[$existingItemKey]['quantity']} in your cart.");
                    }
                    
                    // Update existing item
                    $sessionCart[$existingItemKey]['quantity'] = $newQuantity;
                    $cartItemId = $sessionCart[$existingItemKey]['id'];
                } else {
                    // Add new item
                    $sessionCart[] = [
                        'id' => $cartItemId,
                        'product_id' => $product->id,
                        'quantity' => $request->quantity,
                    ];
                }
                
                session()->put('cart', $sessionCart);
                
                // Create response data
                $cartItem = [
                    'id' => $cartItemId,
                    'product_id' => $product->id,
                    'quantity' => $existingItemKey !== null ? $sessionCart[$existingItemKey]['quantity'] : $request->quantity,
                    'price' => $product->current_price,
                    'total' => $product->current_price * ($existingItemKey !== null ? $sessionCart[$existingItemKey]['quantity'] : $request->quantity),
                    'product' => $product,
                ];
                
                return handleSuccessReponse(1, __('message.created'), $cartItem);
            }
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update($id, UpdateCartRequest $request)
    {
        try {
            if (Auth::check()) {
                // Authenticated user - update in database
                $cartItem = Auth::user()->cartItems()->findOrFail($id);
                $product = $cartItem->product;
                
                // Check inventory
                if ($product->track_inventory && $product->inventory < $request->quantity) {
                    return handleErrorResponse(0, "Insufficient inventory. Only {$product->inventory} available.");
                }
                
                $cartItem->update([
                    'quantity' => $request->quantity,
                ]);
                
                $cartItem->load('product');
                return handleSuccessReponse(1, __('message.updated'), new CartResource($cartItem));
            } else {
                // Guest user - update in session
                $sessionCart = session()->get('cart', []);
                
                $itemKey = null;
                foreach ($sessionCart as $key => $item) {
                    if ($item['id'] == $id) {
                        $itemKey = $key;
                        break;
                    }
                }
                
                if ($itemKey === null) {
                    return handleErrorResponse(0, 'Cart item not found');
                }
                
                $product = Product::findOrFail($sessionCart[$itemKey]['product_id']);
                
                // Check inventory
                if ($product->track_inventory && $product->inventory < $request->quantity) {
                    return handleErrorResponse(0, "Insufficient inventory. Only {$product->inventory} available.");
                }
                
                $sessionCart[$itemKey]['quantity'] = $request->quantity;
                session()->put('cart', $sessionCart);
                
                // Create response data
                $cartItem = [
                    'id' => $id,
                    'product_id' => $product->id,
                    'quantity' => $request->quantity,
                    'price' => $product->current_price,
                    'total' => $product->current_price * $request->quantity,
                    'product' => $product,
                ];
                
                return handleSuccessReponse(1, __('message.updated'), $cartItem);
            }
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove($id)
    {
        try {
            if (Auth::check()) {
                // Authenticated user - remove from database
                $cartItem = Auth::user()->cartItems()->findOrFail($id);
                $cartItem->delete();
            } else {
                // Guest user - remove from session
                $sessionCart = session()->get('cart', []);
                
                $newCart = array_filter($sessionCart, function($item) use ($id) {
                    return $item['id'] != $id;
                });
                
                session()->put('cart', array_values($newCart));
            }
            
            return handleSuccessReponse(1, __('message.deleted'));
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get cart count
     */
    public function count()
    {
        try {
            if (Auth::check()) {
                // Authenticated user - count from database
                $count = Auth::user()->cartItems()->sum('quantity');
            } else {
                // Guest user - count from session
                $sessionCart = session()->get('cart', []);
                $count = array_sum(array_column($sessionCart, 'quantity'));
            }
            
            return handleSuccessReponse(1, __('message.retrieved'), ['count' => $count]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get cart total
     */
    public function total()
    {
        try {
            $subtotal = 0;
            $itemCount = 0;
            
            if (Auth::check()) {
                // Authenticated user - calculate from database
                $cartItems = Auth::user()->cartItems()->with('product')->get();
                
                foreach ($cartItems as $item) {
                    $subtotal += $item->price * $item->quantity;
                    $itemCount += $item->quantity;
                }
            } else {
                // Guest user - calculate from session
                $sessionCart = session()->get('cart', []);
                
                foreach ($sessionCart as $item) {
                    $product = Product::find($item['product_id']);
                    if ($product && $product->is_active) {
                        $subtotal += $product->current_price * $item['quantity'];
                        $itemCount += $item['quantity'];
                    }
                }
            }
            
            return handleSuccessReponse(1, __('message.retrieved'), [
                'subtotal' => $subtotal,
                'item_count' => $itemCount,
                'total' => $subtotal, // Add delivery fee, discounts, etc. as needed
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Clear cart
     */
    public function clear()
    {
        try {
            if (Auth::check()) {
                // Authenticated user - clear from database
                Auth::user()->cartItems()->delete();
            } else {
                // Guest user - clear from session
                session()->forget('cart');
            }
            
            return handleSuccessReponse(1, 'Cart cleared successfully');
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Validate cart items (check inventory, etc.)
     */
    public function check(){
        try {
            $errors = [];
            $isValid = true;
            
            if (Auth::check()) {
                // Authenticated user - validate from database
                $cartItems = Auth::user()->cartItems()->with('product')->get();
                
                foreach ($cartItems as $item) {
                    $product = $item->product;
                    
                    if (!$product || !$product->is_active) {
                        $errors[] = "Product '{$item->product_name}' is no longer available.";
                        $isValid = false;
                        continue;
                    }
                    
                    if ($product->track_inventory && $product->inventory < $item->quantity) {
                        $errors[] = "Insufficient inventory for '{$product->name}'. Only {$product->inventory} available.";
                        $isValid = false;
                    }
                }
            } else {
                // Guest user - validate from session
                $sessionCart = session()->get('cart', []);
                
                foreach ($sessionCart as $item) {
                    $product = Product::find($item['product_id']);
                    
                    if (!$product || !$product->is_active) {
                        $errors[] = "Product is no longer available.";
                        $isValid = false;
                        continue;
                    }
                    
                    if ($product->track_inventory && $product->inventory < $item['quantity']) {
                        $errors[] = "Insufficient inventory for '{$product->name}'. Only {$product->inventory} available.";
                        $isValid = false;
                    }
                }
            }
            
            return handleSuccessReponse(1, $isValid ? 'Cart is valid' : 'Cart validation failed', [
                'valid' => $isValid,
                'errors' => $errors,
            ]);
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }
}