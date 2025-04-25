<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\PaymentMethodController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\CartController; // Add this line

// Rutes públiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories i Productes (públics)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/products/{id}/reviews', [ReviewController::class, 'getProductReviews']);
Route::get('/products/{id}/ratings', [ReviewController::class, 'getProductRatings']);

// Rutes protegides (requereixen autenticació)
Route::middleware('auth:sanctum')->group(function () {
    // Autenticació
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Perfil d'usuari
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    
    // Historial de comandes
    Route::get('/user/orders', [UserController::class, 'orderHistory']);
    
    // Mètodes de pagament
    Route::get('/user/payment-methods', [UserController::class, 'paymentMethods']);
    Route::post('/user/payment-methods', [PaymentMethodController::class, 'store']);
    Route::put('/user/payment-methods/{id}', [PaymentMethodController::class, 'update']);
    Route::delete('/user/payment-methods/{id}', [PaymentMethodController::class, 'destroy']);
    
    // Comandes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders', [OrderController::class, 'index']);
    
    // Rutes d'administració
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    
    // Protected review/rating actions
    Route::post('/reviews', [ReviewController::class, 'storeReview']);
    Route::post('/ratings', [ReviewController::class, 'storeRating']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/register-admin', function (Request $request) {
        // Check if the current user is an admin
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Only admins can register new admins.'
            ], 403);
        }
        
        $request->merge(['rol' => 'admin']);
        return app(AuthController::class)->register($request);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/item/{id}', [CartController::class, 'updateCartItem']);
    Route::delete('/cart/item/{id}', [CartController::class, 'removeFromCart']);
    Route::delete('/cart/clear', [CartController::class, 'clearCart']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);
});
