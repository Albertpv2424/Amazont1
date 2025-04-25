<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Rating;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Mostrar opinions i valoracions d'un producte.
     */
    /**
     * Obtener las opiniones de un producto.
     */
    public function getProductReviews($productId)
    {
        $reviews = Review::with('user')
            ->where('producto_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'status' => 'success',
            'reviews' => $reviews
        ]);
    }

    /**
     * Obtener las valoraciones de un producto.
     */
    public function getProductRatings($productId)
    {
        $ratings = Rating::with('user')
            ->where('producto_id', $productId)
            ->get();
        
        $averageRating = $ratings->avg('puntuacion') ?? 0;
        
        return response()->json([
            'status' => 'success',
            'ratings' => $ratings,
            'average_rating' => $averageRating,
            'ratings_count' => $ratings->count()
        ]);
    }

    /**
     * Crear una nova opinió.
     */
    public function storeReview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id_prod',
            'titulo' => 'required|string|max:255',
            'comentario' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::create([
            'producto_id' => $request->producto_id,
            'user_id' => Auth::id(),
            'titulo' => $request->titulo,
            'comentario' => $request->comentario
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Opinió creada correctament',
            'review' => $review
        ], 201);
    }

    /**
     * Crear una nova valoració.
     */
    public function storeRating(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id_prod',
            'puntuacion' => 'required|integer|between:1,5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $rating = Rating::updateOrCreate(
            [
                'producto_id' => $request->producto_id,
                'user_id' => Auth::id()
            ],
            ['puntuacion' => $request->puntuacion]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Valoració creada correctament',
            'rating' => $rating
        ], 201);
    }
}