<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    //Registrar un nou usuari.

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'contraseña' => 'required|string|min:8|confirmed',
            'dirección' => 'nullable|string',
            'telefono' => 'nullable|string',
            'ciudad' => 'nullable|string',
            'codigo_postal' => 'nullable|string',
            'pais' => 'nullable|string',
            'rol' => 'nullable|string|in:admin,customer', // Add validation for role
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'contraseña' => Hash::make($request->contraseña),
            'dirección' => $request->dirección,
            'telefono' => $request->telefono,
            'ciudad' => $request->ciudad,
            'codigo_postal' => $request->codigo_postal,
            'pais' => $request->pais,
            'rol' => $request->rol ?? 'customer', // Set default role to customer if not provided
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    //* Iniciar sessió i crear token d'accés.

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'contraseña' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Array dels credencials per autenticar l'usuari.
        $credentials = [
            'email' => $request->email,
            'password' => $request->contraseña
        ];

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User logged in successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    // Tancar sessió.
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User logged out successfully'
        ]);
    }
}