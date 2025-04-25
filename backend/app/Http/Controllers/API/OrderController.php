<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /* 
       Veure totes les comandes de l'usuari autenticat. 
    */
    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('orderItems.product')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'orders' => $orders
        ]);
    }

    // Crear una nova comanda.

    public function store(Request $request)
    {
        // Validem les dades d'entrada
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:productos,id_prod',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method_id' => 'nullable|exists:metodo_pago,id',  // Changed from metodos_pago to metodo_pago
        ]);
    
        // Si la validació falla, retornem errors
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }
    
        // Obtenim l'usuari autenticat
        $user = Auth::user();
        
        // Add logging to debug
        \Log::info('Payment method ID received: ' . $request->payment_method_id);
        
        // Calculem el total de la comanda
        $total = 0;
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            // Utilitzem el preu de rebaixa si està en oferta
            $price = $product->rebajas ? $product->precio_rebajado : $product->precio;
            $total += $price * $item['quantity'];
        }
    
        try {
            // Start transaction
            DB::beginTransaction();
            
            // Get payment method ID from request or use default if not provided
            $paymentMethodId = $request->payment_method_id;
            
            // If no payment method provided, get user's default payment method
            if (!$paymentMethodId) {
                $defaultPaymentMethod = $user->paymentMethods()
                    ->where('is_default', true)
                    ->first();
                
                if ($defaultPaymentMethod) {
                    $paymentMethodId = $defaultPaymentMethod->id;
                    \Log::info('Using default payment method: ' . $paymentMethodId);
                } else {
                    \Log::info('No default payment method found for user');
                }
            }
            
            // Creem la comanda principal
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'metodo_pago_id' => $paymentMethodId,
            ]);
    
            // Per cada producte a la comanda
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                // Tornem a calcular el preu per si hi ha discrepàncies
                $price = $product->rebajas ? $product->precio_rebajado : $product->precio;
                
                // Creem l'ítem de la comanda
                OrderItem::create([
                    'pedido_id' => $order->id,
                    'producto_id' => $item['product_id'],
                    'cantidad' => $item['quantity'],
                    'precio' => $price,
                ]);
                
                // Actualitzem l'estoc del producte
                $product->update([
                    'stock' => $product->stock - $item['quantity'],
                ]);
            }
            
            // Confirmem totes les operacions a la BD
            DB::commit();
            
            // Retornem resposta d'èxit amb la comanda completa
            return response()->json([
                'status' => 'success',
                'message' => 'Order created successfully',
                'order' => $order->load('orderItems.product'),
            ], 201);
        } catch (\Exception $e) {
            // En cas d'error, fem rollback i notifiquem
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mostrar una comanda específica.
     */
    public function show($id)
    {
        $user = Auth::user();
        $order = Order::with('orderItems.product')
            ->where('user_id', $user->id)
            ->findOrFail($id);
            
        return response()->json([
            'status' => 'success',
            'order' => $order
        ]);
    }
}