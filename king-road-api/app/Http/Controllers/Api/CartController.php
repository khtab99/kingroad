<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        try {
            $cartItems = auth()->user()
                ->cartItems()
                ->with(['product.category', 'product.subcategory'])
                ->get();

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                CartResource::collection($cartItems)
            );
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function addToCart(AddToCartRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $product = Product::findOrFail($request->product_id);
                
                // Check if product is active and available
                if (!$product->is_active) {
                    return handleErrorResponse(0, 'Product is not available');
                }

                // Check inventory if tracking is enabled
                if ($product->track_inventory && $product->inventory < $request->quantity) {
                    return handleErrorResponse(0, 'Insufficient inventory. Available: ' . $product->inventory);
                }

                $user = auth()->user();
                
                // Check if item already exists in cart
                $existingCartItem = $user->cartItems()
                    ->where('product_id', $product->id)
                    ->first();

                if ($existingCartItem) {
                    // Update quantity
                    $newQuantity = $existingCartItem->quantity + $request->quantity;
                    
                    // Check inventory for new quantity
                    if ($product->track_inventory && $product->inventory < $newQuantity) {
                        return handleErrorResponse(0, 'Cannot add more items. Available: ' . $product->inventory . ', In cart: ' . $existingCartItem->quantity);
                    }

                    $existingCartItem->update([
                        'quantity' => $newQuantity,
                        'price' => $product->current_price, // Update price in case it changed
                    ]);

                    $cartItem = $existingCartItem->fresh(['product.category', 'product.subcategory']);
                } else {
                    // Create new cart item
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
            });
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function updateQuantity(UpdateCartRequest $request, Cart $cartItem)
    {
        try {
            // Ensure user owns this cart item
            if ($cartItem->user_id !== auth()->id()) {
                return handleErrorResponse(0, 'Unauthorized access to cart item');
            }

            return DB::transaction(function () use ($request, $cartItem) {
                $product = $cartItem->product;

                // Check inventory if tracking is enabled
                if ($product->track_inventory && $product->inventory < $request->quantity) {
                    return handleErrorResponse(0, 'Insufficient inventory. Available: ' . $product->inventory);
                }

                $cartItem->update([
                    'quantity' => $request->quantity,
                    'price' => $product->current_price, // Update price in case it changed
                ]);

                $cartItem->load(['product.category', 'product.subcategory']);

                return handleSuccessReponse(
                    1,
                    __('message.updated'),
                    new CartResource($cartItem)
                );
            });
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function removeFromCart(Cart $cartItem)
    {
        try {
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
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function clearCart()
    {
        try {
            auth()->user()->cartItems()->delete();

            return handleSuccessReponse(
                1,
                __('message.deleted'),
                null
            );
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function getCartCount()
    {
        try {
            $count = auth()->user()->cartItems()->sum('quantity');

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                ['count' => $count]
            );
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }

    public function getCartTotal()
    {
        try {
            $cartItems = auth()->user()->cartItems()->with('product')->get();
            
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * $item->product->current_price;
            });

            $itemCount = $cartItems->sum('quantity');

            return handleSuccessReponse(
                1,
                __('message.retrieved'),
                [
                    'subtotal' => $subtotal,
                    'item_count' => $itemCount,
                    'delivery_fee' => 0, // Can be calculated based on business logic
                    'total' => $subtotal + 0, // subtotal + delivery_fee
                ]
            );
        } catch (\Exception $e) {
            return handleErrorResponse(0, $e);
        }
    }
}