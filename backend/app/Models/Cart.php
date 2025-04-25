<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'carritos';

    protected $fillable = [
        'user_id',
        'total'
    ];

    /**
     * Obtenir l'usuari propietari del carrito.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir els elements del carrito.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'carrito_id', 'id');
    }
}