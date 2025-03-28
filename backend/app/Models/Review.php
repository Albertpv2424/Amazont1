<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * La taula associada amb el model.
     */
    protected $table = 'opiniones';

    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'producto_id',
        'user_id',
        'titulo',
        'comentario'
    ];

    /**
     * Obtenir el producte associat a l'opinió.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'producto_id', 'id_prod');
    }

    /**
     * Obtenir l'usuari que va fer l'opinió.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}