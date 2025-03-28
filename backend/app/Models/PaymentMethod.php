<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    /**
     * La taula associada amb el model.
     */
    protected $table = 'metodos_pago';

    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'user_id',
        'tipo',
        'numero',
        'titular',
        'fecha_expiracion'
    ];

    /**
     * Els atributs que han de ser ocults per a les arrays.
     */
    protected $hidden = [
        'numero'
    ];

    /**
     * Obtenir l'usuari propietari del mètode de pagament.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir les comandes que han utilitzat aquest mètode de pagament.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}