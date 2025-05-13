<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('metodos_pago', function (Blueprint $table) {
            // Targeta de crèdit
            $table->unsignedBigInteger('cvv')->nullable()->after('nombre_titular');

            // PayPal
            $table->string('email_paypal')->nullable()->after('fecha_expiracion');

            // Transferència bancària
            $table->string('iban')->nullable()->after('email_paypal');
            $table->string('nombre_banco')->nullable()->after('iban');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('metodos_pago', function (Blueprint $table) {
            $table->dropColumn('cvv');
            $table->dropColumn('email_paypal');
            $table->dropColumn('iban');
            $table->dropColumn('nombre_banco');
        });
    }
};