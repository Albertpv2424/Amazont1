<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'productos';
    
    protected $primaryKey = 'id_prod';
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'category_id',
        'imagen',
        'rebajas',
        'precio_rebajado'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id_cat');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'producto_id', 'id_prod');
    }

    /**
     * Obtenir les opinions del producte.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'producto_id', 'id_prod');
    }

    /**
     * Obtenir les valoracions del producte.
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'producto_id', 'id_prod');
    }

    /**
     * Obtenir la valoració mitjana del producte.
     */
    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('puntuacion') ?? 0;
    }
}