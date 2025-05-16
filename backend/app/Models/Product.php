<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'productos'; // Changed from 'productos' to 'products'
    
    protected $primaryKey = 'id_prod';
    
    protected $fillable = [
        'nombre',
        'descripcion',  
        'precio',        
        'stock',
        'categoria_id',  
        'imagen',
        'on_sale',      
        'sale_price',
        'user_id'       // Afegim aquest camp
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id_cat');  // Corregido de 'categoria_id' a 'category_id'
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'id_prod');
    }

    /**
     * Obtenir les opinions del producte.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id', 'id_prod');
    }

    /**
     * Obtenir les valoracions del producte.
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'product_id', 'id_prod');
    }

    /**
     * Obtenir la valoració mitjana del producte.
     */
    public function getAverageRatingAttribute()
    {
        return $this->ratings()->avg('puntuacion') ?? 0;
    }

    public function categorias()
    {
        return $this->belongsToMany(Category::class, 'categoria_producto', 'producto_id', 'categoria_id');
    }
}
