<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = auth()->user()
            ->orders()
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    public function store(CreateOrderRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $user = auth()->user();
            
            // Get cart items
            $cartItems = $user->cartItems()->with('product')->get();
            
            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }
            
            // Calculate totals from cart
            $subtotal = 0;
            $orderItems = [];

            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                
                // Check inventory
                if ($product->track_inventory && $product->inventory < $cartItem->quantity) {
                    throw new \Exception("Insufficient inventory for product: {$product->name}");
                }

                $price = $cartItem->price; // Use cart price
                $total = $price * $cartItem->quantity;
                $subtotal += $total;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name_en,
                    'product_sku' => $product->sku,
                    'product_image' => $product->featured_image,
                    'quantity' => $cartItem->quantity,
                    'price' => $price,
                    'total' => $total,
                ];

                // Update inventory
                if ($product->track_inventory) {
                    $product->decrement('inventory', $cartItem->quantity);
                }
            }

            $deliveryFee = $data['delivery_fee'] ?? 0;
            $total = $subtotal + $deliveryFee;

            // Handle address - either use existing address or create from form data
            $addressData = [];
            if (isset($data['address_id'])) {
                $address = Address::where('id', $data['address_id'])
                    ->where('user_id', $user->id)
                    ->firstOrFail();
                
                $addressData = [
                    'address_type' => $address->type,
                    'street' => $address->street,
                    'house_number' => $address->house_number,
                    'building_number' => $address->building_number,
                    'floor' => $address->floor,
                    'apartment_number' => $address->apartment_number,
                    'office_number' => $address->office_number,
                    'additional_description' => $address->additional_description,
                    'city' => $address->city,
                    'country' => $address->country,
                ];
            } else {
                $addressData = [
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
                ];
            }

            // Create order
            $order = Order::create(array_merge($addressData, [
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'customer_phone' => $data['customer_phone'],
                'customer_email' => $user->email,
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'discount' => 0,
                'total' => $total,
                'payment_method' => $data['payment_method'] ?? null,
                'customer_notes' => $data['customer_notes'] ?? null,
            ]));

            // Create order items
            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            // Clear user's cart after successful order
            $user->cartItems()->delete();

            $order->load(['items.product']);

            return handleSuccessReponse(
                1,
                'Order created successfully',
                new OrderResource($order)
            );
        });
    }

    public function show(Order $order)
    {
        // Ensure user can only view their own orders
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $order->load(['items.product']);
        
        return new OrderResource($order);
    }

    public function cancel(Order $order)
    {
        // Ensure user can only cancel their own orders
        if ($order->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'Order cannot be cancelled at this stage',
            ], 422);
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

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => new OrderResource($order->fresh(['items.product'])),
            ]);
        });
    }
}