<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $table = 'carrito_productos';

    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad',
        'precio'
    ];

    /**
     * Obtenir el carrito al qual pertany aquest element.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class, 'carrito_id', 'id');
    }

    /**
     * Obtenir el producte d'aquest element del carrito.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'producto_id', 'id_prod');
    }
}