<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Http\Resources\OrderResource;
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

        $subtotal = 0;
        $orderItems = [];

        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);

            // Optional inventory check (disabled)
            // if ($product->track_inventory && $product->inventory < $item['quantity']) {
            //     throw new \Exception("Insufficient inventory for product: {$product->name}");
            // }

            $price = $product->current_price;
            $total = $price * $item['quantity'];
            $subtotal += $total;

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'product_image' => $product->featured_image,
                'quantity' => $item['quantity'],
                'price' => $price,
                'total' => $total,
            ];

            if ($product->track_inventory) {
                $product->decrement('inventory', $item['quantity']);
            }
        }

        // Handle coupon
        $discount = 0;
        if (!empty($data['coupon_code'])) {
            $coupon = \App\Models\Coupon::where('code', $data['coupon_code'])->valid()->first();
            if ($coupon) {
                $discount = $coupon->calculateDiscount($subtotal);
                $coupon->incrementUsage();
            }
        }

        $deliveryFee = $data['delivery_fee'] ?? 0;
        $total = $subtotal + $deliveryFee - $discount;

        $order = Order::create([
         'user_id' => auth()->check() ? auth()->id() : null,


            'customer_name' => $data['customer_name'],
            'customer_phone' => $data['customer_phone'],
'customer_email' => $data['customer_email'] ?? (auth()->check() ? auth()->user()->email : null),
            'address_type' => $data['address_type'],
            'street' => $data['street'],
            'house_number' => $data['house_number'] ?? null,
            'building_number' => $data['building_number'] ?? null,
            'floor' => $data['floor'] ?? null,
            'apartment_number' => $data['apartment_number'] ?? null,
            'office_number' => $data['office_number'] ?? null,
            'additional_description' => $data['additional_description'] ?? null,
            'subtotal' => $subtotal,
            'delivery_fee' => $deliveryFee,
            'discount' => $discount,
            'total' => $total,
            'payment_method' => $data['payment_method'] ?? null,
            'customer_notes' => $data['customer_notes'] ?? null,
        ]);

        // Attach items
        foreach ($orderItems as $item) {
            $order->items()->create($item);
        }

        $order->load(['items.product']);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => new OrderResource($order),
        ], 201);
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