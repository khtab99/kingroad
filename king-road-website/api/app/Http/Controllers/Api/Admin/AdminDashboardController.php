<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::where('status', 'delivered')->sum('total');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = User::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $lowStockProducts = Product::lowStock()->count();
        $outOfStockProducts = Product::outOfStock()->count();

        // Monthly growth calculations
        $currentMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $currentMonthRevenue = Order::where('status', 'delivered')
            ->where('created_at', '>=', $currentMonth)
            ->sum('total');
        
        $lastMonthRevenue = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$lastMonth, $currentMonth])
            ->sum('total');

        $revenueGrowth = $lastMonthRevenue > 0 
            ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        $currentMonthOrders = Order::where('created_at', '>=', $currentMonth)->count();
        $lastMonthOrders = Order::whereBetween('created_at', [$lastMonth, $currentMonth])->count();
        
        $ordersGrowth = $lastMonthOrders > 0 
            ? (($currentMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100 
            : 0;

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'pending_orders' => $pendingOrders,
                'low_stock_products' => $lowStockProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'revenue_growth' => round($revenueGrowth, 2),
                'orders_growth' => round($ordersGrowth, 2),
            ],
        ]);
    }

    public function recentOrders()
    {
        $orders = Order::with(['items.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return OrderResource::collection($orders);
    }

    public function topProducts()
    {
        $products = Product::with(['category'])
            ->withCount(['orderItems as total_sold' => function ($query) {
                $query->selectRaw('sum(quantity)');
            }])
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();

        return ProductResource::collection($products);
    }

    public function lowStock()
    {
        $products = Product::with(['category'])
            ->lowStock()
            ->orderBy('inventory', 'asc')
            ->limit(20)
            ->get();

        return ProductResource::collection($products);
    }
}