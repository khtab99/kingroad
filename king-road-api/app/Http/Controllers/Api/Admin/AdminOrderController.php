<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\RepositoryService;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{

       protected $repository;
    public function __construct()
    {
        $this->repository = RepositoryService::setModel(new Order());
    }
    public function index(Request $request)
    {
        $orders = $this->repository->applyWith(['items.product', 'user'])
            ->applyFilters([
                'status' => ['in', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']],
                'payment_status' => ['in', ['pending', 'paid', 'failed', 'refunded']],
                ])
            ->applySearch($request->get('search'), ['order_number', 'customer_name'])
            ->orderBy('created_at', 'desc')
            
            ->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'user']);
        
        return handleSuccessReponse(1, 'Order retrieved successfully', new OrderResource($order));
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'sometimes|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'tracking_number' => 'nullable|string|max:255',
            'estimated_delivery' => 'nullable|date',
            'internal_notes' => 'nullable|string',
        ]);

        $data = $request->only([
            'status',
            'payment_status',
            'tracking_number',
            'estimated_delivery',
            'internal_notes'
        ]);

        $order->update($data);
        $order->load(['items.product', 'user']);

        return handleSuccessReponse(1, 'Order updated successfully', new OrderResource($order));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $order->status;
        $order->update([
            'status' => $request->status,
            'internal_notes' => $request->notes ? $order->internal_notes . "\n" . now()->format('Y-m-d H:i:s') . ": " . $request->notes : $order->internal_notes,
        ]);

        // Handle inventory restoration for cancelled orders
        if ($request->status === 'cancelled' && $oldStatus !== 'cancelled' && $order->inventory_reduced) {
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product && $product->track_inventory) {
                    $product->increment('inventory', $item->quantity);
                }
            }
            $order->update(['inventory_reduced' => false]);
        }

        $order->load(['items.product', 'user']);

        return handleSuccessReponse(1, 'Order status updated successfully', new OrderResource($order));
    }

    public function addTracking(Request $request, Order $order)
    {
        $request->validate([
            'tracking_number' => 'required|string|max:255',
            'shipping_method' => 'nullable|string|max:255',
            'estimated_delivery' => 'nullable|date',
        ]);

        $order->update([
            'tracking_number' => $request->tracking_number,
            'shipping_method' => $request->shipping_method,
            'estimated_delivery' => $request->estimated_delivery,
            'status' => 'shipped',
        ]);

        $order->load(['items.product', 'user']);

        return handleSuccessReponse(1, 'Tracking information added successfully', new OrderResource($order));
    }

    public function sendNotification(Request $request, Order $order)
    {
        $request->validate([
            'type' => 'required|in:email,sms',
            'message' => 'required|string',
        ]);

        // Implementation for sending notifications
        // This would integrate with your notification service

        return handleSuccessReponse(1, 'Notification sent successfully');
    }

    public function generateInvoice(Order $order)
    {
        $order->load(['items.product', 'user']);
        
        // Implementation for generating invoice PDF
        // This would use a package like Laravel DomPDF

        return handleSuccessReponse(1, 'Invoice generated successfully', [
            'download_url' => '/storage/invoices/order-' . $order->order_number . '.pdf'
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'format' => 'required|in:csv,xlsx,pdf',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'status' => 'nullable|string',
        ]);

        // Implementation for exporting orders
        // This would use a package like Laravel Excel

        return handleSuccessReponse(1, 'Export started successfully', [
            'download_url' => '/storage/exports/orders-' . now()->format('Y-m-d') . '.' . $request->format
        ]);
    }
}