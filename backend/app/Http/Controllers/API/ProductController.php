<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Mostrar listado de productos.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Product::with('categorias');
        
        // Filtrar por categoría si se ha proporcionado
        if ($request->has('categoria_id')) {
            $categoriaId = $request->categoria_id;
            $query->whereHas('categorias', function($q) use ($categoriaId) {
                $q->where('categorias.id_cat', $categoriaId);
            });
        }
        
        // Filtrar por rango de precio si se ha proporcionado
        if ($request->has('precio_min')) {
            $query->where('precio', '>=', $request->precio_min);
        }
        
        if ($request->has('precio_max')) {
            $query->where('precio', '<=', $request->precio_max);
        }
        
        // Buscar por nombre si se ha proporcionado
        if ($request->has('buscar')) {
            $query->where('nombre', 'like', '%' . $request->buscar . '%')
                  ->orWhere('descricion', 'like', '%' . $request->buscar . '%');
        }
        
        // Ordenar productos
        $sortBy = $request->get('ordenar_por', 'created_at');
        $sortOrder = $request->get('orden', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginación de resultados
        $perPage = $request->get('por_pagina', 10);
        $products = $query->paginate($perPage);
        
        return response()->json([
            'status' => 'éxito',
            'productos' => $products
        ]);
    }

    // Mostrar un producto específico.
    public function show($id)
    {
        $producto = Product::with('category')->findOrFail($id);
        return response()->json([
            'status' => 'éxito',
            'producto' => $producto
        ]);
    }

    // Crear un nuevo producto.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descricion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'rebajas' => 'boolean',
            'precio_rebajado' => 'nullable|numeric|min:0',
            'categorias' => 'required|array|min:1',
            'categorias.*' => 'exists:categorias,id_cat',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errores' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $producto = Product::create($request->except('categorias'));
            $producto->categorias()->sync($request->categorias);

            DB::commit();
            return response()->json([
                'status' => 'éxito',
                'mensaje' => 'Produto criado corretamente',
                'producto' => $producto->load('categorias')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'mensaje' => 'Erro ao criar produto',
                'errores' => $e->getMessage()
            ], 500);
        }
    }

    // Actualizar un producto específico.
    public function update(Request $request, $id)
    {
        $producto = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:255',
            'descricion' => 'nullable|string',
            'precio' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'rebajas' => 'boolean',
            'precio_rebajado' => 'nullable|numeric|min:0',
            'categoria_id' => 'sometimes|required|exists:categorias,id_cat',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errores' => $validator->errors()
            ], 422);
        }

        $producto->update($request->all());

        return response()->json([
            'status' => 'éxito',
            'mensaje' => 'Producto actualizado correctamente',
            'producto' => $producto
        ]);
    }

    // Eliminar un producto específico.
    public function destroy($id)
    {
        $producto = Product::findOrFail($id);
        $producto->delete();

        return response()->json([
            'status' => 'éxito',
            'mensaje' => 'Producto eliminado correctamente'
        ]);
    }

    // Mostrar los productos del vendedor autenticado.
    public function sellerProducts(Request $request)
    {
        $user = $request->user();
        $productos = Product::where('vendedor_id', $user->id)->get();

        return response()->json([
            'status' => 'éxito',
            'productos' => $productos
        ]);
    }

    public function getStock($id)
    {
        $product = Product::findOrFail($id);
        return response()->json([
           'status' => 'éxito',
            'stock' => $product->stock
        ]);
    }

}
