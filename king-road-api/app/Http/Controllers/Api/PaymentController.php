<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'success_url' => 'required|url',
                'cancel_url' => 'required|url',
            ]);

            $order = Order::with('items.product')->findOrFail($request->order_id);
            
            // Check if order is already paid
            if ($order->payment_status === 'paid') {
                return handleSuccessReponse(1, __('message.order_already_paid'), [
                    'redirect_url' => $request->success_url . '?order=' . $order->order_number . '&phone=' . urlencode($order->customer_phone)
                ]);
            }

            // Set Stripe API key
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Prepare line items for Stripe
            $lineItems = [];
            foreach ($order->items as $item) {
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'aed',
                        'product_data' => [
                            'name' => $item->product_name,
                            'images' => [$item->product_image ? url($item->product_image) : null],
                            'metadata' => [
                                'product_id' => $item->product_id,
                                'sku' => $item->product_sku,
                            ],
                        ],
                        'unit_amount' => (int)($item->price * 100), // Convert to cents
                    ],
                    'quantity' => $item->quantity,
                ];
            }

            // Add delivery fee if applicable
            if ($order->delivery_fee > 0) {
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'aed',
                        'product_data' => [
                            'name' => 'Delivery Fee',
                        ],
                        'unit_amount' => (int)($order->delivery_fee * 100), // Convert to cents
                    ],
                    'quantity' => 1,
                ];
            }

            // Create Stripe checkout session
            $session = StripeSession::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => $request->success_url . '?order=' . $order->order_number . '&phone=' . urlencode($order->customer_phone) . '&session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $request->cancel_url,
                'client_reference_id' => $order->order_number,
                'customer_email' => $order->customer_email,
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);

            // Update order with payment reference
            $order->update([
                'payment_reference' => $session->id,
            ]);

            return handleSuccessReponse(1, __('message.payment_started'), [
                'checkout_url' => $session->url,
                'session_id' => $session->id,
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage(), [
                'order_id' => $request->order_id ?? null,
                'error' => $e->getMessage(),
            ]);
            return handleErrorResponse(0, __('message.payment_error') . ': ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Payment Error: ' . $e->getMessage(), [
                'order_id' => $request->order_id ?? null,
                'error' => $e->getMessage(),
            ]);
            return handleErrorResponse(0, __('message.payment_error'));
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        try {
            // Set Stripe API key
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Verify webhook signature
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sigHeader, $endpointSecret
            );

            // Handle the event
            switch ($event->type) {
                case 'checkout.session.completed':
                    $session = $event->data->object;
                    $this->handleSuccessfulPayment($session);
                    break;
                case 'checkout.session.expired':
                    $session = $event->data->object;
                    $this->handleExpiredPayment($session);
                    break;
               case 'checkout.session.async_payment_failed':
                   $session = $event->data->object;
                   $this->handleFailedPayment($session);
                   break;
                default:
                    Log::info('Unhandled Stripe event: ' . $event->type);
            }

            return response()->json(['status' => 'success']);
        } catch (\UnexpectedValueException $e) {
            Log::error('Invalid webhook payload: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Invalid signature: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            Log::error('Webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook error'], 500);
        }
    }

    private function handleSuccessfulPayment($session)
    {
        try {
            $orderNumber = $session->client_reference_id;
            $order = Order::where('order_number', $orderNumber)->first();

            if (!$order) {
                Log::error('Order not found for payment session', [
                    'session_id' => $session->id,
                    'order_number' => $orderNumber,
                ]);
                return;
            }

            // Begin transaction to ensure all operations are atomic
            DB::beginTransaction();
            
            try {
                // Update order payment status
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed', // Automatically confirm paid orders
                    'payment_reference' => $session->id,
                ]);
                
                // Now that payment is confirmed, we can safely reduce inventory
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    if ($product && $product->track_inventory) {
                        $product->decrement('inventory', $item->quantity);
                    }
                }
                
                // If there's a coupon code used, mark it as used now
                if (!empty($order->coupon_code)) {
                    $coupon = \App\Models\Coupon::where('code', $order->coupon_code)->first();
                    if ($coupon) {
                        $coupon->incrementUsage();
                    }
                }
                
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Failed to process successful payment: ' . $e->getMessage(), [
                    'order_id' => $order->id,
                    'session_id' => $session->id,
                    'error' => $e->getMessage(),
                ]);
            }

            Log::info('Payment successful for order', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'session_id' => $session->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling successful payment: ' . $e->getMessage(), [
                'session_id' => $session->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function handleExpiredPayment($session)
    {
        try {
            $orderNumber = $session->client_reference_id;
            $order = Order::where('order_number', $orderNumber)->first();

            if (!$order) {
                Log::error('Order not found for expired payment session', [
                    'session_id' => $session->id,
                    'order_number' => $orderNumber,
                ]);
                return;
            }

            // Update order payment status
            $order->update([
                'payment_status' => 'failed',
               'status' => 'cancelled',
            ]);

            Log::info('Payment session expired for order', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'session_id' => $session->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling expired payment: ' . $e->getMessage(), [
                'session_id' => $session->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    private function handleFailedPayment($session)
    {
        try {
            $orderNumber = $session->client_reference_id;
            $order = Order::where('order_number', $orderNumber)->first();

            if (!$order) {
                Log::error('Order not found for failed payment session', [
                    'session_id' => $session->id,
                    'order_number' => $orderNumber,
                ]);
                return;
            }

            // Update order payment status
            $order->update([
                'payment_status' => 'failed',
                'status' => 'cancelled',
            ]);

            Log::info('Payment failed for order', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'session_id' => $session->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling failed payment: ' . $e->getMessage(), [
                'session_id' => $session->id ?? null,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function verifyPayment(Request $request)
    {
        try {
            $request->validate([
                'session_id' => 'required|string',
            ]);

            // Set Stripe API key
            Stripe::setApiKey(env('STRIPE_SECRET'));

            // Retrieve the session
            $session = StripeSession::retrieve($request->session_id);

            if (!$session) {
                return handleErrorResponse(0, __('message.session_not_found'));
            }

            $orderNumber = $session->client_reference_id;
            $order = Order::where('order_number', $orderNumber)->first();

            if (!$order) {
                return handleErrorResponse(0, __('message.order_not_found'));
            }

            // Check payment status
            if ($session->payment_status === 'paid') {
                // Update order if not already marked as paid
                if ($order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'confirmed',
                    ]);
                }

                return handleSuccessReponse(1, __('message.payment_success'), [
                    'order' => $order->fresh(),
                    'payment_status' => 'paid',
                ]);
            } elseif ($session->payment_status === 'unpaid') {
                return handleSuccessReponse(1, __('message.payment_processing'), [
                    'order' => $order,
                    'payment_status' => 'processing',
                ]);
            } else {
                return handleSuccessReponse(1, __('message.payment_failed'), [
                    'order' => $order,
                    'payment_status' => 'failed',
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Payment verification error: ' . $e->getMessage(), [
                'session_id' => $request->session_id ?? null,
                'error' => $e->getMessage(),
            ]);
            return handleErrorResponse(0, __('message.payment_verification_failed'));
        }
    }
}