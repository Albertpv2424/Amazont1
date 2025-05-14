<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Mostrar listado de categorías.

    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'status' => 'éxito',
            'categorias' => $categories
        ]);
    }

    // Almacenar una nueva categoría.

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errores' => $validator->errors()
            ], 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'status' => 'éxito',
            'mensaje' => 'Categoría creada correctamente',
            'categoria' => $category
        ], 201);
    }

    // Mostrar una categoría específica.

    public function show($id)
    {
        $category = Category::with('productos')->findOrFail($id);
        return response()->json([
            'status' => 'éxito',
            'categoria' => $category
        ]);
    }
}