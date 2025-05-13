<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class PaymentMethod extends Model
{
    use HasFactory;

    /**
     * La taula associada amb el model.
     */
    protected $table = 'metodos_pago';  // Changed from metodos_pago to metodo_pago

    /**
     * Els atributs que es poden assignar massivament.
     */
    protected $fillable = [
        'user_id',
        'tipo',
        'numero_tarjeta',
        'nombre_titular',
        'cvv',
        'fecha_expiracion',
        'email_paypal',
        'iban',
        'nombre_banco',
        'es_predeterminado'
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

    public function setCardNumberAttribute($value)
    {
        $this->attributes['card_number'] = encrypt($value);
    }

    public function getCardNumberAttribute($value)
    {
        return decrypt($value);
    }

    public function setCvvAttribute($value)
    {
        // Store the CVV as a plain value without encryption
        // since it's defined as an integer in the database
        $this->attributes['cvv'] = $value;
    }

    public function getCvvAttribute($value)
    {
        // Return the value directly
        return $value;
    }

    // Mutator per encriptar el número de targeta
    public function setNumTarjetaAttribute($value)
    {
        $this->attributes['num_tarjeta'] = $value ? Crypt::encryptString($value) : null;
    }

    // Accessor per desencriptar el número de targeta
    public function getNumTarjetaAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    // Mutator per encriptar el codi de validació
    public function setCodiValidacioAttribute($value)
    {
        $this->attributes['codi_validacio'] = $value ? Crypt::encryptString($value) : null;
    }

    // Accessor per desencriptar el codi de validació
    public function getCodiValidacioAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }
}
