<?php

use App\Http\Controllers\Api\Admin\DeliveryFeeController;
use App\Http\Controllers\Api\SliderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;




Route::prefix('v1')->group(function () {
    // Authentication
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    // Public product routes
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/{product}', [ProductController::class, 'show']);
        Route::post('/{product}/increment-views', [ProductController::class, 'incrementViews']);
    });

    // Categories
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{category}', [CategoryController::class, 'show']);
        Route::get('/{category}/products', [CategoryController::class, 'products']);
    });

 

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/add', [CartController::class, 'add']);
        Route::put('/update/{id}', [CartController::class, 'update']);
        Route::delete('/remove/{id}', [CartController::class, 'remove']);
        Route::get('/count', [CartController::class, 'count']);
        Route::get('/total', [CartController::class, 'total']);
        Route::post('/clear', [CartController::class, 'clear']);
        Route::get('/validate', [CartController::class, 'check']);
    });

    // Order routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::post('/lookup', [OrderController::class, 'lookup']);
        Route::get('/{order}', [OrderController::class, 'show']);
        Route::post('/{order}/cancel', [OrderController::class, 'cancel']);
    });
    
    // Payment routes
    Route::prefix('payment')->group(function () {
        Route::post('/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);
        Route::post('/verify', [PaymentController::class, 'verifyPayment']);
    });
   // Payment webhook
    Route::post('/webhook/stripe', [PaymentController::class, 'handleWebhook']);

    //slider

    Route::prefix('sliders')->group(function () {
   Route::get('/', [SliderController::class, 'index']);
    });

    Route::prefix('delivery_fees')->group(function () {
              Route::get('/', [DeliveryFeeController::class, 'index']);
    });

});


// Protected user routes
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // User profile
    Route::prefix('user')->group(function () {
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::delete('account', [AuthController::class, 'deleteAccount']);
    });
// Orders

});