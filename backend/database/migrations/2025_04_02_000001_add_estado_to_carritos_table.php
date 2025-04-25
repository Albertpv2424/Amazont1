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
        Schema::table('carritos', function (Blueprint $table) {
            if (!Schema::hasColumn('carritos', 'estado')) {
                $table->string('estado')->default('actiu')->after('total');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carritos', function (Blueprint $table) {
            if (Schema::hasColumn('carritos', 'estado')) {
                $table->dropColumn('estado');
            }
        });
    }
};