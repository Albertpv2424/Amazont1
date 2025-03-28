<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    /**
     * La taula associada amb el model.
     */
    protected $table = 'valoraciones';

    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'producto_id',
        'user_id',
        'puntuacion'
    ];

    /**
     * Obtenir el producte associat a la valoració.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'producto_id', 'id_prod');
    }

    /**
     * Obtenir l'usuari que va fer la valoració.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}