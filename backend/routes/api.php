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
use App\Http\Controllers\API\CartController; 

// Rutes públiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Categories i Productes (públics)
Route::get('/categorias', [CategoryController::class, 'index']);
Route::get('/categorias/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/products/reviews/{id}', [ReviewController::class, 'getProductReviews']);
Route::get('/products/ratings/{id}', [ReviewController::class, 'getProductRatings']);
Route::get('/reviews', [ReviewController::class, 'getAllReviews']); 
Route::get('/ratings', [ReviewController::class, 'getAllRatings']); 

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
    Route::get('/user/metodopago', [UserController::class, 'paymentMethods']);
    Route::post('/user/metodopago', [PaymentMethodController::class, 'store']);
    Route::put('/user/metodopago/{id}', [PaymentMethodController::class, 'update']);
    Route::delete('/user/metodopago/{id}', [PaymentMethodController::class, 'destroy']);
    
    // Add the missing route for payment-methods
    Route::get('/payment-methods', [PaymentMethodController::class, 'index']);
    
    // Comandes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/orders', [OrderController::class, 'index']);
    
    // Rutes d'administració
    Route::post('/categorias', [CategoryController::class, 'store']);
    Route::put('/categorias/{id}', [CategoryController::class, 'update']);
    Route::delete('/categorias/{id}', [CategoryController::class, 'destroy']);
    
    // Rutas protegidas para vendedores
    Route::middleware(['auth:sanctum', 'check.seller'])->group(function () {
    // Productos
    Route::post('/productos', [ProductController::class, 'store']);
    Route::put('/productos/{id}', [ProductController::class, 'update']);
    Route::delete('/productos/{id}', [ProductController::class, 'destroy']);
    Route::get('/seller/productos', [ProductController::class, 'sellerProducts']);
    });
    Route::get('/productos', [ProductController::class, 'index']);
    
    // Protected review/rating actions
    Route::post('/reviews', [ReviewController::class, 'storeReview']);
    Route::post('/ratings', [ReviewController::class, 'storeRating']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/register-admin', function (Request $request) {
        // Mirem si és admin
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
    // Rutas del carrito
    Route::get('/cart', [CartController::class, 'getCart']);
    Route::get('/cart/{id}', [CartController::class, 'getCartById']);
    Route::post('/cart/add', [CartController::class, 'addToCart']);
    Route::put('/cart/item/{id}', [CartController::class, 'updateCartItem']);
    Route::delete('/cart/item/{id}', [CartController::class, 'removeFromCart']);
    Route::delete('/cart/clear', [CartController::class, 'clearCart']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);
    // Ruta per finalitzar el carret
    Route::put('/cart/finish', [CartController::class, 'finishCart']);
    
    // Ruta per actualitzar l'adreça d'enviament
    Route::put('/user/shipping-address', [UserController::class, 'updateShippingAddress']);
});

