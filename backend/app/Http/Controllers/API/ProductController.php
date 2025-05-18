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
            // Crear un array amb les dades del producte
            $productData = $request->except('categorias');
            
            // Obtenir l'usuari autenticat i assignar el seu ID
            $user = auth()->user();
            
            if ($user) {
                $productData['user_id'] = $user->id;
            } else {
                return response()->json([
                    'status' => 'error',
                    'mensaje' => 'No s\'ha pogut identificar l\'usuari. Assegureu-vos d\'estar autenticat.'
                ], 401);
            }
            
            // Crear el producte amb les dades actualitzades
            $producto = Product::create($productData);
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
        
        // Verificar que el usuario actual es el propietario del producto
        if ($request->user()->id !== $producto->user_id && $request->user()->rol !== 'admin') {
            return response()->json([
                'status' => 'error',
                'mensaje' => 'No tienes permiso para editar este producto'
            ], 403);
        }

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

        // Només actualitzem els camps que s'han enviat en la petició
        $fieldsToUpdate = $request->only([
            'nombre', 'descricion', 'precio', 'stock', 
            'rebajas', 'precio_rebajado', 'categoria_id'
        ]);
        
        $producto->update($fieldsToUpdate);

        return response()->json([
            'status' => 'éxito',
            'mensaje' => 'Producto actualizado correctamente',
            'producto' => $producto
        ]);
    }

    // Eliminar un producto específico.
    public function destroy(Request $request, $id)
    {
        $producto = Product::findOrFail($id);
        
        // Verificar que el usuario actual es el propietario del producto
        if ($request->user()->id !== $producto->user_id && $request->user()->rol !== 'admin') {
            return response()->json([
                'status' => 'error',
                'mensaje' => 'No tienes permiso para eliminar este producto'
            ], 403);
        }
        
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
        $productos = Product::where('user_id', $user->id)->with('categorias')->get();
        
        return response()->json([
            'status' => 'success',
            'productos' => $productos
        ]);
    }

    public function sellerStatistics(Request $request)
    {
        $user = $request->user();
        
        // Obtenir productes del venedor
        $productos = Product::where('user_id', $user->id)->get();
        
        // Obtenir comandes que contenen productes del venedor
        $productIds = $productos->pluck('id_prod')->toArray();
        
        // Obtenir ítems de comandes que contenen productes del venedor
        $orderItems = \App\Models\OrderItem::whereIn('producto_id', $productIds)->get();
        
        // Calcular vendes totals
        $ventasTotales = $orderItems->sum(function($item) {
            return $item->precio * $item->cantidad;
        });
        
        // Calcular productes venuts
        $productosVendidos = $orderItems->sum('cantidad');
        
        // Calcular comandes completades (comandes úniques)
        $pedidosCompletados = $orderItems->pluck('pedido_id')->unique()->count();
        
        // Calcular valoració mitjana
        $valoracionMedia = \App\Models\Rating::whereIn('producto_id', $productIds)->avg('puntuacion') ?? 0;
        
        // Productes amb estoc baix (menys de 10 unitats)
        $productosBajoStock = $productos->filter(function($producto) {
            return $producto->stock < 10;
        })->map(function($producto) {
            return [
                'nombre' => $producto->nombre,
                'stock' => $producto->stock
            ];
        })->values()->toArray();
        
        // Productes més populars
        $productosPopulares = [];
        foreach ($productIds as $productId) {
            $items = $orderItems->where('producto_id', $productId);
            if ($items->count() > 0) {
                $producto = Product::find($productId);
                $unidades = $items->sum('cantidad');
                $ingresos = $items->sum(function($item) {
                    return $item->precio * $item->cantidad;
                });
                
                $productosPopulares[] = [
                    'nombre' => $producto->nombre,
                    'unidades' => $unidades,
                    'ingresos' => $ingresos
                ];
            }
        }
        
        // Ordenar per unitats venudes (descendent)
        usort($productosPopulares, function($a, $b) {
            return $b['unidades'] - $a['unidades'];
        });
        
        // Limitar a 5 productes
        $productosPopulares = array_slice($productosPopulares, 0, 5);
        
        // Categories més utilitzades
        $categoriasMasUsadas = [];
        $categoriasCount = [];
        
        foreach ($productos as $producto) {
            foreach ($producto->categorias as $categoria) {
                $catId = $categoria->id_cat;
                
                if (!isset($categoriasCount[$catId])) {
                    $categoriasCount[$catId] = [
                        'nombre' => $categoria->nombre,
                        'totalProductos' => 1,
                        'ventasTotales' => 0
                    ];
                } else {
                    $categoriasCount[$catId]['totalProductos']++;
                }
                
                // Sumar vendes per categoria
                $productItems = $orderItems->where('producto_id', $producto->id_prod);
                $ventasProducto = $productItems->sum(function($item) {
                    return $item->precio * $item->cantidad;
                });
                
                $categoriasCount[$catId]['ventasTotales'] += $ventasProducto;
            }
        }
        
        // Convertir a array i ordenar per vendes totals
        foreach ($categoriasCount as $categoria) {
            $categoriasMasUsadas[] = $categoria;
        }
        
        usort($categoriasMasUsadas, function($a, $b) {
            return $b['ventasTotales'] - $a['ventasTotales'];
        });
        
        // Limitar a 5 categories
        $categoriasMasUsadas = array_slice($categoriasMasUsadas, 0, 5);
        
        $estadisticas = [
            'ventasTotales' => $ventasTotales,
            'productosVendidos' => $productosVendidos,
            'pedidosCompletados' => $pedidosCompletados,
            'valoracionMedia' => $valoracionMedia,
            'productosPopulares' => $productosPopulares,
            'productosBajoStock' => $productosBajoStock,
            'categoriasMasUsadas' => $categoriasMasUsadas
        ];
        
        return response()->json([
            'status' => 'success',
            'estadisticas' => $estadisticas
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
    
    public function getownproducts(Request $request)
    {
        $user = $request->user();
        $productos = Product::where('user_id', $user->id)->with('categorias')->get();

        return response()->json([
           'status' =>'success',
            'productos' => $productos
        ]);
    }
}
