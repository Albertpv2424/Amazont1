<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'user_id',
        'estado',
        'total',
        'metodo_pago_id'  // Changed from payment_method_id to match controller and relationship
    ];

    /**
     * Obtenir l'usuari que va fer la comanda.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir els elements de la comanda.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'pedido_id', 'id');
    }

    /**
     * Obtenir el mètode de pagament utilitzat.
     */
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'metodo_pago_id', 'id');
    }
}