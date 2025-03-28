<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // Mostrar llistat de categories.

    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'status' => 'success',
            'categorias' => $categories
        ]);
    }

    // Emmagatzemar una nova categoria.

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'categoria' => $category
        ], 201);
    }

    // Mostrar una categoria específica.

    public function show($id)
    {
        $category = Category::with('products')->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'categoria' => $category
        ]);
    }
}