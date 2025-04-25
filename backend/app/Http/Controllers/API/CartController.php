<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Obtenir el carrito de l'usuari autenticat.
     */
    public function getCart()
    {
        $user = Auth::user();
        $cart = Cart::with('cartItems.product')
            ->where('user_id', $user->id)
            ->first();
            
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'total' => 0
            ]);
        }
            
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    
    /**
     * Afegir un producte al carrito.
     */
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:productos,id_prod',
            'quantity' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user();
        $product = Product::findOrFail($request->product_id);
        
        // Comprovar si hi ha suficient estoc
        if ($product->stock < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not enough stock available'
            ], 400);
        }
        
        // Obtenir o crear el carrito
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'total' => 0
            ]);
        }
        
        // Comprovar si el producte ja està al carrito
        $cartItem = CartItem::where('carrito_id', $cart->id)
            ->where('producto_id', $request->product_id)
            ->first();
            
        $price = $product->rebajas ? $product->precio_rebajado : $product->precio;
        
        if ($cartItem) {
            // Actualitzar la quantitat
            $cartItem->update([
                'cantidad' => $cartItem->cantidad + $request->quantity,
                'precio' => $price
            ]);
        } else {
            // Crear un nou element al carrito
            $cartItem = CartItem::create([
                'carrito_id' => $cart->id,
                'producto_id' => $request->product_id,
                'cantidad' => $request->quantity,
                'precio' => $price
            ]);
        }
        
        // Actualitzar el total del carrito
        $this->updateCartTotal($cart);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product added to cart',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Actualitzar la quantitat d'un producte al carrito.
     */
    public function updateCartItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $cartItem = CartItem::where('carrito_id', $cart->id)
            ->where('id', $id)
            ->firstOrFail();
            
        $product = Product::findOrFail($cartItem->producto_id);
        
        // Comprovar si hi ha suficient estoc
        if ($product->stock < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not enough stock available'
            ], 400);
        }
        
        $cartItem->update([
            'cantidad' => $request->quantity
        ]);
        
        // Actualitzar el total del carrito
        $this->updateCartTotal($cart);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Cart item updated',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Eliminar un producte del carrito.
     */
    public function removeFromCart($id)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->firstOrFail();
        $cartItem = CartItem::where('carrito_id', $cart->id)
            ->where('id', $id)
            ->firstOrFail();
            
        $cartItem->delete();
        
        // Actualitzar el total del carrito
        $this->updateCartTotal($cart);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product removed from cart',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Buidar el carrito.
     */
    public function clearCart()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            CartItem::where('carrito_id', $cart->id)->delete();
            $cart->update(['total' => 0]);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Cart cleared',
            'cart' => $cart
        ]);
    }
    
    /**
     * Convertir el carrito en una comanda.
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method_id' => 'nullable|exists:metodo_pago,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user();
        $cart = Cart::with('cartItems.product')
            ->where('user_id', $user->id)
            ->first();
            
        if (!$cart || $cart->cartItems->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart is empty'
            ], 400);
        }
        
        // Get payment method ID from request or use default if not provided
        $paymentMethodId = $request->payment_method_id;
        
        // If no payment method provided, get user's default payment method
        if (!$paymentMethodId) {
            $defaultPaymentMethod = $user->paymentMethods()
                ->where('is_default', true)
                ->first();
            
            if ($defaultPaymentMethod) {
                $paymentMethodId = $defaultPaymentMethod->id;
            }
        }
        
        try {
            // Start transaction
            \DB::beginTransaction();
            
            // Create order
            $order = \App\Models\Order::create([
                'user_id' => $user->id,
                'total' => $cart->total,
                'metodo_pago_id' => $paymentMethodId,
            ]);
            
            // Create order items
            foreach ($cart->cartItems as $cartItem) {
                \App\Models\OrderItem::create([
                    'pedido_id' => $order->id,
                    'producto_id' => $cartItem->producto_id,
                    'cantidad' => $cartItem->cantidad,
                    'precio' => $cartItem->precio,
                ]);
                
                // Update product stock
                $product = $cartItem->product;
                $product->update([
                    'stock' => $product->stock - $cartItem->cantidad,
                ]);
            }
            
            // Clear cart
            CartItem::where('carrito_id', $cart->id)->delete();
            $cart->update(['total' => 0]);
            
            \DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Order created successfully',
                'order' => $order->load('orderItems.product'),
            ], 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Actualitzar el total del carrito.
     */
    private function updateCartTotal(Cart $cart)
    {
        $total = 0;
        foreach ($cart->cartItems as $item) {
            $total += $item->precio * $item->cantidad;
        }
        
        $cart->update(['total' => $total]);
    }
}