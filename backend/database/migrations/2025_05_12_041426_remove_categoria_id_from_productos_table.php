<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('productos', function (Blueprint $table) {
            // First drop the foreign key constraint
            $table->dropForeign(['categoria_id']);
            // Then drop the column
            $table->dropColumn('categoria_id');
        });
    }

    public function down()
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->foreign('categoria_id')->references('id_cat')->on('categorias')->onDelete('cascade');
        });
    }
};
