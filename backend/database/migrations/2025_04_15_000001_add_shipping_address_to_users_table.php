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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'direccion')) {
                $table->string('direccion')->nullable();
            }
            if (!Schema::hasColumn('users', 'ciudad')) {
                $table->string('ciudad')->nullable();
            }
            if (!Schema::hasColumn('users', 'codigo_postal')) {
                $table->string('codigo_postal')->nullable();
            }
            if (!Schema::hasColumn('users', 'provincia')) {
                $table->string('provincia')->nullable();
            }
            if (!Schema::hasColumn('users', 'pais')) {
                $table->string('pais')->nullable()->default('España');
            }
            if (!Schema::hasColumn('users', 'telefono')) {
                $table->string('telefono')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'direccion',
                'ciudad',
                'codigo_postal',
                'provincia',
                'pais',
                'telefono'
            ]);
        });
    }
};