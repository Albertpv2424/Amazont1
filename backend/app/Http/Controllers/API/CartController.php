<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart; 
use App\Models\CartItem; 
use App\Models\Product; 
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\Validator; 
use Illuminate\Support\Facades\DB; // Add this line

class CartController extends Controller
{
    /**
     * Obtener el carrito del usuario autenticado.
     */
    public function getCart()
    {
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::with('cartItems.product') // Cargar el carrito con sus ítems y productos
            ->where('user_id', $user->id) // Buscar el carrito del usuario
            ->first();
            
        if (!$cart) { // Si no existe el carrito, crearlo
            $cart = Cart::create([
                'user_id' => $user->id, // Asociar el carrito al usuario
                'total' => 0 // Inicializar el total en 0
            ]);
        }
            
        return response()->json([ // Devolver el carrito en la respuesta
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    
    /**
     * Obtener un carrito específico por ID.
     */
    public function getCartById($id)
    {
        $user = Auth::user(); // Obtener el usuario autenticado
        
        // Si el usuario es administrador, puede ver cualquier carrito
        if ($user->rol === 'admin') {
            $cart = Cart::with('cartItems.product')
                ->findOrFail($id);
        } else {
            // Si no es admin, solo puede ver sus propios carritos
            $cart = Cart::with('cartItems.product')
                ->where('user_id', $user->id)
                ->where('id', $id)
                ->firstOrFail();
        }
        
        return response()->json([
            'status' => 'success',
            'cart' => $cart
        ]);
    }
    
    /**
     * Agregar un producto al carrito.
     */
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id_prod',
            'cantidad' => 'required|integer|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = Auth::user();
        $product = Product::findOrFail($request->producto_id);
    
        // Utilitza els noms correctes segons la base de dades
        $price = ($product->en_oferta && $product->precio_oferta !== null) ? $product->precio_oferta : $product->precio;
    
        if ($price === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'El preu del producte no està definit'
            ], 400);
        }
    
        if ($product->stock < $request->cantidad) {
            return response()->json([
                'status' => 'error',
                'message' => 'No hi ha prou estoc disponible'
            ], 400);
        }
    
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'total' => 0
            ]);
        }
    
        $cartItem = CartItem::where('carrito_id', $cart->id)
            ->where('producto_id', $request->producto_id)
            ->first();
    
        if ($cartItem) {
            // Si el producte ja està al carret, actualitza la quantitat
            $cartItem->update([
                'cantidad' => $cartItem->cantidad + $request->cantidad,
                'precio' => $price
            ]);
        } else {
            // Si no hi és, afegeix-lo com a nou ítem
            $cartItem = CartItem::create([
                'carrito_id' => $cart->id,
                'producto_id' => $request->producto_id,
                'cantidad' => $request->cantidad,
                'precio' => $price
            ]);
        }
    
        // Actualitza el total del carret
        $this->updateCartTotal($cart);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Producte afegit al carret',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Actualizar la cantidad de un producto en el carrito.
     */
    public function updateCartItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id_prod',
            'cantidad' => 'required|integer|min:1', // Ensure cantidad is required and is a valid integer
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::where('user_id', $user->id)->firstOrFail(); // Buscar el carrito del usuario
        $cartItem = CartItem::where('carrito_id', $cart->id) // Buscar el ítem en el carrito
            ->where('producto_id', $request->producto_id) // Correct column name
            ->firstOrFail();
            
        // Comprobar si hay suficiente stock
        $product = DB::table('productos')->where('id_prod', $request->producto_id)->first();
        if ($product->stock < $request->cantidad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not enough stock available'
            ], 400);
        }
        
        $cartItem->update([ // Actualizar la cantidad del ítem
            'cantidad' => $request->cantidad // Ensure cantidad is set correctly
        ]);
        
        // Actualizar el total del carrito
        $this->updateCartTotal($cart);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Cart item updated successfully',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Eliminar un producto del carrito.
     */
    public function removeFromCart($id)
    {
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::where('user_id', $user->id)->firstOrFail(); // Buscar el carrito del usuario
        $cartItem = CartItem::where('carrito_id', $cart->id) // Buscar el ítem en el carrito
            ->where('id', $id)
            ->firstOrFail();
            
        $cartItem->delete(); // Eliminar el ítem del carrito
        
        // Actualizar el total del carrito
        $this->updateCartTotal($cart);
        
        return response()->json([ // Devolver el carrito actualizado
            'status' => 'success',
            'message' => 'Product removed from cart',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
    
    /**
     * Vaciar el carrito.
     */
    public function clearCart()
    {
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::where('user_id', $user->id)->first(); // Buscar el carrito del usuario
        
        if ($cart) {
            CartItem::where('carrito_id', $cart->id)->delete(); // Eliminar todos los ítems del carrito
            $cart->update(['total' => 0]); // Reiniciar el total del carrito
        }
        
        return response()->json([ // Devolver el carrito vacío
            'status' => 'success',
            'message' => 'Cart cleared',
            'cart' => $cart
        ]);
    }
    
    /**
     * Convertir el carrito en una orden.
     */
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [ // Validar el método de pago
            'metodo_pago_id' => 'nullable|exists:metodos_pago,id',
        ]);
        
        if ($validator->fails()) { // Si la validación falla, devolver errores
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::with('cartItems.product') // Cargar el carrito con sus ítems y productos
            ->where('user_id', $user->id)
            ->first();
            
        if (!$cart || $cart->cartItems->isEmpty()) { // Si el carrito está vacío, devolver error
            return response()->json([
                'status' => 'error',
                'message' => 'Cart is empty'
            ], 400);
        }
        
        // Obtener el método de pago o usar el predeterminado
        $paymentMethodId = $request->payment_method_id;
        if (!$paymentMethodId) {
            $defaultPaymentMethod = $user->paymentMethods()
                ->where('is_default', true)
                ->first();
            
            if ($defaultPaymentMethod) {
                $paymentMethodId = $defaultPaymentMethod->id;
            }
        }
        
        try {
            // Iniciar una transacción
            \DB::beginTransaction();
            
            // Crear la orden
            $order = \App\Models\Order::create([
                'user_id' => $user->id,
                'total' => $cart->total,
                'metodo_pago_id' => $paymentMethodId,
            ]);
            
            // Crear los ítems de la orden
            foreach ($cart->cartItems as $cartItem) {
                \App\Models\OrderItem::create([
                    'pedido_id' => $order->id,
                    'producto_id' => $cartItem->producto_id,
                    'cantidad' => $cartItem->cantidad,
                    'precio' => $cartItem->precio,
                ]);
                
                // Actualizar el stock del producto
                $product = $cartItem->product;
                $product->update([
                    'stock' => $product->stock - $cartItem->cantidad,
                ]);
            }
            
            // Vaciar el carrito
            CartItem::where('carrito_id', $cart->id)->delete();
            $cart->update(['total' => 0]);
            $cart->estado = 'finalizado';
            $cart->save();
            
            \DB::commit(); // Confirmar la transacción
            
            return response()->json([ // Devolver la orden creada
                'status' => 'success',
                'message' => 'Order created successfully',
                'order' => $order->load('orderItems.product'),
            ], 201);
        } catch (\Exception $e) {
            \DB::rollBack(); // Revertir la transacción en caso de error
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Actualizar el total del carrito.
     */
    private function updateCartTotal(Cart $cart)
    {
        $total = 0; // Inicializar el total
        foreach ($cart->cartItems as $item) { // Recorrer los ítems del carrito
            $total += $item->precio * $item->cantidad; // Sumar el precio por la cantidad
        }
        
        $cart->update(['total' => $total]); // Actualizar el total en el carrito
    }
    
    /**
     * Finalitzar un carret de compra.
     */
    public function finishCart(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->where('estado', 'actiu')->first();
    
        if (!$cart) {
            return response()->json(['status' => 'error', 'message' => 'No active cart found.'], 404);
        }
    
        $cartItems = $cart->cartItems;
        if ($cartItems->isEmpty()) {
            return response()->json(['status' => 'error', 'message' => 'Cart is empty.'], 400);
        }
    
        $request->validate([
            'metodo_pago_id' => 'required|exists:metodos_pago,id'
        ]);
    
        // Check that the payment method belongs to the user
        $paymentMethod = $user->paymentMethods()->where('id', $request->metodo_pago_id)->first();
        if (!$paymentMethod) {
            return response()->json(['status' => 'error', 'message' => 'Invalid payment method.'], 403);
        }
    
        // Create the order
        $order = \App\Models\Order::create([
            'user_id' => $user->id,
            'estado' => 'pendent',
            'total' => $cart->total,
            'metodo_pago_id' => $request->metodo_pago_id
        ]);
    
        // Create order items
        foreach ($cartItems as $item) {
            \App\Models\OrderItem::create([
                'pedido_id' => $order->id,
                'producto_id' => $item->producto_id,
                'cantidad' => $item->cantidad,
                'precio' => $item->precio
            ]);
            // Optionally update product stock here
             $item->product->decrement('stock', $item->cantidad);
        }
    
        // Mark cart as finished or clear it
        $cart->estado = 'finalitzat';
        $cart->save();
        $cart->cartItems()->delete();
    
        return response()->json([
            'status' => 'success',
            'message' => 'Order created successfully.',
            'order' => $order
        ]);
    }
    
    public function getCartState(Request $request)
    {
        $user = Auth::user(); // Obtener el usuario autenticado
        $cart = Cart::where('user_id', $user->id)->first();
    
        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'No cart found for the user'
            ], 404);
        }
    
        return response()->json([
            'status' => 'success',
            'cart' => $cart->load('cartItems.product')
        ]);
    }
}