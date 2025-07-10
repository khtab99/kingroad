<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateGuestOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuestOrderController extends Controller
{
    /**
     * Create order for guest user
     */
    public function store(CreateGuestOrderRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = $request->validated();
                
                // Get cart items from session
                $sessionCart = session('cart', []);
                
                if (empty($sessionCart)) {
                    return handleErrorResponse(0, 'Cart is empty');
                }
                
                // Calculate totals from session cart
                $subtotal = 0;
                $orderItems = [];

                foreach ($sessionCart as $cartItem) {
                    $product = Product::find($cartItem['product_id']);
                    
                    if (!$product) {
                        continue;
                    }
                    
                    // Check inventory
                    if ($product->track_inventory && $product->inventory < $cartItem['quantity']) {
                        return handleErrorResponse(0, "Insufficient inventory for product: {$product->name}");
                    }

                    $price = $cartItem['price']; // Use cart price
                    $total = $price * $cartItem['quantity'];
                    $subtotal += $total;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name_en,
                        'product_sku' => $product->sku,
                        'product_image' => $product->featured_image,
                        'quantity' => $cartItem['quantity'],
                        'price' => $price,
                        'total' => $total,
                    ];

                    // Update inventory
                    if ($product->track_inventory) {
                        $product->decrement('inventory', $cartItem['quantity']);
                    }
                }

                if (empty($orderItems)) {
                    return handleErrorResponse(0, 'No valid items in cart');
                }

                $deliveryFee = $data['delivery_fee'] ?? 0;
                $total = $subtotal + $deliveryFee;

                // Create order with address data
                $order = Order::create([
                    'user_id' => null, // Guest order
                    'customer_name' => $data['customer_name'],
                    'customer_phone' => $data['customer_phone'],
                    'customer_email' => $data['customer_email'] ?? null,
                    'address_type' => $data['address_type'],
                    'street' => $data['street'],
                    'house_number' => $data['house_number'] ?? null,
                    'building_number' => $data['building_number'] ?? null,
                    'floor' => $data['floor'] ?? null,
                    'apartment_number' => $data['apartment_number'] ?? null,
                    'office_number' => $data['office_number'] ?? null,
                    'additional_description' => $data['additional_description'] ?? null,
                    'city' => $data['city'] ?? 'Umm Al Quwain',
                    'country' => $data['country'] ?? 'United Arab Emirates',
                    'subtotal' => $subtotal,
                    'delivery_fee' => $deliveryFee,
                    'discount' => 0,
                    'total' => $total,
                    'payment_method' => $data['payment_method'] ?? 'cash_on_delivery',
                    'customer_notes' => $data['customer_notes'] ?? null,
                ]);

                // Create order items
                foreach ($orderItems as $item) {
                    $order->items()->create($item);
                }

                // Clear session cart after successful order
                session()->forget('cart');
                session()->save();

                $order->load(['items.product']);

                Log::info('Guest order created successfully', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'total' => $order->total
                ]);

                return handleSuccessReponse(
                    1,
                    'Order created successfully',
                    new OrderResource($order)
                );
            });
        } catch (\Exception $e) {
            Log::error('Guest order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Get guest order by order number and phone
     */
    public function show(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'customer_phone' => 'required|string',
        ]);

        try {
            $order = Order::where('order_number', $request->order_number)
                ->where('customer_phone', $request->customer_phone)
                ->whereNull('user_id') // Ensure it's a guest order
                ->with(['items.product'])
                ->first();

            if (!$order) {
                return handleErrorResponse(0, 'Order not found or phone number does not match');
            }

            return handleSuccessReponse(
                1,
                'Order retrieved successfully',
                new OrderResource($order)
            );
        } catch (\Exception $e) {
            Log::error('Guest order retrieval failed', [
                'error' => $e->getMessage(),
                'order_number' => $request->order_number
            ]);
            return handleErrorResponse(0, $e);
        }
    }

    /**
     * Cancel guest order
     */
    public function cancel(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'customer_phone' => 'required|string',
        ]);

        try {
            $order = Order::where('order_number', $request->order_number)
                ->where('customer_phone', $request->customer_phone)
                ->whereNull('user_id') // Ensure it's a guest order
                ->first();

            if (!$order) {
                return handleErrorResponse(0, 'Order not found or phone number does not match');
            }

            if (!in_array($order->status, ['pending', 'confirmed'])) {
                return handleErrorResponse(0, 'Order cannot be cancelled at this stage');
            }

            return DB::transaction(function () use ($order) {
                // Restore inventory
                foreach ($order->items as $item) {
                    $product = $item->product;
                    if ($product && $product->track_inventory) {
                        $product->increment('inventory', $item->quantity);
                    }
                }

                $order->update(['status' => 'cancelled']);

                Log::info('Guest order cancelled', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number
                ]);

                return handleSuccessReponse(
                    1,
                    'Order cancelled successfully',
                    new OrderResource($order->fresh(['items.product']))
                );
            });
        } catch (\Exception $e) {
            Log::error('Guest order cancellation failed', [
                'error' => $e->getMessage(),
                'order_number' => $request->order_number ?? 'unknown'
            ]);
            return handleErrorResponse(0, $e);
        }
    }
}