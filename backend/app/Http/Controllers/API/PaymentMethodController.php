<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of all payment methods.
     */
    public function index()
    {
        $user = Auth::user();
        $paymentMethods = PaymentMethod::where('user_id', $user->id)->get();
        
        return response()->json([
            'status' => 'success',
            'payment_methods' => $paymentMethods
        ]);
    }
    
    /**
     * Emmagatzemar un nou mètode de pagament.
    */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tipo' => 'required|string|in:targeta,paypal,transferencia',
            // Targeta de crèdit
            'num_tarjeta' => 'required_if:tipo,targeta|nullable|string|max:16',
            'nombre' => 'required_if:tipo,targeta|nullable|string|max:255',
            'fecha_caducidad' => 'required_if:tipo,targeta|nullable|string|max:7',
            'cvv' => 'required_if:tipo,targeta|nullable|string|max:4',
            // PayPal
            'email_paypal' => 'required_if:tipo,paypal|nullable|email|max:255',
            // Transferència bancària
            'iban' => 'required_if:tipo,transferencia|nullable|string|max:34',
            'bank_name' => 'required_if:tipo,transferencia|nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        $isFirstPaymentMethod = $user->paymentMethods()->count() === 0;
        $shouldBeDefault = $isFirstPaymentMethod || $request->es_predeterminado;
    
        if ($shouldBeDefault) {
            $user->paymentMethods()->update(['es_predeterminado' => false]);
        }
    
        // Guardar segons el tipus
        $data = [
            'tipo' => $request->tipo,
            'es_predeterminado' => $shouldBeDefault,
            'user_id' => $user->id,
        ];

        if ($request->tipo === 'targeta') {
            $data['numero_tarjeta'] = $request->num_tarjeta;
            $data['nombre_titular'] = $request->nombre;
            $data['fecha_expiracion'] = $request->fecha_caducidad;
            $data['cvv'] = $request->cvv;
        } elseif ($request->tipo === 'paypal') {
            $data['email_paypal'] = $request->email_paypal;
        } elseif ($request->tipo === 'transferencia') {
            $data['iban'] = $request->iban;
            $data['nombre_banco'] = $request->bank_name;
        }

        $paymentMethod = $user->paymentMethods()->create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment method added successfully',
            'payment_method' => $paymentMethod,
        ], 201);
    }

    /**
     * Actualitzar un mètode de pagament específic.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'string|in:credit_card,paypal,bank_transfer',
            // Targeta de crèdit
            'card_number' => 'required_if:type,credit_card|nullable|string|max:16',
            'card_holder_name' => 'required_if:type,credit_card|nullable|string|max:255',
            'expiration_date' => 'required_if:type,credit_card|nullable|string|max:7',
            'cvv' => 'required_if:type,credit_card|nullable|string|max:4',
            // PayPal
            'email_paypal' => 'required_if:type,paypal|nullable|email|max:255',
            // Transferència bancària
            'iban' => 'required_if:type,bank_transfer|nullable|string|max:34',
            'bank_name' => 'required_if:type,bank_transfer|nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        $paymentMethod = $user->paymentMethods()->findOrFail($id);

        if ($request->is_default) {
            $user->paymentMethods()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $data = [];
        if ($request->has('type')) {
            $data['type'] = $request->type;
        }
        if ($request->tipo === 'credit_card') {
            if ($request->has('card_number')) $data['card_number'] = $request->card_number;
            if ($request->has('card_holder_name')) $data['card_holder_name'] = $request->card_holder_name;
            if ($request->has('expiration_date')) $data['expiration_date'] = $request->expiration_date;
            if ($request->has('cvv')) $data['cvv'] = $request->cvv;
            // Netejar camps d'altres tipus
            $data['email_paypal'] = null;
            $data['iban'] = null;
            $data['bank_name'] = null;
        } elseif ($request->tipo === 'paypal') {
            if ($request->has('email_paypal')) $data['email_paypal'] = $request->email_paypal;
            // Netejar camps d'altres tipus
            $data['card_number'] = null;
            $data['card_holder_name'] = null;
            $data['expiration_date'] = null;
            $data['cvv'] = null;
            $data['iban'] = null;
            $data['bank_name'] = null;
        } elseif ($request->tipo === 'bank_transfer') {
            if ($request->has('iban')) $data['iban'] = $request->iban;
            if ($request->has('bank_name')) $data['bank_name'] = $request->bank_name;
            // Netejar camps d'altres tipus
            $data['card_number'] = null;
            $data['card_holder_name'] = null;
            $data['expiration_date'] = null;
            $data['cvv'] = null;
            $data['email_paypal'] = null;
        }
        if ($request->has('is_default')) {
            $data['is_default'] = $request->is_default;
        }

        $paymentMethod->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment method updated successfully',
            'payment_method' => $paymentMethod,
        ]);
    }

    /**
     * Eliminar un mètode de pagament específic.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $paymentMethod = $user->paymentMethods()->findOrFail($id);
        $paymentMethod->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Payment method deleted successfully',
        ]);
    }
}