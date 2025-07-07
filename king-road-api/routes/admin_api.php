<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminCouponController;
use App\Http\Controllers\Api\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminUserController;

// Admin routes
Route::prefix('v1/admin')->group(function () {
    // Admin authentication
    Route::prefix('auth')->group(function () {
        Route::post('login', [AdminAuthController::class, 'login']);
        Route::post('refresh', [AdminAuthController::class, 'refresh']);
    });

    // Protected admin routes
    Route::middleware(['auth:admin'])->group(function () {
        // Admin profile
        Route::get('profile', [AdminAuthController::class, 'profile']);
        Route::post('logout', [AdminAuthController::class, 'logout']);

        // Dashboard
        Route::prefix('dashboard')->group(function () {
            Route::get('stats', [AdminDashboardController::class, 'stats']);
            Route::get('recent-orders', [AdminDashboardController::class, 'recentOrders']);
            Route::get('top-products', [AdminDashboardController::class, 'topProducts']);
            Route::get('low-stock', [AdminDashboardController::class, 'lowStock']);
        });

        // Products management
        Route::prefix('products')->group(function () {
            Route::get('/', [AdminProductController::class, 'index']);
            Route::post('/', [AdminProductController::class, 'store']);
            Route::get('/{product}', [AdminProductController::class, 'show']);
            Route::put('/{product}', [AdminProductController::class, 'update']);
            Route::delete('/{product}', [AdminProductController::class, 'destroy']);
            Route::post('/bulk-update', [AdminProductController::class, 'bulkUpdate']);
            Route::post('/bulk-delete', [AdminProductController::class, 'bulkDelete']);
            Route::post('/import', [AdminProductController::class, 'import']);
            Route::get('/export', [AdminProductController::class, 'export']);
        });

        // Categories management
        Route::prefix('categories')->group(function () {
            // Route::get('/', [AdminCategoryController::class, 'index']);
            // Route::post('/', [AdminCategoryController::class, 'store']);
            // Route::get('/{category}', [AdminCategoryController::class, 'show']);
            // Route::put('/{category}', [AdminCategoryController::class, 'update']);
            // Route::delete('/{category}', [AdminCategoryController::class, 'destroy']);
            // Route::post('/{category}/reorder', [AdminCategoryController::class, 'reorder']);
        });

        // Orders management
        Route::prefix('orders')->group(function () {
            // Route::get('/', [AdminOrderController::class, 'index']);
            // Route::get('/{order}', [AdminOrderController::class, 'show']);
            // Route::put('/{order}', [AdminOrderController::class, 'update']);
            // Route::post('/{order}/update-status', [AdminOrderController::class, 'updateStatus']);
            // Route::post('/{order}/add-tracking', [AdminOrderController::class, 'addTracking']);
            // Route::post('/{order}/send-notification', [AdminOrderController::class, 'sendNotification']);
            // Route::get('/{order}/invoice', [AdminOrderController::class, 'generateInvoice']);
            // Route::get('/export', [AdminOrderController::class, 'export']);
        });

        // Customers management
        Route::prefix('customers')->group(function () {
            // Route::get('/', [AdminCustomerController::class, 'index']);
            // Route::get('/{user}', [AdminCustomerController::class, 'show']);
            // Route::put('/{user}', [AdminCustomerController::class, 'update']);
            // Route::delete('/{user}', [AdminCustomerController::class, 'destroy']);
            // Route::get('/{user}/orders', [AdminCustomerController::class, 'orders']);
            // Route::get('/{user}/reviews', [AdminCustomerController::class, 'reviews']);
            // Route::post('/{user}/send-email', [AdminCustomerController::class, 'sendEmail']);
            // Route::get('/export', [AdminCustomerController::class, 'export']);
        });

        // Reviews management
        Route::prefix('reviews')->group(function () {
            // Route::get('/', [AdminReviewController::class, 'index']);
            // Route::get('/{review}', [AdminReviewController::class, 'show']);
            // Route::post('/{review}/approve', [AdminReviewController::class, 'approve']);
            // Route::post('/{review}/reject', [AdminReviewController::class, 'reject']);
            // Route::delete('/{review}', [AdminReviewController::class, 'destroy']);
            // Route::post('/bulk-approve', [AdminReviewController::class, 'bulkApprove']);
            // Route::post('/bulk-reject', [AdminReviewController::class, 'bulkReject']);
        });

        // Coupons management
        Route::prefix('coupons')->group(function () {
            // Route::get('/', [AdminCouponController::class, 'index']);
            // Route::post('/', [AdminCouponController::class, 'store']);
            // Route::get('/{coupon}', [AdminCouponController::class, 'show']);
            // Route::put('/{coupon}', [AdminCouponController::class, 'update']);
            // Route::delete('/{coupon}', [AdminCouponController::class, 'destroy']);
            // Route::get('/{coupon}/usage', [AdminCouponController::class, 'usage']);
        });

        // Analytics
        Route::prefix('analytics')->group(function () {
            // Route::get('sales', [AdminAnalyticsController::class, 'sales']);
            // Route::get('products', [AdminAnalyticsController::class, 'products']);
            // Route::get('customers', [AdminAnalyticsController::class, 'customers']);
            // Route::get('orders', [AdminAnalyticsController::class, 'orders']);
            // Route::get('revenue', [AdminAnalyticsController::class, 'revenue']);
            // Route::get('inventory', [AdminAnalyticsController::class, 'inventory']);
        });

        // Settings
        Route::prefix('settings')->group(function () {
            // Route::get('/', [AdminSettingController::class, 'index']);
            // Route::put('/', [AdminSettingController::class, 'update']);
            // Route::get('/groups/{group}', [AdminSettingController::class, 'group']);
        });

        // Admin users management (Super Admin only)
        Route::prefix('users')->middleware(['admin.permission:super_admin'])->group(function () {
            // Route::get('/', [AdminUserController::class, 'index']);
            // Route::post('/', [AdminUserController::class, 'store']);
            // Route::get('/{admin}', [AdminUserController::class, 'show']);
            // Route::put('/{admin}', [AdminUserController::class, 'update']);
            // Route::delete('/{admin}', [AdminUserController::class, 'destroy']);
            // Route::post('/{admin}/toggle-status', [AdminUserController::class, 'toggleStatus']);
        });
    });
});