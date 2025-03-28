<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    
    /**
     * La taula associada amb el model.
     */
    protected $table = 'categorias';
    
    /**
     * La clau primària del model.
     */
    protected $primaryKey = 'id_cat';
    
    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'nombre',
        'descripcion',
    ];
    
    /**
     * Obtenir els productes de la categoria.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id_cat');
    }
}