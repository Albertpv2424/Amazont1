<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Obtenir la informació del perfil de l'usuari autenticat.
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $user = Auth::user();
        return response()->json([
            'status' => 'success',
            'user' => $user
        ]);
    }

    /**
     * Actualitzar la informació del perfil de l'usuari.
     * Només es poden modificar la contrasenya i l'adreça.
     */
    public function update(Request $request)
    {
        // Validació de les dades d'entrada
        $validator = Validator::make($request->all(), [
            'email' => 'required_with:contraseña,contrasena|string|email|unique:users,email,' . Auth::id(),
            'direccion' => 'nullable|string|max:255',
            'current_password' => 'required_with:contraseña,contrasena|string',
            'contraseña' => 'nullable|string|min:8|confirmed',
            'contrasena' => 'nullable|string|min:8|confirmed',
            'contraseña_confirmation' => 'nullable|string|min:8',
            'contrasena_confirmation' => 'nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $data = [];

        // Actualitzar email si s'ha proporcionat
        if ($request->has('email')) {
            $data['email'] = $request->email;
        }



        // Actualitzar contrasenya si s'ha proporcionat
        if ($request->has('contraseña') || $request->has('contrasena')) {
            $password = $request->contraseña ?? $request->contrasena;
            
            try {
                // Intenta verificar amb Bcrypt
                if (!Hash::check($request->current_password, $user->contraseña)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'La contrasenya actual és incorrecta'
                    ], 422);
                }
            } catch (\RuntimeException $e) {
                // Si no és Bcrypt, compara directament
                if ($request->current_password !== $user->contraseña) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'La contrasenya actual és incorrecta'
                    ], 422);
                }
            }
            
            // Encriptar la nova contrasenya
            $data['contraseña'] = Hash::make($password);
            $passwordChanged = true;
        } else {
            $passwordChanged = false;
        }

        // Verificar si hi ha dades per actualitzar
        if (empty($data)) {
            return response()->json([
                'status' => 'error',
                'message' => 'No s\'han proporcionat dades per actualitzar'
            ], 422);
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Informació d\'usuari actualitzada correctament',
            'user' => $user,
            'password_updated' => $passwordChanged
        ]);
    }

    // Obtenir l'historial de comandes de l'usuari.
    
    public function orderHistory()
    {
        $user = Auth::user();
        $orders = $user->orders()->with('orderItems.product')->get();

        return response()->json([
            'status' => 'success',
            'orders' => $orders
        ]);
    }

    // Obtenir els mètodes de pagament de l'usuari.
    public function paymentMethods()
    {
        $user = Auth::user();
        $paymentMethods = $user->paymentMethods;

        return response()->json([
            'status' => 'success',
            'payment_methods' => $paymentMethods
        ]);
    }

    /**
     * Actualitzar l'adreça d'enviament de l'usuari.
     */
    public function updateShippingAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|string',
            'ciudad' => 'required|string',
            'codigo_postal' => 'required|string',
            'provincia' => 'required|string',
            'pais' => 'required|string',
            'telefono' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $user->update([
            'shipping_address' => $request->shipping_address,
            'ciudad' => $request->ciudad,
            'codigo_postal' => $request->codigo_postal,
            'provincia' => $request->provincia,
            'pais' => $request->pais,
            'telefono' => $request->telefono,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Adreça d\'enviament actualitzada correctament',
            'user' => $user
        ]);
    }
}